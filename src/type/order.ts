import type { productData } from "./product"
import type { couponData } from "./coupon"
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

export type OrderProductItem = {
    coupon: couponData | null;
    final_total: number;
    id: string;
    product: productData;
    product_id: string;
    qty: number;
    total: number;
}

export type UserFormValues = {
    firstName: string;
    lastName: string;
    tel: string;
    email: string;
    country: string;
    city: string;
    address: string;
    message: string;
};

//--------------------admin---------------------
export type OrderItem = {
    final_total: number;
    id: string;
    product: productData;
    qty: number;
    total: string;
}

export type UserInfo = {
    address: string,
    email: string,
    name: string,
    tel: string,
}

export type Order = {
    create_at: string,
    id: string,
    is_paid: boolean,
    message: string;
    products: Record<string, OrderItem>;
    total: string;
    user: UserInfo;
    num: string;
}

//給putAPI

export type ConfirmedOrderProduct = {
    id: string;
    product_id: string;    
    qty: number;           
}

export type ConfirmedOrder = {
    create_at: string,
    id: string,
    is_paid: boolean,
    message: string;
    products: Record<string, ConfirmedOrderProduct>;
    user: UserInfo;
    num: string;
}


export type OrderModalProps = {
  isOpen: boolean;
  order?: ConfirmedOrder | null;
  setIsOpen: (isOpen: boolean) => void;
  handleAskSave:(data:ConfirmedOrder)=>void
};

 export  type Confirmtype = {
   isOpen: boolean;
   title: string;
   message: string;
   isLoading?: boolean;
   error?:string;
   onConfirm: () => void | Promise<void>; // 這裡定義為函式類型
 };
