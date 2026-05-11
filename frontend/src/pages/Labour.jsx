import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddLaborModal } from "../components/AddLaborModal";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { PayrollModal } from "../components/PayrollModal";
import { laborAPI, expensesAPI } from "../services/api";
import {
  Users,
  UserPlus,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  User,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export const Labour = () => {
  const [showLaborModal, setShowLaborModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [labor, setLabor] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLabor();
  }, []);

  const loadLabor = async () => {
    setLoading(true);
    try {
      const response = await laborAPI.getAll();
      setLabor(response.data || []);
    } catch (error) {
      console.error("Error loading labor:", error);
      toast.error("Failed to load labor data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (props) => {
    try {
      const response = await laborAPI.create({
        name: props.name,
        role: props.role,
        phone: props.phone,
        location: props.location,
        status: props.status,
        hourly_rate: props.hourlyRate || 0,
        monthly_salary: props.monthlySalary || 0,
        start_date: props.startDate || new Date().toISOString(),
      });

      setLabor([...labor, response.data.data]);
      toast.success(`${props.name} added to workforce!`);
      loadLabor();
    } catch (error) {
      console.error("Error creating labor:", error);
      toast.error("Failed to add worker");
    }
  };

  const deleteWorker = async (id) => {
    if (window.confirm("Are you sure you want to remove this worker?")) {
      try {
        await laborAPI.delete(id);
        setLabor(labor.filter((worker) => worker.id !== id));
        toast.success("Worker removed successfully");
      } catch (error) {
        console.error("Error deleting worker:", error);
        toast.error("Failed to delete worker");
      }
    }
  };

  const updateWorkerStatus = async (id, newStatus) => {
    const worker = labor.find((w) => w.id === id);
    if (!worker) return;

    try {
      await laborAPI.update(id, {
        name: worker.name,
        role: worker.role,
        phone: worker.phone,
        location: worker.location,
        status: newStatus,
        hourly_rate: worker.hourly_rate,
        monthly_salary: worker.monthly_salary,
        start_date: worker.start_date,
      });

      setLabor(
        labor.map((worker) =>
          worker.id === id ? { ...worker, status: newStatus } : worker,
        ),
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating worker:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      Active: {
        icon: CheckCircle,
        color: "green",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      },
      "On Leave": {
        icon: Clock,
        color: "yellow",
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
      Inactive: {
        icon: XCircle,
        color: "red",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      },
      Suspended: {
        icon: AlertCircle,
        color: "orange",
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
      },
    };
    return configs[status] || configs["Active"];
  };

  const getRoleIcon = (role) => {
    const icons = {
      "Farm Manager": <Briefcase className="w-4 h-4" />,
      Harvester: <Users className="w-4 h-4" />,
      "Irrigation Specialist": <Clock className="w-4 h-4" />,
      "Equipment Operator": <Users className="w-4 h-4" />,
      "General Labor": <User className="w-4 h-4" />,
    };
    return icons[role] || <User className="w-4 h-4" />;
  };

  const filteredWorkers = labor.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (worker.role &&
        worker.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (worker.phone && worker.phone.includes(searchTerm));
    const matchesStatus =
      statusFilter === "all" || worker.status === statusFilter;
    const matchesRole = roleFilter === "all" || worker.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const uniqueRoles = ["all", ...new Set(labor.map((worker) => worker.role))];
  const stats = {
    total: labor.length,
    active: labor.filter((w) => w.status === "Active").length,
    onLeave: labor.filter((w) => w.status === "On Leave").length,
    inactive: labor.filter((w) => w.status === "Inactive").length,
    totalPayroll: 0,
    avgHourlyRate:
      labor.reduce((sum, w) => sum + (w.hourly_rate || 0), 0) /
      (labor.length || 1),
    thisMonthPayroll: 0,
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
            Labor Management
          </h2>
          <p className="text-earth-500 text-sm mt-1">
            Manage your workforce, track attendance, process payroll, and
            monitor labor costs
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setShowExpenseModal(true)}
            className="border-farm-200 text-farm-700 hover:bg-farm-50"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button
            onClick={() => setShowLaborModal(true)}
            className="bg-gradient-to-r from-farm-600 to-farm-700 hover:from-farm-700 hover:to-farm-800 text-white shadow-md"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Worker
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Workforce"
          value={stats.total}
          icon={Users}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Workers"
          value={stats.active}
          icon={CheckCircle}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          icon={Clock}
          color="from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Avg Hourly Rate"
          value={`$${stats.avgHourlyRate.toFixed(2)}`}
          icon={DollarSign}
          color="from-purple-500 to-purple-600"
          subtitle="Current month"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Active Workforce</p>
                <p className="text-2xl font-bold text-green-800">
                  {stats.active}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {((stats.active / stats.total) * 100).toFixed(0)}% of total
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Avg Hourly Rate</p>
                <p className="text-2xl font-bold text-orange-800">
                  ${stats.avgHourlyRate.toFixed(2)}
                </p>
                <p className="text-xs text-orange-600 mt-1">Competitive rate</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              type="text"
              placeholder="Search workers by name, role, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white"
            >
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role === "all" ? "All Roles" : role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-farm-50 to-farm-100 border-b-2 border-farm-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Worker
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-farm-700">
                  Rate
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-farm-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWorkers.map((worker) => {
                const statusConfig = getStatusConfig(worker.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <tr
                    key={worker.id}
                    className="hover:bg-farm-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-farm-400 to-farm-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {worker.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-earth-800">
                            {worker.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(worker.role)}
                        <span className="text-earth-600">{worker.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-earth-600">
                          <Phone className="w-3 h-3" />
                          <span>{worker.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-earth-400">
                          <MapPin className="w-3 h-3" />
                          <span>{worker.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={worker.status}
                        onChange={(e) =>
                          updateWorkerStatus(worker.id, e.target.value)
                        }
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} focus:outline-none cursor-pointer`}
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-earth-800">
                        ${(worker.hourly_rate || 0).toFixed(2)}/hr
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedWorker(worker);
                            setShowPayrollModal(true);
                          }}
                          className="text-green-600 hover:bg-green-50"
                          title="Process Payroll"
                        >
                          <DollarSign className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteWorker(worker.id)}
                          className="text-red-500 hover:bg-red-50"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredWorkers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-earth-400"
                  >
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>
                      No workers added yet. Click "Add Worker" to build your
                      team!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showLaborModal && (
        <AddLaborModal
          onClose={() => setShowLaborModal(false)}
          onSave={handleSave}
        />
      )}
      {showExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSave={() => {}}
        />
      )}
      {showPayrollModal && selectedWorker && (
        <PayrollModal
          worker={selectedWorker}
          onClose={() => {
            setShowPayrollModal(false);
            setSelectedWorker(null);
          }}
          onSave={() => {
            toast.success("Payroll recorded");
            loadLabor();
          }}
        />
      )}
    </div>
  );
};
