import {
    AdminCurriculumDto,
    AdminCurriculaQueryParams,
} from '@/dtos/AdminCurriculumDto';
import { PaginatedDto } from '@/dtos/PaginatedDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import qs from 'qs';
import { adminCurriculumApi } from '.';

export const useGetAdminCurriculum = (payload: AdminCurriculaQueryParams) =>
    useQuery({
        queryKey: [
            QUERY_KEYS.ADMIN_CURRICULUM,
            payload.page,
            payload.limit,
            payload.search,
            payload.cities,
            payload.activityArea,
            payload.modality,
            payload.status,
            payload.sortBy,
            payload.sortOrder,
        ],
        queryFn: () =>
            adminCurriculumApi
                .get('/filter', {
                    params: payload,
                    paramsSerializer: (params) =>
                        qs.stringify(params, {
                            arrayFormat: 'repeat',
                            encoder: (value: string) =>
                                encodeURIComponent(value),
                        }),
                })
                .then((res) => res.data as PaginatedDto<AdminCurriculumDto>),
    });
