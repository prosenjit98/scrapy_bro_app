import { apiClient } from './client';

export const loginApi = (email: string, password: string) =>
  apiClient('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const signupApi = (data: User) =>
  apiClient('/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });

