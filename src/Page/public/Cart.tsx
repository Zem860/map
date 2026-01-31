import { useCartStore } from "@/store/cartStore";
import BreadcrumbNav from "@/components/BreadCrumbs";
import { Stepper } from "@/components/Stepper";
import { ShoppingBag, Trash2, X, Tag } from "lucide-react";
import { Loader } from "@/components/Loader";
import Qtybar from "@/components/util/Qtybar";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink, useNavigate } from "react-router-dom";
import { productContentParser } from "@/helper/tool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Cart = () => {
    const cart = useCartStore((s) => s.carts);
    const removeItem = useCartStore((s) => s.removeFromCart);
    const editCartNum = useCartStore((s) => s.editCartNum);
    const clearCart = useCartStore((s) => s.clearCart);
    const totalItems = useCartStore((s) => s.count);
    const isLoading = useCartStore((s) => s.isLoading);
    const navigate = useNavigate();
    return (
        <>
            {isLoading && <Loader />}
            {cart.length === 0 ?
                <Card className="border-border">
                    <CardContent className="p-12 text-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="font-serif text-xl font-bold mb-2 text-foreground">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-6">Discover our collection of literature.</p>
                        <NavLink className="text-primary underline" to="/shop">
                            Browse Books
                        </NavLink>
                    </CardContent>
                </Card> :
                <div className="container mx-auto">
                    <div className="py-4 space-y-4">
                        <BreadcrumbNav />
                    </div>
                    <Stepper currentStep={1} className="my-4" />
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Shopping Cart</h2>
                    <div className="flex flex-col md:flex-row gap-6 mt-6">
                        <section className="flex-1 min-w-0">
                            {/* Mobile */}
                            <div className="lg:hidden space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="bg-card rounded-lg 
                            shadow-md border border-border overflow-hidden">
                                        <div className="flex p-4 gap-4">
                                            <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
                                                <img src={item.product.imageUrl} alt={item.product.title} className="object-cover w-24" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-serif font-medium text-sm text-card-foreground line-clamp-2 pr-2">
                                                        {item.product.title}
                                                    </h3>
                                                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1" aria-label="Remove item from cart">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="flex flex-col gap-2 mb-3">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xs text-muted-foreground line-through">${item.product.origin_price}</span>
                                                        <span className="text-base font-bold text-primary">${item.product.price}</span>
                                                    </div>
                                                </div>
                                                {/* Quantity */}
                                                <div className="inline-flex items-center justify-between">
                                                    <Qtybar qty={item.qty} setQty={(newQty) => editCartNum(item.id, { product_id: item.product_id, qty: newQty })} />
                                                    <div className="text-right">
                                                        <p className="font-semibold text-primary">${item.product.origin_price}</p>
                                                        <p className="text-xs text-muted-foreground">Total: ${(item.product.price * item.qty).toFixed(0)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                            {/* Desktop */}
                            <table className="w-full hidden lg:table-auto lg:table mt-8 border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-4 text-sm font-medium text-muted-foreground">Product</th>
                                        <th className="text-center py-4 text-sm font-medium text-muted-foreground w-28">Price</th>
                                        <th className="text-center py-4 text-sm font-medium text-muted-foreground w-36">Quantity</th>
                                        <th className="text-right py-4 text-sm font-medium text-muted-foreground w-28">Subtotal</th>
                                        <th className="w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.id} className="border-b border-border">
                                            {/* Product */}

                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-28 relative bg-secondary/30 rounded flex-shrink-0">
                                                        <img src={item.product.imageUrl} alt={item.product.title} className="object-cover w-24" />

                                                    </div>
                                                    <div>
                                                        <h3 className="font-serif font-semibold text-foreground line-clamp-2 mb-1">{item.product.title}</h3>
                                                        <p className="text-sm text-muted-foreground">by {productContentParser(item.product).author}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="py-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-semibold text-primary">${item.product.price}</span>
                                                    <span className="text-xs text-muted-foreground line-through">${item.product.origin_price}</span>
                                                </div>
                                            </td>

                                            {/* Quantity */}
                                            <td className="py-6 text-center">
                                                <div className="inline-flex mx-auto justify-center">
                                                    <Qtybar qty={item.qty} setQty={(newQty) => editCartNum(item.id, { product_id: item.product_id, qty: newQty })} />
                                                </div>
                                            </td>

                                            {/* Subtotal */}
                                            <td className="py-6 text-right">
                                                <span className="font-semibold text-foreground">${(item.product.price * item.qty).toFixed(0)}</span>
                                            </td>

                                            {/* Remove */}
                                            <td className="py-6 text-right">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Actions */}
                            <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
                                <NavLink to="/shop">
                                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                                        Continue Shopping
                                    </Button>
                                </NavLink>
                                <Button variant="ghost" onClick={() => { clearCart() }} className="text-muted-foreground hover:text-destructive">
                                    Clear Cart
                                </Button>
                            </div>
                        </section>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Coupon */}
                            <Card className="border-border">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Tag className="h-4 w-4 text-primary" />
                                        <h2 className="font-serif font-semibold text-foreground">Coupon Code</h2>
                                    </div>

                                    <div className="flex gap-2 mb-4">
                                        <Input
                                            placeholder="Enter code"
                                            // value={couponCode}
                                            // onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-1 border-border"
                                        />
                                        <Button onClick={() => {
                                            //applycouponcode
                                        }} size="sm">Apply</Button>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <p className="text-muted-foreground">Available codes:</p>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => {
                                                    // setCouponCode("READING") 
                                                }}
                                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium hover:bg-secondary/80 transition-colors"
                                            >
                                                READING (10%)
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // setCouponCode("LITERATURE") 
                                                }}
                                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium hover:bg-secondary/80 transition-colors"
                                            >
                                                LITERATURE (15%)
                                            </button>
                                        </div>
                                    </div>

                                    {/* {appliedCoupon && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                    <Check className="h-4 w-4" />
                    <span>Coupon "{appliedCoupon}" applied</span>
                  </div>
                )} */}
                                </CardContent>
                            </Card>

                            {/* Order Summary */}
                            <Card className="border-border">
                                <CardContent className="p-6">
                                    <h2 className="font-serif font-semibold text-foreground mb-4">Order Summary</h2>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between py-2 border-b border-border">
                                            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                                            <span className="font-medium text-foreground">${(123).toFixed(0)}</span>
                                        </div>

                                        {/* {discount > 0 && (
                    <div className="flex justify-between py-2 border-b border-border text-primary">
                      <span>Discount</span>
                      <span className="font-medium">-${discount.toFixed(0)}</span>
                    </div>
                  )} */}

                                        <div className="flex justify-between py-2 border-b border-border">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="font-medium text-foreground">Free</span>
                                        </div>

                                        <div className="flex justify-between pt-3 text-lg">
                                            <span className="font-bold text-foreground">Total</span>
                                            <span className="font-bold text-primary">${(123546).toFixed(0)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full mt-6"
                                        size="lg"
                                        disabled={cart.length === 0}
                                        onClick={() => navigate("../form")}                                    >
                                        Proceed to Checkout
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center mt-4">
                                        Free shipping on all orders. 30-day returns.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Cart;