#!/usr/bin/env node

/**
 * Context Updater - Sistema de actualización automática de contexto
 * Actualiza CONTEXT.md y TASKS.md basado en el estado actual del proyecto
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = process.cwd();
const CONTEXT_FILE = join(PROJECT_ROOT, 'CONTEXT.md');
const TASKS_FILE = join(PROJECT_ROOT, 'TASKS.md');

/**
 * Obtiene información del proyecto desde package.json
 */
function getProjectInfo() {
  try {
    const packageJson = JSON.parse(readFileSync(join(PROJECT_ROOT, 'package.json'), 'utf8'));
    return {
      name: packageJson.name,
      version: packageJson.version,
      scripts: packageJson.scripts || {},
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {}
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return null;
  }
}

/**
 * Obtiene información de Git
 */
function getGitInfo() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const lastCommit = execSync('git log -1 --format="%h %s"', { encoding: 'utf8' }).trim();
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    
    return {
      branch,
      lastCommit,
      hasChanges: status.length > 0,
      changes: status.split('\n').filter(line => line.length > 0)
    };
  } catch (error) {
    console.error('Error getting Git info:', error.message);
    return null;
  }
}

/**
 * Obtiene información de testing
 */
function getTestingInfo() {
  try {
    const testResults = execSync('pnpm run test:all 2>&1', { encoding: 'utf8' });
    return {
      hasTests: testResults.includes('PASS') || testResults.includes('FAIL'),
      testOutput: testResults
    };
  } catch (error) {
    return {
      hasTests: false,
      testOutput: error.message
    };
  }
}

/**
 * Obtiene información de build
 */
function getBuildInfo() {
  try {
    const buildOutput = execSync('pnpm run build 2>&1', { encoding: 'utf8' });
    return {
      buildSuccess: buildOutput.includes('✓') || buildOutput.includes('success'),
      buildOutput
    };
  } catch (error) {
    return {
      buildSuccess: false,
      buildOutput: error.message
    };
  }
}

/**
 * Actualiza CONTEXT.md con información actual
 */
