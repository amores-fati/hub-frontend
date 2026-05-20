export enum AdminCourseModality {
    PRESENTIAL = 'presential',
    ONLINE = 'online',
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
