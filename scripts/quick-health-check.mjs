#!/usr/bin/env node

/**
 * Quick Health Check - Verificación rápida del estado del proyecto
 * Identifica errores críticos que necesitan corrección inmediata
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();

/**
 * Ejecuta un comando y retorna el resultado
 */
function runCommand(command, description) {
  console.log(`🔍 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      cwd: PROJECT_ROOT,
      stdio: 'pipe'
    });
    console.log(`✅ ${description} - OK`);
    return { success: true, output };
  } catch (error) {
    console.log(`❌ ${description} - ERROR`);
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message, output: error.stdout };
  }
}

/**
 * Verifica archivos críticos
 */
function checkCriticalFiles() {
  console.log('📁 Verificando archivos críticos...');
  
  const criticalFiles = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    'tailwind.config.ts',
    'app/layout.tsx',
    'app/page.tsx',
    'components/ui/Button.tsx',
    'lib/supabase.ts',
    'lib/data.ts'
  ];
  
  const missingFiles = [];
  
  criticalFiles.forEach(file => {
    if (!existsSync(join(PROJECT_ROOT, file))) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.log(`❌ Archivos críticos faltantes: ${missingFiles.join(', ')}`);
    return false;
  }
  
  console.log('✅ Todos los archivos críticos presentes');
  return true;
}

/**
 * Verifica configuración de TypeScript
 */
function checkTypeScriptConfig() {
  console.log('📝 Verificando configuración de TypeScript...');
  
  try {
    const tsconfig = JSON.parse(execSync('cat tsconfig.json', { encoding: 'utf8' }));
    
  // Verificar configuraciones importantes
  const checks = [
    { key: 'compilerOptions.strict', expected: true, name: 'strict mode' },
    { key: 'compilerOptions.noEmit', expected: true, name: 'noEmit' },
    { key: 'compilerOptions.esModuleInterop', expected: true, name: 'esModuleInterop' },
    { key: 'compilerOptions.allowSyntheticDefaultImports', expected: true, name: 'allowSyntheticDefaultImports' }
  ];
  
  let issues = [];
  
  checks.forEach(check => {
    const keys = check.key.split('.');
    let value = tsconfig;
    for (const key of keys) {
      value = value?.[key];
    }
    
    if (value !== check.expected) {
      issues.push(`${check.name}: expected ${check.expected}, got ${value}`);
    }
  });
  
  if (issues.length > 0) {
    console.log(`⚠️ Configuración TypeScript: ${issues.join(', ')}`);
  } else {
    console.log('✅ Configuración TypeScript OK');
  }
  
  return issues.length === 0;
  } catch (error) {
    console.log(`❌ Error leyendo tsconfig.json: ${error.message}`);
    return false;
  }
}

/**
 * Verifica imports rotos
 */
function checkBrokenImports() {
  console.log('🔗 Verificando imports rotos...');
  
  try {
    // Buscar archivos con imports que podrían estar rotos
    const output = execSync('grep -r "from \'@/" app/ components/ --include="*.tsx" --include="*.ts" | head -20', { 
      encoding: 'utf8',
      cwd: PROJECT_ROOT 
    });
    
    const lines = output.split('\n').filter(line => line.trim());
    console.log(`📊 Encontrados ${lines.length} imports con @/`);
    
    // Verificar algunos imports específicos que sabemos que podrían estar rotos
    const problematicImports = [
      '@/components/marketing/HeroV2',
      '@/components/marketing/FeaturedGrid',
      '@/components/marketing/HowItWorks',
      '@/components/marketing/Trust'
    ];
    
    let brokenImports = [];
    
    problematicImports.forEach(importPath => {
      if (output.includes(importPath)) {
        const file = importPath.replace('@/', '');
        if (!existsSync(join(PROJECT_ROOT, file + '.tsx'))) {
          brokenImports.push(importPath);
        }
      }
    });
    
    if (brokenImports.length > 0) {
      console.log(`❌ Imports rotos detectados: ${brokenImports.join(', ')}`);
      return false;
    }
    
    console.log('✅ No se detectaron imports rotos obvios');
    return true;
  } catch (error) {
    console.log(`⚠️ No se pudo verificar imports: ${error.message}`);
    return true; // No es crítico
  }
}

/**
 * Verifica estructura de directorios
 */
function checkDirectoryStructure() {
  console.log('📂 Verificando estructura de directorios...');
  
  const requiredDirs = [
    'app',
    'components',
    'lib',
    'docs',
    'config',
    'scripts',
    'tests',
    'types'
  ];
  
  const missingDirs = [];
  
  requiredDirs.forEach(dir => {
    if (!existsSync(join(PROJECT_ROOT, dir))) {
      missingDirs.push(dir);
    }
  });
  
  if (missingDirs.length > 0) {
    console.log(`❌ Directorios faltantes: ${missingDirs.join(', ')}`);
    return false;
  }
  
  console.log('✅ Estructura de directorios OK');
  return true;
}

/**
 * Verifica scripts de package.json
 */
function checkPackageScripts() {
  console.log('📦 Verificando scripts de package.json...');
  
  try {
    const packageJson = JSON.parse(execSync('cat package.json', { encoding: 'utf8' }));
    const requiredScripts = [
      'dev',
      'build',
      'start',
      'lint',
      'typecheck',
      'test',
      'cleanup:files',
      'methodology:check'
    ];
    
    const missingScripts = [];
    
    requiredScripts.forEach(script => {
      if (!packageJson.scripts[script]) {
        missingScripts.push(script);
      }
    });
    
    if (missingScripts.length > 0) {
      console.log(`❌ Scripts faltantes: ${missingScripts.join(', ')}`);
      return false;
    }
    
    console.log('✅ Scripts de package.json OK');
    return true;
  } catch (error) {
    console.log(`❌ Error leyendo package.json: ${error.message}`);
    return false;
  }
}

/**
 * Genera reporte de salud
 */
function generateHealthReport(results) {
  console.log('\n📊 REPORTE DE SALUD DEL PROYECTO');
  console.log('==================================');
  
  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(Boolean).length;
  const healthScore = Math.round((passedChecks / totalChecks) * 100);
  
  console.log(`📈 Puntuación de salud: ${healthScore}%`);
  console.log(`✅ Checks pasados: ${passedChecks}/${totalChecks}`);
  
  if (healthScore >= 80) {
    console.log('🎉 Proyecto en buen estado - Listo para desarrollo');
  } else if (healthScore >= 60) {
    console.log('⚠️ Proyecto en estado aceptable - Requiere algunas correcciones');
  } else {
    console.log('🚨 Proyecto requiere atención inmediata - Errores críticos detectados');
  }
  
  console.log('\n📋 RESUMEN DE CHECKS:');
  Object.entries(results).forEach(([check, passed]) => {
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${check}`);
  });
  
  return {
    healthScore,
    passedChecks,
    totalChecks,
    results
  };
}

