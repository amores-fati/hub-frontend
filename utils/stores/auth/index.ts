import { STORE_KEYS } from '@/utils/contants/Stores';

const getStoreAuthToken = (): string | null => {
    return (
        localStorage.getItem(STORE_KEYS.token) ||
        sessionStorage.getItem(STORE_KEYS.token)
    );
};

const setStoreAuthToken = (
    token: string,
    rememberMe: boolean = false,
): void => {
    if (rememberMe) {
        localStorage.setItem(STORE_KEYS.token, token);
    } else {
        sessionStorage.setItem(STORE_KEYS.token, token);
    }
};

const removeStoreAuthToken = (): void => {
    localStorage.removeItem(STORE_KEYS.token);
    sessionStorage.removeItem(STORE_KEYS.token);
};

export { getStoreAuthToken, removeStoreAuthToken, setStoreAuthToken };
