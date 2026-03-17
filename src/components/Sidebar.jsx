import React from "react";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

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

export const SideBar = () => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarTrigger/>
          <SidebarHeader>My Sidebar</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home/>
                    <span><a href="#">Home</a></span>
                  </SidebarMenuButton>
                  <SidebarMenuButton>
                    <Inbox/>
                    <span><a href="#">Crops</a></span>
                  </SidebarMenuButton>
                  <SidebarMenuButton>
                    <Search/>
                    <span><a href="#">Animals</a></span>
                  </SidebarMenuButton>
                  <SidebarMenuButton>
                    <Settings/>
                    <span><a href="#">Accounts</a></span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};
