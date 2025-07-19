# Modern Design System Foundation

This design system provides a comprehensive foundation for the Macro Tracker application with enhanced UI components, consistent styling, and modern design tokens.

## Overview

The design system includes:
- **Comprehensive color palette** with semantic naming
- **Typography scale** with improved line heights and readability
- **Spacing system** with consistent measurements
- **Component sizing standards** for inputs, buttons, and interactive elements
- **Enhanced shadow system** for depth and visual hierarchy
- **Modern border radius** and transition utilities
- **Z-index scale** for proper layering
- **Accessibility improvements** with better focus states

## Files Structure

```
src/styles/
├── design-system.css    # Main design system with CSS custom properties
└── README.md           # This documentation

src/
├── index.css           # Enhanced base styles and global improvements
└── components/ui.jsx   # Updated UI components using design system
```

## Key Features

### 1. Color Palette
- **Primary**: Blue-based brand colors (50-950 scale)
- **Secondary**: Slate-based neutral colors
- **Semantic**: Success (green), Warning (yellow), Error (red)
- **Neutral**: Enhanced gray scale with better contrast

### 2. Typography Scale
- Consistent font sizes from `xs` (12px) to `4xl` (36px)
- Improved line heights for better readability
- Font weight scale: normal, medium, semibold, bold

### 3. Spacing System
- Extended spacing scale with half-step increments
- Consistent measurements from 2px to 96px
- Custom spacing for specific use cases

### 4. Component Sizing Standards
- **Input Heights**: 36px (sm), 40px (default), 44px (lg)
- **Button Heights**: 36px (sm), 40px (default), 44px (lg), 48px (xl)
- **Icon Sizes**: 16px (xs) to 40px (xl)
- **Card Minimum Heights**: 64px (default), 96px (lg)

### 5. Shadow System
- Enhanced shadow utilities from `xs` to `2xl`
- Component-specific shadows (card, button, etc.)
- Hover state shadows for interactive elements

### 6. Z-Index Scale
- Organized layering system from 1 to 1080
- Semantic naming for UI layers (dropdown, modal, tooltip, etc.)

## CSS Custom Properties

The design system uses CSS custom properties for consistent theming:

```css
:root {
  /* Colors */
  --color-primary-600: #2563eb;
  --color-success-600: #16a34a;
  
  /* Typography */
  --font-size-base: 1rem;
  --line-height-base: 1.5rem;
  
  /* Spacing */
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  
  /* Component Sizing */
  --height-button-base: 2.5rem;
  --height-input-base: 2.5rem;
  
  /* Shadows */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-button: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

## Enhanced UI Components

### Button Component
- **Variants**: default, outline, secondary, destructive, ghost, success, warning
- **Sizes**: sm, default, lg, xl, icon
- **Features**: Enhanced shadows, active states, improved focus rings

### Card Component
- **Interactive mode**: Hover effects and enhanced shadows
- **Flexible sizing**: sm, default, lg content padding
- **Semantic headers**: Configurable heading levels

### Input & Select Components
- **Sizes**: sm, default, lg
- **Error states**: Red border and focus ring for validation
- **Enhanced focus**: Improved accessibility with better focus indicators

### Badge Component
- **Variants**: default, secondary, destructive, success, warning, neutral
- **Sizes**: sm, default, lg
- **Smooth transitions**: Color transitions on state changes

### Tabs Component
- **Enhanced styling**: Better visual hierarchy and spacing
- **Smooth animations**: Fade-in effects for content transitions
- **Flexible sizing**: Configurable tab trigger sizes

## Utility Classes

The design system provides prefixed utility classes to avoid conflicts:

```css
.ds-card-base          /* Base card styling */
.ds-card-interactive   /* Interactive card with hover effects */
.ds-button-base        /* Base button styling */
.ds-input-base         /* Base input styling */
.ds-focus-ring         /* Standard focus ring */
.ds-focus-ring-error   /* Error state focus ring */
.ds-animate-fade-in    /* Fade in animation */
.ds-interactive        /* Interactive color transitions */
.ds-container-padding  /* Responsive container padding */
```

## Accessibility Features

- **Enhanced focus states**: Visible focus rings with proper contrast
- **Reduced motion support**: Respects user's motion preferences
- **High contrast mode**: Adapts shadows for better visibility
- **Keyboard navigation**: Proper focus management for interactive elements
- **Screen reader support**: Semantic HTML structure maintained

## Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **CSS Features**: CSS custom properties, CSS Grid, Flexbox
- **Fallbacks**: Graceful degradation for older browsers

## Usage Examples

### Basic Button Usage
```jsx
<Button variant="default" size="lg">
  Primary Action
</Button>

<Button variant="outline" size="sm">
  Secondary Action
</Button>
```

### Card with Interactive Effects
```jsx
<Card interactive>
  <CardHeader>
    <CardTitle level={2}>Card Title</CardTitle>
  </CardHeader>
  <CardContent size="lg">
    Card content with enhanced spacing
  </CardContent>
</Card>
```

### Form Elements with Error States
```jsx
<Input 
  size="lg" 
  error={hasError}
  placeholder="Enter value"
/>

<Select size="default" error={hasError}>
  <option>Choose option</option>
</Select>
```

## Customization

The design system can be customized by:

1. **Modifying CSS custom properties** in `design-system.css`
2. **Extending Tailwind config** in `tailwind.config.js`
3. **Adding new utility classes** with the `ds-` prefix
4. **Creating component variants** in `ui.jsx`

## Performance Considerations

- **CSS custom properties**: Efficient runtime theming
- **Tailwind CSS**: Optimized utility-first approach
- **Minimal JavaScript**: Component logic kept lightweight
- **Tree shaking**: Unused styles automatically removed in production

## Future Enhancements

- **Dark mode support**: CSS custom properties prepared for theme switching
- **Container queries**: Modern responsive design patterns
- **Advanced animations**: Micro-interactions and page transitions
- **Component variants**: Additional styling options as needed

---

This design system provides a solid foundation for consistent, accessible, and modern UI development while maintaining flexibility for future enhancements and customizations.