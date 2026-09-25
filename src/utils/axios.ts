import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.twojadomena.pl',
  withCredentials: true, // Automatyczne przesyłanie ciasteczek HttpOnly
});

// Przechowujemy accessToken w zmiennej modułu, aby Axios miał do niego natychmiastowy dostęp
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Mechanizm kolejkowania zapytań podczas odświeżania tokena
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Interceptor dołączający Access Token do każdego żądania
api.interceptors.request.use((config) => {
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor obsługujący błędy 401 i ciche odświeżanie
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ignoruj błędy 401 z samych endpointów auth, aby uniknąć pętli
    const isAuthRequest = 
      originalRequest.url?.includes('/auth/refresh') || 
      originalRequest.url?.includes('/auth/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        // Jeśli inny proces już odświeża token, dodaj to zapytanie do kolejki
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Odświeżenie tokena (ciasteczko HttpOnly leci automatycznie)
        const response = await api.post('/auth/refresh');
        const newAccessToken = response.data.accessToken;

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);