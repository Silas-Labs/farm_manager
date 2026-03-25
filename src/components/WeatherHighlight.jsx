import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CloudSunRain } from "lucide-react";

export function WeatherHighlight() {
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
      className="w-125 max-h-87.5"
    >
      <CardTitle className="flex flex-1 ">
        Today's Highlight
      </CardTitle>
      <CardContent className="flex gap-2">
        <div className="gap-2 flex-1 flex flex-col justify-between">
            <Card>
                 <CardTitle>Wind status</CardTitle>
                 <CardContent>
                       <p> {weather.wind}</p>
                    <CardDescription>
                       <span>{weather.wind_sub}</span>
                    </CardDescription>
                 </CardContent>
            </Card>
            <Card>
                 <CardTitle>UV Index</CardTitle>
                  <CardContent>
                       <p> {weather.uv_index}</p>
                    <CardDescription>
                       <span>{weather.uv_index_sub}</span>
                    </CardDescription>
                 </CardContent>
            </Card>
        </div>
        <div className="flex-1 flex flex-col justify-between">
           <Card>
                 <CardTitle>Humidity</CardTitle>
                 <CardContent>
                       <p> {weather.humidity}</p>
                    <CardDescription>
                       <span>{weather.humidity_sub}</span>
                    </CardDescription>
                 </CardContent>
            </Card>
            <Card>
                 <CardTitle>Visibility</CardTitle>
                  <CardContent>
                       <p> {weather.visibility}</p>
                    <CardDescription>
                       <span>{weather.visibility_sub}</span>
                    </CardDescription>
                 </CardContent>
            </Card>

        </div>
        <div className="flex-1 flex flex-col justify-between">
           <Card className="w-44">
            <CardContent>
                <CardDescription>
                    Sunrise
                </CardDescription>
            </CardContent>
            <CardHeader>4.50 AM</CardHeader>
           </Card>
            <Card className="w-44">
            <CardContent>
                <CardDescription>
                    Sunset
                </CardDescription>
            </CardContent>
            <CardHeader>6.45 PM</CardHeader>
           </Card>
        </div>
      </CardContent>
      
    </Card>
  );
}
