import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { companiesApi } from '.';
import { ResponseDto } from '@/dtos/ResponseDto';
import {
    CompanyRegisterPayload,
    CompanyRegisterResponse,
} from '@/dtos/CompanyDto';

export const useCompanyRegister = (payload: CompanyRegisterPayload) =>
    useMutation({
        mutationFn: () =>
            companiesApi
                .post('', {
                    email: payload.email,
                    password: payload.password,
                    name: payload.name,
                    cnpj: payload.cnpj,
                    ownerName: payload.ownerName,
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
