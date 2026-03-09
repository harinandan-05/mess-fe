"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, CalendarDays, Apple } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Add Entry", href: "/entry", icon: PlusCircle },
  { name: "Menu Management", href: "/menu", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-[var(--color-border)] bg-[var(--background)]">
      <div className="flex h-16 items-center flex-shrink-0 px-6 border-b border-[var(--color-border)] gap-3 glass">
        <Apple className="h-6 w-6 text-[var(--color-primary)]" />
        <span className="font-semibold text-lg tracking-tight">Mess Tracker</span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-3">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--foreground)]"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted)] group-hover:text-[var(--foreground)]"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="glass rounded-lg p-4 text-xs text-[var(--color-muted)]">
          <p>Analytics Mode</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
            System Online
          </div>
        </div>
      </div>
    </div>
  );
}
