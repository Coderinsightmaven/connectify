# 3D Effects and Depth System

This document describes the enhanced 3D effects and depth system implemented across the Connectify interface.

## Overview

The 3D effects system adds visual depth and dimensionality to UI components through:
- Enhanced shadow systems with multiple layers
- Interactive hover effects
- Depth-based layering
- Theme-specific shadow variants
- Glass morphism effects
- Gradient overlays

## Shadow System

### Enhanced Shadow Variables

```css
/* Multi-layered shadows for realistic depth */
--shadow-card: 0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px 0 rgb(0 0 0 / 0.04), 0 1px 2px 0 rgb(0 0 0 / 0.02);
--shadow-card-hover: 0 8px 24px 0 rgb(0 0 0 / 0.12), 0 4px 8px 0 rgb(0 0 0 / 0.06), 0 2px 4px 0 rgb(0 0 0 / 0.04);

/* Interactive button shadows */
--shadow-button: 0 2px 4px 0 rgb(0 0 0 / 0.08), 0 1px 2px 0 rgb(0 0 0 / 0.06);
--shadow-button-hover: 0 4px 8px 0 rgb(0 0 0 / 0.12), 0 2px 4px 0 rgb(0 0 0 / 0.08);
--shadow-button-active: 0 1px 2px 0 rgb(0 0 0 / 0.08), inset 0 1px 2px 0 rgb(0 0 0 / 0.06);
```

### Theme-Specific Shadows

#### Dark Theme
- Higher opacity shadows for contrast
- Enhanced visibility in dark environments

#### Light Blue Theme
- Blue-tinted shadows using `rgb(59 130 246)`
- Maintains theme consistency in shadow colors

## CSS Classes

### Depth Layers
```css
.depth-1    /* Subtle elevation */
.depth-2    /* Light shadow */
.depth-3    /* Medium shadow */
.depth-4    /* Strong shadow */
.depth-5    /* Maximum elevation */
```

### Interactive Effects
```css
.card-elevated          /* Auto-elevating cards with hover effects */
.button-3d             /* 3D button with lift on hover */
.interactive-depth     /* Generic interactive depth change */
.floating              /* Subtle floating animation */
```

### Special Effects
```css
.glass-effect          /* Glass morphism with backdrop blur */
.gradient-overlay      /* Subtle gradient overlay for depth */
```

## Component Enhancements

### Card Component
New `variant` prop supports:
- `default`: Standard shadow
- `elevated`: Enhanced hover effects
- `floating`: Elevated with floating animation
- `glass`: Glass morphism effect

```tsx
<Card variant="elevated">
  <CardContent>Interactive elevated card</CardContent>
</Card>
```

### Button Component
All button variants now include 3D effects:
- Enhanced shadows on hover
- Smooth transitions
- Active state depth changes

### Theme Toggle
Enhanced with card elevation and depth effects for better visual hierarchy.

## Usage Guidelines

### When to Use Depth Effects

1. **Cards**: Use `elevated` variant for interactive content
2. **Buttons**: 3D effects are applied automatically
3. **Headers**: Use `depth-4` for sticky navigation
4. **Interactive Elements**: Apply `interactive-depth` for hover effects

### Depth Hierarchy

- **Depth 1-2**: Subtle UI elements, secondary content
- **Depth 3**: Primary content areas, cards
- **Depth 4**: Navigation, sticky headers
- **Depth 5**: Modals, overlays, critical actions

### Performance Considerations

- All effects use CSS transforms and opacity for GPU acceleration
- Transitions use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth motion
- Effects are optimized for 60fps performance

## Animation Specifications

### Hover Transitions
- Duration: 200-300ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Transform: `translateY(-1px to -3px)`

### Floating Animation
- Duration: 6s
- Movement: 4px vertical
- Easing: `ease-in-out`

## Accessibility

- All depth effects are visual enhancements only
- Focus states remain clearly visible
- No essential information conveyed through depth alone
- Respects `prefers-reduced-motion` for animations

## Browser Support

- Modern browsers with CSS3 support
- Graceful degradation for older browsers
- Hardware acceleration where available

## Implementation Examples

### Basic Elevated Card
```tsx
<Card variant="elevated" className="p-6">
  <h3>Interactive Content</h3>
  <p>Hovers and lifts on interaction</p>
</Card>
```

### Glass Effect Panel
```tsx
<div className="glass-effect p-6 rounded-lg">
  <h3>Glass Morphism</h3>
  <p>Translucent with backdrop blur</p>
</div>
```

### Interactive Depth Element
```tsx
<div className="interactive-depth p-4 rounded-lg bg-card border">
  <h4>Hover for Depth</h4>
  <p>Lifts up with enhanced shadows</p>
</div>
``` 