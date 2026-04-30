import { PublicSettingDto } from '@/dtos/CourseDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';

import { settingsApi } from '.';

const USE_MOCK_SETTINGS = true;

const MOCK_SETTINGS: Record<string, string> = {
    support_whatsapp_number: '5511999999999',
};

const getPublicSetting = async (key: string): Promise<PublicSettingDto> => {
    if (USE_MOCK_SETTINGS) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { key, value: MOCK_SETTINGS[key] ?? '' };
    }
    return settingsApi
        .get(`/public/${key}`)
        .then((res) => res.data as PublicSettingDto);
};

export const useGetPublicSetting = (key: string) =>
    useQuery({
        queryKey: [QUERY_KEYS.PUBLIC_SETTINGS, key],
        queryFn: () => getPublicSetting(key),
    });
