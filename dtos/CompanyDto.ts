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
