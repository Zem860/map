import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleArticle } from "@/api/folder_user/articles";
import { Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Article } from "@/type/articles";
import BreadCrumb from "@/components/BreadCrumbs";


const ArticlePage = () => {

    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article>({} as Article)
    const [formatedDate, setFormatedDate] = useState<string>("")

    const fetchArticle = async () => {
        try {
            const response = await getSingleArticle(id as string);
            const formatedDate = new Date(response.data.article.create_at * 1000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            formatedDate;
            setFormatedDate(formatedDate);
            setArticle(response.data.article,);
        } catch (error) {
            console.error("Error fetching article:", error);
        }
    }
    useEffect(() => {
        fetchArticle();
    }, [id]);
    return (
        <>

            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    <div className="mb-5">
                        <BreadCrumb lastLabel={article.title} />
                    </div>
                    {/* Main Content */}
                    <article className="lg:col-span-2">
                        {/* Title Block */}
                        <div className="mb-8">
                            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance leading-tight">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    {formatedDate}
                                </div>
                                {article.author && (
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-4 w-4" />
                                        {article.author}
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {article.tag && article.tag.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {article.tag.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Excerpt */}
                            <div className="border-l-2 border-primary pl-6 py-1">
                                <p className="text-lg text-muted-foreground leading-relaxed italic">
                                    {article.description}
                                </p>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {article.image && (
                            <div className="mb-8 rounded-lg overflow-hidden border border-border">
                                <img
                                    src={article.image || "/placeholder.svg"}
                                    alt={article.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <Card className="border-border">
                            <CardContent className="p-6 lg:p-8">
                                <div
                                    className="prose prose-lg max-w-none
                    prose-headings:font-serif prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground
                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
                    prose-img:rounded-lg
                  "
                                    dangerouslySetInnerHTML={{ __html: article.content || "" }}
                                />
                            </CardContent>
                        </Card>
                    </article>

                </div>
            </div>

            <footer className="border-t py-12 bg-background mt-12">
                <div className="container">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>2025 Literary Haven. Free shipping worldwide on all orders.</p>
                    </div>
                </div>
            </footer>



        </>);
}

export default ArticlePage;