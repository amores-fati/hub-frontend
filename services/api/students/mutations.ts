import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { studentsApi } from '.';
import { ResponseDto } from '@/dtos/ResponseDto';
import {
    StudentProfile,
    UpdateStudentProfilePayload,
} from '@/dtos/StudentProfileDto';
import {
    StudentRegisterPayload,
    StudentRegisterResponse,
} from '@/dtos/StudentDto';
import { formatDate } from '@/utils/shared-functions/date';
import { queryClient } from '@/services/query-client';
import QUERY_KEYS from '@/utils/contants/queries';

export const useStudentRegister = (payload: StudentRegisterPayload) =>
    useMutation({
        mutationFn: () =>
            studentsApi
                .post('', {
                    email: payload.email,
                    password: payload.password,
                    fullName: payload.fullName,
                    cpf: payload.cpf,
                    socialName: payload.socialName,
                    birthDate: formatDate(payload.birthDate),
                    gender: payload.gender,
                    race: payload.race,
                    education: payload.scholarship,
                    courseName: payload.course,
                    institution: payload.institution,
                    activityArea: payload.workField,
                    hasProgrammingExperience: payload.hasWorkExperience,
                    motivation: payload.whyJoinFatiLab,
                    howHeard: payload.whomInformed,
                    hasComputer: payload.hasOwnComputer,
                    hasInternet: payload.hasInternetAccess,
                    committedToParticipate: payload.compromisedToClasses,
                    familyIncome: payload.familyIncome,
                    householdSize: payload.peopleInHouse
                        ? Number(payload.peopleInHouse)
                        : undefined,
                    contact: {
                        phone: payload.phoneNumber,
                        neighbourhood: payload.neighbourhood,
                        state: payload.state,
                        city: payload.city,
                        address: payload.address,
                        cep: payload.cep,
                        complement: payload.complement,
                    },
                    disability: {
                        hasDisability: payload.hasAccessability,
                        type: payload.typeAccessability,
                    },
                    socialBenefits: [
                        {
                            benefit: payload.socialBenefit || 'NONE',
                        },
                    ],
                })
                .then((res: ResponseDto<StudentRegisterResponse>) => res.data),
        onSuccess: (_) => {
            toast.success('Usuário criado com sucesso');
        },
        onError: (data: AxiosError<{ message: string }>) => {
            if (data.response?.status === 400) {
                toast.error('Campo inválido');
                return;
            }
            if (data.response?.status === 409) {
                toast.error(data.response.data.message);
                return;
            }
            toast.error('Erro ao registrar usuário');
        },
    });

export const useUpdateStudentProfile = () =>
    useMutation({
        mutationFn: ({ id, ...payload }: UpdateStudentProfilePayload) =>
            studentsApi
                .patch<StudentProfile>(`/${id}`, payload)
                .then((res) => res.data),
        onSuccess: (student) => {
            queryClient.setQueryData(
                [QUERY_KEYS.STUDENT_PROFILE, student.id],
                student,
            );
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.STUDENT_PROFILE],
            });
            toast.success('Perfil atualizado com sucesso');
        },
    });
