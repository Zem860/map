import { Loader2, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { QtybarProps } from '@/type/product';

const Qtybar = ({ qty, setQty, disable, loading }: QtybarProps) => {
  const [localQty, setLocalQty] = useState(qty);

  useEffect(() => {
    setLocalQty(qty);
  }, [qty]);

  const selfNum = localQty < 1 ? 1 : localQty;

  return (
    <div
      className={`flex items-center border-2 border-border rounded-lg overflow-hidden transition-opacity ${
        loading ? 'opacity-70' : ''
      }`}
    >
      <button
        disabled={disable || selfNum <= 1}
        type="button"
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {
          const nextQty = Math.max(1, selfNum - 1);
          setLocalQty(nextQty);
          setQty(nextQty);
        }}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-10 text-center text-sm font-semibold border-x-2 border-border h-8 flex items-center justify-center">
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : selfNum}
      </span>
      <button
        disabled={disable}
        type="button"
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {
          const nextQty = selfNum + 1;
          setLocalQty(nextQty);
          setQty(nextQty);
        }}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
};

export default Qtybar;
