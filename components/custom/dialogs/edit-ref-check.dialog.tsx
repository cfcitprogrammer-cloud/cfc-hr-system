// components/custom/dialogs/edit-refcheck.dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReferenceCheck } from "@/lib/types/refcheck";

type EditRefCheckDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  refCheck: ReferenceCheck | null;
};

export const EditRefCheckDialog = ({
  isOpen,
  onClose,
  refCheck,
}: EditRefCheckDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reference Check</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* Input fields for editing the reference check */}
          <Input
            defaultValue={refCheck?.receiver_name}
            placeholder="Receiver Name"
          />
        </div>
        <Button onClick={onClose}>Save</Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
