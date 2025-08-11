import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('❌ Faltan variables de entorno requeridas:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.log('\n💡 Agrega estas variables a tu .env.local:');
  console.log('   SUPABASE_URL=https://tu-proyecto.supabase.co');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false }
});

async function migrateMockData() {
  try {
    console.log('📖 Leyendo datos mock...');
    const mockData = JSON.parse(await readFile('data/buildings.json', 'utf8'));
    
    console.log(`🏢 Encontrados ${mockData.length} edificios para migrar`);
    
    for (const building of mockData) {
      console.log(`\n🔄 Migrando: ${building.name}`);
      
      // Generar UUID para el edificio
      const buildingId = randomUUID();
      
      // Insertar edificio con las columnas correctas
      const { data: buildingData, error: buildingError } = await supabase
        .from('buildings')
        .insert({
          id: buildingId,
          slug: building.slug,
          nombre: building.name,
          comuna: building.comuna,
          direccion: building.address,
          precio_desde: calculatePrecioDesde(building.units),
          has_availability: building.units.some(u => u.disponible),
          provider: 'mock',
          source_building_id: building.id
        })
        .select()
        .single();

      if (buildingError) {
        console.error(`❌ Error insertando edificio ${building.name}:`, buildingError.message);
        continue;
      }

      console.log(`✅ Edificio insertado: ${building.name} (ID: ${buildingId})`);

      // Insertar unidades del edificio con las columnas correctas
      if (building.units && building.units.length > 0) {
        const units = building.units.map(unit => ({
          id: randomUUID(),
          building_id: buildingId,
          unidad: unit.id,
          tipologia: unit.tipologia,
          area_m2: unit.m2,
          precio: unit.price,
          disponible: unit.disponible,
          bedrooms: extractBedrooms(unit.tipologia),
          bathrooms: extractBathrooms(unit.tipologia),
          provider: 'mock',
          source_unit_id: unit.id
        }));

        const { error: unitsError } = await supabase
          .from('units')
          .insert(units);

        if (unitsError) {
          console.error(`❌ Error insertando unidades de ${building.name}:`, unitsError.message);
        } else {
          console.log(`✅ ${units.length} unidades insertadas para ${building.name}`);
        }
      }
    }

    console.log('\n🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

function calculatePrecioDesde(units) {
  const disponibles = units.filter(u => u.disponible);
  if (disponibles.length === 0) return null;
  return Math.min(...disponibles.map(u => u.price));
}

function extractBedrooms(tipologia) {
  if (tipologia.includes('Studio')) return 0;
  const match = tipologia.match(/(\d+)D/);
  return match ? parseInt(match[1]) : null;
}

function extractBathrooms(tipologia) {
  const match = tipologia.match(/(\d+)B/);
  return match ? parseInt(match[1]) : null;
}

migrateMockData();
