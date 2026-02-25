import { GalleryVerticalEnd } from "lucide-react";

import SigninForm from "@/components/custom/forms/signin.form";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <img
          src="https://jdudykmsleefptjgostd.supabase.co/storage/v1/object/public/assets/cfc-logo-removebg.png"
          alt="cfc-logo"
          width={120}
          height={120}
          className="mx-auto"
        />
        <SigninForm />
      </div>
    </div>
  );
}
