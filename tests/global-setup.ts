import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    console.log('🚀 Iniciando setup global de tests...');
    
    // Verificar que el servidor esté funcionando
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:3002/property/home-amengual?unit=207', {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        
        console.log('✅ Servidor de desarrollo está funcionando');
        
        // Verificar que la página carga correctamente
        await page.waitForSelector('text=Agendar Visita', { timeout: 10000 });
        console.log('✅ Página de propiedad carga correctamente');
        
    } catch (error) {
        console.error('❌ Error en setup global:', error);
        throw error;
    } finally {
        await browser.close();
    }
    
    console.log('🎉 Setup global completado');
}

export default globalSetup;
