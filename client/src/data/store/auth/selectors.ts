import { AppState } from '../index';

export const getCurrentUser = (state: AppState) => state.auth.user;