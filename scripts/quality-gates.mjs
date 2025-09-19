#!/usr/bin/env node

/**
 * Quality Gates - Sistema de validación de calidad
 * Ejecuta todas las validaciones de calidad del proyecto
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
    console.log(`✅ ${description} - Exitoso`);
    return { success: true, output };
  } catch (error) {
    console.log(`❌ ${description} - Fallido`);
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message, output: error.stdout };
  }
}

/**
 * Quality Gate 1: TypeScript Check
 */
function checkTypeScript() {
  return runCommand('pnpm run typecheck', 'TypeScript Check');
}

/**
 * Quality Gate 2: Linting
 */
function checkLinting() {
  return runCommand('pnpm run lint', 'ESLint Check');
}

/**
 * Quality Gate 3: Build
 */
function checkBuild() {
  return runCommand('pnpm run build', 'Build Check');
}

/**
 * Quality Gate 4: Unit Tests
 */
function checkUnitTests() {
  return runCommand('pnpm run test:unit', 'Unit Tests');
}

/**
 * Quality Gate 5: Integration Tests
 */
function checkIntegrationTests() {
  return runCommand('pnpm run test:integration', 'Integration Tests');
}

/**
 * Quality Gate 6: E2E Tests
 */
function checkE2ETests() {
  return runCommand('pnpm run test:e2e', 'E2E Tests');
}

/**
 * Quality Gate 7: Performance Tests
 */
function checkPerformanceTests() {
  return runCommand('pnpm run test:performance', 'Performance Tests');
}

/**
 * Quality Gate 8: Accessibility Tests
 */
function checkAccessibilityTests() {
  return runCommand('pnpm run test:accessibility', 'Accessibility Tests');
}

/**
 * Quality Gate 9: Smoke Tests
 */
function checkSmokeTests() {
  return runCommand('pnpm run smoke', 'Smoke Tests');
}

/**
 * Quality Gate 10: Security Check
 */
function checkSecurity() {
  // Verificar que no hay dependencias vulnerables
  try {
    const output = execSync('pnpm audit --audit-level moderate', { 
      encoding: 'utf8', 
      cwd: PROJECT_ROOT,
      stdio: 'pipe'
    });
    console.log('✅ Security Check - Exitoso');
    return { success: true, output };
  } catch (error) {
    console.log('⚠️ Security Check - Vulnerabilidades encontradas');
    console.log(`Output: ${error.stdout}`);
    return { success: false, error: error.message, output: error.stdout };
  }
}

/**
 * Quality Gate 11: Bundle Size Check
 */
function checkBundleSize() {
  try {
    // Verificar que el build existe
    if (!existsSync(join(PROJECT_ROOT, '.next'))) {
      console.log('❌ Bundle Size Check - Build no encontrado');
      return { success: false, error: 'Build not found' };
    }

    // Verificar tamaño del bundle
    const output = execSync('du -sh .next', { 
      encoding: 'utf8', 
      cwd: PROJECT_ROOT 
    });
    
    const size = output.split('\t')[0];
    console.log(`✅ Bundle Size Check - Tamaño: ${size}`);
    return { success: true, output: size };
  } catch (error) {
    console.log('❌ Bundle Size Check - Fallido');
    return { success: false, error: error.message };
  }
}

/**
 * Quality Gate 12: Environment Check
 */
function checkEnvironment() {
  const requiredFiles = [
    '.env.local',
    'package.json',
    'next.config.mjs',
    'tailwind.config.ts',
    'tsconfig.json'
  ];

  const missingFiles = requiredFiles.filter(file => 
    !existsSync(join(PROJECT_ROOT, file))
  );

  if (missingFiles.length > 0) {
    console.log(`❌ Environment Check - Archivos faltantes: ${missingFiles.join(', ')}`);
    return { success: false, error: `Missing files: ${missingFiles.join(', ')}` };
  }

  console.log('✅ Environment Check - Exitoso');
  return { success: true };
}

/**
 * Ejecuta todos los quality gates
 */
function runAllQualityGates() {
  console.log('🚀 Iniciando Quality Gates...\n');

  const gates = [
    { name: 'TypeScript Check', fn: checkTypeScript },
    { name: 'ESLint Check', fn: checkLinting },
    { name: 'Build Check', fn: checkBuild },
    { name: 'Unit Tests', fn: checkUnitTests },
    { name: 'Integration Tests', fn: checkIntegrationTests },
    { name: 'E2E Tests', fn: checkE2ETests },
    { name: 'Performance Tests', fn: checkPerformanceTests },
    { name: 'Accessibility Tests', fn: checkAccessibilityTests },
    { name: 'Smoke Tests', fn: checkSmokeTests },
    { name: 'Security Check', fn: checkSecurity },
    { name: 'Bundle Size Check', fn: checkBundleSize },
    { name: 'Environment Check', fn: checkEnvironment }
  ];

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const gate of gates) {
    const result = gate.fn();
    results.push({ name: gate.name, ...result });
    
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
    console.log(''); // Línea en blanco para separar
  }

  // Resumen
  console.log('📊 RESUMEN DE QUALITY GATES');
  console.log('========================');
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log(`📈 Tasa de éxito: ${((passed / gates.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n❌ GATES FALLIDOS:');
    results
      .filter(r => !r.success)
      .forEach(r => console.log(`  - ${r.name}: ${r.error || 'Error desconocido'}`));
  }

  return {
    total: gates.length,
    passed,
    failed,
    success: failed === 0,
    results
  };
}

/**
 * Ejecuta quality gates específicos
 */
function runSpecificGates(gateNames) {
  console.log(`🎯 Ejecutando gates específicos: ${gateNames.join(', ')}\n`);

  const allGates = {
    'typescript': checkTypeScript,
    'linting': checkLinting,
    'build': checkBuild,
    'unit': checkUnitTests,
    'integration': checkIntegrationTests,
    'e2e': checkE2ETests,
    'performance': checkPerformanceTests,
    'accessibility': checkAccessibilityTests,
    'smoke': checkSmokeTests,
    'security': checkSecurity,
    'bundle': checkBundleSize,
    'environment': checkEnvironment
  };

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const gateName of gateNames) {
    if (allGates[gateName]) {
      const result = allGates[gateName]();
      results.push({ name: gateName, ...result });
      
      if (result.success) {
        passed++;
      } else {
        failed++;
      }
    } else {
      console.log(`⚠️ Gate desconocido: ${gateName}`);
    }
  }

  return {
    total: gateNames.length,
    passed,
    failed,
    success: failed === 0,
    results
  };
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Ejecutar todos los gates
    const result = runAllQualityGates();
    process.exit(result.success ? 0 : 1);
  } else {
    // Ejecutar gates específicos
    const result = runSpecificGates(args);
    console.log(`\n📊 Resultado: ${result.passed}/${result.total} gates pasaron`);
    process.exit(result.success ? 0 : 1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { 
  runAllQualityGates, 
  runSpecificGates,
  checkTypeScript,
  checkLinting,
  checkBuild,
  checkUnitTests,
  checkIntegrationTests,
  checkE2ETests,
  checkPerformanceTests,
  checkAccessibilityTests,
  checkSmokeTests,
  checkSecurity,
  checkBundleSize,
  checkEnvironment
};
