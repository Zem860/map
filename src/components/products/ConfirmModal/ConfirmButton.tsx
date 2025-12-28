import { Button } from "@/components/ui/button"
import type { BtnProps } from "@/type/product"

const ConfirmButton = ({ children, ...props }: BtnProps) => {
  return <Button {...props}>{children}</Button>
}

export default ConfirmButton
