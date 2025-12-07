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
