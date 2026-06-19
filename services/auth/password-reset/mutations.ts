import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import {
    AuthMessageResponse,
    ForgotPasswordPayload,
    ResetPasswordPayload,
} from '@/dtos/AuthDto';
import { forgotPasswordApi, resetPasswordApi } from '.';

type ApiErrorResponse = {
    message?: string | string[];
};

const getApiErrorMessage = (
    error: AxiosError<ApiErrorResponse>,
    fallback: string,
) => {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
        return message.join('\n');
    }

    return message || fallback;
};

export const useForgotPasswordMutation = () =>
    useMutation<
        AuthMessageResponse,
        AxiosError<ApiErrorResponse>,
        ForgotPasswordPayload
    >({
        mutationFn: (payload) =>
            forgotPasswordApi
                .post<AuthMessageResponse>('', payload)
                .then((res) => res.data),
        onSuccess: (data) => {
            toast.success(
                data.message ||
                    'Se o e-mail estiver cadastrado, enviaremos as instruções para recuperação de senha.',
            );
        },
        onError: (error) => {
            toast.error(
                getApiErrorMessage(
                    error,
                    'Erro ao solicitar recuperação de senha.',
                ),
            );
        },
    });

export const useResetPasswordMutation = () =>
    useMutation<
        AuthMessageResponse,
        AxiosError<ApiErrorResponse>,
        ResetPasswordPayload
    >({
        mutationFn: (payload) =>
            resetPasswordApi
                .post<AuthMessageResponse>('', payload)
                .then((res) => res.data),
        onSuccess: (data) => {
            toast.success(data.message || 'Senha redefinida com sucesso.');
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, 'Erro ao redefinir senha.'));
        },
    });
