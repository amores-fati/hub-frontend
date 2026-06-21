import {
    AdminCompaniesQueryParams,
    AdminCompaniesResponse,
} from '@/dtos/AdminCompanyDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { adminCompaniesApi } from '.';

export const useGetAdminCompanies = (params: AdminCompaniesQueryParams) =>
    useQuery({
        queryKey: [
            QUERY_KEYS.ADMIN_COMPANIES,
            params.page,
            params.limit,
            params.search,
            params.status,
            params.city,
        ],
        queryFn: () =>
            adminCompaniesApi
                .get('/filter', {
                    params: params,
                    paramsSerializer: (params) =>
                        qs.stringify(params, {
                            arrayFormat: 'repeat',
                            encoder: (value) => encodeURIComponent(value),
                        }),
                })
                .then((res) => res.data as AdminCompaniesResponse),
    });
