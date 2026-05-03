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
    course: string;
    socialName?: string | null;
    cpf: string;
    birthDate?: string | null;
    email: string;
    phone: string;
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
};

export type AdminStudentsQueryParams = {
    page?: number;
    limit?: number;
    search?: string;
    disabilityTypes?: string[];
    locations?: string[];
    courseTypes?: string[];
    sortBy?: string;
    sortOrder?: SortDirection;
};

export type AdminStudentsResponseDto = {
    data: AdminStudentDto[];
    total: number;
    page: number;
    limit: number;
};

export type AdminStudentsSortField = 'fullName' | 'course' | 'contact' | 'location' | 'pcd';

export type AdminStudentsSortOrder = SortDirection;
