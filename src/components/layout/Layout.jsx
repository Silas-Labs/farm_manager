import React from "react";
import { SideBar } from "../Sidebar";
import Header from "../Header";
import { WeatheCard } from "../WeatherCard";
import { WeatherHighlight } from "../WeatherHighlight";
import {SidebarProvider} from '@/components/ui/sidebar'
import { Forecast } from "../Forecast";
export const Layout = () => {
  return (
    <SidebarProvider>
    <div className="flex w-screen max-w-5xl">
      <SideBar className="flex-1"/>
      <div className="flex-1">
        <Header />
        <div className="border border-blue-950 w-full flex flex-wrap justify-items-start gap-2 p-2">
          <WeatheCard />
          <WeatherHighlight/>
          <div className="flex-1"></div>
          <Forecast/>
        </div>
      </div>
    </div>
    </SidebarProvider>
  );
};
