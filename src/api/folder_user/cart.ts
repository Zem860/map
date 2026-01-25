import type { MesssageResponse, PostCartResponse, getCartResponse } from "@/type/response"
import type { AxiosResponse } from "axios";
import { baseApi } from "../api";

type addToCartFunc = (params:{product_id:string, qty:number}) =>Promise<AxiosResponse<PostCartResponse>>

export const postCart:addToCartFunc = (params:{product_id:string, qty:number})=>baseApi.post('/cart', {data:params})

type getCartFunc= ()=>Promise<AxiosResponse<getCartResponse>>
export const getCart:getCartFunc = ()=>baseApi.get('/cart')

type deleteProductFromCartFunc = (product_id:string)=>Promise<AxiosResponse<MesssageResponse>>
export const deleteProductFromCartFunc:deleteProductFromCartFunc =(product_id:string)=>baseApi.delete(`/cart/${product_id}`)
