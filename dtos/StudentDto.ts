import { UUID } from 'crypto';

export enum Gender {
    MALE = 'MASCULINO',
    FEMALE = 'FEMININO',
    NON_BINARY = 'NAO_BINARIO',
    PREFER_NOT_TO_SAY = 'PREFIRO_NAO_DIZER',
    OTHER = 'OUTRO',
}

export enum Race {
    WHITE = 'BRANCO',
    BLACK = 'PRETO',
    BROWN = 'PARDO',
    INDIGENOUS = 'INDIGENA',
    PREFER_NOT_TO_SAY = 'PREFIRO_NAO_DIZER',
}

export enum Scholarship {
    NO_EDUCATION = 'SEM_ESCOLARIDADE',
    PRIMARY = 'FUNDAMENTAL',
    SECONDARY = 'MEDIO',
    HIGHER = 'SUPERIOR',
    POSTGRADUATE = 'POS_GRADUACAO',
}

export enum WhoInformed {
    INSTAGRAM = 'INSTAGRAM',
    REFEREE = 'INDICACAO',
    LINKEDIN = 'LINKEDIN',
    OTHERS = 'OUTROS',
}

export enum FamilyIncome {
    TO1_SALARY = 'ATE_1_SALARIO',
    BETWEEN_1_3 = 'ENTRE_1_E_3',
    MORE_THAN_3 = 'MAIS_DE_3',
}

export enum SocialBenefit {
    BOLSA_FAMILIA = 'BOLSA_FAMILIA',
    BPC = 'BPC',
    NONE = 'NONE',
    OTHERS = 'OTHERS',
}

export type StudentRegisterPayload = {
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
    peopleInHouse?: string;
    socialBenefit?: SocialBenefit;
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

export type StudentRegisterResponse = Omit<
    StudentRegisterPayload,
    'password' | 'passwordConfirmation'
> & { id: UUID };
