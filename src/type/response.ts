import type { productData, Pagination } from "./product";
export type MesssageResponse = {

    success:boolean,
    message:string,
    
}

export type GetProductsResponse = {
success:boolean,
products:productData[],
pagination:Pagination,
messagesss:unknown[]
}


export type UploadImageResponse = {
    success:boolean,
    imageUrl:string,
}