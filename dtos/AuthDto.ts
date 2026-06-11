export type AuthDto = {
    accessToken: string;
};

export type AuthPayload = {
    email: string;
    password: string;
};

export type ResetPasswordPayload = {
    token: string;
    newPassword: string;
};
