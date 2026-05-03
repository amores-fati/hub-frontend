import { StudentProfile } from '@/dtos/StudentProfileDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '.';

const getStudentProfile = async (
    studentId: string,
): Promise<StudentProfile> => {
    const response = await studentsApi.get<StudentProfile>(`/${studentId}`);
    return response.data;
};

export const useGetStudentProfile = (studentId?: string) =>
    useQuery({
        enabled: !!studentId,
        queryKey: [QUERY_KEYS.STUDENT_PROFILE, studentId],
        queryFn: () => getStudentProfile(studentId!),
    });
