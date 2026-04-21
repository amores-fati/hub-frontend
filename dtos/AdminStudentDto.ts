export enum AdminStudentCourseType {
    PRESENTIAL = 'PRESENTIAL',
    ONLINE = 'ONLINE',
    NOT_ENROLLED = 'NOT_ENROLLED',
}

export enum AdminStudentDisabilityType {
    NONE = 'NONE',
    PHYSICAL = 'PHYSICAL',
    HEARING = 'HEARING',
    VISUAL = 'VISUAL',
    INTELLECTUAL = 'INTELLECTUAL',
    PSYCHOSOCIAL = 'PSYCHOSOCIAL',
    MULTIPLE = 'MULTIPLE',
    OTHER = 'OTHER',
}

export type AdminStudentCourseDto = {
    id: string;
    name: string;
    modality: AdminStudentCourseType;
};

export type AdminStudentDto = {
    id: string;
    fullName: string;
    cpf: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    isPcd: boolean;
    disabilityType: AdminStudentDisabilityType;
    enrolledCourse: AdminStudentCourseDto | null;
    photoUrl?: string | null;
};

export type AdminStudentsQueryParams = {
    page?: number;
    limit?: number;
    search?: string;
    disabilityTypes?: string[];
    locations?: string[];
    courseTypes?: string[];
    sortBy?: AdminStudentsSortField;
    sortOrder?: AdminStudentsSortOrder;
};

export type AdminStudentsSortField =
    | 'fullName'
    | 'course'
    | 'contact'
    | 'location'
    | 'pcd';

export type AdminStudentsSortOrder = 'asc' | 'desc';

export type AdminStudentsResponseDto = {
    data: AdminStudentDto[];
    total: number;
    page: number;
    limit: number;
};
