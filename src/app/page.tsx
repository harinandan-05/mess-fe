"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Scale, Info, DollarSign } from "lucide-react";
import { WasteTrendChart } from "@/components/charts/waste-trend-chart";
import { MealTypeChart } from "@/components/charts/meal-type-chart";
import { TodayMenu } from "@/components/dashboard/today-menu";

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    totalWaste: { value: "0 kg", trend: "0%", trendType: "good" },
    avgDailyWaste: { value: "0 kg", trend: "0%", trendType: "good" },
    wastePercentage: { value: "0%", trend: "0%", trendType: "good" },
    estCostLoss: { value: "₹0", trend: "+₹0", trendType: "bad" }
  });

  const [insights, setInsights] = useState<{type: string, title: string, description: string}[]>([]);
  const [chartData, setChartData] = useState<{
    trendData: { day: string; waste: number }[];
    mealTypeData: { name: string; waste: number }[];
  }>({
    trendData: [],
    mealTypeData: []
  });

  useEffect(() => {
    // Fetch Stats
    fetch("http://localhost:3001/api/stats")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStatsData(data);
      })
      .catch(console.error);

    // Fetch Insights
    fetch("http://localhost:3001/api/insights")
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) setInsights(data);
      })
      .catch(console.error);

    // Fetch Charts
    fetch("http://localhost:3001/api/charts")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setChartData(data);
      })
      .catch(console.error);
  }, []);

  const stats = [
    { name: "Total Food Waste", value: statsData.totalWaste.value, icon: Scale, trend: statsData.totalWaste.trend, trendType: statsData.totalWaste.trendType },
    { name: "Avg Daily Waste", value: statsData.avgDailyWaste.value, icon: Info, trend: statsData.avgDailyWaste.trend, trendType: statsData.avgDailyWaste.trendType },
    { name: "Waste Percentage", value: statsData.wastePercentage.value, icon: TrendingDown, trend: statsData.wastePercentage.trend, trendType: statsData.wastePercentage.trendType },
    { name: "Est. Cost Loss", value: statsData.estCostLoss.value, icon: DollarSign, trend: statsData.estCostLoss.trend, trendType: statsData.estCostLoss.trendType },
  ];

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const isGood = stat.trendType === "good";
          return (
            <Card key={stat.name} className="glass-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-[var(--color-muted)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs mt-1 flex items-center gap-1 ${isGood ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                  {isGood ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  {stat.trend} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Daily Food Waste Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <WasteTrendChart data={chartData.trendData} />
          </CardContent>
        </Card>

        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Waste by Meal Type</CardTitle>
          </CardHeader>
          <CardContent>
            <MealTypeChart data={chartData.mealTypeData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.length === 0 ? (
              <div className="text-sm text-[var(--color-muted)] text-center py-4">Loading insights...</div>
            ) : (
              insights.map((insight, i) => {
                const isGood = insight.type === "good";
                const isInfo = insight.type === "info";
                
                let Icon = Info;
                if (!isInfo) Icon = isGood ? TrendingDown : TrendingUp;

                const colorVar = isInfo ? "var(--color-primary)" : isGood ? "var(--color-success)" : "var(--color-danger)";

                return (
                  <div key={i} className="glass p-4 rounded-lg flex items-start gap-3">
                    <div className="mt-0.5 rounded-full p-1" style={{ backgroundColor: `color-mix(in srgb, ${colorVar} 10%, transparent)` }}>
                      <Icon className="h-4 w-4" style={{ color: colorVar }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{insight.title}</h4>
                      <p className="text-sm text-[var(--color-muted)] mt-1">{insight.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <TodayMenu />
      </div>
    </div>
  );
}
