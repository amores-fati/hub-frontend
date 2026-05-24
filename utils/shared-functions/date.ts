export function formatDate(date: string | null) {
    if (!date) return null;

    const splittedDate = date.split('/');
    const year = splittedDate[2];
    const month = splittedDate[1];
    const day = splittedDate[0];

    return `${year}-${month}-${day}`;
}

export function formatDateToBR(date: string | null) {
    if (!date) return null;

    const splittedDate = date.split('T')[0].split('-');
    const year = splittedDate[0];
    const month = splittedDate[1];
    const day = splittedDate[2];

    return `${day}/${month}/${year}`;
}
