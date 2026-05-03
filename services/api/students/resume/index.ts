import { studentsApi } from '..';
import { createHttpClient } from '../../../http-client';

export const studentResumeApi = createHttpClient('/me/resume', studentsApi);
