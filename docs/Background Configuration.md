# Animated Background Configuration Guide

## Overview

The AnimatedBackground component provides highly customizable background effects for your portfolio's home page. All configuration is managed under the `background` key in your `settings.json` file. For full examples and advanced use cases, see [ANIMATED%20BACKGROUND%20GUIDE.md](./ANIMATED%20BACKGROUND%20GUIDE.md).

## Table of Contents
- [Animated Background Configuration Guide](#animated-background-configuration-guide)
	- [Overview](#overview)
	- [Table of Contents](#table-of-contents)
	- [Accessibility](#accessibility)
	- [Quick Start](#quick-start)
	- [Background Types](#background-types)
		- [1. Animated Network (`animated-network`)](#1-animated-network-animated-network)
		- [2. Particles Only (`particles`)](#2-particles-only-particles)
		- [3. Gradient (`gradient`)](#3-gradient-gradient)
		- [4. None (`none`)](#4-none-none)
	- [Configuration Options](#configuration-options)
		- [Core Settings](#core-settings)
		- [Particle Configuration](#particle-configuration)
			- [Density-Based Particle Count](#density-based-particle-count)
		- [Connection Configuration (Animated Network Only)](#connection-configuration-animated-network-only)
		- [Animation Settings](#animation-settings)
		- [Gradient Configuration](#gradient-configuration)
	- [Performance Optimization](#performance-optimization)
		- [For Lower-End Devices](#for-lower-end-devices)
		- [For High-End Devices](#for-high-end-devices)
	- [Color Schemes](#color-schemes)
		- [Tech/Modern Theme](#techmodern-theme)
		- [Warm/Creative Theme](#warmcreative-theme)
		- [Minimalist Theme](#minimalist-theme)
	- [Accessibility Considerations](#accessibility-considerations)
	- [Troubleshooting](#troubleshooting)
		- [Performance Issues](#performance-issues)
		- [Visual Issues](#visual-issues)
		- [Interactive Issues](#interactive-issues)
	- [Examples](#examples)
	- [Schema Support](#schema-support)


## Accessibility

- To disable animated backgrounds for accessibility, set `"type": "none", "enabled": false` in your config.
- Consider providing a UI toggle for users with motion sensitivity.

## Quick Start

The animated background is configured in the `background` section of your `settings.json` file:

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
    "count": 150,              // Base particle count for 1920x1080 screen (density reference)
    "minParticles": 30,        // Minimum particles for small screens (smartphones)
    "maxParticles": 400,       // Maximum particles for large screens (4K displays)
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

#### Density-Based Particle Count

The particle system now uses **density-based scaling** to maintain consistent visual density across different screen sizes:

- **`count`**: Base particle count for a 1920x1080 (Full HD) reference screen
- **`minParticles`**: Minimum particles for very small screens (phones in portrait mode)
- **`maxParticles`**: Maximum particles for very large screens (4K, ultrawide displays)

**How it works:**
1. Calculates screen area ratio compared to Full HD (1920x1080)
2. Applies square root scaling to maintain visual density
3. Enforces min/max bounds for performance and visual quality
4. **Dynamically adjusts on window resize** - particle count updates when window size changes significantly

**Examples:**
- **Phone (375x667)**: ~30-40 particles
- **Tablet (768x1024)**: ~80-100 particles
- **Laptop (1366x768)**: ~110-130 particles
- **Desktop (1920x1080)**: 150 particles (base)
- **4K (3840x2160)**: ~300 particles (capped by maxParticles)

**Responsive Behavior:**
- Particles are added when window expands (e.g., mobile → desktop)
- Particles are removed when window shrinks (e.g., desktop → mobile)
- Changes only occur when difference is significant (>5 particles) to avoid constant adjustments

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

See `examples/background-configurations.json` for complete configuration examples and `docs/ANIMATED%20BACKGROUND%20GUIDE.md` for additional examples and use cases.

## Schema Support

The configuration includes full JSON Schema support with:
- IntelliSense in VS Code
- Real-time validation
- Detailed property descriptions
- Type checking and constraints

This ensures your configuration is always valid and provides helpful suggestions while editing.
