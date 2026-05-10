import {
    Gender,
    Race,
    Scholarship,
    SocialBenefit,
    WhoInformed,
} from './StudentDto';

export type StudentDisability = {
    studentId: string;
    hasDisability: boolean;
    type?: string;
};

export type StudentContact = {
    id: string;
    phone: string;
    neighbourhood?: string;
    state?: string;
    city?: string;
    address?: string;
    cep?: string;
    complement?: string;
};

export type StudentSocialBenefit = {
    id?: number;
    studentId?: string;
    benefit: SocialBenefit;
};

export type StudentProfile = {
    id: string;
    fullName: string;
    committedToParticipate: boolean;
    hasProgrammingExperience: boolean;
    hasInternet: boolean;
    hasComputer: boolean;
    howHeard: WhoInformed;
    socialBenefits?: StudentSocialBenefit[];
    householdSize?: number;
    email: string;
    cpf: string;
    contact: StudentContact;
    birthDate: string;
    gender: Gender;
    race: Race;
    education: Scholarship;
    institution?: string;
    activityArea?: string;
    disability?: StudentDisability;
    socialName?: string;
    motivation: string;
    courseName?: string;
};

export type UpdateStudentContactPayload = {
    phone?: string;
    cep?: string;
    address?: string;
    complement?: string;
    neighbourhood?: string;
    city?: string;
    state?: string;
};

export type UpdateStudentDisabilityPayload = {
    hasDisability: boolean;
    type?: string | null;
};

export type UpdateStudentSocialBenefitPayload = {
    benefit: SocialBenefit;
};

export type UpdateStudentProfilePayload = {
    id: string;
    fullName?: string;
    socialName?: string | null;
    birthDate?: string;
    gender?: Gender;
    race?: Race;
    education?: Scholarship;
    courseName?: string;
    institution?: string;
    activityArea?: string;
    motivation?: string;
    howHeard?: WhoInformed;
    hasComputer?: boolean;
    hasInternet?: boolean;
    hasProgrammingExperience?: boolean;
    committedToParticipate?: boolean;
    householdSize?: number;
    contact?: UpdateStudentContactPayload;
    disability?: UpdateStudentDisabilityPayload;
    socialBenefits?: UpdateStudentSocialBenefitPayload[];
};
