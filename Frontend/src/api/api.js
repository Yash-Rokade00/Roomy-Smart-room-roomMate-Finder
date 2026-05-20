import axios from 'axios';
import EncrypStorage from 'react-native-encrypted-storage';
import { triggerLogout } from '../utils/logoutHelper';
import { useContext } from 'react';
import { AuthContext } from '../../context';

const API = axios.create({
  baseURL: 'http://10.65.161.33:3030',
});

API.interceptors.request.use(
  async config => {
    try {
      const token = await EncrypStorage.getItem('userAccessToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (err) {
      return Promise.reject(err);
    }
  },
  error => Promise.reject(error),
);

//const { tokenError } = useContext(AuthContext);
//console.log(tokenError);

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await EncrypStorage.getItem('userRefreshToken');

        if (!refreshToken) {
          await EncrypStorage.clear();
          triggerLogout();
          return Promise.reject(error);
        }

        const res = await axios.post('http://10.65.161.33:3030/auth/refresh', {
          refreshToken,
        });

        const newAccessToken = res?.data?.accessToken;
        await EncrypStorage.setItem('userAccessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (error) {
        await EncrypStorage.clear();
        triggerLogout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default API;
