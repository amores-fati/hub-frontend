import { baseApi } from '..';
import { createHttpClient } from '../http-client';

export const authApi = createHttpClient('/api/auth', baseApi);
