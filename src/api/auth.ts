import { apiClient } from './client';

export const loginApi = (email: string, password: string) =>
  apiClient('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const signupApi = (email: string, password: string) =>
  apiClient('/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

