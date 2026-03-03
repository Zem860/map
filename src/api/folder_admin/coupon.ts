import { baseApi } from '../api';
import type { AxiosResponse } from 'axios';
import type { GetCouponResponse, MesssageResponse } from '@/type/response';
import type { couponData } from '@/type/coupon';

type getCouponFunc = (params:{page?:number})=>Promise<AxiosResponse<GetCouponResponse>>
export const getCoupons: getCouponFunc = (params: { page?: number }) =>
  baseApi.get('/admin/coupons', { params });

type createCouponFunc = (params:couponData)=>Promise<AxiosResponse<MesssageResponse>>
export const createCoupon:createCouponFunc = (params:couponData)=>baseApi.post('/admin/coupon', {data:params})

type editCouponFunc = (id:string, params:couponData)=>Promise<AxiosResponse<MesssageResponse>>
export const editCoupon: editCouponFunc = (id, params) =>
  baseApi.put(`/admin/coupon/${id}`, { data: params })