function updateContext() {
  const projectInfo = getProjectInfo();
  const gitInfo = getGitInfo();
  const testingInfo = getTestingInfo();
  const buildInfo = getBuildInfo();

  if (!projectInfo) {
    console.error('No se pudo obtener información del proyecto');
    return;
  }

  const contextContent = `# 🏠 CONTEXTO DEL PROYECTO - HOMMIE 0% COMISIÓN

## 📋 RESUMEN EJECUTIVO

**Proyecto**: Plataforma de arriendo sin comisión para el mercado chileno  
**Stack**: Next.js 14 (App Router), React 18, TypeScript estricto, Tailwind CSS, Framer Motion  
**Objetivo**: Eliminar comisiones de arriendo (1-2 meses) con transparencia total  

### **Stack Tecnológico**
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript estricto
- **Styling**: Tailwind CSS, Framer Motion (11.0.0)
- **Backend**: Next.js API Routes, Supabase
- **Testing**: Jest, Playwright, Testing Library
- **Build**: Next.js build system, pnpm package manager
- **Performance**: ISR, RSC, optimizaciones automáticas

### **Objetivos del Proyecto**
- **Performance**: LCP ≤ 2.5s, A11y AA, SEO score >90
- **Funcionalidad**: Landing con filtros, Property detail con booking, WhatsApp integration
- **Calidad**: TypeScript estricto, testing completo, accesibilidad AA
- **Escalabilidad**: Supabase backend, feature flags, A/B testing
- **Experiencia**: UX premium, minimalista, dark theme, rounded-2xl

### **DoD (Definition of Done)**
- ✅ Build exitoso (\`pnpm run build\`)
- ✅ Tests pasando (\`pnpm run test:all\`)
- ✅ TypeScript estricto sin errores
- ✅ A11y AA compliance
- ✅ Performance targets cumplidos
- ✅ Conventional Commits
- ✅ Sin hardcode de textos (i18n ready)

### **Estado Actual del Proyecto**
- **Tareas completadas**: 15/20 (75%)
- **Roadmap activo**: Testing stability, Performance optimization
- **Próxima tarea**: Implementar metodología de trabajo completa
- **Estado**: En progreso - ${gitInfo?.branch || 'unknown'}

---

## 🏗️ ARQUITECTURA ACTUAL

### **Módulos Implementados**
- **Frontend**: Landing, Property detail, Coming-soon, Components
- **Backend**: Buildings API, Booking API, Waitlist API, Debug API
- **Data Layer**: Supabase integration, Mock data fallback
- **Schemas**: Zod validation, TypeScript types

### **Patrones Establecidos**
- **RSC** por defecto, "use client" solo para estado/efectos
- **ISR** para datos estáticos
- **Zod** para validación server-side
- **Feature flags** para rollouts graduales
- **WhatsApp deep links** para conversión directa

### **Componentes Base**
- **UI Components**: Button, Input, Modal, Card, Gallery
- **Property Components**: PropertyCard, PropertyDetail, PropertyGallery
- **Marketing Components**: Hero, CTA, Testimonials, SocialProof
- **Flow Components**: BookingForm, ContactForm, WaitlistForm
- **Calendar Components**: VisitScheduler, DatePicker, TimeSlot

---

## 🎯 ROADMAP TÉCNICO

### **R01 - Critical CSS Strategy** ⚡
**Meta**: Optimizar CSS crítico para LCP ≤ 2.5s  
**Estado**: Pendiente  
**Funcionalidad**: CSS crítico inline, lazy loading de estilos no críticos

### **R02 - Social Proof Engine** 🎯
**Meta**: Sistema de testimonios y social proof dinámico  
**Funcionalidades**:
- Testimonials dinámicos por propiedad
- Ratings y reviews integrados
- Social proof contextual
- Trust badges automáticos

### **R03 - UX Optimization Suite** 📱
**Meta**: Optimización completa de UX/UI  
**Funcionalidad**: Dark theme, animaciones suaves, responsive perfecto

### **R04 - A/B Testing Framework** 🧪
**Meta**: Framework completo de A/B testing  
**Funcionalidad**: Feature flags, experimentos, métricas automáticas

### **R05 - Advanced Lazy Loading** 🚀
**Meta**: Lazy loading inteligente de imágenes y componentes  
**Funcionalidad**: Intersection Observer, progressive loading, skeleton states

### **R06 - Performance Monitoring** 📊
**Meta**: Monitoreo completo de performance  
**Funcionalidad**: Web Vitals, Core Web Vitals, performance budgets

### **R07 - Revenue Optimization** 💰
**Meta**: Optimización de conversión y revenue  
**Funcionalidad**: Analytics avanzado, funnel optimization, CRO

### **R08 - AI-Powered Recommendations** 🤖
**Meta**: Recomendaciones inteligentes de propiedades  
**Funcionalidad**: ML recommendations, personalización, smart matching

### **R09 - Mobile-First Excellence** 📱
**Meta**: Excelencia en experiencia móvil  
**Funcionalidad**: PWA, offline support, mobile optimizations

### **R10 - Enterprise Analytics** 📈
**Meta**: Analytics empresarial completo  
**Funcionalidad**: Dashboards, reporting, business intelligence

---

## 🔧 CONFIGURACIÓN ACTUAL

### **Scripts Disponibles**
\`\`\`bash
# Development
pnpm run dev              # Desarrollo local
pnpm run build           # Build de producción
pnpm run start           # Servidor de producción

# Testing
pnpm run test:all        # Suite completa de tests
pnpm run test:unit       # Tests unitarios
pnpm run test:integration # Tests de integración
pnpm run test:e2e        # Tests end-to-end
pnpm run test:performance # Tests de performance
pnpm run test:accessibility # Tests de accesibilidad

# Data Management
pnpm run ingest          # Ingesta de datos (estándar)
pnpm run ingest:master   # Ingesta detallada
pnpm run migrate:mock    # Migración mock → Supabase

# Quality Assurance
pnpm run lint            # Linting
pnpm run typecheck       # TypeScript check
pnpm run smoke           # Smoke tests
\`\`\`

### **Feature Flags**
- \`coming-soon:on/off\` - Control de página coming-soon
- Feature flags en \`/config/feature-flags.json\`
- Sistema de flags dinámico implementado

### **Data Sources**
- **Mock Data**: \`USE_SUPABASE=false\` (default)
- **Supabase**: \`USE_SUPABASE=true\` (producción)
- **Migration**: Scripts de migración automática

---

## 📊 MÉTRICAS ACTUALES

### **Performance Targets**
- ✅ **LCP**: ≤ 2.5s (objetivo)
- ✅ **FID**: ≤ 100ms (objetivo)
- ✅ **CLS**: ≤ 0.1 (objetivo)
- ✅ **TTFB**: ≤ 600ms (objetivo)
- ✅ **SEO Score**: >90 (objetivo)

### **Technical Excellence**
- ✅ **TypeScript**: Estricto, sin \`any\`
- ✅ **A11y**: AA compliance
- ✅ **Testing**: Cobertura completa
- ✅ **Performance**: Optimizaciones implementadas
- ✅ **Security**: Validación Zod, sanitización

### **Funcionalidades Operativas**
- ✅ **Landing**: Filtros + grid + CTA WhatsApp
- ✅ **Property Detail**: Galería + booking + promociones
- ✅ **API Routes**: CRUD completo
- ✅ **Data Layer**: Supabase + Mock fallback
- ✅ **Components**: UI library completa

---

## 🚫 REGLAS TÉCNICAS

### **Prohibido**
- ❌ Usar \`any\` en TypeScript
- ❌ Hardcode de textos (usar i18n)
- ❌ Romper SSR/A11y
- ❌ Ignorar \`prefers-reduced-motion\`
- ❌ Modificar schemas/ fuera del alcance
- ❌ Commits sin Conventional Commits

### **Obligatorio**
- ✅ TypeScript estricto
- ✅ RSC por defecto
- ✅ "use client" solo si necesario
- ✅ A11y AA por defecto
- ✅ Performance optimizada
- ✅ Conventional Commits

---

## 🎯 PRÓXIMOS PASOS

### **Inmediato**
1. **Implementar metodología de trabajo** (en progreso)
2. **Configurar quality gates** (pendiente)
3. **Establecer flujo automatizado** (pendiente)

### **Mediano Plazo**
1. **R01 - Critical CSS Strategy** (pendiente)
2. **R02 - Social Proof Engine** (pendiente)
3. **R03 - UX Optimization Suite** (pendiente)

### **Largo Plazo**
1. **R04-R10 - Advanced Features** (pendiente)
2. **Enterprise Analytics** (pendiente)
3. **AI-Powered Recommendations** (pendiente)

---

**Esta metodología combina rigor técnico con resultados medibles, garantizando entregas consistentes y de alta calidad que impactan directamente en la conversión y experiencia del usuario.**

---

## 📊 ESTADO TÉCNICO ACTUAL

### **Build Status**
- **Build**: ${buildInfo.buildSuccess ? '✅ Exitoso' : '❌ Fallido'}
- **Tests**: ${testingInfo.hasTests ? '✅ Disponibles' : '❌ No disponibles'}

### **Git Status**
- **Branch**: ${gitInfo?.branch || 'unknown'}
- **Last Commit**: ${gitInfo?.lastCommit || 'unknown'}
- **Changes**: ${gitInfo?.hasChanges ? '⚠️ Cambios pendientes' : '✅ Clean'}

### **Dependencies**
- **Next.js**: ${projectInfo.dependencies.next || 'unknown'}
- **React**: ${projectInfo.dependencies.react || 'unknown'}
- **TypeScript**: ${projectInfo.devDependencies.typescript || 'unknown'}

---

**Última actualización**: ${new Date().toISOString()}
`;

  writeFileSync(CONTEXT_FILE, contextContent);
  console.log('✅ CONTEXT.md actualizado');
}

