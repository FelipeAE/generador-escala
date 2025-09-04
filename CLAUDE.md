# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chilean grade scale generator built with React + TypeScript + Vite. The application calculates grade conversions using the official Chilean grading formula with configurable parameters.

## Development Commands

```bash
# Start development server (runs on available port, typically 5173+)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Core Logic (`src/hooks/useGradeScale.ts`)
- Contains the Chilean grading formula implementation with two-segment calculation:
  - **Failing segment**: `nota = nmin + (napr - nmin) * (puntaje / (pmax * e))`
  - **Passing segment**: `nota = napr + (nmax - napr) * ((puntaje - pmax*e) / (pmax*(1-e)))`
- Uses React `useMemo` for performance optimization of scale calculations
- Returns `config`, `updateConfig`, `scaleData`, and `tableColumns`

### State Management
- Single custom hook (`useGradeScale`) manages all application state
- Configuration stored in `GradeScaleConfig` interface
- Default Chilean values: nmax=7.0, nmin=1.0, napr=4.0, exigencia=60%, pmax=100

### UI Structure (`src/App.tsx`)
- Main component handles all user interactions and display
- Dynamic horizontal table layout that adapts column count based on data length
- Export functionality (CSV download and print)
- Configuration panel with collapsible interface

### TypeScript Types (`src/types/index.ts`)
- `GradeScaleConfig`: Configuration parameters
- `ScaleDataPoint`: Individual grade mappings (puntaje → nota)
- `ValidationResult`: For testing/validation (currently unused)

### Styling
- Vanilla CSS with modern gradients and glassmorphism effects
- Responsive design with full viewport width utilization (`max-width: 95vw`)
- Custom color-coded grade ranges (red for failing, green for passing)

## GitHub Pages Deployment

The project is configured for GitHub Pages deployment:
- Base path set to `/generador-escala/` in `vite.config.js`
- Homepage URL configured in `package.json`
- Uses `gh-pages` package for automated deployment

## Key Implementation Details

### Chilean Grading Formula
The application implements the official Chilean dual-segment grading scale where:
- Scores below the approval threshold follow a different slope than scores above
- The approval threshold is calculated as `puntajeMaximo * (exigencia/100)`
- Formula ensures smooth transition at the approval point

### Performance Optimizations
- `useMemo` prevents unnecessary recalculations of scale data
- Dynamic column calculation for optimal horizontal space usage
- Efficient CSV generation without external dependencies

### UI/UX Features
- Real-time updates as configuration changes
- Horizontal table layout maximizes screen real estate
- Color-coded grades for visual clarity
- Export capabilities (CSV and print)
- Mobile-responsive design