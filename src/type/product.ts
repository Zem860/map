export type SidebarDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

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
    rating:number
}

export type PaginationData = {
    total_pages:number,
    current_page:number,
    has_pre:boolean,
    has_next:boolean,
    category:string,
}

export type SearchData = {
    page:number,
    category:string,
    title?: string
}

export type ProductDataResponse = {
    success:boolean,
    products:productData[],
    pagination:PaginationData,
    messages:string[],
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

export type PaginationProps = {
    currentPage:number,
    totalPages:number,
    onPageChange:(page:number)=>void;
    siblingCount?:number
}


export type UploadImageResponse = {
    success:boolean,
    imageUrl:string
}

export type ProductModalProps = {
    isOpen: boolean;
    onOpenChange:(isOpen:boolean)=>void;
    product?:productData| null; 
    onSave:(product:productData)=>void;
    mode?:'create' | 'edit';
}

export type UseProductImagesArgs = {
  product?: productData
  isOpen: boolean
  maxImages?: number
}

export type ConfirmModalProps = {
    isOpen:boolean;
    onOpenChange:(isOpen:boolean)=>void;
    mode?:'delete'|'edit'
}


export type DatePickerProps = {
    lable?:string,
    value?:string, // yyyy-mm-dd
    onChange?:(value:string)=>void,
    id?:string,
    placeholder?:string,
    disabled?:boolean,
    className:string,
}