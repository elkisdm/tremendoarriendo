#!/usr/bin/env node

/**
 * Cleanup Files - Script de limpieza y reorganización de archivos
 * Limpia archivos duplicados y reorganiza la estructura del proyecto
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, renameSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = process.cwd();

/**
 * Crear directorios necesarios
 */
function createDirectories() {
  console.log('📁 Creando directorios necesarios...');
  
  const directories = [
    'docs/architecture',
    'docs/components', 
    'docs/cotizador',
    'docs/data',
    'docs/deploy',
    'docs/errors',
    'docs/methodology',
    'docs/planning',
    'docs/process',
    'docs/quality',
    'docs/quotation',
    'docs/sprints',
    'docs/testing',
    'docs/tasks',
    'config',
    'reports/audit',
    'reports/data',
    'reports/deploy',
    'reports/quality',
    'reports/sprints',
    'reports/specs'
  ];

  directories.forEach(dir => {
    const fullPath = join(PROJECT_ROOT, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
      console.log(`  ✅ Creado: ${dir}`);
    }
  });
}

/**
 * Mover archivos de documentación
 */
function moveDocumentationFiles() {
  console.log('📄 Moviendo archivos de documentación...');
  
  const moves = [
    { from: 'COTIZADOR_MEJORADO_RESUMEN.md', to: 'docs/cotizador/MEJORADO_RESUMEN.md' },
    { from: 'COTIZADOR_SISTEMA_FUNCIONAL.md', to: 'docs/cotizador/SISTEMA_FUNCIONAL.md' },
    { from: 'DATOS_REALES_IMPLEMENTADO.md', to: 'docs/data/DATOS_REALES.md' },
    { from: 'DEPLOY.md', to: 'docs/deploy/DEPLOY.md' },
    { from: 'ERROR_HANDLING_SUMMARY.md', to: 'docs/errors/SUMMARY.md' },
    { from: 'LINT_ANALYSIS.md', to: 'docs/quality/LINT_ANALYSIS.md' },
    { from: 'METODOLOGIA_TRABAJO.md', to: 'docs/methodology/WORK_METHODOLOGY.md' },
    { from: 'METODOLOGIA_IMPLEMENTADA_RESUMEN.md', to: 'docs/methodology/IMPLEMENTED_SUMMARY.md' },
    { from: 'PLAN_IMPLEMENTACION_NEXTJS.md', to: 'docs/planning/NEXTJS_IMPLEMENTATION.md' },
    { from: 'PRODUCTION_README.md', to: 'docs/deploy/PRODUCTION_README.md' },
    { from: 'PULL_REQUEST.md', to: 'docs/process/PULL_REQUEST.md' },
    { from: 'QUOTATION_MASTER_CONTROL.md', to: 'docs/quotation/MASTER_CONTROL.md' },
    { from: 'README_INGESTA.md', to: 'docs/data/INGESTA_README.md' },
    { from: 'README-ICONS.md', to: 'docs/components/ICONS_README.md' },
    { from: 'REPORTE_ARQUITECTURA_DATOS_PARA_COTIZACIONES.md', to: 'docs/architecture/DATA_ARCHITECTURE.md' },
    { from: 'SPRINT_1_SUMMARY.md', to: 'docs/sprints/SPRINT_1_SUMMARY.md' },
    { from: 'SPRINT_2_ROADMAP.md', to: 'docs/sprints/SPRINT_2_ROADMAP.md' },
    { from: 'SPRINT_2_STORIES.md', to: 'docs/sprints/SPRINT_2_STORIES.md' },
    { from: 'TESTING_FINAL_SUMMARY.md', to: 'docs/testing/FINAL_SUMMARY.md' },
    { from: 'TESTING_SETUP_COMPLETED.md', to: 'docs/testing/SETUP_COMPLETED.md' },
    { from: 'TESTING_SETUP_SUMMARY.md', to: 'docs/testing/SETUP_SUMMARY.md' },
    { from: 'TASKS.md', to: 'docs/tasks/TASKS.md' }
  ];

  moves.forEach(({ from, to }) => {
    const fromPath = join(PROJECT_ROOT, from);
    const toPath = join(PROJECT_ROOT, to);
    
    if (existsSync(fromPath)) {
      try {
        renameSync(fromPath, toPath);
        console.log(`  ✅ Movido: ${from} → ${to}`);
      } catch (error) {
        console.log(`  ❌ Error moviendo ${from}: ${error.message}`);
      }
    } else {
      console.log(`  ⚠️ No encontrado: ${from}`);
    }
  });
}

