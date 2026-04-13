import { coreApi } from '..';
import { createHttpClient } from '../../http-client';

export const studentsApi = createHttpClient('/students', coreApi);
