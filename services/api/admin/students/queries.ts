import {
    AdminStudentsQueryParams,
    AdminStudentsResponseDto,
} from '@/dtos/AdminStudentDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { adminStudentsApi } from '.';
import { getAdminStudentsMock } from './mock';

const USE_MOCK_ADMIN_STUDENTS = true;

export const getAdminStudents = async (
    params: AdminStudentsQueryParams = {},
): Promise<AdminStudentsResponseDto> => {
    if (USE_MOCK_ADMIN_STUDENTS) {
        return getAdminStudentsMock(params);
    }

    return adminStudentsApi
        .get('', {
            params: {
                page: params.page ?? 1,
                limit: params.limit ?? 20,
                search: params.search || undefined,
                disabilityTypes: params.disabilityTypes?.join(',') || undefined,
                locations: params.locations?.join(',') || undefined,
                courseTypes: params.courseTypes?.join(',') || undefined,
                sortBy: params.sortBy || undefined,
                sortOrder: params.sortOrder || undefined,
            },
        })
        .then((res) => res.data as AdminStudentsResponseDto);
};

export const useGetAdminStudents = (
    params: AdminStudentsQueryParams,
    enabled = true,
) =>
    useQuery({
        enabled,
        queryKey: [
            QUERY_KEYS.ADMIN_STUDENTS,
            params.sortOrder,
            params.sortBy,
            params.search,
            params.page,
            params.locations,
            params.limit,
            params.disabilityTypes,
            params.courseTypes,
        ],
        queryFn: () => getAdminStudents(params),
        placeholderData: (previousData) => previousData,
    });
