# Enhanced Macro Tracker

A comprehensive nutrition tracking application built with React, designed to rival the features of Cronometer with enhanced data export capabilities for AI analysis.

## Features

### 🍽️ Advanced Food Tracking
- **Comprehensive Food Database**: 20+ foods with detailed macro and micronutrient data
- **Smart Food Search**: Quickly find foods with autocomplete suggestions
- **Custom Food Entry**: Add foods not in the database
- **Detailed Nutrition Tracking**: Track 20+ nutrients including vitamins, minerals, and macros
- **Meal Categorization**: Organize entries by breakfast, lunch, dinner, and snacks

### 📊 Advanced Analytics
- **Macro Distribution**: Visual pie charts of protein, carbs, and fat intake
- **Nutrient Analysis**: Compare daily intake against recommended values
- **Progress Tracking**: Monitor intake patterns over time
- **TDEE Calculator**: Personalized calorie targets based on goals
- **Nutrient Status Indicators**: Color-coded status for each nutrient

### 🏃‍♂️ Exercise & Biometrics
- **Exercise Logging**: Track various exercises with automatic calorie burn calculation
- **Multiple Exercise Types**: Cardio, strength training, flexibility, and HIIT
- **Duration Tracking**: Log workout duration and estimated calories burned
- **Exercise History**: View recent exercise sessions

### 📈 Smart Export & AI Integration
- **🎯 LLM-Optimized Export**: Special format designed for AI health analysis
- **📄 Markdown Reports**: Comprehensive reports with analysis and insights
- **📊 CSV Data**: Export for spreadsheet analysis
- **⚙️ JSON Backup**: Complete data backup in technical format
- **🤖 AI Analysis Ready**: One-click copy for ChatGPT, Claude, or other AI assistants

### 💾 Data Persistence
- **Local Storage**: All data saved locally in your browser
- **Real-time Sync**: Changes saved automatically
- **Data Integrity**: Reliable data storage and retrieval

## Technology Stack

- **Frontend**: React 19 with Hooks
- **Build Tool**: Vite 7.0.4 with React plugin
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date formatting
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS 4.1.11 with comprehensive design system
- **State Management**: React Hooks (useState, useEffect)
- **UI Components**: Custom component library with modern design patterns

## Installation

1. **Clone or download** the repository
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development server**:
   ```bash
   npm run dev
   ```
4. **Open browser** to the URL shown in terminal (typically `http://localhost:5173`)

## Usage Guide

### Getting Started
1. **Set up your profile** in the Analysis tab
2. **Log your first meal** in the Food Log tab
3. **Track exercise** in the Exercise tab
4. **View insights** in the Dashboard
5. **Export data** for AI analysis in the Export tab

### AI Analysis Integration
1. Go to the **Export tab**
2. Click **"📋 Copy for AI Analysis"**
3. Paste the data into your preferred AI assistant
4. Ask questions like:
   - "Analyze my nutrition and suggest improvements"
   - "What nutrients am I deficient in?"
   - "How can I optimize my diet for my goals?"

## Key Improvements Over Basic Version

### Enhanced Features
- **5x More Nutrients**: Track 20+ nutrients vs. 3 basic macros
- **Smart Food Database**: 20+ foods with complete nutrition data
- **Exercise Integration**: Track workouts alongside nutrition
- **Advanced Analytics**: Nutrient status indicators and progress tracking
- **Professional Export**: Multiple export formats including AI-optimized

### Better User Experience
- **Tabbed Interface**: Organized sections for different functions
- **Visual Feedback**: Color-coded nutrient status and progress bars
- **Responsive Design**: Works on desktop and mobile devices
- **Data Persistence**: Never lose your logged data
- **Intuitive Navigation**: Easy-to-use interface with clear sections

### AI-Ready Features
- **LLM-Optimized Export**: Specially formatted for AI analysis
- **Comprehensive Reports**: Include context and recommendations
- **Health Insights**: Built-in analysis and findings
- **Question Prompts**: Suggested questions for AI assistants

