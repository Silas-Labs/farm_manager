import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Sun,
} from "lucide-react";

export const WeatherAlerts = ({ weather, farmingTips }) => {
  const getWeatherAlerts = () => {
    const alerts = [];
    const current = weather?.current;

    if (!current) return alerts;

    const temp = current.main?.temp;
    const humidity = current.main?.humidity;
    const windSpeed = current.wind?.speed;
    const rain = current.rain?.["3h"] || 0;
    const condition = weather?.condition?.toLowerCase();

    // Temperature alerts
    if (temp > 35) {
      alerts.push({
        type: "heat-wave",
        severity: "warning",
        message:
          "🔥 Heat wave alert! Water crops early morning/evening. Use shade nets for sensitive crops.",
        icon: Thermometer,
      });
    } else if (temp < 10) {
      alerts.push({
        type: "cold",
        severity: "warning",
        message:
          "❄️ Cold temperatures expected. Protect young seedlings with covers. Delay planting.",
        icon: Thermometer,
      });
    }

    // Heavy rain alert
    if (rain > 10) {
      alerts.push({
        type: "heavy-rain",
        severity: "warning",
        message: `🌧️ Heavy rainfall (${rain}mm). Check drainage systems. Avoid applying fertilizers.`,
        icon: CloudRain,
      });
    } else if (rain > 0 && rain <= 10) {
      alerts.push({
        type: "light-rain",
        severity: "info",
        message: `☔ Light rain expected (${rain}mm). Good for soil moisture.`,
        icon: CloudRain,
      });
    }

    // Strong wind alert
    if (windSpeed > 15) {
      alerts.push({
        type: "strong-wind",
        severity: "warning",
        message: `💨 Strong winds (${windSpeed}m/s). Secure equipment, avoid spraying, support tall crops.`,
        icon: Wind,
      });
    } else if (windSpeed > 10) {
      alerts.push({
        type: "moderate-wind",
        severity: "info",
        message: `🌬️ Moderate winds (${windSpeed}m/s). Good for drying but avoid spraying chemicals.`,
        icon: Wind,
      });
    }

    // High humidity alert (disease risk)
    if (humidity > 85) {
      alerts.push({
        type: "high-humidity",
        severity: "warning",
        message:
          "💧 High humidity (>85%). High risk of fungal diseases. Increase air circulation, apply preventive fungicide.",
        icon: Droplets,
      });
    }

    // UV alert
    const uvIndex = current.uvi;
    if (uvIndex > 8) {
      alerts.push({
        type: "high-uv",
        severity: "warning",
        message:
          "☀️ Extreme UV index! Use shade nets for young plants. Work in early morning or evening.",
        icon: Sun,
      });
    } else if (uvIndex > 6) {
      alerts.push({
        type: "moderate-uv",
        severity: "info",
        message:
          "🛡️ High UV levels. Protect workers with hats and sunscreen. Consider shade for seedlings.",
        icon: Sun,
      });
    }

    return alerts;
  };

  const alerts = getWeatherAlerts();

  if (alerts.length === 0 && (!farmingTips || farmingTips.length === 0)) {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🌤️</div>
          <div>
            <p className="font-semibold text-green-800">
              Good Farming Conditions
            </p>
            <p className="text-sm text-green-700">
              Weather is favorable for most farming activities.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "warning":
        return "from-orange-50 to-orange-100 border-orange-300 text-orange-800";
      case "critical":
        return "from-red-50 to-red-100 border-red-300 text-red-800";
      default:
        return "from-blue-50 to-blue-100 border-blue-300 text-blue-800";
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => {
        const Icon = alert.icon;
        const severityColor = getSeverityColor(alert.severity);
        return (
          <Card
            key={idx}
            className={`p-4 bg-gradient-to-r ${severityColor} border-l-4`}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Weather Alert</p>
                <p className="text-sm opacity-90">{alert.message}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
