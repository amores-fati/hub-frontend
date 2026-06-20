import { adminApi } from '..';
import { createHttpClient } from '../../../http-client';

export const adminVacanciesApi = createHttpClient('/vacancies', adminApi);
