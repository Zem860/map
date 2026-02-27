import { Menu, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiUserLogout } from "@/api/folder_admin/admin"
import axios from "axios"

export function AdminHeader() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      // 向後端發送登出請求，讓後端知道用戶已經登出，可以在後端進行相應的處理，例如清除伺服器上的 session 或 token
      await apiUserLogout();
      console.log("登出成功");
    } catch (error) {
      console.error("登出失敗:", error);
    } finally {
      //測試過程中有遇到如果按上一頁cookie在同一個瀏覽器中某些路徑作用域還是存在
      // 故改成刪除cookie的方式來確保登出後token不會存在，實際上應該是要讓後端的token失效才對
      //Max-Age=0 代表立即過期，path=/ 代表整個網站都會刪除這個cookie，SameSite=Lax 是為了CSRF安全性而考量，確保在跨站請求時不會攜帶這個cookie
      document.cookie = "hexToken=; Max-Age=0; path=/; SameSite=Lax";
      //同步清除axio記憶體防止幽靈登入，因為axios.defaults.headers.common["Authorization"] 是全局設定，如果不清除，可能會導致在登出後的某些情況下仍然攜帶舊的token，造成安全風險或錯誤行為
      axios.defaults.headers.common["Authorization"] = "";
      // 登出後導向登入頁面，replace: true 代表不會在瀏覽歷史中留下這次導航的記錄，使用者無法按瀏覽器的返回按鈕回到登出前的頁面
      navigate("/login", { replace: true })
    }
    // 刪除 cookie
    document.cookie = "hexToken=; Max-Age=0; path=/; SameSite=Lax";
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center gap-2 md:gap-4 border-b border-border bg-card px-4 md:px-6">
        {/* 漢堡按鈕：手機顯示，桌機可選要不要顯示 */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link to="/admin" className="flex items-center gap-2 lg:hidden">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          <Link to="/admin/settings" className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>About</DropdownMenuItem>
              <DropdownMenuItem>Setting</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </>
  )
}
