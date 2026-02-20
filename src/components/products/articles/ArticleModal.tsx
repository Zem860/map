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

  // 移除 Tag (使用 prev)
  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    console.log(e.target.value);
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

  const handleSave = () => {
    // TODO: 這裡呼叫你的 API，並帶上 tags
    const data= { ...formData, tag: tags } as Article;
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
