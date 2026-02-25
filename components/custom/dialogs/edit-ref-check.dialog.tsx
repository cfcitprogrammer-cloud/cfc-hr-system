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
import EditRefCheckForm from "../forms/edit-ref-check.form";

type EditRefCheckDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  refCheck: ReferenceCheck;
  refresh: () => void;
};

export const EditRefCheckDialog = ({
  isOpen,
  onClose,
  refCheck,
  refresh,
}: EditRefCheckDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reference Check</DialogTitle>
        </DialogHeader>
        <EditRefCheckForm
          setOpen={onClose}
          refCheck={refCheck}
          refresh={refresh}
        />
      </DialogContent>
    </Dialog>
  );
};
