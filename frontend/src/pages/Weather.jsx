import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  MapPin,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
  Search,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

const Weather = () => {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [location, setLocation] = useState({
    lat: -0.0917,
    lon: 34.768,
    name: "Kisumu",
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { VITE_WEATHER_API, VITE_WEATHER_URL, VITE_GEOCODING_URL } = import.meta
    .env;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentLocations") || "[]");
    setRecentLocations(stored);

    const savedLocation = localStorage.getItem("currentLocation");
    if (savedLocation) {
      const parsed = JSON.parse(savedLocation);
      setLocation(parsed);
    }
  }, []);

  const saveRecentLocation = (loc) => {
    const updated = [
      loc,
      ...recentLocations.filter((l) => l.name !== loc.name),
    ].slice(0, 5);
    setRecentLocations(updated);
    localStorage.setItem("recentLocations", JSON.stringify(updated));
    localStorage.setItem("currentLocation", JSON.stringify(loc));
  };

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    setLoading(true);

    const cachedData = localStorage.getItem(`weather_${location.name}`);
    const weatherStore = cachedData ? JSON.parse(cachedData) : null;
    const date = Date.now();

    const isCacheValid =
      weatherStore && date - weatherStore.lastUpdate < 3600000;

    if (isCacheValid) {
      setWeather(weatherStore);
      setLastUpdated(weatherStore.lastUpdate);
      toast.info(
        `Weather data loaded from cache (updated ${formatLastUpdated(weatherStore.lastUpdate)})`,
      );
      setLoading(false);
    } else {
      await fetchWeatherData();
    }
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "never";
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${VITE_WEATHER_URL}?lat=${location.lat}&lon=${location.lon}&cnt=40&appid=${VITE_WEATHER_API}&units=metric`,
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const body = await res.json();
      const newUpdate = {
        lastUpdate: Date.now(),
        data: body,
        location: location,
      };

      localStorage.setItem(
        `weather_${location.name}`,
        JSON.stringify(newUpdate),
      );
      setWeather(newUpdate);
      setLastUpdated(newUpdate.lastUpdate);
      toast.success(`Weather updated for ${location.name}!`);
    } catch (error) {
      console.error("Weather fetch error:", error);
      toast.error("Failed to fetch weather data. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `${VITE_GEOCODING_URL}?q=${encodeURIComponent(searchQuery)},KE&limit=5&appid=${VITE_WEATHER_API}`,
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.length === 0) {
        toast.error("No locations found. Try a different name.");
        setSearchResults([]);
      } else {
        setSearchResults(
          data.map((city) => ({
            name: city.name,
            country: city.country,
            lat: city.lat,
            lon: city.lon,
            state: city.state,
          })),
        );
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to search location. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = (loc) => {
    const newLocation = {
      lat: loc.lat,
      lon: loc.lon,
      name: loc.state ? `${loc.name} (${loc.state})` : loc.name,
    };
    setLocation(newLocation);
    saveRecentLocation(newLocation);
    setShowLocationModal(false);
    setSearchQuery("");
    setSearchResults([]);
    toast.success(`Location changed to ${newLocation.name}`);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }

    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${VITE_WEATHER_API}`,
          );
          const data = await res.json();
          const locationName = data[0]?.name || "Current Location";

          const newLocation = {
            lat: latitude,
            lon: longitude,
            name: locationName,
          };

          setLocation(newLocation);
          saveRecentLocation(newLocation);
          setShowLocationModal(false);
          toast.success(`Location updated to: ${locationName}`);
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          const newLocation = {
            lat: latitude,
            lon: longitude,
            name: "Current Location",
          };
          setLocation(newLocation);
          setShowLocationModal(false);
        }
        setSearching(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to get your location. Please check permissions.");
        setSearching(false);
      },
    );
  };

  const getCurrentWeather = () => {
    if (!weather.data || !weather.data.list) return null;
    return weather.data.list[0];
  };

  const getDailyForecast = () => {
    if (!weather.data || !weather.data.list) return [];

    const dailyMap = new Map();

    for (const item of weather.data.list) {
      const date = dayjs.unix(item.dt).format("YYYY-MM-DD");

      if (!dailyMap.has(date)) {
        dailyMap.set(date, item);
      }

      if (dailyMap.size >= 5) break;
    }

    return Array.from(dailyMap.values()).slice(0, 5);
  };

  const current = getCurrentWeather();
  const forecast = getDailyForecast();

  const StatCard = ({
    title,
    value,
    unit,
    icon: Icon,
    bgColor,
    textColor,
    borderColor,
    subtitle,
  }) => (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${bgColor} border ${borderColor}`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p
              className={`text-xs sm:text-sm font-medium ${textColor} opacity-80 mb-1`}
            >
              {title}
            </p>
            <p className={`text-xl sm:text-2xl font-bold ${textColor}`}>
              {value}
              {unit && <span className="text-sm opacity-70 ml-1">{unit}</span>}
            </p>
            {subtitle && (
              <p className={`text-xs ${textColor} opacity-70 mt-1`}>
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={`p-2 sm:p-3 rounded-2xl ${bgColor} bg-opacity-30 flex-shrink-0`}
          >
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${textColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getWeatherIcon = (condition) => {
    const main = condition?.toLowerCase() || "";
    if (main.includes("clear")) return "☀️";
    if (main.includes("cloud")) return "☁️";
    if (main.includes("rain")) return "🌧️";
    if (main.includes("thunder")) return "⛈️";
    if (main.includes("snow")) return "❄️";
    return "🌤️";
  };

  const getWeatherCardColors = () => {
    if (!current)
      return {
        bg: "bg-white",
        text: "text-earth-800",
        border: "border-gray-200",
      };

    const condition = current.weather[0].main.toLowerCase();
    if (condition.includes("clear")) {
      return {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
      };
    }
    if (condition.includes("cloud")) {
      return {
        bg: "bg-gray-50",
        text: "text-gray-800",
        border: "border-gray-200",
      };
    }
    if (condition.includes("rain")) {
      return {
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-200",
      };
    }
    return {
      bg: "bg-farm-50",
      text: "text-farm-800",
      border: "border-farm-200",
    };
  };

  const weatherColors = getWeatherCardColors();

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-earth-800">
            Weather Station
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-farm-600" />
            <p className="text-earth-600 text-sm font-medium">
              {location.name}, Kenya
            </p>
            {lastUpdated && (
              <p className="text-xs text-earth-400 ml-2">
                Updated {formatLastUpdated(lastUpdated)}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowLocationModal(true)}
            className="border-farm-300 text-farm-700 bg-white hover:bg-farm-50"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Change Location
          </Button>
          <Button
            onClick={fetchWeatherData}
            disabled={loading}
            className="bg-farm-600 hover:bg-farm-700 font-medium shadow-md text-black"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2  ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Updating..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && !current ? (
        <Card className="p-12 text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-3 text-farm-500 animate-spin" />
          <p className="text-earth-600">
            Fetching weather data for {location.name}...
          </p>
        </Card>
      ) : !current ? (
        <Card className="p-12 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-earth-400" />
          <p className="text-earth-600 mb-4">
            No weather data available for {location.name}
          </p>
          <Button
            onClick={fetchWeatherData}
            className="bg-farm-600 hover:bg-farm-700 text-black"
          >
            Load Weather Data
          </Button>
        </Card>
      ) : (
        <>
          {/* Main Weather Card - With inline sun times */}
          <Card
            className={`overflow-hidden ${weatherColors.bg} border ${weatherColors.border}`}
          >
            {/* Top section: Weather and Sun times inline */}
            <div className={`p-4 sm:p-6 ${weatherColors.bg}`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Left: Current Weather */}
                <div>
                  <p className={`text-sm ${weatherColors.text} opacity-70`}>
                    Current Weather
                  </p>
                  <p
                    className={`text-3xl sm:text-4xl font-bold ${weatherColors.text} mt-1`}
                  >
                    {Math.round(current.main.temp)}°C
                  </p>
                  <p
                    className={`text-sm ${weatherColors.text} opacity-70 mt-1 capitalize`}
                  >
                    {current.weather[0].description}
                  </p>
                </div>

                {/* Center: Sunrise & Sunset - Inline centered */}
                <div className="flex items-center gap-4 sm:gap-6 px-4 py-2 bg-white/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-earth-500">Sunrise</p>
                      <p className="text-sm font-semibold text-earth-800">
                        {dayjs(current.sys.sunrise).format("hh:mm A")}
                      </p>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <Sunset className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-earth-500">Sunset</p>
                      <p className="text-sm font-semibold text-earth-800">
                        {dayjs(current.sys.sunset).format("hh:mm A")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Feels Like */}
                <div className="text-right">
                  <p className="text-5xl sm:text-6xl">
                    {getWeatherIcon(current.weather[0].main)}
                  </p>
                  <p
                    className={`text-sm ${weatherColors.text} opacity-70 mt-1`}
                  >
                    Feels like {Math.round(current.main.feels_like)}°C
                  </p>
                  {/*<p className="text-xs text-earth-400 mt-1">
                    Day length:{" "}
                    {Math.round(
                      (current.sys.sunset - current.sys.sunrise) / 3600,
                    )}
                    h
                  </p> */}
                </div>
              </div>
            </div>

            {/* Weather details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6 bg-white/50 border-t border-gray-200/50">
              <div className="text-center">
                <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-700">
                  {current.main.humidity}%
                </p>
                <p className="text-xs text-earth-500">Humidity</p>
              </div>
              <div className="text-center">
                <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-teal-700">
                  {Math.round(current.wind.speed)} km/h
                </p>
                <p className="text-xs text-earth-500">Wind</p>
              </div>
              <div className="text-center">
                <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-purple-700">
                  {current.main.pressure} hPa
                </p>
                <p className="text-xs text-earth-500">Pressure</p>
              </div>
              <div className="text-center">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-indigo-700">
                  {(current.visibility / 1000).toFixed(1)} km
                </p>
                <p className="text-xs text-earth-500">Visibility</p>
              </div>
            </div>
          </Card>

          {/* Stats Grid - Detailed metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <StatCard
              title="Humidity"
              value={current.main.humidity}
              unit="%"
              icon={Droplets}
              bgColor="bg-blue-100"
              textColor="text-blue-700"
              borderColor="border-blue-200"
              subtitle={
                current.main.humidity > 70
                  ? "High - disease risk"
                  : current.main.humidity > 40
                    ? "Normal"
                    : "Low humidity"
              }
            />
            <StatCard
              title="Wind Speed"
              value={Math.round(current.wind.speed)}
              unit="km/h"
              icon={Wind}
              bgColor="bg-teal-100"
              textColor="text-teal-700"
              borderColor="border-teal-200"
              subtitle={
                current.wind.speed > 15 ? "Strong - avoid spraying" : "Moderate"
              }
            />
            <StatCard
              title="Visibility"
              value={(current.visibility / 1000).toFixed(1)}
              unit="km"
              icon={Eye}
              bgColor="bg-indigo-100"
              textColor="text-indigo-700"
              borderColor="border-indigo-200"
              subtitle={current.visibility > 8000 ? "Clear" : "Limited"}
            />
            <StatCard
              title="Pressure"
              value={current.main.pressure}
              unit="hPa"
              icon={Gauge}
              bgColor="bg-purple-100"
              textColor="text-purple-700"
              borderColor="border-purple-200"
              subtitle={
                current.main.pressure > 1015 ? "High pressure" : "Normal"
              }
            />
          </div>

          {/* Farming Tips Card */}
          <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
            <CardTitle className="p-4 pb-0 text-base flex items-center gap-2 text-green-800">
              <AlertTriangle className="w-4 h-4 text-green-600" />
              Farming Tips
            </CardTitle>
            <CardContent className="p-4">
              <div className="space-y-2">
                {current.weather[0].main === "Clear" && (
                  <p className="text-sm text-green-700">
                    ☀️ Perfect for: Planting, Harvesting, Spraying
                  </p>
                )}
                {current.weather[0].main === "Clouds" && (
                  <p className="text-sm text-green-700">
                    ☁️ Good for: Field preparation, Weeding
                  </p>
                )}
                {current.weather[0].main === "Rain" && (
                  <p className="text-sm text-green-700">
                    🌧️ Ideal for: Planning, Equipment maintenance
                  </p>
                )}
                {current.wind.speed > 10 && (
                  <p className="text-sm text-orange-700">
                    💨 Avoid spraying - windy conditions
                  </p>
                )}
                {current.main.humidity > 80 && (
                  <p className="text-sm text-red-700">
                    🦠 High disease risk - consider fungicide
                  </p>
                )}
                {current.main.temp > 30 && (
                  <p className="text-sm text-orange-700">
                    🔥 Heat stress risk - water early morning
                  </p>
                )}
                {current.main.temp < 15 && (
                  <p className="text-sm text-blue-700">
                    ❄️ Cool temperatures - delay planting
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          {forecast.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-earth-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-farm-600" />
                5-Day Forecast
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {forecast.map((day, idx) => (
                  <Card
                    key={idx}
                    className="text-center bg-gray-50 border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <CardContent className="p-3">
                      <p className="text-xs font-medium text-farm-600">
                        {dayjs.unix(day.dt).format("ddd, MMM D")}
                      </p>
                      <p className="text-2xl my-2">
                        {getWeatherIcon(day.weather[0].main)}
                      </p>
                      <p className="text-sm font-bold text-farm-700">
                        {Math.round(day.main.temp)}°C
                      </p>
                      <p className="text-xs text-earth-500 capitalize">
                        {day.weather[0].description.split(" ")[0]}
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-earth-400">
                          💧 {day.main.humidity}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Weather Tip Footer */}
          <Card className="bg-farm-100 border-farm-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-farm-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-farm-800">
                    🌾 Smart Farming Tip
                  </p>
                  <p className="text-sm text-farm-700 mt-1">
                    {current.weather[0].main === "Clear" &&
                      "Take advantage of good weather for field activities. Early morning is best for harvesting."}
                    {current.weather[0].main === "Clouds" &&
                      "Cloudy days are ideal for transplanting seedlings and applying fertilizers."}
                    {current.weather[0].main === "Rain" &&
                      "Use rainy days for equipment maintenance and farm planning. Check drainage systems."}
                    {current.wind.speed > 10 &&
                      "Wait for winds to calm down before any spraying operations."}
                    {current.main.humidity > 75 &&
                      "Monitor crops for signs of fungal diseases like late blight and rust."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Location Search Modal */}
      {showLocationModal && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLocationModal(false)}
        >
          <Card
            className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-earth-800">
                  Change Location
                </h3>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="text-earth-400 hover:text-earth-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400" />
                  <Input
                    placeholder="Search city in Kenya..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchLocation()}
                    className="pl-9"
                  />
                </div>
                <Button
                  onClick={searchLocation}
                  disabled={searching}
                  className="bg-farm-600 hover:bg-farm-700 text-white"
                >
                  {searching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={useCurrentLocation}
                className="w-full border-farm-300 text-farm-700 bg-white hover:bg-farm-50"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use My Current Location
              </Button>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-earth-500">
                    Search Results:
                  </p>
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectLocation(result)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-farm-50 transition-colors"
                    >
                      <p className="font-medium text-earth-800">
                        {result.name}
                      </p>
                      <p className="text-xs text-earth-500">
                        {result.state ? `${result.state}, ` : ""}Kenya
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {recentLocations.length > 0 && !searchResults.length && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-earth-500">
                    Recent Locations:
                  </p>
                  {recentLocations.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLocation(loc);
                        saveRecentLocation(loc);
                        setShowLocationModal(false);
                        toast.success(`Location changed to ${loc.name}`);
                      }}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-farm-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-earth-400" />
                        <p className="font-medium text-earth-800">{loc.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!searchResults.length && !recentLocations.length && (
                <p className="text-center text-earth-500 text-sm py-4">
                  Search for a city in Kenya to get started
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Weather;
