import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function WeatherHighlight() {
  const weather = {
    wind: "7.9 km/h",
    wind_sub: "9.00 AM",
    humidity: "85%",
    humidity_sub: "Humidity is good",
    uv_index: "4 UV",
    uv_index_sub: "Moderate UV",
    visibility: "5 km",
    visibility_sub: "9.00 AM",
    sunrise: "4:50 AM",
    sunset: "6:45 PM",
  };

  return (
    <Card className="w-full md:w-[700px] p-4">
      <CardTitle className="text-lg font-bold mb-2">Today's Highlights</CardTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Wind & UV */}
        <div className="flex flex-col gap-4">
          <Card className="p-2">
            <CardHeader>Wind Status</CardHeader>
            <CardContent>
              <p className="font-bold">{weather.wind}</p>
              <CardDescription>{weather.wind_sub}</CardDescription>
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardHeader>UV Index</CardHeader>
            <CardContent>
              <p className="font-bold">{weather.uv_index}</p>
              <CardDescription>{weather.uv_index_sub}</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Humidity & Visibility */}
        <div className="flex flex-col gap-4">
          <Card className="p-2">
            <CardHeader>Humidity</CardHeader>
            <CardContent>
              <p className="font-bold">{weather.humidity}</p>
              <CardDescription>{weather.humidity_sub}</CardDescription>
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardHeader>Visibility</CardHeader>
            <CardContent>
              <p className="font-bold">{weather.visibility}</p>
              <CardDescription>{weather.visibility_sub}</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Sunrise & Sunset */}
        <div className="flex flex-col gap-4">
          <Card className="p-2 text-center">
            <CardHeader>Sunrise</CardHeader>
            <CardContent>
              <p className="font-bold">{weather.sunrise}</p>
            </CardContent>
          </Card>

          <Card className="p-2 text-center">
            <CardHeader>Sunset</CardHeader>
            <CardContent>
              <p className="font-bold">{weather.sunset}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  );
}