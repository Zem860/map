import { create } from "zustand"
import type { productData,PaginationData, PaginationParam } from "@/type/product"
import { getAllProducts, getProducts } from "@/api/folder_user/products"

type ProductStore = {
    products: productData[],
    pagination: PaginationData,
    flexProducts: productData[],
    isLoading: boolean,
    isCategoryLoading: boolean,
    error?: unknown
    fetchAllProduct: () => Promise<void>
    fetchByCategory: (param: PaginationParam) => Promise<void>
}


export const useProductStore = create<ProductStore>((set, get) => ({
    isLoading: false,
    isCategoryLoading: false,
    pagination: {} as PaginationData,
    flexProducts: [],      // 目前畫面上顯示的資料（可能是全抓的，也可能是分頁的）
    products: [],
    fetchAllProduct: async () => {
        set({ isCategoryLoading: true, error: undefined })
        try {
            const res = await getAllProducts();
            console.log(res)
            set({ products: Object.values(res.data.products), 
                
                 isCategoryLoading: false })
        } catch (err) {
            set({ error: err, isCategoryLoading: false })
        }
    },
    fetchByCategory: async({category, page=1}:PaginationParam)=>{
        set({ isLoading: true, error: undefined })
        try {
            const res = await getProducts({category, page: String(page)});         
            set({ flexProducts: res.data.products, isLoading: false, pagination: res.data.pagination })
            
        } catch (err) {
            set({ error: err, isLoading: false })
    }
    }
}))