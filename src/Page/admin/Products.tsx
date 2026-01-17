import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ProductModal } from '@/components/products/ProductModal/ProductModal'
import { Loader } from '@/components/Loader'
import { PaginationDemo } from '@/components/util/Pagination'
import CategoryPicker from '@/components/products/SearchArea/CategoryPicker'
import { useProducts } from "@/components/products/hook/useProductsHook"
import ConfirmModal from "@/components/products/ConfirmModal/ConfirmModal"
import { useState } from "react"
import type { productData } from "@/type/product"

const Products = () => {
  const {
    products,
    pagination,
    categories,
    isLoading,
    searchData,
    isModalOpen,
    setIsModalOpen,
    currentProduct,
    mode,
    formatPrice,
    handleCategoryChange,
    handlePageChange,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
  } = useProducts()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string
    message: string
    action: () => Promise<void>
  } | null>(null)


  // 開啟刪除確認
// 統一的確認彈窗觸發器
// type: 'delete' | 'create' | 'edit'
// data: 如果是刪除就傳 ID，如果是新增/修改就傳 product 物件
const askConfirm = (type, data) => {
  let title = "";
  let message = "";
  let action = null;

  if (type === 'delete') {
    title = "確認刪除";
    message = `您確定要刪除「${data.title}」嗎？此操作無法復原。`;
    action = async () => await handleDelete(data.id);
  } 
  else if (type === 'create') {
    title = "確認新增";
    message = `確定要建立新產品「${data.title}」嗎？`;
    action = async () => await handleSave(data);
  } 
  else {
    title = "確認修改";
    message = `確定要儲存對「${data.title}」的變更嗎？`;
    action = async () => await handleSave(data);
  }

  // 設定到 State 裡
  setConfirmConfig({
    title,
    message,
    action: async () => {
      await action();
      setConfirmOpen(false); // 關閉確認視窗
      if (isModalOpen) setIsModalOpen(false); // 如果有開啟編輯視窗也一併關閉
    }
  });
  
  setConfirmOpen(true);
};

  return (
    <>
      {isLoading ? <Loader /> : (
        <>
          <div className='space-y-4 mb-4 flex items-center justify-between'>
            <CategoryPicker
              searchData={searchData}
              onCategoryChange={handleCategoryChange}
              categories={categories}
            />
            <Button onClick={openCreateModal} className="ml-auto bg-primary hover:bg-primary/90">
              <Plus className="size-4" />
              新增書籍
            </Button>
          </div>

          {/* 手機版 */}
          <div className='grid gap-3 md:hidden'>
            {products?.map(item => (
              <div key={item.id} className='rounded-lg border border-border bg-card p-4'>
                <div className='flex gap-3'>
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img src={item.imageUrl} alt={item.title} className='object-cover' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='min-w-0'>
                        <p className='font-medium truncate'>{item.title}</p>
                        <p className='text-sm text-muted-foreground line-clamp-1'>{item.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(item)}>編輯</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => askDelete(item.id, item.title)}>刪除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </div>
                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                      <Badge variant={!item.is_enabled ? "default" : "secondary"} className="text-xs">
                        {item.is_enabled ? 'enabled' : 'not enabled'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 桌面版 */}
          <div className="hidden md:block rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='w-20'>Id</TableHead>
                  <TableHead className='w-20'>Image</TableHead>
                  <TableHead className="w-[150px]">Title</TableHead>
                  <TableHead className='w-20'>Category</TableHead>
                  <TableHead className='text-right'>Price</TableHead>
                  <TableHead className='text-right'>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='w-20'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.num}</TableCell>
                    <TableCell>
                      <div className='relative h-12 w-12 overflow-hidden rounded-md bg-muted'>
                        <img src={item.imageUrl} alt={item.title} className='object-cover' />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='min-w-0'>
                        <p className='font-medium'>{item.title}</p>
                        <p className='text-sm w-[150px] truncate text-muted-foreground line-clamp-1'>{item.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatPrice(item.price)}</TableCell>
                    <TableCell className="text-right">{item.num}</TableCell>
                    <TableCell>
                      <Badge variant={!item.is_enabled ? "default" : "secondary"} className="text-xs">
                        {item.is_enabled ? 'enabled' : 'not enabled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(item)}>編輯</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => askConfirm('delete', { id: item.id, title: item.title })}>刪除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination && (
            <PaginationDemo pagination={pagination} onPageChange={handlePageChange} />
          )}

          <ProductModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            product={currentProduct}
            onSave={(product) => askConfirm(mode === 'create' ? 'create' : 'edit', product)}
            mode={mode}
          />

          {/* 通用確認 Modal */}
          <ConfirmModal
            isOpen={confirmOpen}
            onOpenChange={setConfirmOpen}
            title={confirmConfig?.title ?? ""}
            message={confirmConfig?.message ?? ""}
            onConfirm={confirmConfig?.action}
          />
        </>
      )}
    </>
  )
}

export default Products