import { baseApi } from '..';
import { createHttpClient } from '../http-client';

export const coreApi = createHttpClient('/api', baseApi);
