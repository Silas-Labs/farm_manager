import React from "react";
import { SideBar } from "../Sidebar";
import Header from "../Header";
import { WeatheCard } from "../WeatherCard";

export const Layout = () => {
  return (
    <div className="flex w-screen">
      <SideBar />
      <div>
        <Header />
        <div className="border border-blue-950 w-full h-full flex justify-items-start p-4">
          <WeatheCard />
        </div>
      </div>
    </div>
  );
};
