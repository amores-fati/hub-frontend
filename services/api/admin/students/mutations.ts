import QUERY_KEYS from '@/utils/contants/queries';
import { queryClient } from '@/services/query-client';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { adminStudentsApi } from '.';
import { deleteAdminStudentsMock } from './mock';

const USE_MOCK_ADMIN_STUDENTS = true;

const deleteAdminStudents = async (studentIds: string[]) => {
    if (USE_MOCK_ADMIN_STUDENTS) {
        return deleteAdminStudentsMock(studentIds);
    }

    return Promise.all(
        studentIds.map((studentId) => adminStudentsApi.delete(`/${studentId}`)),
    );
};

export const useDeleteAdminStudents = () =>
    useMutation({
        mutationFn: deleteAdminStudents,
        onSuccess: (_, studentIds) => {
            toast.success(
                studentIds.length > 1
                    ? 'Alunos excluidos com sucesso.'
                    : 'Aluno excluido com sucesso.',
            );
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.ADMIN_STUDENTS],
            });
        },
        onError: (error: AxiosError<{ message?: string }> | Error) => {
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
