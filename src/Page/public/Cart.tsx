import { useCartStore } from "@/store/cartStore";
import BreadcrumbNav from "@/components/BreadCrumbs";
import { Stepper } from "@/components/Stepper";

const Cart = () => {
    const cart = useCartStore((s)=> s.carts);
    console.log(cart)
    return ( 
    <>
    <BreadcrumbNav />
    <Stepper currentStep={1} className="" />
    </> 
);
}
 
export default Cart;