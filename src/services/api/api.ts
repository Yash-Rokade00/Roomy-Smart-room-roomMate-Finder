import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { triggerLogout } from '../../utils/logoutHelper';

const API = axios.create({
  baseURL: 'http://10.65.161.33:3030',
});

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await EncryptedStorage.getItem('userAccessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (err) {
      return Promise.reject(err);
    }
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry once if token expired (403 forbidden)
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await EncryptedStorage.getItem('userRefreshToken');

        if (!refreshToken) {
          await EncryptedStorage.clear();
          triggerLogout();
          return Promise.reject(error);
        }

        const res = await axios.post('http://10.65.161.33:3030/auth/refresh', {
          refreshToken,
        });

        const newAccessToken = res?.data?.accessToken;
        if (newAccessToken) {
          await EncryptedStorage.setItem('userAccessToken', newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.log('Refresh token failed:', refreshError);
        await EncryptedStorage.clear();
        triggerLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default API;
