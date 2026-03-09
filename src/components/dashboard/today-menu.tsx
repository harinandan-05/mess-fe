"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayOfWeek, useMenuStore } from "@/lib/store";

export function TodayMenu() {
  const { getMenuForDay, isLoaded } = useMenuStore();

  const { dateString, dayOfWeek } = useMemo(() => {
    const today = new Date();
    const days: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Formatting Date
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const dateFormatted = today.toLocaleDateString('en-US', options);
    
    return {
      dateString: dateFormatted,
      dayOfWeek: days[today.getDay()]
    };
  }, []);

  const todaysMenu = useMemo(() => getMenuForDay(dayOfWeek), [dayOfWeek, getMenuForDay]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Menu - {dateString}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoaded ? (
          <div className="text-sm text-[var(--color-muted)] animate-pulse">Loading menu...</div>
        ) : todaysMenu && (todaysMenu.Breakfast || todaysMenu.Lunch || todaysMenu.Dinner) ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-[var(--color-border)] pb-2 flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-sm font-medium">Breakfast</span>
              <span className="text-xs text-[var(--color-muted)] text-left sm:text-right">
                {todaysMenu.Breakfast || "Not set"}
              </span>
            </div>
            <div className="flex justify-between items-start border-b border-[var(--color-border)] pb-2 flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-sm font-medium">Lunch</span>
              <span className="text-xs text-[var(--color-muted)] text-left sm:text-right">
                {todaysMenu.Lunch || "Not set"}
              </span>
            </div>
            <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-sm font-medium">Dinner</span>
              <span className="text-xs text-[var(--color-muted)] text-left sm:text-right">
                {todaysMenu.Dinner || "Not set"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-[var(--color-muted)] italic">
            No menu added for {dayOfWeek} yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
