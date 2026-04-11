import { AdminDashboardDto } from '@/dtos/AdminDashboardDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { adminDashboardApi } from '.';
import { getAdminDashboardMock } from './mock';

const USE_MOCK_ADMIN_DASHBOARD = true;

const getAdminDashboard = async (): Promise<AdminDashboardDto> => {
    if (USE_MOCK_ADMIN_DASHBOARD) {
        return getAdminDashboardMock();
    }

    return adminDashboardApi
        .get('')
        .then((res) => res.data as AdminDashboardDto);
};

export const useGetAdminDashboard = (enabled = true) =>
    useQuery({
        enabled,
        queryKey: [QUERY_KEYS.ADMIN_DASHBOARD],
        queryFn: getAdminDashboard,
    });
