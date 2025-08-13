# Cursor Setup - Hommie 0% Comisión

Este directorio contiene la configuración de Project Rules para Cursor AI, optimizada para el desarrollo del proyecto Hommie.

## 📁 Estructura

```
.cursor/
├── rules/
│   ├── 00-core.mdc          # Reglas fundamentales (Always Apply)
│   ├── 10-api.mdc           # Estándares de APIs (Auto Attached)
│   ├── 20-components.mdc    # UI/Componentes (Auto Attached)
│   ├── 30-pages.mdc         # Páginas App Router (Auto Attached)
│   └── prompts.mdc          # Plantillas de prompts (Agent Requested)
├── .cursorignore            # Archivos ignorados por el AI
└── README.md               # Esta documentación
```

## 🎯 Cómo Usar

### Reglas Automáticas
- **00-core.mdc**: Se aplica siempre en todo el proyecto
- **10-api.mdc**: Se aplica automáticamente en archivos `app/api/**/*`
- **20-components.mdc**: Se aplica automáticamente en `components/**/*` y `app/**/*`
- **30-pages.mdc**: Se aplica automáticamente en `app/**/page.tsx` y `app/**/layout.tsx`

### Plantillas de Prompts
Para usar las plantillas, pide al AI:
- `@prompts A` - Plantilla de Diagnóstico
- `@prompts B` - Plantilla de API
- `@prompts C` - Plantilla de Componente
- `@prompts D` - Plantilla de Página
- `@prompts E` - Plantilla de Cierre

## 🚀 Flujo de Trabajo

1. **Implementación**: El AI entrega Plan (5-7 pasos) + aplica SOLO Paso 1
2. **QA**: Comandos de verificación incluidos
3. **Riesgos**: Identificación de problemas potenciales y rollback

## 🔧 Comandos QA Recomendados

Configura estos en Cursor → Settings → Shell Commands:

```bash
# QA completo
pnpm lint && pnpm typecheck && pnpm test -s && pnpm build && node scripts/release-gate.mjs

# Gate con puerto custom
RG_PORT=3001 node scripts/release-gate.mjs

# Dev
pnpm dev
```

## 📋 Stack del Proyecto

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript estricto, Tailwind CSS
- **Animaciones**: Framer Motion
- **Validación**: Zod
- **Testing**: Jest + Testing Library
- **Linting**: ESLint + Prettier

## 🎨 Estándares de UI

- **Tema**: Dark theme por defecto
- **Bordes**: `rounded-2xl`
- **Focus**: `focus-ring` para accesibilidad
- **Componentes**: Server Components por defecto
- **A11y**: Targets ≥44px, labels, roles/aria

## 🔒 Seguridad

- **APIs**: Rate limit 20/60s por IP
- **Logs**: Sin PII (Personal Identifiable Information)
- **Validación**: Zod server-side
- **Errores**: Códigos HTTP apropiados (200/400/429/500)

## 📝 Commits y PRs

- **Commits**: Conventional Commits
- **Branches**: `feature/<featureName>`
- **PRs**: Pequeños con checklist del `PULL_REQUEST.md`

## 🐛 Troubleshooting

Si las reglas no se aplican:
1. Verifica que los archivos `.mdc` estén en `.cursor/rules/`
2. Reinicia Cursor
3. Verifica que los `globs` coincidan con tus archivos
4. Revisa la consola de Cursor para errores

## 📚 Recursos

- [Cursor Rules Documentation](https://docs.cursor.com/context/rules-for-ai)
- [Project Structure](https://docs.cursor.com/context/project-structure)
- [Shell Commands](https://docs.cursor.com/context/shell-commands)
