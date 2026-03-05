'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const revenueData = [
  { day: 'Monday', revenue: 42000, orders: 186 },
  { day: 'Tuesday', revenue: 53200, orders: 215 },
  { day: 'Wednesday', revenue: 48700, orders: 198 },
  { day: 'Thursday', revenue: 61500, orders: 256 },
  { day: 'Friday', revenue: 72300, orders: 312 },
  { day: 'Saturday', revenue: 89100, orders: 403 },
  { day: 'Sunday', revenue: 68400, orders: 287 },
];

const chartConfig = {
  revenue: {
    label: 'Revenue (NT$)',
    color: 'var(--color-primary)',
  },
  orders: {
    label: 'Orders',
    color: 'var(--color-chart-2)',
  },
} satisfies ChartConfig;

export default function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Revenue</CardTitle>
        <CardDescription>Past 7 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={revenueData}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              className="text-xs"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return `NT$ ${Number(value).toLocaleString()}`;
                    }
                    return `${Number(value).toLocaleString()} orders`;
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#fillRevenue)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              fill="url(#fillOrders)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
