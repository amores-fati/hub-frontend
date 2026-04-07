import QUERY_KEYS from '@/utils/contants/queries';
import { useQuery } from '@tanstack/react-query';
import { examplesApi } from '.';
import { ExamplePayload, ExampleResponse } from '../../../dtos/ExampleDto';
import { PaginatedDto } from '../../../dtos/PaginatedDto';
import { ResponseDto } from '../../../dtos/ResponseDto';

export const useGetExample = (exampleId: number) =>
    useQuery({
        enabled: !!exampleId,
        queryKey: [QUERY_KEYS.EXAMPLES, exampleId],
        queryFn: () =>
            examplesApi
                .get(`/${exampleId}`)
                .then((res: ResponseDto<ExampleResponse>) => res.data),
    });

export const useGetAllExamples = (payload: ExamplePayload) =>
    useQuery({
        queryKey: [QUERY_KEYS.EXAMPLES, payload.name],
        queryFn: () =>
            examplesApi
                .get('')
                .then(
                    (res) => (res.data as PaginatedDto<ExampleResponse>).data,
                ),
    });
