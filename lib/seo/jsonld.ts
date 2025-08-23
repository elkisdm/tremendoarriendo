/**
 * Utilidad para generar JSON-LD seguro sin usar dangerouslySetInnerHTML
 * Previene ataques XSS al escapar correctamente el contenido JSON
 */

export interface JsonLdSchema {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

/**
 * Valida estructura básica de JSON-LD
 * @param obj - Objeto a validar
 * @returns true si es válido, false en caso contrario
 */
function validateJsonLdStructure(obj: unknown): obj is JsonLdSchema {
  if (!obj || typeof obj !== "object") return false;
  const rec = obj as Record<string, unknown>;
  const context = rec["@context"];
  const typeVal = rec["@type"];
  return context === "https://schema.org" && typeof typeVal === "string" && typeVal.length > 0;
}

/**
 * Escapa caracteres peligrosos en JSON para prevenir XSS
 * @param jsonString - String JSON a escapar
 * @returns String JSON escapado de forma segura
 */
function escapeJsonString(jsonString: string): string {
  return jsonString
    // Escapa </script para prevenir inyección de script
    .replace(/<\/script/gi, "\\u003C/script")
    // Escapa <!-- para prevenir comentarios HTML
    .replace(/<!--/g, "\\u003C!--")
    // Escapa --> para prevenir comentarios HTML
    .replace(/-->/g, "--\\u003E");
}

/**
 * Genera JSON-LD seguro para uso en React sin dangerouslySetInnerHTML
 * @param obj - Objeto JSON-LD a serializar
 * @returns String JSON escapado de forma segura
 */
export function safeJsonLd(obj: unknown): string {
  // Validación básica de estructura
  if (!validateJsonLdStructure(obj)) {
    // Retorna objeto vacío pero válido en caso de error
    return '{"@context":"https://schema.org","@type":"Thing"}';
  }

  try {
    // Serializa el objeto a JSON
    const jsonString = JSON.stringify(obj, null, 0);
    
    // Escapa caracteres peligrosos
    return escapeJsonString(jsonString);
  } catch (_error) {
    // Retorna objeto vacío pero válido en caso de error
    return '{"@context":"https://schema.org","@type":"Thing"}';
  }
}
