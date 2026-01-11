import { baseApi } from "../api";
import type { AxiosResponse } from "axios";
import type { GetProductsResponse, GetProductResponse, GetOrderResponse } from "../../type/response";
import type { OrderParams } from "@/type/order";

export const getAllProducts = async (): Promise<AxiosResponse> => {
  return baseApi.get(`/products/all`);
}

type getProductsFunc = (params: { page?: string, category?: string }) => Promise<AxiosResponse<GetProductsResponse>>

export const getProducts: getProductsFunc = ({ page, category }) =>
  baseApi.get(`/products`, {
    params: {
      page,
      category
    }
  })


type getProductFunc = (id: string) => Promise<AxiosResponse<GetProductResponse>>

export const getProduct: getProductFunc = (id:string) => baseApi.get(`/product/${id}`)



type postUserInfoFunc = (params: OrderParams) => Promise<AxiosResponse<GetOrderResponse>>

export const postOrder: postUserInfoFunc = (params: OrderParams) =>
  baseApi.post('/order', params)
