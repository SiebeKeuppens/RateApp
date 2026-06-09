import React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useSuiteTheme, type ThemePreference } from "./ThemeProvider";
import { cn } from "../lib/cn";

// ---------------------------------------------------------------------------
// Cycle order: system → light → dark → system …
// ---------------------------------------------------------------------------

const CYCLE: ThemePreference[] = ["system", "light", "dark"];

const ICONS: Record<ThemePreference, React.ReactNode> = {
  system: <Monitor className="h-4 w-4" />,
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
};

const LABELS: Record<ThemePreference, string> = {
  system: "Theme: System",
  light: "Theme: Light",
  dark: "Theme: Dark",
};

// ---------------------------------------------------------------------------

export function ThemeToggle({ className }: { className?: string }) {
  const { preference, setPreference } = useSuiteTheme();

  function handleClick() {
    const idx = CYCLE.indexOf(preference);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    setPreference(next);
  }

  const label = LABELS[preference];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md",
        "text-on-surface-variant hover:bg-surface-container-high",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {ICONS[preference]}
    </button>
  );
}
