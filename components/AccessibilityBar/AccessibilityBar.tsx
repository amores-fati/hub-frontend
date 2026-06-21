'use client';

import Contrast from '@mui/icons-material/Contrast';
import RecordVoiceOver from '@mui/icons-material/RecordVoiceOver';
import RestartAlt from '@mui/icons-material/RestartAlt';
import TextDecrease from '@mui/icons-material/TextDecrease';
import TextIncrease from '@mui/icons-material/TextIncrease';
import VoiceOverOff from '@mui/icons-material/VoiceOverOff';
import { useAccessibility } from '@/providers/Accessibility/AccessibilityProvider';
import styles from './AccessibilityBar.module.scss';

export function AccessibilityBar() {
    const {
        fontSize,
        highContrast,
        hoverReadEnabled,
        speechSupported,
        increaseFontSize,
        decreaseFontSize,
        toggleHighContrast,
        toggleHoverRead,
        reset,
    } = useAccessibility();

    return (
        <div
            className={styles.bar}
            role='region'
            aria-label='Barra de acessibilidade'
            data-a11y-bar
        >
            <span className={styles.label} aria-hidden='true'>
                Acessibilidade
            </span>

            <div className={styles.divider} aria-hidden='true' />

            <div
                className={styles.group}
                role='group'
                aria-label='Tamanho da fonte'
            >
                <button
                    className={styles.btn}
                    onClick={decreaseFontSize}
                    disabled={fontSize === 'normal'}
                    aria-label='Diminuir fonte'
                    title='Diminuir fonte'
                >
                    <TextDecrease fontSize='small' />
                </button>
                <button
                    className={styles.btn}
                    onClick={increaseFontSize}
                    disabled={fontSize === 'larger'}
                    aria-label='Aumentar fonte'
                    title='Aumentar fonte'
                >
                    <TextIncrease fontSize='small' />
                </button>
            </div>

            <div className={styles.divider} aria-hidden='true' />

            <button
                className={`${styles.btn} ${highContrast ? styles.active : ''}`}
                onClick={toggleHighContrast}
                aria-pressed={highContrast}
                aria-label={
                    highContrast
                        ? 'Desativar alto contraste'
                        : 'Ativar alto contraste'
                }
                title='Alto contraste'
            >
                <Contrast fontSize='small' />
                <span>Contraste</span>
            </button>

            {speechSupported && (
                <>
                    <div className={styles.divider} aria-hidden='true' />

                    <button
                        className={`${styles.btn} ${hoverReadEnabled ? styles.active : ''}`}
                        onClick={toggleHoverRead}
                        aria-pressed={hoverReadEnabled}
                        aria-label={
                            hoverReadEnabled
                                ? 'Desativar leitura por hover'
                                : 'Ativar leitura por hover'
                        }
                        title={
                            hoverReadEnabled
                                ? 'Desativar leitura'
                                : 'Leitura ao passar o mouse'
                        }
                    >
                        {hoverReadEnabled ? (
                            <VoiceOverOff fontSize='small' />
                        ) : (
                            <RecordVoiceOver fontSize='small' />
                        )}
                        <span>
                            {hoverReadEnabled ? 'Leitura ativa' : 'Leitura'}
                        </span>
                    </button>
                </>
            )}

            <div className={styles.divider} aria-hidden='true' />

            <button
                className={styles.btn}
                onClick={reset}
                aria-label='Redefinir configurações de acessibilidade'
                title='Redefinir'
            >
                <RestartAlt fontSize='small' />
                <span>Redefinir</span>
            </button>
        </div>
    );
}
