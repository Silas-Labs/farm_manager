// Project: Farm Manager | Module: Layout.jsx
import React from "react";
import { Outlet } from "react-router";
import { SideBar } from "../Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const Layout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-farm-50 via-white to-earth-50">
        <SideBar />
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Mobile sidebar trigger - only shows on mobile */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-farm-100 md:hidden">
            <div className="flex items-center px-4 py-3">
              <SidebarTrigger />
            </div>
          </div>

          {/* Main content - no header taking up space */}
          <main className="flex-1 w-full overflow-x-auto">
            <div className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
