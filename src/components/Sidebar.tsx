import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { SidebarDrawerProps } from '@/type/product'

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Products", icon: Package, path: "/admin/products" }];

export const Sidebar = ({ open, onOpenChange }: SidebarDrawerProps) => {
  const { pathname } = useLocation()

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-sidebar-border px-6 py-4">
              <SheetTitle>
                <Link to="/admin" className="flex items-center gap-2" onClick={() => onOpenChange(false)}>
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-lg text-sidebar-foreground">Admins</span>
                </Link>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="fixed top-0 left-0 z-40 hidden h-sscreen w-64 bg-sidebar border-r border-sidebar-border lg:block">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-sidebar-foreground">Admins</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link to={item.path} key={item.path} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-ssidebar-accent hover:text-sidebar-accent-foregrounds")}>
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

      </aside>
    </>
  )
}