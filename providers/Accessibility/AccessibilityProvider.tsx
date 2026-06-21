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
    // Use innerText so hidden elements are ignored
    return el.innerText?.trim() ?? '';
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

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSize] = useState<FontSize>('normal');
    const [highContrast, setHighContrast] = useState(false);
    const [hoverReadEnabled, setHoverReadEnabled] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);

    // Ref para leitura síncrona do valor atual sem precisar de dep no useCallback
    const highContrastRef = useRef(false);

    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastReadElRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    }, []);

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

    // Attach / detach hover listeners based on mode
    useEffect(() => {
        if (!hoverReadEnabled) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!isReadableTarget(target)) return;

            // Skip the accessibility bar
            if (target.closest('[data-a11y-bar]')) return;

            // Don't re-read the same element
            if (target === lastReadElRef.current) return;

            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

            hoverTimerRef.current = setTimeout(() => {
                const text = getReadableText(target);
                if (!text || !window.speechSynthesis) return;

                lastReadElRef.current = target;
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'pt-BR';
                utterance.rate = 0.95;
                window.speechSynthesis.speak(utterance);
            }, 350);
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

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
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
