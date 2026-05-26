import {
    AdminStudentDto,
    AdminStudentsQueryParams,
} from '@/dtos/AdminStudentDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { adminStudentsApi } from '.';
import { PaginatedDto } from '@/dtos/PaginatedDto';
import qs from 'qs';

export const getAdminStudents = (payload: AdminStudentsQueryParams) =>
    adminStudentsApi
        .get('/filter', {
            params: payload,
            paramsSerializer: (params) =>
                qs.stringify(params, {
                    arrayFormat: 'repeat',
                    encoder: (value) => encodeURIComponent(value),
                }),
        })
        .then((res) => res.data as PaginatedDto<AdminStudentDto>);

export const useGetAdminStudents = (
    payload: AdminStudentsQueryParams,
    enabled = true,
) =>
    useQuery({
        enabled,
        queryKey: [
            QUERY_KEYS.ADMIN_STUDENTS,
            payload.sortOrder,
            payload.sortBy,
            payload.search,
            payload.page,
            payload.city,
            payload.limit,
            payload.disabilityType,
            payload.modality,
        ],
        queryFn: () => getAdminStudents(payload),
    });
