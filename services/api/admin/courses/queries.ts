import { AdminStudentDto } from '@/dtos/AdminStudentDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { adminCoursesApi } from '.';
import qs from 'qs';
import {
    AdminCourseDto,
    AdminCoursesQueryParams,
    AdminCoursesResponse,
} from '@/dtos/AdminCourseDto';

export const useGetAdminCourses = (payload: AdminCoursesQueryParams) =>
    useQuery({
        queryKey: [
            QUERY_KEYS.COURSES,
            payload.sortOrder,
            payload.sortBy,
            payload.search,
            payload.page,
            payload.limit,
            payload.modality,
        ],
        queryFn: () =>
            adminCoursesApi
                .get('/filter', {
                    params: payload,
                    paramsSerializer: (params) =>
                        qs.stringify(params, {
                            arrayFormat: 'repeat',
                            encoder: (value) => encodeURIComponent(value),
                        }),
                })
                .then((res) => res.data as AdminCoursesResponse),
    });

export const useGetAdminCourseById = (id?: string) =>
    useQuery({
        enabled: !!id,
        queryKey: [QUERY_KEYS.COURSES, id],
        queryFn: () =>
            adminCoursesApi
                .get(`${id}`, {})
                .then((res) => res.data as AdminCourseDto),
    });
