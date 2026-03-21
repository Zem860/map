import type { couponData } from '@/type/coupon';
import { useState, useEffect } from 'react';
import {
  getCoupons,
  createCoupon,
  editCoupon,
  deleteCoupon,
} from '@/api/folder_admin/coupon';
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

  const timestampToYmd = (timestamp?: number) => {
    if (!timestamp) return '';
    const d = new Date(timestamp * 1000);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const openEditModal = (item: couponData | null) => {
    if (!item) {
      setCoupon(null);
      setMode('create');
      setIsOpen(true);
      return;
    }
    setCoupon({
      ...item,
      due_date: timestampToYmd(Number(item.due_date)),
    });
    setMode('edit');
    setIsOpen(true);
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
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
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
      title: 'Confirm Save',
      message: `Are you sure you want to save "${formData.title}"?`,
      isLoading: false,
      error: '', // 清空之前的错误
      onConfirm: async () => {
        // 真正打 API 的地方
        setConfirmState((prev) => ({ ...prev, isLoading: true, error: '' }));
        try {
          switch (mode) {
            case 'create':
              await createCoupon(formData);
              break;
            case 'edit':
              await editCoupon(formData.id, formData);
              break;
          }
          getInitialData(); // 儲存成功後重新抓取文章列表
          closeConfirm(); // 關閉確認對話框
          addToast(
            `${mode === 'create' ? 'create' : 'modify'}`,
            'coupon',
            'success'
          ); // 成功後關閉 ProductModal
        } catch (err: unknown) {
          // 將後端錯誤信息顯示在 Modal 中
          let errorMsg = 'Save failed';
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

  const deleteThisCoupon = async (id: string, title: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Confirm Delete',
      message: `Are you sure you want to delete "${title}"?`,
      isLoading: false,
      error: '', // 清空之前的错误
      onConfirm: async () => {
        // 真正打 API 的地方
        setConfirmState((prev) => ({ ...prev, isLoading: true, error: '' }));
        try {
          await deleteCoupon(id);
          getInitialData(); // 儲存成功後重新抓取文章列表
          closeConfirm(); // 關閉確認對話框
          addToast('delete', 'coupon', 'success'); // 成功後關閉 ProductModal
        } catch (err: unknown) {
          // 將後端錯誤信息顯示在 Modal 中
          let errorMsg = 'Delete failed';
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
            Coupon Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all coupon creation, editing, and deletion
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
          <p className="text-xs text-muted-foreground">Total Count</p>
          <p className="text-2xl font-bold text-foreground">{coupons.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Enabled</p>
          <p className="text-2xl font-bold text-primary">
            {coupons.filter((c) => c.is_enabled).length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Disabled</p>
          <p className="text-2xl font-bold text-foreground">
            {coupons.filter((c) => !c.is_enabled).length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Expired</p>
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
            placeholder="Search by title or code..."
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
            <p className="text-sm">No coupons found</p>
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
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      Disabled
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => copyCode(item.code)}
                    className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-mono text-secondary-foreground hover:bg-accent transition-colors"
                    title="Click to copy"
                  >
                    <Copy className="size-3" />
                    {item.code}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {'Due Date: '}
                  {formatDate(Number(item.due_date))}
                  {isExpired(Number(item.due_date)) && (
                    <span className="text-destructive ml-1">（Expired）</span>
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
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditModal(item)}>
                    <Pencil className="size-4" />
                    Modify
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteThisCoupon(item.id!, item.title)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    Delete
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
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[140px]">Coupon Code</TableHead>
              <TableHead className="w-[100px]">Discount</TableHead>
              <TableHead className="w-[140px]">Due Date</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
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
                    <p>No coupons found</p>
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
                    title="Click to copy"
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
                    <p className="text-xs text-destructive">Expired</p>
                  )}
                </TableCell>
                <TableCell>
                  {item.is_enabled ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Disabled</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(item)}>
                        <Pencil className="size-4" />
                        Modify
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteThisCoupon(item.id, item.title)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4" />
                        Delete
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
