export function clx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
export function formatPrice(value?: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

// Backwards compatibility for existing imports
export function currency(clp?: number) {
  return formatPrice(clp);
}
export const fakeDelay = (ms = 800) => new Promise((res) => setTimeout(res, ms));
