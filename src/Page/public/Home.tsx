import LeafletMap from "@/components/LeafletMap";
import { Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
const Home = () => {
    return (<>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <Card className="border-2 shadow-xl h-full">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl font-serif font-bold text-balance">Watch People Shop</CardTitle>
                        <p className="text-muted-foreground mt-2">See where readers are discovering books in real-time</p>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-6">
                        <div className="w-full">
                            <LeafletMap />
                        </div>
                    </CardContent>
                </Card>
                {/* <LeafletMap /> */}
                <Card className="border-2 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-serif font-bold">Latest Articles</CardTitle>
                        <p className="text-muted-foreground text-sm">Discover insights and stories from the literary world</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* {articles.map((article) => (
                                <Link key={article.id} href={`/articles/${article.id}`} className="block group">
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
                            ))} */}
                    </CardContent>
                </Card>
            </div>
        </section>
    </>);
}

export default Home;