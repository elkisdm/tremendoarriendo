import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('❌ Faltan variables de entorno requeridas');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false }
});

async function createTables() {
  try {
    console.log('🔧 Creando tablas en Supabase...');
    
    // Crear tabla buildings
    console.log('📋 Creando tabla buildings...');
    const { error: buildingsError } = await supabase
      .from('buildings')
      .select('id')
      .limit(1);
    
    if (buildingsError && buildingsError.code === 'PGRST116') {
      console.log('✅ Tabla buildings ya existe');
    } else if (buildingsError) {
      console.log('❌ Error verificando tabla buildings:', buildingsError.message);
    } else {
      console.log('✅ Tabla buildings existe');
    }
    
    // Crear tabla units
    console.log('📋 Verificando tabla units...');
    const { error: unitsError } = await supabase
      .from('units')
      .select('id')
      .limit(1);
    
    if (unitsError && unitsError.code === 'PGRST116') {
      console.log('✅ Tabla units ya existe');
    } else if (unitsError) {
      console.log('❌ Error verificando tabla units:', unitsError.message);
    } else {
      console.log('✅ Tabla units existe');
    }
    
    console.log('🎉 Verificación completada!');
    console.log('\n💡 Si las tablas no existen, créalas manualmente en el dashboard de Supabase:');
    console.log('   1. Ve a https://supabase.com/dashboard');
    console.log('   2. Selecciona tu proyecto');
    console.log('   3. Ve a SQL Editor');
    console.log('   4. Ejecuta el contenido de supabase/schema.sql');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  }
}

createTables();
