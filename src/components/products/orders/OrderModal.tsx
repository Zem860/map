import type { ConfirmedOrder, OrderModalProps, UserInfo } from '@/type/order';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useState, useEffect, type ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getUnixTimestamp } from '@/helper/tool';

const OrderModal = ({
  isOpen = true,
  setIsOpen,
  order,
  handleAskSave,
}: OrderModalProps) => {
  const [formData, setFormData] = useState<Partial<ConfirmedOrder>>();

  // 1. 補上 [order] 依賴，確保傳入的 order 更新時，formData 也會跟著更新
  useEffect(() => {
    if (order) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ ...order } as ConfirmedOrder);
    }
  }, [order]);

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_paid: checked }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // 防呆：確保 prev 存在
      const currentData = prev || {};
      const isUserData = currentData.user && name in currentData.user;
      if (isUserData) {
        return {
          ...currentData,
          user: {
            ...(currentData.user || {}),
            [name]: value,
          } as UserInfo,
        };
      }
      //處理userInfo
      return {
        ...currentData,
        [name]: value,
      };
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    // 2. 點擊取消時，重置 formData 為初始 order 資料，避免下次開啟時帶入未保存的修改
    setFormData(order ? { ...order } : undefined);
  };

  const handleSave = async () => {
    const createdAt = order?.create_at ?? getUnixTimestamp();
    const finalData = {
      ...formData,
      create_at: createdAt,
    } as ConfirmedOrder;
    setFormData(finalData);
    handleAskSave(formData as ConfirmedOrder);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>Edit Order Info</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
          <div className="flex items-center gap-3">
            <Label htmlFor="isPublic" className="mb-0">
              Payment Status
            </Label>
            <Switch
              id="isPublic"
              checked={formData?.is_paid ?? false}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Buyer</Label>
            {/* 4. 將 name 改為 "name"，並對應正確的 onChange 函式名稱 */}
            <Input
              id="userName"
              name="name"
              value={formData?.user?.name || ''}
              onChange={handleInputChange}
              placeholder="order buyer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userEmail">Email</Label>
            <Input
              id="userEmail"
              name="email"
              value={formData?.user?.email || ''}
              onChange={handleInputChange}
              placeholder="buyer email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userAddress">Address</Label>
            <Input
              id="userAddress"
              name="address"
              value={formData?.user?.address || ''}
              onChange={handleInputChange}
              placeholder="buyer address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Telephone</Label>
            <Input
              id="telephone"
              name="tel"
              value={formData?.user?.tel || ''}
              placeholder="buyer telephone"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="msg">Message</Label>
            <Textarea
              id="msg"
              name="message"
              value={formData?.message}
              placeholder="buyer message"
              onChange={handleInputChange}
            ></Textarea>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} type="button">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
