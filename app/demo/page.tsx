import { BuildingCardV2 } from '@components/ui/BuildingCardV2';
import { Building } from '@types';
import { PromotionType } from '@schemas/models';

const demoBuildings: Building[] = [
  {
    id: 'demo-1',
    name: 'Mirador Las Condes',
    comuna: 'Las Condes',
    address: 'Av. Las Condes 12345',
    cover: '/images/mirador-cover.jpg',
    hero: '/images/mirador-hero.jpg',
    gallery: [
      '/images/mirador-1.jpg',
      '/images/mirador-2.jpg',
      '/images/mirador-3.jpg',
      '/images/mirador-4.jpg'
    ],
    units: [
      {
        id: 'u1',
        tipologia: '1D1B',
        price: 500000,
        m2: 45,
        estacionamiento: true,
        bodega: false,
        disponible: true
      },
      {
        id: 'u2',
        tipologia: '2D1B',
        price: 650000,
        m2: 55,
        estacionamiento: true,
        bodega: true,
        disponible: true
      },
      {
        id: 'u3',
        tipologia: '2D2B',
        price: 800000,
        m2: 70,
        estacionamiento: true,
        bodega: true,
        disponible: false
      }
    ],
    amenities: ['Piscina', 'Gimnasio', 'Estacionamiento'],
    promo: {
      label: 'Sin comisión',
      tag: 'Promoción'
    }
  },
  {
    id: 'demo-2',
    name: 'Nunoa Central',
    comuna: 'Ñuñoa',
    address: 'Av. Grecia 6789',
    cover: '/images/nunoa-cover.jpg',
    hero: '/images/nunoa-hero.jpg',
    gallery: [
      '/images/nunoa-1.jpg',
      '/images/nunoa-2.jpg',
      '/images/nunoa-3.jpg'
    ],
    units: [
      {
        id: 'u4',
        tipologia: '1D1B',
        price: 350000,
        m2: 40,
        estacionamiento: false,
        bodega: false,
        disponible: true
      },
      {
        id: 'u5',
        tipologia: '1D1B',
        price: 380000,
        m2: 42,
        estacionamiento: false,
        bodega: false,
        disponible: true
      }
    ],
    amenities: ['Terraza', 'Sala de eventos']
  },
  {
    id: 'demo-3',
    name: 'Las Condes Premium',
    comuna: 'Las Condes',
    address: 'Av. Apoquindo 11111',
    cover: '/images/lascondes-cover.jpg',
    hero: '/images/lascondes-hero.jpg',
    gallery: [
      '/images/lascondes-1.jpg',
      '/images/lascondes-2.jpg',
      '/images/lascondes-3.jpg',
      '/images/lascondes-4.jpg'
    ],
    units: [
      {
        id: 'u6',
        tipologia: '3D2B',
        price: 1200000,
        m2: 85,
        estacionamiento: true,
        bodega: true,
        disponible: false
      },
      {
        id: 'u7',
        tipologia: '4D3B',
        price: 2000000,
        m2: 120,
        estacionamiento: true,
        bodega: true,
        disponible: false
      }
    ],
    amenities: ['Piscina', 'Gimnasio', 'Spa', 'Concierge'],
    promo: {
      label: 'Financiamiento especial',
      tag: 'Oferta'
    }
  },
  {
    id: 'demo-4',
    name: 'Ñuñoa Residencial',
    comuna: 'Ñuñoa',
    address: 'Av. Irarrázaval 22222',
    cover: '/images/nunoa-cover.jpg',
    hero: '/images/nunoa-hero.jpg',
    gallery: [
      '/images/nunoa-1.jpg',
      '/images/nunoa-2.jpg'
    ],
    units: [
      {
        id: 'u8',
        tipologia: '1D1B',
        price: 280000,
        m2: 38,
        estacionamiento: false,
        bodega: false,
        disponible: true
      },
      {
        id: 'u9',
        tipologia: '2D1B',
        price: 420000,
        m2: 52,
        estacionamiento: true,
        bodega: false,
        disponible: true
      }
    ],
    amenities: ['Jardín', 'Bicicletero']
  }
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
          
          <div className="bg-[var(--card)] rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
              Características Implementadas
            </h2>
            <ul className="space-y-2 text-[var(--subtext)]">
              <li>✅ Animaciones Framer Motion</li>
              <li>✅ Cálculo automático de precio desde/hasta</li>
              <li>✅ Chips de tipología con contadores</li>
              <li>✅ Manejo de promociones y badges</li>
              <li>✅ Estados de disponibilidad</li>
              <li>✅ Accesibilidad (aria-labels)</li>
              <li>✅ Analytics tracking</li>
              <li>✅ Responsive design</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {demoBuildings.map((building, index) => (
            <BuildingCardV2
              key={building.id}
              building={building}
              priority={index < 4}
              showBadge={true}
            />
          ))}
        </div>

        <div className="mt-12 bg-[var(--card)] rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
            Estado del Sprint 1
          </h2>
          <div className="space-y-4 text-[var(--subtext)]">
            <div>
              <h3 className="font-medium text-[var(--text)]">✅ Completado:</h3>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• Paso 1: Zustand store (buildingsStore.ts)</li>
                <li>• Paso 2: Hook de datos (useBuildingsData.ts)</li>
                <li>• Paso 3: Card base (BuildingCardV2.tsx)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[var(--text)]">⏳ Pendiente:</h3>
              <ul className="ml-4 mt-2 space-y-1">
                <li>• Paso 4: Integración gradual</li>
                <li>• Paso 5: Tests y validación final</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
