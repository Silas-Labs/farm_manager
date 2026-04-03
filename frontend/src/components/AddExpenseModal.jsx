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
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave({
      title,
      amount: parseFloat(amount),
      date,
      category,
      notes,
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
