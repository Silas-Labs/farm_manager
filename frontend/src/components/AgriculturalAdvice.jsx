// Project: Farm Manager | Module: AgriculturalAdvice.jsx
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Sprout, Droplets, Sun, Wind, Cloud } from "lucide-react";

export const AgriculturalAdvice = ({ weather }) => {
  const getAdvice = () => {
    const current = weather?.current;
    if (!current) return [];

    const advice = [];
    const temp = current.main?.temp;
    const humidity = current.main?.humidity;
    const rain = current.rain?.["3h"] || 0;
    const windSpeed = current.wind?.speed;
    const condition = weather?.condition?.toLowerCase();

    // Temperature advice
    if (temp > 30) {
      advice.push({
        icon: Sun,
        title: "High Temperature",
        message:
          "Water crops early morning or late evening. Consider shade netting for sensitive crops.",
        priority: "high",
      });
    } else if (temp < 15) {
      advice.push({
        icon: Cloud,
        title: "Cool Conditions",
        message: "Delay planting if expecting frost. Cover young seedlings.",
        priority: "medium",
      });
    }

    // Humidity advice
    if (humidity > 80) {
      advice.push({
        icon: Droplets,
        title: "High Humidity",
        message:
          "Risk of fungal diseases. Ensure good air circulation. Consider preventive spraying.",
        priority: "high",
      });
    } else if (humidity < 30) {
      advice.push({
        icon: Droplets,
        title: "Low Humidity",
        message: "Increase irrigation frequency. Monitor soil moisture levels.",
        priority: "medium",
      });
    }

    // Rain advice
    if (rain > 5) {
      advice.push({
        icon: Droplets,
        title: "Rain Expected",
        message:
          "Great for crops! Hold off on irrigation. Check drainage systems.",
        priority: "high",
      });
    } else if (condition?.includes("clear")) {
      advice.push({
        icon: Sun,
        title: "Perfect Weather",
        message: "Good day for planting, spraying, and harvesting activities.",
        priority: "low",
      });
    }

    // Wind advice
    if (windSpeed > 10) {
      advice.push({
        icon: Wind,
        title: "Windy Conditions",
        message: "Avoid spraying. Check support structures for tall crops.",
        priority: "medium",
      });
    }

    // General advice based on condition
    if (condition?.includes("rain")) {
      advice.push({
        icon: Sprout,
        title: "Fertilizing Opportunity",
        message:
          "Good time to apply fertilizer - rain will help it absorb into soil.",
        priority: "medium",
      });
    }

    return advice;
  };

  const advice = getAdvice();

  if (advice.length === 0) {
    return (
      <Card className="p-6">
        <CardTitle className="text-lg mb-2">Agricultural Advice</CardTitle>
        <CardContent className="p-0">
          <p className="text-earth-500">
            No specific advice for current conditions. Conditions are favorable
            for farming.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-red-50/30";
      case "medium":
        return "border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-50/30";
      default:
        return "border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-50/30";
    }
  };

  return (
    <Card className="p-6">
      <CardTitle className="text-lg mb-4 flex items-center gap-2">
        <Sprout className="w-5 h-5 text-farm-600" />
        Smart Agricultural Advice
      </CardTitle>
      <CardContent className="p-0">
        <div className="space-y-3">
          {advice.map((item, idx) => {
            const Icon = item.icon;
            const priorityColor = getPriorityColor(item.priority);
            return (
              <div key={idx} className={`p-4 rounded-lg ${priorityColor}`}>
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-farm-600" />
                  <div>
                    <h4 className="font-semibold text-earth-800">
                      {item.title}
                    </h4>
                    <p className="text-sm text-earth-600 mt-1">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
