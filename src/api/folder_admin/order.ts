import { baseApi } from "../api";
import type { AxiosResponse } from "axios";
import type { OrdersResponse } from "../../type/response";
import type {MesssageResponse} from "@/type/response";
import type { ConfirmedOrder } from "@/type/order";

type getOrdersFunc = (params: { page?: string }) => Promise<AxiosResponse<OrdersResponse>>

export const getAdminOrders: getOrdersFunc = ({ page }) =>baseApi.get(`/admin/orders`, {
  params: {
    page
  }
})  

type deleteOrderFunc = (id:string) => Promise<AxiosResponse<MesssageResponse>>

export const deleteAdminOrders:deleteOrderFunc = (id:string) =>baseApi.delete(`/admin/order/${id}`)

type editOrderFunc = (id:string, params:ConfirmedOrder) => Promise<AxiosResponse<MesssageResponse>>

export const editAdminOrders:editOrderFunc = (id:string, params:ConfirmedOrder)=>baseApi.put(`/admin/order/${id}`, { data: params })