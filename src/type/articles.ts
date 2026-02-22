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

export type ArticleModalProps = {
  isOpen: boolean;
  article?: Article | null;
  mode?: 'create' | 'edit';
  setIsOpen: (isOpen: boolean) => void;
  handleAskSave:(data:Article)=>void
};

 export  type Confirmtype = {
   isOpen: boolean;
   title: string;
   message: string;
   isLoading: boolean;
   error?:string;
   onConfirm: () => void | Promise<void>; // 這裡定義為函式類型
 };
