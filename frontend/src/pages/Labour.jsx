import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddLaborModal } from "../components/AddLaborModal";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { PayrollModal } from "../components/PayrollModal";
import {
  Users,
  UserPlus,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  User,
  Briefcase,
  Award,
  FileText,
  Download,
  PieChart,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export const Labour = () => {
  const [showLaborModal, setShowLaborModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [labor, setLabor] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Load data from localStorage
  useEffect(() => {
    loadLabor();
    loadPayrollRecords();
  }, []);

  const loadLabor = () => {
    const stored = JSON.parse(localStorage.getItem("labor") || "[]");
    setLabor(stored);
  };

  const loadPayrollRecords = () => {
    const stored = JSON.parse(localStorage.getItem("payroll") || "[]");
    setPayrollRecords(stored);
  };

  useEffect(() => {
    localStorage.setItem("labor", JSON.stringify(labor));
  }, [labor]);

  useEffect(() => {
    localStorage.setItem("payroll", JSON.stringify(payrollRecords));
  }, [payrollRecords]);

  const handleSave = (props) => {
    const newLabor = {
      id: Date.now(),
      name: props.name,
      doB: props.doB,
      phone: props.phone,
      location: props.location,
      home: props.home,
      kin: props.kin,
      kinPhone: props.kinPhone,
      role: props.role,
      status: props.status,
      startDate: new Date().toISOString(),
      hourlyRate: props.hourlyRate || 0,
      monthlySalary: props.monthlySalary || 0,
      skills: props.skills || [],
      emergencyContact: props.emergencyContact || props.phone,
      avatar: null,
      totalHoursWorked: 0,
      totalEarned: 0,
      attendance: {},
    };
    setLabor([...labor, newLabor]);
    toast.success(`${props.name} added to workforce!`);
  };

  const deleteWorker = (id) => {
    if (window.confirm("Are you sure you want to remove this worker?")) {
      setLabor(labor.filter((worker) => worker.id !== id));
      toast.success("Worker removed successfully");
    }
  };

  const updateWorkerStatus = (id, newStatus) => {
    const updated = labor.map((worker) =>
      worker.id === id ? { ...worker, status: newStatus } : worker,
    );
    setLabor(updated);
    toast.success(`Status updated to ${newStatus}`);
  };

  const recordAttendance = (workerId, date, status) => {
    const updated = labor.map((worker) => {
      if (worker.id === workerId) {
        const attendance = { ...worker.attendance, [date]: status };
        return { ...worker, attendance };
      }
      return worker;
    });
    setLabor(updated);
    toast.success(
      `Attendance recorded for ${new Date(date).toLocaleDateString()}`,
    );
  };

  const addPayrollRecord = (record) => {
    const newRecord = {
      id: Date.now(),
      ...record,
      createdAt: new Date().toISOString(),
    };
    setPayrollRecords([...payrollRecords, newRecord]);

    // Update worker's total earned
    const updated = labor.map((worker) => {
      if (worker.id === record.workerId) {
        return {
          ...worker,
          totalEarned: (worker.totalEarned || 0) + record.amount,
        };
      }
      return worker;
    });
    setLabor(updated);
    toast.success(`Payroll processed: $${record.amount}`);
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
      "Irrigation Specialist": <Activity className="w-4 h-4" />,
      "Equipment Operator": <Users className="w-4 h-4" />,
      "General Labor": <User className="w-4 h-4" />,
    };
    return icons[role] || <User className="w-4 h-4" />;
  };

  // Filter workers
  const filteredWorkers = labor.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (worker.phone && worker.phone.includes(searchTerm));
    const matchesStatus =
      statusFilter === "all" || worker.status === statusFilter;
    const matchesRole = roleFilter === "all" || worker.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Get unique roles for filter
  const uniqueRoles = ["all", ...new Set(labor.map((worker) => worker.role))];

  // Calculate stats
  const stats = {
    total: labor.length,
    active: labor.filter((w) => w.status === "Active").length,
    onLeave: labor.filter((w) => w.status === "On Leave").length,
    inactive: labor.filter((w) => w.status === "Inactive").length,
    totalPayroll: payrollRecords.reduce((sum, p) => sum + p.amount, 0),
    avgHourlyRate:
      labor.reduce((sum, w) => sum + (w.hourlyRate || 0), 0) /
      (labor.length || 1),
    thisMonthPayroll: payrollRecords
      .filter((p) => dayjs(p.date).month() === dayjs().month())
      .reduce((sum, p) => sum + p.amount, 0),
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

  const exportWorkforceData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      workforce: labor,
      payroll: payrollRecords,
      summary: stats,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workforce-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Workforce data exported!");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-farm-700 to-farm-600 bg-clip-text">
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
            onClick={exportWorkforceData}
            className="border-farm-200 text-farm-700 hover:bg-farm-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
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

      {/* Stats Grid */}
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
          title="Monthly Payroll"
          value={`$${stats.thisMonthPayroll.toLocaleString()}`}
          icon={DollarSign}
          color="from-purple-500 to-purple-600"
          subtitle="Current month"
        />
      </div>

      {/* Workforce Overview Cards */}
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
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Total Payroll</p>
                <p className="text-2xl font-bold text-purple-800">
                  ${stats.totalPayroll.toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 mt-1">All time</p>
              </div>
              <PieChart className="w-8 h-8 text-purple-500 opacity-50" />
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

      {/* Workers Table */}
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
                <th className="px-6 py-4 text-right text-sm font-semibold text-farm-700">
                  Earned
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-farm-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWorkers.map((worker, idx) => {
                const statusConfig = getStatusConfig(worker.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <tr
                    key={worker.id}
                    className="hover:bg-farm-50/50 transition-colors group animate-fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
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
                          <p className="text-xs text-earth-400">
                            ID: {worker.id}
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
                      <div className="flex items-center gap-2">
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
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-earth-800">
                        ${(worker.hourlyRate || 0).toFixed(2)}/hr
                      </p>
                      {worker.monthlySalary > 0 && (
                        <p className="text-xs text-earth-400">
                          or ${worker.monthlySalary}/mo
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-farm-700">
                        ${(worker.totalEarned || 0).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedWorker(worker);
                            setShowDetailsModal(true);
                          }}
                          className="text-farm-600 hover:bg-farm-100"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
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
                    colSpan="7"
                    className="px-6 py-12 text-center text-earth-400"
                  >
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    {searchTerm ||
                    statusFilter !== "all" ||
                    roleFilter !== "all" ? (
                      <p>
                        No workers match your filters. Try adjusting your
                        search.
                      </p>
                    ) : (
                      <p>
                        No workers added yet. Click "Add Worker" to build your
                        team!
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Worker Details Modal */}
      {showDetailsModal && selectedWorker && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDetailsModal(false)}
        >
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-farm-400 to-farm-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {selectedWorker.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-earth-800">
                      {selectedWorker.name}
                    </h3>
                    <p className="text-sm text-farm-600">
                      {selectedWorker.role}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-earth-400"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-sm font-semibold text-earth-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Date of Birth</p>
                    <p className="font-medium text-earth-800 mt-1">
                      {dayjs(selectedWorker.doB).format("DD MMM YYYY")}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Phone</p>
                    <p className="font-medium text-earth-800 mt-1">
                      {selectedWorker.phone}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Location</p>
                    <p className="font-medium text-earth-800 mt-1">
                      {selectedWorker.location}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Home Address</p>
                    <p className="font-medium text-earth-800 mt-1">
                      {selectedWorker.home}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="text-sm font-semibold text-earth-700 mb-3">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Next of Kin</p>
                    <p className="font-medium text-earth-800 mt-1">
                      {selectedWorker.kin}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Contact Phone</p>
                    <p className="font-medium text-earth-800 mt-1">
                      {selectedWorker.kinPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h4 className="text-sm font-semibold text-earth-700 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Employment Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Start Date</p>
                    <p className="font-medium text-earth-800 mt-1">
                      {dayjs(selectedWorker.startDate).format("DD MMM YYYY")}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Hourly Rate</p>
                    <p className="font-medium text-earth-800 mt-1">
                      ${(selectedWorker.hourlyRate || 0).toFixed(2)}/hr
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Total Earned</p>
                    <p className="font-medium text-farm-700 mt-1">
                      ${(selectedWorker.totalEarned || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-earth-500">Status</p>
                    <p className="font-medium text-earth-800 mt-1">
                      {selectedWorker.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payroll History */}
              <div>
                <h4 className="text-sm font-semibold text-earth-700 mb-3">
                  Payroll History
                </h4>
                {payrollRecords.filter((p) => p.workerId === selectedWorker.id)
                  .length > 0 ? (
                  <div className="space-y-2">
                    {payrollRecords
                      .filter((p) => p.workerId === selectedWorker.id)
                      .map((record, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-earth-700">
                              {record.type}
                            </p>
                            <p className="text-xs text-earth-400">
                              {dayjs(record.date).format("DD MMM YYYY")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-farm-700">
                              ${record.amount.toLocaleString()}
                            </p>
                            {record.hours && (
                              <p className="text-xs text-earth-400">
                                {record.hours} hours
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-earth-400 text-center py-4">
                    No payroll records yet
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
                  setShowPayrollModal(true);
                }}
              >
                Process Payroll
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modals */}
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
          onSave={addPayrollRecord}
        />
      )}
    </div>
  );
};
