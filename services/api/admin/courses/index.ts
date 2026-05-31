import { createHttpClient } from '@/services/http-client';
import { coreApi } from '../..';

export const adminCoursesApi = createHttpClient('/courses', coreApi);
