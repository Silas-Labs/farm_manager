import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, CloudLightning, CloudFog } from "lucide-react";

export function WeatherCard({weather}) {
  /**
   * Returns appropriate weather icon based on current condition
   * Icons are color-coded for visual clarity
   */
  const getWeatherIcon = () => {
    // Extract and normalize the weather condition from API
    const condition = weather?.data?.weather?.[0]?.main?.toLowerCase()
    
    // Map weather conditions to corresponding icons with tailwind colors
    switch(condition) {
      case 'clear':
        return <Sun size={48} className="text-yellow-400" />
      case 'clouds':
        return <Cloud size={48} className="text-gray-400" />
      case 'rain':
        return <CloudRain size={48} className="text-blue-500" />
      case 'drizzle':
        return <CloudDrizzle size={48} className="text-blue-400" />
      case 'thunderstorm':
        return <CloudLightning size={48} className="text-purple-500" />
      case 'snow':
        return <CloudSnow size={48} className="text-blue-200" />
      case 'mist':
      case 'fog':
        return <CloudFog size={48} className="text-gray-300" />
      default:
        return <Cloud size={48} className="text-gray-400" />
    }
  }

  return (
    <Card className="w-full md:w-80 p-4 flex flex-col md:flex-col gap-4">
      
      {/* Left Side: Date & Location */}
      <CardHeader className="w-full flex flex-col items-start gap-1">
        <CardDescription>
          {/* Location badge from API response */}
          <p className="text-xs bg-green-600 rounded-lg text-white px-2 py-1 text-center">
            {weather?.data?.name}
          </p>
        </CardDescription>
        <CardTitle className="flex flex-col">
          {/* Day and date formatted from Unix timestamp */}
          <span className="font-bold text-black">{weather.day}</span>
          <span className="text-xs text-slate-400">{weather.date}</span>
        </CardTitle>
      </CardHeader>

      {/* Middle: Dynamic Weather Icon */}
      <div className="flex items-center justify-center">
        {getWeatherIcon()}
      </div>

      {/* Right Side: Temperature & Condition */}
      <CardContent className="flex flex-col items-center gap-1">
        <p className="text-2xl font-bold">{weather?.data?.main.temp}</p>
        <p className="text-sm font-semibold">{weather.condition}</p>
        <p className="text-xs text-slate-400">{weather?.data?.main["feels_like"]}</p>
      </CardContent>

    </Card>
  );
}