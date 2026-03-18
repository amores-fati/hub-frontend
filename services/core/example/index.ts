import { coreApi } from '..';
import { createHttpClient } from '../../http-client';

export const examplesApi = createHttpClient('/examples', coreApi);
