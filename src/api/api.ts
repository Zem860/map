
import axios from 'axios' ;
export const BASE_URL = import.meta.env.VITE_BASE_URL
export const API_PATH = import.meta.env.VITE_API_PATH


export const baseApi = axios.create({
      baseURL: `${BASE_URL}/v2/api/${API_PATH}`, 
})

// 我之後看看要不要只有admin加這條
// 改成只有特定 API 端點才帶 token
baseApi.interceptors.request.use(
  (config) => {
    // 只有 admin 路徑才使用 cookie 中的 token
    if (config.url?.includes('/admin')) {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      if (token) {
        config.headers.Authorization = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);