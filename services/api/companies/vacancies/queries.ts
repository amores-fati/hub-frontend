import { useQuery } from '@tanstack/react-query';

import { VacanciesQueryParams, VacanciesResponseDto } from '@/dtos/VacancyDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { companyVacanciesApi } from '.';

const buildApiParams = (params: VacanciesQueryParams) => {
    const apiParams: Record<string, unknown> = {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
    };

    if (params.search) apiParams.search = params.search;
    if (params.vacancyCount !== undefined)
        apiParams.vacancyCount = params.vacancyCount;
    if (params.isPcd !== undefined) apiParams.isPcd = params.isPcd;

    return apiParams;
};

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
        queryFn: () =>
            companyVacanciesApi
                .get<VacanciesResponseDto>('', {
                    params: buildApiParams(params),
                })
                .then((res) => res.data),
    });

export const getCompanyVacancies = (
    params: VacanciesQueryParams,
): Promise<VacanciesResponseDto> =>
    companyVacanciesApi
        .get<VacanciesResponseDto>('', { params: buildApiParams(params) })
        .then((res) => res.data);
