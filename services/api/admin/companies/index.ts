import { createHttpClient } from '@/services/http-client';

import { coreApi } from '../..';

export const adminCompaniesApi = createHttpClient('/companies', coreApi);
