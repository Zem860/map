export type couponData = {
    code: string,
    due_date: number,
    id: string,
    is_enabled: number,
    percent: number,
    title: string
}

export type couponCode = {
    code: string,
}

export type CouponModalProps = {
  isOpen: boolean;
  coupons?: couponData | null;
  mode?: 'create' | 'edit';
  setIsOpen: (isOpen: boolean) => void;
  handleAskSave:(data:couponData)=>void
};