# Seguridad (estática)

Generated at: 2025-08-11T22:36:47.865Z

### Variables de entorno (present/absent)
| Env Var | Status |
| --- | --- |
| SUPABASE_URL | absent |
| SUPABASE_ANON_KEY | absent |
| NEXT_PUBLIC_SITE_URL | absent |
| SUPABASE_SERVICE_ROLE_KEY | absent |

### Matches relevantes
| Archivo | Patrón | Snippet |
| --- | --- | --- |
| PULL_REQUEST.md | /service_role/gi | `SE=true SUPABASE_URL=your_supabase_url SUPABASE_ANON_KEY=your_anon_key [redacted]=your_service_role_key ``` ### 2. Ejecutar Migración ```bash no` |
| PULL_REQUEST.md | /service_role/gi | `our_supabase_url SUPABASE_ANON_KEY=your_anon_key [redacted]=your_service_role_key ``` ### 2. Ejecutar Migración ```bash node scripts/migrate-csv` |
| README.md | /process\.env\.[A-Z0-9_]+/g | `Con comingSoon: false → 200 OK (landing real) ``` **Nota:** El sistema ignora `process.env.COMING_SOON` para mantener consistencia en deploy por commit & push.` |
| README.md | /service_role/gi | `ías. ### Script de ingesta Variables requeridas: - `SUPABASE_URL` - `[redacted]` Instala y ejecuta: ```bash pnpm add @supabase/supabase-js pnp` |
| app/(catalog)/property/[slug]/page.tsx | /process\.env\.[A-Z0-9_]+/g | `g, 3);   // Build JSON-LD (Schema.org) for this property   const baseUrl =     process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:30` |
| app/(catalog)/property/[slug]/page.tsx | /process\.env\.[A-Z0-9_]+/g | `rg) for this property   const baseUrl =     process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";   const canonicalUrl = `${baseU` |
| app/(catalog)/property/[slug]/page.tsx | /NEXT_PUBLIC_[A-Z0-9_]+/g | ` Build JSON-LD (Schema.org) for this property   const baseUrl =     process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";   const` |
| app/(catalog)/property/[slug]/page.tsx | /dangerouslySetInnerHTML/ | `st;   return (     <>       <script         type="application/ld+json"         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c` |
| app/api/debug/route.ts | /process\.env\.[A-Z0-9_]+/g | ` llamado");          // Verificar variables de entorno     const USE_SUPABASE = process.env.USE_SUPABASE === "true";          // Intentar consulta directa a Sup` |
| app/api/waitlist/route.ts | /process\.env\.[A-Z0-9_]+/g | `ente Supabase (usando service role key para bypass RLS)     const supabaseUrl = process.env.SUPABASE_URL;     const supabaseServiceKey = process.env.SUPABASE_SE` |
| app/api/waitlist/route.ts | /process\.env\.[A-Z0-9_]+/g | `   const supabaseUrl = process.env.SUPABASE_URL;     const supabaseServiceKey = process.env.[redacted];          if (!supabaseUrl || !supabaseSer` |
| app/api/waitlist/route.ts | /service_role/gi | `= process.env.SUPABASE_URL;     const supabaseServiceKey = process.env.[redacted];          if (!supabaseUrl || !supabaseServiceKey) {       cons` |
| app/propiedad/[id]/page.tsx | /process\.env\.[A-Z0-9_]+/g | `ow.location.href : undefined }) : "";               const canWhatsApp = Boolean(process.env.[redacted]) && Boolean(href);               return c` |
| app/propiedad/[id]/page.tsx | /NEXT_PUBLIC_[A-Z0-9_]+/g | `href : undefined }) : "";               const canWhatsApp = Boolean(process.env.[redacted]) && Boolean(href);               return canWhatsApp ?` |
| app/sitemap 2.ts | /process\.env\.[A-Z0-9_]+/g | `ync function sitemap(): Promise<MetadataRoute.Sitemap> {   const base = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");   const buildings ` |
| app/sitemap 2.ts | /NEXT_PUBLIC_[A-Z0-9_]+/g | ` sitemap(): Promise<MetadataRoute.Sitemap> {   const base = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");   const buildings = await getA` |
| app/sitemap.ts | /process\.env\.[A-Z0-9_]+/g | `ync function sitemap(): Promise<MetadataRoute.Sitemap> {   const base = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");   const buildings ` |
| app/sitemap.ts | /NEXT_PUBLIC_[A-Z0-9_]+/g | ` sitemap(): Promise<MetadataRoute.Sitemap> {   const base = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");   const buildings = await getA` |
| components/StickyMobileCTA.tsx | /process\.env\.[A-Z0-9_]+/g | `        aria-label="Contactar por WhatsApp"             aria-disabled={!Boolean(process.env.[redacted])}             disabled={!Boolean(process.` |
| components/StickyMobileCTA.tsx | /process\.env\.[A-Z0-9_]+/g | `Boolean(process.env.[redacted])}             disabled={!Boolean(process.env.[redacted])}             title={!Boolean(process.env` |
| components/StickyMobileCTA.tsx | /process\.env\.[A-Z0-9_]+/g | `={!Boolean(process.env.[redacted])}             title={!Boolean(process.env.[redacted]) ? "Pronto disponible" : undefined}      ` |
| components/StickyMobileCTA.tsx | /NEXT_PUBLIC_[A-Z0-9_]+/g | `-label="Contactar por WhatsApp"             aria-disabled={!Boolean(process.env.[redacted])}             disabled={!Boolean(process.env.NEXT_PUB` |
| components/StickyMobileCTA.tsx | /NEXT_PUBLIC_[A-Z0-9_]+/g | `ess.env.[redacted])}             disabled={!Boolean(process.env.[redacted])}             title={!Boolean(process.env.NEXT_PUBLIC` |
| components/StickyMobileCTA.tsx | /NEXT_PUBLIC_[A-Z0-9_]+/g | `rocess.env.[redacted])}             title={!Boolean(process.env.[redacted]) ? "Pronto disponible" : undefined}           >      ` |
| components/forms/BookingForm.tsx | /process\.env\.[A-Z0-9_]+/g | `d" ? window.location.href : undefined });           const canWhatsApp = Boolean(process.env.[redacted]) && Boolean(href);           return canWh` |
| components/forms/BookingForm.tsx | /NEXT_PUBLIC_[A-Z0-9_]+/g | `location.href : undefined });           const canWhatsApp = Boolean(process.env.[redacted]) && Boolean(href);           return canWhatsApp ? (  ` |
| components/marketing/ComingSoonHero.tsx | /process\.env\.[A-Z0-9_]+/g | `otion.button>               {/* Botón secundario "WhatsApp" */}               {process.env.[redacted] ? (                 <motion.a            ` |
| components/marketing/ComingSoonHero.tsx | /process\.env\.[A-Z0-9_]+/g | `PP_PHONE ? (                 <motion.a                   href={`https://wa.me/${process.env.[redacted]}?text=Hola%20me%20interesa%20el%20lanzami` |
| components/marketing/ComingSoonHero.tsx | /NEXT_PUBLIC_[A-Z0-9_]+/g | `>               {/* Botón secundario "WhatsApp" */}               {process.env.[redacted] ? (                 <motion.a                   href=` |
| components/marketing/ComingSoonHero.tsx | /NEXT_PUBLIC_[A-Z0-9_]+/g | `                 <motion.a                   href={`https://wa.me/${process.env.[redacted]}?text=Hola%20me%20interesa%20el%20lanzamiento`}      ` |
| components/marketing/ComingSoonHero.tsx | /NEXT_PUBLIC_[A-Z0-9_]+/g | `utton                   aria-disabled="true"                   title="Configura [redacted]"                   className="rounded-2xl px-6 py-3 f` |
| lib/data.ts | /process\.env\.[A-Z0-9_]+/g | `: number) => new Promise((res) => setTimeout(res, ms)); const simulateLatency = process.env.NODE_ENV !== "production"; function calculatePrecioDesde(units: Uni` |
| lib/data.ts | /process\.env\.[A-Z0-9_]+/g | `de entorno está habilitada, intentar leer desde Supabase   const USE_SUPABASE = process.env.USE_SUPABASE === "true";      console.log(`🔧 USE_SUPABASE: ${USE_SU` |
| lib/data.ts | /process\.env\.[A-Z0-9_]+/g | `   typeof process !== "undefined" && typeof process.env !== "undefined"       ? process.env.USE_ASSETPLAN_SOURCE === "true"       : false;   if (USE_ASSETPLAN_` |
| lib/supabase.ts | /process\.env\.[A-Z0-9_]+/g | `import { createClient } from '@supabase/supabase-js'; const supabaseUrl = process.env.SUPABASE_URL; const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABA` |
| lib/supabase.ts | /process\.env\.[A-Z0-9_]+/g | `ase-js'; const supabaseUrl = process.env.SUPABASE_URL; const supabaseAnonKey = process.env.[redacted] || process.env.SUPABASE_ANON_KEY; cons` |
| lib/supabase.ts | /process\.env\.[A-Z0-9_]+/g | `ABASE_URL; const supabaseAnonKey = process.env.[redacted] || process.env.SUPABASE_ANON_KEY; const supabaseServiceKey = process.env.SUPABASE_S` |
| lib/supabase.ts | /process\.env\.[A-Z0-9_]+/g | `_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl) {   throw new Error('M` |
| lib/supabase.ts | /NEXT_PUBLIC_[A-Z0-9_]+/g | `nst supabaseUrl = process.env.SUPABASE_URL; const supabaseAnonKey = process.env.[redacted] || process.env.SUPABASE_ANON_KEY; const supabaseSe` |
| lib/supabase.ts | /service_role/gi | ` process.env.SUPABASE_ANON_KEY; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl) {   throw new Error('Missing SUPABASE_URL e` |
| lib/whatsapp.ts | /process\.env\.[A-Z0-9_]+/g | ` propertyName?: string; comuna?: string; url?: string }) {   const p = phone ?? process.env.[redacted] ?? "";   const msg = `Hola, me interesa $` |
| lib/whatsapp.ts | /NEXT_PUBLIC_[A-Z0-9_]+/g | `e?: string; comuna?: string; url?: string }) {   const p = phone ?? process.env.[redacted] ?? "";   const msg = `Hola, me interesa ${propertyNam` |
| reports/COMING_SOON.md | /process\.env\.[A-Z0-9_]+/g | `ón - **Variable de entorno:** `COMING_SOON=true` - **Flag:** `@lib/flags.ts` → `process.env.COMING_SOON === 'true'` - **Redirección:** `app/page.tsx` → `redirec` |
| reports/QA_ENV.md | /NEXT_PUBLIC_[A-Z0-9_]+/g | `ABASE_URL | absent | no | - | | [redacted] | absent | no | - | | NEXT_PUBLIC_SITE_URL | absent | no | - | | NEXT_PUBLIC_GA_ID | absent | yes | - ` |
| reports/QA_ENV.md | /NEXT_PUBLIC_[A-Z0-9_]+/g | `RVICE_ROLE_KEY | absent | no | - | | NEXT_PUBLIC_SITE_URL | absent | no | - | | NEXT_PUBLIC_GA_ID | absent | yes | - | _Nota: valores no mostrados por segurida` |
| reports/QA_ENV.md | /service_role/gi | `|-----------|----------|--------| | SUPABASE_URL | absent | no | - | | [redacted] | absent | no | - | | NEXT_PUBLIC_SITE_URL | absent | no | - | ` |
| reports/qa_env.json | /NEXT_PUBLIC_[A-Z0-9_]+/g | `    "present": false,       "optional": false,       "source": null     },     "NEXT_PUBLIC_SITE_URL": {       "present": false,       "optional": false,       ` |
| reports/qa_env.json | /NEXT_PUBLIC_[A-Z0-9_]+/g | `    "present": false,       "optional": false,       "source": null     },     "NEXT_PUBLIC_GA_ID": {       "present": false,       "optional": true,       "sou` |
| reports/qa_env.json | /service_role/gi | `ent": false,       "optional": false,       "source": null     },     "[redacted]": {       "present": false,       "optional": false,       "sou` |
| scripts/apply-waitlist-schema.mjs | /process\.env\.[A-Z0-9_]+/g | `ariables de entorno dotenv.config({ path: '.env.local' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.SUPABASE_SERVIC` |
| scripts/apply-waitlist-schema.mjs | /process\.env\.[A-Z0-9_]+/g | `' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey)` |
| scripts/apply-waitlist-schema.mjs | /service_role/gi | `Url = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey) {   console.error('❌` |
| scripts/audit.mjs | /process\.env\.[A-Z0-9_]+/g | `, 'typecheck.log') });   let test = { code: 0, stdout: '', stderr: '' };   if (!process.env.AUDIT_SKIP_TESTS) {     test = await runCommandCapture('npm', ['test` |
| scripts/audit.mjs | /process\.env\.[A-Z0-9_]+/g | `ETRY_DISABLED: '1' };   let build = { code: 0, stdout: '', stderr: '' };   if (!process.env.AUDIT_SKIP_BUILD) {     build = await runCommandCapture('npm', ['run` |
| scripts/audit.mjs | /process\.env\.[A-Z0-9_]+/g | ` '## Comandos ejecutados',     '- npm run lint',     '- npm run typecheck',     process.env.AUDIT_SKIP_TESTS ? '- (omitido) npm test -s' : '- npm test -s',     ` |
| scripts/audit.mjs | /process\.env\.[A-Z0-9_]+/g | `process.env.AUDIT_SKIP_TESTS ? '- (omitido) npm test -s' : '- npm test -s',     process.env.AUDIT_SKIP_BUILD ? '- (omitido) NEXT_TELEMETRY_DISABLED=1 npm run bu` |
| scripts/audit.mjs | /process\.env\.[A-Z0-9_]+/g | `(json?.comingSoon || json?.COMING_SOON);     } catch {}   }   const envComing = process.env.COMING_SOON ? 'present' : 'absent';   const rootPage = fs.existsSync` |
| scripts/audit.mjs | /NEXT_PUBLIC_[A-Z0-9_]+/g | `UPABASE_URL=https://dummy.supabase.co',       'SUPABASE_ANON_KEY=dummy',       'NEXT_PUBLIC_SITE_URL=http://localhost:3000',       '',     ].join('\n'));   }   ` |
| scripts/audit.mjs | /NEXT_PUBLIC_[A-Z0-9_]+/g | `ización' });     }   }   const envVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SITE_URL', '[redacted]'];   const envMd = formatPrese` |
| scripts/audit.mjs | /service_role/gi | `tterns = [     /process\.env\.[A-Z0-9_]+/g,     /NEXT_PUBLIC_[A-Z0-9_]+/g,     /service_role/gi,     /dangerouslySetInnerHTML/,   ];   const matches = safeGrep(` |
| scripts/audit.mjs | /service_role/gi | `s.slice(0, 200));   const findings = [];   for (const m of matches) {     if (/service_role/i.test(m.snippet) && /NEXT_PUBLIC|client|components\//i.test(m.file` |
| scripts/audit.mjs | /service_role/gi | `{       findings.push({ severity: 'alta', file: m.file, reason: 'Posible uso de service_role en cliente' });     }     if (/dangerouslySetInnerHTML/.test(m.snip` |
| scripts/audit.mjs | /service_role/gi | `vVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SITE_URL', '[redacted]'];   const envMd = formatPresentAbsentEnv(envVars, process.env)` |
| scripts/audit.mjs | /dangerouslySetInnerHTML/ | `s\.env\.[A-Z0-9_]+/g,     /NEXT_PUBLIC_[A-Z0-9_]+/g,     /service_role/gi,     /dangerouslySetInnerHTML/,   ];   const matches = safeGrep(repoRoot, patterns);  ` |
| scripts/audit.mjs | /dangerouslySetInnerHTML/ | `le: m.file, reason: 'Posible uso de service_role en cliente' });     }     if (/dangerouslySetInnerHTML/.test(m.snippet)) {       findings.push({ severity: 'med` |
| scripts/audit.mjs | /dangerouslySetInnerHTML/ | `t(m.snippet)) {       findings.push({ severity: 'media', file: m.file, reason: 'dangerouslySetInnerHTML requiere sanitización' });     }   }   const envVars = [` |
| scripts/check-schema.mjs | /process\.env\.[A-Z0-9_]+/g | `Cargar variables de entorno dotenv.config({ path: '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.SUPABASE_SERVICE_RO` |
| scripts/check-schema.mjs | /process\.env\.[A-Z0-9_]+/g | ` '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console` |
| scripts/check-schema.mjs | /service_role/gi | `nst url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console.error('❌ Faltan vari` |
| scripts/check-status-values.mjs | /process\.env\.[A-Z0-9_]+/g | `ariables de entorno dotenv.config({ path: '.env.local' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.SUPABASE_SERVIC` |
| scripts/check-status-values.mjs | /process\.env\.[A-Z0-9_]+/g | `' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey)` |
| scripts/check-status-values.mjs | /service_role/gi | `Url = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey) {   console.error('❌` |
| scripts/check-supabase-data.mjs | /process\.env\.[A-Z0-9_]+/g | `Cargar variables de entorno dotenv.config({ path: '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.SUPABASE_SERVICE_RO` |
| scripts/check-supabase-data.mjs | /process\.env\.[A-Z0-9_]+/g | ` '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console` |
| scripts/check-supabase-data.mjs | /service_role/gi | `nst url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console.error('❌ Faltan vari` |
| scripts/check-table-structure.mjs | /process\.env\.[A-Z0-9_]+/g | `ariables de entorno dotenv.config({ path: '.env.local' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.SUPABASE_SERVIC` |
| scripts/check-table-structure.mjs | /process\.env\.[A-Z0-9_]+/g | `' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey)` |
| scripts/check-table-structure.mjs | /service_role/gi | `Url = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey) {   console.error('❌` |
| scripts/check-waitlist.mjs | /process\.env\.[A-Z0-9_]+/g | `ariables de entorno dotenv.config({ path: '.env.local' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.SUPABASE_SERVIC` |
| scripts/check-waitlist.mjs | /process\.env\.[A-Z0-9_]+/g | `' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey)` |
| scripts/check-waitlist.mjs | /service_role/gi | `Url = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey) {   console.error('❌` |
| scripts/create-tables.mjs | /process\.env\.[A-Z0-9_]+/g | `ariables de entorno dotenv.config({ path: '.env.local' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.SUPABASE_SERVIC` |
| scripts/create-tables.mjs | /process\.env\.[A-Z0-9_]+/g | `' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey)` |
| scripts/create-tables.mjs | /service_role/gi | `Url = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey) {   console.error('❌` |
| scripts/debug-supabase-query.mjs | /process\.env\.[A-Z0-9_]+/g | `Cargar variables de entorno dotenv.config({ path: '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.SUPABASE_SERVICE_RO` |
| scripts/debug-supabase-query.mjs | /process\.env\.[A-Z0-9_]+/g | ` '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console` |
| scripts/debug-supabase-query.mjs | /service_role/gi | `nst url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console.error('❌ Faltan vari` |
| scripts/ingest-assetplan.ts | /service_role/gi | `nvOrThrow("SUPABASE_URL");   const supabaseServiceKey = getEnvOrThrow("[redacted]");   const supabase = createClient(supabaseUrl, supabaseService` |
| scripts/ingest-csv-direct 2.ts | /service_role/gi | ` = getEnvOrThrow("SUPABASE_URL");   const supabaseKey = getEnvOrThrow("[redacted]");   const supabase = createClient(supabaseUrl, supabaseKey, { ` |
| scripts/ingest-csv-direct.ts | /service_role/gi | ` = getEnvOrThrow("SUPABASE_URL");   const supabaseKey = getEnvOrThrow("[redacted]");   const supabase = createClient(supabaseUrl, supabaseKey, { ` |
| scripts/migrate-csv-to-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `ariables de entorno dotenv.config({ path: '.env.local' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.SUPABASE_SERVIC` |
| scripts/migrate-csv-to-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey)` |
| scripts/migrate-csv-to-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `CSV a Supabase...');          // Leer archivo CSV     const csvPath = path.join(process.env.HOME, 'Library', 'Mobile Documents', 'com~apple~CloudDocs', 'export.` |
| scripts/migrate-csv-to-supabase.mjs | /service_role/gi | `Url = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey) {   console.error('❌` |
| scripts/migrate-local-to-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `path: '.env.local' }); async function migrateLocalToSupabase() {   const url = process.env.SUPABASE_URL;   const serviceRoleKey = process.env.SUPABASE_SERVICE_` |
| scripts/migrate-local-to-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `ToSupabase() {   const url = process.env.SUPABASE_URL;   const serviceRoleKey = process.env.[redacted];      if (!url || !serviceRoleKey) {     c` |
| scripts/migrate-local-to-supabase.mjs | /service_role/gi | `t url = process.env.SUPABASE_URL;   const serviceRoleKey = process.env.[redacted];      if (!url || !serviceRoleKey) {     console.error('❌ Falta` |
| scripts/migrate-local-to-supabase.mjs | /service_role/gi | `ey) {     console.error('❌ Faltan variables de entorno: SUPABASE_URL y [redacted]');     console.log('💡 Agrega estas variables a tu .env.local:'` |
| scripts/migrate-local-to-supabase.mjs | /service_role/gi | `.log('SUPABASE_URL=https://tu-proyecto.supabase.co');     console.log('[redacted]=tu-service-role-key');     process.exit(1);   }   console.log(` |
| scripts/migrate-mock-to-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `ariables de entorno dotenv.config({ path: '.env.local' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.SUPABASE_SERVIC` |
| scripts/migrate-mock-to-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey)` |
| scripts/migrate-mock-to-supabase.mjs | /service_role/gi | `Url = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey) {   console.error('❌` |
| scripts/qa-env.mjs | /NEXT_PUBLIC_[A-Z0-9_]+/g | `al: false },   { key: '[redacted]', optional: false },   { key: 'NEXT_PUBLIC_SITE_URL', optional: false },   { key: 'NEXT_PUBLIC_GA_ID', optional` |
| scripts/qa-env.mjs | /NEXT_PUBLIC_[A-Z0-9_]+/g | `ptional: false },   { key: 'NEXT_PUBLIC_SITE_URL', optional: false },   { key: 'NEXT_PUBLIC_GA_ID', optional: true }, ]; function parseDotEnv(content) {   cons` |
| scripts/qa-env.mjs | /service_role/gi | `EQUIRED_VARS = [   { key: 'SUPABASE_URL', optional: false },   { key: '[redacted]', optional: false },   { key: 'NEXT_PUBLIC_SITE_URL', optional:` |
| scripts/qa-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `name(p), { recursive: true }); } function getSupabaseClients() {   const url = process.env.SUPABASE_URL;   const anonKey = process.env.[redacted]` |
| scripts/qa-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `etSupabaseClients() {   const url = process.env.SUPABASE_URL;   const anonKey = process.env.[redacted] || process.env.SUPABASE_ANON_KEY;   co` |
| scripts/qa-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `nv.SUPABASE_URL;   const anonKey = process.env.[redacted] || process.env.SUPABASE_ANON_KEY;   const serviceRoleKey = process.env.SUPABASE_SER` |
| scripts/qa-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `IC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;   const serviceRoleKey = process.env.[redacted];   const anon = url && anonKey ? createCl` |
| scripts/qa-supabase.mjs | /NEXT_PUBLIC_[A-Z0-9_]+/g | `ients() {   const url = process.env.SUPABASE_URL;   const anonKey = process.env.[redacted] || process.env.SUPABASE_ANON_KEY;   const serviceR` |
| scripts/qa-supabase.mjs | /service_role/gi | `|| process.env.SUPABASE_ANON_KEY;   const serviceRoleKey = process.env.[redacted];   const anon = url && anonKey ? createClient(url, anonKey, { ` |
| scripts/release-checks.mjs | /NEXT_PUBLIC_[A-Z0-9_]+/g | `esence(envMd);   const envPass = ['SUPABASE_URL', '[redacted]', 'NEXT_PUBLIC_SITE_URL'].every(k => !!envPresence[k]);   const smokeSummary = pick` |
| scripts/release-checks.mjs | /service_role/gi | `resence = parseEnvPresence(envMd);   const envPass = ['SUPABASE_URL', '[redacted]', 'NEXT_PUBLIC_SITE_URL'].every(k => !!envPresence[k]);   const` |
| scripts/schema-audit.mjs | /process\.env\.[A-Z0-9_]+/g | `n `${s.slice(0, 2)}****${s.slice(-2)}`; } function getClient() {   const url = process.env.SUPABASE_URL;   const key = process.env.[redacted] ||` |
| scripts/schema-audit.mjs | /process\.env\.[A-Z0-9_]+/g | `} function getClient() {   const url = process.env.SUPABASE_URL;   const key = process.env.[redacted] || process.env.[redacted]` |
| scripts/schema-audit.mjs | /process\.env\.[A-Z0-9_]+/g | `rocess.env.SUPABASE_URL;   const key = process.env.[redacted] || process.env.[redacted] || process.env.SUPABASE_ANON_KEY;   if` |
| scripts/schema-audit.mjs | /process\.env\.[A-Z0-9_]+/g | `s.env.[redacted] || process.env.[redacted] || process.env.SUPABASE_ANON_KEY;   if (!url || !key) return null;   return { clien` |
| scripts/schema-audit.mjs | /NEXT_PUBLIC_[A-Z0-9_]+/g | `UPABASE_URL;   const key = process.env.[redacted] || process.env.[redacted] || process.env.SUPABASE_ANON_KEY;   if (!url || !k` |
| scripts/schema-audit.mjs | /service_role/gi | `() {   const url = process.env.SUPABASE_URL;   const key = process.env.[redacted] || process.env.[redacted] || process.env.SUP` |
| scripts/setup-supabase-tables.mjs | /process\.env\.[A-Z0-9_]+/g | `ariables de entorno dotenv.config({ path: '.env.local' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.SUPABASE_SERVIC` |
| scripts/setup-supabase-tables.mjs | /process\.env\.[A-Z0-9_]+/g | `' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey)` |
| scripts/setup-supabase-tables.mjs | /service_role/gi | `Url = process.env.SUPABASE_URL; const supabaseServiceKey = process.env.[redacted]; if (!supabaseUrl || !supabaseServiceKey) {   console.error('❌` |
| scripts/setup-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | `Cargar variables de entorno dotenv.config({ path: '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.SUPABASE_SERVICE_RO` |
| scripts/setup-supabase.mjs | /process\.env\.[A-Z0-9_]+/g | ` '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console` |
| scripts/setup-supabase.mjs | /service_role/gi | `nst url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console.error('❌ Faltan vari` |
| scripts/setup-supabase.mjs | /service_role/gi | `eridas:');   console.error('   - SUPABASE_URL');   console.error('   - [redacted]');   process.exit(1); } const supabase = createClient(url, ser` |
| scripts/smoke.mjs | /process\.env\.[A-Z0-9_]+/g | `romises'; import { dirname } from 'node:path'; const SITE = process.argv[2] || process.env.SITE || 'http://localhost:3000'; async function fetchOnce(url) {   ` |
| scripts/test-env.mjs | /process\.env\.[A-Z0-9_]+/g | `.log('🔍 Verificando variables de entorno...\n'); console.log(`USE_SUPABASE: ${process.env.USE_SUPABASE}`); console.log(`USE_ASSETPLAN_SOURCE: ${process.env.US` |
| scripts/test-env.mjs | /process\.env\.[A-Z0-9_]+/g | `E_SUPABASE: ${process.env.USE_SUPABASE}`); console.log(`USE_ASSETPLAN_SOURCE: ${process.env.USE_ASSETPLAN_SOURCE}`); console.log(`SUPABASE_URL: ${process.env.SU` |
| scripts/test-env.mjs | /process\.env\.[A-Z0-9_]+/g | `LAN_SOURCE: ${process.env.USE_ASSETPLAN_SOURCE}`); console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? 'Configurado' : 'No configurado'}`); console.log(`SUP` |
| scripts/test-env.mjs | /process\.env\.[A-Z0-9_]+/g | ` 'Configurado' : 'No configurado'}`); console.log(`[redacted]: ${process.env.[redacted] ? 'Configurado' : 'No configurado'}`); co` |
| scripts/test-env.mjs | /process\.env\.[A-Z0-9_]+/g | `ole.log('\n🔧 Evaluando condiciones:'); console.log(`USE_SUPABASE === "true": ${process.env.USE_SUPABASE === "true"}`); console.log(`USE_ASSETPLAN_SOURCE === "t` |
| scripts/test-env.mjs | /process\.env\.[A-Z0-9_]+/g | `env.USE_SUPABASE === "true"}`); console.log(`USE_ASSETPLAN_SOURCE === "true": ${process.env.USE_ASSETPLAN_SOURCE === "true"}`); if (process.env.USE_SUPABASE ==` |
| scripts/test-env.mjs | /process\.env\.[A-Z0-9_]+/g | `TPLAN_SOURCE === "true": ${process.env.USE_ASSETPLAN_SOURCE === "true"}`); if (process.env.USE_SUPABASE === "true") {   console.log('✅ USE_SUPABASE está habili` |
| scripts/test-env.mjs | /service_role/gi | `s.env.SUPABASE_URL ? 'Configurado' : 'No configurado'}`); console.log(`[redacted]: ${process.env.[redacted] ? 'Configurado' : 'No ` |
| scripts/test-env.mjs | /service_role/gi | `configurado'}`); console.log(`[redacted]: ${process.env.[redacted] ? 'Configurado' : 'No configurado'}`); console.log('\n🔧 Evalu` |
| scripts/test-readall.mjs | /process\.env\.[A-Z0-9_]+/g | `Cargar variables de entorno dotenv.config({ path: '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.SUPABASE_SERVICE_RO` |
| scripts/test-readall.mjs | /process\.env\.[A-Z0-9_]+/g | ` '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console` |
| scripts/test-readall.mjs | /process\.env\.[A-Z0-9_]+/g | `l()...\n');          // Simular la lógica de readAll()     const USE_SUPABASE = process.env.USE_SUPABASE === "true";     console.log(`🔧 USE_SUPABASE: ${USE_SUP` |
| scripts/test-readall.mjs | /service_role/gi | `nst url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console.error('❌ Faltan vari` |
| scripts/test-supabase-connection.mjs | /process\.env\.[A-Z0-9_]+/g | `ariables de entorno dotenv.config({ path: '.env.local' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;` |
| scripts/test-supabase-connection.mjs | /process\.env\.[A-Z0-9_]+/g | `cal' }); const supabaseUrl = process.env.SUPABASE_URL; const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; const supabaseServiceKey = process.env.SUPABASE_S` |
| scripts/test-supabase-connection.mjs | /process\.env\.[A-Z0-9_]+/g | `nst supabaseAnonKey = process.env.SUPABASE_ANON_KEY; const supabaseServiceKey = process.env.[redacted]; console.log('🔍 Probando conexión a Supa` |
| scripts/test-supabase-connection.mjs | /service_role/gi | ` process.env.SUPABASE_ANON_KEY; const supabaseServiceKey = process.env.[redacted]; console.log('🔍 Probando conexión a Supabase...'); console.lo` |
| scripts/test-supabase-direct.mjs | /process\.env\.[A-Z0-9_]+/g | `Cargar variables de entorno dotenv.config({ path: '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.SUPABASE_SERVICE_RO` |
| scripts/test-supabase-direct.mjs | /process\.env\.[A-Z0-9_]+/g | ` '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console` |
| scripts/test-supabase-direct.mjs | /service_role/gi | `nst url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console.error('❌ Faltan vari` |
| scripts/verify-setup.mjs | /process\.env\.[A-Z0-9_]+/g | `Cargar variables de entorno dotenv.config({ path: '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.SUPABASE_SERVICE_RO` |
| scripts/verify-setup.mjs | /process\.env\.[A-Z0-9_]+/g | ` '.env.local' }); const url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console` |
| scripts/verify-setup.mjs | /process\.env\.[A-Z0-9_]+/g | `eRoleKey ? 'Configurado' : 'Faltante'}`);     console.log(`   ✅ USE_SUPABASE: ${process.env.USE_SUPABASE === 'true' ? 'Activado' : 'Desactivado'}`);          //` |
| scripts/verify-setup.mjs | /service_role/gi | `nst url = process.env.SUPABASE_URL; const serviceRoleKey = process.env.[redacted]; if (!url || !serviceRoleKey) {   console.error('❌ Faltan vari` |
| scripts/verify-setup.mjs | /service_role/gi | `BASE_URL: ${url ? 'Configurado' : 'Faltante'}`);     console.log(`   ✅ [redacted]: ${serviceRoleKey ? 'Configurado' : 'Faltante'}`);     console.` |
| tests/unit/whatsapp.test.ts | /process\.env\.[A-Z0-9_]+/g | `Each(() => {     jest.resetModules();     process.env = { ...originalEnv };     process.env.[redacted] = "56912345678";   });   afterEach(() =>` |
| tests/unit/whatsapp.test.ts | /process\.env\.[A-Z0-9_]+/g | `Be(true);   });   test("sin teléfono retorna string vacío", () => {     delete process.env.[redacted];     const link = buildWaLink({ propertyN` |
| tests/unit/whatsapp.test.ts | /NEXT_PUBLIC_[A-Z0-9_]+/g | `     jest.resetModules();     process.env = { ...originalEnv };     process.env.[redacted] = "56912345678";   });   afterEach(() => {     proce` |
| tests/unit/whatsapp.test.ts | /NEXT_PUBLIC_[A-Z0-9_]+/g | `});   test("sin teléfono retorna string vacío", () => {     delete process.env.[redacted];     const link = buildWaLink({ propertyName: "Depto ` |

### Hallazgos
- [media] app/(catalog)/property/[slug]/page.tsx: dangerouslySetInnerHTML requiere sanitización
- [media] scripts/audit.mjs: dangerouslySetInnerHTML requiere sanitización
- [media] scripts/audit.mjs: dangerouslySetInnerHTML requiere sanitización
- [media] scripts/audit.mjs: dangerouslySetInnerHTML requiere sanitización
- [media] scripts/audit.mjs: dangerouslySetInnerHTML requiere sanitización
- [media] scripts/audit.mjs: dangerouslySetInnerHTML requiere sanitización
