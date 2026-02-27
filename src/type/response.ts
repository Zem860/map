import type { productData, PaginationData } from "./product";
import type { CartData, cartData, UpdateQtyParams } from "./cart";
import type { Order, OrderProductItem, UserInfo } from "./order";
import type { Article } from "./articles";
export type MesssageResponse = {
    success: boolean,
    message: string,
}

export type GetProductsResponse = {
    success: boolean,
    products: productData[],
    pagination: PaginationData,
    messages: string[]
}

export type GetProductResponse = {
    success: boolean,
    product: productData,
}

export type PostCartResponse = MesssageResponse & cartData;
export type UpdateCartResponse = MesssageResponse & UpdateQtyParams;
export type getCartResponse = MesssageResponse & CartData;

export type UploadImageResponse = {
    success: boolean,
    imageUrl: string,
}

export type OrderResponse = {
    total: string,
    create_at: string,
    orderId: string
}

export type GetOrderResponse = MesssageResponse & OrderResponse

export type OrdersResponse = {
    success: boolean;
    orders: Order[];
    pagination: PaginationData;
    messages: string[];
}


export type CustomerOrderResponse = {
    create_at: number;
    id: string;
    is_paid: boolean;
    paid_date: number;
    message: string;
    products: Record<string, OrderProductItem>;
    total: number;
    user: UserInfo;
}

export type CustomerOrderApiResponse = {
    success: boolean;
    order: CustomerOrderResponse;
}

export type GetArticlesResponse = {
    articles: Article[];
    total: number;
    pagination: PaginationData;
};

type couponResponse = {
    data: {
        final_total: number;
    }
}

export type ApplyCouponResponse = MesssageResponse & couponResponse;