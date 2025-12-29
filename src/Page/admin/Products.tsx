import { getProducts, createProduct, editProduct, deleteProduct } from '@/api/folder_admin/products';
import type { productData, ProductDataResponse, PaginationData } from '@/type/product';
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ProductModal } from '@/components/products/ProductModal/ProductModal';
import { Loader } from '@/components/Loader';
import { PaginationDemo } from '@/components/Pagination';


const Products = () => {
    const [produc, setProduc] = useState<productData[]>()
    const [pagination, setPagination] = useState<PaginationData>()
    const [page, setPage] = useState<number>(1)
    const [category, setCategory] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<productData | null>(null)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("zh-TW", {
            style: "currency",
            currency: "TWD",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const handleOpenAddModal = (item: productData | null) => {
        if (!item) {
            setCurrentProduct(null)
            setMode("create")
            setIsModalOpen(true)
            return
        }
        setCurrentProduct(item)
        setMode("edit")
        setIsModalOpen(true)
    }

    const handleSave = (product: productData) => {
        setIsLoading(true)
        if (mode === "create") {
            createProduct(product).then(() => { getProduct(); }).catch((err) => { console.log(err) })

        } else {
            // edit product logic here
            editProduct(product.id, product).then(() => { getProduct(); }).catch((err) => { console.log(err) })
        }

        setIsModalOpen(false)
        // Here you would typically save to your backend/database
    }


    const handleDelete = (id: string) => {
        setIsLoading(true)
        deleteProduct(id).then(() => { getProduct() }).then(() => { getProduct(); }).catch((err) => { console.log(err) })
    }


    const getProduct = () => {
        const params = { page: page.toString(), category }
        setIsLoading(true)
        getProducts(params)
            .then((res) => {
                const data: ProductDataResponse = res.data
                setProduc(data.products)
                setPagination(data.pagination)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }


    useEffect(() => {
        getProduct();
    }, [page, category])

    // const handleOpenDeleteModal = () => {
    //     setIsOpen(!isOpen)
    // }
    return (<>
        {isLoading ? <Loader /> : <>

            <div className='space-y-4 mb-4 flex items-center justify-end'>
                <Button onClick={() => { handleOpenAddModal(null) }} className=" ml-auto  bg-primary hover:bg-primary/90">
                    <Plus className="size-4" />
                    新增書籍
                </Button>
            </div>
            <div className='grid gap-3 md:hidden'>
                {
                    produc?.map(item => {
                        return (
                            <div key={item.id} className='rounded-lg border border-border bg-card p-4'>
                                <div className='flex gap-3'>
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                                        <img src={item.imageUrl} alt={item.title} className='object-cover' />
                                    </div>
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
                                                <DropdownMenuItem onClick={() => handleOpenAddModal(item)}>編輯</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(item.id)}>刪除</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                                        <Badge variant="outline" className="text-xs">
                                            {item.category}
                                        </Badge>
                                    </div>
                                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                                        <Badge variant={!item.is_enabled ? "default" : "secondary"} className="text-xs">
                                            {item.is_enabled ? 'enabled' : 'not enabled'}
                                        </Badge>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-sm">
                                        <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
                                        <span className="text-muted-foreground">stock: {item.num}</span>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }
            </div>

            <div className="hidden md:block rounded-lg border border-border bg-card">
                <Table >
                    <TableHeader>
                        <TableRow className='hover:bg-transparent'>
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
                        {produc?.map((item) => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className='relative h-12 w-12 overflow-hidden rounded-md bg-muted'>
                                            <img src={item.imageUrl} alt={item.title} className='object-cover' />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='min-w-0'>
                                            <p className='font-medium  '>{item.title}</p>
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
                                                <DropdownMenuItem onClick={() => handleOpenAddModal(item)}>編輯</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(item.id)}>刪除</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </div>
            {pagination && (
                <PaginationDemo pagination={pagination} onPageChange={setPage} />
            )}
            {/* <ConfirmModal isOpen={isOpen} onOpenChange={handleOpenDeleteModal} /> */}

            <ProductModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                product={currentProduct}
                onSave={handleSave}
                mode={mode}
            />

        </>}
        {/* <Button onClick={handleOpenDeleteModal}></Button> */}

    </>);
}

export default Products;