import { useToastStore } from '@/store/toastStore';
const Article = () => {
	const addToast = useToastStore((state) => state.addToast);
	const handleClick = () => {
    // 2. 呼叫它！參數：標題, 內容, 類型
    addToast('儲存成功', '你的資料已經安全存檔。', 'success');
  };
  return (
    <button onClick={handleClick} className="btn">
      測試 Toast
    </button>
  );
};

export default Article;
