import { StudentResume } from '@/dtos/StudentResumeDto';
import { adminStudentsApi } from '@/services/api/admin/students';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const getAdminStudentResume = async (
    studentId: string,
): Promise<StudentResume | null> => {
    try {
        const response = await adminStudentsApi.get<StudentResume>(
            `/${studentId}/resume`,
        );
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const useGetAdminStudentResume = (studentId: string | null) =>
    useQuery({
        queryKey: [QUERY_KEYS.ADMIN_STUDENT_RESUME, studentId],
        queryFn: () => getAdminStudentResume(studentId!),
        enabled: !!studentId,
    });
