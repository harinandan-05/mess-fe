"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", waste: 14.2 },
  { day: "Tue", waste: 12.8 },
  { day: "Wed", waste: 15.1 },
  { day: "Thu", waste: 18.4 },
  { day: "Fri", waste: 16.2 },
  { day: "Sat", waste: 21.5 },
  { day: "Sun", waste: 24.8 },
];

export function WasteTrendChart() {
  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="var(--color-muted)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--color-muted)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--color-background)", 
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)"
            }}
            labelStyle={{ color: "var(--foreground)", fontWeight: "bold", marginBottom: "4px" }}
            itemStyle={{ color: "var(--color-primary)" }}
          />
          <Line 
            type="monotone" 
            dataKey="waste" 
            stroke="var(--color-primary)" 
            strokeWidth={3} 
            dot={{ fill: "var(--color-primary)", r: 4, strokeWidth: 0 }} 
            activeDot={{ r: 6, fill: "var(--foreground)" }} 
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
