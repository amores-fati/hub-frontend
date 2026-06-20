import {
    AdminCompaniesQueryParams,
    AdminCompaniesResponse,
} from '@/dtos/AdminCompanyDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { adminCompaniesApi } from '.';

const removeEmptyParams = (params: AdminCompaniesQueryParams) =>
    Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined),
    ) as AdminCompaniesQueryParams;

export const useGetAdminCompanies = (params: AdminCompaniesQueryParams) =>
    useQuery({
        queryKey: [
            QUERY_KEYS.ADMIN_COMPANIES,
            params.page,
            params.limit,
            params.search,
            params.status,
            params.state,
            params.city,
        ],
        queryFn: () =>
            adminCompaniesApi
                .get('/filter', { params: removeEmptyParams(params) })
                .then((res) => res.data as AdminCompaniesResponse),
    });
