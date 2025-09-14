# Animated Background Configuration Guide

## Overview

The AnimatedBackground component provides highly customizable background effects for your portfolio's home page. It supports multiple background types with extensive configuration options, all controllable through the `settings.json` file.

## Quick Start

The animated background is configured in the `home.background` section of your `settings.json` file:

```json
{
  "home": {
    "background": {
      "type": "animated-network",
      "enabled": true,
      "particles": { /* particle settings */ },
      "animation": { /* animation settings */ },
      "gradient": { /* gradient settings */ }
    }
  }
}
```

## Background Types

### 1. Animated Network (`animated-network`)
Creates moving particles with connecting lines between nearby particles.

**Best for**: Modern, tech-focused portfolios, interactive experiences
**Performance**: Medium (depends on particle count and connection distance)

### 2. Particles Only (`particles`)
Shows moving particles without connections between them.

**Best for**: Cleaner look while maintaining interactivity
**Performance**: Better than animated-network (no connection calculations)

### 3. Gradient (`gradient`)
Displays a static gradient background.

**Best for**: Minimal designs, performance-critical scenarios
**Performance**: Excellent (no animations)

### 4. None (`none`)
Disables the background effect entirely.

**Best for**: Accessibility, performance optimization, custom backgrounds
**Performance**: Best (no rendering)

## Configuration Options

### Core Settings

```json
{
  "type": "animated-network",  // Background type
  "enabled": true              // Enable/disable the effect
}
```

### Particle Configuration

All particle-based backgrounds support these options:

```json
{
  "particles": {
    "count": 150,              // Number of particles (10-500)
    "size": 2,                 // Base particle size in pixels (0.5-10)
    "color": "#ef4444",        // Particle color (hex, rgb, rgba, or CSS color)
    "speed": 0.5,              // Movement speed (0.1-5)
    "glow": true,              // Enable glow effect (boolean)
    "glowSize": 8,             // Glow size in pixels (0-50)
    "pulseIntensity": 0.3,     // Opacity pulsing intensity (0-1)
    "pulseSpeed": 0.002,       // Pulsing animation speed (0.001-0.01)
    "mouseInfluence": 120,     // Mouse interaction distance (0-300)
    "mouseForce": 3,           // Mouse repulsion strength (0-10)
    "returnSpeed": 0.05        // Return to normal speed (0.01-1)
  }
}
```

### Connection Configuration (Animated Network Only)

```json
{
  "particles": {
    "connections": {
      "enabled": true,                    // Show connections
      "distance": 200,                    // Max connection distance (50-400)
      "color": "rgba(147, 51, 234, 0.2)", // Connection color
      "width": 2,                         // Line width (0.1-10)
      "maxOpacity": 0.5                   // Maximum line opacity (0-1)
    }
  }
}
```

### Animation Settings

```json
{
  "animation": {
    "speed": 1,        // Overall speed multiplier (0.1-5)
    "smoothness": 60   // Target FPS (15-120)
  }
}
```

### Gradient Configuration

```json
{
  "gradient": {
    "enabled": false,              // Show gradient (can combine with particles)
    "colors": [                    // 2-5 gradient colors
      "rgba(15, 23, 42, 1)",
      "rgba(30, 41, 59, 0.8)",
      "rgba(51, 65, 85, 0.6)"
    ],
    "direction": "to bottom right" // Gradient direction
  }
}
```

## Performance Optimization

### For Lower-End Devices
```json
{
  "particles": {
    "count": 50,       // Reduce particle count
    "glow": false      // Disable glow effects
  },
  "animation": {
    "smoothness": 30   // Lower FPS target
  }
}
```

### For High-End Devices
```json
{
  "particles": {
    "count": 300,      // More particles
    "glowSize": 15     // Larger glow effects
  },
  "animation": {
    "smoothness": 120  // Higher FPS for smoother animation
  }
}
```

## Color Schemes

### Tech/Modern Theme
```json
{
  "particles": {
    "color": "#3b82f6",
    "connections": {
      "color": "rgba(59, 130, 246, 0.2)"
    }
  }
}
```

### Warm/Creative Theme
```json
{
  "particles": {
    "color": "#f59e0b",
    "connections": {
      "color": "rgba(245, 158, 11, 0.3)"
    }
  }
}
```

### Minimalist Theme
```json
{
  "particles": {
    "color": "rgba(255, 255, 255, 0.3)",
    "glow": false,
    "connections": {
      "color": "rgba(255, 255, 255, 0.1)",
      "width": 1
    }
  }
}
```

## Accessibility Considerations

- Set `enabled: false` for users with motion sensitivity
- Use `prefers-reduced-motion` CSS queries in your styles
- Provide a toggle option in your UI
- Consider performance impact on mobile devices

## Troubleshooting

### Performance Issues
1. Reduce `count` (try 50-100 particles)
2. Lower `smoothness` (try 30 FPS)
3. Disable `glow` effects
4. Reduce `distance` for connections

### Visual Issues
1. Check color contrast against your content
2. Adjust `maxOpacity` for connections
3. Modify `pulseIntensity` for better visibility
4. Test on different screen sizes

### Interactive Issues
1. Adjust `mouseInfluence` for better responsiveness
2. Modify `mouseForce` for appropriate interaction strength
3. Tune `returnSpeed` for smoother transitions

## Examples

See `examples/background-configurations.json` for complete configuration examples and `docs/ANIMATED_BACKGROUND_GUIDE.md` for additional examples and use cases.

## Schema Support

The configuration includes full JSON Schema support with:
- IntelliSense in VS Code
- Real-time validation
- Detailed property descriptions
- Type checking and constraints

This ensures your configuration is always valid and provides helpful suggestions while editing.
