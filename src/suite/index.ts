// Shared suite shell + theme kit
// Copy this directory into each app in Phase 3.

// --- Theme ---
export { ThemeProvider, useSuiteTheme } from "./theme/ThemeProvider";
export type { ThemePreference, ResolvedTheme } from "./theme/ThemeProvider";
export { ThemeToggle } from "./theme/ThemeToggle";

// --- Shell ---
export { SuiteTopBar } from "./shell/SuiteTopBar";
export { AppSwitcher } from "./shell/AppSwitcher";
export { UserMenu } from "./shell/UserMenu";

// --- Utilities ---
export { cn } from "./lib/cn";
