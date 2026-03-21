import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CloudLightning, CloudRain, CloudRainWind, CloudSun, CloudSunRain, Cloudy } from "lucide-react";

export function Forecast() {
  const weather = {
    wind: "7.9km/h",
    wind_sub:"9.00 AM",
    humidity: "85%",
    humidity_sub:"Humidity is good",
    uv_index: "4 UV",
    uv_index_sub:"Moderate UV",
    visibility: "5 km",
    visibility_sub:"9.00 AM",
    date: "21 Mar 2026",
    condition: "Heavy Rain",
  };
  return (
    <Card
      size="md"
      className="w-125 max-h-87.5 px-2"
    >
      <CardTitle className="flex flex-1 ">
        Forecast
      </CardTitle>
      <CardContent className="flex gap-3">
        <Card className="flex-1 min-h-25 text-center">
            <CardHeader className="font-bold font-sans">Day</CardHeader>
            <CardContent><CloudLightning/></CardContent>
            <CardDescription className="font-bold">24ºC</CardDescription>
        </Card>
        <Card className="flex-1 min-h-25 text-center">
            <CardHeader className="font-bold font-sans">Day</CardHeader>
            <CardContent><CloudSun/></CardContent>
            <CardDescription className="font-bold">24ºC</CardDescription>
        </Card>
        <Card className="flex-1 min-h-25 text-center">
            <CardHeader className="font-bold font-sans">Day</CardHeader>
            <CardContent><CloudRain/></CardContent>
            <CardDescription className="font-bold">24ºC</CardDescription>
        </Card>
        <Card className="flex-1 min-h-25 text-center">
            <CardHeader className="font-bold font-sans">Day</CardHeader>
            <CardContent><CloudRainWind/></CardContent>
            <CardDescription className="font-bold">24ºC</CardDescription>
        </Card>
        <Card className="flex-1 min-h-25 text-center">
            <CardHeader className="font-bold font-sans">Day</CardHeader>
            <CardContent><Cloudy/></CardContent>
            <CardDescription className="font-bold">24ºC</CardDescription>
        </Card>
        <Card className="flex-1 min-h-25 text-center">
            <CardHeader className="font-bold font-sans">Day</CardHeader>
            <CardContent><CloudRain/></CardContent>
            <CardDescription className="font-bold">24ºC</CardDescription>
        </Card>
      </CardContent>
      
    </Card>
  );
}
