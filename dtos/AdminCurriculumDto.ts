export enum AdminCurriculumModality {
    PRESENCIAL = 'PRESENCIAL',
    ONLINE = 'ONLINE',
    HIBRIDO = 'HIBRIDO',
}

export enum AdminCurriculumStatus {
    ATIVO = 'ATIVO',
    INATIVO = 'INATIVO',
}

export type AdminCurriculumDto = {
    id: string;
    fullName: string;
    cpf: string;
    activityArea: string;
    modality: AdminCurriculumModality;
    status: AdminCurriculumStatus;
    photoUrl?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    phoneNumber?: string | null;
};

export type AdminCurriculaQueryParams = {
    page?: number;
    limit?: number;
    search?: string;
    cities?: string[];
    activityArea?: string[];
    modality?: string[];
    status?: string[];
};
