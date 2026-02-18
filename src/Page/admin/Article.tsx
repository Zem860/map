import type { Article } from '@/type/articles';
import { useState, useEffect } from 'react';
import { getArticles } from '@/api/folder_admin/articles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import ArticleModal from '@/components/products/articles/ArticleModal';

const Article = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [article, setArticle] = useState<Article>()
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // 在裡面定義，不要在外面定義
    const fetchArticles = async () => {
      try {
        const res = await getArticles({});
        setArticles(res.data.articles);
      } catch (error) {
        console.error('抓取失敗:', error);
      }
    };

    fetchArticles();
  }, []); // 保持空陣列，代表只在「第一次出現」時執行
  return (
    <>
      <ArticleModal
        article={article}
        mode="create"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="space-y-4 mb-4 flex items-center justify-between">
        <Button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="ml-auto bg-primary hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Create an Article
        </Button>
      </div>
      <div className="grid gap-3 md:hidden">
        {articles?.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                      //   onClick={() => openEditModal(item)}
                      >
                        編輯
                      </DropdownMenuItem>
                      <DropdownMenuItem
                      // onClick={() => askDelete(item.id, item.title)}
                      >
                        刪除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.tag.join('、')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-20">Id</TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead className="w-[150px]">Title</TableHead>
              <TableHead className="w-20">Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.num}</TableCell>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm w-[150px] truncate text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.tag.join('、')}</Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={!item.isPublic ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.isPublic ? 'published' : 'not published'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                      //   onClick={() => openEditModal(item)}
                      >
                        編輯
                      </DropdownMenuItem>
                      <DropdownMenuItem
                      // onClick={() => askDelete(item.id, item.title)}
                      >
                        刪除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Article;
