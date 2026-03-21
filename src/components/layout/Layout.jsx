import React from "react";
import { SideBar } from "../Sidebar";
import Header from "../Header";
import { WeatheCard } from "../WeatherCard";
import { WeatherHighlight } from "../WeatherHighlight";
import {SidebarProvider} from '@/components/ui/sidebar'
export const Layout = () => {
  return (
    <SidebarProvider>
    <div className="flex w-screen">
      <SideBar />
      <div>
        <Header />
        <div className="border border-blue-950 w-full flex justify-items-start p-4">
          <WeatheCard />
          <WeatherHighlight/>
        </div>
      </div>
    </div>
    </SidebarProvider>
  );
};
