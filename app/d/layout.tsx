"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function Page({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run when status is not loading
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/a/signin");
    } else if (!user?.rawAppMeta?.approved) {
      toast.error("Account needs approval. Please contact administrator.");
      router.replace("/a/signin");
    }
  }, [status, user, router]);

  // Loading state
  if (status === "loading") return <div>Loading...</div>;

  // Render nothing while redirecting
  if (status === "unauthenticated") return null;

  if (!user?.rawAppMeta?.approved) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
