import type { ConfirmedOrder, Order, Confirmtype } from '@/type/order';
import { AxiosError } from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { deleteAdminOrders, getAdminOrders, editAdminOrders } from '@/api/folder_admin/order';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/products/hook/useConfirm';
import OrderModal from '@/components/products/orders/OrderModal';
import ConfirmModal from '@/components/products/ConfirmModal/ConfirmModal';
import { Loader } from '@/components/Loader';
import { useToastStore } from '@/store/toastStore';
import type { PaginationData } from '@/type/product';
import { PaginationDemo } from '@/components/util/Pagination';
import { thousandSeparator } from '@/helper/tool';

const AdminOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<Order>();
  const [confirmState, setConfirmState] = useState<Confirmtype & { error?: string }>({
    isOpen: false,
    title: '',
    message: '',
    isLoading: false,
    error: '', // 用來存错误信息
    onConfirm: () => { },
  });
  const confirmModal = useConfirm();
  const addToast = useToastStore((state) => state.addToast);

  const [pageData, setPageData] = useState<PaginationData>({
    total_pages: 0,
    current_page: 1,
    has_pre: false,
    has_next: false,
    category: '',
  });
  const handlePageChange = async (newPage: number) => {
    try {
      setIsLoading(true);
      const res = await getAdminOrders({ page: newPage.toString() });
      setOrders(res.data.orders);
      setPageData(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch orders for page', newPage, err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orders?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders?.map((o) => o.id) || []);
    }
  };
  const toggleSelect = (id: string) => {
    const hasChecked = selectedIds.indexOf(id) > -1;
    if (hasChecked) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getData = async () => {
    const res = await getAdminOrders({ page: '1' });
    setOrders(res.data.orders);
    setPageData(res.data.pagination);
    setIsLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);
  //  批次刪除
  const handleDeleteOrders = useCallback(() => {
    if (selectedIds.length === 0) return;
    confirmModal.confirm(
      {
        title: 'Delete Orders',
        message: `Are you sure you wanna delete ${selectedIds.length} ${selectedIds.length > 1 ? 'orders' : 'order'}?`,
        onSuccess: () => {
          setSelectedIds([]);
        },
      },
      async () => {
        for (const id of selectedIds) {
          await deleteAdminOrders(id);
        }
        await getData();
      },
    );
  }, [selectedIds, confirmModal]);

  //  單筆刪除
  const handleDeleteOrder = useCallback(
    (id: string, userName: string) => {
      confirmModal.confirm(
        {
          title: 'Delete Order',
          message: `Are you sure you wanna delete order from "${userName}"?`,
        },
        async () => {
          await deleteAdminOrders(id);
          await getData();
        },
      );
    },
    [confirmModal],
  );

  const handleOpenModalChange = (order: Order) => {
    setIsOpen(!isOpen)
    setOrder(order)
  }

  const closeConfirm = () => {
    // ✅ 加上小括號，明確告訴 TS 這是要回傳一個物件
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAskSave = (formData: ConfirmedOrder) => {
    setConfirmState({
      isOpen: true,
      title: 'Confirmed Save',
      message: `Do you want to confirm the Modification?`,
      isLoading: false,
      error: '', // 清空之前的错误
      onConfirm: async () => {
        // 真正打 API 的地方
        setConfirmState((prev) => ({ ...prev, isLoading: true, error: '' }));
        try {
          await editAdminOrders(formData.id, formData)
          getData()
          closeConfirm(); // 關閉確認對話框
          addToast(`Modify`, 'order', 'success'); // 成功後關閉 ProductModal

        } catch (err: unknown) {
          // 將後端錯誤信息顯示在 Modal 中
          let errorMsg = 'Modify Failed';
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
          setIsOpen(false);
        }
      },
    });
  };

  return (
    <>
      <OrderModal order={order as unknown as ConfirmedOrder} isOpen={isOpen} setIsOpen={setIsOpen}
        handleAskSave={handleAskSave} />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* header data */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="mt-1 text-2xl font-bold">{orders?.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Paid Orders</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {orders?.filter((o) => o.is_paid === true).length}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Unpaid Orders</p>
              <p className="mt-1 text-2xl font-bold text-orange-500">
                {orders?.filter((o) => o.is_paid === false).length}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="mt-1 text-xl font-bold text-primary sm:text-2xl">
                {orders
                  ?.filter((o) => o.is_paid === true)
                  .reduce((acc, curr) => acc + Number(curr.total), 0)}
              </p>
            </div>
          </div>
          <div className="mb-4 md:block hidden">
            <Button
              variant="destructive"
              disabled={selectedIds.length === 0}
              onClick={handleDeleteOrders}
            >
              Delete Selected(
              {selectedIds.length > 0 ? ` ${selectedIds.length})` : 0})
            </Button>
          </div>
          {/* table */}
          <div className="hidden md:block rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>
                    <Checkbox
                      checked={
                        selectedIds.length === orders?.length &&
                        (orders?.length ?? 0) > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    ></Checkbox>
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User Info</TableHead>
                  <TableHead className="text-center">Products Number</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Paid Status</TableHead>
                  <TableHead className="text-center">Order Date</TableHead>
                  <TableHead className="w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((o) => (
                  <TableRow key={o.id}>
                    {/* 1. Checkbox */}
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.indexOf(o.id) > -1}
                        onCheckedChange={() => toggleSelect(o.id)}
                      />
                    </TableCell>

                    {/* 2. Order ID */}
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>

                    {/* 3. User Info (對應 User Info 標題) */}
                    <TableCell>
                      <p className="font-medium">{o.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {o.user.email}
                      </p>
                    </TableCell>

                    {/* 4. Products Number (對應 Products Number 標題) */}
                    <TableCell className="text-center">
                      {/* 使用 Object.keys 計算 products 物件內的數量 */}
                      {Object.keys(o.products || {}).length}
                    </TableCell>

                    {/* 5. Total (對應 Total 標題) */}
                    <TableCell className="text-right font-bold">
                      ${thousandSeparator(Number(o.total).toFixed(0))}
                    </TableCell>

                    {/* 6. Paid Status (對應 Paid Status 標題) */}
                    <TableCell className="text-center">
                      <span
                        className={
                          o.is_paid ? 'text-green-600' : 'text-orange-500'
                        }
                      >
                        {o.is_paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </TableCell>

                    {/* 7. Order Date (對應 Order Date 標題) */}
                    <TableCell className="text-center">
                      {new Date(
                        Number(o.create_at) * 1000,
                      ).toLocaleDateString()}
                    </TableCell>

                    {/* 8. Action (對應 Action 標題) */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => { handleOpenModalChange(o) }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteOrder(o.id, o.user.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
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
          {/* Mobile */}
          <div className="md:hidden">
            {orders?.map((o) => (
              <div key={o.id} className="border-b border-border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{o.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {o.user.email}
                    </p>
                  </div>
                  <span
                    className={o.is_paid ? 'text-green-600' : 'text-orange-500'}
                  >
                    {o.is_paid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-lg font-bold">${o.total}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => { handleOpenModalChange(o) }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteOrder(o.id, o.user.name)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ ConfirmModal - 錯誤會自動顯示在這裡 */}
          <ConfirmModal
            isOpen={confirmModal.isOpen}
            onOpenChange={confirmModal.handleOpenChange}
            title={confirmModal.title}
            message={confirmModal.message}
            isLoading={confirmModal.isLoading}
            error={confirmModal.error} // ← 這裡會顯示錯誤訊息
            onConfirm={confirmModal.handleConfirm}
          />
        </>
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
      {pageData && (
        <PaginationDemo pagination={pageData} onPageChange={handlePageChange} />
      )}
    </>
  );
};

export default AdminOrder;
