import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const AddExpenseModal = ({ onClose, onSave }) => {
  // Core fields
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  // Crop-specific fields
  const [cropType, setCropType] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const handleSave = () => {
    onSave({
      title,
      amount: parseFloat(amount),
      date,
      category,
      notes,
      cropType: category === "crop" ? cropType : "equipment" ? "equipment":undefined,
      brand: category === "crop" ? brand : undefined,
      quantity: category === "crop" ? parseFloat(quantity) : undefined,
      unitPrice: category === "crop" ? parseFloat(unitPrice) : undefined,
    });
    onClose();
  };

  return (
    <form
      className="fixed inset-0 flex justify-center items-center z-99 bg-black/30"
      onClick={onClose}
    >
      <Card className="w-1/3 p-4" onClick={(e) => e.stopPropagation()}>
        <CardTitle>Add Expense</CardTitle>
        <CardDescription>
          <div className="h-full flex flex-col gap-4">
            {/* Core fields */}
            <Input
              className="min-h-13"
              placeholder="Title / Description"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              className="min-h-13"
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <select
              className="border rounded p-2 min-h-13"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="crop">Crop</option>
              <option value="equipment">Equipment</option>
              <option value="labor">Labor</option>
              <option value="other">Other</option>
            </select>
            <Input
              className="min-h-13"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {/* Crop-specific fields */}
            {category === "crop" && (
              <div className="flex flex-col gap-4 mt-2 border-t pt-2">
                <select
                  className="border rounded p-2 min-h-13"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                >
                  <option value="">Select Crop Expense Type</option>
                  <option value="seeds">Seeds</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="pesticide">Pesticide</option>
                  <option value="other">Other</option>
                </select>
                <Input
                  className="min-h-13"
                  placeholder="Brand / Supplier"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
                <Input
                  className="min-h-13"
                  placeholder="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Input
                  className="min-h-13"
                  placeholder="Unit Price"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                />
              </div>
            )}

            {/* Equipment Specific fields*/}
            {category === "equipment" && (
              <div className="flex flex-col gap-4 mt-2 border-t pt-2">
                <select
                  className="border rounded p-2 min-h-13"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                >
                  <option value="">Select Equipment Expense Type</option>
                  <option value="purchase">Purchase</option>
                  <option value="hire">Hire</option>
                  <option value="repair">Repair/Service</option>
                </select>
                <Input
                  className="min-h-13"
                  placeholder="Brand / Supplier"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
                <Input
                  className="min-h-13"
                  placeholder="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Input
                  className="min-h-13"
                  placeholder="Unit Price"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                />
              </div>
            )}
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
