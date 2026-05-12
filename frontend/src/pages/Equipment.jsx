import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddEquipmentModal } from "../components/AddEquipmentModal";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { equipmentAPI, expensesAPI } from "../services/api";
import {
  Tractor,
  Wrench,
  Package,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export const Equipment = () => {
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const response = await equipmentAPI.getAll();
      setEquipment(response.data || []);
    } catch (error) {
      console.error("Error loading equipment:", error);
      toast.error("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (props) => {
    try {
      const response = await equipmentAPI.create({
        name: props.name,
        type: props.type,
        model: props.model,
        description: props.description,
        status: props.status,
        quantity: parseInt(props.quantity),
        purchase_date: props.date,
        price: parseFloat(props.price),
      });

      setEquipment([...equipment, response.data.data]);
      toast.success("Equipment added successfully.");
      loadEquipment();
    } catch (error) {
      console.error("Error creating equipment:", error);
      toast.error("Failed to add equipment");
    }
  };

  const deleteEquipment = async (id) => {
    if (window.confirm("Are you sure you want to remove this equipment?")) {
      try {
        await equipmentAPI.delete(id);
        setEquipment(equipment.filter((item) => item.id !== id));
        toast.success("Equipment removed successfully");
      } catch (error) {
        console.error("Error deleting equipment:", error);
        toast.error("Failed to delete equipment");
      }
    }
  };

  const updateEquipmentStatus = async (id, newStatus) => {
    const item = equipment.find((e) => e.id === id);
    if (!item) return;

    try {
      await equipmentAPI.update(id, {
        name: item.name,
        type: item.type,
        model: item.model,
        description: item.description,
        status: newStatus,
        quantity: item.quantity,
        purchase_date: item.purchase_date,
        price: item.price,
      });

      setEquipment(
        equipment.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast.error("Failed to update status");
    }
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      await expensesAPI.create(expenseData);
      toast.success("Expense recorded successfully");
      setShowExpenseModal(false);
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error("Failed to add expense");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      Working: {
        icon: CheckCircle,
        color: "green",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        gradient: "from-green-50 to-green-100",
      },
      Maintenance: {
        icon: Wrench,
        color: "orange",
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        gradient: "from-orange-50 to-orange-100",
      },
      Broken: {
        icon: AlertTriangle,
        color: "red",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        gradient: "from-red-50 to-red-100",
      },
      Borrowed: {
        icon: Package,
        color: "blue",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        gradient: "from-blue-50 to-blue-100",
      },
    };
    return configs[status] || configs["Working"];
  };

  const getTypeIcon = (type) => {
    const icons = {
      Tractor: <Tractor className="w-4 h-4" />,
      Harvester: <Package className="w-4 h-4" />,
      Plow: <TrendingUp className="w-4 h-4" />,
      Irrigation: <Package className="w-4 h-4" />,
      Vehicle: <Tractor className="w-4 h-4" />,
    };
    return icons[type] || <Wrench className="w-4 h-4" />;
  };

  const stats = {
    total: equipment.length,
    totalValue: equipment.reduce((sum, e) => sum + e.price * e.quantity, 0),
    working: equipment
      .filter((e) => e.status === "Working")
      .reduce((sum, e) => sum + e.quantity, 0),
    maintenance: equipment.filter((e) => e.status === "Maintenance").length,
    broken: equipment.filter((e) => e.status === "Broken").length,
    borrowed: equipment.filter((e) => e.status === "Borrowed").length,
    utilizationRate:
      equipment.length > 0
        ? Math.round(
            (equipment
              .filter((e) => e.status === "Working")
              .reduce((sum, e) => sum + e.quantity, 0) /
              equipment.reduce((sum, e) => sum + e.quantity, 0)) *
              100,
          )
        : 0,
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-y-12 translate-x-12 group-hover:translate-x-8 transition-transform duration-500`}
      />
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-earth-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-earth-800">{value}</p>
            {subtitle && (
              <p className="text-xs text-earth-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}
          >
            <Icon
              className={`w-5 h-5 ${color.replace("from-", "text-").split(" ")[0]}`}
            />
          </div>
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
          <h2 className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-farm-700 to-farm-600 bg-clip-text text-transparent">
            Equipment & Machinery
          </h2>
          <p className="text-earth-500 text-sm mt-1">
            Manage your farm equipment, tractors, tools, and maintenance
            schedules
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowExpenseModal(true)}
            className="border-farm-200 text-farm-700 hover:bg-farm-50"
          >
            {" "}
            <TrendingUp className="w-4 h-4 mr-2" /> Add Expense{" "}
          </Button>
          <Button
            onClick={() => setShowAddEquipmentModal(true)}
            className="bg-gradient-to-r from-farm-600 to-farm-700 hover:from-farm-700 hover:to-farm-800 text-white shadow-md"
          >
            {" "}
            <Plus className="w-4 h-4 mr-2" /> Add Equipment{" "}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Equipment"
          value={stats.total}
          icon={Tractor}
          color="from-blue-500 to-blue-600"
          subtitle={`${stats.totalValue.toLocaleString()} total value`}
        />
        <StatCard
          title="Utilization Rate"
          value={`${stats.utilizationRate}%`}
          icon={TrendingUp}
          color="from-green-500 to-green-600"
          subtitle={`${stats.working} units active`}
        />
        <StatCard
          title="Under Maintenance"
          value={stats.maintenance}
          icon={Wrench}
          color="from-orange-500 to-orange-600"
          subtitle="Need attention"
        />
        <StatCard
          title="Issues & Borrowed"
          value={stats.broken + stats.borrowed}
          icon={AlertTriangle}
          color="from-red-500 to-red-600"
          subtitle={`${stats.broken} broken, ${stats.borrowed} borrowed`}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700">Working</p>
                <p className="text-xl font-bold text-green-800">
                  {stats.working}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-700">Maintenance</p>
                <p className="text-xl font-bold text-orange-800">
                  {stats.maintenance}
                </p>
              </div>
              <Wrench className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-700">Broken</p>
                <p className="text-xl font-bold text-red-800">{stats.broken}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700">Borrowed</p>
                <p className="text-xl font-bold text-blue-800">
                  {stats.borrowed}
                </p>
              </div>
              <Package className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-farm-50 to-farm-100 border-b-2 border-farm-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Equipment
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Model
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-farm-700">
                  Qty
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Purchase Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-farm-700">
                  Price
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-farm-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {equipment.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                const StatusIcon = statusConfig.icon;
                const totalValue = item.price * item.quantity;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-farm-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-br ${statusConfig.gradient}`}
                        >
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-earth-800">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-xs text-earth-400 mt-0.5">
                              {item.description.slice(0, 40)}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-earth-600">{item.type}</span>
                    </td>
                    <td className="px-6 py-4 text-earth-600">
                      {item.model || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateEquipmentStatus(item.id, e.target.value)
                        }
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} focus:outline-none cursor-pointer`}
                      >
                        <option value="Working">✅ Working</option>
                        <option value="Maintenance">🔧 Maintenance</option>
                        <option value="Broken">⚠️ Broken</option>
                        <option value="Borrowed">📦 Borrowed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-farm-100 rounded-full text-farm-700 font-semibold">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-earth-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-earth-400" />
                        <span>
                          {dayjs(item.purchase_date).format("DD MMM YYYY")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div>
                        <p className="font-semibold text-earth-800">
                          ${item.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-earth-400">
                          Total: ${totalValue.toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteEquipment(item.id)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {equipment.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-earth-400"
                  >
                    <Tractor className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>
                      No equipment added yet. Click "Add Equipment" to get
                      started!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showAddEquipmentModal && (
        <AddEquipmentModal
          onClose={() => setShowAddEquipmentModal(false)}
          onSave={onSave}
        />
      )}
      {showExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};
