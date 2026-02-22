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
import { useState, type ChangeEvent, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { ArticleModalProps, Article } from '@/type/articles'; // 你的型別路徑
import { FileInput } from 'lucide-react';
import { useProductImages } from '../ProductModal/hooks/useProductImages';
import { Switch } from '@/components/ui/switch';

export const ArticleModal = ({
  isOpen,
  setIsOpen,
  article,
  mode = 'create',
  handleAskSave,
}: ArticleModalProps) => {

  const [tags, setTags] = useState<string[]>(article?.tag || []);
  const [formData, setFormData] = useState<Partial<Article>>(
    article ? { ...article } : {},
  );
  const [inputValue, setInputValue] = useState('');

  // 當 article 改變時，更新 formData 和 tags
  useEffect(() => {
    if (article) {
      setFormData({ ...article });
      setTags(article.tag || []);
    } else {
      setFormData({});
      setTags([]);
    }
  }, [article, isOpen]);

  const images = useProductImages({
    item: article as Article||null,
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }))
  }

  const handleSave = async () => {
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
      create_at: article?.create_at || Math.floor(Date.now() / 1000),
      isPublic: formData.isPublic ?? true, // 需要新增 isPublic 欄位
      tag: tags,
      num: article?.num || 0,              // 編輯時保留
    } as Article;
    handleAskSave(data);
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 1. 稍微加寬 Dialog，並限制最大高度與 Flex 排版 */}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-6">

        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '新增文章' : '編輯文章'}
          </DialogTitle>
          <DialogDescription>
            編輯文章標籤，輸入後按下 Enter 新增。
          </DialogDescription>
        </DialogHeader>

        {/* 2. 將中間的表單內容包裝起來，加入 overflow-y-auto 讓它可捲動 */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5">

          {/* 3. 將 Title, Author 與 Public 開關合併到 Grid 雙欄排版 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData?.title || ''}
                onChange={handleInputChange}
                placeholder="article title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData?.author || ''}
                onChange={handleInputChange}
                placeholder="article author"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="isPublic" className="mb-0">
              Public
            </Label>
            <Switch
              id="isPublic"
              checked={formData.isPublic ?? false}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label id="tags-label" htmlFor="tags">
              Tags
            </Label>
            <div
              className={cn(
                'flex flex-wrap gap-2 p-2 border rounded-md bg-background min-h-[42px]',
                'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-primary',
                'cursor-text'
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
                placeholder={tags.length === 0 ? 'enter tags...' : ''}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* 圖片上傳 */}
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
                <FileInput className="size-4 mr-2" />
                選擇圖片
              </Button>
            </div>

            <Label className="text-xs text-muted-foreground">圖片預覽（儲存後才會上傳檔案）</Label>

            {/* 這裡也可以改成橫向排列 grid-cols-4 節省垂直高度 */}
            <div className="grid grid-cols-1 gap-3 mt-2">
              {images.uploadedImages.map((image: string, index: number) => (
                <div
                  key={`url-${index}`}
                  className="relative aspect-square rounded-lg border-2 border-border overflow-hidden group"
                >
                  {index === 0 && (
                    <div className="absolute top-1 left-1 z-10 bg-primary text-primary-foreground text-[10px] px-1 py-0.5 rounded-sm font-medium">
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
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    onClick={() => images.deleteUrlImage(index)}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}

              {images.selectedPreviews.map((p: string, i: number) => (
                <div
                  key={`file-${i}`}
                  className="relative aspect-square rounded-lg border-2 border-border overflow-hidden group"
                >
                  <img
                    src={p}
                    alt={`待上傳圖片 ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 z-10 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded">
                    待上傳
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    onClick={() => images.deleteSelectedFile(i)}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}

              {Array.from({ length: 1 - images.totalCount }).map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30"
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData?.description || ''}
              onChange={handleInputChange}
              placeholder="paste article's thought"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData?.content || ''}
              onChange={handleInputChange}
              placeholder="paste reader's thought"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4 mt-auto">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
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
