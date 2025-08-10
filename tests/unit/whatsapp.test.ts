import { buildWaLink } from "@lib/whatsapp";

describe("buildWaLink", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE = "56912345678";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  function getDecodedTextParam(link: string): string {
    const idx = link.indexOf("?text=");
    const encoded = idx >= 0 ? link.substring(idx + 6) : "";
    return decodeURIComponent(encoded);
  }

  test("con tildes, espacios y URL se codifica correctamente", () => {
    const url = "https://hommie.cl/propiedad/las-nuñoa?ref=home banner";
    const link = buildWaLink({ propertyName: "Ático Ñuñoa", comuna: "Ñuñoa", url });
    expect(link.startsWith("https://wa.me/56912345678?text=")).toBe(true);
    const decoded = getDecodedTextParam(link);
    expect(decoded).toBe(`Hola, me interesa Ático Ñuñoa en Ñuñoa. ${url}`);
  });

  test("usa phone explícito cuando se entrega", () => {
    const link = buildWaLink({ phone: "56999999999", propertyName: "Depto Centro" });
    expect(link.startsWith("https://wa.me/56999999999?text=")).toBe(true);
  });

  test("sin teléfono retorna string vacío", () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
    const link = buildWaLink({ propertyName: "Depto Centro" });
    expect(link).toBe("");
  });
});


