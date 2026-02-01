import type { AxiosResponse } from "axios"
import type { CustomerOrderApiResponse } from "@/type/response"
import { baseApi } from "../api"

type getSingleOrderFunc = (orderId: string) => Promise<AxiosResponse<CustomerOrderApiResponse>>
export const getSingleOrder:getSingleOrderFunc = (orderId) => {
    return baseApi.get<CustomerOrderApiResponse>(`/order/${orderId}`)
}