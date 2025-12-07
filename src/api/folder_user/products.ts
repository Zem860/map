import { baseApi } from "../api";
import type { AxiosResponse } from "axios";
import type { GetProductsResponse } from "../../type/response";

export const getAllProducts = async (): Promise<AxiosResponse> => {
    return baseApi.get(`/products/all`);
}

type getProductFunc = (params:{page?:string, category?:string})=>Promise<AxiosResponse<GetProductsResponse>>

export const getProducts:getProductFunc = ({page,category} ) =>
  baseApi.get(`/products`, {
    params: {
    page,
    category
  }
  })
