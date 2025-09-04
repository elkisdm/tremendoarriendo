export type AnalyticsEventParams = Record<string, unknown> | undefined;

export function track(eventName: string, params?: AnalyticsEventParams): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", eventName, params ?? {});
}


