import type { productData, PaginationData } from "./product";
export type MesssageResponse = {

    success:boolean,
    message:string,
    
}

export type GetProductsResponse = {
success:boolean,
products:productData[],
pagination:PaginationData,
messages:string[]
}


export type UploadImageResponse = {
    success:boolean,
    imageUrl:string,
}