import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProduct } from "@/api/folder_user/products";
import { Loader } from "@/components/Loader";
import { productContentParser } from "@/helper/tool";
import type { productData, ProductContent } from "@/type/product";
import { postCart } from "@/api/folder_user/cart";
import Qtybar from "@/components/util/Qtybar";
import { useCartStore } from "@/store/cartStore";

const ProductDetail = () => {
    const pathObj = useLocation();
    const [product, setProduct] = useState<productData>()
    const [productObj, setProductObj] = useState<ProductContent>()
    const [isLoading, setIsLoading] = useState(false)
    const [qty, setQty] = useState(0)
    const addToCart = useCartStore((s) => s.addToCart);
    useEffect(() => {
        const { pathname } = { ...pathObj }
        const id = pathname.split("/")[2]
        console.log(id)
        try {
            setIsLoading(true)
            getProduct(id).then((res) => {
                const product = res.data.product; // ProductApi
                const contentObj = productContentParser(product)
                setProductObj(contentObj)
                setProduct(product);
                setIsLoading(false)
            }).catch((err) => {
                console.log(err)
            })
        } catch (err) {
            console.log(err)
        }
    }, [])

    return (
        isLoading ? <Loader /> :
            product ?
                <div className="min-h-screen">
                    <div className="container mx-auto px-4 py-8">
                        {/* <BreadcrumbNav
          items={[{ label: "Shop", href: "/shop" }, { label: book.category, href: "/shop" }, { label: book.title }]}
        /> */}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                            <div className="space-y-4">
                                <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden">
                                    <img src={product?.imageUrl} alt={product?.title} />

                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">{product?.category}</p>
                                    <h1 className="font-serif text-4xl font-bold mb-2">{product?.title}</h1>
                                    <p className="text-xl text-muted-foreground mb-4">by {productObj?.author}</p>

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${i < Math.floor(product?.rating as number) ? "fill-primary text-primary" : "text-muted"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium">{product?.rating as number}</span>
                                    </div>
                                </div>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-baseline gap-3 mb-6">
                                            <span className="text-4xl font-bold text-primary">${product?.price}</span>
                                            {product?.origin_price && (
                                                <span className="text-xl text-muted-foreground line-through">{product?.origin_price}</span>
                                            )}
                                            {product?.origin_price && (
                                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                                    Save{" "}
                                                    {Math.round(
                                                        ((product.origin_price - product.price) / product.origin_price) * 100
                                                    )}
                                                    %
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <Button size="lg" className="w-full" onClick={() => { addToCart(product.id, qty) }}>
                                                <ShoppingCart className="mr-2 h-5 w-5" />
                                                Add to Cart
                                            </Button>
                                        </div>

                                        <Qtybar qty={qty} setQty={setQty} />

                                    </CardContent>
                                </Card>
                                <div className="space-y-4">
                                    <h2 className="font-serif text-xl font-bold">Product Details</h2>
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                        <dt className="text-muted-foreground">ISBN</dt>
                                        <dd className="font-medium">{productObj?.isbn}</dd>
                                        <dt className="text-muted-foreground">Publisher</dt>
                                        <dd className="font-medium">{productObj?.publisher}</dd>
                                        <dt className="text-muted-foreground">Publication Date</dt>
                                        <dd className="font-medium">{productObj?.publishDate}</dd>
                                        <dt className="text-muted-foreground">Pages</dt>
                                        <dd className="font-medium">{productObj?.pages}</dd>
                                    </dl>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="font-serif text-2xl font-bold mb-4">About This Book</h2>
                                        <p className="text-muted-foreground leading-relaxed">{product?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : <div>Something goes wrong</div>
    );
}

export default ProductDetail;