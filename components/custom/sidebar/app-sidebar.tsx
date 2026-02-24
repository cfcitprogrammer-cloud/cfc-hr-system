"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users2,
} from "lucide-react";

import { NavMain } from "@/components/custom/sidebar/nav-main";
import { NavProjects } from "@/components/custom/sidebar/nav-projects";
import { NavUser } from "@/components/custom/sidebar/nav-user";
import { TeamSwitcher } from "@/components/custom/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Referece Check",
      url: "#",
      icon: Users2,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/d/reference-check/home",
        },
        {
          title: "Reference Check",
          url: "/d/reference-check/1",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  console.log(user);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.rawUserMeta?.name!,
            email: user?.email!,
            avatar: user?.email?.charAt(0)!.toUpperCase()!,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
