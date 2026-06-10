import { companiesApi } from '..';
import { createHttpClient } from '../../../http-client';

export const companyVacanciesApi = createHttpClient(
    '/me/vacancies',
    companiesApi,
);
