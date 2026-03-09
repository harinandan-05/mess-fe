"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayOfWeek, useMenuStore } from "@/lib/store";
import { Calendar as CalendarIcon, Scale, Utensils, CheckCircle2 } from "lucide-react";

const getDayOfWeek = (dateString: string): DayOfWeek => {
  // Parsing date string safely (YYYY-MM-DD to local time)
  const [year, month, day] = dateString.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const days: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dateObj.getDay()];
};

export default function AddEntry() {
  const { entries, addDailyEntry, getMenuForDay, isLoaded } = useMenuStore();
  
  // Default to today
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  
  const [totalWaste, setTotalWaste] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const dayOfWeek = useMemo(() => getDayOfWeek(date), [date]);
  const menuForDay = useMemo(() => getMenuForDay(dayOfWeek), [dayOfWeek, getMenuForDay]);
  
  // Check if an entry already exists for this date
  const existingEntry = useMemo(() => entries.find(e => e.date === date), [entries, date]);

  // If there's an existing entry and user hasn't typed anything new, show that entry's value
  // Note: we let the totalWaste string handle the controlled input
  // Only override if they just switched dates and totalWaste is clean
  // For simplicity, we just use totalWaste as typed by user, but let's pre-fill if existing
  useMemo(() => {
    if (existingEntry && !totalWaste && !showSuccess) {
      setTotalWaste(existingEntry.totalWaste.toString());
    } else if (!existingEntry && !showSuccess) {
      setTotalWaste("");
    }
  }, [existingEntry, date, showSuccess]);

  if (!isLoaded) {
    return <div className="flex h-full items-center justify-center text-[var(--color-muted)]">Loading state...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalWaste || isNaN(Number(totalWaste))) return;

    addDailyEntry(date, dayOfWeek, Number(totalWaste));
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setTotalWaste("");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Waste Entry</h1>
        <p className="text-[var(--color-muted)] mt-2">Log the total food waste for a specific day. The menu will automatically update based on the selected date.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entry Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-xl">Waste Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-[var(--color-primary)]" />
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[rgba(0,0,0,0.2)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Scale className="h-4 w-4 text-[var(--color-primary)]" />
                  Total Waste (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={totalWaste}
                  onChange={(e) => setTotalWaste(e.target.value)}
                  placeholder="e.g. 15.5"
                  className="w-full rounded-md border border-[var(--color-border)] bg-[rgba(0,0,0,0.2)] px-3 py-2 text-xl font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                />
                {existingEntry && (
                  <p className="text-xs text-[var(--color-muted)]">
                    An entry of {existingEntry.totalWaste} kg already exists for this date. Saving will overwrite it.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] h-11 shadow-lg shadow-[var(--color-primary)]/20"
              >
                {showSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Saved Successfully
                  </>
                ) : (
                  "Save Entry"
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Menu Preview */}
        <Card className="glass h-fit border-[var(--color-primary)]/20">
          <CardHeader>
            <CardTitle className="text-lg flex flex-col gap-1">
              <span className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-[var(--color-primary)]" />
                Menu Outline
              </span>
              <span className="text-sm font-normal text-[var(--color-muted)] mt-1">
                {dayOfWeek}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {menuForDay ? (
              <div className="space-y-6">
                {Object.entries(menuForDay).map(([meal, items]) => (
                  <div key={meal} className="space-y-2">
                    <h4 className="text-sm font-semibold text-[var(--foreground)] border-b border-[var(--color-border)] pb-1">
                      {meal}
                    </h4>
                    <pre className="text-sm text-[var(--color-muted)] whitespace-pre-wrap font-sans">
                      {items || <span className="italic opacity-50">No items specified</span>}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-muted)] italic">
                No menu configured for {dayOfWeek}.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
