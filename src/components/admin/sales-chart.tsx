"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDate, formatPrice } from "@/lib/utils";

export function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  if (!data.length) {
    return (
      <p className="py-16 text-center text-sm text-ash">
        No paid orders yet — the chart appears as soon as sales land.
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0e0e0f" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#0e0e0f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e4dfd8" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => formatDate(value, { day: "2-digit", month: "short", year: undefined })}
            tick={{ fontSize: 11, fill: "#6b6a67" }}
            axisLine={{ stroke: "#e4dfd8" }}
            tickLine={false}
            minTickGap={16}
          />
          <YAxis
            tickFormatter={(value: number) => `₹${Math.round(value / 1000)}k`}
            tick={{ fontSize: 11, fill: "#6b6a67" }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip
            cursor={{ stroke: "#cfc8be" }}
            contentStyle={{
              border: "1px solid #e4dfd8",
              borderRadius: 2,
              fontSize: 12,
              fontFamily: "var(--font-sans)",
            }}
            labelFormatter={(value) => formatDate(String(value))}
            formatter={(value) => [formatPrice(Number(value)), "Revenue"] as [string, string]}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#0e0e0f"
            strokeWidth={1.5}
            fill="url(#salesFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
