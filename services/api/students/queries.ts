import { StudentProfile } from '@/dtos/StudentProfileDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '.';
import { ResponseDto } from '@/dtos/ResponseDto';
import { StudentRegisterPayload } from '@/dtos/StudentDto';

export const useGetStudent = (studentId?: string) =>
    useQuery({
        enabled: !!studentId,
        queryKey: [QUERY_KEYS.STUDENT_PROFILE, studentId],
        queryFn: () =>
            studentsApi
                .get(`/${studentId}`)
                .then((res: ResponseDto<StudentProfile>) => res.data),
    });
