import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ExternalLink, LayoutGrid, ChevronDown } from "lucide-react";
import {
  visibleApps,
  APP_BY_ID,
  LAUNCHER_URL,
  type SuiteAppId,
} from "../suite-apps";
import { cn } from "../lib/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AppSwitcherProps {
  current: SuiteAppId;
  appAccess: Record<string, boolean>;
  isAdmin: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AppSwitcher({ current, appAccess, isAdmin }: AppSwitcherProps) {
  const apps = visibleApps({ appAccess, isAdmin });
  const currentApp = APP_BY_ID[current];

  return (
    <DropdownMenu.Root>
      {/* ---- Trigger ---- */}
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 h-8",
            "text-on-surface-variant text-sm hover:bg-surface-container-high hover:text-on-surface",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label={`App switcher — current: ${currentApp.name}`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Apps</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenu.Trigger>

      {/* ---- Portal + Content ---- */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className={cn(
            "z-50 min-w-[230px] rounded-lg border border-outline-variant",
            "bg-surface-container-highest shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          {/* Header label */}
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Switch app
            </p>
          </div>

          <DropdownMenu.Separator className="h-px bg-outline-variant mx-1" />

          {/* App rows */}
          {apps.map((app) => {
            const isCurrent = app.id === current;
            return (
              <DropdownMenu.Item key={app.id} asChild>
                <a
                  href={app.url}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm rounded-md mx-1 my-0.5",
                    "cursor-pointer select-none outline-none no-underline",
                    "text-on-surface hover:bg-surface-container-high focus:bg-surface-container-high",
                    isCurrent && "font-semibold",
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {/* Accent swatch */}
                  <span
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: app.accent,
                      color: "#0a0f10",
                    }}
                    aria-hidden="true"
                  >
                    {app.shortName}
                  </span>

                  <span className="flex-1">{app.name}</span>

                  {/* Current indicator */}
                  {isCurrent && (
                    <Check
                      className="h-3.5 w-3.5 text-primary shrink-0"
                      aria-label="Current app"
                    />
                  )}
                </a>
              </DropdownMenu.Item>
            );
          })}

          <DropdownMenu.Separator className="h-px bg-outline-variant mx-1 my-1" />

          {/* Open launcher */}
          <DropdownMenu.Item asChild>
            <a
              href={LAUNCHER_URL}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-md mx-1 mb-1",
                "cursor-pointer select-none outline-none no-underline",
                "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                "focus:bg-surface-container-high focus:text-on-surface",
              )}
            >
              <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
              Open launcher
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
