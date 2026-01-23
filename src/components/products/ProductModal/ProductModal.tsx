// src/features/products/components/ProductModal.tsx
import { X, LinkIcon, FileInput } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Switch } from "../../ui/switch"
import { Textarea } from "../../ui/textarea"
import type { productData, ProductModalProps } from "@/type/product"
import { useState } from "react"
import { useProductForm } from "./hooks/useProductForm"
import { useProductImages } from "./hooks/useProductImages"
import { buildProductPayload } from "./utils/product.mapper"
import DatePicker from "@/components/util/DatePicker"

export const ProductModal = ({
  isOpen,
  onOpenChange,
  product,
  onSave,
  mode = "create",
}: ProductModalProps) => {
  const [isSaving, setIsSaving] = useState(false)

  const normalizedProduct = product ?? undefined

  const { formData, handleInputChange, handleSwitchChange } = useProductForm({
    product: normalizedProduct,
    isOpen,
  })

  const images = useProductImages({
    product: normalizedProduct,
    isOpen,
    maxImages: 4,
  })
  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 1) upload selected files
      const uploadedFileUrls = await images.uploadSelectedFiles()

      // 2) merge url images + uploaded urls
      const allImages = [...images.uploadedImages, ...uploadedFileUrls].slice(0, 4)

      // 3) build payload (主圖=第一張)
      const payload: productData = buildProductPayload(formData, allImages)

      // 4) save product
      await onSave(payload)

      // 5) clear selected files after success
      images.clearAllImages()
    } catch (err) {
      console.error(err)
      alert("儲存失敗（圖片上傳或商品儲存失敗）")
    } finally {
      setIsSaving(false)
    }
  }

  type ProductContent = {
    author?: string
    isbn?: string
    publisher?: string
    publishDate?: string
    pages?: number
  }


  const formTitle = mode === "create" ? "新增書籍" : "編輯書籍"
  const getContentJson = (): ProductContent => {
    try {
      return formData.content ? (JSON.parse(formData.content) as ProductContent) : ({} as ProductContent)
    } catch {
      return {} as ProductContent
    }
  }


  const setContentField = (key: keyof ProductContent, value: any) => {
    const cur = getContentJson()
    const next = { ...cur, [key]: value }
    // ✅ 直接寫回 formData.content（仍是 string）
    handleInputChange({
      target: { name: "content", value: JSON.stringify(next) },
    } as any)
  }



  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:!max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="product-modal-description">
        <DialogHeader>
          <DialogTitle className="text-xl">{formTitle}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左半表單 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="book title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin_price">Original Price</Label>
                <Input
                  type="number"
                  id="origin_price"
                  name="origin_price"
                  value={formData.origin_price}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="category"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="volume, set"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  type="text"
                  value={getContentJson().author ?? ""}
                  onChange={(e) => setContentField("author", e.target.value)}
                  placeholder="Author"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  type="text"
                  value={getContentJson().isbn ?? ""}
                  onChange={(e) => setContentField("isbn", e.target.value)}
                  placeholder="978-..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  type="text"
                  value={getContentJson().publisher ?? ""}
                  onChange={(e) => setContentField("publisher", e.target.value)}
                  placeholder="Publisher"
                />
              </div>
              <div className="space-y-2">
                <DatePicker
                  id="publishDate"
                  label="Publish Date"
                  value={getContentJson().publishDate ?? ""}
                  onChange={(val) => setContentField("publishDate", val)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={getContentJson().pages ?? 0}
                  onChange={(e) => setContentField("pages", e.target.value)}
                  placeholder="Pages"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  name="rating"
                  min={0}
                  max={5}
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="is_enabled" className="mb-0">
                  啟用
                </Label>
                <Switch
                  id="is_enabled"
                  checked={formData.is_enabled === 1}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </div>
          </div>

          {/* 右半圖片 */}
          <div className="space-y-4">
            {/* 選檔（不會上傳） */}
            <div className="flex gap-2">
              <input
                ref={images.fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={images.handleFileChange}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                onClick={images.triggerFileInput}
                disabled={images.isMax}
              >
                <FileInput className="size-4" />
                選擇圖片
              </Button>

              <div className="text-sm text-muted-foreground flex items-center">
                {images.totalCount}/4
              </div>
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="輸入圖片連結"
                  value={images.imageUrlInput}
                  onChange={(e) => images.setImageUrlInput(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={images.addImageUrl}
                disabled={images.isMax}
              >
                新增
              </Button>
            </div>

            {/* 圖片預覽 */}
            <div className="space-y-2">
              <Label>圖片預覽（儲存後才會上傳檔案）</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* 已有 URL 圖 */}
                {images.uploadedImages.map((image: string, index: number) => (
                  <div
                    key={`url-${index}`}
                    className="relative aspect-square rounded-lg border-2 border-border overflow-hidden group"
                  >
                    {index === 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                        主圖
                      </div>
                    )}

                    <img
                      src={image}
                      alt={`圖片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => images.deleteUrlImage(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}

                {/* 本次選檔 blob 預覽 */}
                {images.selectedPreviews.map((p: string, i: number) => {
                  const idx = images.uploadedImages.length + i
                  return (
                    <div
                      key={`file-${i}`}
                      className="relative aspect-square rounded-lg border-2 border-border overflow-hidden group"
                    >
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                          主圖
                        </div>
                      )}

                      <img
                        src={p}
                        alt={`待上傳圖片 ${i + 1}`}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute bottom-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        待上傳
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => images.deleteSelectedFile(i)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )
                })}

                {/* Placeholder */}
                {Array.from({ length: 4 - images.totalCount }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">書籍描述</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="請輸入書籍詳細描述"
            rows={3}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            取消
          </Button>

          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={isSaving}
          >
            {isSaving ? "儲存中..." : "儲存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
