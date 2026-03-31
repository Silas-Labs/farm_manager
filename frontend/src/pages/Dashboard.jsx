import React from 'react'
import { Chart } from "../components/Chart"
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { TableDisplay } from '../components/Table';

export const Dashboard = () => {
  return (
    <div className='w-full flex gap-4 p-4'>
      
      {/* Left Column */}
      <div className='flex-1 flex flex-col gap-4'>
        
        {/* Top KPI Cards */}
        <div className='flex gap-4'>
          <Card className='flex-1 p-4'>
            <CardTitle>Active Crops</CardTitle>
            <CardContent>
              <p className='text-2xl font-bold'>12</p>
            </CardContent>
          </Card>

          <Card className='flex-1 p-4'>
            <CardTitle>Total Expense</CardTitle>
            <CardContent>
              <p className='text-2xl font-bold'>$3,500</p>
            </CardContent>
          </Card>

          <Card className='flex-1 p-4'>
            <CardTitle>Month Revenue</CardTitle>
            <CardContent>
              <p className='text-2xl font-bold'>$5,200</p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Chart */}
        <Card className='p-4'>
          <CardTitle>Expenses vs Revenue</CardTitle>
          <CardContent>
            <Chart />
          </CardContent>
        </Card>

        {/* Crop Status Overview */}
        <div className='grid grid-cols-3 gap-4'>
          <Card className='p-4'>
            <CardTitle>Planted</CardTitle>
            <CardContent>
              <p className='text-xl font-semibold'>5</p>
            </CardContent>
          </Card>
          <Card className='p-4'>
            <CardTitle>Growing</CardTitle>
            <CardContent>
              <p className='text-xl font-semibold'>4</p>
            </CardContent>
          </Card>
          <Card className='p-4'>
            <CardTitle>Ready to Harvest</CardTitle>
            <CardContent>
              <p className='text-xl font-semibold'>3</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column */}
      <div className='w-1/4'>
        <Card className='p-4'>
          <CardTitle>Recent Activities</CardTitle>
          <CardContent>
            <TableDisplay />
          </CardContent>
        </Card>
      </div>

    </div>
  )
}