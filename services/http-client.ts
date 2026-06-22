import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from 'axios';

import { getStoreAuthToken, removeStoreAuthToken } from '@/utils/stores/auth';

export type HttpClient = {
    url: string;
} & AxiosInstance;

export const createHttpClient = (url: string, parent?: HttpClient) => {
    const baseUrl = parent ? parent.url + url : url;

    const httpClient = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
        },
        paramsSerializer: { dots: true },
    }) as HttpClient;
    httpClient.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = getStoreAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
    );

    // Sessão expirada/inválida: ao receber 401, limpa o token e redireciona
    // para o login (evita "logado fantasma"). Não redireciona se já no /login.
    httpClient.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (
                error.response?.status === 401 &&
                typeof window !== 'undefined'
            ) {
                removeStoreAuthToken();
                if (window.location.pathname !== '/login') {
                    window.location.assign('/login');
                }
            }
            return Promise.reject(error);
        },
    );

    httpClient.url = baseUrl;

    return httpClient;
};
