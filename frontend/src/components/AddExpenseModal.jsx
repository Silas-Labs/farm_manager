// Project: Farm Manager | Module: AddExpenseModal.jsx
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
import { toast, Toaster } from "sonner";
import dayjs from "dayjs";

export const AddExpenseModal = ({ onClose, onSave }) => {
  // Core fields
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  // Category-specific fields
  const [expenseType, setExpenseType] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  // Validation state
  const [errors, setErrors] = useState({});

  const inputClass = (hasError) =>
    `min-h-13 border rounded p-2 ${hasError ? "border-red-500" : "border-gray-300"}`;

  const validate = () => {
    const newErrors = {};

    // Core validation
    if (!title.trim()) newErrors.title = true;
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = true;
    if (!date) newErrors.date = true;
    if (!category) newErrors.category = true;

    // Crop-specific validation
    if (category === "crop") {
      if (!expenseType) newErrors.expenseType = true;
      if (!brand.trim()) newErrors.brand = true;
      if (!quantity || parseFloat(quantity) <= 0) newErrors.quantity = true;
      if (!unitPrice || parseFloat(unitPrice) <= 0) newErrors.unitPrice = true;
    }

    // Equipment-specific validation
    if (category === "equipment") {
      if (!expenseType) newErrors.expenseType = true;
      if (!brand.trim()) newErrors.brand = true;
      if (!quantity || parseFloat(quantity) <= 0) newErrors.quantity = true;
      if (!unitPrice || parseFloat(unitPrice) <= 0) newErrors.unitPrice = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error("Highlighted fields are required");
      return;
    }

    onSave({
      title,
      amount: parseFloat(amount),
      date,
      category,
      notes,
      expenseType: category ? expenseType : undefined,
      brand: category ? brand : undefined,
      quantity: category ? parseFloat(quantity) : undefined,
      unitPrice: category ? parseFloat(unitPrice) : undefined,
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
        <CardTitle>Add Expense</CardTitle>
        <CardDescription>
          <div className="h-full flex flex-col gap-4">
            {/* Core fields */}
            <Input
              className={inputClass(errors.title)}
              placeholder="Title / Description"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              className={inputClass(errors.amount)}
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={dayjs(date)}
                maxDate={dayjs()}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
            <select
              className={inputClass(errors.category)}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="crop">Crop</option>
              <option value="equipment">Equipment</option>
              <option value="labor">Labor</option>
              <option value="other">Other</option>
            </select>

            {/* Crop fields */}
            {category === "crop" && (
              <div className="flex flex-col gap-4 mt-2 border-t pt-2">
                <select
                  className={inputClass(errors.expenseType)}
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value)}
                >
                  <option value="">Select Crop Expense Type</option>
                  <option value="seeds">Seeds</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="pesticide">Pesticide</option>
                  <option value="other">Other</option>
                </select>
                <Input
                  className={inputClass(errors.brand)}
                  placeholder="Brand / Supplier"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
                <Input
                  className={inputClass(errors.quantity)}
                  placeholder="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Input
                  className={inputClass(errors.unitPrice)}
                  placeholder="Unit Price"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                />
              </div>
            )}

            {/* Equipment fields */}
            {category === "equipment" && (
              <div className="flex flex-col gap-4 mt-2 border-t pt-2">
                <select
                  className={inputClass(errors.expenseType)}
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value)}
                >
                  <option value="">Select Equipment Expense Type</option>
                  <option value="purchase">Purchase</option>
                  <option value="hire">Hire</option>
                  <option value="repair">Repair/Service</option>
                </select>
                <Input
                  className={inputClass(errors.brand)}
                  placeholder="Brand / Supplier"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
                <Input
                  className={inputClass(errors.quantity)}
                  placeholder="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Input
                  className={inputClass(errors.unitPrice)}
                  placeholder="Unit Price"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                />
              </div>
            )}

            <Input
              className={inputClass(errors.notes)}
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
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
