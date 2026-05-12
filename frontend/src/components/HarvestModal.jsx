// Project: Farm Manager | Module: HarvestModal.jsx
import React, { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "sonner";

export const HarvestModal = ({ crop, crops = [], onClose, onSave }) => {
  const [selectedCropId, setSelectedCropId] = useState(crop?.id || "");
  const [yieldAmount, setYieldAmount] = useState("");
  const [unit, setUnit] = useState("kg");
  const [revenue, setRevenue] = useState("");
  const [date, setDate] = useState(dayjs());
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const inputClass = (hasError) =>
    `min-h-13 border rounded p-2 ${hasError ? "border-red-500" : "border-gray-300"}`;

  const validate = () => {
    const newErrors = {};
    if (!selectedCropId && !crop) newErrors.crop = true;
    if (!yieldAmount || parseFloat(yieldAmount) <= 0) newErrors.yield = true;
    if (!revenue || parseFloat(revenue) <= 0) newErrors.revenue = true;
    if (!date) newErrors.date = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    const currentCrop = crop || crops.find(c => c.id === parseInt(selectedCropId));

    onSave({
      cropId: currentCrop?.id,
      cropName: currentCrop?.name,
      yield: parseFloat(yieldAmount),
      unit: unit,
      revenue: parseFloat(revenue),
      date: date,
      notes: notes
    });
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-3 sm:p-4 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardTitle>Harvest {crop ? crop.name : "Crop"}</CardTitle>
        <CardDescription>
          Record the harvest details {crop ? `for ${crop.name}` : ""}
        </CardDescription>
        
        <form onSubmit={handleSave} className="h-full flex flex-col gap-4 mt-4">
          {!crop && crops.length > 0 && (
            <div>
              <label className="text-sm font-medium">Select Crop</label>
              <select
                className={inputClass(errors.crop)}
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
              >
                <option value="">Select a crop</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.variety})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Yield Amount</label>
            <div className="flex gap-2">
              <Input
                className={inputClass(errors.yield)}
                placeholder="e.g., 500"
                type="number"
                value={yieldAmount}
                onChange={(e) => setYieldAmount(e.target.value)}
              />
              <select
                className="border rounded p-2"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="kg">kg</option>
                <option value="tons">tons</option>
                <option value="bags">bags</option>
                <option value="units">units</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Revenue ($)</label>
            <Input
              className={inputClass(errors.revenue)}
              placeholder="Revenue ($)"
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Harvest Date"
              value={dayjs(date)}
              maxDate={dayjs()}
              onChange={(newDate) => setDate(newDate)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <CardFooter className="mt-6 flex justify-center gap-5 pt-4">
            <Button type="submit">Save Harvest</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
// EOF: HarvestModal.jsx
