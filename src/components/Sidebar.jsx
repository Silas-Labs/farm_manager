import React from "react";
import { BrowserRouter,Link } from "react-router";

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
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export const SideBar = () => {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger />
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-4 text-sm">
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center rounded-full hover:bg-green-600/20">
              <LayoutDashboard size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
                <Link to="/dashboard">Dashboard</Link>
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center rounded-full hover:bg-green-600/20">
              <Sprout size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
                <Link to="/crops">Crop Management</Link>
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center rounded-full hover:bg-green-600/20">
              <CloudSun size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
                <Link to="/weather">Weather</Link>
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center rounded-full hover:bg-green-600/20">
              <Tractor size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
                <Link to="/equipment">Equipment</Link>
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center rounded-full hover:bg-green-600/20">
              <BicepsFlexed size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
                <Link to="/labor">Labor Management</Link>
              </span>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center rounded-full hover:bg-green-600/20">
              <ChartNoAxesCombined size={24} />
              <span className={open ? "font-normal text-[12px]" : "hidden"}>
                <Link to="/reports">Reports and Analytics</Link>
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
