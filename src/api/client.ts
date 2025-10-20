export const BASE_URL = 'http://10.0.2.2:3333/api/v1';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const apiClient = async (url: string, options: RequestInit = {}) => {
  console.log(`${BASE_URL}${url}`)
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const message = await res.text();
    console.log("message", message)
    throw new Error(message || 'API Error');
  }

  return res.json();
};

