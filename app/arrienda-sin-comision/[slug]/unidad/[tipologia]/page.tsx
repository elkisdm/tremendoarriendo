import { redirect } from "next/navigation";

interface UnidadPageProps {
    params: Promise<{
        slug: string;
        tipologia: string;
    }>;
}

export default async function UnidadPage({ params }: UnidadPageProps) {
    const { slug, tipologia } = await params;

    // Mapeo de tipologías a departamentos específicos para home-amengual
    if (slug === "home-amengual") {
        switch (tipologia) {
            case "1-dormitorio":
                // Redirigir al departamento 207 (el más barato de 1 dormitorio)
                redirect("/property/home-amengual?unit=207");
                break;
            case "2-dormitorios":
                // Redirigir al departamento 401 (el más barato de 2 dormitorios)
                redirect("/property/home-amengual?unit=401");
                break;
            case "4-dormitorios":
                // Redirigir al departamento 501 (el más barato de 4 dormitorios)
                redirect("/property/home-amengual?unit=501");
                break;
            default:
                // Para cualquier otra tipología, redirigir al departamento 207
                redirect("/property/home-amengual?unit=207");
        }
    }

    // Para otros edificios, redirigir a la página principal del edificio
    redirect(`/arrienda-sin-comision/${slug}`);
}
