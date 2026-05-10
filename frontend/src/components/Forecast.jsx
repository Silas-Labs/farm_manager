// Project: Farm Manager | Module: Forecast.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudLightning, CloudRain, CloudRainWind, CloudSun, CloudSunRain, Cloudy } from "lucide-react";

export function Forecast() {
  // Example 6-day forecast data
  const forecastData = [
    { day: "Mon", icon: <CloudLightning />, temp: "24ºC" },
    { day: "Tue", icon: <CloudSun />, temp: "26ºC" },
    { day: "Wed", icon: <CloudRain />, temp: "22ºC" },
    { day: "Thu", icon: <CloudRainWind />, temp: "23ºC" },
    { day: "Fri", icon: <Cloudy />, temp: "25ºC" },
    { day: "Sat", icon: <CloudRain />, temp: "24ºC" },
  ];

  return (
    <Card className="w-full p-4">
      <CardTitle className="text-lg font-bold mb-2">Forecast</CardTitle>

      {/* Scrollable row for small screens */}
      <div className="flex gap-3 overflow-x-auto">
        {forecastData.map((day, index) => (
          <Card key={index} className="flex-shrink-0 w-20 text-center p-2">
            <CardHeader className="font-bold">{day.day}</CardHeader>
            <CardContent className="flex justify-center my-2 text-blue-500">
              {day.icon}
            </CardContent>
            <CardDescription className="font-bold">{day.temp}</CardDescription>
          </Card>
        ))}
      </div>
    </Card>
  );
}
// EOF: Forecast.jsx