/**
 * Función principal
 */
function main() {
  console.log('🏥 INICIANDO VERIFICACIÓN DE SALUD DEL PROYECTO\n');
  
  const results = {
    'Archivos críticos': checkCriticalFiles(),
    'Configuración TypeScript': checkTypeScriptConfig(),
    'Imports rotos': checkBrokenImports(),
    'Estructura directorios': checkDirectoryStructure(),
    'Scripts package.json': checkPackageScripts()
  };
  
  const report = generateHealthReport(results);
  
  console.log('\n🎯 PRÓXIMOS PASOS RECOMENDADOS:');
  
  if (report.healthScore < 80) {
    console.log('1. Corregir errores críticos identificados');
    console.log('2. Ejecutar: pnpm run typecheck');
    console.log('3. Ejecutar: pnpm run build');
    console.log('4. Ejecutar: pnpm run test:all');
  } else {
    console.log('1. Ejecutar: pnpm run methodology:check');
    console.log('2. Ejecutar: pnpm run quality:gates');
    console.log('3. Continuar con desarrollo normal');
  }
  
  console.log('\n📚 Para más detalles, consulta: ROADMAP_DESARROLLO_ORDENADO.md');
  
  return report;
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { 
  checkCriticalFiles,
  checkTypeScriptConfig,
  checkBrokenImports,
  checkDirectoryStructure,
  checkPackageScripts,
  generateHealthReport
};
