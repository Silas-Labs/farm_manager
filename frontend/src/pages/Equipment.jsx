// Project: Farm Manager | Module: Equipment.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddEquipmentModal } from "../components/AddEquipmentModal";
import { AddExpenseModal } from "../components/AddExpenseModal";
import {
  Tractor,
  Wrench,
  Package,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Activity,
  Clock,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export const Equipment = () => {
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    loadEquipment();
    loadMaintenanceHistory();
  }, []);

  const loadEquipment = () => {
    const stored = JSON.parse(localStorage.getItem("equipment") || "[]");
    setEquipment(stored);
  };

  const loadMaintenanceHistory = () => {
    const stored = JSON.parse(
      localStorage.getItem("maintenanceHistory") || "[]",
    );
    setMaintenanceHistory(stored);
  };

  // Save equipment to localStorage
  useEffect(() => {
    localStorage.setItem("equipment", JSON.stringify(equipment));
  }, [equipment]);

  const onSave = (props) => {
    const newEq = {
      id: Date.now(),
      name: props.name,
      type: props.type,
      model: props.model,
      description: props.description,
      status: props.status,
      quantity: parseInt(props.quantity),
      date: props.date,
      price: parseFloat(props.price),
      lastMaintenance: null,
      nextMaintenance: null,
      createdAt: new Date().toISOString(),
    };
    setEquipment([...equipment, newEq]);
    toast.success(`${props.name} added successfully!`);
  };

  const deleteEquipment = (id) => {
    if (window.confirm("Are you sure you want to remove this equipment?")) {
      setEquipment(equipment.filter((item) => item.id !== id));
      toast.success("Equipment removed successfully");
    }
  };

  const updateEquipmentStatus = (id, newStatus) => {
    const updated = equipment.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item,
    );
    setEquipment(updated);
    toast.success(`Status updated to ${newStatus}`);
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
      Plow: <Activity className="w-4 h-4" />,
      Irrigation: <RefreshCw className="w-4 h-4" />,
      Vehicle: <Tractor className="w-4 h-4" />,
    };
    return icons[type] || <Wrench className="w-4 h-4" />;
  };

  // Filter equipment
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.model &&
        item.model.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get unique types for filter
  const uniqueTypes = ["all", ...new Set(equipment.map((item) => item.type))];

  // Calculate stats
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-farm-700 to-farm-600 bg-clip-text">
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
            className="bg-gradient-to-r from-farm-600 to-farm-700 hover:from-farm-700 hover:to-farm-800 text-farm-700 shadow-md hover:shadow-lg transition-all"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button
            onClick={() => setShowAddEquipmentModal(true)}
            className="bg-gradient-to-r from-farm-600 to-farm-700 hover:from-farm-700 hover:to-farm-800 text-farm-700 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
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
          icon={Activity}
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

      {/* Status Breakdown Cards */}
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

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              type="text"
              placeholder="Search equipment by name, type, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="Working">Working</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Broken">Broken</option>
              <option value="Borrowed">Borrowed</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white"
            >
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="border-farm-200 text-farm-600 hover:bg-farm-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Equipment Table */}
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
              {filteredEquipment.map((item, idx) => {
                const statusConfig = getStatusConfig(item.status);
                const StatusIcon = statusConfig.icon;
                const totalValue = item.price * item.quantity;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-farm-50/50 transition-colors group animate-fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
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
                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updateEquipmentStatus(item.id, e.target.value)
                          }
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} focus:outline-none focus:ring-2 focus:ring-${statusConfig.color}-500 cursor-pointer`}
                        >
                          <option value="Working">✅ Working</option>
                          <option value="Maintenance">🔧 Maintenance</option>
                          <option value="Broken">⚠️ Broken</option>
                          <option value="Borrowed">📦 Borrowed</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-farm-100 rounded-full text-farm-700 font-semibold">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-earth-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-earth-400" />
                        <span>{dayjs(item.date).format("DD MMM YYYY")}</span>
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
                          onClick={() => {
                            setSelectedEquipment(item);
                            setShowDetailsModal(true);
                          }}
                          className="text-farm-600 hover:bg-farm-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteEquipment(item.id)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredEquipment.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-earth-400"
                  >
                    <Tractor className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    {searchTerm ||
                    statusFilter !== "all" ||
                    typeFilter !== "all" ? (
                      <p>
                        No equipment matches your filters. Try adjusting your
                        search.
                      </p>
                    ) : (
                      <p>
                        No equipment added yet. Click "Add Equipment" to get
                        started!
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Equipment Details Modal */}
      {showDetailsModal && selectedEquipment && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDetailsModal(false)}
        >
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-farm-100 rounded-xl">
                    {getTypeIcon(selectedEquipment.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-earth-800">
                      {selectedEquipment.name}
                    </h3>
                    <p className="text-sm text-earth-500">
                      {selectedEquipment.type} •{" "}
                      {selectedEquipment.model || "No model"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-earth-400 hover:text-earth-600"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-earth-500">Status</p>
                  <p className="font-semibold text-earth-800 mt-1">
                    {selectedEquipment.status}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-earth-500">Quantity</p>
                  <p className="font-semibold text-earth-800 mt-1">
                    {selectedEquipment.quantity} units
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-earth-500">Unit Price</p>
                  <p className="font-semibold text-earth-800 mt-1">
                    ${selectedEquipment.price.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-earth-500">Total Value</p>
                  <p className="font-semibold text-farm-700 mt-1">
                    $
                    {(
                      selectedEquipment.price * selectedEquipment.quantity
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-earth-500">Purchase Date</p>
                  <p className="font-semibold text-earth-800 mt-1">
                    {dayjs(selectedEquipment.date).format("DD MMMM YYYY")}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-earth-500">Added On</p>
                  <p className="font-semibold text-earth-800 mt-1">
                    {dayjs(selectedEquipment.createdAt).format("DD MMM YYYY")}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedEquipment.description && (
                <div>
                  <h4 className="text-sm font-semibold text-earth-700 mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-earth-600 bg-gray-50 p-3 rounded-lg">
                    {selectedEquipment.description}
                  </p>
                </div>
              )}

              {/* Maintenance History */}
              <div>
                <h4 className="text-sm font-semibold text-earth-700 mb-3">
                  Maintenance History
                </h4>
                {maintenanceHistory.filter(
                  (m) => m.equipmentId === selectedEquipment.id,
                ).length > 0 ? (
                  <div className="space-y-2">
                    {maintenanceHistory
                      .filter((m) => m.equipmentId === selectedEquipment.id)
                      .map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-earth-700">
                              {m.type}
                            </p>
                            <p className="text-xs text-earth-400">
                              {dayjs(m.date).format("DD MMM YYYY")}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-earth-800">
                            ${m.cost.toLocaleString()}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-earth-400 text-center py-4">
                    No maintenance records yet
                  </p>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              <Button
                className="bg-farm-600 hover:bg-farm-700 text-white"
                onClick={() => {
                  setShowDetailsModal(false);
                  // Could open maintenance modal here
                }}
              >
                Log Maintenance
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modals */}
      {showAddEquipmentModal && (
        <AddEquipmentModal
          onClose={() => setShowAddEquipmentModal(false)}
          onSave={onSave}
        />
      )}
      {showExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSave={() => {}}
        />
      )}
    </div>
  );
};

// EOF: Equipment.jsx
