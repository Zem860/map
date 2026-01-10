import { Routes, Route } from "react-router-dom"
import Login from "./Page/admin/Login"
import AdminProducts from "./Page/admin/Products"
import AdminRoute from "./routes/AdminRoute"
import AdminLayout from "./Layout/AdminLayout"

const App = () => {
  return (
    <Routes>
      <Route index element={<div>Home Page</div>}></Route>

      {/* 登入頁 */}
      <Route path="/login" element={<Login />} />

      {/* 後台（守門 + Layout） */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        {/* /admin */}        
        <Route index element={<div>Admin Dashboard</div>} />
         {/* /admin/login */}
         <Route path="login" element = {<Login/>}/>
        {/* /admin/products */}
        <Route path="products" element={<AdminProducts />} />
        
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}

export default App
