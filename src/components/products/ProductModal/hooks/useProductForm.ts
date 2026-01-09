// src/features/products/hooks/useProductForm.ts
import { useEffect, useState, type ChangeEvent } from "react"
import type { productData } from "@/type/product"

const EMPTY_PRODUCT = (): productData => ({
  id: "",
  title: "",
  origin_price: 0,
  price: 0,
  category: "",
  unit: "",
  num: 0,
  content: "",
  description: "",
  is_enabled: 1,
  imageUrl: "",
  imagesUrl: [""],
  rating:0
})

type UseProductFormArgs = {
  product?: productData
  isOpen: boolean
}

export function useProductForm({ product, isOpen }: UseProductFormArgs) {
  const [formData, setFormData] = useState<productData>(() =>
    product ? product : EMPTY_PRODUCT()
  )

  useEffect(() => {
    setFormData(product ? product : EMPTY_PRODUCT())
  }, [product, isOpen])

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "origin_price" || name === "price" || name === "num" || name=="rating"
          ? Number(value)
          : value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_enabled: checked ? 1 : 0 }))
  }

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSwitchChange,
  }
}
