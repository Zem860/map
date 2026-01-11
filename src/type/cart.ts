import type { productData } from "./product"
import type { couponData } from "./coupon"
export type cartData = {
    data: {
        product_id: string,
        qty: number,
        total: number,
        final_total: number,
        product: productData,
        id: string
    }
}

export type getCartData = {
    data: {
        product_id: string,
        qty: number,
        total: number,
        final_total: number,
        product: productData,
        id: string
    }
}


/** Cart 裡面的單筆 item */
export type CartItem = {
    id: string
    product_id: string
    qty: number
    total: number
    final_total: number
    product: productData
    coupon?: couponData
}

/** /cart 回傳的 data 區塊 */
export type CartData = {
    data: {
        carts: CartItem[]
        total: number
        final_total: number
    }
}
