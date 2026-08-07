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
import { toast } from "sonner";
import dayjs from "dayjs";
import { cropsAPI } from "../services/api";

export const AddExpenseModal = ({ onClose, onSave }) => {
  // Core fields
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [cropId, setCropId] = useState("");
  const [isSharedCost, setIsSharedCost] = useState(false);
  const [crops, setCrops] = useState([]);

  // Category-specific fields
  const [expenseType, setExpenseType] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  // Validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;
    cropsAPI
      .getAll()
      .then((res) => active && setCrops(res.data || []))
      .catch(() => {}); // offline: allow retry on next open
    return () => {
      active = false;
    };
  }, []);

  const inputClass = (hasError) =>
    `min-h-13 border rounded p-2 ${hasError ? "border-red-500" : "border-gray-300"}`;

  const validate = () => {
    const newErrors = {};

    // Core validation
    if (!title.trim()) newErrors.title = true;
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = true;
    if (!date) newErrors.date = true;
    if (!category) newErrors.category = true;
    if (!cropId) newErrors.cropId = true;

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

  const handleSave = (e) => {
    if (e) e.preventDefault();
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
      crop_id: parseInt(cropId, 10),
      is_shared_cost: isSharedCost,
      expense_type: category ? expenseType : undefined,
      brand: category ? brand : undefined,
      quantity: category ? parseFloat(quantity) : undefined,
      unitPrice: category ? parseFloat(unitPrice) : undefined,
    });
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
        <CardTitle>Add Expense</CardTitle>
        <CardDescription>
          Record a new farm expense.
        </CardDescription>
        <form onSubmit={handleSave} className="h-full flex flex-col gap-4 mt-4">
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
              value={date}
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

          <div>
            <label className="text-sm font-medium text-earth-700">
              Crop (required)
            </label>
            <select
              className={inputClass(errors.cropId)}
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
            >
              <option value="">Select a crop</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.variety || "no variety"})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-earth-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isSharedCost}
              onChange={(e) => setIsSharedCost(e.target.checked)}
              className="w-4 h-4 rounded border-earth-300"
            />
            Shared / farm-wide cost (does not count toward a single crop's
            profit)
          </label>

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

// EOF: AddExpenseModal.jsx
