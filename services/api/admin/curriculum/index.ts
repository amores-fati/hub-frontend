import { createHttpClient } from '@/services/http-client';
import { coreApi } from '../..';

export const adminCurriculumApi = createHttpClient('/curricula', coreApi);
