// ==========================================
// TypeScript 練習題目 - 商品 API 請求函式
// ==========================================

// 🎯 練習目標：
// 1. 學習函式型別定義
// 2. 理解泛型 (Generic) 的使用
// 3. 熟悉 Promise 和 AxiosResponse 的型別

// 📝 練習說明：
// 請為以下函式加上正確的 TypeScript 型別註解
// 提示：需要從 @/types/product 匯入相關型別

// TODO: 匯入型別定義
// 提示：需要匯入 CreateProductParams, CreateProductResponse 等型別
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const adminApi = axios.create({
  baseURL: BASE_URL,
})

adminApi.interceptors.request.use(
  (request) => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')

    if (token) {
      request.headers['Authorization'] = token
    }

    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

adminApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  (error) => {
    return Promise.reject(error.response.data)
  },
)

export const apiUserLogin = (params:{username:string, password:string})=>adminApi.post(`admin/signin`, params)
export const apiUserLogout = () => adminApi.post(`/logout`)



