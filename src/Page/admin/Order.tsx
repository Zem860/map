import type { Order } from "@/type/order";
import { useEffect, useState, useCallback } from "react";
import { deleteAdminOrders, getAdminOrders } from "@/api/folder_admin/order";
import { Table, TableBody, TableHead, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/products/hook/useConfirm";
import ConfirmModal from "@/components/products/ConfirmModal/ConfirmModal";
import { Loader } from "@/components/Loader";
const AdminOrder = () => {
    const [orders, setOrder] = useState<Order[] | undefined>(undefined);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const confirmModal = useConfirm()

    const toggleSelectAll = () => {
        if (selectedIds.length === orders?.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(orders?.map((o) => o.id) || []);
        }
    }
    const toggleSelect = (id: string) => {
        const hasChecked = selectedIds.indexOf(id) > -1
        if (hasChecked) {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    const getData = async () => {
        setIsLoading(true);
        const res = await getAdminOrders({ page: "1" });
        setOrder(res.data.orders);
        setIsLoading(false);
    }
    useEffect(() => {
        getData();
    }, []);
    //  批次刪除
    const handleDeleteOrders = useCallback(() => {
        if (selectedIds.length === 0) return;
        confirmModal.confirm(
            {
                title: "Delete Orders",
                message: `Are you sure you wanna delete ${selectedIds.length} ${selectedIds.length > 1 ? "orders" : "order"}?`,
                onSuccess: () => {
                    setSelectedIds([]);
                }
            },
            async () => {
                for (const id of selectedIds) {
                    await deleteAdminOrders(id);
                }
                await getData();
            }
        )
    }, [selectedIds, confirmModal])

    //  單筆刪除
    const handleDeleteOrder = useCallback((id: string, userName: string) => {
        confirmModal.confirm(
            {
                title: "Delete Order",
                message: `Are you sure you wanna delete order from "${userName}"?`,
            },
            async () => {
                await deleteAdminOrders(id);
                await getData();
            }
        )
    }, [confirmModal])

    return (
        <>
            {isLoading ? 
            <Loader/>:<>
            {/* header data */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-4">
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="mt-1 text-2xl font-bold">{orders?.length}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Paid Orders</p>
                    <p className="mt-1 text-2xl font-bold text-green-600">{orders?.filter((o) => o.is_paid === true).length}</p>
                </div><div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Unpaid Orders</p>
                    <p className="mt-1 text-2xl font-bold text-orange-500">{orders?.filter((o) => o.is_paid === false).length}</p>
                </div><div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="mt-1 text-xl font-bold text-primary sm:text-2xl">
                        {orders?.filter((o) => o.is_paid === true).reduce((acc, curr) => acc + Number(curr.total), 0)}</p>
                </div>
            </div>
            <div className="mb-4">
                <Button
                    variant="destructive"
                    disabled={selectedIds.length === 0}
                    onClick={handleDeleteOrders}
                >
                    Delete Selected({selectedIds.length > 0 ? ` ${selectedIds.length})` : 0})
                </Button>
            </div>
            {/* table */}
            <div className="hidden md:block rounded-lg border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>
                                <Checkbox checked={selectedIds.length === orders?.length
                                    && orders?.length! > 0} onCheckedChange={toggleSelectAll}>
                                </Checkbox>
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
                                <TableCell className="font-mono text-xs">
                                    {o.id}
                                </TableCell>

                                {/* 3. User Info (對應 User Info 標題) */}
                                <TableCell>
                                    <p className="font-medium">{o.user.name}</p>
                                    <p className="text-sm text-muted-foreground">{o.user.email}</p>
                                </TableCell>

                                {/* 4. Products Number (對應 Products Number 標題) */}
                                <TableCell className="text-center">
                                    {/* 使用 Object.keys 計算 products 物件內的數量 */}
                                    {Object.keys(o.products || {}).length}
                                </TableCell>

                                {/* 5. Total (對應 Total 標題) */}
                                <TableCell className="text-right font-bold">
                                    ${o.total}
                                </TableCell>

                                {/* 6. Paid Status (對應 Paid Status 標題) */}
                                <TableCell className="text-center">
                                    <span className={o.is_paid ? "text-green-600" : "text-orange-500"}>
                                        {o.is_paid ? "Paid" : "Unpaid"}
                                    </span>
                                </TableCell>

                                {/* 7. Order Date (對應 Order Date 標題) */}
                                <TableCell className="text-center">
                                    {new Date(Number(o.create_at) * 1000).toLocaleDateString()}
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
                                            <DropdownMenuItem onClick={() => { }}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </DropdownMenuItem >
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteOrder(o.id, o.user.name)}>
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

            {/* ✅ ConfirmModal - 錯誤會自動顯示在這裡 */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onOpenChange={confirmModal.handleOpenChange}
                title={confirmModal.title}
                message={confirmModal.message}
                isLoading={confirmModal.isLoading}
                error={confirmModal.error}  // ← 這裡會顯示錯誤訊息
                onConfirm={confirmModal.handleConfirm}
            />
            </>}
        </>);
}

export default AdminOrder;