'use client';

const readCssVariable = (name: string, fallback: string) => {
    if (typeof window === 'undefined') {
        return fallback;
    }

    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();

    return value || fallback;
};

export const getDashboardChartTheme = () => ({
    primary: readCssVariable('--primary-color', '#f4a300'),
    secondary: readCssVariable('--secondary-color', '#ff5c8a'),
    tertiary: readCssVariable('--tertiary-color', '#6c4dd9'),
    info: readCssVariable('--info', '#1f9bd1'),
    surface: readCssVariable('--surface', '#ffffff'),
    textPrimary: readCssVariable('--text-primary', '#1a1a1a'),
    textSecondary: readCssVariable('--text-secondary', '#6b7280'),
    grid: 'rgba(26, 26, 26, 0.1)',
    track: 'rgba(26, 26, 26, 0.08)',
});
