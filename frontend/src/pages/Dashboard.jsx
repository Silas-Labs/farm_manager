import React from 'react'

import {Chart} from "../components/Chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableDisplay } from '../components/Table';

export const Dashboard = () => {
  return (
    <div className='w-full flex flex-row p-4 mr-5 gap-4'>
    <div className='flex flex-1 flex-col'>
        {/* Farm Overview CArds */}
    <div className='flex gap-4 w-full'>
        <Card className='min-w-1/6 min-h-60 p-2'>
            <CardTitle>Active Crops</CardTitle>
            <CardContent>
                <CardTitle></CardTitle>
            </CardContent>
        </Card>
        <Card className='min-w-1/6 min-h-60 p-2'>
            <CardTitle>Total Expense</CardTitle>
            <CardContent>
                <CardTitle></CardTitle>
            </CardContent>
        </Card>
        <Card className='min-w-1/6 min-h-60 p-2'>
            <CardTitle>Month Revenue</CardTitle>
            <CardContent>
            </CardContent>
        </Card>
       
    </div>
    {/* Financial Overview */}
    <div className='w-1/4'>
        <Chart/>
    </div>


    {/* Crops status overview */}
    <div></div>
    </div>
    <div className='w-2/8'>
    <TableDisplay/>
    </div>
    </div>
  )
}
