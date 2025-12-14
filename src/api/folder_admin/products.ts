import { baseApi } from "../api";
import type { AxiosResponse } from "axios";
import type { GetProductsResponse } from "../../type/response";


export const getAllProducts = async (): Promise<AxiosResponse> => {
    return baseApi.get(`/admin/products/all`);
}

type getProductFunc = (params:{page?:string, category?:string})=>Promise<AxiosResponse<GetProductsResponse>>

export const getProducts:getProductFunc = ({page,category} ) =>
  baseApi.get(`/admin/products`, {
    params: {
    page,
    category
  }
  })
