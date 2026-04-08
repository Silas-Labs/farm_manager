import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddLaborModal } from "../components/AddLaborModal";
import { AddExpenseModal } from "../components/AddExpenseModal";

export const Labour = () => {
  const [showLaborModal, setshowLaborModal] = useState(false);
  const [showExpenseModal, setshowExpenseModal] = useState(false);

  const handleSave = () => {
    console.log("saving...");
  };

  return (
    <div className="w-full flex flex-col p-1">
      <div className="w-full flex justify-end  gap-2">
        <Button
          variant="outline"
          onClick={() => setshowExpenseModal((prev) => !prev)}
        >
          Add Expense
        </Button>
        <Button
          variant="outline"
          onClick={() => setshowLaborModal((prev) => !prev)}
        >
          Add Labor
        </Button>
      </div>
      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Card>
            <CardTitle>Total Personnel</CardTitle>
            <CardContent>25</CardContent>
          </Card>
          <Card>
            <CardTitle>Working</CardTitle>
            <CardContent>20</CardContent>
          </Card>
          <Card>
            <CardTitle>On Leave</CardTitle>
            <CardContent>3</CardContent>
          </Card>
          <Card>
            <CardTitle>Turnover Rate</CardTitle>
            <CardContent>8%</CardContent>
          </Card>
        </div>

        {showLaborModal && (
          <AddLaborModal
            onClose={() => setshowLaborModal(false)}
            onSave={() => handleSave()}
          />
        )}

        {showExpenseModal && (
          <AddExpenseModal onClose={() => setshowExpenseModal(false)} />
        )}

        {/* Personnel Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Employment Type</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{/* Map personnel data here */}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