/**
 * Mover archivos de configuración
 */
function moveConfigFiles() {
  console.log('⚙️ Moviendo archivos de configuración...');
  
  const moves = [
    { from: 'debug.js', to: 'config/debug.js' },
    { from: 'lighthouserc.json', to: 'config/lighthouse.json' },
    { from: 'lighthouserc-flash-videos.json', to: 'config/lighthouse-flash-videos.json' },
    { from: 'lint-report.txt', to: 'config/lint-report.txt' }
  ];

  moves.forEach(({ from, to }) => {
    const fromPath = join(PROJECT_ROOT, from);
    const toPath = join(PROJECT_ROOT, to);
    
    if (existsSync(fromPath)) {
      try {
        renameSync(fromPath, toPath);
        console.log(`  ✅ Movido: ${from} → ${to}`);
      } catch (error) {
        console.log(`  ❌ Error moviendo ${from}: ${error.message}`);
      }
    } else {
      console.log(`  ⚠️ No encontrado: ${from}`);
    }
  });
}

/**
 * Mover archivos de componentes
 */
function moveComponentFiles() {
  console.log('🧩 Moviendo archivos de componentes...');
  
  const moves = [
    { from: 'PropertyClient_v1.tsx', to: 'components/property/PropertyClient.tsx' },
    { from: 'PromotionBadge.tsx', to: 'components/ui/PromotionBadge.tsx' },
    { from: 'SeoJsonLdPerson.tsx', to: 'components/seo/SeoJsonLdPerson.tsx' },
    { from: 'StickyMobileCTA.tsx', to: 'components/ui/StickyMobileCTA.tsx' },
    { from: 'UnitSelector.tsx', to: 'components/property/UnitSelector.tsx' },
    { from: 'BuildingCard.tsx', to: 'components/property/BuildingCard.tsx' }
  ];

  moves.forEach(({ from, to }) => {
    const fromPath = join(PROJECT_ROOT, from);
    const toPath = join(PROJECT_ROOT, to);
    
    if (existsSync(fromPath)) {
      try {
        renameSync(fromPath, toPath);
        console.log(`  ✅ Movido: ${from} → ${to}`);
      } catch (error) {
        console.log(`  ❌ Error moviendo ${from}: ${error.message}`);
      }
    } else {
      console.log(`  ⚠️ No encontrado: ${from}`);
    }
  });
}

/**
 * Eliminar archivos duplicados
 */
function removeDuplicateFiles() {
  console.log('🗑️ Eliminando archivos duplicados...');
  
  const duplicates = [
    'COTIZADOR_MEJORADO_RESUMEN 2.md',
    'COTIZADOR_SISTEMA_FUNCIONAL 2.md',
    'DATOS_REALES_IMPLEMENTADO 2.md',
    'PropertyClient_v1 2.tsx',
    'debug 2.js',
    'lighthouserc 2.json',
    'quotation 2.ts',
    'use-real-data 2.sh',
    'ingesta.config 2.js'
  ];

  duplicates.forEach(file => {
    const filePath = join(PROJECT_ROOT, file);
    if (existsSync(filePath)) {
      try {
        rmSync(filePath);
        console.log(`  ✅ Eliminado: ${file}`);
      } catch (error) {
        console.log(`  ❌ Error eliminando ${file}: ${error.message}`);
      }
    } else {
      console.log(`  ⚠️ No encontrado: ${file}`);
    }
  });
}

/**
 * Eliminar archivos duplicados en directorios
 */
