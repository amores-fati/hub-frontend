import { coreApi } from '../';
import { createHttpClient } from '@/services/http-client';

export const adminApi = createHttpClient('/admins', coreApi);
