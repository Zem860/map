import {Stepper} from "@/components/Stepper";
import { ChevronRight, CreditCard, MapPin, ShoppingBag, User } from 'lucide-react';

// 模擬資料
const ORDER_ITEMS = [
  {
    id: 1,
    title: "The Old Kingdom Collection: Sabriel, Lirael, Abhorsen, Clariel",
    price: 1026,
    quantity: 3,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "The Queen's Gambit",
    price: 470,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&auto=format&fit=crop",
  }
];

const CheckoutPage = () => {
  const totalAmount = ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-20">
      {/* 步驟進度條 - 參考圖片頂部 */}
        <Stepper currentStep={3} className={'mb-10'} />
      

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-serif font-bold text-center mb-8">Confirm Your Payment</h1>

        {/* 訂單編號區塊 */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Order ID</p>
          <code className="text-primary font-mono font-semibold">-OjnRLjDsGovEB11Qbmo</code>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* 訂單內容 */}
          <section className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Your Orders</h2>
            </div>
            <div className="divide-y divide-border">
              {ORDER_ITEMS.map((item) => (
                <div key={item.id} className="p-4 flex gap-4 items-start">
                  <img src={item.image} alt={item.title} className="w-20 h-28 object-cover rounded shadow-sm border border-border" />
                  <div className="flex-1">
                    <h3 className="font-medium text-lg leading-tight mb-2">{item.title}</h3>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-muted-foreground">
                        <p>Item Price: ${item.price} NTD</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-primary font-bold text-lg">
                        Item Total: ${item.price * item.quantity} NTD
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
                  <p className="font-medium text-base">經典藍色T恤</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-base">engelpao860@gmail.com</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Address
                  </p>
                  <p className="font-medium text-base">XinWenLiXinShengLu No 461 3F</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium text-base">0963124563</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border mt-4 flex justify-between items-center">
                <span className="text-xl font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">${totalAmount} NTD</span>
              </div>
            </div>
          </section>

          {/* 付款方式選擇 */}
          <section className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Payment Methods</h2>
            </div>
            <div className="p-6">
              <select className="w-full p-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
                <option value="">Choose a payment method</option>
                <option value="credit_card">Credit Card (Visa/MasterCard)</option>
                <option value="line_pay">LINE Pay</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </section>

          {/* 確認按鈕 */}
          <button className="w-full md:w-auto md:px-12 py-4 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">
            Confirm Payment
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;