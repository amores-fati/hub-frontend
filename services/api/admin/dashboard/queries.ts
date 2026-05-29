import { AdminDashboardDto } from '@/dtos/AdminDashboardDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { adminDashboardApi } from '.';
import { getAdminDashboardMock } from './mock';

const USE_MOCK_ADMIN_DASHBOARD = false;

const getAdminDashboard = async (): Promise<AdminDashboardDto> => {
    if (USE_MOCK_ADMIN_DASHBOARD) {
        return getAdminDashboardMock();
    }

    const [dashboardStats, disabilityStats, studentCountByCity] = await Promise.all([
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
