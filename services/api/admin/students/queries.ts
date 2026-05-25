import {
    AdminStudentDto,
    AdminStudentsQueryParams,
    AdminStudentsResponseDto,
} from '@/dtos/AdminStudentDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { adminStudentsApi } from '.';
import { PaginatedDto } from '@/dtos/PaginatedDto';
import qs from 'qs';

const buildRequestConfig = (payload: AdminStudentsQueryParams) => ({
    params: payload,
    paramsSerializer: (params: AdminStudentsQueryParams) =>
        qs.stringify(params, {
            arrayFormat: 'repeat',
            encoder: (value: string) => encodeURIComponent(value),
        }),
});

export const getAdminStudents = (payload: AdminStudentsQueryParams): Promise<AdminStudentsResponseDto> =>
    adminStudentsApi
        .get('/filter', buildRequestConfig(payload))
        .then((res) => res.data as AdminStudentsResponseDto);

export const useGetAdminStudents = (payload: AdminStudentsQueryParams, enabled = true) =>
    useQuery({
        queryKey: [
            QUERY_KEYS.ADMIN_STUDENTS,
            payload.sortOrder,
            payload.sortBy,
            payload.search,
            payload.page,
            payload.city,
            payload.limit,
            payload.disabilityType,
            payload.courseTypes,
        ],
        queryFn: () =>
            adminStudentsApi
                .get('/filter', buildRequestConfig(payload))
                .then((res) => res.data as PaginatedDto<AdminStudentDto>),
        enabled,
    });
