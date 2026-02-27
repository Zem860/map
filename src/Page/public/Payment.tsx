import { Stepper } from "@/components/Stepper";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import type { CartData, CartItem } from "@/type/cart";
import { Loader } from "@/components/Loader";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight, CreditCard, MapPin, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { postOrder } from "@/api/folder_user/products";
import type { OrderParams } from "@/type/order";
import { useOrderStore } from "@/store/orderStore";
import { pay } from "@/api/folder_user/order";
import { useMapStore } from "@/store/mapStore";
import type { MapProduct } from "@/store/mapStore";

// 確認付款並通知 mapStore
const confirmPaymentOnMap = async (city: string, country: string, product: MapProduct) => {
    await useMapStore.getState().confirmPayment(city, country, product)
}
const Payment = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userStore = useUserStore();
    const cartStore = useCartStore();
    const orderStore = useOrderStore();
    const cartsData = cartStore.carts as CartData;
    const userInfo = orderStore.userData || userStore.userInfo?.data?.user;
    const orderCartData = orderStore?.orderData?.products
        ? Object.values(orderStore.orderData.products) as CartItem[]
        : undefined;
    const orderFinalTotal = orderStore.final_total;
    const msg = orderStore?.orderData?.message || userStore.userInfo?.data?.message;
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("");

    // 从 URL 获取 orderId
    const orderNum = searchParams.get("orderId") || "";
    const handleSubmitOrder = async () => {
        if (!userInfo) return;
        if (!paymentMethod) {
            setErrorMessage("Please select a payment method.");
            return;
        }

        const submittedData: OrderParams = {
            data: {
                user: userInfo,
                message: msg || ""
            }
        };

        try {
            const res = await postOrder(submittedData);
            const postedOrderId = res.data.orderId;
            await pay(postedOrderId);

            // ✅ 付款成功 → 解析 address 並通知 mapStore（帶上書的資料）
            const addressParts = userInfo.address.split(", ")
            const country = addressParts[0] || ""
            const city = addressParts[1] || ""

            // 從購物車取第一本書的資訊
            const firstItem = cartItems[0]
            if (country && city && firstItem) {
                const mapProduct: MapProduct = {
                    title: firstItem.product.title,
                    imageUrl: firstItem.product.imageUrl,
                    author: (() => {
                        try {
                            return JSON.parse(firstItem.product.content || '{}').author || 'Unknown'
                        } catch {
                            return 'Unknown'
                        }
                    })(),
                }
                await confirmPaymentOnMap(city, country, mapProduct)
            }

            navigate(`/payment?orderId=${postedOrderId}`);
            userStore.clearUserInfo();
        } catch (error) {
            console.error("Failed to submit order:", error);
        }
    }

    useEffect(() => {
        orderStore.clearOrderData();
        cartStore.fetchCart();
        if (!userInfo && !orderNum) {
            navigate("/form");
        } else {
            getOrder();
        }
    }, [orderNum]);

    const getOrder = async () => {
        if (!orderNum) return;
        try {
            await orderStore.fetchOrder(orderNum);
            userStore.clearUserInfo();
            console.log("Fetched order data:", orderStore.orderData);
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        }
    }

    const cartItems: CartItem[] = orderCartData || cartsData.data?.carts || [];
    const isLoading = cartStore.isLoading;

    if (!userInfo) {
        return <Loader />;
    }

    return (
        <>
            {isLoading ? <Loader /> :
                <div className="min-h-screen bg-background">
                    <div className="container mx-auto px-4 py-8 lg:py-12">
                        <Stepper currentStep={orderNum ? 4 : 3} className="my-4" />

                        <Link to="/form" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                            Back to User Form
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-center mb-8">Confirm Your Payment</h1>

                        {/* 訂單編號區塊 */}
                        {orderNum && <div className="mb-8 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
                            <h2 className="text-xl font-semibold text-green-800">Order Submitted Successfully!</h2>
                            <p className="mt-2 text-green-700">Your order number is <span className="font-mono font-bold">{orderNum}</span>. Please keep it for your records.</p>
                        </div>}

                        <div className="grid grid-cols-1 gap-6">
                            {/* 訂單內容 */}
                            <section className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                    <h2 className="font-bold">Your Orders</h2>
                                </div>
                                <div className="divide-y divide-border">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-4 flex gap-4 items-start">
                                            <img src={item.product.imageUrl} alt={item.product.title} className="w-20 h-28 object-cover rounded shadow-sm border border-border" />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-lg leading-tight mb-2">{item.product.title}</h3>
                                                <div className="flex justify-between items-end">
                                                    <div className="text-sm text-muted-foreground">
                                                        <p>Item Price: ${item.product.price} NTD</p>
                                                        <p>Quantity: {item.qty}</p>
                                                    </div>
                                                    <p className="text-primary font-bold text-lg">
                                                        Item Total: ${item.product.price * item.qty} NTD
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 客戶資訊 */}
                            <section className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    <h2 className="font-bold">Customer Information</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground mb-1">Name</p>
                                            <p className="font-medium text-base">{userInfo?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Email</p>
                                            <p className="font-medium text-base">{userInfo?.email}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-muted-foreground mb-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> Address
                                            </p>
                                            <p className="font-medium text-base">{userInfo?.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Phone</p>
                                            <p className="font-medium text-base">{userInfo?.tel}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Message</p>
                                            <p className="font-medium text-base">{msg}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border mt-4 flex justify-between items-center">
                                        <span className="text-xl font-bold">Total Amount</span>
                                        <span className="text-2xl font-bold text-primary">
                                            ${Math.round(orderFinalTotal || cartsData.data?.final_total || 0)} NTD
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {!orderNum && <section className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    <h2 className="font-bold">Payment Methods</h2>
                                </div>
                                <div className="p-6">
                                    <select value={paymentMethod} onChange={(e) => {
                                        setPaymentMethod(e.target.value)
                                        setErrorMessage("");
                                    }}
                                        className="w-full p-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
                                        <option value="">Choose a payment method</option>
                                        <option value="credit_card">Credit Card (Visa/MasterCard)</option>
                                        <option value="line_pay">LINE Pay</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                    </select>
                                    {errorMessage && <p className="text-destructive">{errorMessage}</p>}
                                </div>
                            </section>}

                            {/* 確認按鈕 */}
                            {!orderNum ?
                                <button onClick={() => { handleSubmitOrder() }}
                                    className="w-full md:w-auto md:px-12 py-4 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">
                                    Confirm Payment
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                :
                                <div className="w-full md:w-auto md:px-12 py-4 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">
                                    <Link to="/">Back to Homepage</Link>
                                </div>
                            }
                        </div>
                    </div>
                </div>}


        </>);
}

export default Payment;