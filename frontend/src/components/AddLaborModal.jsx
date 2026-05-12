// Project: Farm Manager | Module: AddLaborModal.jsx
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
import dayjs from "dayjs";
import { toast } from "sonner";

export const AddLaborModal = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Active");
  const [hourlyRate, setHourlyRate] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [errors, setErrors] = useState({});

  const inputClass = (hasError) =>
    `min-h-13 border rounded p-2 ${hasError ? "border-red-500" : "border-gray-300"}`;

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = true;
    if (!role.trim()) newErrors.role = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!location.trim()) newErrors.location = true;
    if (!status.trim()) newErrors.status = true;

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
      name: name,
      role: role,
      phone: phone,
      location: location,
      status: status,
      hourly_rate: parseFloat(hourlyRate) || 0,
      monthly_salary: parseFloat(monthlySalary) || 0,
      start_date: startDate,
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
        <CardTitle>Add Labourer</CardTitle>
        <CardDescription>
          Record a new member of your farm workforce.
        </CardDescription>
        <form onSubmit={handleSave} className="h-full flex flex-col gap-4 mt-4">
          <Input
            className={inputClass(errors.name)}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className={inputClass(errors.role)}
            placeholder="Role (e.g. Harvester, Manager)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <Input
            className={inputClass(errors.phone)}
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            className={inputClass(errors.location)}
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              className={inputClass(errors.hourlyRate)}
              placeholder="Hourly Rate ($)"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
            <Input
              className={inputClass(errors.monthlySalary)}
              placeholder="Monthly Salary ($)"
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
            />
          </div>
          <select
            className={inputClass(errors.status)}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              slotProps={{
                textField: { fullWidth: true },
              }}
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              maxDate={dayjs()}
            />
          </LocalizationProvider>
          <CardFooter className="mt-6 bg-transparent flex justify-center gap-5">
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

// EOF: AddLaborModal.jsx
