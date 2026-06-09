import React from "react";
import { APP_BY_ID, type SuiteAppId } from "../suite-apps";
import { AppSwitcher } from "./AppSwitcher";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "../theme/ThemeToggle";
import { cn } from "../lib/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SuiteTopBarProps {
  app: SuiteAppId;
  user: {
    email: string;
    displayName?: string | null;
    photoURL?: string | null;
  };
  isAdmin: boolean;
  appAccess: Record<string, boolean>;
  onSignOut: () => void;
  /** Optional app-local nav (e.g. an in-app "Admin" link), shown after the app switcher. */
  navSlot?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SuiteTopBar({
  app,
  user,
  isAdmin,
  appAccess,
  onSignOut,
  navSlot,
}: SuiteTopBarProps) {
  const appMeta = APP_BY_ID[app];

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "bg-surface-container/85 backdrop-blur-sm",
        "border-b border-outline-variant",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5">
      {/* ---- Left: Brand chip + app name + app switcher ---- */}
      <div className="flex items-center gap-2.5">
        {/* Brand chip */}
        <span
          className={cn(
            "inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md",
            "bg-primary text-primary-foreground font-head font-bold text-sm select-none",
          )}
          aria-hidden="true"
        >
          {appMeta.shortName}
        </span>

        {/* App name */}
        <span className="font-head font-semibold text-on-surface text-sm hidden sm:inline">
          {appMeta.name}
        </span>

        {/* App switcher */}
        <AppSwitcher current={app} appAccess={appAccess} isAdmin={isAdmin} />

        {/* App-local nav (optional) */}
        {navSlot && <div className="flex items-center gap-3 pl-1">{navSlot}</div>}
      </div>

      {/* ---- Spacer ---- */}
      <div className="flex-1" />

      {/* ---- Right: Theme toggle + user menu ---- */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu user={user} isAdmin={isAdmin} onSignOut={onSignOut} />
      </div>
      </div>
    </header>
  );
}
