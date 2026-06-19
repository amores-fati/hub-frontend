export type AuthDto = {
    accessToken: string;
};

export type AuthPayload = {
    email: string;
    password: string;
};

export type AuthMessageResponse = {
    message: string;
};

export type ForgotPasswordPayload = {
    email: string;
};

export type ResetPasswordPayload = {
    token: string;
    newPassword: string;
};
