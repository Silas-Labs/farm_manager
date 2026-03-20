import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CloudSunRain } from "lucide-react";

export function WeatheCard() {
  const weather = {
    temp: "30ºC",
    temp_approx: "Feels like 26ºC",
    location: "Kapsabet",
    day: "Saturday",
    date: "21 Mar 2026",
    condition: "Heavy Rain",
  };
  return (
    <Card
      size="md"
      className="w-[300px] max-h-[150px] flex flex-row justify-evenly "
    >
      <CardHeader className="flex flex-1">
        <CardDescription>
          <p className="text-[10px] bg-green-600 rounded-lg text-center text-white p-1">
            {weather.location}
          </p>
          <CardTitle>
            <p className="font-bold text-black">{weather.day}</p>
            <span className="text-[11px] text-slate-400">{weather.date}</span>
          </CardTitle>
        </CardDescription>
      </CardHeader>
      <div className="flex flex-1 items-center">
        <CloudSunRain size={64} />
      </div>
      <CardContent className="flex  flex-col justify-between items-center">
        <p className="text-[20px] font-bold">{weather.temp}</p>
        <span>
          <p className="text-[13px] font-bold">{weather.condition}</p>
          <p className="text-[10px] text-slate-400">{weather.temp_approx}</p>
        </span>
      </CardContent>
    </Card>
  );
}
