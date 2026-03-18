import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { loginApi } from '.';
import { AuthDto, AuthPayload } from '../../../dtos/AuthDto';
import { ResponseDto } from '../../../dtos/ResponseDto';

export const useLoginMutation = (payload: AuthPayload) =>
    useMutation({
        mutationFn: () =>
            loginApi
                .post('', payload)
                .then((res: ResponseDto<AuthDto>) => res.data),
        onError: (data: AxiosError) => {
            if (
                data.response?.status === 403 ||
                data.response?.status === 404
            ) {
                toast.error('Credenciais inválidas. Tente novamente.');
            }
        },
    });
