import { create } from "zustand"
import type { productData } from "@/type/product"
import { getAllProducts } from "@/api/folder_user/products"


type ProductStore = {
    products: productData[],
    isLoading: boolean,
    error?: unknown
    fetchAllProduct: () => Promise<void>
}


export const useProductStore = create<ProductStore>((set, get) => ({
    isLoading: false,
    products: [],
    fetchAllProduct: async () => {
        set({ isLoading: true, error: undefined })
        try {
            const res = await getAllProducts();
            console.log(res)
            set({ products: Object.values(res.data.products), isLoading: false })
        } catch (err) {
            set({ error: err, isLoading: false })
        }

    }
}))