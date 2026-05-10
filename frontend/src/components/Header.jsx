// Header.jsx - Make sure text has proper color
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import {
  Leaf,
  Sprout,
  CloudSun,
  Tractor,
  Users,
  BarChart3,
} from "lucide-react";

const Header = () => {
  const [page, setPage] = useState("");
  const [icon, setIcon] = useState(null);
  const location = useLocation();

  useEffect(() => {
    changeHeader();
  }, [location]);

  const changeHeader = () => {
    switch (location.pathname) {
      case "/dashboard":
        setPage("Dashboard");
        setIcon(<BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-farm-600" />);
        break;
      case "/crops":
        setPage("Crop Management");
        setIcon(<Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-farm-600" />);
        break;
      case "/weather":
        setPage("Weather Station");
        setIcon(<CloudSun className="w-5 h-5 sm:w-6 sm:h-6 text-farm-600" />);
        break;
      case "/equipment":
        setPage("Equipment & Machinery");
        setIcon(<Tractor className="w-5 h-5 sm:w-6 sm:h-6 text-farm-600" />);
        break;
      case "/labor":
        setPage("Labor Management");
        setIcon(<Users className="w-5 h-5 sm:w-6 sm:h-6 text-farm-600" />);
        break;
      case "/reports":
        setPage("Reports & Analytics");
        setIcon(<BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-farm-600" />);
        break;
      default:
        setPage("Farm Manager");
        setIcon(<Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-farm-600" />);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="p-1.5 sm:p-2 bg-farm-50 rounded-lg sm:rounded-xl">
        {icon}
      </div>
      <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-farm-800">
        {page}
      </h1>
    </div>
  );
};

export default Header;
