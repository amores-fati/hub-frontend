export enum AdminCourseModality {
    PRESENTIAL = 'presential',
    ONLINE = 'online',
}

export enum AdminCourseShift {
    MORNING = 'morning',
    AFTERNOON = 'afternoon',
    EVENING = 'evening',
}

export type AdminCourseDto = {
    id: string;
    name: string;
    modality: AdminCourseModality;
    address: string | null;
    startDate: string;
    endDate: string;
};

export type AdminCoursesResponse = {
    data: AdminCourseDto[];
    total: number;
    page: number;
    limit: number;
};

export type AdminCoursesQueryParams = {
    page: number;
    limit: number;
    search?: string;
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
