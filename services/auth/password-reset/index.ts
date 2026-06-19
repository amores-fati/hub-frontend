import { authApi } from '..';
import { createHttpClient } from '../../http-client';

export const forgotPasswordApi = createHttpClient('/forgot-password', authApi);
export const resetPasswordApi = createHttpClient('/reset-password', authApi);
