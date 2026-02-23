"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import { ReferenceCheck } from "@/lib/types/refcheck";
import { useParams } from "next/navigation";

interface CandidateFormValues {
  candidateName: string;
  currentRole: string;
  organization: string;
  sssId?: string;
  hrResponsibilities: string[];
  candidateRole: string;
  startDate: string;
  endDate: string;
  attendance: string;
  promotion: boolean;
  salaryDisclosed: boolean;
  salaryAmount?: string;
  disciplinaryAction: boolean;
  disciplinaryDetails?: string;
  rehire: boolean;
  rehireReason?: string;
  notes?: string;
}

const HR_RESPONSIBILITIES = [
  "Recruitment and Staffing",
  "Employee Onboarding",
  "Training and Development",
  "Payroll and Benefits",
];

export default function CandidateForm({
  refCheck,
}: {
  refCheck: ReferenceCheck | null;
}) {
  const [step, setStep] = useState(0);

  const form = useForm<CandidateFormValues>({
    defaultValues: {
      candidateName: refCheck?.employee_name,
      currentRole: "",
      organization: "",
      sssId: "",
      hrResponsibilities: [],
      candidateRole: "",
      startDate: "",
      endDate: "",
      attendance: "",
      promotion: false,
      salaryDisclosed: false,
      salaryAmount: "",
      disciplinaryAction: false,
      disciplinaryDetails: "",
      rehire: false,
      rehireReason: "",
      notes: "",
    },
  });

  const { control, watch, handleSubmit, getValues } = form;

  const salaryDisclosed = watch("salaryDisclosed");
  const disciplinaryAction = watch("disciplinaryAction");
  const rehire = watch("rehire");

  const onSubmit = async (data: CandidateFormValues) => {
    try {
      const { error } = await supabase.from("candidate_ref_checks").insert([
        {
          candidate_name: data.candidateName,
          current_role: data.currentRole,
          organization: data.organization,
          sss_id: data.sssId || null,
          hr_responsibilities: data.hrResponsibilities,
          candidate_role: data.candidateRole,
          start_date: data.startDate,
          end_date: data.endDate,
          attendance: data.attendance,
          promotion: data.promotion,
          salary_disclosed: data.salaryDisclosed,
          salary_amount: data.salaryAmount || null,
          disciplinary_action: data.disciplinaryAction,
          disciplinary_details: data.disciplinaryDetails || null,
          rehire: data.rehire,
          rehire_reason: data.rehireReason || null,
          notes: data.notes || null,
          refchecks_sid: refCheck?.sid,
        },
      ]);

      if (error) throw error;

      alert("Reference check submitted successfully!");

      await axios.post(
        process.env.NEXT_PUBLIC_GAS_URL!,
        JSON.stringify({
          action: "generatePdf",
          candidate_name: data.candidateName,
          current_role: data.currentRole,
          organization: data.organization,
          sss_id: data.sssId || null,
          hr_responsibilities: data.hrResponsibilities,
          candidate_role: data.candidateRole,
          start_date: data.startDate,
          end_date: data.endDate,
          attendance: data.attendance,
          promotion: data.promotion,
          salary_disclosed: data.salaryDisclosed,
          salary_amount: data.salaryAmount || null,
          disciplinary_action: data.disciplinaryAction,
          disciplinary_details: data.disciplinaryDetails || null,
          rehire: data.rehire,
          rehire_reason: data.rehireReason || null,
          notes: data.notes || null,
          refchecks_sid: refCheck?.sid || null,
          created_at: new Date().toDateString(),
          receiver_name: refCheck?.receiver_name,
          receiver_email: refCheck?.receiver_email,
        }),
      );

      form.reset();
      setStep(0);
    } catch (err: any) {
      alert("Error submitting form: " + err.message);
    }
  };

  const steps = [
    // 1: Candidate Name
    <Controller
      key="candidateName"
      name="candidateName"
      control={control}
      render={({ field }) => (
        <div>
          <Label>What is the name of the candidate?</Label>
          <Input {...field} />
        </div>
      )}
    />,

    // 2: Current Role
    <Controller
      key="currentRole"
      name="currentRole"
      control={control}
      render={({ field }) => (
        <div>
          <Label>What is your current role or job title?</Label>
          <Input {...field} />
        </div>
      )}
    />,

    // 3: Organization
    <Controller
      key="organization"
      name="organization"
      control={control}
      render={({ field }) => (
        <div>
          <Label>
            What is the official/legal name of your organization or employer?
          </Label>
          <Input {...field} />
        </div>
      )}
    />,

    // 4: SSS Employer ID
    <Controller
      key="sssId"
      name="sssId"
      control={control}
      render={({ field }) => (
        <div>
          <Label>SSS Employer ID of the Organization (Optional)</Label>
          <Input {...field} />
        </div>
      )}
    />,

    // 5: HR Responsibilities
    <Controller
      key="hrResponsibilities"
      name="hrResponsibilities"
      control={control}
      render={({ field }) => (
        <div>
          <Label>
            Please select your responsibilities in the HR organization (Check
            all that apply)
          </Label>
          {HR_RESPONSIBILITIES.map((resp) => (
            <div key={resp} className="flex items-center space-x-2 mt-2">
              <Checkbox
                checked={field.value.includes(resp)}
                onCheckedChange={(checked) =>
                  checked
                    ? field.onChange([...field.value, resp])
                    : field.onChange(
                        field.value.filter((v: string) => v !== resp),
                      )
                }
              />
              <span>{resp}</span>
            </div>
          ))}
        </div>
      )}
    />,

    // 6: Candidate Role
    <Controller
      key="candidateRole"
      name="candidateRole"
      control={control}
      render={({ field }) => (
        <div>
          <Label>What was the candidate's role/job title at the time?</Label>
          <Input {...field} />
        </div>
      )}
    />,

    // 7: Start Date
    <Controller
      key="startDate"
      name="startDate"
      control={control}
      render={({ field }) => (
        <div>
          <Label>When did the candidate start working?</Label>
          <Input type="date" {...field} />
        </div>
      )}
    />,

    // 8: End Date
    <Controller
      key="endDate"
      name="endDate"
      control={control}
      render={({ field }) => (
        <div>
          <Label>When did the candidate leave or plan to leave?</Label>
          <Input type="date" {...field} />
        </div>
      )}
    />,

    // 9: Attendance
    <Controller
      key="attendance"
      name="attendance"
      control={control}
      render={({ field }) => (
        <div>
          <Label>Attendance record / Issues?</Label>
          <Textarea {...field} />
        </div>
      )}
    />,

    // 10: Promotion
    <Controller
      key="promotion"
      name="promotion"
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant={field.value ? "default" : "outline"}
            onClick={() => field.onChange(true)}
          >
            Yes
          </Button>
          <Button
            variant={!field.value ? "default" : "outline"}
            onClick={() => field.onChange(false)}
          >
            No
          </Button>
          <span>Did the candidate receive any promotion?</span>
        </div>
      )}
    />,

    // 11: Salary Disclosed
    <Controller
      key="salaryDisclosed"
      name="salaryDisclosed"
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant={field.value ? "default" : "outline"}
            onClick={() => field.onChange(true)}
          >
            Yes
          </Button>
          <Button
            variant={!field.value ? "default" : "outline"}
            onClick={() => field.onChange(false)}
          >
            No
          </Button>
          <span>Can you disclose the candidate's salary?</span>
        </div>
      )}
    />,

    // 12: Salary Amount
    salaryDisclosed && (
      <Controller
        key="salaryAmount"
        name="salaryAmount"
        control={control}
        render={({ field }) => (
          <div>
            <Label>If yes, please disclose the salary details</Label>
            <Input {...field} />
          </div>
        )}
      />
    ),

    // 13: Disciplinary Action
    <Controller
      key="disciplinaryAction"
      name="disciplinaryAction"
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant={field.value ? "default" : "outline"}
            onClick={() => field.onChange(true)}
          >
            Yes
          </Button>
          <Button
            variant={!field.value ? "default" : "outline"}
            onClick={() => field.onChange(false)}
          >
            No
          </Button>
          <span>Was the candidate subject to disciplinary action?</span>
        </div>
      )}
    />,

    // 14: Disciplinary Details
    disciplinaryAction && (
      <Controller
        key="disciplinaryDetails"
        name="disciplinaryDetails"
        control={control}
        render={({ field }) => (
          <div>
            <Label>If yes, can you disclose what these were?</Label>
            <Textarea {...field} />
          </div>
        )}
      />
    ),

    // 15: Rehire
    <Controller
      key="rehire"
      name="rehire"
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant={field.value ? "default" : "outline"}
            onClick={() => field.onChange(true)}
          >
            Yes
          </Button>
          <Button
            variant={!field.value ? "default" : "outline"}
            onClick={() => field.onChange(false)}
          >
            No
          </Button>
          <span>Would your organization rehire this person again?</span>
        </div>
      )}
    />,

    // 16: Rehire Reason
    !rehire && (
      <Controller
        key="rehireReason"
        name="rehireReason"
        control={control}
        render={({ field }) => (
          <div>
            <Label>
              If no, why would your organization not rehire this person?
            </Label>
            <Textarea {...field} />
          </div>
        )}
      />
    ),

    // 17: Notes
    <Controller
      key="notes"
      name="notes"
      control={control}
      render={({ field }) => (
        <div>
          <Label>
            Apart from what we have asked, is there anything else you'd like to
            share?
          </Label>
          <Textarea {...field} />
        </div>
      )}
    />,

    // 18: Summary
    <div key="summary" className="space-y-4">
      <h3 className="text-lg font-semibold">Review Your Responses</h3>
      <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
        <div>
          <strong>Candidate Name:</strong> {getValues("candidateName") || "-"}
        </div>
        <div>
          <strong>Current Role / Job Title:</strong>{" "}
          {getValues("currentRole") || "-"}
        </div>
        <div>
          <strong>Organization / Employer:</strong>{" "}
          {getValues("organization") || "-"}
        </div>
        <div>
          <strong>SSS Employer ID:</strong> {getValues("sssId") || "-"}
        </div>
        <div>
          <strong>HR Responsibilities:</strong>{" "}
          {getValues("hrResponsibilities")?.length
            ? getValues("hrResponsibilities").join(", ")
            : "-"}
        </div>
        <div>
          <strong>Candidate Role at the time:</strong>{" "}
          {getValues("candidateRole") || "-"}
        </div>
        <div>
          <strong>Start Date:</strong> {getValues("startDate") || "-"}
        </div>
        <div>
          <strong>End Date / Planned Leaving:</strong>{" "}
          {getValues("endDate") || "-"}
        </div>
        <div>
          <strong>Attendance / Issues:</strong> {getValues("attendance") || "-"}
        </div>
        <div>
          <strong>Promotion Received:</strong>{" "}
          {getValues("promotion") ? "Yes" : "No"}
        </div>
        <div>
          <strong>Salary Disclosed:</strong>{" "}
          {getValues("salaryDisclosed") ? "Yes" : "No"}
        </div>
        {getValues("salaryDisclosed") && (
          <div>
            <strong>Salary Details:</strong> {getValues("salaryAmount") || "-"}
          </div>
        )}
        <div>
          <strong>Disciplinary Action:</strong>{" "}
          {getValues("disciplinaryAction") ? "Yes" : "No"}
        </div>
        {getValues("disciplinaryAction") && (
          <div>
            <strong>Disciplinary Details:</strong>{" "}
            {getValues("disciplinaryDetails") || "-"}
          </div>
        )}
        <div>
          <strong>Rehire:</strong> {getValues("rehire") ? "Yes" : "No"}
        </div>
        {!getValues("rehire") && (
          <div>
            <strong>Reason not rehired:</strong>{" "}
            {getValues("rehireReason") || "-"}
          </div>
        )}
        <div>
          <strong>Additional Notes:</strong> {getValues("notes") || "-"}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        If everything looks correct, click Submit to finalize.
      </p>
    </div>,
  ].filter(Boolean);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white rounded-lg shadow-md w-full max-w-2xl"
    >
      {steps[step]}

      <div className="flex justify-between mt-6">
        <Button
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          variant="outline"
          type="button"
        >
          Back
        </Button>

        {step === steps.length - 1 ? (
          <Button type="submit">Submit</Button>
        ) : (
          <Button
            type="button"
            onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
          >
            Next
          </Button>
        )}
      </div>

      <div className="text-center text-sm text-gray-500 mt-2">
        Step {step + 1} of {steps.length}
      </div>
    </form>
  );
}
