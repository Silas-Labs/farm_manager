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
  Calendar,
  PieChart,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";
import { 
  cropsAPI, 
  equipmentAPI, 
  laborAPI, 
  expensesAPI, 
  harvestsAPI,
  dashboardAPI 
} from "../services/api";

export const Reports = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [dateRange, setDateRange] = useState("year");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadAllReports();
  }, [dateRange]);

  const loadAllReports = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchFinancialData(),
        fetchCropData(),
        fetchEquipmentData(),
        fetchLaborData(),
        fetchExpenseData(),
      ]);
    } catch (error) {
      console.error("Failed to load reports:", error);
      toast.error("Failed to load some report data");
    } finally {
      setLoading(false);
    }
  };

  const filterByDateRange = (data, dateKey = "date") => {
    const now = dayjs();
    let startDate;

    switch (dateRange) {
      case "week": startDate = now.subtract(7, "day"); break;
      case "month": startDate = now.subtract(1, "month"); break;
      case "quarter": startDate = now.subtract(3, "month"); break;
      case "year": startDate = now.subtract(1, "year"); break;
      default: return data;
    }

    return data.filter((item) => {
      const date = item[dateKey] || item.created_at || item.harvest_date || item.purchase_date || item.start_date;
      return dayjs(date).isAfter(startDate);
    });
  };

  const fetchFinancialData = async () => {
    const [harvestsRes, expensesRes] = await Promise.all([
      harvestsAPI.getAll(),
      expensesAPI.getAll(),
    ]);

    const harvests = harvestsRes.data || [];
    const expenses = expensesRes.data || [];

    const filteredHarvests = filterByDateRange(harvests, "harvest_date");
    const filteredExpenses = filterByDateRange(expenses, "date");

    const totalRevenue = filteredHarvests.reduce((sum, h) => sum + (h.revenue || 0), 0);
    const totalExpense = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const profit = totalRevenue - totalExpense;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    // Monthly data
    const monthlyMap = new Map();
    filteredHarvests.forEach((h) => {
      const month = dayjs(h.harvest_date).format("MMM YYYY");
      if (!monthlyMap.has(month)) monthlyMap.set(month, { month, revenue: 0, expense: 0 });
      monthlyMap.get(month).revenue += (h.revenue || 0);
    });
    filteredExpenses.forEach((e) => {
      const month = dayjs(e.date).format("MMM YYYY");
      if (!monthlyMap.has(month)) monthlyMap.set(month, { month, revenue: 0, expense: 0 });
      monthlyMap.get(month).expense += (e.amount || 0);
    });

    const expenseByCat = {};
    filteredExpenses.forEach((e) => {
      const cat = e.category || "other";
      expenseByCat[cat] = (expenseByCat[cat] || 0) + e.amount;
    });

    const revenueByCrop = {};
    filteredHarvests.forEach((h) => {
      revenueByCrop[h.crop_name] = (revenueByCrop[h.crop_name] || 0) + h.revenue;
    });

    setFinancialData({
      totalRevenue,
      totalExpense,
      profit,
      profitMargin,
      monthlyData: Array.from(monthlyMap.values()),
      expenseByCategory: Object.entries(expenseByCat).map(([name, amount]) => ({ name, amount })),
      revenueByCrop: Object.entries(revenueByCrop).map(([name, amount]) => ({ name, amount })),
    });
  };

  const fetchCropData = async () => {
    const [cropsRes, harvestsRes] = await Promise.all([
      cropsAPI.getAll(),
      harvestsAPI.getAll(),
    ]);

    const crops = cropsRes.data || [];
    const harvests = harvestsRes.data || [];
    const filteredHarvests = filterByDateRange(harvests, "harvest_date");

    const byStage = {
      Planted: crops.filter((c) => c.stage === "Planted").length,
      Growing: crops.filter((c) => c.stage === "Growing").length,
      "Ready to Harvest": crops.filter((c) => c.stage === "Ready to Harvest").length,
      Harvested: crops.filter((c) => c.stage === "Harvested").length,
    };

    const totalYield = filteredHarvests.reduce((sum, h) => sum + (h.yield || 0), 0);
    const avgDuration = crops.length > 0 ? crops.reduce((sum, c) => sum + (c.duration || 0), 0) / crops.length : 0;
    const successRate = crops.length > 0 ? (crops.filter(c => c.stage === "Harvested").length / crops.length) * 100 : 0;

    setCropData({
      total: crops.length,
      byStage: Object.entries(byStage).map(([name, count]) => ({ name, count })),
      harvestedYield: totalYield,
      avgDuration: Math.round(avgDuration),
      successRate: Math.round(successRate),
    });
  };

  const fetchEquipmentData = async () => {
    const [equipRes, expensesRes] = await Promise.all([
      equipmentAPI.getAll(),
      expensesAPI.getAll(),
    ]);

    const equipment = equipRes.data || [];
    const expenses = expensesRes.data || [];
    const maintenanceExpenses = expenses.filter(e => e.category === "equipment");

    const byStatus = {
      Working: equipment.filter((e) => e.status === "Working").length,
      Maintenance: equipment.filter((e) => e.status === "Maintenance").length,
      Broken: equipment.filter((e) => e.status === "Broken").length,
      Borrowed: equipment.filter((e) => e.status === "Borrowed").length,
    };

    const totalValue = equipment.reduce((sum, e) => sum + (e.price * e.quantity || 0), 0);
    const workingUnits = equipment.filter(e => e.status === "Working").reduce((sum, e) => sum + e.quantity, 0);
    const totalUnits = equipment.reduce((sum, e) => sum + e.quantity, 0);
    const utilizationRate = totalUnits > 0 ? (workingUnits / totalUnits) * 100 : 0;
    const maintenanceCost = maintenanceExpenses.reduce((sum, e) => sum + e.amount, 0);

    setEquipmentData({
      total: equipment.length,
      byStatus: Object.entries(byStatus).map(([name, count]) => ({ name, count })),
      totalValue,
      utilizationRate: Math.round(utilizationRate),
      maintenanceCost,
    });
  };

  const fetchLaborData = async () => {
    const [laborRes, expensesRes] = await Promise.all([
      laborAPI.getAll(),
      expensesAPI.getAll(),
    ]);

    const labor = laborRes.data || [];
    const payrollExpenses = expensesRes.data?.filter(e => e.category === "labor") || [];
    const filteredPayroll = filterByDateRange(payrollExpenses, "date");

    const byRole = {};
    labor.forEach((w) => {
      byRole[w.role] = (byRole[w.role] || 0) + 1;
    });

    const totalPayroll = filteredPayroll.reduce((sum, p) => sum + p.amount, 0);
    const avgRate = labor.length > 0 ? labor.reduce((sum, w) => sum + (w.hourly_rate || 0), 0) / labor.length : 0;

    setLaborData({
      total: labor.length,
      active: labor.filter((w) => w.status === "Active").length,
      onLeave: labor.filter((w) => w.status === "On Leave").length,
      totalPayroll,
      avgRate: Math.round(avgRate),
      byRole: Object.entries(byRole).map(([name, count]) => ({ name, count })),
    });
  };

  const fetchExpenseData = async () => {
    const response = await expensesAPI.getAll();
    const expenses = response.data || [];
    const filteredExpenses = filterByDateRange(expenses, "date");

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
      byCategory: Object.entries(byCategory).map(([name, amount]) => ({ name, amount })),
      byMonth: Object.entries(byMonth).map(([month, amount]) => ({ month, amount })),
      topExpenses,
    });
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
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
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
            {subtitle && <p className="text-xs text-earth-400 mt-1">{subtitle}</p>}
          </div>
          <Icon className={`w-8 h-8 ${color} opacity-50`} />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farm-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
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
          <Button onClick={exportReport} variant="outline" className="border-farm-200 text-farm-700">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-farm-50 p-1 rounded-lg">
          <TabsTrigger value="summary">📊 Summary</TabsTrigger>
          <TabsTrigger value="financial">💰 Financial</TabsTrigger>
          <TabsTrigger value="crops">🌾 Crops</TabsTrigger>
          <TabsTrigger value="equipment">🚜 Equipment</TabsTrigger>
          <TabsTrigger value="labor">👥 Labor</TabsTrigger>
          <TabsTrigger value="expenses">💸 Expenses</TabsTrigger>
        </TabsList>

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
              color={financialData.profit >= 0 ? "text-blue-600" : "text-red-600"}
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
              <CardTitle className="p-5 pb-0 text-lg">Quick Stats</CardTitle>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-earth-600">🌾 Active Crops</span>
                  <span className="font-bold">{cropData.total}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-earth-600">🚜 Equipment Units</span>
                  <span className="font-bold">{equipmentData.total}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-earth-600">👥 Workforce</span>
                  <span className="font-bold">{laborData.total}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-earth-600">📦 Total Harvest</span>
                  <span className="font-bold">{cropData.harvestedYield} kg</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="p-5 pb-0 text-lg">Top Expenses</CardTitle>
              <CardContent className="p-5 space-y-3">
                {expenseData.topExpenses.map((exp, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b">
                    <span className="text-earth-600 truncate">{exp.title}</span>
                    <span className="font-bold text-red-600">${exp.amount.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardTitle className="p-5 pb-0 text-lg">Revenue by Crop</CardTitle>
              <CardContent className="p-5 space-y-3">
                {financialData.revenueByCrop.map((crop, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b">
                    <span className="text-earth-600">{crop.name}</span>
                    <span className="font-bold text-green-600">${crop.amount.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardTitle className="p-5 pb-0 text-lg">Expenses by Category</CardTitle>
              <CardContent className="p-5 space-y-3">
                {financialData.expenseByCategory.map((cat, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b">
                    <span className="text-earth-600 capitalize">{cat.name}</span>
                    <span className="font-bold text-red-600">${cat.amount.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs follow similar structure... */}
        <TabsContent value="crops" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <StatCard title="Total Crops" value={cropData.total} icon={Sprout} color="text-farm-600" />
             <StatCard title="Harvested Yield" value={`${cropData.harvestedYield} kg`} icon={Leaf} color="text-green-600" />
             <StatCard title="Avg Duration" value={`${cropData.avgDuration} months`} icon={Calendar} color="text-blue-600" />
             <StatCard title="Success Rate" value={`${cropData.successRate}%`} icon={TrendingUp} color="text-purple-600" />
          </div>
        </TabsContent>
        
        <TabsContent value="equipment" className="mt-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Equipment" value={equipmentData.total} icon={Tractor} color="text-amber-600" />
              <StatCard title="Total Value" value={`$${equipmentData.totalValue.toLocaleString()}`} icon={DollarSign} color="text-green-600" />
              <StatCard title="Utilization" value={`${equipmentData.utilizationRate}%`} icon={BarChart3} color="text-blue-600" />
              <StatCard title="Maintenance" value={`$${equipmentData.maintenanceCost.toLocaleString()}`} icon={Package} color="text-red-600" />
           </div>
        </TabsContent>

        <TabsContent value="labor" className="mt-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Workers" value={laborData.total} icon={Users} color="text-indigo-600" />
              <StatCard title="Active" value={laborData.active} icon={TrendingUp} color="text-green-600" />
              <StatCard title="Payroll" value={`$${laborData.totalPayroll.toLocaleString()}`} icon={DollarSign} color="text-purple-600" />
              <StatCard title="Avg Rate" value={`$${laborData.avgRate}/hr`} icon={Calendar} color="text-blue-600" />
           </div>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Expenses" value={`$${expenseData.total.toLocaleString()}`} icon={DollarSign} color="text-red-600" />
              <StatCard title="Categories" value={expenseData.byCategory.length} icon={Package} color="text-orange-600" />
           </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Reports;
