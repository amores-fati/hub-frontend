import { useQuery } from '@tanstack/react-query';

import {
    VacanciesQueryParams,
    VacanciesResponseDto,
    VacancyDto,
} from '@/dtos/VacancyDto';
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
    if (params.workplaceType) apiParams.workplaceType = params.workplaceType;

    return apiParams;
};

export const useGetCompanyVacancies = (
    params: VacanciesQueryParams,
    options?: { enabled?: boolean }
) =>
    useQuery({
        enabled: options?.enabled,
        queryKey: [
            QUERY_KEYS.COMPANY_VACANCIES,
            params.page,
            params.limit,
            params.search,
            params.isPcd,
            params.vacancyCount,
            params.workplaceType,
        ],
        queryFn: () =>
            companyVacanciesApi
                .get<VacanciesResponseDto>('', {
                    params: buildApiParams(params),
                })
                .then((res) => res.data),
    });

export const useGetCompanyJobOpening = (jobOpeningId?: string) =>
    useQuery({
        enabled: !!jobOpeningId,
        queryKey: [QUERY_KEYS.COMPANY_VACANCIES, jobOpeningId],
        queryFn: () =>
            companyVacanciesApi
                .get<VacancyDto>(`/${jobOpeningId}`, {})
                .then((res) => res.data),
    });

export const getCompanyVacancies = (
    params: VacanciesQueryParams,
): Promise<VacanciesResponseDto> =>
    companyVacanciesApi
        .get<VacanciesResponseDto>('', { params: buildApiParams(params) })
        .then((res) => res.data);
