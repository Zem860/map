import { getProducts, createProduct, editProduct } from '../../api/folder_admin/products';
import type { productData } from '../../type/product';
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductModal } from '../../components/products/ProductModal/ProductModal';
import ConfirmModal from '../../components/products/ConfirmModal/ConfirmModal';

const Products = () => {

    const [produc, setProduc] = useState<productData[]>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<productData | null>(null)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const handleOpenAddModal = (item:productData|null) => {
        if (!item) {
            setCurrentProduct(null)
            setMode("create")
            setIsModalOpen(true)
        }
        setCurrentProduct(item)
        setMode("edit")
        setIsModalOpen(true)
    }

    const handleSave = (product: productData) => {
        if (mode === "create"){
            createProduct(product)
        } else {
            // edit product logic here
            editProduct(product.id, product)
        }
        
        setIsModalOpen(false)
        // Here you would typically save to your backend/database
    }
    useEffect(() => {

        const params = { page: "1", category: "" }
        getProducts(params).then((res) => {
            setProduc(res.data.products)
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        })

    }, [])


    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleOpenDeleteModal = () => {
        setIsOpen(!isOpen)
    }

    return (<>

        <Button onClick={handleOpenDeleteModal}></Button>
        <Button onClick={()=>{handleOpenAddModal(null)}} className="bg-primary hover:bg-primary/90">
            <Plus className="size-4" />
            新增書籍
        </Button>
        <main className="p-4 pb-20 md:p-6 md:pb-6">{produc?.map((item) => {
            return (<>
                <div key={item.id}>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <p>Price: {item.price}</p>
                    <img src={item.imageUrl} alt={item.title} width="200" />
                </div>
                <Button onClick={() => handleOpenAddModal(item)}>編輯  </Button>
                </>

            )
        })}</main>


        <ConfirmModal isOpen={isOpen} onOpenChange={handleOpenDeleteModal} />

        <ProductModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            product={currentProduct}
            onSave={handleSave}
            mode={mode}
        />
    </>);
}

export default Products;