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
    workloadHours: string;
    status: string;
    vacancyCount: number;
    enrollmentStart: string;
    enrollmentEnd: string;
    imageUrl: string;
    externalLink: string;
    shift: AdminCourseShift;
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
    banner: string | null;
    address: string | null;
    vacancyCount: number | null;
    modality: AdminCourseModality;
    shift: AdminCourseShift;
    courseLoad: string | null;
    startDate: string | null;
    endDate: string | null;
    startRegistrations: string | null;
    endRegistrations: string | null;
};
