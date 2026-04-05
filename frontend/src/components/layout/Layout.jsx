import React from "react";
import {BrowserRouter, Outlet} from 'react-router'
import { SideBar } from "../Sidebar";
import Header from "../Header";
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import Weather from '../../pages/Weather';
export const Layout = () => {
  return (
    
    <SidebarProvider>
    <div className="flex w-screen ">
<SidebarTrigger/>
      <SideBar />
      <div className="flex-1 w-full">
        <Header />
       <Outlet/>
      </div>
    </div>
    </SidebarProvider>
  );
};
