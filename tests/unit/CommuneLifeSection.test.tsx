import { render, screen } from '@testing-library/react';
import { CommuneLifeSection } from '@/components/commune/CommuneLifeSection';
import { estacionCentralData } from '@/data/communes/estacion-central';

// Mock de framer-motion para tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    useReducedMotion: () => false,
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
        render(<CommuneLifeSection data={estacionCentralData} />);

        // Verificar que el título principal se renderiza
        expect(screen.getByText('Cómo es vivir en Estación Central')).toBeInTheDocument();

        // Verificar que los highlights se renderizan
        expect(screen.getByText('Conectividad Total')).toBeInTheDocument();
        expect(screen.getByText('Comercio Local')).toBeInTheDocument();
        expect(screen.getByText('Parques Cercanos')).toBeInTheDocument();
        expect(screen.getByText('Educación Superior')).toBeInTheDocument();

        // Verificar que el testimonio se renderiza
        expect(screen.getByText(/Vivir en Estación Central me ha dado/)).toBeInTheDocument();
        expect(screen.getByText('María González')).toBeInTheDocument();

        // Verificar que el CTA se renderiza
        expect(screen.getByText('Ver propiedades en Estación Central')).toBeInTheDocument();
    });

    it('tiene accesibilidad correcta', () => {
        render(<CommuneLifeSection data={estacionCentralData} />);

        // Verificar que tiene un aria-labelledby
        const section = screen.getByRole('region');
        expect(section).toHaveAttribute('aria-labelledby', 'commune-life-title');

        // Verificar que el título tiene el ID correcto
        const title = screen.getByText('Cómo es vivir en Estación Central');
        expect(title).toHaveAttribute('id', 'commune-life-title');
    });

    it('renderiza los iconos de highlights correctamente', () => {
        render(<CommuneLifeSection data={estacionCentralData} />);

        // Verificar que los emojis se renderizan
        expect(screen.getByText('🚇')).toBeInTheDocument();
        expect(screen.getByText('🏪')).toBeInTheDocument();
        expect(screen.getByText('🌳')).toBeInTheDocument();
        expect(screen.getByText('🎓')).toBeInTheDocument();
    });

    it('renderiza la imagen del hero correctamente', () => {
        render(<CommuneLifeSection data={estacionCentralData} />);

        const heroImage = screen.getByAltText('Vista de Estación Central');
        expect(heroImage).toBeInTheDocument();
        expect(heroImage).toHaveAttribute('src', '/images/estacioncentral-cover.jpg');
    });
});
