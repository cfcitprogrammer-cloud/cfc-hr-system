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
import { Ellipsis, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";

// Dialog Components
import { ViewResponseDialog } from "@/components/custom/dialogs/view-response.dialog";
import { EditRefCheckDialog } from "@/components/custom/dialogs/edit-ref-check.dialog";
import { DeleteRefCheckDialog } from "@/components/custom/dialogs/delete-ref-check.dialog";

type RawUserMetaData = {
  sub: string;
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  name: string;
};

type RawAppMetaData = {
  provider: string;
  providers: string[];
  approved: boolean;
};

type ReferenceCheckWithUser = ReferenceCheck & {
  raw_user_meta_data: RawUserMetaData;
  raw_app_meta_data: RawAppMetaData;
};

export default function ReferenceCheckPage() {
  const [loading, setLoading] = useState(false);
  const [refChecks, setRefChecks] = useState<ReferenceCheckWithUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRefCheck, setSelectedRefCheck] =
    useState<ReferenceCheck | null>(null);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { page } = useParams<{ page: string }>();
  const router = useRouter();

  const pageSize = 60;

  async function fetchReferenceChecks(page: number, query: string) {
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let queryBuilder = supabase
        .from("refchecks_with_user")
        .select("*", { count: "exact" }) // to get total rows
        .order("created_at", { ascending: false })
        .range(from, to);

      if (query) {
        queryBuilder = queryBuilder
          .ilike("receiver_name", `%${query}%`)
          .or(`employee_name.ilike.%${query}%,position.ilike.%${query}%`);
      }

      const { data, error, count } = await queryBuilder;

      if (error) {
        toast.error(error.message);
      }

      if (data) {
        setRefChecks(data);
      }

      if (count !== null) {
        setTotalCount(count);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReferenceChecks(Number(page), searchQuery);
  }, [page, searchQuery]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (page: number) => {
    router.push(`/d/reference-check/${page}`);
  };

  const openViewDialog = (refCheck: ReferenceCheck) => {
    setSelectedRefCheck(refCheck);
    setViewDialogOpen(true);
  };

  const openEditDialog = (refCheck: ReferenceCheck) => {
    setSelectedRefCheck(refCheck);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (refCheck: ReferenceCheck) => {
    setSelectedRefCheck(refCheck);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRefCheck) {
      try {
        // Call the Supabase API to delete the reference check by its sid
        const { error } = await supabase
          .from("refchecks")
          .delete()
          .eq("sid", selectedRefCheck.sid);

        if (error) {
          // If there's an error, show a toast notification
          toast.error("Failed to delete the reference check.");
        } else {
          // If the deletion is successful, show a success toast
          toast.success("Reference check deleted successfully.");

          // Remove the deleted reference check from the state
          setRefChecks((prevRefChecks) =>
            prevRefChecks.filter((ref) => ref.sid !== selectedRefCheck.sid),
          );
        }
      } catch (error: any) {
        toast.error("An unexpected error occurred while deleting.");
      } finally {
        // Close the delete dialog after the action
        setDeleteDialogOpen(false);
      }
    }
  };

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
            <Input
              type="search"
              placeholder="Search Employee Name or Receiver Name"
              className="w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              onClick={() => fetchReferenceChecks(Number(page), searchQuery)}
            >
              <Search />
            </Button>
          </Field>

          <RefCheckDialog
            refresh={() => fetchReferenceChecks(Number(page), searchQuery)}
          />
        </div>

        <Table>
          <TableCaption>A list of your recent reference checks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Receiver Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires On</TableHead>
              <TableHead>Actions</TableHead>
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
                    <TableCell>{ref.receiver_name}</TableCell>
                    <TableCell>{ref.receiver_email}</TableCell>
                    <TableCell>{ref.employee_name}</TableCell>
                    <TableCell>{ref.position}</TableCell>
                    <TableCell>
                      {ref.raw_user_meta_data?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`inline-flex items-center space-x-2 px-3 py-1 ${
                          ref.status.toLowerCase() === "completed"
                            ? "bg-green-100 text-green-800"
                            : ref.status.toLowerCase() === "awaiting"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span className="relative flex h-2 w-2">
                          <span
                            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                              ref.status.toLowerCase() === "completed"
                                ? "bg-green-500"
                                : ref.status.toLowerCase() === "awaiting"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${
                              ref.status.toLowerCase() === "completed"
                                ? "bg-green-500"
                                : ref.status.toLowerCase() === "awaiting"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                        </span>
                        {ref.status.charAt(0).toUpperCase() +
                          ref.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ref.expires_on
                        ? new Date(ref.expires_on).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size={"icon-xs"}>
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Main Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openViewDialog(ref)}
                            >
                              View Response
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(ref)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(ref)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 space-x-2">
          <span className="text-sm">Displaying page {page}</span>
          <div>
            <Button
              disabled={Number(page) <= 1}
              onClick={() => goToPage(Number(page) - 1)}
              size={"sm"}
            >
              Previous
            </Button>

            <Button
              disabled={Number(page) >= totalPages}
              onClick={() => goToPage(Number(page) + 1)}
              size={"sm"}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Dialogs */}
        <ViewResponseDialog
          isOpen={isViewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          refCheck={selectedRefCheck}
        />
        <EditRefCheckDialog
          isOpen={isEditDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          refCheck={selectedRefCheck!}
          refresh={() => fetchReferenceChecks(Number(page), searchQuery)}
        />
        <DeleteRefCheckDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </section>
    </main>
  );
}
