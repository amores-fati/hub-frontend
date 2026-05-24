import { UseMutateFunction } from '@tanstack/react-query';
import Swal from 'sweetalert2';

export const deleteConfirmation = async (
    mutate: UseMutateFunction<unknown, unknown, string[], unknown>,
    courseIds: string[],
) => {
    await Swal.fire({
        text: 'Você tem certeza de que deseja excluir os cursos selecionados?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#adadad',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        showCloseButton: true,
        preConfirm: (_) => {
            return mutate(courseIds);
        },
        allowOutsideClick: () => !Swal.isLoading(),
    });
};
