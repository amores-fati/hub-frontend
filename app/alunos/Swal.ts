import { UseMutateFunction } from '@tanstack/react-query';
import Swal from 'sweetalert2';

export const deleteConfirmation = async (
    mutate: UseMutateFunction<unknown, unknown, void, unknown>,
    studentIds: string[],
) => {
    await Swal.fire({
        text: 'Você tem certeza de que deseja excluir os alunos selecionados?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#adadad',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        showCloseButton: true,
        preConfirm: () => {
            return mutate();
        },
        allowOutsideClick: () => !Swal.isLoading(),
    });
};
