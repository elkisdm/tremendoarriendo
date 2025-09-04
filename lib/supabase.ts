// Importación condicional de Supabase
let createClient: any;
let SupabaseClient: any;

try {
  const supabaseModule = require('@supabase/supabase-js');
  createClient = supabaseModule.createClient;
  SupabaseClient = supabaseModule.SupabaseClient;
} catch (error) {
  // Si Supabase no está disponible, usar mock
  console.warn('⚠️  @supabase/supabase-js no disponible, usando mock');
  const { createMockSupabaseClient } = require('./supabase.mock');
  
  // Mock del createClient
  createClient = () => createMockSupabaseClient();
  SupabaseClient = class MockSupabaseClient {};
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente para uso público (cliente)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : createClient(); // Mock si no hay configuración

// Cliente para uso del servidor (service role)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : createClient(); // Mock si no hay configuración

export type { SupabaseClient };
