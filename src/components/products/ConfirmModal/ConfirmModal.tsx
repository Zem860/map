import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog"
import { Button } from "../../ui/button"

type ConfirmModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  message: string
  onConfirm: () => void
}

const ConfirmModal = ({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">{message}</p>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            {"Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmModal