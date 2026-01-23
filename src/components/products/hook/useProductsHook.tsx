// src/hooks/useProducts.ts
import { useCallback, useEffect, useState } from "react"
import { getProducts, createProduct, editProduct, deleteProduct } from "@/api/folder_admin/products"
import type { productData, ProductDataResponse, PaginationData, SearchData } from "@/type/product"
import { getCategoryCombos } from "@/helper/tool"
import { useConfirm } from "./useConfirm"

export const useProducts = () => {
  const [products, setProducts] = useState<productData[] | undefined>(undefined)
  const [pagination, setPagination] = useState<PaginationData | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<productData | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  const [searchData, setSearchData] = useState<SearchData>({
    page: 1,
    category: "",
    title: "",
  })

  const confirmModal = useConfirm()
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const list = await getCategoryCombos()
        setCategories(list)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCategories()
  }, [])

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
    }).format(price)
  }, [])

  const handleCategoryChange = useCallback((category: string) => {
    setSearchData((prev) => ({ ...prev, category, page: 1 })) // 切分類通常回到第1頁
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setSearchData((prev) => ({ ...prev, page }))
  }, [])

  const handleTitleChange = useCallback((title: string) => {
    setSearchData((prev) => ({ ...prev, title, page: 1 }))
  }, [])

  const openCreateModal = useCallback(() => {
    setCurrentProduct(null)
    setMode("create")
    setIsModalOpen(true)
  }, [])

  const openEditModal = useCallback((item: productData) => {
    setCurrentProduct(item)
    setMode("edit")
    setIsModalOpen(true)
  }, [])

  const getProduct = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page: String(searchData.page), category: searchData.category }
      const res = await getProducts(params)
      const data: ProductDataResponse = res.data

      if (searchData.title?.trim()) {
        const keyword = searchData.title.trim().toLowerCase()
        setProducts(data.products.filter((p) => p.title.toLowerCase().includes(keyword)))
      } else {
        setProducts(data.products)
      }

      setPagination(data.pagination)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }, [searchData.page, searchData.category, searchData.title])

  useEffect(() => {
    getProduct()
  }, [getProduct])

  const saveProduct = useCallback(
    async (product: productData) => {
      if (mode === "create") {
        await createProduct(product)
      } else {
        await editProduct(product.id, product)
      }
      await getProduct()
    },
    [mode, getProduct],
  )

  const removeProduct = useCallback(
    async (id: string) => {
      await deleteProduct(id)
      await getProduct()
    },
    [getProduct],
  )

  const askDelete = useCallback((id: string, title: string) => {
    confirmModal.confirm(
      {
        title: "確認刪除",
        message: `您確定要刪除「${title}」嗎？此操作無法復原。`,
      },
      () => removeProduct(id)
    )
  }, [confirmModal, removeProduct])

  const askSave = useCallback((product: productData) => {
    const isCreate = mode === "create"
    confirmModal.confirm(
      {
        title: isCreate ? "確認新增" : "確認修改",
        message: isCreate
          ? `確定要建立新產品「${product.title}」嗎？`
          : `確定要儲存對「${product.title}」的變更嗎？`,
        onSuccess: () => setIsModalOpen(false), // 成功後關閉 ProductModal
      },
      () => saveProduct(product)
    )
  }, [mode, confirmModal, saveProduct])

  return {
    // data
    products,
    pagination,
    categories,
    isLoading,
    searchData,

    // modal
    isModalOpen,
    setIsModalOpen,
    currentProduct,
    mode,

    // actions
    formatPrice,
    handleCategoryChange,
    handlePageChange,
    handleTitleChange,
    openCreateModal,
    openEditModal,
    askDelete,  // ✅ 改用這個
    askSave,    // ✅ 改用這個
    refresh: getProduct,

    // ✅ confirm modal 狀態
    confirmModal,
  }
}
