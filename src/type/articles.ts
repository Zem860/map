import type { PaginationData } from "./product"
export type Article = {
  id: string
  title: string
  description: string
  image: string
  author: string
  content:string
  create_at: number
  isPublic: boolean
  tag: string[]
  num: number
}

export type Articles = {
  success:boolean,
  messages:string[],
  articles:Article[],
  pagination: PaginationData
}