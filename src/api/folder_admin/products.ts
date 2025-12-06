import { baseApi } from "../api";
import type { AxiosResponse } from "axios";

export const getAllProducts = async (): Promise<AxiosResponse> => {
    return baseApi.get(`/admin/products/all`);
}