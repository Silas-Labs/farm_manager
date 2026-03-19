import React from "react";

import {
  BicepsFlexed,
  ChartNoAxesCombined,
  CloudSun,
  LayoutDashboard,
  Sprout,
  Tractor,
  User2,
  ChevronUp,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export const SideBar = () => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarTrigger />
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-5">
              <SidebarMenuItem className="flex border p-1 gap-2">
                <LayoutDashboard size={30} />
                <span>
                  <a href="#">Dashboard</a>
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex border p-1 gap-2">
                <Sprout size={30} />
                <span>
                  <a href="#">Crop Management</a>
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex border p-1 gap-2">
                <CloudSun size={30} />
                <span>
                  <a href="#">Weather</a>
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex border p-1 gap-2">
                <Tractor size={30} />
                <span>
                  <a href="#">Equipment</a>
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex border p-1 gap-2">
                <BicepsFlexed size={30} />
                <span>
                  <a href="#">Labor Management</a>
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex border p-1 gap-2">
                <ChartNoAxesCombined size={30} />
                <span>
                  <a href="#">Reports and Analytics</a>
                </span>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};
