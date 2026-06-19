export type AdminCompanyStatus = 'ATIVO' | 'INATIVO';

export type AdminCompanyDto = {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    responsibleName: string;
    status: AdminCompanyStatus;
};

export type AdminCompaniesQueryParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: AdminCompanyStatus;
    state?: string;
    city?: string;
};

export type AdminCompaniesResponse = {
    data: AdminCompanyDto[];
    total: number;
    page: number;
    limit: number;
};
