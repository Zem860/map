import { create } from "zustand"
import type{ OrderParams } from "@/type/order"

type UserStore = {
    userInfo: OrderParams | null
    updateUserInfo: (info: OrderParams) => void
    clearUserInfo:()=>void;
}

export const useUserStore = create<UserStore>((set) => ({
  userInfo: null,
  updateUserInfo: (info: OrderParams) => {
    set({ userInfo: info })
  },
  clearUserInfo: () => {
    set({ userInfo: null })
  }
}))
