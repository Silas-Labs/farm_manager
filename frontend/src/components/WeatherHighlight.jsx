import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function WeatherHighlight({weather}) {
  /**
   * Converts Unix timestamp to readable time format (HH:MM AM/PM)
   */
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  // Extract and prepare data from weather API response
  const windSpeed = weather?.data?.wind?.speed || 0
  const humidity = weather?.data?.main?.humidity || 0
  const visibility = weather?.data?.visibility ? (weather.data.visibility / 1000).toFixed(1) : 0
  const sunrise = weather?.data?.sys?.sunrise
  const sunset = weather?.data?.sys?.sunset

  // Map extracted data to display format with dynamic values
  const weatherHighlights = {
    wind: `${windSpeed} m/s`,
    wind_sub: formatTime(weather?.data?.dt),
    humidity: `${humidity}%`,
    humidity_sub: humidity > 70 ? "High humidity" : humidity > 40 ? "Humidity is good" : "Low humidity",
    uv_index: "N/A",
    uv_index_sub: "Not available in this API",
    visibility: `${visibility} km`,
    visibility_sub: formatTime(weather?.data?.dt),
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
  }

  return (
    <Card className="w-full md:w-[700px] p-4">
      <CardTitle className="text-lg font-bold mb-2">Today's Highlights</CardTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Wind & UV */}
        <div className="flex flex-col gap-4">
          <Card className="p-2">
            <CardHeader>Wind Status</CardHeader>
            <CardContent>
              <p className="font-bold">{weatherHighlights.wind}</p>
              <CardDescription>{weatherHighlights.wind_sub}</CardDescription>
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardHeader>UV Index</CardHeader>
            <CardContent>
              <p className="font-bold">{weatherHighlights.uv_index}</p>
              <CardDescription>{weatherHighlights.uv_index_sub}</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Humidity & Visibility */}
        <div className="flex flex-col gap-4">
          <Card className="p-2">
            <CardHeader>Humidity</CardHeader>
            <CardContent>
              <p className="font-bold">{weatherHighlights.humidity}</p>
              <CardDescription>{weatherHighlights.humidity_sub}</CardDescription>
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardHeader>Visibility</CardHeader>
            <CardContent>
              <p className="font-bold">{weatherHighlights.visibility}</p>
              <CardDescription>{weatherHighlights.visibility_sub}</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Sunrise & Sunset */}
        <div className="flex flex-col gap-4">
          <Card className="p-2 text-center">
            <CardHeader>Sunrise</CardHeader>
            <CardContent>
              <p className="font-bold">{weatherHighlights.sunrise}</p>
            </CardContent>
          </Card>

          <Card className="p-2 text-center">
            <CardHeader>Sunset</CardHeader>
            <CardContent>
              <p className="font-bold">{weatherHighlights.sunset}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  );
}