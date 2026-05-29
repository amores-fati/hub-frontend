import { coreApi } from '../..';
import { createHttpClient } from '../../../http-client';

export const adminDashboardApi = createHttpClient('/admins', coreApi);
