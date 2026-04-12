import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import { cepApi } from '.';

type Response = {
    cep: string;
    logradouro: string;
    complemento: string;
    unidade: string;
    bairro: string;
    localidade: string;
    uf: string;
    estado: string;
    regiao: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: 'true' | 'false';
};

export const useGetPublicCep = (cep: string | null) =>
    useQuery({
        enabled: !!cep && cep.length === 8,
        queryKey: [QUERY_KEYS.EXAMPLES, cep],
        queryFn: () =>
            cepApi.get<Response>(`/${cep}/json`).then((res) => res.data),
    });
