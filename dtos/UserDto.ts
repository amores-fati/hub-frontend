export enum UserRole {
    ADMIN = 'ADMIN',
    STUDENT = 'STUDENT',
    COMPANY = 'COMPANY',
}

export interface UserProfileDto {
    sub?: string;
    userId?: string;
    role: UserRole;
    email: string;
}
