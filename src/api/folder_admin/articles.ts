import { baseApi } from '../api';
import type { AxiosResponse } from 'axios';
import type{ GetArticlesResponse, MesssageResponse } from '@/type/response';
import type { Article } from '@/type/articles';


type getArticlesFunc = (params:{page?:number})=>Promise<AxiosResponse<GetArticlesResponse>>
export const getArticles: getArticlesFunc = (params:{page?:number})=>baseApi.get('/admin/articles', {params})

type createArticleFunc = (params:Article)=>Promise<AxiosResponse<MesssageResponse>>
export const createArticle:createArticleFunc = (params:Article)=>baseApi.post('/admin/article', {data:params})