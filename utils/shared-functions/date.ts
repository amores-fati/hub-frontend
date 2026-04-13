export function formatDate(date: string | null) {
    if (!date) return null;

    const splittedDate = date.split('/');
    const year = splittedDate[2];
    const month = splittedDate[1];
    const day = splittedDate[0];

    return `${year}-${month}-${day}`;
}
