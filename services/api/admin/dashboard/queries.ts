import { AdminDashboardDto } from '@/dtos/AdminDashboardDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { adminDashboardApi } from '.';
import { getAdminDashboardMock } from './mock';

const USE_MOCK_ADMIN_DASHBOARD = false;

// Busca estatísticas gerais do dashboard
export const useGetDashboardStats = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'stats'],
        queryFn: () =>
            adminDashboardApi.get('/dashboard').then((res) => res.data),
    });

// Busca distribuição de alunos por tipo de deficiência
export const useGetDisabilityStats = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'disability-stats'],
        queryFn: () =>
            adminDashboardApi
                .get('/students/disability-stats')
                .then((res) => res.data),
    });

// Busca quantidade de alunos por cidade/UF
export const useGetStudentCountByCity = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD, 'students-by-city'],
        queryFn: () =>
            adminDashboardApi
                .get('/students/count-by-city')
                .then((res) => res.data),
    });

// Busca todos os dados do dashboard combinados
const getAdminDashboard = async (): Promise<AdminDashboardDto> => {
    if (USE_MOCK_ADMIN_DASHBOARD) {
        return getAdminDashboardMock();
    }

    const [dashboardStats, disabilityStats, studentCountByCity] =
        await Promise.all([
            adminDashboardApi.get('/dashboard').then((res) => res.data),
            adminDashboardApi.get('/students/disability-stats').then((res) => res.data),
            adminDashboardApi.get('/students/count-by-city').then((res) => res.data),
        ]);

    return {
        stats: {
            totalStudents: dashboardStats.totalStudents,
            totalPcd: dashboardStats.totalPcdStudents,
            totalActiveVacancies: dashboardStats.totalOpenedJobs,
        },
        enrollmentsByMonth: [],
        disabilityDistribution: disabilityStats.map((item: any) => ({
            disabilityType: item.disabilityType,
            count: item.count,
        })),
        studentsByCity: studentCountByCity.map((item: any) => ({
            city: item.cityName,
            state: item.uf,
            count: item.studentsCount,
        })),
        impactTimeline: [],
    };
};

export const useGetAdminDashboard = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD],
        queryFn: getAdminDashboard,
    });
