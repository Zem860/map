// stores/cart.ts
import { create } from "zustand"
import type { CartItem, Step, UpdateQtyParams } from "@/type/cart"
import { getCart,postCart,deleteProductFromCartFunc, updateCartQtyFunc, clearCart } from "@/api/folder_user/cart" 

type CartStore = {
  count: number
  carts: CartItem[]
  isLoading: boolean
  error?: unknown
  stepperContent: Step[]
  fetchCart: () => Promise<void>
  addToCart: (productId: string, qty?: number) => Promise<void>
  removeFromCart:(product_id:string)=> Promise<void>
  editCartNum:({product_id, qty}: UpdateQtyParams)=>Promise<void>
  clearCart:()=>Promise<void>
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
      await postCart({ product_id:productId, qty });
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
  editCartNum: async ({product_id, qty}: UpdateQtyParams) => {
    set({ isLoading: true, error: undefined })
    try{
      if(qty < 1) {
        // await deleteProductFromCartFunc(product_id)
        return;
      } else {
        await updateCartQtyFunc({ product_id, qty });
      }
      await get().fetchCart()
      set({ isLoading: false })
    }
    catch(err){
      set({ error: err, isLoading: false })
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
