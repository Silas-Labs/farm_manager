// src/pages/Harvests.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { HarvestModal } from "../components/HarvestModal";
import { harvestsAPI, cropsAPI } from "../services/api";
import { dataActions } from "../lib/dataActions";
import {
  Sprout,
  DollarSign,
  Package,
  TrendingUp,
  Calendar,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export const Harvests = () => {
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [harvests, setHarvests] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [harvestsRes, cropsRes] = await Promise.all([
        harvestsAPI.getAll(),
        cropsAPI.getAll(),
      ]);
      setHarvests(harvestsRes.data || []);
      setCrops(cropsRes.data || []);
    } catch (error) {
      console.error("Error loading harvests:", error);
      toast.error("Failed to load harvest data");
    } finally {
      setLoading(false);
    }
  };

  const handleHarvest = async (harvestData) => {
    if (!harvestData.cropId) {
      toast.error("A crop is required to record a harvest");
      return;
    }
    try {
      await dataActions.createHarvest({
        crop_id: harvestData.cropId,
        crop_name: harvestData.cropName,
        yield: harvestData.yield,
        unit: harvestData.unit,
        revenue: harvestData.revenue,
        harvest_date: harvestData.date,
        notes: harvestData.notes,
      });
      toast.success(`Harvest recorded! Revenue: $${harvestData.revenue}`);
      loadData();
      setShowHarvestModal(false);
    } catch (error) {
      console.error("Error recording harvest:", error);
      toast.error("Failed to record harvest");
    }
  };

  const deleteHarvest = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this harvest record?")
    ) {
      try {
        await dataActions.deleteHarvest(id);
        toast.success("Harvest record deleted");
        loadData();
      } catch (error) {
        console.error("Error deleting harvest:", error);
        toast.error("Failed to delete harvest");
      }
    }
  };

  const totalYield = harvests.reduce((sum, h) => sum + (h.yield || 0), 0);
  const totalRevenue = harvests.reduce((sum, h) => sum + (h.revenue || 0), 0);

  const StatCard = ({ title, value, icon: Icon, color, unit }) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-earth-500 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>
              {value}
              {unit && (
                <span className="text-sm text-earth-400 ml-1">{unit}</span>
              )}
            </p>
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
            Harvest Records
          </h2>
          <p className="text-earth-500 text-sm mt-1">
            Track all your harvests, yields, and revenue
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCrop(null);
            setShowHarvestModal(true);
          }}
          className="bg-gradient-to-r from-farm-600 to-farm-700 hover:from-farm-700 hover:to-farm-800 text-white shadow-md"
        >
          <Package className="w-4 h-4 mr-2" />
          Record Harvest
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Harvests"
          value={harvests.length}
          icon={Package}
          color="text-farm-600"
        />
        <StatCard
          title="Total Yield"
          value={totalYield.toLocaleString()}
          icon={Sprout}
          color="text-green-600"
          unit="kg"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="text-emerald-600"
        />
        <StatCard
          title="Avg Revenue/Harvest"
          value={`$${harvests.length ? (totalRevenue / harvests.length).toFixed(2) : 0}`}
          icon={TrendingUp}
          color="text-purple-600"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-farm-50 to-farm-100 border-b-2 border-farm-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Crop
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Yield
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Revenue
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-farm-700">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-farm-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {harvests.map((harvest) => (
                <tr
                  key={harvest.id}
                  className="hover:bg-farm-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-farm-600" />
                      <span className="font-medium text-earth-800">
                        {harvest.crop_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600">
                      {harvest.yield}
                    </span>{" "}
                    <span className="text-earth-500">{harvest.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-emerald-600">
                      ${harvest.revenue.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-earth-600">
                    {dayjs(harvest.harvest_date).format("DD MMM YYYY")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteHarvest(harvest.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {harvests.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-earth-400"
                  >
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>
                      No harvest records yet. Click "Record Harvest" to get
                      started!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showHarvestModal && (
        <HarvestModal
          crop={selectedCrop}
          crops={crops}
          onClose={() => setShowHarvestModal(false)}
          onSave={handleHarvest}
        />
      )}
    </div>
  );
};
