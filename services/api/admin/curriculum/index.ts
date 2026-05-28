import { createHttpClient } from '@/services/http-client';
import { adminApi } from '..';

export const adminCurriculumApi = createHttpClient('/resumes', adminApi);
