import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import FlashVideosPage from "@/app/(marketing)/flash-videos/page";

// Mock del servidor MSW para simular la API
const server = setupServer(
    rest.get("/api/flash-videos/cupos", (req, res, ctx) => {
        return res(
            ctx.json({
                cuposDisponibles: 7,
                total: 10,
                porcentaje: 70,
                timestamp: new Date().toISOString(),
            })
        );
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock de los componentes que requieren "use client"
jest.mock("@/components/marketing/CuposCounter", () => {
    return function MockCuposCounter() {
        return <div data-testid="cupos-counter">7/10 cupos</div>;
    };
});

jest.mock("@/components/marketing/WhatsAppCTA", () => {
    return function MockWhatsAppCTA({ children, ...props }: any) {
        return (
            <a href={props.href} data-testid="whatsapp-cta" {...props}>
                {children}
            </a>
        );
    };
});

jest.mock("@/components/seo/FlashVideosJsonLd", () => {
    return function MockFlashVideosJsonLd() {
        return <div data-testid="json-ld" />;
    };
});

jest.mock("@/components/seo/OptimizedImages", () => {
    return function MockOptimizedImages() {
        return <div data-testid="optimized-images" />;
    };
});

describe("Flash Videos Page", () => {
    it("renderiza la página completa sin errores", async () => {
        render(<FlashVideosPage />);

        // Verificar elementos principales
        expect(screen.getByText("2 videos que venden tu arriendo en 72 horas")).toBeInTheDocument();
        expect(screen.getByText("¿Qué incluye tu Pack Dúo?")).toBeInTheDocument();
        expect(screen.getByText("Planes y Add-ons")).toBeInTheDocument();
        expect(screen.getByText("Proceso en 3 pasos")).toBeInTheDocument();
        expect(screen.getByText("Preguntas frecuentes")).toBeInTheDocument();
    });

    it("muestra el contador de cupos", () => {
        render(<FlashVideosPage />);
        expect(screen.getByTestId("cupos-counter")).toBeInTheDocument();
    });

    it("incluye CTAs de WhatsApp", () => {
        render(<FlashVideosPage />);
        const ctas = screen.getAllByTestId("whatsapp-cta");
        expect(ctas.length).toBeGreaterThan(0);
    });

    it("muestra los tres planes de precios", () => {
        render(<FlashVideosPage />);

        expect(screen.getByText("$50")).toBeInTheDocument();
        expect(screen.getByText("$100")).toBeInTheDocument();
        expect(screen.getByText("$150")).toBeInTheDocument();

        expect(screen.getByText("Pack Base")).toBeInTheDocument();
        expect(screen.getByText("+ Meta Ads")).toBeInTheDocument();
        expect(screen.getByText("+ ManyChat")).toBeInTheDocument();
    });

    it("incluye el badge 'MÁS POPULAR' en el plan Meta Ads", () => {
        render(<FlashVideosPage />);
        expect(screen.getByText("MÁS POPULAR")).toBeInTheDocument();
    });

    it("muestra el proceso en 3 pasos", () => {
        render(<FlashVideosPage />);

        expect(screen.getByText("Reserva tu cupo")).toBeInTheDocument();
        expect(screen.getByText("Entrevista rápida")).toBeInTheDocument();
        expect(screen.getByText("Entrega en 72h")).toBeInTheDocument();
    });

    it("incluye FAQ con preguntas comunes", () => {
        render(<FlashVideosPage />);

        expect(screen.getByText("¿Qué pasa si no me gustan los videos?")).toBeInTheDocument();
        expect(screen.getByText("¿Puedo usar los videos en otras redes sociales?")).toBeInTheDocument();
        expect(screen.getByText("¿Qué necesito proporcionar?")).toBeInTheDocument();
        expect(screen.getByText("¿Por qué solo 10 cupos?")).toBeInTheDocument();
    });

    it("incluye elementos SEO", () => {
        render(<FlashVideosPage />);

        expect(screen.getByTestId("json-ld")).toBeInTheDocument();
        expect(screen.getByTestId("optimized-images")).toBeInTheDocument();
    });

    it("muestra la sección de urgencia en el footer", () => {
        render(<FlashVideosPage />);

        expect(screen.getByText("⚠️ Oferta por tiempo limitado")).toBeInTheDocument();
        expect(screen.getByText("¿Listo para arrendar más rápido?")).toBeInTheDocument();
        expect(screen.getByText("🚀 Reservar mi cupo ahora")).toBeInTheDocument();
    });
});


