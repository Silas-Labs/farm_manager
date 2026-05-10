// Project: Farm Manager | Module: UpdateStageModal.jsx
import React, { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const UpdateStageModal = ({ crop, onClose, onSave }) => {
  const [selectedStage, setSelectedStage] = useState(crop.stage);

  const stages = [
    { value: "Planted", label: "🌱 Planted", color: "blue" },
    { value: "Growing", label: "🌿 Growing", color: "yellow" },
    { value: "Ready to Harvest", label: "🌾 Ready to Harvest", color: "green" },
  ];

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 bg-black/30"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md p-4 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardTitle>Update Crop Stage</CardTitle>
        <CardDescription>
          {crop.name} - Current stage: {crop.stage}
        </CardDescription>

        <div className="flex flex-col gap-3 my-4">
          {stages.map((stage) => (
            <button
              key={stage.value}
              className={`p-3 border rounded-lg text-left transition-all ${
                selectedStage === stage.value
                  ? `border-${stage.color}-500 bg-${stage.color}-50`
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedStage(stage.value)}
            >
              <span className="font-medium">{stage.label}</span>
            </button>
          ))}
        </div>

        <CardFooter className="flex justify-center gap-5">
          <Button onClick={() => onSave(selectedStage)}>Update Stage</Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
