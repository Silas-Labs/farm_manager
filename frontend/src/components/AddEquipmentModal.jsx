// Project: Farm Manager | Module: AddEquipmentModal.jsx
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

export const AddEquipmentModal = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(dayjs());
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});

  const inputClass = (hasError) =>
    `min-h-13 border rounded p-2 ${hasError ? "border-red-500" : "border-gray-300"}`;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = true;
    if (!type.trim()) newErrors.type = true;
    if (!model.trim()) newErrors.model = true;
    if (!description.trim()) newErrors.description = true;
    if (!status.trim()) newErrors.status = true;
    if (!quantity || parseInt(quantity) <= 0) newErrors.quantity = true;
    if (!date) newErrors.date = true;
    if (!price || parseFloat(price) <= 0) newErrors.price = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      toast.error("Highlighted fields are required");
      return;
    }

    //save logic
    onSave({
      name: name,
      type: type,
      model: model,
      description: description,
      status: status,
      quantity: parseInt(quantity),
      date: date,
      price: parseFloat(price),
    });

    //close modal
    onClose();
  };
  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-3 sm:p-4 bg-black/20 backdrop-blur-sm"
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
        <CardTitle>Add Equipment</CardTitle>
        <CardDescription>
          Enter the details of the equipment you're adding.
        </CardDescription>
        <form onSubmit={handleSave} className="h-full flex flex-col gap-4 mt-4">
          <Input
            className={inputClass(errors.name)}
            placeholder="Equipment Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className={inputClass(errors.type)}
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <Input
            className={inputClass(errors.model)}
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <Input
            className={inputClass(errors.description)}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            className={inputClass(errors.status)}
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Input
            className={inputClass(errors.quantity)}
            placeholder="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select date"
              slotProps={{
                textField: { fullWidth: true },
              }}
              maxDate={dayjs()}
              value={date}
              onChange={(newDate) => setDate(newDate)}
            />
          </LocalizationProvider>
          <Input
            className={inputClass(errors.price)}
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <CardFooter className="mt-4 bg-transparent flex justify-center gap-5">
            <Button type="submit" className="min-h-12 min-w-18">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-12 min-w-18"
              onClick={onClose}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

// EOF: AddEquipmentModal.jsx
