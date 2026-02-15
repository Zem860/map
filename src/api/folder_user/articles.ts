import type { AxiosResponse } from "axios";
import type { Article } from "@/type/articles";

import { baseApi } from "../api";

type getArticlesFunc = (params:{page?:number})=>Promise<AxiosResponse<GetArticlesResponse>>
export const getArticles:getArticlesFunc = (params:{page?:number})=>baseApi.get('/articles', {params})

type getSingleArticleFunc = (id:string)=>Promise<AxiosResponse<{article:Article}>>
export const getSingleArticle:getSingleArticleFunc = (id:string)=>baseApi.get(`/article/${id}`)