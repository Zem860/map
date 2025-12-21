// src/features/products/product.mapper.ts
import type { productData } from "@/type/product"

export function buildProductPayload(
  formData: productData,
  allImages: string[]
): productData {
  const images = allImages.slice(0, 4)

  return {
    ...formData,
    imageUrl: images[0] || "",
    imagesUrl: images.length > 0 ? images : [""],
  }
}
