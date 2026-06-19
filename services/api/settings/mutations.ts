import { PublicSettingDto } from '@/dtos/CourseDto';
import QUERY_KEYS from '@/utils/contants/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { settingsApi } from '.';
import { queryClient } from '@/services/query-client';

const updateSetting = async (key: string, value: string): Promise<PublicSettingDto> => {
    return settingsApi
        .put(`/${key}`, { value })
        .then((res) => res.data as PublicSettingDto);
};

export const useUpdateSetting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ key, value }: { key: string; value: string }) =>
            updateSetting(key, value),
        onSuccess: () => {
            toast.success('Configuração atualizada com sucesso');
            void queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.PUBLIC_SETTINGS],
            });
        },
        onError: () => toast.error('Erro ao atualizar configuração'),
    });
};
