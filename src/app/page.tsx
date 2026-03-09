import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Scale, Info, DollarSign } from "lucide-react";
import { WasteTrendChart } from "@/components/charts/waste-trend-chart";
import { MealTypeChart } from "@/components/charts/meal-type-chart";

export default function Dashboard() {
  const stats = [
    { name: "Total Food Waste", value: "482 kg", icon: Scale, trend: "+4.2%", trendType: "bad" },
    { name: "Avg Daily Waste", value: "15.4 kg", icon: Info, trend: "-1.1%", trendType: "good" },
    { name: "Waste Percentage", value: "8.2%", icon: TrendingDown, trend: "-0.5%", trendType: "good" },
    { name: "Est. Cost Loss", value: "₹24,100", icon: DollarSign, trend: "+₹1,200", trendType: "bad" },
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
            <WasteTrendChart />
          </CardContent>
        </Card>

        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Waste by Meal Type</CardTitle>
          </CardHeader>
          <CardContent>
            <MealTypeChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="glass p-4 rounded-lg flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-[var(--color-danger)]/10 p-1">
                <TrendingUp className="h-4 w-4 text-[var(--color-danger)]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Highest Waste Meal: Dinner (Sundays)</h4>
                <p className="text-sm text-[var(--color-muted)] mt-1">Waste averages 35% higher during Sunday dinners compared to weekdays. Consider reducing portion sizes for paneer dishes.</p>
              </div>
            </div>
            <div className="glass p-4 rounded-lg flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-[var(--color-success)]/10 p-1">
                <TrendingDown className="h-4 w-4 text-[var(--color-success)]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Improving Efficiency</h4>
                <p className="text-sm text-[var(--color-muted)] mt-1">Breakfast waste has decreased by 12% since last week following the introduction of self-serve portions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Menu (Preview)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
                <span className="text-sm font-medium">Breakfast</span>
                <span className="text-xs text-[var(--color-muted)]">Idli, Sambar, Chutney</span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
                <span className="text-sm font-medium">Lunch</span>
                <span className="text-xs text-[var(--color-muted)]">Rice, Dal, Cabbage Sabzi</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Dinner</span>
                <span className="text-xs text-[var(--color-muted)]">Chapati, Paneer, Rice</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
