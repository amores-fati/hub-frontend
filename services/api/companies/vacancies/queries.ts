import { useQuery } from '@tanstack/react-query';

import { VacanciesQueryParams, VacanciesResponseDto } from '@/dtos/VacancyDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { getCompanyVacanciesMock } from './mock';
// import { companyVacanciesApi } from '.';

export const useGetCompanyVacancies = (params: VacanciesQueryParams) =>
    useQuery({
        queryKey: [
            QUERY_KEYS.COMPANY_VACANCIES,
            params.page,
            params.limit,
            params.search,
            params.isPcd,
            params.workplaceTypes,
        ],
        // MOCK: substituir pela linha comentada abaixo quando o endpoint estiver pronto
        queryFn: () => getCompanyVacanciesMock(params),
        // Real: queryFn: () =>
        //     companyVacanciesApi
        //         .get<VacanciesResponseDto>('', { params })
        //         .then((res) => res.data),
    });

export const getCompanyVacancies = (
    params: VacanciesQueryParams,
): Promise<VacanciesResponseDto> =>
    // MOCK: substituir pela linha comentada abaixo quando o endpoint estiver pronto
    getCompanyVacanciesMock(params);
// Real: companyVacanciesApi.get<VacanciesResponseDto>('', { params }).then((res) => res.data),
