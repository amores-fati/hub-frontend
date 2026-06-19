/* eslint-disable unicorn/filename-case */
import { toast } from 'react-toastify';
import { EditCompanyForm } from './Types';

export function validateCompanyForm(form: EditCompanyForm): boolean {
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits && (phoneDigits.length < 10 || phoneDigits.length > 11)) {
        toast.error('Telefone inválido');
        return false;
    }

    const cepDigits = form.cep.replace(/\D/g, '');
    if (cepDigits && cepDigits.length !== 8) {
        toast.error('CEP deve ter 8 dígitos');
        return false;
    }

    if (form.state && form.state.trim().length !== 2) {
        toast.error('Estado deve ter 2 letras (UF)');
        return false;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        toast.error('E-mail inválido');
        return false;
    }

    return true;
}