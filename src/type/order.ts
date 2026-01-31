import type { productData } from "./product"
export type OrderUser = {
    name: string
    email: string
    tel: string
    address: string
}

export type OrderData = {
    user: OrderUser,
    message: string
}

export type OrderParams = {
    data: OrderData
}
//--------------------admin---------------------
export type OrderItem = {
    final_total:number;
    id:string;
    product:productData;
    qty:number;
    total:string;
}

export type UserInfo = {
    address:string,
    email:string,
    name:string,
    tel:string,
}

export type Order={
    create_at:string,
    id:string,
    is_paid:boolean,
    message:string;
    products:Record<string, OrderItem>;
    total:string;
    user:UserInfo;
    num:string;
}