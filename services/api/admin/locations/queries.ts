import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import { adminLocationsApi } from '.';
import { AdminLocationDto } from '@/dtos/LocationDto';

export type AdminLocationsQueryParams = {
  scope: 'STUDENT' | 'COMPANY';
};

export const useGetAdminLocations = (params: AdminLocationsQueryParams) =>
  useQuery({
    queryKey: [QUERY_KEYS.ADMIN_LOCATIONS, params.scope],
    queryFn: () =>
      adminLocationsApi
        .get('', { params })
        .then((res) => res.data as AdminLocationDto[]),
  });
