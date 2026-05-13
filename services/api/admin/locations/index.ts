import { createHttpClient } from '@/services/http-client';
import { coreApi } from '../..';

export const adminLocationsApi = createHttpClient('/admins/locations', coreApi);
