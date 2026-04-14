import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { studentsApi } from '.';
import { ResponseDto } from '@/dtos/ResponseDto';
import {
    StudentRegisterPayload,
    StudentRegisterResponse,
} from '@/dtos/StudentDto';
import { formatDate } from '@/utils/shared-functions/date';

export const useStudentRegister = (payload: StudentRegisterPayload) =>
    useMutation({
        mutationFn: () =>
            studentsApi
                .post('', {
                    email: payload.email,
                    password: payload.password,
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
                    hasTechCourses: null,
                    techCoursesList: null,
                    sendCurriculum: null,
                    fatilabMotivation: payload.whyJoinFatiLab,
                    howHeard: payload.whomInformed,
                    hasComputer: payload.hasOwnComputer,
                    hasInternet: payload.hasInternetAccess,
                    committedToParticipate: payload.compromisedToClasses,
                    familyIncome: payload.familyIncome,
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
                        description: null,
                        hasReport: null,
                        type: payload.typeAccessability,
                    },
                    socialBenefits: [
                        {
                            benefit: 'Outro',
                            benefitOther: null,
                        },
                    ],
                    accessibilityResources: [
                        {
                            resource: 'Outro',
                            resourceOther: null,
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
