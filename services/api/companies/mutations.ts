import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { companiesApi } from '.';
import { ResponseDto } from '@/dtos/ResponseDto';
import {
    CompanyProfile,
    CompanyRegisterPayload,
    CompanyRegisterResponse,
    UpdateCompanyProfilePayload,
} from '@/dtos/CompanyDto';
import { queryClient } from '@/services/query-client';
import QUERY_KEYS from '@/utils/contants/queries';

export const useCompanyRegister = (payload: CompanyRegisterPayload) =>
    useMutation({
        mutationFn: () =>
            companiesApi
                .post('', {
                    email: payload.email,
                    password: payload.password,
                    name: payload.name,
                    cnpj: payload.cnpj,
                    responsibleName: payload.ownerName,
                    contact: {
                        phone: payload.phoneNumber,
                        neighbourhood: payload.neighbourhood,
                        state: payload.state,
                        city: payload.city,
                        address: payload.address,
                        cep: payload.cep,
                        complement: payload.complement,
                    },
                })
                .then((res: ResponseDto<CompanyRegisterResponse>) => res.data),
        onSuccess: (_) => {
            toast.success('Usuário empresa criado com sucesso');
        },
        onError: (data: AxiosError) => {
            if (data.response?.status === 400) {
                toast.error('Campo inválido');
                return;
            }
            toast.error('Erro ao registrar empresa');
        },
    });

export const useUpdateCompanyProfile = () =>
    useMutation({
        mutationFn: (payload: UpdateCompanyProfilePayload) =>
            companiesApi
                .put<CompanyProfile>('/me', payload)
                .then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.COMPANY_PROFILE],
            });
            toast.success('Perfil atualizado com sucesso');
        },
        onError: (error: AxiosError<{ message: string }>) => {
            if (error.response?.status === 400) {
                toast.error(
                    'Campo inválido. Confira os dados e tente novamente.',
                );
                return;
            }
            if (error.response?.status === 409) {
                toast.error(error.response.data.message);
                return;
            }
            toast.error('Erro ao atualizar perfil');
        },
    });
