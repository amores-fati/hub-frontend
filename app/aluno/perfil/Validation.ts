import { toast } from 'react-toastify';
import { EditProfileForm } from './Types';

export function validateProfileForm(form: EditProfileForm): boolean {
    if (!form.fullName.trim()) {
        toast.error('Nome completo é obrigatório');
        return false;
    }

    const phoneDigits = form.phoneNumber.replace(/\D/g, '');
    if (phoneDigits && (phoneDigits.length < 10 || phoneDigits.length > 11)) {
        toast.error('Telefone inválido');
        return false;
    }

    const cepDigits = form.cep.replace(/\D/g, '');
    if (cepDigits && cepDigits.length !== 8) {
        toast.error('CEP deve ter 8 dígitos');
        return false;
    }

    if (form.birthDate) {
        const [day, month, year] = form.birthDate.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        const isValid =
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year;
        if (!isValid) {
            toast.error('Data de nascimento inválida');
            return false;
        }
    }

    if (form.state && form.state.trim().length !== 2) {
        toast.error('Estado deve ter 2 letras (UF)');
        return false;
    }

    if (form.currentlyWorking && !form.activityArea.trim()) {
        toast.error('Informe a área de atuação');
        return false;
    }

    if (form.hasDisability && form.disabilityTypes.length === 0) {
        toast.error('Selecione ao menos um tipo de deficiência');
        return false;
    }

    return true;
}
