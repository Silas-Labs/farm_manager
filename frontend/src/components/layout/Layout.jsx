import React from "react";
import {BrowserRouter, Outlet} from 'react-router'
import { SideBar } from "../Sidebar";
import Header from "../Header";
import {SidebarProvider} from '@/components/ui/sidebar'
import Weather from '../../pages/Weather';
export const Layout = () => {
  return (
    
    <SidebarProvider>
    <div className="flex w-screen ">
      <SideBar />
      <div className="flex-1 w-full">
        <Header />
       <Outlet/>
      </div>
    </div>
    </SidebarProvider>
  );
};
