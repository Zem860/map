// stores/cart.ts
import { create } from "zustand"
import type { CartItem, Step } from "@/type/cart"
import { getCart,postCart } from "@/api/folder_user/cart" // 👈 你要有 addCart(POST /cart)

type CartStore = {
  count: number
  carts: CartItem[]
  isLoading: boolean
  error?: unknown
  stepperContent: Step[]
  fetchCart: () => Promise<void>
  addToCart: (productId: string, qty?: number) => Promise<void>
}

export const useCartStore = create<CartStore>((set, get) => ({
  count: 0,
  carts: [],
  isLoading: false,
  stepperContent: [{ title: "Shopping Cart", description: "Review your selected items" }, { title: "Shipping Details", description: "Provide your shipping information" }, { title: "Payment", description: "Confirm your payment details" }],
  fetchCart: async () => {
    set({ isLoading: true, error: undefined })
    try {
      const res = await getCart()
      const carts = (res.data.data.carts ?? []) as CartItem[]
      set({
        carts,
        count: carts.reduce((sum, item) => sum + (item.qty ?? 0), 0),
        isLoading: false,
      })
    } catch (err) {
      set({ error: err, isLoading: false })
      throw err
    }
  },

  addToCart: async (productId, qty = 1) => {
    set({ isLoading: true, error: undefined })
    try {
      await postCart({ product_id:productId, qty: 1 }); // hexschool 格式
      await get().fetchCart()
      set({ isLoading: false })
    } catch (err) {
      set({ error: err, isLoading: false })
      throw err
    }
  },
}))
