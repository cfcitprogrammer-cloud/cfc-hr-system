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

  useEffect(() => {
    if (refCheck) {
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

      console.log(refCheck.sid);
      console.log(data);

      if (error) {
        console.error("Error fetching response:", error.message);
      } else {
        setResponseData(data[0]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Helper function to display "Not Available" if the value is null or empty
  const displayValue = (value: any) => (value ? value : "Not Available");

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

        <div>
          <Button className="w-full" variant={"secondary"}>
            Generate Report
          </Button>
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
