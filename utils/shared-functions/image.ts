const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export function resolveImageUrl(url?: string | null): string | null {
    if (!url) return null;

    if (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('blob:') ||
        url.startsWith('data:')
    ) {
        return url;
    }

    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function readFileAsBase64(
    file: File,
): Promise<{ data: string; mimeType: string }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result !== 'string') {
                reject(new Error('Falha ao ler o arquivo.'));
                return;
            }
            const commaIndex = result.indexOf(',');
            const data = commaIndex >= 0 ? result.slice(commaIndex + 1) : result;
            resolve({ data, mimeType: file.type });
        };
        reader.onerror = () => reject(reader.error ?? new Error('Erro de leitura.'));
        reader.readAsDataURL(file);
    });
}
