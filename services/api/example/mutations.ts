import {
    ExampleCreateUpdatePayload,
    ExamplePayload,
    ExampleResponse,
} from '@/dtos/ExampleDto';
import { queryClient } from '@/services/query-client';
import QUERY_KEYS from '@/utils/contants/queries';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { examplesApi } from '.';
import { ResponseDto } from '../../../dtos/ResponseDto';

export const useSurveysCreateMutation = (payload: ExampleCreateUpdatePayload) =>
    useMutation({
        mutationFn: () =>
            examplesApi
                .post('', payload)
                .then((res: ResponseDto<ExampleResponse>) => res.data),
        onSuccess: () => {
            if (!payload.name) {
                toast.error('O nome do example é obrigatório!');
                throw new Error('O nome do example é obrigatório!');
            }
            void queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.EXAMPLES],
            });
            toast.success(`Example criado com sucesso!`);
        },
    });

export const useSurveysUpdateMutation = (payload: ExampleCreateUpdatePayload) =>
    useMutation({
        mutationFn: () =>
            examplesApi
                .patch(`/${payload.id}`, payload)
                .then((res: ResponseDto<ExampleResponse>) => res.data),
        onSuccess: () => {
            if (!payload.name) {
                toast.error('O nome do example é obrigatório!');
                throw new Error('O nome do example é obrigatório!');
            }
            if (!payload.id) {
                toast.error('É necessário informar um item para atualização!');
                throw new Error(
                    'É necessário informar um item para atualização!',
                );
            }
            void queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.EXAMPLES, payload.id],
            });
            toast.success(`Example atualizado com sucesso!`);
        },
    });

export const useSurveysDeleteMutation = (payload: ExamplePayload) =>
    useMutation({
        mutationFn: () =>
            examplesApi
                .delete(`/${payload.id}`)
                .then((res: ResponseDto<ExampleResponse>) => res.data),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.EXAMPLES, payload.id],
            });
            toast.success('Example deletado com sucesso!');
        },
    });
