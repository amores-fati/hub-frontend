import { SortDirection } from '@/stores/TableStoreProvider';
import {
    FamilyIncome,
    Gender,
    Race,
    Scholarship,
    SocialBenefit,
    WhoInformed,
} from './StudentDto';

export enum AdminStudentCourseType {
    PRESENTIAL = 'PRESENCIAL',
    ONLINE = 'ONLINE',
    NOT_ENROLLED = 'NAO_INSCRITO',
}

export enum AdminStudentDisabilityType {
    NONE = 'NENHUMA',
    PHYSICAL = 'FISICA',
    HEARING = 'AUDITIVA',
    VISUAL = 'VISUAL',
    INTELLECTUAL = 'INTELECTUAL',
    PSYCHOSOCIAL = 'PSICOSSOCIAL',
    OTHER = 'OUTRA',
}

export type AdminStudentCourseDto = {
    id: string;
    name: string;
    modality: AdminStudentCourseType;
};

export type AdminStudentDto = {
    id: string;
    fullName: string;
    course: string;
    socialName?: string | null;
    cpf: string;
    birthDate?: string | null;
    email: string;
    phoneNumber: string;
    gender?: Gender;
    race?: Race;
    city: string;
    state: string;
    cep?: string;
    address?: string;
    complement?: string | null;
    neighbourhood?: string | null;
    isPcd: boolean;
    disabilityType: AdminStudentDisabilityType;
    enrolledCourse: AdminStudentCourseDto | null;
    scholarship?: Scholarship | null;
    institution?: string | null;
    whyJoinFatiLab?: string | null;
    whomInformed?: WhoInformed;
    hasOwnComputer?: boolean;
    hasInternetAccess?: boolean;
    compromisedToClasses?: boolean;
    familyIncome?: FamilyIncome;
    peopleInHouse?: string | null;
    socialBenefit?: SocialBenefit;
    hasWorkExperience?: boolean;
    hasParticipatedOnCourses?: boolean;
    currentlyWorking?: boolean;
    workField?: string | null;
    lgpd?: {
        terms: boolean;
        imageUsage: boolean;
    };
    photoUrl?: string | null;
    curriculumIsAvailable: boolean;
};

export type AdminStudentsQueryParams = {
    page?: number;
    limit?: number;
    search?: string;
    disabilityType?: string[];
    city?: string[];
    modality?: string;
    sortBy?: string;
    sortOrder?: SortDirection;
};

export type AdminStudentsResponseDto = {
    items: AdminStudentDto[];
    meta: {
        page: number;
        total: number;
        pageSize: number;
        totalPages: number;
    };
};

export type AdminStudentsSortField =
    | 'fullName'
    | 'course'
    | 'contact'
    | 'location'
    | 'pcd';

export type AdminStudentsSortOrder = SortDirection;