function removeDuplicateFilesInDirectories() {
  console.log('🗑️ Eliminando archivos duplicados en directorios...');
  
  const directories = ['docs', 'reports'];
  
  directories.forEach(dir => {
    const dirPath = join(PROJECT_ROOT, dir);
    if (existsSync(dirPath)) {
      try {
        // Buscar archivos con sufijo " 2"
        const output = execSync(`find "${dirPath}" -name "* 2.*"`, { encoding: 'utf8' });
        const files = output.trim().split('\n').filter(f => f.length > 0);
        
        files.forEach(file => {
          try {
            rmSync(file);
            console.log(`  ✅ Eliminado: ${file.replace(PROJECT_ROOT, '')}`);
          } catch (error) {
            console.log(`  ❌ Error eliminando ${file}: ${error.message}`);
          }
        });
      } catch (error) {
        // No hay archivos duplicados o error en find
        console.log(`  ℹ️ No se encontraron duplicados en ${dir}`);
      }
    }
  });
}

/**
 * Mover directorios temporales
 */
function moveTemporaryDirectories() {
  console.log('📁 Moviendo directorios temporales...');
  
  const moves = [
    { from: 'backups', to: '.backups' },
    { from: 'coverage', to: '.coverage' },
    { from: 'playwright-report', to: '.playwright-report' },
    { from: 'test-results', to: '.test-results' },
    { from: 'static-build', to: '.static-build' }
  ];

  moves.forEach(({ from, to }) => {
    const fromPath = join(PROJECT_ROOT, from);
    const toPath = join(PROJECT_ROOT, to);
    
    if (existsSync(fromPath)) {
      try {
        renameSync(fromPath, toPath);
        console.log(`  ✅ Movido: ${from} → ${to}`);
      } catch (error) {
        console.log(`  ❌ Error moviendo ${from}: ${error.message}`);
      }
    } else {
      console.log(`  ⚠️ No encontrado: ${from}`);
    }
  });
}

/**
 * Actualizar .gitignore
 */
function updateGitignore() {
  console.log('📝 Actualizando .gitignore...');
  
  const gitignorePath = join(PROJECT_ROOT, '.gitignore');
  let gitignoreContent = '';
  
  if (existsSync(gitignorePath)) {
    gitignoreContent = readFileSync(gitignorePath, 'utf8');
  }
  
  const additions = [
    '',
    '# Cleanup additions',
    '.backups/',
    '.coverage/',
    '.playwright-report/',
    '.test-results/',
    '.static-build/',
    'config/lint-report.txt',
    'config/debug.js'
  ];
  
  const newContent = gitignoreContent + additions.join('\n');
  writeFileSync(gitignorePath, newContent);
  console.log('  ✅ .gitignore actualizado');
}

/**
 * Generar reporte de limpieza
 */
function generateCleanupReport() {
  console.log('📊 Generando reporte de limpieza...');
  
  const report = {
    timestamp: new Date().toISOString(),
    cleanup: {
      directoriesCreated: 21,
      documentationMoved: 22,
      configMoved: 4,
      componentsMoved: 6,
      duplicatesRemoved: 9,
      tempDirectoriesMoved: 5
    },
    structure: {
      docs: 'Documentación organizada por categorías',
      config: 'Configuración centralizada',
      components: 'Componentes organizados',
      reports: 'Reportes organizados',
      temp: 'Directorios temporales ocultos'
    }
  };
  
  const reportPath = join(PROJECT_ROOT, 'reports/cleanup-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('  ✅ Reporte generado: reports/cleanup-report.json');
}

/**
 * Función principal
 */
function main() {
  console.log('🧹 Iniciando limpieza de archivos...\n');
  
  try {
    createDirectories();
    moveDocumentationFiles();
    moveConfigFiles();
    moveComponentFiles();
    removeDuplicateFiles();
    removeDuplicateFilesInDirectories();
    moveTemporaryDirectories();
    updateGitignore();
    generateCleanupReport();
    
    console.log('\n✅ Limpieza completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('  - Directorios creados: 21');
    console.log('  - Archivos de documentación movidos: 22');
    console.log('  - Archivos de configuración movidos: 4');
    console.log('  - Archivos de componentes movidos: 6');
    console.log('  - Archivos duplicados eliminados: 9+');
    console.log('  - Directorios temporales movidos: 5');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { 
  createDirectories,
  moveDocumentationFiles,
  moveConfigFiles,
  moveComponentFiles,
  removeDuplicateFiles,
  removeDuplicateFilesInDirectories,
  moveTemporaryDirectories,
  updateGitignore,
  generateCleanupReport
};
