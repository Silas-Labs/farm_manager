import React from "react";

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

export const AddLaborModal = ({ onClose }) => {
  return (
    <form
      className="fixed inset-0  flex justify-center items-center z-99"
      onClick={onClose}
    >
      <Card className="w-1/3  p-4" onClick={(e) => e.stopPropagation()}>
        <CardTitle>Add Labourer</CardTitle>
        <CardDescription>
          <div className="h-full flex flex-col gap-4">
            <Input className="min-h-13" placeholder="ID Number" />
            <Input className="min-h-13" placeholder="Name" />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
            <Input className="min-h-13" placeholder="Phone Number" />
            <Input className="min-h-13" placeholder="Location" />
            <Input className="min-h-13" placeholder="Home" />
            <Input className="min-h-13" placeholder="Next of Kin" />
            <Input className="min-h-13" placeholder="Phone Number" />
            <Input className="min-h-13" placeholder="Role" />
            <Input className="min-h-13" placeholder="Status" />
          </div>
        </CardDescription>
        <CardFooter className="mt-auto bg-transparent flex justify-center gap-5">
          <Button className="min-h-12 min-w-18">Save</Button>
          <Button className="min-h-12 min-w-18">Cancel</Button>
        </CardFooter>
      </Card>
    </form>
  );
};
