import axios from 'axios';
import type { UserLoginInput, CheckResponse } from '@/type/user';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const adminApi = axios.create({
  baseURL: BASE_URL,
});

adminApi.interceptors.request.use(
  (request) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );

    if (token) {
      request.headers['Authorization'] = token;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error.response.data);
  }
);

export const apiUserLogin = (params: UserLoginInput) =>
  adminApi.post('admin/signin', params);

export const apiUserLogout = () => adminApi.post('logout');

export const isTokenValid = () =>
  adminApi.post<CheckResponse>('api/user/check');
