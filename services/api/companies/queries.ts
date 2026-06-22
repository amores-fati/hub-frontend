import { useQuery } from '@tanstack/react-query';

import { companiesApi } from '.';
import { ResponseDto } from '@/dtos/ResponseDto';
import { CompanyProfile } from '@/dtos/CompanyDto';
import QUERY_KEYS from '@/utils/contants/queries';

export const useGetCompanyProfile = () =>
    useQuery({
        queryKey: [QUERY_KEYS.COMPANY_PROFILE],
        queryFn: () =>
            companiesApi
                .get('/me')
                .then((res: ResponseDto<CompanyProfile>) => res.data),
    });
