export const formatMonthLabel = (month: string) =>
    new Intl.DateTimeFormat('pt-BR', {
        month: 'short',
        year: '2-digit',
    }).format(new Date(`${month}-01T00:00:00`));

export const formatDateLabel = (value: string) =>
    new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(`${value}T00:00:00`));

export const formatPercentage = (value: number) => `${value.toFixed(0)}%`;
