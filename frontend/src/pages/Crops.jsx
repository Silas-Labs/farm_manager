import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableDisplay } from "../components/Table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddCropModal } from "../components/AddCropModal";
import { AddExpenseModal } from "../components/AddExpenseModal";

export const Crops = () => {
  const [showCropModal, setshowCropModal] = useState(false);
  const [showExpenseModal, setshowExpenseModal] = useState(false);
  // Example: State to hold crop data
  const [crops, setCrops] = useState([
    {
      id: 1,
      name: "Tomatoes",
      field: "Field A",
      area: "2 acres",
      stage: "Growing",
      health: "Good",
      plantingDate: "2026-03-10",
    },
    {
      id: 2,
      name: "Maize",
      field: "Field B",
      area: "5 acres",
      stage: "Planted",
      health: "Needs Attention",
      plantingDate: "2026-03-15",
    },
  ]);

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {/* Top Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => setshowExpenseModal((prev) => !prev)}
        >
          Add Expense
        </Button>
        <Button
          variant="outline"
          onClick={() => setshowCropModal((prev) => !prev)}
        >
          Add Crop
        </Button>
      </div>

      {/* Crop Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <CardTitle>Total Crops</CardTitle>
          <CardContent>
            <p className="text-2xl font-bold">{crops.length}</p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardTitle>Planted</CardTitle>
          <CardContent>
            <p className="text-2xl font-bold">
              {crops.filter((c) => c.stage === "Planted").length}
            </p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardTitle>Growing</CardTitle>
          <CardContent>
            <p className="text-2xl font-bold">
              {crops.filter((c) => c.stage === "Growing").length}
            </p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardTitle>Ready to Harvest</CardTitle>
          <CardContent>
            <p className="text-2xl font-bold">
              {crops.filter((c) => c.stage === "Ready to Harvest").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {showCropModal && (
        <AddCropModal onClose={() => setshowCropModal(false)} />
      )}
      {showExpenseModal && (
        <AddExpenseModal onClose={() => setshowExpenseModal(false)} />
      )}

      {/* Crop Table */}
      <Card className="p-4">
        <CardTitle>All Crops</CardTitle>
        <CardContent>
          <TableDisplay
            data={crops}
            columns={[
              { header: "Crop Name", accessor: "name" },
              { header: "Field", accessor: "field" },
              { header: "Area", accessor: "area" },
              { header: "Stage", accessor: "stage" },
              { header: "Health", accessor: "health" },
              { header: "Planting Date", accessor: "plantingDate" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};
