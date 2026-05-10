// Project: Farm Manager | Module: Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Chart } from "../components/Chart";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Sprout,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Activity,
  Leaf,
} from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    activeCrops: 0,
    totalExpense: 0,
    monthRevenue: 0,
    planted: 0,
    growing: 0,
    readyToHarvest: 0,
    profitMargin: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const crops = JSON.parse(localStorage.getItem("crops") || "[]");
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const harvests = JSON.parse(localStorage.getItem("harvests") || "[]");

    const totalExpense = expenses.reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0,
    );
    const totalRevenue = harvests.reduce((sum, h) => sum + (h.revenue || 0), 0);
    const profitMargin =
      totalRevenue > 0
        ? ((totalRevenue - totalExpense) / totalRevenue) * 100
        : 0;

    setStats({
      activeCrops: crops.length,
      totalExpense,
      monthRevenue: totalRevenue,
      planted: crops.filter((c) => c.stage === "Planted").length,
      growing: crops.filter((c) => c.stage === "Growing").length,
      readyToHarvest: crops.filter((c) => c.stage === "Ready to Harvest")
        .length,
      profitMargin,
    });

    const monthlyData = {};
    [...expenses, ...harvests].forEach((item) => {
      const month = item.date
        ? new Date(item.date).toLocaleString("default", { month: "short" })
        : "Unknown";
      if (!monthlyData[month]) monthlyData[month] = { expense: 0, revenue: 0 };
      if (item.amount) monthlyData[month].expense += item.amount;
      if (item.revenue) monthlyData[month].revenue += item.revenue;
    });

    setChartData(
      Object.entries(monthlyData).map(([month, data]) => ({
        month,
        expense: data.expense,
        revenue: data.revenue,
      })),
    );

    const allActivities = [
      ...crops.slice(-3).map((c) => ({
        type: "🌱 Crop Planted",
        description: `${c.name}`,
        date: c.date,
      })),
      ...harvests.slice(-3).map((h) => ({
        type: "🌾 Harvest",
        description: `${h.cropName} - ${h.yield}kg`,
        date: h.date,
      })),
      ...expenses.slice(-3).map((e) => ({
        type: "💰 Expense",
        description: e.title,
        date: e.date,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    setRecentActivities(allActivities);
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div
        className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-y-12 translate-x-12 group-hover:translate-x-8 transition-transform duration-500`}
      />
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="w-full">
            <p className="text-xs sm:text-sm font-medium text-earth-500 mb-1">
              {title}
            </p>
            <p className="text-xl sm:text-3xl font-bold text-earth-800 break-words">
              {value}
            </p>
            {trend && (
              <p
                className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {trend >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(trend)}% from last month
              </p>
            )}
          </div>
          <div
            className={`p-2 sm:p-3 rounded-2xl bg-gradient-to-br ${color} bg-opacity-10 flex-shrink-0`}
          >
            <Icon
              className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace("bg", "text")}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Welcome Banner - Fixed text colors */}
      <div className="bg-gradient-to-r from-farm-600 to-farm-700 rounded-xl sm:rounded-2xl sm:p-6 ">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold mb-1 sm:mb-2">
              Welcome back, Farmer!
            </h2>
            <p className="text-farm-100 text-sm sm:text-base">
              Here's what's happening on your farm today.
            </p>
          </div>
          <div className="hidden md:block">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-farm-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Stats Grid - Responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Active Crops"
          value={stats.activeCrops}
          icon={Sprout}
          color="bg-green-500"
          trend={5}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.monthRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-emerald-500"
          trend={12}
        />
        <StatCard
          title="Total Expenses"
          value={`$${stats.totalExpense.toLocaleString()}`}
          icon={TrendingDown}
          color="bg-orange-500"
          trend={-3}
        />
        <StatCard
          title="Profit Margin"
          value={`${stats.profitMargin.toFixed(1)}%`}
          icon={Activity}
          color="bg-purple-500"
          trend={8}
        />
      </div>

      {/* Crop Status Cards - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-earth-500">Planted</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {stats.planted}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.activeCrops ? (stats.planted / stats.activeCrops) * 100 : 0}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-earth-500">Growing</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  {stats.growing}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-xl">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.activeCrops ? (stats.growing / stats.activeCrops) * 100 : 0}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 sm:col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-earth-500">
                  Ready to Harvest
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {stats.readyToHarvest}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.activeCrops ? (stats.readyToHarvest / stats.activeCrops) * 100 : 0}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart & Activities - Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 overflow-x-auto">
          <CardTitle className="p-4 sm:p-6 pb-0 text-base sm:text-lg text-earth-800">
            Revenue vs Expenses Trend
          </CardTitle>
          <CardContent className="p-3 sm:p-6">
            <div className="min-w-[280px]">
              <Chart data={chartData} type="comparison" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardTitle className="p-4 sm:p-6 pb-0 flex items-center gap-2 text-base sm:text-lg text-earth-800">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-farm-600" />
            Recent Activities
          </CardTitle>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto">
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 sm:gap-3 pb-3 border-b border-gray-100 last:border-0"
                >
                  <div className="text-xl sm:text-2xl flex-shrink-0">
                    {activity.type.split(" ")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-earth-800 truncate">
                      {activity.type}
                    </p>
                    <p className="text-xs text-earth-500 mt-0.5 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <p className="text-xs text-earth-400 flex-shrink-0">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <p className="text-center text-earth-400 py-8 text-sm">
                  No recent activities
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// EOF: Dashboard.jsx
