import QUERY_KEYS from '@/utils/contants/queries';
import { queryClient } from '@/services/query-client';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import qs from 'qs';

import { adminStudentsApi } from '.';

export const useDeleteAdminStudents = (studentIds: string[]) =>
    useMutation({
        mutationFn: () =>
            adminStudentsApi
                .delete<unknown>('', {
                    data: { ids: studentIds },
                    paramsSerializer: (params) =>
                        qs.stringify(params, {
                            arrayFormat: 'repeat',
                        }),
                })
                .then((res) => res.data),
        onSuccess: async (res: unknown) => {
            toast.success(
                studentIds.length > 1
                    ? 'Alunos excluidos com sucesso.'
                    : 'Aluno excluido com sucesso.',
            );
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.ADMIN_STUDENTS],
            });

            return res;
        },
        onError: async (error: AxiosError<{ message?: string }> | Error) => {
            if (error instanceof Error && error.name === 'NOT_FOUND') {
                toast.error('Aluno não encontrado ou já excluído.');
                return;
            }

            if (error instanceof AxiosError && error.response?.status === 404) {
                toast.error('Aluno não encontrado ou já excluído.');
                return;
            }

            toast.error('Não foi possível excluir o aluno agora.');
        },
    });
