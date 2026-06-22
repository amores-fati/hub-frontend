import { Skill } from '../services/api/skills/types';

export enum WorkplaceType {
    PRESENTIAL = 'presencial',
    ONLINE = 'online',
    HYBRID = 'hibrido',
}

export type VacancyDto = {
    id: string;
    vacancyCount: number;
    isPcd: boolean;
    announcementDate: string;
    workplaceType?: WorkplaceType | null;
    description?: string | null;
    skills: Skill[];
    companyId: string;
    companyName?: string;
    name: string;
    openingsCount: number;
    applicationLink?: string | null;
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
    workplaceType?: string | null;
};

export type CreateOrUpdateVacancyDto = {
    name: string;
    description: string;
    applicationLink: string;
    openingsCount: number;
    isPcd: boolean;
    workplaceType: WorkplaceType;
    skills?: string[];
};
