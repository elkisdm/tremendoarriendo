import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
    console.log('🧹 Iniciando teardown global de tests...');
    
    // Limpiar cualquier estado global si es necesario
    // Por ejemplo, limpiar archivos temporales, cerrar conexiones, etc.
    
    console.log('✅ Teardown global completado');
}

export default globalTeardown;
