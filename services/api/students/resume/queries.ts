import { ApiErrorDto, StudentResume } from '@/dtos/StudentResumeDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { studentResumeApi } from '.';

const getStudentResume = async (): Promise<StudentResume | null> => {
    try {
        const response = await studentResumeApi.get<StudentResume>('');
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorDto>;

        if (axiosError.response?.status === 404) {
            return null;
        }

        throw error;
    }
};

export const useGetStudentResume = () =>
    useQuery({
        queryKey: [QUERY_KEYS.STUDENT_RESUME],
        queryFn: getStudentResume,
    });
