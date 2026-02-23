"use client";

import RefCheckDialog from "@/components/custom/dialogs/issue-ref-check.dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { ReferenceCheck } from "@/lib/types/refcheck";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type ReferenceCheckWithUser = ReferenceCheck & {
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export default function ReferenceCheckPage() {
  const [loading, setLoading] = useState(false);
  const [refChecks, setRefChecks] = useState<ReferenceCheckWithUser[]>([]);

  async function fetchReferenceChecks() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("refchecks_with_user")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message);
      }

      if (data) {
        setRefChecks(data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReferenceChecks();
  }, []);

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Reference Check</h1>
        <p className="text-sm text-muted-foreground">
          All reference checks applied will be listed here.
        </p>
      </header>

      <section>
        <div className="flex justify-between items-center gap-2 mb-4">
          <Field orientation="horizontal">
            <Input type="search" placeholder="Search..." className="w-60" />
            <Button>
              <Search />
            </Button>
          </Field>

          <RefCheckDialog />
        </div>

        {/* table */}
        <Table>
          <TableCaption>A list of your recent reference checks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">UID</TableHead>
              <TableHead>Receiver Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires On</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <TableCell key={i}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : refChecks.map((ref) => (
                  <TableRow key={ref.sid}>
                    <TableCell className="font-medium">{ref.sid}</TableCell>
                    <TableCell>{ref.receiver_name}</TableCell>
                    <TableCell>{ref.receiver_email}</TableCell>
                    <TableCell>{ref.employee_name}</TableCell>
                    <TableCell>{ref.position}</TableCell>
                    <TableCell>{ref.user?.name}</TableCell> {/* joined user */}
                    <TableCell>{"na"}</TableCell>
                    <TableCell>
                      {ref.expires_on
                        ? new Date(ref.expires_on).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {/* pagination could go here */}
      </section>
    </main>
  );
}
