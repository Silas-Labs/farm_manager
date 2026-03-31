import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSunRain } from "lucide-react";

export function WeatherCard() {
  const weather = {
    temp: "30ºC",
    temp_approx: "Feels like 26ºC",
    location: "Kapsabet",
    day: "Saturday",
    date: "21 Mar 2026",
    condition: "Heavy Rain",
  };

  return (
    <Card className="w-full md:w-80 p-4 flex flex-col md:flex-col gap-4">
      
      {/* Left Side: Date & Location */}
      <CardHeader className="w-full flex flex-col items-start gap-1">
        <CardDescription>
          <p className="text-xs bg-green-600 rounded-lg text-white px-2 py-1 text-center">
            {weather.location}
          </p>
        </CardDescription>
        <CardTitle className="flex flex-col">
          <span className="font-bold text-black">{weather.day}</span>
          <span className="text-xs text-slate-400">{weather.date}</span>
        </CardTitle>
      </CardHeader>

      {/* Middle: Weather Icon */}
      <div className="flex items-center justify-center">
        <CloudSunRain size={48} className="text-blue-500" />
      </div>

      {/* Right Side: Temperature & Condition */}
      <CardContent className="flex flex-col items-center gap-1">
        <p className="text-2xl font-bold">{weather.temp}</p>
        <p className="text-sm font-semibold">{weather.condition}</p>
        <p className="text-xs text-slate-400">{weather.temp_approx}</p>
      </CardContent>

    </Card>
  );
}