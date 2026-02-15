import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowRight, Newspaper, ScanFace } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article } from '@/type/articles';
import { getArticles } from '@/api/folder_user/articles';
import { useEffect, useState } from 'react';

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const getInitialData = async () => {
    const res = await getArticles({});
    setArticles(res.data.articles);
  };
  useEffect(() => {
    getInitialData();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          {/* Page Title */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="h-6 w-6 text-primary" />
              <h1 className="font-serif text-3xl font-bold text-foreground">
                Articles
              </h1>
            </div>
            <p className="text-muted-foreground">
              Insights, reviews, and stories from the literary world
            </p>
          </div>

          {articles.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-serif text-xl font-bold mb-2 text-foreground">
                  No articles yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Check back soon for new content.
                </p>
                <Link
                  to="/"
                  className="text-sm font-medium text-primary hover:underline underline-offset-4"
                >
                  Back to Home
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Featured Article - First One */}
              {articles.length > 0 && (
                <Link
                  to={`/articles/${articles[0].id}`}
                  className="group block"
                >
                  <Card className="border-border overflow-hidden hover:border-primary/40 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {articles[0].image ? (
                        <div className="aspect-video md:aspect-auto md:min-h-[320px] relative overflow-hidden">
                          <img
                            src={articles[0].image || '/placeholder.svg'}
                            alt={articles[0].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video md:aspect-auto md:min-h-[320px] bg-secondary/30 flex items-center justify-center">
                          <Newspaper className="h-16 w-16 text-muted-foreground/30" />
                        </div>
                      )}
                      <CardContent className="p-6 lg:p-8 flex flex-col justify-center">
                        <span className="text-xs font-medium text-primary uppercase tracking-wide mb-3">
                          Featured Article
                        </span>
                        <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 text-balance">
                          {articles[0].title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                          {articles[0].description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(
                              articles[0].create_at * 1000
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          {articles[0].author && (
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              {articles[0].author}
                            </div>
                          )}
                        </div>
                        {articles[0].tag && articles[0].tag.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {articles[0].tag.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Rest of Articles Grid */}
              {articles.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.slice(1).map((article, index) => (
                    <Link
                      key={article.id}
                      to={`/articles/${article.id}`}
                      className="group block"
                    >
                      <Card className="border-border h-full hover:border-primary/40 transition-colors overflow-hidden">
                        {article.image ? (
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={article.image || '/placeholder.svg'}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-secondary/30 flex items-center justify-center">
                            <Newspaper className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        )}
                        <CardContent className="p-6 flex flex-col">
                          <span className="text-2xl font-serif font-bold text-primary/20 mb-2">
                            {String(index + 2).padStart(2, '0')}
                          </span>

                          <h2 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h2>

                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
                            {article.description}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(
                                  article.create_at * 1000
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                              {article.author && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {article.author}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>

                          {article.tag && article.tag.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {article.tag.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="border-t py-12 bg-background mt-12">
          <div className="container">
            <div className="text-center text-sm text-muted-foreground">
              <p>2025 Literary Haven. Free shipping worldwide on all orders.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Articles