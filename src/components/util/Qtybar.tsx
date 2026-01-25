import { Minus, Plus } from "lucide-react"
type Props = {
  qty: number
  setQty: (qty: number) => void
}

const Qtybar = ({ qty, setQty }: Props) => {
  const selfNum = qty < 1 ? 1 : qty
  return (
    <div className="flex items-center border-2 border-border rounded-lg overflow-hidden">
      <button
        type="button"
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
        onClick={() => setQty(Math.max(1, selfNum - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>

      <span className="w-10 text-center text-sm font-semibold border-x-2 border-border h-8 flex items-center justify-center">
        {selfNum}
      </span>

      <button
        type="button"
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
        onClick={() => setQty(selfNum + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}

export default Qtybar
