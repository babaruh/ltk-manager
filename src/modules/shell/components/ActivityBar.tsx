import { Link } from "@tanstack/react-router";
import { Hammer, Settings, Stethoscope } from "lucide-react";
import type { ComponentType } from "react";
import { twMerge } from "tailwind-merge";

import { MaskIcon, Tooltip } from "@/components";

interface ActivityItemDef {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact: boolean;
}

const topItems: ActivityItemDef[] = [
  { to: "/", label: "Library", icon: MaskIcon, exact: true },
  { to: "/workshop", label: "Workshop", icon: Hammer, exact: false },
];

const bottomItems: ActivityItemDef[] = [
  { to: "/diagnostics", label: "Diagnostics", icon: Stethoscope, exact: false },
  { to: "/settings", label: "Settings", icon: Settings, exact: false },
];

function ActivityItem({ to, label, icon: Icon, exact }: ActivityItemDef) {
  return (
    <Tooltip content={label} side="right">
      <Link
        to={to}
        activeOptions={{ exact }}
        activeProps={{
          className: "flex h-12 w-12 items-center justify-center text-surface-100",
        }}
        inactiveProps={{
          className:
            "flex h-12 w-12 items-center justify-center text-surface-400 hover:text-surface-100",
        }}
        aria-label={label}
      >
        {({ isActive }) => (
          <span
            className={twMerge(
              "flex h-full w-full items-center justify-center border-l-2 border-transparent",
              isActive && "border-accent-400",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
      </Link>
    </Tooltip>
  );
}

/**
 * VS Code's activity bar: icon-only vertical nav, the app's section switcher.
 * Settings sits pinned at the bottom, mirroring the gear VS Code puts in the
 * same spot - everything else (Library, Workshop) reads top to bottom in the
 * order they matter.
 */
export function ActivityBar() {
  return (
    <nav className="flex w-12 shrink-0 flex-col items-center bg-surface-950 py-1 select-none">
      {topItems.map((item) => (
        <ActivityItem key={item.to} {...item} />
      ))}
      <div className="flex-1" />
      {bottomItems.map((item) => (
        <ActivityItem key={item.to} {...item} />
      ))}
    </nav>
  );
}
