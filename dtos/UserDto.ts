export enum UserRole {
    ADMIN = 'ADMIN',
    STUDENT = 'STUDENT',
    COMPANY = 'COMPANY',
}

export interface UserProfileDto {
    userId: number;
    role: UserRole;
    email: string;
}
