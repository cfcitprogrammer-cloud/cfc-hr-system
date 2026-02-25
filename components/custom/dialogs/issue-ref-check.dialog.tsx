"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import IssueRefCheckForm from "../forms/issue-ref-check.form";

export default function RefCheckDialog({ refresh }: { refresh: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Issue Reference Check
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue a Reference Check</DialogTitle>
          <DialogDescription>
            Complete the form to issue a reference check securely.
          </DialogDescription>
        </DialogHeader>

        <IssueRefCheckForm setOpen={setOpen} refresh={refresh} />
      </DialogContent>
    </Dialog>
  );
}
