import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AddEquipmentModal } from "../components/AddEquipmentModal";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { toast } from "sonner";
import dayjs from "dayjs";

export const Equipment = () => {
  const [showAddEquipmentModal, setshowAdEquipmentModal] = useState(false);
  const [showExpenseModal, setshowExpenseModal] = useState(false);
  const [equipment, setEquipment] = useState([])

  const onSave=(props)=>{
    const newEq = {
      name : props.name,
      type: props.type,
      model: props.model,
      description: props.description,
      status: props.status,
      quantity: props.quantity,
      date: props.date,
      price: props.price
    }
    const newList = [...equipment,newEq]
    setEquipment(newList)
    toast.success("Equipment added successfully.")

  }

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
          <AddEquipmentModal onClose={() => setshowAdEquipmentModal(false)} onSave={onSave}/>
        )}
        {showExpenseModal && <AddExpenseModal onClose={()=>setshowExpenseModal(false)} />}

        {/* Equipment Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Model</th>
                <th>Description</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((it)=>(
                <tr>
                  <td>{it.name}</td>
                  <td>{it.type}</td>
                  <td>{it.model}</td>
                  <td>{it.description}</td>
                  <td>{it.status}</td>
                  <td>{it.quantity}</td>
                  <td>{`${dayjs(it.date).format("DD/MM/YYYY")}`}</td>
                  <td>{it.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
