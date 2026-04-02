import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

const Header = () => {
  const [page, setPage] = useState("")
  const location = useLocation()

  useEffect(()=>{
    changeHeader()
  },[location])

  const changeHeader=()=>{
    switch (location.pathname){
      case "/crops":
        setPage("Crops")
        break
      case "/weather":
        setPage("Weather")
        break;
      case "/equipment":
        setPage("Equipment")
        break;
      case "/labor":
        setPage("Labor")
        break;
      case "/reports":
        setPage("Reports")
        break
      default:
        setPage("Farm Manager")
        break
    }
  }
  
  return <div className="w-full min-h-12 border flex items-center p-2 text-4xl font-[roboto] font-medium text-green-800/90">{page}</div>;
};

export default Header;
