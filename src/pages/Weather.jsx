import React from "react";
import { WeatheCard } from "../components/WeatherCard";
import { Forecast } from "../components/Forecast";
import {WeatherHighlight} from "../components/WeatherHighlight"

const Weather = () => {
  return (
    <div className="border border-blue-950 w-full flex flex-wrap justify-items-start gap-2 p-2">
      <WeatheCard />
      <WeatherHighlight />
      <div className="flex-1">
        <Forecast />
      </div>
    </div>
  );
};

export default Weather;
