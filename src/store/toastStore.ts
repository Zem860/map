import { create } from 'zustand';

// 定義 Toast 的資料結構
export interface ToastMessage {
  id: string; // 用 string (UUID 或 Date.now().toString()) 比較保險
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info'; // 可選：用來區分顏色
  duration?: number; // 可選：自定義秒數
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (
    title: string,
    message: string,
    type?: ToastMessage['type'],
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (title, message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, title, message, type, duration }],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
