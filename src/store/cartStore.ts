// stores/cart.ts
import { create } from "zustand"
import type { CartData, CartItem, Step, UpdateQtyParams } from "@/type/cart"
import { getCart,postCart,deleteProductFromCartFunc, updateCartQtyFunc, clearCart } from "@/api/folder_user/cart" 
import { useToastStore } from "./toastStore"
type CartStore = {
  count: number
  carts: CartData
  isLoading: boolean
  error?: unknown
  stepperContent: Step[]
  fetchCart: (silent?: boolean) => Promise<void>
  addToCart: (productId: string, qty?: number) => Promise<void>
  removeFromCart:(product_id:string)=> Promise<void>
  editCartNum:(id: string, params: UpdateQtyParams)=>Promise<void>
  clearCart:()=>Promise<void>
}

export const useCartStore = create<CartStore>((set, get) => ({
  count: 0,
  carts: { data: { carts: [], total: 0, final_total: 0 } },
  isLoading: false,
  stepperContent: [{ title: "Shopping Cart", description: "Review your selected items" }, { title: "Shipping Details", description: "Provide your shipping information" }, { title: "Payment Confirm", description: "Confirm your payment details" }],
  fetchCart: async (silent = false) => {
    if (!silent) {
      set({ isLoading: true, error: undefined })
    }
    try {
      const res = await getCart()
      const cartContent = (res.data.data.carts ?? []) as CartItem[]
      const total = res.data.data.total ?? 0
      const final_total = res.data.data.final_total ?? 0
      set({
        carts: { data: { carts: cartContent, total, final_total } },
        count: cartContent.reduce((sum, item) => sum + (item.qty ?? 0), 0),
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
      await postCart({ product_id:productId, qty });
      const addToast = useToastStore.getState().addToast;
      addToast("add to cart", "book", "success");
      await get().fetchCart()
      set({ isLoading: false })
    } catch (err) {
      set({ error: err, isLoading: false })
      throw err
    }
  },
  removeFromCart:async (product_id:string)=>{
    set({isLoading:true, error:undefined})
    try{
      await deleteProductFromCartFunc(product_id)
      await get().fetchCart()
      set({isLoading:false})
    }catch(err){
      set({error:err, isLoading:false})
      throw err
    }    
  },
  editCartNum: async (id: string, { product_id, qty }: UpdateQtyParams) => {
    // 不設置全局 isLoading，由呼叫端自行處理 loading 狀態
    try{
      if(qty < 1) {
        return;
      } else {
        await updateCartQtyFunc(id, { product_id, qty });
      }
      // 使用 silent mode 不觸發全局 loading
      await get().fetchCart(true)
    }
    catch(err){
      set({ error: err })
      throw err 
    }
  },
  clearCart:async()=>{
    set({isLoading:true, error:undefined})
    try{
      await clearCart()
      await get().fetchCart()
      set({isLoading:false})
    }catch(err){
      set({error:err, isLoading:false})
      throw err
    }
  }
}))
