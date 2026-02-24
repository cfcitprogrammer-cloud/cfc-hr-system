// components/custom/dialogs/delete-refcheck.dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteRefCheckDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteRefCheckDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteRefCheckDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Reference Check</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>Are you sure you want to delete this reference check?</p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
