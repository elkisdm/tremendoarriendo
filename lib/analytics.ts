export type AnalyticsEventParams = Record<string, unknown> | undefined;

export function track(eventName: string, params?: AnalyticsEventParams): void {
  if (typeof window === "undefined") return;
  // @ts-expect-error gtag is injected by GA script when enabled
  window.gtag?.("event", eventName, params ?? {});
}


