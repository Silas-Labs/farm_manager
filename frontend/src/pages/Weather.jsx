import {useEffect, useState} from "react";
import { WeatherCard } from "../components/WeatherCard";
import { Forecast } from "../components/Forecast";
import {WeatherHighlight} from "../components/WeatherHighlight"

const Weather = () => {
  const [weather,setWeather] = useState({})

  useEffect(()=>{
    const weatherStore = JSON.parse(localStorage.getItem("weather")) || {}
    setWeather(weatherStore)
  },[])

  const {VITE_WEATHER_API, VITE_WEATHER_URL} = import.meta.env

  const getWeather=async()=>{
    const weatherStore = JSON.parse(localStorage.getItem("weather")) || {}
    const date =  Date.now()
    const diff = (date - weatherStore["lastUpdate"])/(1000*60*60*24)

    if (Object.keys(weatherStore).length == 0 || (diff > 7)) {
      const res = await fetch(`${VITE_WEATHER_URL}?lat=-0.0917&lon=34.7680&cnt=7&appid=${VITE_WEATHER_API}&units=metric`)
      if (!res.ok){
        throw new Error(res.status)
      }
      const body = await res.json()
      const newUpdate = {
        "lastUpdate": Date.now(),
        "data": body
      }
      localStorage.setItem("weather",JSON.stringify(newUpdate))
    }else {
        console.log("Less than 7 days")
    }
  }


  return (
    <div className=" flex flex-wrap justify-items-start gap-2 p-2">
      <WeatherCard weather={weather} />
      <WeatherHighlight weather={weather}/>
      <div className="flex-1">
        <Forecast weather={weather}/>
      </div>
      <button onClick={getWeather}>Fetch</button>
    </div>
  );
};

export default Weather;
