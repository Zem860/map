import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Alert, AlertDescription } from "../../ui/alert"

type ConfirmModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  message: string
  isLoading?: boolean
  error?: string
  onConfirm: () => void
}

const ConfirmModal = ({
  isOpen,
  onOpenChange,
  title,
  message,
  isLoading = false,
  error,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="confirm-dialog-description">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p id="confirm-dialog-description" className="text-muted-foreground">{message}</p>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            取消
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "處理中..." : "確認"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmModal