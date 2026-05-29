export enum WorkplaceType {
    PRESENTIAL = 'presential',
    ONLINE = 'online',
    HYBRID = 'hybrid',
}

export type VacancyDto = {
    id: string;
    title: string;
    vacancyCount: number;
    isPcd: boolean;
    announcementDate: string;
    workplaceType?: WorkplaceType | null;
    description?: string | null;
    link?: string | null;
    skills?: string[];
};

export type VacanciesResponseDto = {
    data: VacancyDto[];
    total: number;
    page: number;
    limit: number;
};

export type VacanciesQueryParams = {
    page?: number;
    limit?: number;
    search?: string;
    vacancyCount?: number;
    isPcd?: boolean;
    workplaceTypes?: string[];
};

export type CreateOrUpdateVacancyDto = {
    title: string;
    description: string;
    link: string;
    vacancyCount: number;
    isPcd: boolean;
    workplaceType: WorkplaceType;
    skills?: string[];
};
