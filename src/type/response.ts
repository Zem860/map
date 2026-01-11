import type { productData, PaginationData } from "./product";
import type { cartData } from "./cart";
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

export type PostCartResponse = MesssageResponse & cartData



export type UploadImageResponse = {
    success: boolean,
    imageUrl: string,
}




export type OrderResponse = {
    total:string,
    create_at:string,
    orderId:string
}

export type GetOrderResponse  = MesssageResponse & OrderResponse
