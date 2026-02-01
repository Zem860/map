import { create } from "zustand"
import { getSingleOrder } from "@/api/folder_user/order"
import type { CustomerOrderResponse } from "@/type/response"
import type { UserInfo } from "@/type/order"
type OrderStore = {
    orderNum: string | null
    orderData: CustomerOrderResponse | null
    userData: UserInfo | null
    isLoading: boolean
    error?: unknown
    final_total: number | null
    fetchOrder: (orderId: string) => Promise<void>
    clearOrderData: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
    orderNum: null,
    orderData: null,
    userData: null,
    isLoading: false,
    error: undefined,
    final_total: null,

    fetchOrder: async (orderId: string) => {
        set({ isLoading: true, error: undefined })
        try {
            const order = await getSingleOrder(orderId);
            const orderFinalTotal = order.data.order.products
                ? Object.values(order.data.order.products).reduce(
                    (sum, item) => sum + (item.final_total || 0),
                    0
                )
                : 0;


            set({ orderData: order.data.order, userData: order.data.order.user, isLoading: false, final_total: orderFinalTotal })
        } catch (err) {
            set({ error: err, isLoading: false })
            throw err
        }
    },
    clearOrderData: () => set({ orderData: null, userData: null, orderNum: null, final_total: null }),
}))