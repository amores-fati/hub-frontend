import { coreApi } from '..';
import { createHttpClient } from '../../http-client';

export const coursesApi = createHttpClient('/courses', coreApi);
