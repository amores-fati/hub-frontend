import { UseMutateFunction } from '@tanstack/react-query';
import Swal from 'sweetalert2';

export const deleteConfirmation = async (
    mutate: UseMutateFunction<unknown, unknown, string, unknown>,
    courseId: string,
) => {
    await Swal.fire({
        text: 'Você tem certeza de que deseja excluir o curso selecionado?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#adadad',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        showCloseButton: true,
        preConfirm: (_) => {
            return mutate(courseId);
        },
        allowOutsideClick: () => !Swal.isLoading(),
    });
};
