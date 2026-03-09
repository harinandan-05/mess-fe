"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/entry": "Add Mess Entry",
  "/menu": "Menu Management",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Mess Tracker";

  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--color-border)] bg-[var(--background)]/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 z-10 sticky top-0">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-between">
        <h1 className="text-xl font-semibold leading-6 text-[var(--foreground)]">
          {title}
        </h1>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[var(--color-border)]" aria-hidden="true" />
          
          <div className="flex items-center gap-x-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-purple-500 shadow-inner ring-1 ring-white/10 flex items-center justify-center text-xs font-medium text-white">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
