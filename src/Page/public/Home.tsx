import LeafletMap from "@/components/LeafletMap";
import { Sparkles, ArrowRight, TrendingUp, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookCard } from "@/components/products/BookCard";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import type { productData } from "@/type/product";
import { useProductStore } from "@/store/productStore";
import { Link } from "react-router-dom";
import { Loader } from "@/components/Loader";
import Invatation from "@/components/Invitation";
import { useState } from "react";
import { Calendar } from "lucide-react";
import type { Article } from "@/type/articles";
import { getArticles } from "@/api/folder_user/articles";
const Home = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const featuredCategories = [
    { label: "Literature", icon: "📖", hint: "Classics & Modern" },
    { label: "Science Fiction", icon: "🚀", hint: "Speculative Worlds" },
    { label: "History & Biography", icon: "🏛️", hint: "Real Stories" },
    { label: "Young Adult", icon: "🧑‍🎓", hint: "Coming of Age" },
  ]
  const fetchProducts = useProductStore((s) => s.fetchAllProduct)
  const isLoading = useProductStore((s) => s.isLoading)
  const products = useProductStore((s) => s.products)
  useEffect(() => {

    fetchProducts()
    getArticles({ page: 1 }).then((response) => {
      setArticles(response.data.articles.slice(0, 5))
    })
  }, [fetchProducts])
  const newArrivals = products.slice().reverse().slice(0, 5);
  if (isLoading) return <Loader />
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Free Worldwide Shipping
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-balance mb-6 leading-tight">
              Discover the World of English Literature
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              From timeless classics to contemporary masterpieces. Explore the greatest works in English literature.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2 shadow-xl h-full">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-serif font-bold text-balance">Watch People Shop</CardTitle>
                <p className="text-muted-foreground mt-2">See where readers are discovering books in real-time</p>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <div className="w-full">
                  <LeafletMap products={products} />
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 shadow-xl">
              <CardHeader>

                <CardTitle className="text-2xl font-serif font-bold">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-6 w-6 text-primary" />
                    <h2 className="font-serif text-3xl font-bold text-foreground">Articles</h2>
                  </div>
                  <p className="text-muted-foreground">Insights, reviews, and stories from the literary world</p>

                </CardTitle>
                <p className="text-muted-foreground text-sm">Discover insights and stories from the literary world</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {articles.map((article) => (
                  <Link key={article.id} to={`/articles/${article.id}`} className="block group">
                    <div className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.create_at * 1000).toLocaleDateString()}
                        </div>
                        {article.tag && article.tag.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {article.tag[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-xl font-serif font-semibold mb-6 text-center">
            Explore by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {featuredCategories.map((c) => (
              <Button
                key={c.label}
                variant="outline"
                className="
            h-24 flex-col gap-1
            bg-background
            hover:bg-primary/5 hover:border-primary
            transition-colors
          "
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-sm font-medium">{c.label}</span>
                <span className="text-xs text-muted-foreground">{c.hint}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                New Arrivals
              </h2>
              <p className="text-muted-foreground">The most popular books this week</p>
            </div>
            <Button variant="ghost" className="hidden md:flex">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {

              newArrivals.map((item: productData) => {
                const contentData = JSON.parse(item.content || '{}')
                return <Link key={item.id} to={`/shop/${item.id}`}>
                  <BookCard
                    title={item.title}
                    author={contentData.author}
                    price={String(item.price)}
                    originalPrice={String(item.origin_price)}
                    imageQuery={item.imageUrl}
                    rating={item.rating}
                  />

                </Link>
              })
            }
          </div>
        </div>
      </section>

      <Invatation />

    </>
  );
}

export default Home;