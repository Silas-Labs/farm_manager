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
      setWeather(newUpdate)
    }else {
        console.log("Less than 7 days")
    }
  }

  /**
   * Formats weather data from API response for display
   * Extracts readable day, date, and weather condition
   */
  const formatWeatherData = (weatherData) => {
    if (!weatherData.data) return weatherData
    
    // Convert Unix timestamp to readable date
    const date = new Date(weatherData.data.dt * 1000)
    const day = date.toLocaleDateString('en-US', { weekday: 'long' })
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    // Extract main weather condition (e.g., 'Clouds', 'Rain')
    const condition = weatherData.data.weather?.[0]?.main || ''
    
    return {
      ...weatherData,
      day,
      date: dateStr,
      condition
    }
  }


  const formattedWeather = formatWeatherData(weather)

  return (
    <div className=" flex flex-wrap justify-items-start gap-2 p-2">
      <WeatherCard weather={formattedWeather} />
      <WeatherHighlight weather={formattedWeather}/>
      <div className="flex-1">
        <Forecast weather={formattedWeather}/>
      </div>
      <button onClick={getWeather}>Fetch</button>
    </div>
  );
};

export default Weather;
