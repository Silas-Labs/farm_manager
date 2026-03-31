import React from 'react'

import {Button} from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export const Labour = () => {
  return (
    <div className='w-full flex flex-col p-1'>
          <div className='w-full flex justify-end border border-blue-200'>
            <Button variant='outline'>Add Labor</Button>
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
      <tbody>
        {/* Map personnel data here */}
      </tbody>
    </table>
  </div>
</div>
    
        </div>
  )
}
