"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReferenceCheck } from "@/lib/types/refcheck";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type ViewResponseDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  refCheck: ReferenceCheck | null;
};

export const ViewResponseDialog = ({
  isOpen,
  onClose,
  refCheck,
}: ViewResponseDialogProps) => {
  const [responseData, setResponseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (refCheck && isOpen) {
      findResponse();
    }
  }, [refCheck, isOpen]);

  async function findResponse() {
    if (!refCheck?.sid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("candidate_ref_checks")
        .select("*")
        .eq("refchecks_sid", refCheck.sid)
        .limit(1);

      if (error) {
        toast.error("Error fetching response");
      } else {
        setResponseData(data[0]);
      }
    } catch (error: any) {
      toast.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const displayValue = (value: any) => (value ? value : "Not Available");

  async function generateReport() {
    if (!responseData) return;
    setGenerating(true);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_GAS_URL!,
        JSON.stringify({
          action: "generatePdf",
          candidate_name: responseData.candidate_name || "",
          current_role: responseData.current_role || "",
          organization: responseData.organization || "",
          sss_id: responseData.sss_employer_id || "",
          hr_responsibilities: responseData.hr_responsibilities || "",
          candidate_role: responseData.candidate_role || "",
          start_date: responseData.start_date || "",
          end_date: responseData.end_date || "",
          attendance: responseData.attendance_record || "",
          promotion: responseData.promotion_details || "",
          salary_disclosed: responseData.salary_disclosed || "",
          salary_amount: responseData.salary_details || "",
          disciplinary_action: responseData.disciplinary_actions || "",
          disciplinary_details: responseData.disciplinary_details || "",
          rehire: responseData.rehire_status || "",
          rehire_reason: responseData.rehire_reason || "",
          notes: responseData.additional_notes || "",
          refchecks_sid: refCheck?.sid || "",
          created_at: new Date().toISOString(),
          receiver_name: refCheck?.receiver_name || "",
          receiver_email: refCheck?.receiver_email || "",
          company: refCheck?.company || "",
          email: user?.email || "",
        }),
      );
      // Optionally: show a toast or success message here

      toast.success("Report generated successfully. Check your email.");
    } catch (error) {
      toast.error("Error generating report");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Report Overview</DialogTitle>
          <DialogDescription>
            Report overview for {refCheck?.employee_name}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p>Loading response...</p>
          ) : responseData ? (
            <div>
              <div className="mt-2">
                <strong>Candidate Name:</strong>
                <p>{displayValue(responseData.candidate_name)}</p>
              </div>
              <div className="mt-2">
                <strong>Current Role:</strong>
                <p>{displayValue(responseData.current_role)}</p>
              </div>
              <div className="mt-2">
                <strong>Employer Name:</strong>
                <p>{displayValue(responseData.employer_name)}</p>
              </div>
              <div className="mt-2">
                <strong>SSS Employer ID:</strong>
                <p>{displayValue(responseData.sss_employer_id)}</p>
              </div>
              <div className="mt-2">
                <strong>HR Responsibilities:</strong>
                <p>{displayValue(responseData.hr_responsibilities)}</p>
              </div>
              <div className="mt-2">
                <strong>Candidate's Role at the Time:</strong>
                <p>{displayValue(responseData.candidate_role)}</p>
              </div>
              <div className="mt-2">
                <strong>Start Date:</strong>
                <p>{displayValue(responseData.start_date)}</p>
              </div>
              <div className="mt-2">
                <strong>End Date:</strong>
                <p>{displayValue(responseData.end_date)}</p>
              </div>
              <div className="mt-2">
                <strong>Attendance Record:</strong>
                <p>{displayValue(responseData.attendance_record)}</p>
              </div>
              <div className="mt-2">
                <strong>Promotion Details:</strong>
                <p>{displayValue(responseData.promotion_details)}</p>
              </div>
              <div className="mt-2">
                <strong>Salary Details:</strong>
                <p>{displayValue(responseData.salary_details)}</p>
              </div>
              <div className="mt-2">
                <strong>Disciplinary Actions:</strong>
                <p>{displayValue(responseData.disciplinary_actions)}</p>
              </div>
              <div className="mt-2">
                <strong>Rehire Status:</strong>
                <p>{displayValue(responseData.rehire_status)}</p>
              </div>
              <div className="mt-2">
                <strong>Additional Notes:</strong>
                <p>{displayValue(responseData.additional_notes)}</p>
              </div>
            </div>
          ) : (
            <p>No response data available.</p>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <Button
            className="w-full"
            variant="secondary"
            onClick={generateReport}
            disabled={generating || !responseData}
          >
            {generating ? "Generating Report..." : "Generate Report"}
          </Button>
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
