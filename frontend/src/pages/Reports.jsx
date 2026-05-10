// Project: Farm Manager | Module: Reports.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Leaf,
  Sprout,
  Tractor,
  Users,
  CloudSun,
  Calendar,
  PieChart,
  BarChart3,
  FileText,
  Printer,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export const Reports = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [dateRange, setDateRange] = useState("year");
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    profit: 0,
    profitMargin: 0,
    monthlyData: [],
    expenseByCategory: [],
    revenueByCrop: [],
  });

  const [cropData, setCropData] = useState({
    total: 0,
    byStage: [],
    byVariety: [],
    harvestedYield: 0,
    avgDuration: 0,
    successRate: 0,
  });

  const [equipmentData, setEquipmentData] = useState({
    total: 0,
    byStatus: [],
    totalValue: 0,
    utilizationRate: 0,
    maintenanceCost: 0,
  });

  const [laborData, setLaborData] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    totalPayroll: 0,
    avgRate: 0,
    byRole: [],
  });

  const [expenseData, setExpenseData] = useState({
    total: 0,
    byCategory: [],
    byMonth: [],
    topExpenses: [],
  });

  const [weatherData, setWeatherData] = useState({
    avgTemp: 0,
    avgHumidity: 0,
    rainyDays: 0,
    sunnyDays: 0,
    cloudyDays: 0,
  });

  useEffect(() => {
    loadAllReports();
  }, [dateRange]);

  const loadAllReports = () => {
    loadFinancialReport();
    loadCropReport();
    loadEquipmentReport();
    loadLaborReport();
    loadExpenseReport();
    loadWeatherReport();
  };

  const loadFinancialReport = () => {
    const harvests = JSON.parse(localStorage.getItem("harvests") || "[]");
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

    // Filter by date range
    const filteredHarvests = filterByDateRange(harvests);
    const filteredExpenses = filterByDateRange(expenses);

    const totalRevenue = filteredHarvests.reduce(
      (sum, h) => sum + (h.revenue || 0),
      0,
    );
    const totalExpense = filteredExpenses.reduce(
      (sum, e) => sum + (e.amount || 0),
      0,
    );
    const profit = totalRevenue - totalExpense;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    // Monthly data
    const monthlyMap = new Map();
    [...filteredHarvests, ...filteredExpenses].forEach((item) => {
      const month = dayjs(item.date).format("MMM YYYY");
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { month, revenue: 0, expense: 0 });
      }
      const data = monthlyMap.get(month);
      if (item.revenue) data.revenue += item.revenue;
      if (item.amount) data.expense += item.amount;
    });

    // Expense by category
    const expenseByCat = {};
    filteredExpenses.forEach((e) => {
      const cat = e.category || "other";
      expenseByCat[cat] = (expenseByCat[cat] || 0) + e.amount;
    });

    // Revenue by crop
    const revenueByCrop = {};
    filteredHarvests.forEach((h) => {
      revenueByCrop[h.cropName] = (revenueByCrop[h.cropName] || 0) + h.revenue;
    });

    setFinancialData({
      totalRevenue,
      totalExpense,
      profit,
      profitMargin,
      monthlyData: Array.from(monthlyMap.values()),
      expenseByCategory: Object.entries(expenseByCat).map(([name, amount]) => ({
        name,
        amount,
      })),
      revenueByCrop: Object.entries(revenueByCrop).map(([name, amount]) => ({
        name,
        amount,
      })),
    });
  };

  const loadCropReport = () => {
    const crops = JSON.parse(localStorage.getItem("crops") || "[]");
    const harvests = JSON.parse(localStorage.getItem("harvests") || "[]");
    const filteredHarvests = filterByDateRange(harvests);

    const byStage = {
      Planted: crops.filter((c) => c.stage === "Planted").length,
      Growing: crops.filter((c) => c.stage === "Growing").length,
      "Ready to Harvest": crops.filter((c) => c.stage === "Ready to Harvest")
        .length,
      Harvested: crops.filter((c) => c.stage === "Harvested").length,
    };

    const totalYield = filteredHarvests.reduce(
      (sum, h) => sum + (h.yield || 0),
      0,
    );
    const avgDuration =
      crops.length > 0
        ? crops.reduce((sum, c) => sum + (c.duration || 0), 0) / crops.length
        : 0;
    const harvestedCount = crops.filter((c) => c.stage === "Harvested").length;
    const successRate =
      crops.length > 0 ? (harvestedCount / crops.length) * 100 : 0;

    setCropData({
      total: crops.length,
      byStage: Object.entries(byStage).map(([name, count]) => ({
        name,
        count,
      })),
      harvestedYield: totalYield,
      avgDuration: Math.round(avgDuration),
      successRate: Math.round(successRate),
    });
  };

  const loadEquipmentReport = () => {
    const equipment = JSON.parse(localStorage.getItem("equipment") || "[]");
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const maintenanceExpenses = expenses.filter(
      (e) => e.category === "equipment",
    );

    const byStatus = {
      Working: equipment.filter((e) => e.status === "Working").length,
      Maintenance: equipment.filter((e) => e.status === "Maintenance").length,
      Broken: equipment.filter((e) => e.status === "Broken").length,
      Borrowed: equipment.filter((e) => e.status === "Borrowed").length,
    };

    const totalValue = equipment.reduce(
      (sum, e) => sum + (e.price * e.quantity || 0),
      0,
    );
    const workingUnits = equipment
      .filter((e) => e.status === "Working")
      .reduce((sum, e) => sum + e.quantity, 0);
    const totalUnits = equipment.reduce((sum, e) => sum + e.quantity, 0);
    const utilizationRate =
      totalUnits > 0 ? (workingUnits / totalUnits) * 100 : 0;
    const maintenanceCost = maintenanceExpenses.reduce(
      (sum, e) => sum + e.amount,
      0,
    );

    setEquipmentData({
      total: equipment.length,
      byStatus: Object.entries(byStatus).map(([name, count]) => ({
        name,
        count,
      })),
      totalValue,
      utilizationRate: Math.round(utilizationRate),
      maintenanceCost,
    });
  };

  const loadLaborReport = () => {
    const labor = JSON.parse(localStorage.getItem("labor") || "[]");
    const payroll = JSON.parse(localStorage.getItem("payroll") || "[]");
    const filteredPayroll = filterByDateRange(payroll);

    const byRole = {};
    labor.forEach((w) => {
      byRole[w.role] = (byRole[w.role] || 0) + 1;
    });

    const totalPayroll = filteredPayroll.reduce((sum, p) => sum + p.amount, 0);
    const avgRate =
      labor.length > 0
        ? labor.reduce((sum, w) => sum + (w.hourlyRate || 0), 0) / labor.length
        : 0;

    setLaborData({
      total: labor.length,
      active: labor.filter((w) => w.status === "Active").length,
      onLeave: labor.filter((w) => w.status === "On Leave").length,
      totalPayroll,
      avgRate: Math.round(avgRate),
      byRole: Object.entries(byRole).map(([name, count]) => ({ name, count })),
    });
  };

  const loadExpenseReport = () => {
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const filteredExpenses = filterByDateRange(expenses);

    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const byCategory = {};
    filteredExpenses.forEach((e) => {
      const cat = e.category || "other";
      byCategory[cat] = (byCategory[cat] || 0) + e.amount;
    });

    const byMonth = {};
    filteredExpenses.forEach((e) => {
      const month = dayjs(e.date).format("MMM YYYY");
      byMonth[month] = (byMonth[month] || 0) + e.amount;
    });

    const topExpenses = [...filteredExpenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    setExpenseData({
      total,
      byCategory: Object.entries(byCategory).map(([name, amount]) => ({
        name,
        amount,
      })),
      byMonth: Object.entries(byMonth).map(([month, amount]) => ({
        month,
        amount,
      })),
      topExpenses,
    });
  };

  const loadWeatherReport = () => {
    const weatherCache = JSON.parse(
      localStorage.getItem("weather_Kisumu") || "{}",
    );
    const weatherDataList = weatherCache.data?.list || [];

    if (weatherDataList.length > 0) {
      const temps = weatherDataList.map((w) => w.main.temp);
      const humidities = weatherDataList.map((w) => w.main.humidity);
      const conditions = weatherDataList.map((w) =>
        w.weather[0].main.toLowerCase(),
      );

      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      const avgHumidity =
        humidities.reduce((a, b) => a + b, 0) / humidities.length;
      const rainyDays = conditions.filter((c) => c.includes("rain")).length;
      const sunnyDays = conditions.filter((c) => c.includes("clear")).length;
      const cloudyDays = conditions.filter((c) => c.includes("cloud")).length;

      setWeatherData({
        avgTemp: Math.round(avgTemp),
        avgHumidity: Math.round(avgHumidity),
        rainyDays,
        sunnyDays,
        cloudyDays,
      });
    }
  };

  const filterByDateRange = (data) => {
    const now = dayjs();
    let startDate;

    switch (dateRange) {
      case "week":
        startDate = now.subtract(7, "day");
        break;
      case "month":
        startDate = now.subtract(1, "month");
        break;
      case "quarter":
        startDate = now.subtract(3, "month");
        break;
      case "year":
        startDate = now.subtract(1, "year");
        break;
      default:
        return data;
    }

    return data.filter((item) => dayjs(item.date).isAfter(startDate));
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      dateRange,
      financial: financialData,
      crops: cropData,
      equipment: equipmentData,
      labor: laborData,
      expenses: expenseData,
      weather: weatherData,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `farm-report-${dayjs().format("YYYY-MM-DD")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported successfully!");
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-earth-500 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {subtitle && (
              <p className="text-xs text-earth-400 mt-1">{subtitle}</p>
            )}
          </div>
          <Icon className={`w-8 h-8 ${color} opacity-50`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-earth-800">
            Reports & Analytics
          </h2>
          <p className="text-earth-500 text-sm mt-1">
            Comprehensive insights into your farm's performance
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-earth-200 rounded-lg text-sm bg-white"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
          <Button
            onClick={exportReport}
            variant="outline"
            className="border-farm-200 text-farm-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-farm-50 p-1 rounded-lg">
          <TabsTrigger value="summary" className="text-sm">
            📊 Summary
          </TabsTrigger>
          <TabsTrigger value="financial" className="text-sm">
            💰 Financial
          </TabsTrigger>
          <TabsTrigger value="crops" className="text-sm">
            🌾 Crops
          </TabsTrigger>
          <TabsTrigger value="equipment" className="text-sm">
            🚜 Equipment
          </TabsTrigger>
          <TabsTrigger value="labor" className="text-sm">
            👥 Labor
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-sm">
            💸 Expenses
          </TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={`$${financialData.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="text-green-600"
            />
            <StatCard
              title="Total Expenses"
              value={`$${financialData.totalExpense.toLocaleString()}`}
              icon={TrendingDown}
              color="text-red-600"
            />
            <StatCard
              title="Net Profit"
              value={`$${financialData.profit.toLocaleString()}`}
              icon={TrendingUp}
              color="text-blue-600"
            />
            <StatCard
              title="Profit Margin"
              value={`${financialData.profitMargin.toFixed(1)}%`}
              icon={PieChart}
              color="text-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardTitle className="p-5 pb-0">Quick Stats</CardTitle>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-earth-600">🌾 Active Crops</span>
                  <span className="font-bold text-earth-800">
                    {cropData.total}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-earth-600">🚜 Equipment Units</span>
                  <span className="font-bold text-earth-800">
                    {equipmentData.total}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-earth-600">👥 Workforce</span>
                  <span className="font-bold text-earth-800">
                    {laborData.total}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-earth-600">📦 Total Harvest</span>
                  <span className="font-bold text-earth-800">
                    {cropData.harvestedYield} kg
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="p-5 pb-0">Top Expenses</CardTitle>
              <CardContent className="p-5 space-y-3">
                {expenseData.topExpenses.slice(0, 5).map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span className="text-earth-600 truncate">{exp.title}</span>
                    <span className="font-bold text-red-600">
                      ${exp.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {expenseData.topExpenses.length === 0 && (
                  <p className="text-center text-earth-400 py-4">
                    No expenses recorded
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={`$${financialData.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="text-green-600"
            />
            <StatCard
              title="Total Expenses"
              value={`$${financialData.totalExpense.toLocaleString()}`}
              icon={TrendingDown}
              color="text-red-600"
            />
            <StatCard
              title="Net Profit"
              value={`$${financialData.profit.toLocaleString()}`}
              icon={TrendingUp}
              color={`${financialData.profit >= 0 ? "text-green-600" : "text-red-600"}`}
            />
            <StatCard
              title="Profit Margin"
              value={`${financialData.profitMargin.toFixed(1)}%`}
              icon={PieChart}
              color="text-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardTitle className="p-5 pb-0">Revenue by Crop</CardTitle>
              <CardContent className="p-5 space-y-3">
                {financialData.revenueByCrop.map((crop, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span className="text-earth-600">{crop.name}</span>
                    <span className="font-bold text-green-600">
                      ${crop.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {financialData.revenueByCrop.length === 0 && (
                  <p className="text-center text-earth-400 py-4">
                    No revenue data yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="p-5 pb-0">Expenses by Category</CardTitle>
              <CardContent className="p-5 space-y-3">
                {financialData.expenseByCategory.map((cat, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span className="text-earth-600 capitalize">
                      {cat.name}
                    </span>
                    <span className="font-bold text-red-600">
                      ${cat.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {financialData.expenseByCategory.length === 0 && (
                  <p className="text-center text-earth-400 py-4">
                    No expense data yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Crops Tab */}
        <TabsContent value="crops" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Crops"
              value={cropData.total}
              icon={Sprout}
              color="text-farm-600"
            />
            <StatCard
              title="Harvested Yield"
              value={`${cropData.harvestedYield} kg`}
              icon={Leaf}
              color="text-green-600"
            />
            <StatCard
              title="Avg Duration"
              value={`${cropData.avgDuration} months`}
              icon={Calendar}
              color="text-blue-600"
            />
            <StatCard
              title="Success Rate"
              value={`${cropData.successRate}%`}
              icon={TrendingUp}
              color="text-purple-600"
            />
          </div>

          <Card>
            <CardTitle className="p-5 pb-0">Crops by Stage</CardTitle>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cropData.byStage.map((stage, idx) => (
                  <div
                    key={idx}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-2xl font-bold text-farm-600">
                      {stage.count}
                    </p>
                    <p className="text-xs text-earth-500">{stage.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Equipment"
              value={equipmentData.total}
              icon={Tractor}
              color="text-amber-600"
            />
            <StatCard
              title="Total Value"
              value={`$${equipmentData.totalValue.toLocaleString()}`}
              icon={DollarSign}
              color="text-green-600"
            />
            <StatCard
              title="Utilization"
              value={`${equipmentData.utilizationRate}%`}
              icon={BarChart3}
              color="text-blue-600"
            />
            <StatCard
              title="Maintenance Cost"
              value={`$${equipmentData.maintenanceCost.toLocaleString()}`}
              icon={Package}
              color="text-red-600"
            />
          </div>

          <Card>
            <CardTitle className="p-5 pb-0">Equipment by Status</CardTitle>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {equipmentData.byStatus.map((status, idx) => (
                  <div
                    key={idx}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-2xl font-bold text-amber-600">
                      {status.count}
                    </p>
                    <p className="text-xs text-earth-500">{status.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Labor Tab */}
        <TabsContent value="labor" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Workforce"
              value={laborData.total}
              icon={Users}
              color="text-indigo-600"
            />
            <StatCard
              title="Active"
              value={laborData.active}
              icon={TrendingUp}
              color="text-green-600"
            />
            <StatCard
              title="On Leave"
              value={laborData.onLeave}
              icon={Calendar}
              color="text-orange-600"
            />
            <StatCard
              title="Total Payroll"
              value={`$${laborData.totalPayroll.toLocaleString()}`}
              icon={DollarSign}
              color="text-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardTitle className="p-5 pb-0">Workers by Role</CardTitle>
              <CardContent className="p-5 space-y-3">
                {laborData.byRole.map((role, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span className="text-earth-600">{role.name}</span>
                    <span className="font-bold text-indigo-600">
                      {role.count}
                    </span>
                  </div>
                ))}
                {laborData.byRole.length === 0 && (
                  <p className="text-center text-earth-400 py-4">
                    No labor data yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="p-5 pb-0">Labor Stats</CardTitle>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-earth-600">Average Hourly Rate</span>
                  <span className="font-bold text-earth-800">
                    ${laborData.avgRate.toFixed(2)}/hr
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-earth-600">Active Percentage</span>
                  <span className="font-bold text-green-600">
                    {laborData.total
                      ? Math.round((laborData.active / laborData.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Expenses"
              value={`$${expenseData.total.toLocaleString()}`}
              icon={DollarSign}
              color="text-red-600"
            />
            <StatCard
              title="Categories"
              value={expenseData.byCategory.length}
              icon={Package}
              color="text-orange-600"
            />
            <StatCard
              title="Avg Monthly"
              value={`$${Math.round(expenseData.total / (expenseData.byMonth.length || 1)).toLocaleString()}`}
              icon={Calendar}
              color="text-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardTitle className="p-5 pb-0">Top 5 Expenses</CardTitle>
              <CardContent className="p-5 space-y-3">
                {expenseData.topExpenses.map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div>
                      <span className="text-earth-600 truncate">
                        {exp.title}
                      </span>
                      <p className="text-xs text-earth-400">
                        {dayjs(exp.date).format("DD MMM YYYY")}
                      </p>
                    </div>
                    <span className="font-bold text-red-600">
                      ${exp.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {expenseData.topExpenses.length === 0 && (
                  <p className="text-center text-earth-400 py-4">
                    No expenses recorded
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="p-5 pb-0">Expenses by Category</CardTitle>
              <CardContent className="p-5 space-y-3">
                {expenseData.byCategory.map((cat, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span className="text-earth-600 capitalize">
                      {cat.name}
                    </span>
                    <span className="font-bold text-red-600">
                      ${cat.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {expenseData.byCategory.length === 0 && (
                  <p className="text-center text-earth-400 py-4">
                    No expense data yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;

// EOF: Reports.jsx
