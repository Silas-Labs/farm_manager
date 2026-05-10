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
import { DollarSign, Clock, Calendar as CalendarIcon } from "lucide-react";

export const PayrollModal = ({ worker, onClose, onSave }) => {
  const [paymentType, setPaymentType] = useState("hourly");
  const [hours, setHours] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const inputClass = (hasError) =>
    `min-h-13 border rounded-lg p-2 ${hasError ? "border-red-500" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-farm-500`;

  const calculateAmount = () => {
    if (paymentType === "hourly" && hours) {
      const calculated = parseFloat(hours) * (worker.hourlyRate || 0);
      setAmount(calculated.toFixed(2));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = true;
    if (paymentType === "hourly" && (!hours || parseFloat(hours) <= 0))
      newErrors.hours = true;
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
      workerId: worker.id,
      workerName: worker.name,
      type: paymentType,
      hours: paymentType === "hourly" ? parseFloat(hours) : null,
      amount: parseFloat(amount),
      date: date,
      notes: notes,
    });
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardTitle className="p-6 pb-0">Process Payroll</CardTitle>
        <CardDescription className="px-6">
          Record payment for {worker.name}
        </CardDescription>

        <div className="p-6 space-y-4">
          {/* Payment Type Selection */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setPaymentType("hourly");
                setHours("");
                setAmount("");
              }}
              className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                paymentType === "hourly"
                  ? "border-farm-500 bg-farm-50 text-farm-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Clock className="w-5 h-5 mx-auto mb-1" />
              <p className="text-sm font-medium">Hourly</p>
              <p className="text-xs text-earth-400">${worker.hourlyRate}/hr</p>
            </button>
            <button
              onClick={() => {
                setPaymentType("salary");
                setAmount(worker.monthlySalary?.toString() || "");
              }}
              className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                paymentType === "salary"
                  ? "border-farm-500 bg-farm-50 text-farm-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <DollarSign className="w-5 h-5 mx-auto mb-1" />
              <p className="text-sm font-medium">Salary</p>
              <p className="text-xs text-earth-400">Monthly</p>
            </button>
          </div>

          {/* Hourly Fields */}
          {paymentType === "hourly" && (
            <div>
              <label className="text-sm font-medium text-earth-700 mb-1 block">
                Hours Worked
              </label>
              <Input
                className={inputClass(errors.hours)}
                placeholder="e.g., 40"
                type="number"
                step="0.5"
                value={hours}
                onChange={(e) => {
                  setHours(e.target.value);
                  if (e.target.value) {
                    const calc =
                      parseFloat(e.target.value) * (worker.hourlyRate || 0);
                    setAmount(calc.toFixed(2));
                  }
                }}
              />
              {worker.hourlyRate > 0 && hours && (
                <p className="text-xs text-farm-600 mt-1">
                  {hours} hours × ${worker.hourlyRate}/hr = ${amount}
                </p>
              )}
            </div>
          )}

          {/* Amount Field */}
          <div>
            <label className="text-sm font-medium text-earth-700 mb-1 block">
              Payment Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400" />
              <Input
                className={`${inputClass(errors.amount)} pl-9`}
                placeholder="0.00"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Payment Date"
              value={dayjs(date)}
              maxDate={dayjs()}
              onChange={(newDate) => setDate(newDate)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  className: inputClass(errors.date),
                },
              }}
            />
          </LocalizationProvider>

          {/* Notes */}
          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border-gray-200 rounded-lg"
          />
        </div>

        <CardFooter className="flex justify-center gap-3 p-6 pt-0">
          <Button
            onClick={handleSave}
            className="bg-farm-600 hover:bg-farm-700 text-white flex-1"
          >
            Process Payment
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
