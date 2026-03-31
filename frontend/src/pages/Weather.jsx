import React from "react";
import { WeatherCard } from "../components/WeatherCard";
import { Forecast } from "../components/Forecast";
import {WeatherHighlight} from "../components/WeatherHighlight"

const Weather = () => {
  return (
    <div className=" flex flex-wrap justify-items-start gap-2 p-2">
      <WeatherCard />
      <WeatherHighlight />
      <div className="flex-1">
        <Forecast />
      </div>
    </div>
  );
};

export default Weather;
