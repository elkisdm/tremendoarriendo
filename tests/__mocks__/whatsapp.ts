// Mock para el módulo whatsapp
const buildWhatsAppUrl = (params: { message?: string; phone?: string; propertyName?: string; comuna?: string; url?: string }) => {
  // Retorna una URL mock para testing
  const baseUrl = 'https://wa.me/1234567890';
  const message = params.message || 'Hola, me interesa';
  const encodedMessage = encodeURIComponent(message);
  return `${baseUrl}?text=${encodedMessage}`;
};

export { buildWhatsAppUrl };
