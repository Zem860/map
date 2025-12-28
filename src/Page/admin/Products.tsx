import { getProducts, createProduct, editProduct, deleteProduct } from '../../api/folder_admin/products';
import type { productData } from '../../type/product';
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductModal } from '../../components/products/ProductModal/ProductModal';
import { Loader } from '@/components/Loader';


const Products = () => {
    const [produc, setProduc] = useState<productData[]>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<productData | null>(null)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [isLoading, setIsLoading] = useState<boolean>(false)

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
            createProduct(product).then(()=>{getProduct();}).catch((err)=>{console.log(err)})
            
        } else {
            // edit product logic here
            editProduct(product.id, product).then(()=>{getProduct();}).catch((err)=>{console.log(err)})
        }

        setIsModalOpen(false)
        // Here you would typically save to your backend/database
    }


    const handleDelete = (id: string) => {
        setIsLoading(true)
        deleteProduct(id).then(() => {getProduct()}).then(()=>{getProduct();}).catch((err)=>{console.log(err)})
    }


    const getProduct = () => {
        const params = { page: "1", category: "" }
        getProducts(params)
            .then((res) => {
                setProduc(res.data.products)
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
    }, [])

    // const handleOpenDeleteModal = () => {
    //     setIsOpen(!isOpen)
    // }

    return (<>
        {isLoading ? <Loader /> : <>
            <Button onClick={() => { handleOpenAddModal(null) }} className="bg-primary hover:bg-primary/90">
                <Plus className="size-4" />
                新增書籍
            </Button>
            <main className="p-4 pb-20 md:p-6 md:pb-6">{produc?.map((item) => {
                return (<div key={item.id}>

                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <p>Price: {item.price}</p>
                    <img src={item.imageUrl} alt={item.title} width="200" />

                    <Button onClick={() => handleOpenAddModal(item)}>編輯  </Button>
                    <Button onClick={() => handleDelete(item.id)}>刪除</Button>
                </div>

                )
            })}</main>


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