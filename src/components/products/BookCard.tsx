import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

interface BookCardProps {
  title: string
  author: string
  price: string
  originalPrice?: string
  imageQuery: string
  rating: number
}

export function BookCard({ title, author, price, originalPrice, imageQuery, rating }: BookCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-[2/3] relative mb-3 overflow-hidden rounded-md bg-muted">
          <img
            src={imageQuery}
            alt={title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-serif font-semibold text-base leading-tight mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{author}</p>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-xs ${i < Math.floor(rating) ? "text-primary" : "text-muted"}`}>
                ★
              </span>
            ))}
          </div> 
           <span className="text-xs text-muted-foreground">({rating})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">{price}</span>
          {originalPrice && <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>}
        </div>
        <Button size="icon" variant="outline" className="h-9 w-9 bg-transparent">
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
