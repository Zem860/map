import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { useState, type ChangeEvent, useCallback } from 'react';
import type { couponData, CouponModalProps } from '@/type/coupon';
import DatePicker from '@/components/util/DatePicker';
import { Switch } from '@/components/ui/switch';

export const CouponModal = ({
  isOpen,
  setIsOpen,
  coupons,
  mode = 'create',
  handleAskSave,
}: CouponModalProps) => {
  const [formData, setFormData] = useState<Partial<couponData>>(
    coupons ? { ...coupons } : {},
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFormData = useCallback(() => {
    setFormData(coupons ? { ...coupons } : {});
  }, [coupons]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      resetFormData();
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_enabled: checked ? 1 : 0 }));
  };

  const handleSave = async () => {
    const timestamp = formData.due_date
      ? typeof formData.due_date === 'number'
        ? formData.due_date
        : Math.floor(new Date(formData.due_date).getTime() / 1000)
      : 0;
    const data = {
      id: coupons?.id || '', // 編輯時使用，建立時後端生成
      code: formData.code || '',
      title: formData.title || '',
      percent: Number(formData.percent) || 0,
      is_enabled: formData.is_enabled ? 1 : 0,
      due_date: Number(timestamp) || '',
    } as couponData;
    handleAskSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* 1. 稍微加寬 Dialog，並限制最大高度與 Flex 排版 */}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'create coupon' : 'modify coupon'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'create coupon details'
              : 'modify coupon details'}
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
                placeholder="coupon title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                value={formData?.code || ''}
                onChange={handleInputChange}
                placeholder="coupon code"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="is_enabled" className="mb-0">
              is_enabled
            </Label>
            <Switch
              id="is_enabled"
              checked={formData.is_enabled === 1}
              onCheckedChange={handleSwitchChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="percent">Percent</Label>
              <Input
                id="percent"
                name="percent"
                type="number"
                value={formData?.percent || 0}
                onChange={handleInputChange}
                placeholder="discount percent"
              />
            </div>
            <div className="space-y-2">
              <DatePicker
                id="publishDate"
                label="Due Date"
                value={formData.due_date ? String(formData.due_date) : ''} onChange={(value) =>
                  setFormData((prev) => ({ ...prev, due_date: value }))
                }
              />
            </div>
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

export default CouponModal;
