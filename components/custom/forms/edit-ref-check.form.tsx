"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  issueRefCheckSchema,
  IssueRefCheckFormValues,
} from "@/lib/schemas/issue-ref-check.schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import { ReferenceCheck } from "@/lib/types/refcheck";
import { useRouter } from "next/navigation";

interface Props {
  setOpen: (open: boolean) => void;
  refCheck: ReferenceCheck;
  refresh: () => void;
}

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;

export default function EditRefCheckForm({
  setOpen,
  refCheck,
  refresh,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IssueRefCheckFormValues>({
    resolver: zodResolver(issueRefCheckSchema),
    defaultValues: {
      title: refCheck.title,
      receiverName: refCheck.receiver_name,
      receiverEmail: refCheck.receiver_email,
      employeeName: refCheck.employee_name,
      position: refCheck.position,
      company: refCheck.company,
    },
  });

  async function onSubmit(data: IssueRefCheckFormValues) {
    try {
      // 1️⃣ Insert into Supabase
      const expiresOn = new Date();
      expiresOn.setDate(expiresOn.getDate() + 7);

      const { error, data: insertedData } = await supabase
        .from("refchecks")
        .update({
          title: data.title,
          receiver_name: data.receiverName,
          receiver_email: data.receiverEmail,
          employee_name: data.employeeName,
          position: data.position,
          company: data.company,
          expires_on: expiresOn.toISOString(),
        })
        .eq("id", refCheck.id)
        .select();

      if (error) {
        toast.error(error.message);
        return;
      }

      // 2️⃣ Trigger GAS email
      try {
        const res = await axios.post(
          GAS_URL,
          JSON.stringify({
            action: "sendReferenceCheckEmail",
            title: data.title,
            receiver_name: data.receiverName,
            receiver_email: data.receiverEmail,
            employee_name: data.employeeName,
            position: data.position,
            company: data.company,
            expires_on: expiresOn.toISOString(),
            // include UUID or ID from Supabase if needed
            sid: insertedData?.[0]?.id,
          }),
        );

        console.log(res);
      } catch (emailError: any) {
        toast.error(
          emailError?.response?.data?.error || "Failed to send email",
        );
      }

      toast.success("Reference check updated and issued successfully");

      reset();
      refresh();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {/* Title + Receiver Name */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-1">
          <Label>Title</Label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maam">Maam</SelectItem>
                  <SelectItem value="sir">Sir</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="col-span-4">
          <Label>Receiver Name</Label>
          <Controller
            control={control}
            name="receiverName"
            render={({ field }) => <Input {...field} />}
          />
          {errors.receiverName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.receiverName.message}
            </p>
          )}
        </div>
      </div>

      {/* Receiver Email */}
      <div>
        <Label>Receiver Email</Label>
        <Controller
          control={control}
          name="receiverEmail"
          render={({ field }) => <Input type="email" {...field} />}
        />
        {errors.receiverEmail && (
          <p className="text-sm text-red-500 mt-1">
            {errors.receiverEmail.message}
          </p>
        )}
      </div>

      {/* Employee Name */}
      <div>
        <Label>Employee Name</Label>
        <Controller
          control={control}
          name="employeeName"
          render={({ field }) => <Input {...field} />}
        />
        {errors.employeeName && (
          <p className="text-sm text-red-500 mt-1">
            {errors.employeeName.message}
          </p>
        )}
      </div>

      {/* Position */}
      <div>
        <Label>Position</Label>
        <Controller
          control={control}
          name="position"
          render={({ field }) => <Input {...field} />}
        />
        {errors.position && (
          <p className="text-sm text-red-500 mt-1">{errors.position.message}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <Label>Your Company</Label>
        <Controller
          control={control}
          name="company"
          render={({ field }) => <Input {...field} />}
        />
        {errors.company && (
          <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Spinner /> : "Update and Resend"}
        </Button>
      </DialogFooter>
    </form>
  );
}
