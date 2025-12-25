
import axios from 'axios' ;
export const BASE_URL = import.meta.env.VITE_BASE_URL
export const API_PATH = import.meta.env.VITE_API_PATH


export const baseApi = axios.create({
      baseURL: `${BASE_URL}/v2/api/${API_PATH}`, 

})

// 我之後看看要不要只有admin加這條
baseApi.interceptors.request.use(
  (config) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );

    if (token) {
      // 六角後台只要純 token，不需要 Bearer
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
