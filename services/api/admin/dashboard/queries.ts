import {
    AdminDashboardDto,
    DashboardStatsDto,
    DisabilityDistributionDto,
    StudentsByCityDto,
} from '@/dtos/AdminDashboardDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { adminDashboardApi } from '.';

type GeneralStats = {
    totalStudents: number;
    totalPcdStudents: number;
    totalOpenedJobs: number;
};

// Busca estatísticas gerais do dashboard
export const useGetDashboardStats = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'stats'],
        queryFn: () =>
            adminDashboardApi.get<GeneralStats>('/dashboard').then((res) => {
                const response = res.data;

                return {
                    totalActiveVacancies: response.totalOpenedJobs,
                    totalPcd: response.totalPcdStudents,
                    totalStudents: response.totalStudents,
                } as DashboardStatsDto;
            }),
    });

type DisabilityStats = {
    disabilityType: string;
    count: number;
}[];

// Busca distribuição de alunos por tipo de deficiência
export const useGetDisabilityStats = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'disability-stats'],
        queryFn: () =>
            adminDashboardApi
                .get<DisabilityStats>('/students/disability-stats')
                .then((res) => {
                    const response = res.data;

                    const handledResponse = [];

                    for (const item of response) {
                        handledResponse.push({
                            disabilityType: item.disabilityType,
                            count: item.count,
                        });
                    }
                    return handledResponse as DisabilityDistributionDto[];
                }),
    });

type StudentCountByCity = {
    uf: string;
    cityName: string;
    studentsCount: number;
}[];

// Busca quantidade de alunos por cidade/UF
export const useGetStudentCountByCity = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'students-by-city'],
        queryFn: () =>
            adminDashboardApi
                .get<StudentCountByCity>('/students/count-by-city')
                .then((res) => {
                    const response = res.data;

                    const handledResponse = [];

                    for (const item of response) {
                        handledResponse.push({
                            city: item.cityName,
                            state: item.uf,
                            count: item.studentsCount,
                        });
                    }

                    return handledResponse as StudentsByCityDto[];
                }),
    });

type StudentCountByMonth = {
    month: string;
    count: number;
}[];

// Busca quantidade de alunos por mês
export const useGetStudentCountByMonth = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'students-by-month'],
        queryFn: () =>
            adminDashboardApi
                .get<StudentCountByMonth>('/students/count-by-month')
                .then((res) => res.data),
    });
