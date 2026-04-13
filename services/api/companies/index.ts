import { coreApi } from '..';
import { createHttpClient } from '../../http-client';

export const companiesApi = createHttpClient('/companies', coreApi);
