export enum AdminCurriculumModality {
    PRESENCIAL = 'PRESENCIAL',
    ONLINE = 'remoto',
    HIBRIDO = 'HIBRIDO',
}

export enum AdminCurriculumStatus {
    ATIVO = 'available',
    INATIVO = 'unavailable',
}

export type AdminCurriculumDto = {
    id: string;
    studentId: string;
    fullName: string;
    cpf: string;
    activityArea: string;
    preference: AdminCurriculumModality;
    isAvailable: boolean;
    photoUrl?: string | null;
    github?: string | null;
    linkedin?: string | null;
    phone?: string | null;
    city: string | null;
    state: string | null;
};

export type AdminCurriculumPaginatedDto = {
    data: AdminCurriculumDto[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export type AdminCurriculaQueryParams = {
    page?: number;
    limit?: number;
    search?: string;
    cities?: string[];
    activityArea?: string[];
    preference?: 'remoto' | 'presencial';
    status?: 'available' | 'unavailable';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};
