# Project Structure & Organization

## Root Directory
```
macro-tracker/
├── public/                 # Static assets
├── src/                   # Source code
├── node_modules/          # Dependencies
├── .kiro/                 # Kiro configuration and steering
├── package.json           # Project configuration
├── vite.config.js         # Vite build configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

## Source Code Organization (`src/`)
```
src/
├── components/            # Reusable UI components
│   └── ui.jsx            # Custom UI component library (Button, Card, Input, etc.)
├── data/                 # Data models and constants
│   └── nutrition.js      # Food database, daily values, utility functions
├── utils/                # Utility functions
│   └── export.js         # Data export functionality (markdown, CSV, JSON, etc.)
├── assets/               # Static assets (images, icons)
├── App.jsx               # Root application component (minimal wrapper)
├── MacroTracker.jsx      # Main application logic and UI
├── main.jsx              # React application entry point
└── *.css                 # Styling files
```

## Component Architecture
- **Single Main Component**: `MacroTracker.jsx` contains the primary application logic
- **Custom UI Library**: `src/components/ui.jsx` provides reusable components (Button, Card, Input, Select, Tabs)
- **Modular Data Layer**: `src/data/nutrition.js` centralizes food database and nutrition calculations
- **Utility Functions**: `src/utils/export.js` handles all data export formats

## Key Files & Responsibilities

### `MacroTracker.jsx`
- Main application state management
- Tab-based UI (Dashboard, Food Log, Exercise, Analysis, Export)
- localStorage integration for data persistence
- All user interactions and form handling

### `src/data/nutrition.js`
- Comprehensive food database with 20+ nutrients per food
- Daily value constants and nutrient calculations
- Search functionality and calorie burn calculations
- Nutrient status evaluation functions

### `src/utils/export.js`
- Multiple export formats (Markdown, Plain Text, CSV, JSON)
- LLM-optimized formatting for AI analysis
- Data aggregation and report generation

### `src/components/ui.jsx`
- Custom UI components replacing external libraries
- Consistent styling with Tailwind CSS classes
- Accessible and responsive component implementations

## Naming Conventions
- **Files**: camelCase for components, kebab-case for utilities
- **Components**: PascalCase (e.g., `MacroTracker`, `TDEECalculator`)
- **Functions**: camelCase (e.g., `addFoodEntry`, `calculateNutrientPercentage`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `FOOD_DATABASE`, `DAILY_VALUES`)

## Data Flow Patterns
- State flows down through props
- Event handlers bubble up through callbacks
- localStorage acts as persistent data layer
- All data transformations happen in utility functions