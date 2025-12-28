import { Dialog, DialogContent,DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog"
import type { ConfirmModalProps } from "@/type/product";
import ConfirmButton from "./ConfirmButton";
const ConfirmModal = ({
    isOpen,
    onOpenChange,
    mode = "delete",
}: ConfirmModalProps) => {
    const text = mode === "delete" ? "確認刪除?" : "確認編輯"
    return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                {mode === "delete" ? "你確定要刪除嗎?" : "確定要修改嗎?"}

                </DialogTitle>
            </DialogHeader>
            {mode === "delete" ? "你確定要刪除嗎?" : "確定要修改嗎?"}
            <DialogFooter>
            <ConfirmButton >{text}</ConfirmButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>);
}

export default ConfirmModal; 