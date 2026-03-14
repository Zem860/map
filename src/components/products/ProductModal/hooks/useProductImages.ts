import { useEffect, useRef, useState, type ChangeEvent } from "react"
import type { UseImageArgs } from "@/type/product"
import { uploadImage } from "@/api/folder_admin/products"

type ProductImageSource = {
  imagesUrl?: string[]
  image?: string
}

export function useProductImages({
  item,
  isOpen,
  maxImages = 4,
}: UseImageArgs) {
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalCount = uploadedImages.length + selectedFiles.length
  const isMax = totalCount >= maxImages

  const normalizeImages = (target?: ProductImageSource): string[] => {
    if (!target) return []

    if (Array.isArray(target.imagesUrl)) {
      return target.imagesUrl.filter((u) => !!u)
    }

    if (target.image) {
      return [target.image].filter((u) => !!u)
    }

    return []
  }
  // Reset image states when modal opens or item changes and cleanup preview blobs
  useEffect(() => {
    const timer = setTimeout(() => {
      setUploadedImages(normalizeImages(item as ProductImageSource | undefined))
      setImageUrlInput("")
      setSelectedFiles([])
      setSelectedPreviews((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p))
        return []
      })

      if (fileInputRef.current) fileInputRef.current.value = ""
    }, 0)

    return () => clearTimeout(timer)

  }, [isOpen, item])

  useEffect(() => {
    return () => {
      selectedPreviews.forEach((p) => URL.revokeObjectURL(p))
    }
  }, [selectedPreviews])

  const triggerFileInput = () => fileInputRef.current?.click()

  const addImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    if (isMax) return

    setUploadedImages((prev) => [...prev, url].slice(0, maxImages))
    setImageUrlInput("")
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (isMax) {
      alert(`最多只能 ${maxImages} 張圖片`)
      return
    }

    setSelectedFiles((prev) => [...prev, file])
    setSelectedPreviews((prev) => [...prev, URL.createObjectURL(file)])

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const deleteUrlImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const deleteSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setSelectedPreviews((prev) => {
      const target = prev[index]
      if (target) URL.revokeObjectURL(target)
      return prev.filter((_, i) => i !== index)
    })
  }

  const uploadSelectedFiles = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const file of selectedFiles) {
      const res = await uploadImage(file)
      const imageUrl = res.data?.imageUrl
      if (!imageUrl) throw new Error("upload 沒回傳 imageUrl")
      urls.push(imageUrl)
    }
    return urls
  }

  const clearAllImages = () => {
    setUploadedImages([])
    setSelectedFiles([])
    setSelectedPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p))
      return []
    })
    setImageUrlInput("")

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return {
    imageUrlInput,
    uploadedImages,
    selectedFiles,
    selectedPreviews,

    totalCount,
    isMax,
    fileInputRef,

    setImageUrlInput,
    addImageUrl,
    handleFileChange,
    triggerFileInput,
    deleteUrlImage,
    deleteSelectedFile,

    uploadSelectedFiles,
    clearAllImages,
  }
}