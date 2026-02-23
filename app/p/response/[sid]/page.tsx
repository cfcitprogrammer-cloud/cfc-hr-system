"use client";

import CandidateForm from "@/components/custom/forms/candidate.form";
import { supabase } from "@/lib/supabase";
import { ReferenceCheck } from "@/lib/types/refcheck";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function CandidateRefCheckPage() {
  const { sid } = useParams();
  const [refCheck, setRefCheck] = useState<ReferenceCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function findRefCheck() {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("refchecks")
        .select("*")
        .eq("sid", sid)
        .single();

      if (error) {
        throw error;
      }

      setRefCheck(data);
    } catch (err: any) {
      console.error("Error fetching reference check:", err);
      setError(err.message || "Failed to fetch reference check");
    } finally {
      setLoading(false);
    }
  }

  // Fetch ref check on component mount
  useEffect(() => {
    if (sid) {
      findRefCheck();
    }
  }, [sid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p>Loading reference check...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <CandidateForm refCheck={refCheck} />
    </div>
  );
}
