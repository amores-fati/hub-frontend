import { coreApi } from '../..';
import { createHttpClient } from '../../../http-client';

export const adminDashboardApi = createHttpClient('/admin/dashboard', coreApi);
