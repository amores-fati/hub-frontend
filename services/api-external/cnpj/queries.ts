import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import { cnpjApi } from '.';

type Response = {
    cnpj: string;
    razao_social: string;
    nome_fantasia: string;
};

export const useGetPublicCnpj = (cnpj: string | null) =>
    useQuery({
        enabled: !!cnpj && cnpj.length === 14,
        queryKey: [QUERY_KEYS.CNPJ, cnpj],
        queryFn: () =>
            cnpjApi.get<Response>(`/${cnpj}`).then((res) => res.data),
    });
