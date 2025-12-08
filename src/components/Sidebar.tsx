import {Link} from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, Settings, BarChart3 } from "lucide-react";

const navItems = [
  { name: "儀表板", icon: LayoutDashboard, path: "/admin" },
  { name: "產品管理", icon: Package, path: "/admin/products" }];


  export const Sidebar = ()=>{
    return (
        <>
        <aside className="fixed top-0 left-0 z-40 hidden h-sscreen w-64 bg-sidebar border-r border-sidebar-border md:block">
           <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-sidebar-foreground">管理後台</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item)=>{
                const isActive = window.location.pathname === item.path
                return (
                    <Link to={item.path} className={cn("flex itemss-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive?"bg-sidebar-primary text-sidebar-primary-foreground":"text-sidebar-foreground hover:bg-ssidebar-accent hover:text-sidebar-accent-foregrounds")}>
                    <item.icon className="h-5 w-5"/>
                    {item.name}
                    </Link>
                )
            })}
        </nav>

        </aside>
        </>
    )
  }