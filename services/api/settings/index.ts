import { coreApi } from '..';
import { createHttpClient } from '../../http-client';

export const settingsApi = createHttpClient('/settings', coreApi);

export * from './mutations';
export * from './queries';
