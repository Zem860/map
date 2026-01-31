import type { MesssageResponse, PostCartResponse, UpdateCartResponse, getCartResponse } from "@/type/response"
import type { AxiosResponse } from "axios";
import { baseApi } from "../api";
import type { UpdateQtyParams } from "@/type/cart";

type addToCartFunc = (params:{product_id:string, qty:number}) =>Promise<AxiosResponse<PostCartResponse>>

export const postCart:addToCartFunc = (params:UpdateQtyParams)=>baseApi.post('/cart', {data:params})

type getCartFunc= ()=>Promise<AxiosResponse<getCartResponse>>
export const getCart:getCartFunc = ()=>baseApi.get('/cart')

type deleteProductFromCartFunc = (product_id:string)=>Promise<AxiosResponse<MesssageResponse>>
export const deleteProductFromCartFunc:deleteProductFromCartFunc =(product_id:string)=>baseApi.delete(`/cart/${product_id}`)

type updateCartQtyFunc = (id:string, params:UpdateQtyParams)=>Promise<AxiosResponse<UpdateCartResponse>>
export const updateCartQtyFunc = (id:string, params:UpdateQtyParams)=>baseApi.put(`/cart/${id}`, {data:params})

type clearCartFunc = ()=>Promise<AxiosResponse<MesssageResponse>>
export const clearCart:clearCartFunc = ()=>baseApi.delete('/carts')