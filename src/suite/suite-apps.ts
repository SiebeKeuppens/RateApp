/**
 * suite-apps.ts — the suite app registry that powers the shared <AppSwitcher>.
 * Copy into each app (e.g. src/lib/suite-apps.ts). It is the single place that
 * knows about all apps + the static launcher. Per decision #2, apps stay
 * independent; the launcher is your existing static switcher site.
 *
 * TODO before Phase 3 adoption: set LAUNCHER_URL and each app's `url`.
 */

export const LAUNCHER_URL = "https://keuppens.online/"; // your static switcher site

export type SuiteAppId = "travel" | "rating" | "cdn" | "portal";

export interface SuiteApp {
  id: SuiteAppId;
  name: string;
  shortName: string; // brand-chip label
  /** Firebase `appAccess` custom-claim key (granted by portalApp). Omit for admin-only apps. */
  claim?: "TravelApp" | "RatingApp" | "CDNApp";
  /** Visible to admins regardless of claims (portal is the admin console). */
  adminOnly?: boolean;
  /** Dark-mode accent hex — used only for the switcher swatch dot. */
  accent: string;
  /** Deployed URL of the app. */
  url: string;
}

export const SUITE_APPS: SuiteApp[] = [
  { id: "travel", name: "TravelApp", shortName: "T", claim: "TravelApp", accent: "#accdf0", url: "https://travel.keuppens.online" },
  { id: "rating", name: "RatingApp", shortName: "R", claim: "RatingApp", accent: "#9fd8c0", url: "https://rate.keuppens.online" },
  { id: "cdn",    name: "CDN",       shortName: "C", claim: "CDNApp",    accent: "#9ccfd8", url: "https://cdn.keuppens.online" },
  { id: "portal", name: "Portal",    shortName: "P", adminOnly: true,    accent: "#bcc2ef", url: "https://portal.keuppens.online" },
];

export const APP_BY_ID: Record<SuiteAppId, SuiteApp> = Object.fromEntries(
  SUITE_APPS.map((a) => [a.id, a]),
) as Record<SuiteAppId, SuiteApp>;

/** Apps the given user may open — `appAccess` claims for normal apps, `isAdmin` for admin-only. */
export function visibleApps(opts: { appAccess?: Record<string, boolean>; isAdmin?: boolean }): SuiteApp[] {
  const { appAccess = {}, isAdmin = false } = opts;
  return SUITE_APPS.filter((a) => (a.adminOnly ? isAdmin : !!a.claim && appAccess[a.claim] === true));
}
