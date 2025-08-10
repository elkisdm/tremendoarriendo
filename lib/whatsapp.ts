export function buildWaLink({ phone, propertyName, comuna, url }: { phone?: string; propertyName?: string; comuna?: string; url?: string }) {
  const p = phone ?? process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
  const msg = `Hola, me interesa ${propertyName ?? ""} en ${comuna ?? ""}. ${url ?? ""}`.trim();
  return p ? `https://wa.me/${p}?text=${encodeURIComponent(msg)}` : "";
}


