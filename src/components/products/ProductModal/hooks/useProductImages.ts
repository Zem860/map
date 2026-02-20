// src/features/products/hooks/useProductImages.ts
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import type { UseImageArgs } from "@/type/product"
import { uploadImage } from "@/api/folder_admin/products"


export function useProductImages({
  item,
  isOpen,
  maxImages = 4,
}: UseImageArgs) {
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([]) // existing URLs
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]) // waiting to upload
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]) // blob urls

  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalCount = uploadedImages.length + selectedFiles.length
  const isMax = totalCount >= maxImages

  // 保證圖片在打開或關閉的情況會清理掉原來的檔案
  useEffect(() => {
    if (item) {
      setUploadedImages((item.imagesUrl || []).filter((u) => u !== ""))
    } else {
      setUploadedImages([])
    }

    setImageUrlInput("")
    setSelectedFiles([])
    setSelectedPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p))
      return []
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [isOpen])

  // 只要preview那個有變動的話記得要把blob清掉因為blob會站瀏覽器記憶體
  useEffect(() => {
    return () => {
      selectedPreviews.forEach((p) => URL.revokeObjectURL(p))
    }
  }, [selectedPreviews])

  const triggerFileInput = () => fileInputRef.current?.click() //瀏覽器預設function->點選上傳檔案的input觸發選取檔案，ref與function直接抓取該頁面，Input

  //用於新增連結
  const addImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    if (isMax) return

    setUploadedImages((prev) => [...prev, url].slice(0, maxImages))
    setImageUrlInput("")
  }
  //用於檔案上傳
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (isMax) {
      alert(`最多只能 ${maxImages} 張圖片`)
      return
    }

    setSelectedFiles((prev) => [...prev, file])
    setSelectedPreviews((prev) => [...prev, URL.createObjectURL(file)])

    // input file的行為特性是，如果我把檔案刪掉了(選同一個檔案兩次)~他不會讓我onChange感應到
    if (fileInputRef.current) fileInputRef.current.value = ""
  }
  //刪除連結圖片
  const deleteUrlImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }
  //刪除檔案
  const deleteSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setSelectedPreviews((prev) => {
      const target = prev[index]
      if (target) URL.revokeObjectURL(target)
      return prev.filter((_, i) => i !== index)
    })
  }

  //Save 才 upload，回傳「upload 後 URL」陣列（不含你手動貼的 URL） 
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

  //用於未來可能會有清除按鈕
  // const clearSelectedFiles = () => {
  //   setSelectedFiles([])
  //   setSelectedPreviews((prev) => {
  //     prev.forEach((p) => URL.revokeObjectURL(p))
  //     return []
  //   })
  //   if (fileInputRef.current) fileInputRef.current.value = ""
  // }

  /** ✅ 全清：連結(URL) + blob + input 都清掉 */
  const clearAllImages = () => {
    // 1) 清 URL 圖
    setUploadedImages([])

    // 2) 清本次選檔（blob）
    setSelectedFiles([])
    setSelectedPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p))
      return []
    })

    // 3) 清 URL input
    setImageUrlInput("")

    // 4) reset file input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return {
    // state
    imageUrlInput,
    uploadedImages,
    selectedFiles,
    selectedPreviews,

    // derived
    totalCount,
    isMax,
    fileInputRef,

    // actions
    setImageUrlInput,
    addImageUrl,
    handleFileChange,
    triggerFileInput,
    deleteUrlImage,
    deleteSelectedFile,

    uploadSelectedFiles,
    // clearSelectedFiles,
    clearAllImages, 
  }
}
