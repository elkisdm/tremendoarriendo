#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan credenciales de Supabase');
  process.exit(1);
}

// Crear cliente con service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estructura de las tablas...');
    
    // Verificar estructura de buildings
    console.log('\n📋 Estructura de la tabla buildings:');
    const { data: buildingsSample, error: buildingsError } = await supabase
      .from('buildings')
      .select('*')
      .limit(1);
    
    if (buildingsError) {
      console.error('❌ Error accediendo a buildings:', buildingsError.message);
    } else {
      console.log('✅ Tabla buildings accesible');
      if (buildingsSample && buildingsSample.length > 0) {
        console.log('📊 Columnas disponibles:', Object.keys(buildingsSample[0]));
      }
    }
    
    // Verificar estructura de units
    console.log('\n📋 Estructura de la tabla units:');
    const { data: unitsSample, error: unitsError } = await supabase
      .from('units')
      .select('*')
      .limit(1);
    
    if (unitsError) {
      console.error('❌ Error accediendo a units:', unitsError.message);
    } else {
      console.log('✅ Tabla units accesible');
      if (unitsSample && unitsSample.length > 0) {
        console.log('📊 Columnas disponibles:', Object.keys(unitsSample[0]));
      }
    }
    
    // Intentar insertar un registro de prueba para ver qué columnas son requeridas
    console.log('\n🧪 Probando inserción de prueba...');
    
    const testBuilding = {
      id: 'test-building-1',
      slug: 'test-building-1',
      nombre: 'Test Building',
      comuna: 'Test Comuna',
      direccion: 'Test Address',
      precio_desde: 500000,
      has_availability: true
    };
    
    const { error: insertError } = await supabase
      .from('buildings')
      .insert(testBuilding);
    
    if (insertError) {
      console.error('❌ Error en inserción de prueba:', insertError.message);
      console.log('💡 Columnas requeridas que faltan o son incorrectas');
    } else {
      console.log('✅ Inserción de prueba exitosa');
      
      // Limpiar el registro de prueba
      await supabase.from('buildings').delete().eq('id', 'test-building-1');
    }
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
  }
}

checkTableStructure();
