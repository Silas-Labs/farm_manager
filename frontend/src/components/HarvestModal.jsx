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

export const HarvestModal = ({ crop, onClose, onSave }) => {
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
    if (!yieldAmount || parseFloat(yieldAmount) <= 0) newErrors.yield = true;
    if (!revenue || parseFloat(revenue) <= 0) newErrors.revenue = true;
    if (!date) newErrors.date = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    onSave({
      yield: parseFloat(yieldAmount),
      unit: unit,
      revenue: parseFloat(revenue),
      date: date,
      notes: notes
    });
  };

  return (
    <form
      className="fixed inset-0 flex justify-center items-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardTitle>Harvest {crop.name}</CardTitle>
        <CardDescription>
          Record the harvest details for {crop.name}
        </CardDescription>
        
        <div className="h-full flex flex-col gap-4 mt-4">
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

          <Input
            className={inputClass(errors.revenue)}
            placeholder="Revenue ($)"
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
          />

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
        </div>

        <CardFooter className="mt-auto flex justify-center gap-5 pt-4">
          <Button onClick={handleSave}>Save Harvest</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </CardFooter>
      </Card>
    </form>
  );
};