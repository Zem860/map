import type { Article, Confirmtype } from '@/type/articles';
import { useState, useEffect } from 'react';
import { getArticles, getSingleArticle } from '@/api/folder_admin/articles';
import ConfirmModal from '@/components/products/ConfirmModal/ConfirmModal';
import type { AxiosError } from 'axios';
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
import { createArticle } from '@/api/folder_admin/articles';
import { Loader } from '@/components/Loader';
const Article = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const [confirmState, setConfirmState] = useState<Confirmtype & { error?: string }>({
    isOpen: false,
    title: '',
    message: '',
    isLoading: false,
    error: '', // 用來存错误信息
    onConfirm: () => { },
  });
  const closeConfirm = () => {
    // ✅ 加上小括號，明確告訴 TS 這是要回傳一個物件
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await getArticles({});
      setArticles(res.data.articles);
    } catch (error) {
      console.error('抓取失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  const openModal = async (item: Article|null) => {
    try {
      if (!item) {
        setArticle(null);
        setIsOpen(true);
        setMode('create');
        return;
      }
      const res = await getSingleArticle(item.id);
      setArticle(res.data.article);
      setIsOpen(true);
      setMode('edit');
    }
    catch (err) { console.error(err) }
  };

  const handleAskSave = (formData: Article) => {
    setConfirmState({
      isOpen: true,
      title: '確認儲存',
      message: `您確定要儲存「${formData.title}」這篇文章嗎？`,
      isLoading: false,
      error: '', // 清空之前的错误
      onConfirm: async () => {
        // 真正打 API 的地方
        setConfirmState((prev) => ({ ...prev, isLoading: true, error: '' }));
        try {
          await createArticle(formData);
          console.log('文章儲存成功', formData);
          fetchArticles(); // 儲存成功後重新抓取文章列表
          closeConfirm(); // 關閉確認對話框
        } catch (err: unknown) {
          // 將後端錯誤信息顯示在 Modal 中
          let errorMsg = '保存失敗';
          if (err && typeof err === 'object' && 'response' in err) {
            const axiosErr = err as AxiosError<{ message?: string | string[] }>;
            if (axiosErr.response?.data?.message) {
              errorMsg = Array.isArray(axiosErr.response.data.message)
                ? axiosErr.response.data.message.join('\n')
                : axiosErr.response.data.message;
            }
          }
          setConfirmState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
        } finally {
          setIsOpen(false); // 關閉 ArticleModal
        }
      },
    });
  };
  useEffect(() => {
    fetchArticles();
  }, []); // 保持空陣列，代表只在「第一次出現」時執行
  return (
    <>
      <ArticleModal
        article={article}
        mode={mode}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleAskSave={handleAskSave}
      />
      {isLoading ? <Loader /> : (<>
        <div className="space-y-4 mb-4 flex items-center justify-between">
          <Button
            onClick={() => {
              setArticle(null);        // ✅ 清空 article
              setMode('create');       // ✅ 設定為新增模式
              setIsOpen(true);         // ✅ 打開 Modal
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
                      {item.tag?.length ? item.tag.join('、') : '—'}
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
                    {item.tag?.length ? item.tag.join('、') : '—'}
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
                          onClick={() => { openModal(item) }}
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
      </>)}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onOpenChange={(open) =>
          setConfirmState((prev) => ({ ...prev, isOpen: open }))
        }
        title={confirmState.title}
        message={confirmState.message}
        isLoading={confirmState.isLoading}
        error={confirmState.error}
        onConfirm={confirmState.onConfirm}
      />
    </>
  );
};;

export default Article;
