export type OrderUser = {
    name: string
    email: string
    tel: string
    address: string
}

export type OrderData = {
    user: OrderUser,
    message: string
}

export type OrderParams = {
    data: OrderData
}