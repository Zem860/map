import { useProductStore } from "@/store/productStore";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const CategoryMenu = ({ selected, handleCategoryChange }:{selected:string, handleCategoryChange: (category:string) => void }) => {
  const books = useProductStore((s) => s.products)
  const hasFetched = useRef(false)
  
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      useProductStore.getState().fetchAllProduct()
    }
  }, [])

    const allCategory = Array.from(new Set(books.map(book => book.category)));
    return (  
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-6 bg-card border rounded-lg p-6">
        <h2 className="font-serif font-bold text-lg mb-4">Categories</h2>
        <nav className="space-y-1">
             <Button
              variant="ghost"
              className={cn(
                "w-full justify-between text-left font-normal",
                selected === "" && "bg-accent text-accent-foreground",
              )}
              onClick={() => handleCategoryChange("")}
            > All</Button>
          {allCategory.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={cn(
                "w-full justify-between text-left font-normal",
                selected === category && "bg-accent text-accent-foreground",
              )}
              onClick={() => handleCategoryChange(category)}
            >
              <span>{category}</span>
            </Button>
          ))}
        </nav>
      </div>
    </aside> );
}
 
export default CategoryMenu;