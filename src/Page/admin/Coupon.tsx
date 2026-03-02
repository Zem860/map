import type { couponData } from '@/type/coupon';
import { useState, useEffect } from 'react';
import { getCoupons, createCoupon } from '@/api/folder_admin/coupon';
import type { PaginationData } from '@/type/product';
import { PaginationDemo } from '@/components/util/Pagination';
import { Loader } from '@/components/Loader';
import ConfirmModal from '@/components/products/ConfirmModal/ConfirmModal';
import type { AxiosError } from 'axios';
import type { Confirmtype } from '@/type/articles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MoreHorizontal,
  Search,
  Trash2,
  Pencil,
  Ticket,
  Copy,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { useToastStore } from '@/store/toastStore';
import { CouponModal } from '@/components/products/coupons/CouponModal';
const Coupon = () => {
  const [coupons, setCoupons] = useState<couponData[]>([]);
  const [pageData, setPageData] = useState<PaginationData>({
    total_pages: 0,
    current_page: 1,
    has_pre: false,
    has_next: false,
    category: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { addToast } = useToastStore();
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [coupon, setCoupon] = useState<couponData | null>(null);

  const getInitialData = async () => {
    try {
      setIsLoading(true);
      const res = await getCoupons({});
      setCoupons(res.data.coupons);
      setPageData(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  function isExpired(timestamp: number): boolean {
    return timestamp * 1000 < Date.now();
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  const handlePageChange = async (newPage: number) => {
    try {
      setIsLoading(true);
      const res = await getCoupons({ page: newPage });
      setCoupons(res.data.coupons);
      setPageData(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch articles for page', newPage, err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [confirmState, setConfirmState] = useState<
    Confirmtype & { error?: string }
  >({
    isOpen: false,
    title: '',
    message: '',
    isLoading: false,
    error: '', // 用來存错误信息
    onConfirm: () => {},
  });
  const closeConfirm = () => {
    // ✅ 加上小括號，明確告訴 TS 這是要回傳一個物件
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAskSave = (formData: couponData) => {
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
            switch (mode) {
              case 'create':
                await createCoupon(formData);
                console.log('優惠券儲存成功', formData);
                break;
              case 'edit':
                // await editArticle(formData.id, formData);
                console.log('優惠券編輯成功', formData);
                break;
            }
            getInitialData(); // 儲存成功後重新抓取文章列表
            closeConfirm(); // 關閉確認對話框
            addToast(`${mode === 'create' ? 'create' : 'modify'}`, 'coupon', 'success'); // 成功後關閉 ProductModal

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

  const deleteThisCoupon = async (id: string, title: string) => {
    setConfirmState({
      isOpen: true,
      title: '確認刪除',
      message: `您確定要刪除${title}嗎?`,
      isLoading: false,
      error: '', // 清空之前的错误
      onConfirm: async () => {
        // 真正打 API 的地方
        setConfirmState((prev) => ({ ...prev, isLoading: true, error: '' }));
        try {
          // await deleteArticle(id);
          getInitialData(); // 儲存成功後重新抓取文章列表
          closeConfirm(); // 關閉確認對話框
          // addToast('delete', 'article', 'success'); // 成功後關閉 ProductModal
        } catch (err: unknown) {
          // 將後端錯誤信息顯示在 Modal 中
          let errorMsg = '刪除失敗';
          if (err && typeof err === 'object' && 'response' in err) {
            const axiosErr = err as AxiosError<{ message?: string | string[] }>;
            if (axiosErr.response?.data?.message) {
              errorMsg = Array.isArray(axiosErr.response.data.message)
                ? axiosErr.response.data.message.join('\n')
                : axiosErr.response.data.message;
            }
          }
          setConfirmState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMsg,
          }));
        } finally {
          setIsOpen(false); // 關閉 ArticleModal
        }
      },
    });
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <CouponModal
        coupons={coupon}
        mode={mode}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleAskSave={handleAskSave}
      />

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            優惠券管理
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理所有優惠券的建立、編輯與刪除
          </p>
        </div>
        <Button
          onClick={() => {
            setCoupon(null); // ✅ 清空 coupon 狀態，確保 Modal 是空白的
            setMode('create'); // ✅ 設定為新增模式
            setIsOpen(true); // ✅ 打開 Modal
          }}
          className="ml-auto bg-primary hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Create an Coupon
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">總數量</p>
          <p className="text-2xl font-bold text-foreground">{coupons.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">已啟用</p>
          <p className="text-2xl font-bold text-primary">
            {coupons.filter((c) => c.is_enabled).length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">未啟用</p>
          <p className="text-2xl font-bold text-foreground">
            {coupons.filter((c) => !c.is_enabled).length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">已過期</p>
          <p className="text-2xl font-bold text-destructive">
            {coupons.filter((c) => isExpired(Number(c.due_date))).length}
          </p>
        </div>
      </div>
      <div className="my-5">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="搜尋名稱或優惠碼..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {filteredCoupons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Ticket className="size-10 mb-2 opacity-50" />
            <p className="text-sm">沒有找到優惠券</p>
          </div>
        )}
        {filteredCoupons.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate text-card-foreground">
                    {item.title}
                  </p>
                  {item.is_enabled ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs shrink-0">
                      啟用
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      未啟用
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => copyCode(item.code)}
                    className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-mono text-secondary-foreground hover:bg-accent transition-colors"
                    title="點擊複製"
                  >
                    <Copy className="size-3" />
                    {item.code}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {'到期日：'}
                  {formatDate(Number(item.due_date))}
                  {isExpired(Number(item.due_date)) && (
                    <span className="text-destructive ml-1">（已過期）</span>
                  )}
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
                    <span className="sr-only">操作選單</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                  // onClick={() => openEditModal(item)}
                  >
                    <Pencil className="size-4" />
                    編輯
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => deleteThisCoupon(item.id!, item.title)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    刪除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">名稱</TableHead>
              <TableHead className="w-[140px]">優惠碼</TableHead>
              <TableHead className="w-[100px]">折扣</TableHead>
              <TableHead className="w-[140px]">到期日</TableHead>
              <TableHead className="w-[100px]">狀態</TableHead>
              <TableHead className="w-[80px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Ticket className="size-8 opacity-50" />
                    <p>沒有找到優惠券</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredCoupons.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium text-foreground">{item.title}</p>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => copyCode(item.code)}
                    className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-mono text-secondary-foreground hover:bg-accent transition-colors"
                    title="點擊複製"
                  >
                    <Copy className="size-3" />
                    {item.code}
                  </button>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {item.percent}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      isExpired(Number(item.due_date))
                        ? 'text-destructive'
                        : 'text-foreground'
                    }
                  >
                    {formatDate(Number(item.due_date))}
                  </span>
                  {isExpired(Number(item.due_date)) && (
                    <p className="text-xs text-destructive">已過期</p>
                  )}
                </TableCell>
                <TableCell>
                  {item.is_enabled ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      啟用
                    </Badge>
                  ) : (
                    <Badge variant="secondary">未啟用</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">操作選單</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setCoupon(item);
                          setMode('edit');
                          setIsOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                        編輯
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteThisCoupon(item.id, item.title)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4" />
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
      {pageData && (
        <PaginationDemo pagination={pageData} onPageChange={handlePageChange} />
      )}

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
};

export default Coupon;
