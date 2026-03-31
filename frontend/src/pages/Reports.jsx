import React, { useState } from 'react'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Chart } from '../components/Chart' // Reusable chart component
import { TableDisplay } from '../components/Table'
import { Button } from '@/components/ui/button'

export const Reports = () => {
  // Example Data
  const [financialData] = useState({
    totalRevenue: 5200,
    totalExpense: 3500,
    profit: 1700,
  })

  const [yieldData] = useState([
    { crop: "Tomatoes", yield: 120 },
    { crop: "Maize", yield: 250 },
    { crop: "Wheat", yield: 180 },
  ])

  const [activityData] = useState([
    { date: "2026-03-30", activity: "Planted Maize", field: "Field B" },
    { date: "2026-03-29", activity: "Harvested Tomatoes", field: "Field A" },
    { date: "2026-03-28", activity: "Fertilized Wheat", field: "Field C" },
  ])

  return (
    <div className='w-full flex flex-col gap-6 p-4'>

      {/* KPI Cards */}
      <div className='grid grid-cols-3 gap-4'>
        <Card className='p-4'>
          <CardTitle>Total Revenue</CardTitle>
          <CardContent>
            <p className='text-2xl font-bold'>${financialData.totalRevenue}</p>
          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardTitle>Total Expenses</CardTitle>
          <CardContent>
            <p className='text-2xl font-bold'>${financialData.totalExpense}</p>
          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardTitle>Profit</CardTitle>
          <CardContent>
            <p className='text-2xl font-bold'>${financialData.profit}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-2 gap-4'>
        {/* Revenue vs Expense Chart */}
        <Card className='p-4 h-64'>
          <CardTitle>Revenue vs Expenses</CardTitle>
          <CardContent className='h-48'>
            <Chart data={[
              { name: 'Revenue', value: financialData.totalRevenue },
              { name: 'Expenses', value: financialData.totalExpense }
            ]}/>
          </CardContent>
        </Card>

        {/* Crop Yield Chart */}
        <Card className='p-4 h-64'>
          <CardTitle>Yield per Crop</CardTitle>
          <CardContent className='h-48'>
            <Chart data={yieldData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities Table */}
      <Card className='p-4'>
        <CardTitle>Recent Activities</CardTitle>
        <CardContent>
          <TableDisplay
            data={activityData}
            columns={[
              { header: "Date", accessor: "date" },
              { header: "Activity", accessor: "activity" },
              { header: "Field", accessor: "field" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Optional Export Button */}
      <div className='flex justify-end'>
        <Button variant='outline'>Export Report</Button>
      </div>

    </div>
  )
}