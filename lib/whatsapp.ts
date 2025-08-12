export function buildWaLink({ phone, propertyName, comuna, url }: { phone?: string; propertyName?: string; comuna?: string; url?: string }) {
  const p = phone ?? process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
  const msg = `Hola, me interesa ${propertyName ?? ""} en ${comuna ?? ""}. ${url ?? ""}`.trim();
  return p ? `https://wa.me/${p}?text=${encodeURIComponent(msg)}` : "";
}

export function buildWhatsAppUrl(opts?: { 
  phoneE164?: string; 
  message?: string; 
  url?: string 
}): string | null {
  // Prioridad 1: Si NEXT_PUBLIC_WA_URL existe → devolverla tal cual
  if (process.env.NEXT_PUBLIC_WA_URL) {
    return process.env.NEXT_PUBLIC_WA_URL;
  }

  // Prioridad 2: Si WA_PHONE_E164 existe → construir https://wa.me/<E164>?text=<urlencoded(WA_MESSAGE||'Hola')>
  const phoneE164 = opts?.phoneE164 || process.env.WA_PHONE_E164;
  if (phoneE164) {
    const message = opts?.message || process.env.WA_MESSAGE || 'Hola';
    const url = opts?.url || '';
    const fullMessage = url ? `${message} ${url}`.trim() : message;
    return `https://wa.me/${phoneE164}?text=${encodeURIComponent(fullMessage)}`;
  }

  // Prioridad 3: Si no hay datos → devolver null
  return null;
}


