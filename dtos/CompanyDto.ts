import { UUID } from 'crypto';

export type CompanyRegisterPayload = {
    name: string | null;
    cnpj: string | null;
    phoneNumber: string | null;
    email: string | null;
    ownerName: string | null;
    password: string | null;
    passwordConfirmation: string | null;
    cep: string | null;
    address?: string;
    complement?: string;
    neighbourhood?: string;
    city?: string;
    state?: string;
    lgpd: {
        terms: boolean;
    };
};

export type CompanyRegisterResponse = Omit<
    CompanyRegisterPayload,
    'password' | 'passwordConfirmation'
> & { id: UUID };

export type CompanyContact = {
    id: string;
    phone: string;
    neighbourhood?: string;
    state?: string;
    city?: string;
    address?: string;
    cep?: string;
    complement?: string;
};

export type CompanyProfile = {
    id: string;
    email: string;
    name: string;
    cnpj: string;
    responsibleName: string;
    contact: CompanyContact;
};

export type UpdateCompanyProfilePayload = {
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    neighbourhood?: string;
    address?: string;
    complement?: string;
    cep?: string;
};
