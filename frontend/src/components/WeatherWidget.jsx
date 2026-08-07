// Project: Farm Manager | Module: WeatherWidget.jsx
// Compact, read-only weather summary embedded in the Dashboard. Uses the same
// OpenWeather data source as the (now deprioritised) standalone Weather page.

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CloudSun, Droplets, Wind, MapPin, RefreshCw } from "lucide-react";

const ICONS = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Snow: "❄️",
  Mist: "🌫️",
  Smoke: "🌫️",
  Fog: "🌫️",
};

export const WeatherWidget = () => {
  const { VITE_WEATHER_API, VITE_WEATHER_URL } = import.meta.env;
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({
    lat: -0.0917,
    lon: 34.768,
    name: "Kisumu",
  });
  const [error, setError] = useState(false);

  const load = async () => {
    if (!VITE_WEATHER_API || !VITE_WEATHER_URL) return;
    try {
      const saved = localStorage.getItem("currentLocation");
      const loc = saved ? JSON.parse(saved) : location;
      setLocation(loc);
      const tokenKey = `weather_${loc.name}`;
      const cached = localStorage.getItem(tokenKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.lastUpdate < 15 * 60 * 1000) {
          setData(parsed.data);
          return;
        }
      }
      const res = await fetch(
        `${VITE_WEATHER_URL}?lat=${loc.lat}&lon=${loc.lon}&cnt=5&appid=${VITE_WEATHER_API}&units=metric`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      localStorage.setItem(
        tokenKey,
        JSON.stringify({ lastUpdate: Date.now(), data: body }),
      );
      setData(body);
      setError(false);
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const flow = data?.list?.[0];
  if (error || !flow) {
    return (
      <Card className="py-4 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-earth-600">
            <CloudSun className="w-5 h-5 text-sky-600" />
            <span className="text-sm font-medium">Weather</span>
          </div>
          <span className="text-xs text-earth-400">
            {error ? "Unavailable offline" : "Loading…"}
          </span>
        </div>
      </Card>
    );
  }

  const main = flow.weather?.[0]?.main || "";
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{ICONS[main] || ICONS.Clouds}</span>
          <div>
            <p className="text-xl font-bold text-earth-800">
              {Math.round(flow.main.temp)}°C
            </p>
            <p className="text-xs text-earth-500 capitalize">
              {flow.weather[0]?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-earth-600 text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-sky-600" />
            {location.name}
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="w-4 h-4 text-sky-600" />
            {flow.main.humidity}%
          </span>
          <span className="flex items-center gap-1">
            <Wind className="w-4 h-4 text-sky-600" />
            {Math.round(flow.wind.speed * 3.6)} km/h
          </span>
          <button
            type="button"
            onClick={load}
            className="text-earth-400 hover:text-farm-600 transition-colors"
            aria-label="Refresh weather"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};