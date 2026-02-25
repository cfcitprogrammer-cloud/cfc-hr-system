import CandidateForm from "@/components/custom/forms/candidate.form";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function CandidateRefCheckPage({
  params,
}: {
  params: { sid: string };
}) {
  const { sid } = await params;

  const { data, error } = await supabase
    .from("refchecks_with_user")
    .select("*")
    .eq("sid", sid)
    .single();

  console.log("HERE");
  console.log(error);

  if (error || !data) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <CandidateForm refCheck={data} />
    </div>
  );
}
