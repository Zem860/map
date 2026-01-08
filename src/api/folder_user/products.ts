import { baseApi } from "../api";
import type { AxiosResponse } from "axios";
import type { GetProductsResponse, GetOrderResponse } from "../../type/response";
import type { OrderParams } from "@/type/order";

export const getAllProducts = async (): Promise<AxiosResponse> => {
  return baseApi.get(`/products/all`);
}

type getProductFunc = (params: { page?: string, category?: string }) => Promise<AxiosResponse<GetProductsResponse>>

export const getProducts: getProductFunc = ({ page, category }) =>
  baseApi.get(`/products`, {
    params: {
      page,
      category
    }
  })



type postUserInfoFunc = (params: OrderParams) => Promise<AxiosResponse<GetOrderResponse>>

export const postOrder: postUserInfoFunc = (params: OrderParams) =>
  baseApi.post('/order', params)
