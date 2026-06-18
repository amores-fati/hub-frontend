import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { CreateOrUpdateVacancyDto } from '@/dtos/VacancyDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { queryClient } from '@/services/query-client';
import { companyVacanciesApi } from '.';

export const useCreateVacancy = () =>
    useMutation({
        mutationFn: (payload: CreateOrUpdateVacancyDto) =>
            companyVacanciesApi.post('', payload).then((res) => res.data),
        onSuccess: async () => {
            toast.success('Vaga criada com sucesso.');
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.COMPANY_VACANCIES],
            });
        },
        onError: (error: AxiosError<{ message?: string }> | Error) => {
            if (error instanceof AxiosError && error.response?.status === 400) {
                toast.error('Dados inválidos. Verifique os campos.');
                return;
            }
            if (error instanceof AxiosError && error.response?.status === 404) {
                toast.error('Empresa não encontrada.');
                return;
            }
            toast.error('Não foi possível criar a vaga agora.');
        },
    });

export const useUpdateVacancy = () =>
    useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: CreateOrUpdateVacancyDto;
        }) =>
            companyVacanciesApi.put(`/${id}`, payload).then((res) => res.data),
        onSuccess: async () => {
            toast.success('Vaga atualizada com sucesso.');
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.COMPANY_VACANCIES],
            });
        },
        onError: (error: AxiosError<{ message?: string }> | Error) => {
            if (error instanceof AxiosError && error.response?.status === 404) {
                toast.error('Vaga não encontrada.');
                return;
            }
            if (error instanceof AxiosError && error.response?.status === 403) {
                toast.error('Você não tem permissão para editar esta vaga.');
                return;
            }
            if (error instanceof AxiosError && error.response?.status === 400) {
                toast.error('Dados inválidos. Verifique os campos.');
                return;
            }
            toast.error('Não foi possível atualizar a vaga agora.');
        },
    });

export const useDeleteVacancy = () =>
    useMutation({
        mutationFn: (id: string) =>
            companyVacanciesApi.delete(`/${id}`).then((res) => res.data),
        onSuccess: async () => {
            toast.success('Vaga excluída com sucesso.');
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.COMPANY_VACANCIES],
            });
        },
        onError: (error: AxiosError<{ message?: string }> | Error) => {
            if (error instanceof AxiosError && error.response?.status === 404) {
                toast.error('Vaga não encontrada ou já excluída.');
                return;
            }
            if (error instanceof AxiosError && error.response?.status === 403) {
                toast.error('Você não tem permissão para excluir esta vaga.');
                return;
            }
            toast.error('Não foi possível excluir a vaga agora.');
        },
    });
