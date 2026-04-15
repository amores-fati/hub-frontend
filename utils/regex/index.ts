/**
 * Regex para data no formato DD/MM/AAAA
 * @param value
 * @returns
 */
export function dateRegex(value: string | null) {
    if (value === null) {
        return value;
    }
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
        .slice(0, 10);
}

export function cpfRegex(value: string | null) {
    if (value === null) {
        return value;
    }
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
        .slice(0, 14);
}

export function cnpjRegex(value: string | null) {
    if (value === null) {
        return value;
    }
    return value
        .replace(/\D/g, '')
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
}

export function phoneNumberRegex(value: string | null) {
    if (value === null) {
        return value;
    }
    let size = 15;
    if (Number(value[3]) === 3) {
        size = 14;
    }
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{4})/, '$1-$2')
        .slice(0, size);
}

/**
 * Regex para valores inteiros e positivos
 * @param value
 * @returns
 */
export function integerRegex(value: string | null) {
    if (value === null) {
        return value;
    }

    return value.replace(/\D+/g, '');
}

/**
 * Regex para valores decimais e positivos
 * @param value
 * @returns
 */
export function decimalRegex(value: string | null) {
    if (value === null) {
        return value;
    }

    return value.replace(/[^0-9.]/g, '');
}

/**
 * Regex para valores decimais (positivos ou negativos)
 * @param value
 * @returns
 */
export function numberRegex(value: string | null) {
    if (value === null) {
        return value;
    }

    // Preserva o sinal negativo apenas no início
    const isNegative = value.startsWith('-');

    // Remove tudo exceto dígitos e ponto
    let cleaned = value.replace(/[^0-9.]/g, '');

    // Garante apenas um ponto decimal
    const parts = cleaned.split('.');
    if (parts.length > 1) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    // Reaplica o sinal negativo se necessário
    if (isNegative) {
        cleaned = '-' + cleaned;
    }

    return cleaned;
}
