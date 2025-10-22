import { apiClient } from './client';

export const loginApi = (data: { email: string, password: string }) =>
  apiClient('/login', {
    method: 'POST',
    body: JSON.stringify({ email: data.email, password: data.password }),
  });

export const signupApi = (data: User) =>
  apiClient('/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });

