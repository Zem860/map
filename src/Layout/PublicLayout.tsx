import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

const PublicLayout = () => {
    const fetchCart = useCartStore((s) => s.fetchCart);
    useEffect(() => {
        fetchCart(); // ✅ 這裡只是一般 function 呼叫
    }, [fetchCart]);
    return (<>
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    </>);
}

export default PublicLayout;