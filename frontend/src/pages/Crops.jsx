// Project: Farm Manager | Module: Crops.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddCropModal } from "../components/AddCropModal";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { HarvestModal } from "../components/HarvestModal";
import { UpdateStageModal } from "../components/UpdateStageModal";
import { Plus, DollarSign, Sprout, Calendar, Clock, TrendingUp } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "sonner";

export const Crops = () => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [crops, setCrops] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedCrops = JSON.parse(localStorage.getItem("crops") || "[]");
    setCrops(storedCrops);
  }, []);

  useEffect(() => {
    localStorage.setItem("crops", JSON.stringify(crops));
  }, [crops]);

  const onSaveCrop = (props) => {
    const crop = {
      id: Date.now(),
      name: props.crop,
      brand: props.brand,
      variety: props.variety,
      duration: parseInt(props.duration),
      date: props.date,
      stage: "Planted",
      plantedDate: props.date,
      expectedHarvestDate: dayjs(props.date)
        .add(parseInt(props.duration), "month")
        .format("YYYY-MM-DD"),
    };
    setCrops([...crops, crop]);
    toast.success(`${props.crop} planted successfully!`);
  };

  const updateCropStage = (cropId, newStage) => {
    const updatedCrops = crops.map((crop) =>
      crop.id === cropId ? { ...crop, stage: newStage } : crop,
    );
    setCrops(updatedCrops);
    toast.success(`Crop stage updated to ${newStage}`);
  };

  const handleHarvest = (harvestData) => {
    const newHarvest = {
      id: Date.now(),
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      yield: harvestData.yield,
      unit: harvestData.unit,
      revenue: harvestData.revenue,
      date: harvestData.date,
      notes: harvestData.notes,
    };

    const existingHarvests = JSON.parse(
      localStorage.getItem("harvests") || "[]",
    );
    localStorage.setItem(
      "harvests",
      JSON.stringify([...existingHarvests, newHarvest]),
    );
    updateCropStage(selectedCrop.id, "Harvested");
    setShowHarvestModal(false);
    toast.success(`🌾 Harvest recorded! Revenue: $${harvestData.revenue}`);
  };

  const getStageConfig = (stage) => {
    const configs = {
      Planted: {
        color: "blue",
        icon: "🌱",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      Growing: {
        color: "yellow",
        icon: "🌿",
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
      "Ready to Harvest": {
        color: "green",
        icon: "🌾",
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      },
      Harvested: {
        color: "gray",
        icon: "✅",
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      },
    };
    return configs[stage] || configs["Planted"];
  };

  const stats = {
    total: crops.length,
    planted: crops.filter((c) => c.stage === "Planted").length,
    growing: crops.filter((c) => c.stage === "Growing").length,
    ready: crops.filter((c) => c.stage === "Ready to Harvest").length,
  };

  // Reusable Stat Card component matching Dashboard style
  const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div
        className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -translate-y-12 translate-x-12 group-hover:translate-x-8 transition-transform duration-500`}
      />
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-earth-500 mb-1">
              {title}
            </p>
            <p className={`text-xl sm:text-3xl font-bold ${color}`}>
              {value}
            </p>
          </div>
          <div className={`p-2 sm:p-3 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-10 flex-shrink-0`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace("text", "text")}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-earth-800">
          Crop Management
        </h2>
        <p className="text-earth-500 text-sm mt-1">
          Track and manage all your crops from planting to harvest
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <Button
          variant="outline"
          onClick={() => setShowExpenseModal(true)}
          className="border-farm-200 text-farm-700 hover:bg-farm-50 w-full sm:w-auto"
          size={isMobile ? "sm" : "default"}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
        <Button
          onClick={() => setShowCropModal(true)}
          className="bg-gradient-to-r from-farm-600 to-farm-700 hover:from-farm-700 hover:to-farm-800 text-white shadow-md w-full sm:w-auto"
          size={isMobile ? "sm" : "default"}
        >
          <Plus className="w-4 h-4 mr-2" />
          Plant New Crop
        </Button>
      </div>

      {/* Stats Cards - Matching Dashboard style */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Total Crops"
          value={stats.total}
          icon={Sprout}
          color="text-farm-600"
          gradient="from-farm-500 to-farm-600"
        />
        <StatCard
          title="Planted"
          value={stats.planted}
          icon={Calendar}
          color="text-blue-600"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Growing"
          value={stats.growing}
          icon={Clock}
          color="text-yellow-600"
          gradient="from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Ready to Harvest"
          value={stats.ready}
          icon={TrendingUp}
          color="text-green-600"
          gradient="from-green-500 to-green-600"
        />
      </div>

      {/* Crops Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gradient-to-r from-farm-50 to-farm-100 border-b border-farm-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-farm-700">
                  Crop
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-farm-700">
                  Variety
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-farm-700 hidden sm:table-cell">
                  Plant Date
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-farm-700 hidden md:table-cell">
                  Duration
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-farm-700">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-farm-700 hidden lg:table-cell">
                  Harvest ETA
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-farm-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {crops.map((crop) => {
                const stageConfig = getStageConfig(crop.stage);
                return (
                  <tr
                    key={crop.id}
                    className="hover:bg-farm-50/50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-xl">
                          {stageConfig.icon}
                        </span>
                        <span className="font-medium text-earth-800 text-sm sm:text-base">
                          {crop.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-earth-600 text-sm">
                      {crop.variety}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-earth-600 text-sm hidden sm:table-cell">
                      {dayjs(crop.date).format("DD MMM YYYY")}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-earth-600 text-sm hidden md:table-cell">
                      {crop.duration} months
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border ${stageConfig.bg} ${stageConfig.text} ${stageConfig.border}`}
                      >
                        {stageConfig.icon} {crop.stage}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-earth-600 text-sm hidden lg:table-cell">
                      {crop.stage === "Harvested"
                        ? "Harvested"
                        : `${crop.duration} months`}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-1 sm:gap-2 justify-center">
                        {crop.stage !== "Harvested" &&
                          crop.stage !== "Ready to Harvest" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCrop(crop);
                                setShowStageModal(true);
                              }}
                              className="text-farm-600 border-farm-200 hover:bg-farm-50 text-xs sm:text-sm px-2 sm:px-3"
                            >
                              Update
                            </Button>
                          )}
                        {crop.stage !== "Harvested" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedCrop(crop);
                              setShowHarvestModal(true);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3"
                          >
                            Harvest
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {crops.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-3 sm:px-6 py-8 sm:py-12 text-center text-earth-400"
                  >
                    <Sprout className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      No crops planted yet. Click "Plant New Crop" to get started!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      {showCropModal && (
        <AddCropModal
          onClose={() => setShowCropModal(false)}
          onSave={onSaveCrop}
        />
      )}
      {showExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSave={() => {}}
        />
      )}
      {showHarvestModal && selectedCrop && (
        <HarvestModal
          crop={selectedCrop}
          onClose={() => setShowHarvestModal(false)}
          onSave={handleHarvest}
        />
      )}
      {showStageModal && selectedCrop && (
        <UpdateStageModal
          crop={selectedCrop}
          onClose={() => setShowStageModal(false)}
          onSave={(newStage) => {
            updateCropStage(selectedCrop.id, newStage);
            setShowStageModal(false);
          }}
        />
      )}
    </div>
  );
};
// EOF: Crops.jsx
