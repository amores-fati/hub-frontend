import { AxiosError, AxiosResponse } from 'axios';
import { coreApi } from '..';
import { useAuth } from '../../../providers/Auth/AuthProvider';
import { createHttpClient } from '../../http-client';

export const examplesApi = createHttpClient('/examples', coreApi);

const { logout } = useAuth();

examplesApi.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: unknown) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
            logout();
        }
        return Promise.reject(
            error instanceof Error ? error : new Error('Unknown error'),
        );
    },
);
