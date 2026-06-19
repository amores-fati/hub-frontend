import {
    AddResumeSkillPayload,
    ApiErrorDto,
    ResumeSkill,
    StudentResume,
    StudentResumePhotoResponse,
    UpdateStudentResumePayload,
} from '@/dtos/StudentResumeDto';
import { queryClient } from '@/services/query-client';
import QUERY_KEYS from '@/utils/contants/queries';
import { getStoreAuthToken } from '@/utils/stores/auth';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { studentResumeApi } from '.';

type FetchMutationError = Error & {
    response?: {
        status: number;
        data?: ApiErrorDto;
    };
};

const parseErrorMessage = (data?: ApiErrorDto) => {
    if (!data?.message) return 'Erro ao atualizar currículo.';
    return Array.isArray(data.message) ? data.message[0] : data.message;
};

const uploadStudentResumePhoto = async (
    file: File,
): Promise<StudentResumePhotoResponse> => {
    const formData = new FormData();
    const token = getStoreAuthToken();

    formData.append('photo', file);

    const response = await fetch(`${studentResumeApi.url}/photo`, {
        method: 'POST',
        headers: token
            ? {
                  Authorization: `Bearer ${token}`,
              }
            : undefined,
        body: formData,
    });

    if (!response.ok) {
        const data = (await response.json().catch(() => undefined)) as
            | ApiErrorDto
            | undefined;
        const error = new Error(parseErrorMessage(data)) as FetchMutationError;
        error.response = {
            status: response.status,
            data,
        };
        throw error;
    }

    return response.json() as Promise<StudentResumePhotoResponse>;
};

export const useUpdateStudentResume = () =>
    useMutation<
        StudentResume,
        AxiosError<ApiErrorDto>,
        UpdateStudentResumePayload
    >({
        mutationFn: (payload) =>
            studentResumeApi
                .put<StudentResume>('', payload)
                .then((response) => response.data),
        onSuccess: (resume) => {
            queryClient.setQueryData([QUERY_KEYS.STUDENT_RESUME], resume);
        },
    });

export const useUploadStudentResumePhoto = () =>
    useMutation<StudentResumePhotoResponse, FetchMutationError, File>({
        mutationFn: uploadStudentResumePhoto,
        onSuccess: (photo) => {
            queryClient.setQueryData<StudentResume | null>(
                [QUERY_KEYS.STUDENT_RESUME],
                (currentResume) =>
                    currentResume
                        ? {
                              ...currentResume,
                              photoUrl: photo.photoUrl
                                  ? `${photo.photoUrl}?t=${Date.now()}`
                                  : photo.photoUrl,
                          }
                        : currentResume,
            );
        },
    });

export const useAddStudentResumeSkill = () =>
    useMutation<ResumeSkill, AxiosError<ApiErrorDto>, AddResumeSkillPayload>({
        mutationFn: (payload) =>
            studentResumeApi
                .post<ResumeSkill>('/skills', payload)
                .then((response) => response.data),
        onSuccess: (skill) => {
            queryClient.setQueryData<StudentResume | null>(
                [QUERY_KEYS.STUDENT_RESUME],
                (currentResume) =>
                    currentResume
                        ? {
                              ...currentResume,
                              skills: [...currentResume.skills, skill],
                          }
                        : currentResume,
            );
        },
    });

export const useRemoveStudentResumeSkill = () =>
    useMutation<void, AxiosError<ApiErrorDto>, string>({
        mutationFn: (skillId) =>
            studentResumeApi.delete(`/skills/${skillId}`).then(() => undefined),
        onSuccess: (_, skillId) => {
            queryClient.setQueryData<StudentResume | null>(
                [QUERY_KEYS.STUDENT_RESUME],
                (currentResume) =>
                    currentResume
                        ? {
                              ...currentResume,
                              skills: currentResume.skills.filter(
                                  (skill) => skill.id !== skillId,
                              ),
                          }
                        : currentResume,
            );
        },
    });
