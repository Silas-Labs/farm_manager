// Project: Farm Manager | Module: AddCropModal.jsx
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

export const AddCropModal = ({ onSave, onClose }) => {
  const [crop, setCrop] = useState("");
  const [brand, setBrand] = useState("");
  const [variety, setVariety] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(dayjs(new Date()).format("DD/MM/YYYY"));
  const [errors, setErrors] = useState({});

  //validate fields
  const validate = () => {
    const newErrors = {};
    if (!crop) newErrors.crop = true;
    if (!brand) newErrors.brand = true;
    if (!variety) newErrors.variety = true;
    if (!duration) newErrors.duration = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputClass = (hasError) =>
    `min-h-13 border rounded p-2 ${hasError ? "border-red-500" : "border-gray-300"}`;

  //save
  const handleSave = () => {
    if (!validate()) {
      toast.error("Highlighted fields are required");
      return;
    }

    onSave({
      crop: crop,
      brand: brand,
      variety: variety,
      duration: duration,
      date: date,
    });

    onClose();
  };
  return (
    <form
      className="fixed inset-0 flex justify-center items-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <Card
        className="w-full 
    max-w-lg 
    sm:max-w-xl 
    md:max-w-2xl
    max-h-[90vh]
    overflow-y-auto
    p-4
    rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardTitle>Plant Crop</CardTitle>
        <CardDescription>
          <div className="h-full flex flex-col gap-4">
            <Input
              className={inputClass(errors.crop)}
              placeholder="Crop e.g maize"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            />
            <Input
              className={inputClass(errors.brand)}
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <Input
              className={inputClass(errors.variety)}
              placeholder="Variety"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
            />
            <Input
              className={inputClass(errors.duration)}
              placeholder="Duration in months"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select date"
                slotProps={{
                  textField: { fullWidth: true },
                }}
                value={dayjs(date)}
                onChange={(newValue) => setDate(newValue)}
              />
            </LocalizationProvider>
          </div>
        </CardDescription>
        <CardFooter className="mt-auto bg-transparent flex justify-center gap-5">
          <Button
            className="min-h-12 min-w-18"
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            Save
          </Button>
          <Button
            className="min-h-12 min-w-18"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
