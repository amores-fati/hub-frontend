export type ResumeSkill = {
    id: string;
    skillName: string;
};

export type StudentResume = {
    id: string;
    about: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    videoPresentationUrl: string | null;
    photoUrl: string | null;
    skills: ResumeSkill[];
};

export type UpdateStudentResumePayload = {
    about?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    videoPresentationUrl?: string | null;
};

export type AddResumeSkillPayload = {
    skillName: string;
};

export type StudentResumePhotoResponse = {
    photoUrl: string;
};

export type ApiErrorKind =
    | 'CONFLICT'
    | 'INVALID_FILE'
    | 'NOT_FOUND'
    | 'VALIDATION_ERROR';

export type ApiErrorDto = {
    statusCode: number;
    message: string | string[];
    error: string;
    errorKind?: ApiErrorKind;
};
