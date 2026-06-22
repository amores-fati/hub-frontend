/* eslint-disable unicorn/filename-case */
import {
    CompanyProfile,
    UpdateCompanyProfilePayload,
} from '@/dtos/CompanyDto';
import { EditCompanyForm } from './Types';

export function companyToForm(company: CompanyProfile): EditCompanyForm {
    return {
        companyName: company.name ?? '',
        cnpj: company.cnpj ?? '',
        // O backend não mantém "nome fantasia" separado; mantemos o campo vazio.
        tradeName: '',
        ownerName: company.responsibleName ?? '',
        phone: company.contact?.phone ?? '',
        cep: company.contact?.cep ?? '',
        address: company.contact?.address ?? '',
        complement: company.contact?.complement ?? '',
        neighbourhood: company.contact?.neighbourhood ?? '',
        city: company.contact?.city ?? '',
        state: company.contact?.state ?? '',
        email: company.email ?? '',
    };
}

export function formToUpdatePayload(
    form: EditCompanyForm,
): UpdateCompanyProfilePayload {
    return {
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        cep: form.cep?.trim() || undefined,
        address: form.address?.trim() || undefined,
        complement: form.complement?.trim() || undefined,
        neighbourhood: form.neighbourhood?.trim() || undefined,
        city: form.city?.trim() || undefined,
        state: form.state?.trim() || undefined,
    };
}
