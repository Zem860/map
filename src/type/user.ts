export type UserLoginResponse = {
    status:boolean
    messssage:string
    uid:string
    token:string
    expired:number,
}

export type UserLoginInput = {
    username:string
    password:string
}