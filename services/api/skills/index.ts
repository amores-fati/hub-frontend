import { coreApi } from '..';
import { createHttpClient } from '../../http-client';

export const skillsApi = createHttpClient('/skills', coreApi);
