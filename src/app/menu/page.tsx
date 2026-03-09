"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayOfWeek, MealType, useMenuStore } from "@/lib/store";
import { CalendarDays, Save, CheckCircle2 } from "lucide-react";

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS: MealType[] = ["Breakfast", "Lunch", "Dinner"];

export default function MenuManagement() {
  const { weeklyMenu, updateMenu, isLoaded } = useMenuStore();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday");
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isLoaded) {
    return <div className="flex h-full items-center justify-center text-[var(--color-muted)]">Loading state...</div>;
  }

  const handleSave = () => {
    // Already saved on change in the store, but we can show a success indicator
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-[var(--color-muted)] mt-2">Configure the weekly menu for the mess. This will be used to track daily food waste accurately.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Day Selector Sidebar */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[var(--color-primary)]" />
              Select Day
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedDay === day 
                    ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/50" 
                    : "text-[var(--color-muted)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--foreground)]"
                }`}
              >
                {day}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Menu Editor Form */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              {selectedDay}'s Menu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {MEALS.map((meal) => (
              <div key={meal} className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  {meal}
                </label>
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-[var(--color-border)] bg-[rgba(0,0,0,0.2)] px-3 py-2 text-sm placeholder:text-[var(--color-muted)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all resize-y"
                  placeholder={`Enter ${meal.toLowerCase()} items...`}
                  value={weeklyMenu[selectedDay]?.[meal] || ""}
                  onChange={(e) => updateMenu(selectedDay, meal, e.target.value)}
                />
              </div>
            ))}

            <div className="pt-4 flex items-center justify-end gap-4 border-t border-[var(--color-border)] relative">
              {showSuccess && (
                <span className="text-sm text-[var(--color-success)] flex items-center gap-1 absolute left-0 animate-in fade-in slide-in-from-left-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Menu updated automatically
                </span>
              )}
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] h-9 px-4 py-2 shadow-lg shadow-[var(--color-primary)]/20"
              >
                <Save className="mr-2 h-4 w-4" />
                Done
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