## Export Features Explanation

### Why This Matters
The export functionality addresses a critical gap in nutrition tracking - the ability to get personalized, intelligent analysis of your data. By exporting your nutrition data in an AI-optimized format, you can:

- Get personalized nutrition recommendations
- Identify nutrient deficiencies or excesses
- Understand eating patterns and their health implications
- Receive advice tailored to your specific goals and dietary restrictions
- Track progress and make data-driven health decisions

### Export Formats
1. **LLM Analysis**: Plain text optimized for AI assistants
2. **Markdown Report**: Human-readable comprehensive analysis
3. **CSV Data**: For spreadsheet analysis and data science
4. **JSON Backup**: Complete data backup for technical users

## Contributing

This is an enhanced version of a basic macro tracker, upgraded to match professional nutrition tracking applications. The focus has been on:

- Comprehensive nutrition data
- Professional-grade export capabilities
- AI integration readiness
- User experience improvements
- Data accuracy and reliability

## Design System & UI

### Modern Design Foundation ✅ IMPLEMENTED
The application features a comprehensive design system built with Tailwind CSS and CSS custom properties:

- **Color Palette**: Complete semantic color system with 50-950 shades for primary, secondary, success, warning, error, and neutral colors
- **Typography Scale**: Systematic font sizes (12px-36px) with optimized line heights for perfect readability
- **Spacing System**: Consistent spacing scale using 4px base unit (2px-96px) for harmonious layouts
- **Shadow System**: Modern elevation with 8 shadow levels from subtle to dramatic depth
- **Animation Framework**: Smooth transitions with custom keyframes and easing functions
- **Component Standards**: Unified sizing standards for inputs (36-48px), buttons, icons, and interactive elements
- **Z-Index Scale**: Organized layering system for modals, dropdowns, tooltips, and overlays
- **Utility Classes**: Pre-built classes for animations, focus states, interactions, and responsive design

### Design Tokens & CSS Variables
- **CSS Custom Properties**: 100+ design tokens for colors, spacing, typography, and component sizing
- **Semantic Naming**: Intuitive variable names like `--color-primary-600` and `--spacing-4`
- **Component-Specific Tokens**: Dedicated variables for card shadows, button heights, and input styling
- **Responsive Breakpoints**: Standardized breakpoints for consistent responsive behavior

### Accessibility & Responsiveness
- **WCAG AA Compliance**: All color combinations meet accessibility contrast standards
- **Focus Management**: Visible focus indicators with proper ring styling for keyboard navigation
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes (640px-1536px+)
- **Touch-Friendly**: Minimum 44px touch targets and proper spacing for mobile interactions
- **Reduced Motion**: Respects user preferences for reduced motion and animations
- **High Contrast Support**: Enhanced visibility for users requiring high contrast interfaces

## Recent Enhancements ✨

### Modern UI Redesign (Phase 2 - In Progress)
- ✅ **Complete Design System**: 100+ CSS custom properties for colors, spacing, typography, and components
- ✅ **Enhanced Component Library**: Modern Button, Card, Input, Select with loading states and variants
- ✅ **Responsive Navigation**: Mobile-first tab system with icons and smooth animations
- ✅ **Form Improvements**: Better validation styling, helper text, and user feedback
- ✅ **Progress Indicators**: Modern progress bars for nutrient tracking with color coding
- ✅ **Alert System**: Success, warning, error, and info alerts for better user communication

### Next Phase
- **Chart Modernization**: Enhanced data visualization with modern styling and interactions
- **Micro-interactions**: Polished animations and hover effects throughout the interface
- **Final Polish**: Accessibility improvements and mobile optimization

## Future Enhancements

- **Dark Mode**: Theme switching capabilities
- Recipe builder and meal planning
- Barcode scanning simulation
- Advanced reporting and trends
- Goal setting and achievement tracking
- Social features and data sharing
- Integration with fitness devices

## License

Open source - feel free to use and modify for your needs.
