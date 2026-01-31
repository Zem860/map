import { Loader2, Minus, Plus } from "lucide-react"
type Props = {
  qty: number
  setQty: (qty: number) => void
  disable?: boolean
  loading?: boolean
}

const Qtybar = ({ qty, setQty, disable, loading }: Props) => {
  const selfNum = qty < 1 ? 1 : qty
  const isDisabled = disable || loading
  
  return (
    <div className={`flex items-center border-2 border-border rounded-lg overflow-hidden transition-opacity ${loading ? 'opacity-70' : ''}`}>
      <button
        disabled={isDisabled || selfNum <= 1}
        type="button"
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setQty(Math.max(1, selfNum - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>

      <span className="w-10 text-center text-sm font-semibold border-x-2 border-border h-8 flex items-center justify-center">
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : selfNum}
      </span>

      <button
        disabled={isDisabled}
        type="button"
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setQty(selfNum + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}

export default Qtybar
