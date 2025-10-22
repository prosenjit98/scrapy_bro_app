import { API_URL } from "@/constants";
import { useSnackbarStore } from "@/stores/hooks/useSnackbarStore";
import axios from "axios";

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

const apiClientAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// ✅ Add token automatically
apiClientAxios.interceptors.request.use(
  async (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Global error handler
apiClientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const showSnackbar = useSnackbarStore.getState().showSnackbar
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Something went wrong'
      showSnackbar(message, 'error')
    } else {
      showSnackbar('Network error. Please check your connection.', 'error')
    }
    return Promise.reject(error)
  }
)

export default apiClientAxios

