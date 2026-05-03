import { PublicSettingDto } from '@/dtos/CourseDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { settingsApi } from '.';

const getPublicSetting = async (key: string): Promise<PublicSettingDto> => {
    return settingsApi
        .get(`/public/${key}`)
        .then((res) => res.data as PublicSettingDto);
};

export const useGetPublicSetting = (key: string) =>
    useQuery({
        queryKey: [QUERY_KEYS.PUBLIC_SETTINGS, key],
        queryFn: () => getPublicSetting(key),
    });
