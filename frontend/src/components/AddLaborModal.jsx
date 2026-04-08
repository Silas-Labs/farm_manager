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
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [doB, setDoB] = useState(dayjs());
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [home, setHome] = useState("");
  const [kin, setKin] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!id.trim()) newErrors.id = true
    if (!name.trim()) newErrors.name = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!location.trim()) newErrors.location = true;
    if (!home.trim()) newErrors.home = true;
    if (!kin.trim()) newErrors.kin = true;
    if (!kinPhone.trim()) newErrors.kinPhone = true;
    if (!role.trim()) newErrors.role = true;
    if (!status.trim()) newErrors.status = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error("Highlighted fields are required");
      return
    }

    onSave({
      id: id,
      name:name,
      doB: doB,
      phone: phone,
      location: location,
      home: home,
      kin: kin,
      kinPhone: kinPhone,
      role: role,
      status: status
    })
  };

  return (
    <form
      className="fixed inset-0  flex justify-center items-center z-99"
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
          <div className="h-full flex flex-col gap-4">
            <Input
              className="min-h-13"
              placeholder="ID Number"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <Input
              className="min-h-13"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                slotProps={{
                  textField: { fullWidth: true },
                }}
                value={doB}
                onChange={() => setDoB(() => (newDate) => newDate)}
                maxDate={dayjs()}
              />
            </LocalizationProvider>
            <Input
              className="min-h-13"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              className="min-h-13"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              className="min-h-13"
              placeholder="Home"
              value={home}
              onChange={(e) => setHome(e.target.value)}
            />
            <Input
              className="min-h-13"
              placeholder="Next of Kin"
              value={kin}
              onChange={(e) => setKin(e.target.value)}
            />
            <Input
              className="min-h-13"
              placeholder="Phone Number"
              value={kinPhone}
              onChange={(e) => setKinPhone(e.target.value)}
            />
            <Input
              className="min-h-13"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Input
              className="min-h-13"
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
