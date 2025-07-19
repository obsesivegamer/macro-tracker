# Technology Stack & Development Guidelines

## Build System & Framework
- **Build Tool**: Vite 7.0.4 with React plugin
- **Framework**: React 19.1.0 with modern hooks (useState, useEffect)
- **Module System**: ES modules (`"type": "module"` in package.json)
- **Styling**: Tailwind CSS 4.1.11 with Vite plugin integration

## Key Dependencies
- **Charts**: Recharts 3.1.0 for data visualization (PieChart, BarChart, LineChart)
- **Date Handling**: date-fns 2.30.0 for date formatting and manipulation
- **Icons**: Lucide React 0.263.1 for consistent iconography
- **UI Components**: Custom UI components in `src/components/ui.jsx` (no external UI library)

## Development Tools
- **Linting**: ESLint 9.30.1 with React hooks and refresh plugins
- **Code Quality**: Configured with globals and modern ECMAScript standards

## Common Commands
```bash
# Development
npm run dev          # Start development server (typically http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Installation
npm install          # Install all dependencies
```

## Architecture Patterns
- **State Management**: React hooks (useState, useEffect) - no external state management
- **Data Persistence**: localStorage with automatic saving on state changes
- **Component Structure**: Functional components with hooks
- **Data Flow**: Props down, callbacks up pattern
- **Export System**: Modular export utilities in `src/utils/export.js`

## Code Style Guidelines
- Use functional components with hooks
- Prefer const/let over var
- Use template literals for string interpolation
- Implement proper error handling for localStorage operations
- Follow React best practices for useEffect dependencies
- Use descriptive variable names and consistent formatting