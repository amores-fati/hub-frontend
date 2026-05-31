import { EnrollmentDto } from '@/dtos/CourseDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { coursesApi } from '.';
import { queryClient } from '@/services/query-client';
import { CreateAdminCourseDto } from '@/dtos/AdminCourseDto';

const handleEnrollmentError = (data: AxiosError<{ message?: string }>) => {
    if (data.response?.status === 409) {
        toast.error(
            data.response.data?.message ??
                'Você já possui um vínculo com este curso',
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
            void queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.ENROLLMENTS],
            });
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
            void queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.ENROLLMENTS],
            });
        },
        onError: handleEnrollmentError,
    });
};

export const useCreateCourseMutation = () => {
    return useMutation({
        mutationFn: (form: CreateAdminCourseDto) =>
            coursesApi.post('/', form).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.COURSES],
            });
            toast.success('Curso criado com sucesso');
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
            toast.error('Erro ao criar curso');
        },
    });
};

export const useUpdateCourseMutation = (courseId: string) => {
    return useMutation({
        mutationFn: ({ form }: { form: CreateAdminCourseDto }) =>
            coursesApi.put(`/${courseId}`, form).then((res) => res.data),
        onSuccess: () => {
            void Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.COURSES],
                }),
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.COURSES, courseId],
                }),
            ]);
            toast.success('Curso atualizado com sucesso');
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
            toast.error('Erro ao criar curso');
        },
    });
};
