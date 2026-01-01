import { getAllProducts } from "@/api/folder_admin/products";
import type { productData } from "@/type/product";

export const getCategoryCombos = async (): Promise<string[]> => {
  try {
    const res = await getAllProducts();
    const products: productData[] = Object.values(res.data.products);

    const categories = [...new Set(products.map((p) => p.category))];
    return categories;
  } catch (err) {
    console.log(err);
    return [];
  }
};
