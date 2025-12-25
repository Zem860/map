import { baseApi } from "../api";
import type { AxiosResponse } from "axios";
import type { GetProductsResponse, MesssageResponse } from "../../type/response";
import type { CreateProductParams, UploadImageResponse } from "@/type/product";


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

type createProductFunc = (params:CreateProductParams)=>Promise<AxiosResponse<MesssageResponse>>
export const createProduct:createProductFunc = (params)=>baseApi.post(`/admin/product`,{data:params})

type uploadImageFunc = (file:File)=>Promise<AxiosResponse<UploadImageResponse>>
export const uploadImage:uploadImageFunc =(file:File)=>{
  const form = new FormData()
  form.append("file-to-upload", file)
  return baseApi.post("/admin/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}

type editProductFunc = (id:string, params:CreateProductParams)=>Promise<AxiosResponse<MesssageResponse>>

export const editProduct: editProductFunc = (id, params) =>
  baseApi.put(`/admin/product/${id}`, { data: params })

type deleteProductFunc = (id:string) =>Promise<AxiosResponse<MesssageResponse>>

export const deleteProduct:deleteProductFunc = (id:string) => baseApi.delete(`/admin/product/${id}`)