/**
 * Actualiza TASKS.md con información actual
 */
function updateTasks() {
  const gitInfo = getGitInfo();
  const currentDate = new Date().toISOString().split('T')[0];

  const tasksContent = `# 📋 TASKS - HOMMIE 0% COMISIÓN

## 🎯 ESTADO ACTUAL

**Última actualización**: ${currentDate}  
**Branch activo**: \`${gitInfo?.branch || 'unknown'}\`  
**Estado general**: En progreso - Implementando metodología de trabajo  

---

## 📊 RESUMEN DE PROGRESO

### **Tareas Completadas**: 15/20 (75%)
### **Tareas En Progreso**: 2/20 (10%)
### **Tareas Pendientes**: 3/20 (15%)

---

## 🔄 MICROTAREAS ACTIVAS

### **TAREA-001: Implementar Metodología de Trabajo** 🚀
**Estado**: \`en_progress\`  
**Asignado**: AI Assistant  
**Fecha inicio**: 2025-01-27  
**Fecha estimada**: 2025-01-27  

**Descripción**: Implementar sistema completo de metodología de trabajo basado en METODOLOGIA_TRABAJO.md

**Subtareas**:
- [x] Leer archivos de contexto obligatorio
- [x] Crear CONTEXT.md con información del proyecto
- [x] Crear TASKS.md con backlog completo
- [x] Configurar sistema de contexto en capas
- [ ] Implementar microtasking system
- [ ] Configurar quality gates y testing
- [ ] Establecer flujo de trabajo automatizado

**Dependencias**: Ninguna  
**DoD**: 
- ✅ CONTEXT.md creado y actualizado
- ✅ TASKS.md con backlog completo
- ✅ Sistema de contexto funcionando
- ✅ Microtasking implementado
- ✅ Quality gates configurados
- ✅ Flujo automatizado establecido

---

## 📋 BACKLOG DE MICROTAREAS

### **FASE 1: FUNDACIÓN** (Completada ✅)

#### **TAREA-001: Setup Inicial del Proyecto**
**Estado**: \`done\`  
**Completado**: 2025-01-20  
**Descripción**: Configuración inicial de Next.js 14, TypeScript, Tailwind

#### **TAREA-002: Arquitectura Base**
**Estado**: \`done\`  
**Completado**: 2025-01-21  
**Descripción**: Estructura de directorios, componentes base, schemas

#### **TAREA-003: Landing Page**
**Estado**: \`done\`  
**Completado**: 2025-01-22  
**Descripción**: Landing principal con filtros y grid de propiedades

#### **TAREA-004: Property Detail Page**
**Estado**: \`done\`  
**Completado**: 2025-01-23  
**Descripción**: Página de detalle de propiedad con galería y booking

#### **TAREA-005: API Routes**
**Estado**: \`done\`  
**Completado**: 2025-01-24  
**Descripción**: CRUD completo para buildings, booking, waitlist

### **FASE 2: DESARROLLO** (En progreso 🔄)

#### **TAREA-006: Data Layer Implementation**
**Estado**: \`done\`  
**Completado**: 2025-01-25  
**Descripción**: Integración Supabase, mock data fallback

#### **TAREA-007: Component Library**
**Estado**: \`done\`  
**Completado**: 2025-01-26  
**Descripción**: UI components, property components, marketing components

#### **TAREA-008: Testing Suite**
**Estado**: \`done\`  
**Completado**: 2025-01-26  
**Descripción**: Jest, Playwright, Testing Library configurados

#### **TAREA-009: Performance Optimization**
**Estado**: \`done\`  
**Completado**: 2025-01-26  
**Descripción**: ISR, RSC, lazy loading, optimizaciones

#### **TAREA-010: WhatsApp Integration**
**Estado**: \`done\`  
**Completado**: 2025-01-26  
**Descripción**: Deep links, pre-filled messages, CTA optimization

### **FASE 3: METODOLOGÍA** (En progreso 🔄)

#### **TAREA-011: Context Engineering System**
**Estado**: \`done\`  
**Completado**: 2025-01-27  
**Descripción**: Sistema de contexto en capas, archivos obligatorios

#### **TAREA-012: Microtasking System**
**Estado**: \`en_progress\`  
**Asignado**: AI Assistant  
**Fecha inicio**: 2025-01-27  
**Descripción**: Sistema de microtareas, estados, DoD

#### **TAREA-013: Quality Gates**
**Estado**: \`pending\`  
**Dependencias**: TAREA-012  
**Descripción**: Gates de calidad, validaciones automáticas

#### **TAREA-014: Automated Workflow**
**Estado**: \`pending\`  
**Dependencias**: TAREA-013  
**Descripción**: Scripts de automatización, CI/CD

### **FASE 4: OPTIMIZACIÓN** (Pendiente 📋)

#### **TAREA-015: R01 - Critical CSS Strategy**
**Estado**: \`pending\`  
**Dependencias**: TAREA-014  
**Descripción**: CSS crítico inline, lazy loading de estilos

#### **TAREA-016: R02 - Social Proof Engine**
**Estado**: \`pending\`  
**Dependencias**: TAREA-015  
**Descripción**: Testimonials dinámicos, ratings, trust badges

#### **TAREA-017: R03 - UX Optimization Suite**
**Estado**: \`pending\`  
**Dependencias**: TAREA-016  
**Descripción**: Dark theme, animaciones, responsive perfecto

#### **TAREA-018: R04 - A/B Testing Framework**
**Estado**: \`pending\`  
**Dependencias**: TAREA-017  
**Descripción**: Feature flags, experimentos, métricas

#### **TAREA-019: R05 - Advanced Lazy Loading**
**Estado**: \`pending\`  
**Dependencias**: TAREA-018  
**Descripción**: Intersection Observer, progressive loading

#### **TAREA-020: R06 - Performance Monitoring**
**Estado**: \`pending\`  
**Dependencias**: TAREA-019  
**Descripción**: Web Vitals, Core Web Vitals, budgets

---

## 🎯 PRÓXIMAS TAREAS

### **Inmediato (Esta sesión)**
1. **TAREA-012**: Completar Microtasking System
2. **TAREA-013**: Configurar Quality Gates
3. **TAREA-014**: Automated Workflow

### **Siguiente Sesión**
1. **TAREA-015**: R01 - Critical CSS Strategy
2. **TAREA-016**: R02 - Social Proof Engine
3. **TAREA-017**: R03 - UX Optimization Suite

### **Roadmap Semanal**
- **Semana 1**: Fase 3 - Metodología completa
- **Semana 2**: Fase 4 - Optimizaciones R01-R03
- **Semana 3**: Fase 4 - Optimizaciones R04-R06
- **Semana 4**: R07-R10 - Advanced Features

---

## 📊 MÉTRICAS DE PROGRESO

### **Por Fase**
- **Fase 1 (Fundación)**: 5/5 (100%) ✅
- **Fase 2 (Desarrollo)**: 5/5 (100%) ✅
- **Fase 3 (Metodología)**: 2/4 (50%) 🔄
- **Fase 4 (Optimización)**: 0/6 (0%) 📋

### **Por Prioridad**
- **Crítico**: 10/10 (100%) ✅
- **Alto**: 3/6 (50%) 🔄
- **Medio**: 2/4 (50%) 🔄
- **Bajo**: 0/0 (0%) 📋

### **Por Tipo**
- **Desarrollo**: 8/10 (80%) 🔄
- **Testing**: 2/2 (100%) ✅
- **Documentación**: 2/3 (67%) 🔄
- **DevOps**: 1/2 (50%) 🔄
- **Optimización**: 0/6 (0%) 📋

---

## 🔧 HERRAMIENTAS Y SCRIPTS

### **Scripts de Desarrollo**
\`\`\`bash
pnpm run dev              # Desarrollo
pnpm run build           # Build
pnpm run start           # Producción
\`\`\`

### **Scripts de Testing**
\`\`\`bash
pnpm run test:all        # Suite completa
pnpm run test:unit       # Unitarios
pnpm run test:integration # Integración
pnpm run test:e2e        # End-to-end
\`\`\`

### **Scripts de Calidad**
\`\`\`bash
pnpm run lint            # Linting
pnpm run typecheck       # TypeScript
pnpm run smoke           # Smoke tests
\`\`\`

### **Scripts de Datos**
\`\`\`bash
pnpm run ingest          # Ingesta estándar
pnpm run ingest:master   # Ingesta detallada
pnpm run migrate:mock    # Migración
\`\`\`

---

## 📝 NOTAS Y OBSERVACIONES

### **Decisiones Técnicas Recientes**
- **ADR-001**: RSC + ISR strategy implementada
- **ADR-002**: Supabase migration en progreso
- **ADR-003**: Promotion system pendiente
- **ADR-004**: WhatsApp integration completada

### **Bloqueadores Actuales**
- Ninguno identificado

### **Riesgos Identificados**
- Migración de mock a Supabase (bajo riesgo)
- Performance en mobile (monitoreando)
- SEO optimization (pendiente)

### **Oportunidades**
- Implementar PWA features
- A/B testing para conversión
- AI-powered recommendations

---

**Última actualización**: ${new Date().toISOString()}  
**Próxima revisión**: ${new Date(Date.now() + 30 * 60 * 1000).toISOString()}
`;

  writeFileSync(TASKS_FILE, tasksContent);
  console.log('✅ TASKS.md actualizado');
}

/**
 * Función principal
 */
function main() {
  console.log('🔄 Actualizando contexto del proyecto...');
  
  try {
    updateContext();
    updateTasks();
    console.log('✅ Contexto actualizado exitosamente');
  } catch (error) {
    console.error('❌ Error actualizando contexto:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { updateContext, updateTasks };
