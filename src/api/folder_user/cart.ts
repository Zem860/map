import type { PostCartResponse, getCartResponse } from "@/type/response"
import type { AxiosResponse } from "axios";
import { baseApi } from "../api";

type addToCartFunc = (params:{product_id:string, qty:number}) =>Promise<AxiosResponse<PostCartResponse>>

export const postCart:addToCartFunc = (params:{product_id:string, qty:number})=>baseApi.post('/cart', {data:params})

type getCartFunc= ()=>Promise<AxiosResponse<getCartResponse>>
export const getCart:getCartFunc = ()=>baseApi.get('/cart')
