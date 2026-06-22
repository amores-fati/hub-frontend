'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type FontSize = 'normal' | 'large' | 'larger';

interface AccessibilityContextType {
    fontSize: FontSize;
    highContrast: boolean;
    hoverReadEnabled: boolean;
    speechSupported: boolean;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    toggleHighContrast: () => void;
    toggleHoverRead: () => void;
    reset: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const FONT_SIZES: FontSize[] = ['normal', 'large', 'larger'];

// Elements whose direct text is worth reading on hover
const READABLE_TAGS = new Set([
    'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'SPAN', 'A', 'BUTTON', 'LABEL', 'LI', 'TD', 'TH',
    'CAPTION', 'FIGCAPTION', 'LEGEND', 'DT', 'DD',
]);

function getReadableText(el: HTMLElement): string {
    // Prioriza rótulo acessível; cai para texto visível, placeholder ou alt.
    const aria = el.getAttribute('aria-label');
    if (aria?.trim()) return aria.trim();
    // Use innerText so hidden elements are ignored
    const text = el.innerText?.trim();
    if (text) return text;
    const placeholder = (el as HTMLInputElement).placeholder;
    if (placeholder?.trim()) return placeholder.trim();
    return el.getAttribute('alt')?.trim() ?? '';
}

function isReadableTarget(el: HTMLElement): boolean {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
    if (READABLE_TAGS.has(el.tagName)) return true;
    // Also read divs/sections that have very few child elements and direct text
    const hasDirectText = Array.from(el.childNodes).some(
        n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
    );
    return hasDirectText && el.children.length <= 2;
}

const STORAGE_KEY = 'hub-a11y';

interface StoredSettings {
    fontSize?: FontSize;
    highContrast?: boolean;
    hoverReadEnabled?: boolean;
}

function loadStoredSettings(): StoredSettings {
    if (typeof window === 'undefined') return {};
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as StoredSettings) : {};
    } catch {
        return {};
    }
}

function prefersHighContrast(): boolean {
    return (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-contrast: more)').matches
    );
}

function pickPtBrVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.lang?.toLowerCase().startsWith('pt')) ?? null;
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSize] = useState<FontSize>('normal');
    const [highContrast, setHighContrast] = useState(false);
    const [hoverReadEnabled, setHoverReadEnabled] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Ref para leitura síncrona do valor atual sem precisar de dep no useCallback
    const highContrastRef = useRef(false);

    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastReadElRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    }, []);

    // Carrega as preferências salvas; no primeiro acesso respeita o SO (prefers-contrast)
    useEffect(() => {
        const stored = loadStoredSettings();
        if (stored.fontSize && FONT_SIZES.includes(stored.fontSize)) {
            setFontSize(stored.fontSize);
        }
        if (stored.highContrast ?? prefersHighContrast()) {
            setHighContrast(true);
        }
        if (stored.hoverReadEnabled) {
            setHoverReadEnabled(true);
        }
        setHydrated(true);
    }, []);

    // Persiste as preferências (somente após a hidratação, para não sobrescrever com os defaults)
    useEffect(() => {
        if (!hydrated) return;
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ fontSize, highContrast, hoverReadEnabled }),
            );
        } catch {
            /* localStorage indisponível (modo privado/quota) — ignora */
        }
    }, [hydrated, fontSize, highContrast, hoverReadEnabled]);

    useEffect(() => {
        document.documentElement.setAttribute('data-font-size', fontSize);
    }, [fontSize]);

    useEffect(() => {
        highContrastRef.current = highContrast;
        if (highContrast) {
            document.documentElement.setAttribute('data-contrast', 'high');
        } else {
            document.documentElement.removeAttribute('data-contrast');
        }
    }, [highContrast]);

    const cancelSpeech = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }, []);

    useEffect(() => {
        return () => {
            cancelSpeech();
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        };
    }, [cancelSpeech]);

    // Liga/desliga a leitura por voz: hover do mouse e foco via teclado
    useEffect(() => {
        if (!hoverReadEnabled) return;

        const speak = (target: HTMLElement) => {
            const text = getReadableText(target);
            if (!text || !window.speechSynthesis) return;

            lastReadElRef.current = target;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.95;
            const voice = pickPtBrVoice();
            if (voice) utterance.voice = voice;
            window.speechSynthesis.speak(utterance);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!isReadableTarget(target)) return;

            // Skip the accessibility bar
            if (target.closest('[data-a11y-bar]')) return;

            // Don't re-read the same element
            if (target === lastReadElRef.current) return;

            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = setTimeout(() => speak(target), 350);
        };

        // Foco via teclado (Tab): lê imediatamente, sem o atraso do hover.
        // Não exige isReadableTarget — focar é uma ação explícita do usuário.
        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target || target.closest('[data-a11y-bar]')) return;
            if (target === lastReadElRef.current) return;

            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
            speak(target);
        };

        const handleMouseOut = (e: MouseEvent) => {
            const related = e.relatedTarget as HTMLElement | null;
            // Clear timer if leaving the current element entirely
            if (!related || related !== lastReadElRef.current) {
                if (hoverTimerRef.current) {
                    clearTimeout(hoverTimerRef.current);
                    hoverTimerRef.current = null;
                }
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('focusin', handleFocusIn);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('focusin', handleFocusIn);
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        };
    }, [hoverReadEnabled]);

    const increaseFontSize = useCallback(() => {
        setFontSize(prev => {
            const idx = FONT_SIZES.indexOf(prev);
            return FONT_SIZES[Math.min(idx + 1, FONT_SIZES.length - 1)];
        });
    }, []);

    const decreaseFontSize = useCallback(() => {
        setFontSize(prev => {
            const idx = FONT_SIZES.indexOf(prev);
            return FONT_SIZES[Math.max(idx - 1, 0)];
        });
    }, []);

    const toggleHighContrast = useCallback(() => {
        const next = !highContrastRef.current;
        highContrastRef.current = next;
        if (next) {
            document.documentElement.setAttribute('data-contrast', 'high');
        } else {
            document.documentElement.removeAttribute('data-contrast');
        }
        setHighContrast(next);
    }, []);

    const toggleHoverRead = useCallback(() => {
        setHoverReadEnabled(prev => {
            if (prev) {
                cancelSpeech();
                lastReadElRef.current = null;
            }
            return !prev;
        });
    }, [cancelSpeech]);

    const reset = useCallback(() => {
        highContrastRef.current = false;
        document.documentElement.setAttribute('data-font-size', 'normal');
        document.documentElement.removeAttribute('data-contrast');
        setFontSize('normal');
        setHighContrast(false);
        setHoverReadEnabled(false);
        cancelSpeech();
        lastReadElRef.current = null;
    }, [cancelSpeech]);

    return (
        <AccessibilityContext.Provider
            value={{
                fontSize,
                highContrast,
                hoverReadEnabled,
                speechSupported,
                increaseFontSize,
                decreaseFontSize,
                toggleHighContrast,
                toggleHoverRead,
                reset,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const ctx = useContext(AccessibilityContext);
    if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
    return ctx;
}
