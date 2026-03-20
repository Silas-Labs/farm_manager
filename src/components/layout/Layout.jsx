import React from "react";
import { SideBar } from "../Sidebar";
import Header from "../Header";
import { WeatheCard } from "../WeatherCard";
import { WeatherHighlight } from "../WeatherHighlight";

export const Layout = () => {
  return (
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
  );
};
