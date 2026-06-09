import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserMenuProps {
  user: {
    email: string;
    displayName?: string | null;
    photoURL?: string | null;
  };
  isAdmin: boolean;
  onSignOut: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(displayName: string | null | undefined, email: string): string {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function getDisplayLabel(displayName: string | null | undefined, email: string): string {
  if (displayName) return displayName;
  // Use the part before the @ sign, up to 20 chars
  return email.split("@")[0].slice(0, 20);
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function Avatar({
  photoURL,
  initials,
}: {
  photoURL?: string | null;
  initials: string;
}) {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={initials}
        className="h-8 w-8 rounded-full object-cover ring-1 ring-outline-variant"
      />
    );
  }
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-head font-semibold text-sm select-none">
      {initials}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UserMenu({ user, isAdmin, onSignOut }: UserMenuProps) {
  const initials = getInitials(user.displayName, user.email);
  const label = getDisplayLabel(user.displayName, user.email);

  return (
    <DropdownMenu.Root>
      {/* ---- Trigger ---- */}
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-2 py-1",
            "text-on-surface hover:bg-surface-container-high",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label={`User menu — ${user.email}`}
        >
          <Avatar photoURL={user.photoURL} initials={initials} />
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold font-head leading-none">
              {label}
            </span>
            <span className="text-xs text-on-surface-variant tracking-wide leading-none mt-0.5">
              {isAdmin ? "admin" : "user"}
            </span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-on-surface-variant opacity-70" />
        </button>
      </DropdownMenu.Trigger>

      {/* ---- Portal + Content ---- */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className={cn(
            "z-50 min-w-[220px] rounded-lg border border-outline-variant",
            "bg-surface-container-highest shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          {/* Header — email + role badge */}
          <div className="px-3 py-2.5">
            <p className="text-sm font-semibold text-on-surface truncate">
              {user.email}
            </p>
            <span
              className={cn(
                "mt-1.5 inline-block px-2 py-0.5 rounded text-xs font-medium",
                isAdmin
                  ? "bg-primary/15 text-primary"
                  : "bg-surface-container-high text-on-surface-variant",
              )}
            >
              {isAdmin ? "admin" : "user"}
            </span>
          </div>

          <DropdownMenu.Separator className="h-px bg-outline-variant mx-1" />

          {/* Sign out */}
          <DropdownMenu.Item
            onSelect={onSignOut}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm text-on-surface rounded-md mx-1 my-1",
              "cursor-pointer select-none outline-none",
              "hover:bg-surface-container-high focus:bg-surface-container-high",
            )}
          >
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
