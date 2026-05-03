import { EnrollmentDto } from '@/dtos/CourseDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { coursesApi } from '.';

const handleEnrollmentError = (data: AxiosError<{ message?: string }>) => {
    if (data.response?.status === 409) {
        toast.error(
            data.response.data?.message ?? 'Você já possui um vínculo com este curso',
        );
        return;
    }
    if (data.response?.status === 404) {
        toast.error('Curso não encontrado');
        return;
    }
    toast.error('Erro ao processar a solicitação');
};

export const useEnrollInCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (courseId: string) =>
            coursesApi
                .post(`/${courseId}/enroll`)
                .then((res) => res.data as EnrollmentDto),
        onSuccess: () => {
            toast.success('Inscrição realizada com sucesso');
            void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENROLLMENTS] });
        },
        onError: handleEnrollmentError,
    });
};

export const useRegisterInterest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (courseId: string) =>
            coursesApi
                .post(`/${courseId}/interest`)
                .then((res) => res.data as EnrollmentDto),
        onSuccess: () => {
            toast.success('Interesse registrado com sucesso');
            void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENROLLMENTS] });
        },
        onError: handleEnrollmentError,
    });
};
