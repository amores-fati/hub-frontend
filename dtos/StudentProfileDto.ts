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
    email: string;
    cpf: string;
    contact: StudentContact;
    birthDate: string;
    gender: string;
    race: string;
    education?: string;
    institution?: string;
    activityArea?: string;
    disability?: StudentDisability;
    socialName?: string;
};

export type UpdateStudentProfilePayload = {
    id: string;
    socialName?: string | null;
    disability?: {
        hasDisability: boolean;
        type?: string | null;
    };
};
