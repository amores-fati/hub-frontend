import { SortDirection } from '../stores/TableStoreProvider';

export enum AdminCourseModality {
    PRESENTIAL = 'PRESENCIAL',
    ONLINE = 'ONLINE',
    HIBRIDO = 'HIBRIDO',
}

export enum AdminCourseShift {
    MORNING = 'morning',
    AFTERNOON = 'afternoon',
    EVENING = 'evening',
}

export type AdminCourseDto = {
    id: string;
    title: string;
    description: string;
    modality: AdminCourseModality;
    location: string;
    startDate: string;
    endDate: string;
    workloadHours: number;
    vacancyCount: number;
    enrollmentStart: string;
    enrollmentEnd: string;
    imageUrl: string;
    externalLink: string;
};

export type AdminCoursesResponse = {
    data: AdminCourseDto[];
    total: number;
    page: number;
    limit: number;
};

export type AdminCoursesQueryParams = {
    modality?: AdminCourseModality;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: SortDirection;
};

export type CreateAdminCourseDto = {
    name: string;
    description: string;
    imageUrl: string | null;
    address: string | null;
    vacancyCount: number | null;
    modality: AdminCourseModality;
    shift: AdminCourseShift;
    workloadHours: number | null;
    startDate: string | null;
    endDate: string | null;
    enrollmentStart: string | null;
    enrollmentEnd: string | null;
};
