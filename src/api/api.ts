
import axios from 'axios' ;
export const BASE_URL = import.meta.env.VITE_BASE_URL
export const API_PATH = import.meta.env.VITE_API_PATH


export const baseApi = axios.create({
      baseURL: `${BASE_URL}/v2/api/${API_PATH}`, 

})
