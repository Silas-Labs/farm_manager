import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddEquipmentModal } from "../components/AddEquipmentModal";
import { AddExpenseModal } from "../components/AddExpenseModal";

export const Equipment = () => {
  const [showAddEquipmentModal, setshowAdEquipmentModal] = useState(false);
  const [showExpenseModal, setshowExpenseModal] = useState(false);

  return (
    <div className="w-full flex  flex-col p-1">
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setshowExpenseModal(true)}>
          Add Expense
        </Button>
        <Button variant="outline" onClick={() => setshowAdEquipmentModal(true)}>
          Add Equipment
        </Button>
      </div>
      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardTitle>Total Equipment</CardTitle>
            <CardContent>25</CardContent>
          </Card>
          <Card>
            <CardTitle>Working</CardTitle>
            <CardContent>18</CardContent>
          </Card>
          <Card>
            <CardTitle>Borrowed</CardTitle>
            <CardContent>5</CardContent>
          </Card>
        </div>
        {showAddEquipmentModal && (
          <AddEquipmentModal onClose={() => setshowAdEquipmentModal(false)} />
        )}
        {showExpenseModal && <AddExpenseModal onClose={()=>setshowExpenseModal(false)} />}

        {/* Equipment Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>State</th>
                <th>Borrowed</th>
                <th>Borrower</th>
                <th>Date Lent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{/* Map equipment data here */}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
