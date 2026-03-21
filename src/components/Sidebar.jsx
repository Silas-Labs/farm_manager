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
  useSidebar
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export const SideBar = () => {
  const {open} = useSidebar()
  return (
    
      <Sidebar collapsible="icon">
        <SidebarTrigger />
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-4 ">
              <SidebarMenuItem className="flex p-1 gap-2 rounded-full hover:bg-green-600/20">
                <LayoutDashboard size={30} />
                <span className={open ? "" : "hidden"}>
                  <a href="#">Dashboard</a>
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex p-1 gap-2 rounded-full hover:bg-green-600/20">
                <Sprout size={30} />
                <span  className={open ? "" : "hidden"}>
                  <a href="#">Crop Management</a>
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex p-1 gap-2 rounded-full hover:bg-green-600/20">
                <CloudSun size={30} />
                <span  className={open ? "" : "hidden"}>
                  <a href="#">Weather</a>
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex p-1 gap-2 rounded-full hover:bg-green-600/20">
                <Tractor size={30} />
                <span  className={open ? "" : "hidden"}>
                  <a href="#">Equipment</a>
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="flex p-1 gap-2 rounded-full hover:bg-green-600/20">
                <BicepsFlexed size={30} />
                <span  className={open ? "" : "hidden"}>
                  <a href="#">Labor Management</a>
                </span>
                
              </SidebarMenuItem>
              <SidebarMenuItem className="flex p-1 gap-2 rounded-full hover:bg-green-600/20">
                <ChartNoAxesCombined size={30} />
                <span  className={open ? "font-normal" : "hidden"}>
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
  );
};
