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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LayoutDashboard />
                  <span>
                    <a href="#">Dashboard</a>
                  </span>
                </SidebarMenuButton>
                <SidebarMenuButton>
                  <Sprout />
                  <span>
                    <a href="#">Crop Management</a>
                  </span>
                </SidebarMenuButton>
                <SidebarMenuButton>
                  <CloudSun />
                  <span>
                    <a href="#">Weather</a>
                  </span>
                </SidebarMenuButton>
                <SidebarMenuButton>
                  <Tractor />
                  <span>
                    <a href="#">Equipment</a>
                  </span>
                </SidebarMenuButton>
                <SidebarMenuButton>
                  <BicepsFlexed />
                  <span>
                    <a href="#">Labor Management</a>
                  </span>
                </SidebarMenuButton>
                <SidebarMenuButton>
                  <ChartNoAxesCombined />
                  <span>
                    <a href="#">Reports and Analytics</a>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
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
