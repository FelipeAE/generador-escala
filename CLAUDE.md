# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Generador de Escala de Notas Chilenas** is a web application that generates academic grade conversion scales using the official Chilean grading formula. Built with React, TypeScript, and Vite, it provides a modern, responsive UI for educators to configure and visualize grade scales.

**Live Demo**: https://felipeae.github.io/generador-escala/

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173+)
npm run build        # Build for production
npm run lint         # Check code quality
npm run deploy       # Deploy to GitHub Pages
```

## Architecture Overview

### State Management Pattern
The application uses a **single custom hook** architecture for state:
- **`useGradeScale()`** ([src/hooks/useGradeScale.ts](src/hooks/useGradeScale.ts)): Manages all state and calculations
  - `config`: User settings (parameters for grading formula)
  - `scaleData`: Calculated grade mappings (memoized)
  - `tableColumns`: Organized data for horizontal display (memoized)
  - `updateConfig()`: Partial config update function

This pattern keeps state logic centralized and UI focused.

### Component Structure
**Main Component** ([src/App.tsx](src/App.tsx)):
- Header with title and action buttons
- Stats bar displaying key metrics
- Collapsible configuration panel
- Dynamic horizontal table with conditional rendering
- Export functionality (CSV, print)

**Type Definitions** ([src/types/index.ts](src/types/index.ts)):
```typescript
GradeScaleConfig     // Configuration parameters
ScaleDataPoint       // Individual score→grade mapping
ValidationResult     // Test/validation helper (unused)
```

**Styling** ([src/index.css](src/index.css)):
- Modern gradients and glassmorphism effects
- Responsive layout with full-width table
- Color-coded grades (red=failing, green=passing)
- No CSS framework—vanilla CSS only

## Core Algorithm: Chilean Grading Formula

The application implements the official Chilean dual-segment grading scale:

**Failing Segment** (score < approval threshold):
```
nota = nmin + (napr - nmin) × (puntaje / (pmax × e))
```

**Passing Segment** (score ≥ approval threshold):
```
nota = napr + (nmax - napr) × ((puntaje - pmax×e) / (pmax×(1-e)))
```

**Key Variables**:
- `nmax` = Maximum grade (7.0)
- `nmin` = Minimum grade (1.0)
- `napr` = Approval grade (4.0)
- `e` = Requirement/exigence as decimal (60% = 0.6)
- `pmax` = Maximum score (100)
- `puntajeAprobacion` = `pmax × e` (approval threshold score)

**Default Configuration**:
```typescript
{
  puntajeMaximo: 100,
  exigencia: 60,           // Percentage required to pass
  notaMinima: 1.0,
  notaMaxima: 7.0,
  notaAprobacion: 4.0,
  incremento: 1.0,         // Score step (1.0 = every point)
  orden: 'asc'             // Ascending or descending order
}
```

**Implementation Details**:
- Approval threshold: `100 × 0.60 = 60 points`
- Grade of 4.0 is awarded at 60 points (formula design ensures this)
- Values clamped to [nmin, nmax] range
- Rounded to 1 decimal place: `Math.round(nota × 10) / 10`

## Performance Optimizations

1. **useMemo Hooks**: Scale data and table columns only recalculate when `config` changes
2. **Dynamic Column Layout**: Optimizes table columns based on data length to avoid horizontal scrolling
3. **Vite Build**: Fast development server with ES module-based bundling
4. **No Runtime Dependencies**: Styling uses vanilla CSS (no CSS-in-JS library overhead)

## Key Files

| File | Purpose |
|------|---------|
| [src/hooks/useGradeScale.ts](src/hooks/useGradeScale.ts) | Core algorithm and state management |
| [src/App.tsx](src/App.tsx) | Main UI component and user interactions |
| [src/types/index.ts](src/types/index.ts) | TypeScript type definitions |
| [src/index.css](src/index.css) | Global styles and responsive design |
| [vite.config.js](vite.config.js) | Vite config with React plugin, base path for GitHub Pages |
| [tsconfig.json](tsconfig.json) | TypeScript: ES2020 target, strict mode, React JSX |
| [eslint.config.js](eslint.config.js) | ESLint with React Hooks and Refresh plugins |
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | CI/CD: Build and deploy to GitHub Pages on main push |

## UI/UX Features

- **Responsive Layout**: Full-width horizontal table with dynamic column distribution
- **Real-time Updates**: Configuration changes instantly recalculate and display
- **Export Options**: CSV download and print functionality
- **Configuration Persistence**: All parameters configurable with reset to defaults
- **Stats Display**: Quick metrics view showing approval threshold, requirement %, and total entries
- **Collapsible Settings**: Hide/show configuration panel to maximize table view

## GitHub Actions CI/CD

**Workflow** ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)):
- Trigger: Push to main or PR to main
- Steps: Checkout → Node.js setup → npm install → npm run build → Deploy to GitHub Pages
- **Important**: Deploy only runs on main branch pushes (not PRs)

**Deployment Settings**:
- Base URL: `/generador-escala/` (set in vite.config.js)
- Target directory: `./dist`
- Token: Uses `${{ secrets.GITHUB_TOKEN }}`

## Development Tips

### Adding New Configuration Parameters
1. Add field to `GradeScaleConfig` interface in [src/types/index.ts](src/types/index.ts)
2. Add to default config in `useGradeScale()`
3. Add form input in configuration panel in [src/App.tsx](src/App.tsx)
4. Incorporate into formula logic in `useGradeScale()`

### Modifying the Grading Formula
The formula is implemented in [src/hooks/useGradeScale.ts](src/hooks/useGradeScale.ts) in the `scaleData` memoized calculation. Key points:
- Two segments split at `puntajeAprobacion = puntajeMaximo * (exigencia / 100)`
- Ensure formula preserves: grade exactly 4.0 at approval threshold score
- Remember to test edge cases (puntaje = 0, puntaje = pmax)

### Testing Changes
```bash
npm run dev    # Start dev server to test interactively
npm run build  # Verify production build succeeds
npm run lint   # Check for code issues
```

### Deployment
```bash
npm run deploy  # Builds and pushes to GitHub Pages
               # OR GitHub Actions handles this automatically on push to main
```

## Technology Stack

- **React 19.1.1** - UI framework with hooks
- **TypeScript 5.9.2** - Static typing
- **Vite 7.1.2** - Build tool and dev server
- **Tailwind CSS 4.1.13** - Utility CSS (available but project uses vanilla CSS)
- **Lucide React 0.542.0** - Modern icon library
- **PostCSS 8.5.6** - CSS transformation (autoprefixer)
- **ESLint 9.33.0** - Code quality (React Hooks plugin)
- **gh-pages 6.3.0** - GitHub Pages deployment
- **Node.js 18+** - Runtime (from CI/CD config)

## Common Tasks

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Check code quality
```bash
npm run lint
```

### Preview production build locally
```bash
npm run preview
```

### Deploy to GitHub Pages
```bash
npm run deploy
```
