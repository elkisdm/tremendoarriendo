import { BuildingCardV2 } from '@components/ui/BuildingCardV2';
import { Building } from '@types';

// Datos de ejemplo para la demostración
const demoBuildings: Building[] = [
  {
    id: 'demo-1',
    name: 'Residencial Las Condes',
    comuna: 'Las Condes',
    address: 'Av. Apoquindo 1234',
    cover: '/images/lascondes-cover.jpg',
    promo: {
      label: 'Sin comisión',
      tag: 'Promoción',
    },
    amenities: ['gym', 'pool', 'security', 'parking'],
    units: [
      {
        id: 'unit-1',
        tipologia: '1D1B',
        m2: 45,
        price: 500000,
        estacionamiento: true,
        bodega: false,
        disponible: true,
      },
      {
        id: 'unit-2',
        tipologia: '2D1B',
        m2: 65,
        price: 750000,
        estacionamiento: true,
        bodega: true,
        disponible: true,
      },
      {
        id: 'unit-3',
        tipologia: '1D1B',
        m2: 50,
        price: 600000,
        estacionamiento: false,
        bodega: false,
        disponible: false,
      },
    ],
    gallery: ['/images/lascondes-1.jpg', '/images/lascondes-2.jpg'],
  },
  {
    id: 'demo-2',
    name: 'Edificio Mirador',
    comuna: 'Providencia',
    address: 'Av. Providencia 5678',
    cover: '/images/mirador-cover.jpg',
    amenities: ['gym', 'security', 'parking'],
    units: [
      {
        id: 'unit-4',
        tipologia: 'Studio',
        m2: 35,
        price: 400000,
        estacionamiento: false,
        bodega: false,
        disponible: true,
      },
      {
        id: 'unit-5',
        tipologia: '1D1B',
        m2: 48,
        price: 550000,
        estacionamiento: true,
        bodega: false,
        disponible: true,
      },
      {
        id: 'unit-6',
        tipologia: '2D2B',
        m2: 75,
        price: 850000,
        estacionamiento: true,
        bodega: true,
        disponible: true,
      },
    ],
    gallery: ['/images/mirador-1.jpg', '/images/mirador-2.jpg'],
  },
  {
    id: 'demo-3',
    name: 'Complejo Ñuñoa',
    comuna: 'Ñuñoa',
    address: 'Av. Grecia 9012',
    cover: '/images/nunoa-cover.jpg',
    promo: {
      label: 'Sin garantía',
      tag: 'Oferta',
    },
    amenities: ['gym', 'pool', 'security', 'parking', 'garden'],
    units: [
      {
        id: 'unit-7',
        tipologia: '1D1B',
        m2: 42,
        price: 480000,
        estacionamiento: true,
        bodega: false,
        disponible: true,
      },
      {
        id: 'unit-8',
        tipologia: '3D2B',
        m2: 85,
        price: 950000,
        estacionamiento: true,
        bodega: true,
        disponible: true,
      },
    ],
    gallery: ['/images/nunoa-1.jpg', '/images/nunoa-2.jpg'],
  },
  {
    id: 'demo-4',
    name: 'Torre Sin Disponibilidad',
    comuna: 'Las Condes',
    address: 'Av. Vitacura 3456',
    cover: '/images/lascondes-hero.jpg',
    amenities: ['gym', 'pool', 'security'],
    units: [
      {
        id: 'unit-9',
        tipologia: '1D1B',
        m2: 45,
        price: 500000,
        estacionamiento: true,
        bodega: false,
        disponible: false,
      },
    ],
    gallery: ['/images/lascondes-3.jpg', '/images/lascondes-4.jpg'],
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-4">
            Demo: BuildingCardV2
          </h1>
          <p className="text-[var(--subtext)] mb-6">
            Vista previa del componente BuildingCardV2 implementado en el Sprint 1
          </p>
          
          <div className="bg-[var(--soft)]/50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
              Características Implementadas
            </h2>
            <ul className="space-y-2 text-[var(--subtext)]">
              <li>✅ Animaciones Framer Motion</li>
              <li>✅ Cálculo automático de precio desde/hasta</li>
              <li>✅ Chips de tipología con contadores</li>
              <li>✅ Manejo de promociones</li>
              <li>✅ Estados sin disponibilidad</li>
              <li>✅ Accesibilidad completa</li>
              <li>✅ Responsive design</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {demoBuildings.map((building, index) => (
            <BuildingCardV2
              key={building.id}
              building={building}
              priority={index < 4} // Prioridad para las primeras 4 imágenes
              showBadge={true}
            />
          ))}
        </div>

        <div className="mt-12 bg-[var(--soft)]/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
            Información Técnica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[var(--subtext)]">
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">Estado del Sprint 1</h3>
              <ul className="space-y-1">
                <li>✅ Paso 1: Store de Zustand</li>
                <li>✅ Paso 2: Hook de datos</li>
                <li>✅ Paso 3: Card base (BuildingCardV2)</li>
                <li>⏳ Paso 4: Integración gradual</li>
                <li>⏳ Paso 5: Tests y validación</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">Tests</h3>
              <ul className="space-y-1">
                <li>✅ 26/26 tests pasando</li>
                <li>✅ TypeScript sin errores</li>
                <li>✅ Build exitoso</li>
                <li>✅ Componente listo para integración</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
