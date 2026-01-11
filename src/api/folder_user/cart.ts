import type { PostCartResponse } from "@/type/response"
import type { AxiosResponse } from "axios";
import { baseApi } from "../api";

type addToCartFunc = (params:{product_id:string, qty:number}) =>Promise<AxiosResponse<PostCartResponse>>

export const postCart:addToCartFunc = (params:{product_id:string, qty:number})=>baseApi.post('/cart', {data:params})
