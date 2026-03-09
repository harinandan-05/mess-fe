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

export function useMenuStore() {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>(defaultWeeklyMenu);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedMenu = localStorage.getItem("messTracker_WeeklyMenu");
    if (storedMenu) {
      try {
        setWeeklyMenu(JSON.parse(storedMenu));
      } catch (e) {
        console.error("Error parsing weekly menu", e);
      }
    }

    const storedEntries = localStorage.getItem("messTracker_Entries");
    if (storedEntries) {
      try {
        setEntries(JSON.parse(storedEntries));
      } catch (e) {
        console.error("Error parsing entries", e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save weekly menu
  const updateMenu = (day: DayOfWeek, meal: MealType, items: string) => {
    setWeeklyMenu((prev) => {
      const updated = {
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: items
        }
      };
      localStorage.setItem("messTracker_WeeklyMenu", JSON.stringify(updated));
      return updated;
    });
  };

  // Save daily entry
  const addDailyEntry = (date: string, dayOfWeek: DayOfWeek, totalWaste: number) => {
    setEntries((prev) => {
      // Check if entry for this date already exists, update if so
      const existingIndex = prev.findIndex(e => e.date === date);
      let updated;
      
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { date, dayOfWeek, totalWaste };
      } else {
        updated = [...prev, { date, dayOfWeek, totalWaste }];
      }
      
      localStorage.setItem("messTracker_Entries", JSON.stringify(updated));
      return updated;
    });
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
