import React, { useState, useMemo } from 'react';
import { Chart } from "../components/Chart";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cropsAPI, expensesAPI, harvestsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useEntityData } from '../lib/useEntityData';
import { WeatherWidget } from '../components/WeatherWidget';
import { Sprout, TrendingUp, TrendingDown, DollarSign, Calendar, Activity, Leaf } from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();

  const crops = useEntityData("crops", () => cropsAPI.getAll(), (res) => res.data || []) || [];
  const expenses = useEntityData("expenses", () => expensesAPI.getAll(), (res) => res.data || []) || [];
  const harvests = useEntityData("harvests", () => harvestsAPI.getAll(), (res) => res.data || []) || [];

  const stats = useMemo(() => {
    const totalExpense = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const totalRevenue = harvests.reduce((sum, h) => sum + (h.revenue || 0), 0);
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpense) / totalRevenue * 100) : 0;
    return {
      activeCrops: crops.length,
      totalExpense,
      monthRevenue: totalRevenue,
      planted: crops.filter((c) => c.stage === "Planted").length,
      growing: crops.filter((c) => c.stage === "Growing").length,
      readyToHarvest: crops.filter((c) => c.stage === "Ready to Harvest").length,
      profitMargin,
    };
  }, [crops, expenses, harvests]);

  const chartData = useMemo(() => {
    const monthlyData = {};
    [...expenses, ...harvests].forEach(item => {
      const month = item.date ? new Date(item.date).toLocaleString('default', { month: 'short' }) : "Unknown";
      if (!monthlyData[month]) monthlyData[month] = { expense: 0, revenue: 0 };
      if (item.amount) monthlyData[month].expense += item.amount;
      if (item.revenue) monthlyData[month].revenue += item.revenue;
    });
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      expense: data.expense,
      revenue: data.revenue
    }));
  }, [expenses, harvests]);

  const recentActivities = useMemo(() => {
    const all = [
      ...crops.slice(-3).map(c => ({ type: "🌱 Crop Planted", description: `${c.name}`, date: c.planted_date || c.created_at })),
      ...harvests.slice(-3).map(h => ({ type: "🌾 Harvest", description: `${h.crop_name} - ${h.yield}${h.unit}`, date: h.harvest_date })),
      ...expenses.slice(-3).map(e => ({ type: "💰 Expense", description: e.title, date: e.date }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    return all;
  }, [crops, expenses, harvests]);

  const cropProfitability = useMemo(() => {
    return crops
      .map((crop) => {
        const cropExpenses = expenses
          .filter((e) => e.crop_id === crop.id && !e.is_shared_cost)
          .reduce((sum, e) => sum + (e.amount || 0), 0);
        const revenue = harvests
          .filter((h) => h.crop_id === crop.id)
          .reduce((sum, h) => sum + (h.revenue || 0), 0);
        const net = revenue - cropExpenses;
        const margin =
          revenue > 0 ? (net / revenue) * 100 : cropExpenses > 0 ? -100 : 0;
        return { id: crop.id, name: crop.name, revenue, expenses: cropExpenses, net, margin };
      })
      .sort((a, b) => b.net - a.net);
  }, [crops, expenses, harvests]);

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-y-12 translate-x-12 group-hover:translate-x-8 transition-transform duration-500`} />
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="w-full">
            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-xl sm:text-3xl font-bold text-gray-800 break-words">{value}</p>
            {trend && (
              <p className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(trend)}% from last month
              </p>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-2xl bg-gradient-to-br ${color} bg-opacity-10 flex-shrink-0`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace('bg', 'text')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6">
      {/* Welcome Banner - Light background, dark text */}
      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome back, {user?.name?.split(" ")[0] || "Farmer"}!
            </h2>
            <p className="text-gray-600 text-sm">
              Here's what's happening on your farm today.
            </p>
          </div>
          <div className="hidden md:block">
            <Calendar className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Weather widget */}
      <WeatherWidget />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Crops" value={stats.activeCrops} icon={Sprout} color="bg-green-500" trend={5} />
        <StatCard title="Total Revenue" value={`$${stats.monthRevenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" trend={12} />
        <StatCard title="Total Expenses" value={`$${stats.totalExpense.toLocaleString()}`} icon={TrendingDown} color="bg-orange-500" trend={-3} />
        <StatCard title="Profit Margin" value={`${stats.profitMargin.toFixed(1)}%`} icon={Activity} color="bg-purple-500" trend={8} />
      </div>

      {/* Crop Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Planted</p>
                <p className="text-3xl font-bold text-blue-600">{stats.planted}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Sprout className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${stats.activeCrops ? (stats.planted / stats.activeCrops) * 100 : 0}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Growing</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.growing}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Leaf className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full transition-all duration-500" style={{ width: `${stats.activeCrops ? (stats.growing / stats.activeCrops) * 100 : 0}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ready to Harvest</p>
                <p className="text-3xl font-bold text-green-600">{stats.readyToHarvest}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${stats.activeCrops ? (stats.readyToHarvest / stats.activeCrops) * 100 : 0}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-x-auto">
          <CardTitle className="p-5 pb-0 text-gray-800">Revenue vs Expenses Trend</CardTitle>
          <CardContent className="p-5">
            <div className="min-w-[280px]">
              <Chart data={chartData} type="comparison" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardTitle className="p-5 pb-0 flex items-center gap-2 text-gray-800">
            <Activity className="w-5 h-5 text-green-600" />
            Recent Activities
          </CardTitle>
          <CardContent className="p-5">
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="text-2xl flex-shrink-0">{activity.type.split(" ")[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{activity.type}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{activity.description}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crop profitability ranking */}
      <Card>
        <CardTitle className="p-5 pb-0 flex items-center gap-2 text-gray-800">
          <Activity className="w-5 h-5 text-green-600" />
          Crop Profitability Ranking
        </CardTitle>
        <CardContent className="p-5">
          {cropProfitability.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              No crops yet. Plant a crop to see which ones pay off.
            </p>
          ) : (
            <div className="space-y-3">
              {cropProfitability.map((crop, idx) => {
                const positive = crop.net >= 0;
                const isBest = idx === 0 && cropProfitability.length > 1;
                const isWorst =
                  idx === cropProfitability.length - 1 &&
                  cropProfitability.length > 1;
                return (
                  <div
                    key={crop.id}
                    className="flex items-center gap-3"
                  >
                    <span className="w-6 text-center text-sm font-semibold text-gray-400">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {crop.name}
                          {isBest && (
                            <span className="ml-2 text-[10px] font-semibold text-green-700 uppercase">
                              Best
                            </span>
                          )}
                          {isWorst && (
                            <span className="ml-2 text-[10px] font-semibold text-red-600 uppercase">
                              Worst
                            </span>
                          )}
                        </p>
                        <p
                          className={`text-sm font-bold ${
                            positive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ${crop.net.toLocaleString()}
                          <span className="text-xs text-gray-400 ml-1">
                            ({Math.round(crop.margin)}%)
                          </span>
                        </p>
                      </div>
                      <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${positive ? "bg-green-500" : "bg-red-500"}`}
                          style={{
                            width: `${Math.min(Math.abs(crop.margin), 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};