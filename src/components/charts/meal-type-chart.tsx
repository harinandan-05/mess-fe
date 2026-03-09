"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function MealTypeChart({ data }: { data: { name: string, waste: number }[] }) {
  if (!data || data.length === 0) return <div className="h-[250px] w-full mt-4 flex items-center justify-center text-[var(--color-muted)] text-sm">Loading chart...</div>;

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis 
            dataKey="name" 
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
            cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
            contentStyle={{ 
              backgroundColor: "var(--color-background)", 
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)"
            }}
            labelStyle={{ color: "var(--foreground)", fontWeight: "bold", marginBottom: "4px" }}
            itemStyle={{ color: "var(--color-primary)" }}
          />
          <Bar 
            dataKey="waste" 
            fill="var(--color-primary)" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
