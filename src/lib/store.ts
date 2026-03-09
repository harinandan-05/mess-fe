"use client";

import { useState, useEffect } from "react";

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type MealType = "Breakfast" | "Lunch" | "Dinner";

export interface MenuItems {
  Breakfast: string;
  Lunch: string;
  Dinner: string;
}

export type WeeklyMenu = Record<DayOfWeek, MenuItems>;

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  dayOfWeek: DayOfWeek;
  totalWaste: number; // in kg
}

const defaultWeeklyMenu: WeeklyMenu = {
  Monday: { Breakfast: "", Lunch: "", Dinner: "" },
  Tuesday: { Breakfast: "", Lunch: "", Dinner: "" },
  Wednesday: { Breakfast: "", Lunch: "", Dinner: "" },
  Thursday: { Breakfast: "", Lunch: "", Dinner: "" },
  Friday: { Breakfast: "", Lunch: "", Dinner: "" },
  Saturday: { Breakfast: "", Lunch: "", Dinner: "" },
  Sunday: { Breakfast: "", Lunch: "", Dinner: "" }
};

const API_BASE_URL = "http://localhost:3001/api";

export function useMenuStore() {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>(defaultWeeklyMenu);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, entriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/menu`),
          fetch(`${API_BASE_URL}/entries`)
        ]);

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          // Merge with default to ensure all days exist
          setWeeklyMenu({ ...defaultWeeklyMenu, ...menuData });
        }
        
        if (entriesRes.ok) {
          const entriesData = await entriesRes.json();
          setEntries(entriesData);
        }
      } catch (e) {
        console.error("Error fetching data from API:", e);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  // Save weekly menu to backend
  const updateMenu = async (day: DayOfWeek, meal: MealType, items: string) => {
    // Optimistic update
    setWeeklyMenu((prev: WeeklyMenu) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: items
      }
    }));

    try {
      await fetch(`${API_BASE_URL}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayOfWeek: day, mealType: meal, items })
      });
    } catch (e) {
      console.error("Failed to update menu in DB:", e);
    }
  };

  // Save daily entry to backend
  const addDailyEntry = async (date: string, dayOfWeek: DayOfWeek, totalWaste: number) => {
    // We only have the minimal info here. The actual detailed entry form would send more,
    // but for now we mock the other fields to fit the backend schema.
    const optimisticEntry: DailyEntry = { date, dayOfWeek, totalWaste };
    
    setEntries((prev: DailyEntry[]) => {
      const existingIndex = prev.findIndex((e: DailyEntry) => e.date === date);
      let updated;
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex].totalWaste += totalWaste; // aggregate
      } else {
        updated = [...prev, optimisticEntry];
      }
      return updated;
    });

    try {
      await fetch(`${API_BASE_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          dayOfWeek,
          mealType: "Unknown", // store doesn't track this yet
          foodPrepared: totalWaste * 10, // dummy calculation
          foodWasted: totalWaste,
          totalStudents: 100,
          totalStudentsAte: 80
        })
      });
    } catch (e) {
      console.error("Failed to add entry in DB:", e);
    }
  };

  const getMenuForDay = (day: DayOfWeek | null) => {
    if (!day) return null;
    return weeklyMenu[day];
  };

  return {
    weeklyMenu,
    entries,
    isLoaded,
    updateMenu,
    addDailyEntry,
    getMenuForDay
  };
}
