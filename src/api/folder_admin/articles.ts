import { baseApi } from '../api';
import type { AxiosResponse } from 'axios';
import type{ GetArticlesResponse } from '@/type/response';


type getArticlesFunc = (params:{page?:number})=>Promise<AxiosResponse<GetArticlesResponse>>
export const getArticles: getArticlesFunc = (params:{page?:number})=>baseApi.get('/articles', {params})