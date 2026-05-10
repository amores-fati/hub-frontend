import { createHttpClient } from '@/services/http-client';
import { coreApi } from '../..';

export const adminStudentsApi = createHttpClient('/students', coreApi);
