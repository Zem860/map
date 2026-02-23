import { useEffect, useState } from "react";
import { useProductStore } from "@/store/productStore";
import type { PaginationParam } from "@/type/product";
import BreadCrumb from "@/components/BreadCrumbs";
import CategoryMenu from "@/components/products/CategoryMenu";
import { PaginationDemo } from "@/components/util/Pagination";
import { BookCard } from "@/components/products/BookCard";
import { productContentParser } from "@/helper/tool";
import { Loader } from "@/components/Loader";
import { Link, useSearchParams } from "react-router-dom";

const Shop = () => {
    const [searchParams] = useSearchParams();
    const [pageData, setPageData] = useState<PaginationParam>({
        page: 1,
        category:searchParams.get("category") || "",
    });

    const flexProducts = useProductStore((state) => state.flexProducts);
    const isLoading = useProductStore((state) => state.isLoading);
    const pagination = useProductStore((state) => state.pagination);

    useEffect(() => {
        console.log("Fetching products with params:", pageData);
        useProductStore.getState().fetchByCategory({
            category: pageData.category,
            page: pageData.page
        });
    }, [pageData.category, pageData.page]);


    const handleCategoryChange = (newCategory: string) => {
        setPageData({
            category: newCategory,
            page: 1 // 切換分類時通常會回到第一頁
        });
    };
    const handlePageChange = (newPage: number) => {
        setPageData((prev) => ({
            ...prev,
            page: newPage
        }));
    }

    return (
        <>
            {isLoading ?
                <Loader /> :
                (
                    <div className="min-h-screen">
                        <div className="container mx-auto px-4 py-8">
                            <BreadCrumb />
                            <div className="flex flex-col lg:flex-row gap-8">
                                <CategoryMenu selected={pageData.category} handleCategoryChange={handleCategoryChange} />

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {flexProducts.map((book) => (
                                        <Link key={book.id} to={`/shop/${book.id}`} className="block">
                                            <BookCard
                                                title={book.title}
                                                author={productContentParser(book).author || "Unknown"}
                                                price={String(book.price)}
                                                originalPrice={String(book.origin_price)}
                                                imageQuery={book.imageUrl}
                                                rating={book.rating}
                                            />
                                        </Link>
                                    ))}
                                </div>

                            </div>

                            {pagination && (
                                <PaginationDemo pagination={pagination} onPageChange={handlePageChange} />
                            )}
                        </div>
                    </div>

                )
            }
        </>
    );
}

export default Shop;