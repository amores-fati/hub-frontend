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
