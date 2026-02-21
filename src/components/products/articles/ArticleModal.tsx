import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import type { ArticleModalProps, Article } from '@/type/articles'; // 你的型別路徑
import { FileInput } from 'lucide-react';
import { useProductImages } from '../ProductModal/hooks/useProductImages';

export const ArticleModal = ({
  isOpen,
  setIsOpen,
  article,
  mode = 'create',
  handleAskSave,
}: ArticleModalProps) => {

  const [tags, setTags] = useState<string[]>(article?.tag || []);
  const [formData, setFormData] = useState<Partial<Article>>(
    // 如果有 article 就用它，沒有就給空物件
    article ? { ...article } : {},
  );
  const [inputValue, setInputValue] = useState('');

  
  const images = useProductImages({
  item: formData as Article,
  isOpen,
  maxImages: 4,
})

  // 移除 Tag (使用 prev)
  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };

  // 鍵盤操作 (使用 prev)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();

      if (newTag) {
        setTags((prev) => {
          if (prev.includes(newTag)) return prev; // 防重複
          return [...prev, newTag];
        });
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue) {
      setTags((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
    }
  };

  const handleSave = async () => {
    console.log(formData, tags);
    // TODO: 這裡呼叫你的 API，並帶上 tags
     let imageUrl = images.uploadedImages[0] || '';
      console.log('imageUrl:', imageUrl);
    // 上傳待上傳的檔案
    if (images.selectedFiles.length > 0) {
      try {
        const urls = await images.uploadSelectedFiles();
        imageUrl = urls[0];
      } catch (error) {
        alert('上傳失敗');
        return;
      }
    }
  const data = {
    id: article?.id || '',              // 編輯時使用，建立時後端生成
    title: formData.title || '',
    description: formData.description || '',
    image: imageUrl || '', // 只取第一張，作為封面
    author: formData.author || '',       // 需要輸入欄位
    content: formData.content || '',     // 需要輸入欄位
    create_at: article?.create_at || Date.now(),
    isPublic: formData.isPublic ?? true, // 需要新增 isPublic 欄位
    tag: tags,
    num: article?.num || 0,              // 編輯時保留
  } as Article;
      handleAskSave(data);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '新增文章' : '編輯文章'}
          </DialogTitle>
          <DialogDescription>
            編輯文章標籤，輸入後按下 Enter 新增。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData?.title}
            onChange={(e) => handleInputChange(e)}
            placeholder="book title"
          />
        </div>

        <div className="grid gap-4 py-2">
          {/* 顯示與隱藏input，假裝div是input */}
          <Label id="tags" htmlFor="tags">
            Tags
          </Label>
          <div
            className={cn(
              'flex flex-wrap gap-2 p-2 border rounded-md bg-background min-h-[42px]',
              'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-primary',
              'cursor-text',
            )}
          >
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="gap-1 pr-1 text-sm font-normal"
              >
                {tag}
                <button
                  type="button"
                  className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}

            <input
              id="tags"
              type="text"
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[80px] text-sm h-6"
              placeholder={tags.length === 0 ? '輸入標籤...' : ''}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div className="space-y-2">
            <div className="flex gap-2">
              <input
                ref={images.fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={images.handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={images.triggerFileInput}
                disabled={images.isMax}
              >
                <FileInput className="size-4" />
                選擇圖片
              </Button>
            </div>
        </div>
        
            {/* 圖片預覽 */}
            <div className="space-y-2">
              <Label>圖片預覽（儲存後才會上傳檔案）</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* 已有 URL 圖 */}
                {images.uploadedImages.map((image: string, index: number) => (
                  <div
                    key={`url-${index}`}
                    className="relative aspect-square rounded-lg border-2 border-border overflow-hidden group"
                  >
                    {index === 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                        主圖
                      </div>
                    )}

                    <img
                      src={image}
                      alt={`圖片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => images.deleteUrlImage(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}

                {/* 本次選檔 blob 預覽 */}
                {images.selectedPreviews.map((p: string, i: number) => {
                  const idx = images.uploadedImages.length + i
                  return (
                    <div
                      key={`file-${i}`}
                      className="relative aspect-square rounded-lg border-2 border-border overflow-hidden group"
                    >
                      <img
                        src={p}
                        alt={`待上傳圖片 ${i + 1}`}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute bottom-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        待上傳
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => images.deleteSelectedFile(i)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )
                })}

                {/* Placeholder */}
                {Array.from({ length: 1- images.totalCount }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30"
                  />
                ))}
              </div>
            </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="description"
            name="description"
            value={formData?.description}
            onChange={(e) => handleInputChange(e)}
            placeholder="paste reader's thought"
            rows={3}
          ></Textarea>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            取消
          </Button>
          <Button onClick={handleSave}>
            {mode === 'create' ? '發布' : '儲存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;
