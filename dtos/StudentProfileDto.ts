import {
    Gender,
    Race,
    Scholarship,
    SocialBenefit,
    StudentRegisterPayload,
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

export type StudentProfile = {
    id: string;
    fullName: string;
    committedToParticipate: boolean;
    hasProgrammingExperience: boolean;
    hasInternet: boolean;
    hasComputer: boolean;
    howHeard: WhoInformed;
    benefit: SocialBenefit;
    householdSize: string;
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
};

export type UpdateStudentProfilePayload = {
    id: string;
    socialName?: string | null;
    disability?: {
        hasDisability: boolean;
        type?: string | null;
    };
};
