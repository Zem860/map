import { useEffect } from 'react';
import { useToastStore, type ToastMessage } from '@/store/toastStore'; // 假設路徑
import { X } from 'lucide-react';
const ToastItem = ({
  id,
  title,
  message,
  type,
  duration = 3000,
}: ToastMessage) => {
  const removeToast = useToastStore((state) => state.removeToast);
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => clearTimeout(timer); // 清理計時器防止記憶體洩漏
  }, [id, duration, removeToast]);

  // 根據 type 決定顏色 (你可以根據設計系統調整)
  const bgColor =
    type === 'error'
      ? 'bg-red-500'
      : type === 'success'
      ? 'bg-green-500'
      : 'bg-blue-600';

  return (
    <div className="pointer-events-auto w-80 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition-all animate-in slide-in-from-right duration-300 mb-3">
      <div
        className={`flex items-center justify-between px-4 py-2 ${bgColor} text-white`}
      >
        <span className="font-bold">{title}</span>
        <button onClick={() => removeToast(id)} className="hover:opacity-80">
          <X size={16} />
        </button>
      </div>
      <div className="p-4 text-sm text-gray-600 bg-white">{message}</div>
    </div>
  );
};

// 容器元件 (放在 App 最外層)
export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    // fixed 定位在右上角，pointer-events-none 確保不會擋到下面按鈕的點擊
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}
