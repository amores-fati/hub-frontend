export const normalizeText = (value: string) =>
    value
        .normalize('NFD')
        .replaceAll(/[\u0300-\u036f]/g, '')
        .trim();

export function cityStateToLocation(city: string | null, state: string | null) {
    if (!city && !state) return 'Não informado';
    if (!city) return state;
    if (!state) return normalizeText(city);
    return `${normalizeText(city)}/${state}`;
}
