import React from "react";
import { BrowserRouter,Link, useLocation } from "react-router";

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

  const url = useLocation()
  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger />
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-4 text-sm">
             <Link to="/" className={location.pathname == "/" ? "bg-green-900/20 cursor-default" :"rounded-full hover:bg-green-600/20"}>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center ">
              <LayoutDashboard size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
                Dashboard
              </span>
            </SidebarMenuItem>
            </Link>
             <Link to="/crops" className={location.pathname == "/crops" ? "bg-green-900/20 cursor-default" :"rounded-full hover:bg-green-600/20"}>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center ">
              <Sprout size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
               Crop Management
              </span>
            </SidebarMenuItem>
            </Link>
            <Link to="/weather" className={location.pathname == "/weather" ? "bg-green-900/20 cursor-default" :"rounded-full hover:bg-green-600/20"}>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center ">
              <CloudSun size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
                Weather
              </span>
            </SidebarMenuItem>
            </Link>
            <Link to="/equipment" className={location.pathname == "/equipment" ? "bg-green-900/20 cursor-default" :"rounded-full hover:bg-green-600/20"}>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center ">
              <Tractor size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
                Equipment
              </span>
            </SidebarMenuItem>
                </Link>
                <Link to="/labor" className={location.pathname == "/labor" ? "bg-green-900/20 cursor-default" :"rounded-full hover:bg-green-600/20"}>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center ">
              <BicepsFlexed size={24} />
              <span className={open ? " text-[12px]" : "hidden"}>
                Labor Management
              </span>
            </SidebarMenuItem>
            </Link>
            <Link to="/reports" className={location.pathname == "/reports" ? "bg-green-900/20 cursor-default" :"rounded-full hover:bg-green-600/20"}>
            <SidebarMenuItem className="flex px-2 py-1 gap-2 items-center ">
              <ChartNoAxesCombined size={24} />
              <span className={open ? "font-normal text-[12px]" : "hidden"}>
                Reports and Analytics
              </span>
            </SidebarMenuItem>
            </Link>
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
