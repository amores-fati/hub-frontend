import { useQuery } from '@tanstack/react-query';
import { adminVacanciesApi } from '.';
import QUERY_KEYS from '@/utils/contants/queries';
import {
    VacanciesQueryParams,
    VacanciesResponseDto,
} from '@/dtos/VacancyDto';

const buildApiParams = (params: VacanciesQueryParams) => {
    const apiParams: Record<string, unknown> = {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
    };

    if (params.search) apiParams.search = params.search;
    if (params.isPcd !== undefined) apiParams.isPcd = params.isPcd;
    if (params.workplaceType) apiParams.workType = params.workplaceType;

    return apiParams;
};

type AdminVacancyItem = {
    id: string;
    title: string;
    companyName: string;
    openingsCount: number;
    isPcd: boolean;
    announcementDate: string;
    workplaceType: string;
};

type PaginatedAdminVacanciesResponse = {
    items: AdminVacancyItem[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export const useGetAdminVacancies = (
    params: VacanciesQueryParams,
    options?: { enabled?: boolean }
) =>
    useQuery({
        enabled: options?.enabled,
        queryKey: [
            QUERY_KEYS.ADMIN_VACANCIES,
            params.page,
            params.limit,
            params.search,
            params.isPcd,
            params.vacancyCount,
            params.workplaceType,
        ],
        queryFn: () =>
            adminVacanciesApi
                .get<PaginatedAdminVacanciesResponse>('/filter', {
                    params: buildApiParams(params),
                })
                .then((res) => {
                    const data = res.data;
                    const response: VacanciesResponseDto = {
                        data: data.items.map(item => ({
                            id: item.id,
                            name: item.title,
                            companyId: 'N/A',
                            companyName: item.companyName,
                            openingsCount: item.openingsCount,
                            isPcd: item.isPcd,
                            announcementDate: item.announcementDate,
                            workplaceType: item.workplaceType as any,
                            skills: [],
                            vacancyCount: 0,
                        })),
                        total: data.meta.total,
                        page: data.meta.page,
                        limit: data.meta.limit,
                    };
                    return response;
                }),
    });
