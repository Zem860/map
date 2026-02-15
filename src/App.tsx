import { Routes, Route } from "react-router-dom"
import Login from "./Page/admin/Login"
import AdminProducts from "./Page/admin/Products"
import AdminRoute from "./routes/AdminRoute"
import AdminLayout from "./Layout/AdminLayout"
import Home from "./Page/public/Home"
import Shop from "./Page/public/Shop"
import PublicLayout from "./Layout/PublicLayout"
import UserForm from "./Page/public/UserForm"
import ProductDetail from './Page/public/ProductDetail'
import Cart from "./Page/public/Cart"
import AdminOrder from "./Page/admin/Order"
import Payment from "./Page/public/Payment"
import About from "./Page/About"
import Articles from "./Page/public/Articles"
import ArticlePage from "./Page/public/ArticlePage"
import Article from "./Page/admin/Article"
const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/form" element={<UserForm />}></Route>
        <Route path="shop/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/payment/:orderId" element={<Payment />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/articles" element={<Articles />}></Route>
        <Route path="/articles/:id" element={<ArticlePage />}></Route>
      </Route>

      {/* 登入頁 */}
      <Route path="/login" element={<Login />} />

      {/* 後台（守門 + Layout） */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {/* /admin */}
        <Route index element={<div>Admin Dashboard</div>} />
        {/* /admin/login */}
        <Route path="login" element={<Login />} />
        {/* /admin/products */}
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrder />} />
        <Route path="articles" element={<Article />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default App
