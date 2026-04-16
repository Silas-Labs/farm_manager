import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableDisplay } from "../components/Table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddCropModal } from "../components/AddCropModal";
import { AddExpenseModal } from "../components/AddExpenseModal";
import dayjs from "dayjs";

export const Crops = () => {
  const [showCropModal, setshowCropModal] = useState(false);
  const [showExpenseModal, setshowExpenseModal] = useState(false);
  // Example: State to hold crop data
  const [crops, setCrops] = useState([]);

  const onSave = (props) => {
    const crop = {
      name : props.crop,
      brand: props.brand,
      variety: props.variety,
      duration: props.duration,
      date: props.date
    }
    const newCrops = [...crops,crop] 
    setCrops(newCrops)
  };

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
              {/* {crops.filter((c) => c.stage === "Ready to Harvest").length} */}
            </p>
          </CardContent>
        </Card>
      </div>

      {showCropModal && (
        <AddCropModal onClose={() => setshowCropModal(false)} onSave={onSave} />
      )}
      {showExpenseModal && (
        <AddExpenseModal
          onClose={() => setshowExpenseModal(false)}
          onSave={onSave}
        />
      )}

      {/* Crop Table */}
      <div className="overflow-x-auto">
          <table className="table-auto w-full border text-start">
            <thead className="bg-gray-100">
              <tr>
                <th>Crop</th>
                <th>Brand</th>
                <th>Variety</th>
                <th>Plant Date</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((it)=>(
                <tr>
                  <td>{it.name}</td>
                  <td>{it.brand}</td>
                  <td>{it.variety}</td>
                  <td>{`${dayjs(it.date).format("DD/MM/YYYY")}`}</td>
                  <td>{it.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};
