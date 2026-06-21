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

// ECharts/zrender does not support 8-digit hex (#rrggbbaa) in gradient color stops.
// Always use rgba() for colors with alpha.
function hexToRgba(hex: string, alpha: number): string {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!m) return `rgba(0,0,0,${alpha})`;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${alpha})`;
}

export const getDashboardChartTheme = () => {
    const tertiary = readCssVariable('--tertiary-color', '#673ab7');
    const primary = readCssVariable('--primary-color', '#ffd100');

    return {
        primary,
        secondary: readCssVariable('--secondary-color', '#ef4686'),
        tertiary,
        info: readCssVariable('--info', '#1f9bd1'),
        surface: readCssVariable('--surface', '#ffffff'),
        textPrimary: readCssVariable('--text-primary', '#1a1a1a'),
        textSecondary: readCssVariable('--text-secondary', '#6b7280'),
        grid: readCssVariable('--chart-grid', 'rgba(26, 26, 26, 0.1)'),
        track: readCssVariable('--chart-track', 'rgba(26, 26, 26, 0.08)'),
        // Pre-computed rgba variants for use in ECharts gradient color stops
        tertiaryAlpha38: hexToRgba(tertiary, 0.38),
        primaryAlpha08: hexToRgba(primary, 0.08),
    };
};
