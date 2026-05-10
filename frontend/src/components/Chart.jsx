// Project: Farm Manager | Module: Chart.jsx
"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const defaultChartConfig = {
  expense: {
    label: "Expenses",
    color: "#ef4444",
  },
  revenue: {
    label: "Revenue",
    color: "#22c55e",
  },
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
};

export function Chart({ data, type = "comparison" }) {
  // If no data provided, use default sample data
  const chartData =
    data && data.length > 0
      ? data
      : [
          { month: "January", expense: 1200, revenue: 1800 },
          { month: "February", expense: 1400, revenue: 2200 },
          { month: "March", expense: 1100, revenue: 1900 },
          { month: "April", expense: 1600, revenue: 2400 },
          { month: "May", expense: 1300, revenue: 2100 },
          { month: "June", expense: 1500, revenue: 2600 },
        ];

  if (type === "comparison") {
    return (
      <ChartContainer
        config={defaultChartConfig}
        className="min-h-[200px] w-full"
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
          <Bar
            dataKey="expense"
            fill="var(--color-expense)"
            radius={4}
            name="Expenses"
          />
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={4}
            name="Revenue"
          />
        </BarChart>
      </ChartContainer>
    );
  }

  if (type === "trend") {
    return (
      <ChartContainer
        config={defaultChartConfig}
        className="min-h-[200px] w-full"
      >
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="yield"
            stroke="#8884d8"
            name="Yield (kg)"
          />
        </LineChart>
      </ChartContainer>
    );
  }

  // Default return
  return (
    <ChartContainer
      config={defaultChartConfig}
      className="min-h-[200px] w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

// EOF: Chart.jsx
