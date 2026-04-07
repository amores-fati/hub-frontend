export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    NON_BINARY = 'NON_BINARY',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
    OTHER = 'OTHER',
}

export enum Race {
    WHITE = 'WHITE',
    BLACK = 'BLACK',
    BROWN = 'BROWN',
    INDIGENOUS = 'INDIGENOUS',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum Scholarship {
    NO_EDUCATION = 'NO_EDUCATION',
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
    HIGHER = 'HIGHER',
    POSTGRADUATE = 'POSTGRADUATE',
}

export enum WhoInformed {
    INSTAGRAM = 'INSTAGRAM',
    REFEREE = 'REFEREE',
    LINKEDIN = 'LINKEDIN',
    OTHERS = 'OTHERS',
}

export enum FamilyIncome {
    TO1_SALARY = 'TO1_SALARY',
    BETWEEN_1_3 = 'BETWEEN_1_3',
    LESS_THAN_3 = 'LESS_THAN_3',
}

export type UserRegisterPayload = {
    // Stepper 1
    fullName: string | null;
    socialName?: string;
    cpf: string | null;
    birthDate: string | null;
    phoneNumber: string | null;
    email: string | null;
    password: string | null;
    passwordConfirmation: string | null;
    gender?: Gender;
    race?: Race;
    // Stepper 2
    cep: string;
    address: string;
    complement?: string;
    neighbourhood?: string;
    city?: string;
    state?: string;
    scholarship: Scholarship | null;
    course?: string;
    institution?: string;
    // Stepper 3
    whyJoinFatiLab: string;
    whomInformed?: WhoInformed;
    hasOwnComputer?: boolean;
    hasInternetAccess?: boolean;
    compromisedToClasses?: boolean;
    familyIncome?: FamilyIncome;
    // Stepper 4
    hasWorkExperience?: boolean;
    hasParticipatedOnCourses?: boolean;
    currentlyWorking: boolean;
    workField?: string;
    hasAccessability: boolean;
    typeAccessability: string;
    lgpd: {
        terms: boolean;
        imageUsage: boolean;
    };
};

export enum UserRole {
    ADMIN = 'ADMIN',
    STUDENT = 'STUDENT',
    COMPANY = 'COMPANY',
}

export interface UserProfileDto {
    userId: number;
    role: UserRole;
    accountType: string;
    friendlyName: string;
}
