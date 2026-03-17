import React from "react";
import { SideBar } from "../Sidebar";
import Header from "../Header";

export const Layout = () => {
  return (
    <div className="flex w-screen">
      <SideBar />
      <div className="flex flex-col w-full">
        <Header/>
      </div>
    </div>
  );
};
