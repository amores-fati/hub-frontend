export enum UserRole {
    ADMIN = 'ADMINISTRADOR',
    STUDENT = 'ESTUDANTE',
    COMPANY = 'EMPRESA',
}

export interface UserProfileDto {
    sub?: string;
    userId?: string;
    role: UserRole;
    email: string;
}
