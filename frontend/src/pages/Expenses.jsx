// src/pages/Expenses.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { expensesAPI, cropsAPI } from "../services/api";
import {
  DollarSign,
  TrendingDown,
  Calendar,
  Trash2,
  Edit,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export const Expenses = () => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const [expenseRes, cropsRes] = await Promise.all([
        expensesAPI.getAll(),
        cropsAPI.getAll().catch(() => ({ data: [] })),
      ]);
      setExpenses(expenseRes.data || []);
      setCrops(cropsRes.data || []);
    } catch (error) {
      console.error("Error loading expenses:", error);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const cropNameById = (id) => {
    const crop = crops.find((c) => c.id === id);
    return crop ? crop.name : null;
  };

  const handleSave = async (expenseData) => {
    try {
      await expensesAPI.create(expenseData);
      toast.success("Expense added successfully");
      loadExpenses();
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error("Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expensesAPI.delete(id);
        toast.success("Expense deleted successfully");
        loadExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast.error("Failed to delete expense");
      }
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categories = ["all", ...new Set(expenses.map((e) => e.category))];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-earth-500 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
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
            Expenses
          </h2>
          <p className="text-earth-500 text-sm mt-1">
            Track and manage all farm expenses
          </p>
        </div>
        <Button
          onClick={() => setShowExpenseModal(true)}
          className="bg-gradient-to-r from-farm-600 to-farm-700 hover:from-farm-700 hover:to-farm-800 text-white shadow-md"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon={DollarSign}
          color="text-red-600"
        />
        <StatCard
          title="Total Transactions"
          value={expenses.length}
          icon={TrendingDown}
          color="text-orange-600"
        />
        <StatCard
          title="Categories"
          value={categories.length - 1}
          icon={Filter}
          color="text-purple-600"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-earth-200 rounded-lg bg-white"
          >
            <option value="all">All Categories</option>
            {categories
              .filter((c) => c !== "all")
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-farm-50 to-farm-100 border-b-2 border-farm-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Crop
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-farm-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-farm-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-farm-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-earth-800">
                      {expense.title}
                    </p>
                    {expense.notes && (
                      <p className="text-xs text-earth-400 mt-0.5">
                        {expense.notes}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-earth-700">
                      {cropNameById(expense.crop_id) || "No crop"}
                    </span>
                    {expense.is_shared_cost && (
                      <span className="ml-2 text-xs text-earth-400">
                        (shared)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-earth-600">
                    {dayjs(expense.date).format("DD MMM YYYY")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold text-red-600">
                      ${expense.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-earth-400"
                  >
                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No expenses recorded yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
