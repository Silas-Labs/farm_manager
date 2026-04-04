import React from "react";

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

export const AddCropModal = ({ onClose }) => {
  return (
    <form
      className="fixed inset-0  flex justify-center items-center z-99  shadow-xl"
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
            <Input className="min-h-13" placeholder="Crop e.g maize" />
            <Input className="min-h-13" placeholder="Duration in months" />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select date"
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
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
