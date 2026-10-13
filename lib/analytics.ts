/**
 * FILE: lib/analytics.ts
 * MỤC ĐÍCH: Sự kiện hành vi chỉ gửi sau khi người dùng đồng ý (banner).
 */

export type AnalyticsName =
  | "view"
  | "open_card"
  | "sound_on"
  | "view_rules"
  | "register_start"
  | "register_complete"
  | "match_start"
  | "match_complete";

const CONSENT_KEY = "ngucung-analytics-consent";

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "1";
}

export function setAnalyticsConsent(on: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, on ? "1" : "0");
}

export function track(name: AnalyticsName, family?: string) {
  if (!hasAnalyticsConsent()) return;
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, family }),
  }).catch(() => {});
}
