"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// Helper function for statistics calculation
const calculateStats = (data: any[]) => {
  const total = data.length;
  const completed = data.filter(
    (ref) => ref.status.toLowerCase() === "completed",
  ).length;
  const pending = data.filter(
    (ref) => ref.status.toLowerCase() === "awaiting",
  ).length;

  return {
    total,
    completed,
    pending,
    completedPercentage:
      total > 0 ? ((completed / total) * 100).toFixed(2) : "0", // Ensuring it's a string
  };
};

export default function ReferenceCheckHome() {
  const [loading, setLoading] = useState(false);
  const [refChecks, setRefChecks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completedPercentage: "0",
  });

  // Fetch reference checks data
  const fetchReferenceChecks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("refchecks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        toast.error(error.message);
      } else {
        setRefChecks(data || []);
        const calculatedStats = calculateStats(data || []);
        setStats(calculatedStats);
      }
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferenceChecks();
  }, []);

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your reference checks.
        </p>
      </header>

      {/* Overview Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Total Reference Checks</h3>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Completed</h3>
            <p className="text-xl font-bold">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Pending</h3>
            <p className="text-xl font-bold">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Completed Percentage</h3>
            <p className="text-xl font-bold">{stats.completedPercentage}%</p>
          </div>
        </div>
      </section>

      {/* Recent Reference Checks */}
      <section>
        <div className="mb-6">
          <h1 className="text-lg font-semibold">Recent Reference Checks</h1>
        </div>

        <Table>
          <TableCaption>A list of recent reference checks</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Receiver Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires On</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <TableCell key={i}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : refChecks.slice(0, 5).map((ref) => (
                  <TableRow key={ref.sid}>
                    <TableCell>{ref.receiver_name}</TableCell>
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
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
