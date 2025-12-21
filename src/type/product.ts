export type productData = {
    id:string,
    title:string,
    category:string,
    origin_price:number,
    price:number,
    unit:string,
    description:string,
    content:string,
    is_enabled:number,
    imageUrl:string,
    imagesUrl:string[],
    num:number
}

export type Pagination = {
    total_pages:number,
    current_page:number,
    has_pre:boolean,
    has_next:boolean,
    category:string,
}

export type CreateProductParams = {
    title:string,
    category:string,
    origin_price:number,
    price:number,
    unit:string,
    description:string,
    content:string,
    is_enabled:number,
    imageUrl:string,
    imagesUrl:string[],
}

export type UploadImageResponse = {
    success:boolean,
    imageUrl:string
}

export type ProductModalProps = {
    isOpen: boolean;
    onOpenChange:(isOpen:boolean)=>void;
    product?:productData| null; //為甚麼不是||
    onSave:(product:productData)=>void;
    mode?:'create' | 'edit';
}