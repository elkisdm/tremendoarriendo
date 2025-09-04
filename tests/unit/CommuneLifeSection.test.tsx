import { render, screen } from '@testing-library/react';
import { CommuneLifeSection } from '@/components/commune/CommuneLifeSection';
import { estacionCentralData } from '@/data/communes/estacion-central';

// Mock de framer-motion para tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    },
    useReducedMotion: () => false,
}));

// Mock de lucide-react para tests
jest.mock('lucide-react', () => ({
    MapPin: ({ className, ...props }: any) => <span className={className} {...props}>📍</span>,
    Users: ({ className, ...props }: any) => <span className={className} {...props}>👥</span>,
    Car: ({ className, ...props }: any) => <span className={className} {...props}>🚗</span>,
    Leaf: ({ className, ...props }: any) => <span className={className} {...props}>🌿</span>,
    Star: ({ className, ...props }: any) => <span className={className} {...props}>⭐</span>,
    ArrowRight: ({ className, ...props }: any) => <span className={className} {...props}>→</span>,
}));

// Mock de next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock de next/link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe('CommuneLifeSection', () => {
    it('renderiza correctamente con datos de Estación Central', () => {
        render(<CommuneLifeSection
            commune={estacionCentralData.name}
            heroImage={estacionCentralData.hero.image}
            highlights={estacionCentralData.highlights.map(h => ({
                icon: () => <span>{h.icon}</span>,
                title: h.title,
                description: h.description
            }))}
            testimonial={{
                text: estacionCentralData.testimonial.quote,
                author: estacionCentralData.testimonial.author,
                rating: 5
            }}
            mapPins={estacionCentralData.map.pins.map(pin => ({
                name: pin.label,
                type: 'metro' as const,
                coordinates: [pin.position.x, pin.position.y]
            }))}
        />);

        // Verificar que el título principal se renderiza
        expect(screen.getByText('Cómo es vivir en Estación Central')).toBeInTheDocument();

        // Verificar que los highlights se renderizan
        expect(screen.getByText('Conectividad Total')).toBeInTheDocument();
        expect(screen.getByText('Comercio Local')).toBeInTheDocument();
        expect(screen.getByText('Parques Cercanos')).toBeInTheDocument();
        expect(screen.getByText('Educación Superior')).toBeInTheDocument();

        // Verificar que el testimonio se renderiza
        expect(screen.getByText(/Vivir en Estación Central me ha dado/)).toBeInTheDocument();
        expect(screen.getByText(/María González/)).toBeInTheDocument();

        // Verificar que el CTA se renderiza
        expect(screen.getByText(/Ver más propiedades en Estación Central/)).toBeInTheDocument();
    });

    it('tiene accesibilidad correcta', () => {
        render(<CommuneLifeSection
            commune={estacionCentralData.name}
            heroImage={estacionCentralData.hero.image}
            highlights={estacionCentralData.highlights.map(h => ({
                icon: () => <span>{h.icon}</span>,
                title: h.title,
                description: h.description
            }))}
            testimonial={{
                text: estacionCentralData.testimonial.quote,
                author: estacionCentralData.testimonial.author,
                rating: 5
            }}
            mapPins={estacionCentralData.map.pins.map(pin => ({
                name: pin.label,
                type: 'metro' as const,
                coordinates: [pin.position.x, pin.position.y]
            }))}
        />);

        // Verificar que el título se renderiza correctamente
        const title = screen.getByText('Cómo es vivir en Estación Central');
        expect(title).toBeInTheDocument();
    });

    it('renderiza los iconos de highlights correctamente', () => {
        render(<CommuneLifeSection
            commune={estacionCentralData.name}
            heroImage={estacionCentralData.hero.image}
            highlights={estacionCentralData.highlights.map(h => ({
                icon: () => <span>{h.icon}</span>,
                title: h.title,
                description: h.description
            }))}
            testimonial={{
                text: estacionCentralData.testimonial.quote,
                author: estacionCentralData.testimonial.author,
                rating: 5
            }}
            mapPins={estacionCentralData.map.pins.map(pin => ({
                name: pin.label,
                type: 'metro' as const,
                coordinates: [pin.position.x, pin.position.y]
            }))}
        />);

        // Verificar que los highlights se renderizan
        expect(screen.getByText('Conectividad Total')).toBeInTheDocument();
        expect(screen.getByText('Comercio Local')).toBeInTheDocument();
        expect(screen.getByText('Parques Cercanos')).toBeInTheDocument();
        expect(screen.getByText('Educación Superior')).toBeInTheDocument();
    });

    it('renderiza la imagen del hero correctamente', () => {
        render(<CommuneLifeSection
            commune={estacionCentralData.name}
            heroImage={estacionCentralData.hero.image}
            highlights={estacionCentralData.highlights.map(h => ({
                icon: () => <span>{h.icon}</span>,
                title: h.title,
                description: h.description
            }))}
            testimonial={{
                text: estacionCentralData.testimonial.quote,
                author: estacionCentralData.testimonial.author,
                rating: 5
            }}
            mapPins={estacionCentralData.map.pins.map(pin => ({
                name: pin.label,
                type: 'metro' as const,
                coordinates: [pin.position.x, pin.position.y]
            }))}
        />);

        const heroImage = screen.getByAltText('Vista de Estación Central');
        expect(heroImage).toBeInTheDocument();
        expect(heroImage).toHaveAttribute('src', '/images/estacioncentral-cover.jpg');
    });
});
