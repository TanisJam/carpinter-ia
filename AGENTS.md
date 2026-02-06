# Carpinter-IA - Agent Guidelines

## Build & Lint Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Project Overview

Next.js 16 + React 19 app for 3D wardrobe customization. Uses Three.js for 3D rendering, Zustand for state, Zod for validation, and shadcn/ui components.

## Code Style Guidelines

### Imports
- Use path aliases: `@/*` maps to `./src/*`
- Third-party imports first, then `@/*` imports, then relative imports
- Group by type: React/Next.js, libraries, internal modules

### File & Naming Conventions
- **Component files**: kebab-case (`wardrobe-model.tsx`, `step-dimensiones.tsx`)
- **Components**: PascalCase (`WardrobeModel`, `StepDimensiones`)
- **Stores**: `use{Feature}Store` pattern (`useWardrobeStore`)
- **Constants**: UPPER_SNAKE_CASE (`PANEL_THICKNESS_M`, `DIMENSION_LIMITS`)
- **Functions**: camelCase (`computeSectionCenterX`, `setDimensions`)
- **IDs**: Use `genId()` from store (`sec-101`, `mod-102`)
- **Schema enums**: kebab-case values (`sin_puertas`, `melamina_blanco`)

### Directory Structure
```
src/
  app/              # Next.js App Router pages & layouts
  components/
    ui/            # shadcn/ui primitives (keep as-is)
    three/         # 3D rendering components
    wizard/        # Multi-step wizard components
    panels/        # UI panels (customization, AI suggestions)
    homepage/      # Homepage components
  stores/          # Zustand state management
  schemas/         # Zod schemas (source of truth for types)
  types/           # Re-exported types from schemas
  lib/             # Utilities, constants, AI client
```

### TypeScript & Types
- `strict: true` enabled
- All types are re-exported from `@/types/index.ts`
- **Source of truth**: Zod schemas in `@/schemas/wardrobe-schema.ts`
- Infer types with `z.infer<typeof schema>` then re-export
- Explicit types for function parameters and returns
- Use `as const` for readonly arrays

### React Components
- Add `"use client"` directive at top for client components
- Use PascalCase for component exports
- Extract constants outside component when possible
- For 3D: use `@/components/three/` pattern with `<mesh>` primitives

### State Management (Zustand)
- Immutability: spread operators `...state` or `...config`
- Update nested state by mapping arrays or spreading objects
- Use selector pattern: `useStore((s) => s.config.dimensions)`
- All config updates update `metadata.updatedAt` to ISO string

### Measurements & Units
- **Internal**: All measurements in millimeters (mm)
- **User display**: Convert to centimeters (divide by 10)
- **3D rendering**: Convert to meters (divide by 1000)
- Constants in `@/lib/constants.ts` use `_M` suffix for meters

### Styling
- Tailwind CSS v4 with CSS variables
- Use `cn()` utility from `@/lib/utils` for conditional classes
- shadcn/ui New York style, neutral base color
- CSS variables for theming (defined in `globals.css`)

### Error Handling
- Validate with Zod schemas before using data
- Use TypeScript `as` sparingly, prefer type guards
- Handle API responses with proper error boundaries

### Comments
- Use Spanish for comments (this is a Spanish-language app)
- Keep them concise and relevant to business logic

### Linting
- ESLint config extends `next/core-web-vitals` and `next/typescript`
- Run `npm run lint` before committing

### Testing
- No test framework configured yet

### Creating New Features
1. Define Zod schema in `@/schemas/` if new data types needed
2. Export inferred types from `@/types/index.ts`
3. Add constants to `@/lib/constants.ts` if needed
4. Create Zustand actions in appropriate store file
5. Build UI components in `@/components/{feature}/`
6. Use shadcn/ui primitives from `@/components/ui/`
