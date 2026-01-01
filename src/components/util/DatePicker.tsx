import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// 轉 YYYY-MM-DD
const toYmd = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  console.log(y, m , day)
  return `${y}-${m}-${day}`
}

// 避免 new Date("YYYY-MM-DD") 時區坑
const parseYmd = (s?: string) => {
  if (!s) return undefined
  const [y, m, d] = s.split("-").map(Number)
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
}

type DatePickerProps = {
  label?: string
  value?: string // "YYYY-MM-DD" | ""
  onChange?: (value: string) => void
  id?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

const DatePicker = ({
  label = "Publish Date",
  value = "",
  onChange,
  id = "publishDate",
  placeholder = "選擇日期",
  disabled,
  className,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false)

  const selectedDate = useMemo(() => parseYmd(value), [value])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id={id}
            disabled={disabled}
            className={cn("justify-between font-normal", !selectedDate && "text-muted-foreground")}
          >
            {selectedDate ? toYmd(selectedDate) : placeholder}
            <ChevronDownIcon className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={(d) => {
              const next = d ? toYmd(d) : ""
              onChange?.(next)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePicker
