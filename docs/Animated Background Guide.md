# Animated Background Configuration Examples

## Overview
The AnimatedBackground component supports multiple background types and extensive customization options, all configured via the `background` key in your `settings.json` file. Below are examples and a quick reference for all options.

## Table of Contents
- [Animated Background Configuration Examples](#animated-background-configuration-examples)
	- [Overview](#overview)
	- [Table of Contents](#table-of-contents)
	- [Quick Reference Table](#quick-reference-table)
	- [Accessibility](#accessibility)
	- [Background Types](#background-types)
		- [1. Animated Network (Default)](#1-animated-network-default)
		- [2. Particles Only (No Connections)](#2-particles-only-no-connections)
		- [3. Gradient Background](#3-gradient-background)
		- [4. Combined Gradient + Animated Network](#4-combined-gradient--animated-network)
		- [5. High Performance Mode (Fewer Particles)](#5-high-performance-mode-fewer-particles)
		- [6. Intense Interactive Mode](#6-intense-interactive-mode)
		- [7. No Background](#7-no-background)
	- [Configuration Options](#configuration-options)
		- [Density-Based Particle System](#density-based-particle-system)
			- [Key Properties:](#key-properties)
			- [Screen Size Examples:](#screen-size-examples)
		- [Particle Properties](#particle-properties)
		- [Connection Properties (animated-network only)](#connection-properties-animated-network-only)
		- [Animation Properties](#animation-properties)
		- [Gradient Properties](#gradient-properties)
	- [Tips for Optimization](#tips-for-optimization)
	- [Current Configuration](#current-configuration)


## Quick Reference Table

| Key       | Type    | Description                                                          |
| --------- | ------- | -------------------------------------------------------------------- |
| type      | string  | Background type: 'animated-network', 'particles', 'gradient', 'none' |
| enabled   | boolean | Enable/disable the background effect                                 |
| particles | object  | Particle system configuration                                        |
| animation | object  | Animation speed and smoothness                                       |
| gradient  | object  | Gradient Background Configuration                                    |
| ...       | ...     | See below for all sub-keys and options                               |

## Accessibility

- To disable animated backgrounds for accessibility, set `"type": "none", "enabled": false` in your config.
- Consider providing a UI toggle for users with motion sensitivity.
- The system respects density-based scaling for performance and accessibility.

## Background Types

### 1. Animated Network (Default)
```json
{
  "background": {
    "type": "animated-network",
    "enabled": true,
    "particles": {
      "count": 150,
      "minParticles": 30,
      "maxParticles": 400,
      "size": 2,
      "color": "#ef4444",
      "speed": 0.5,
      "glow": true,
      "glowSize": 8,
      "pulseIntensity": 0.3,
      "pulseSpeed": 0.002,
      "mouseInfluence": 120,
      "mouseForce": 3,
      "returnSpeed": 0.05,
      "connections": {
        "enabled": true,
        "distance": 200,
        "color": "rgba(147, 51, 234, 0.2)",
        "width": 2,
        "maxOpacity": 0.5
      }
    },
    "animation": {
      "speed": 1,
      "smoothness": 60
    },
    "gradient": {
      "enabled": false
    }
  }
}
```

### 2. Particles Only (No Connections)
```json
{
  "background": {
    "type": "particles",
    "enabled": true,
    "particles": {
      "count": 200,
      "size": 3,
      "color": "#3b82f6",
      "speed": 0.8,
      "glow": true,
      "glowSize": 12,
      "pulseIntensity": 0.5,
      "mouseInfluence": 150,
      "mouseForce": 2
    },
    "animation": {
      "speed": 1.5,
      "smoothness": 60
    }
  }
}
```

### 3. Gradient Background
```json
{
  "background": {
    "type": "gradient",
    "enabled": true,
    "gradient": {
      "enabled": true,
      "colors": [
        "rgba(15, 23, 42, 1)",
        "rgba(30, 41, 59, 0.8)",
        "rgba(51, 65, 85, 0.6)"
      ],
      "direction": "to bottom right"
    }
  }
}
```

### 4. Combined Gradient + Animated Network
```json
{
  "background": {
    "type": "animated-network",
    "enabled": true,
    "particles": {
      "count": 100,
      "size": 1.5,
      "color": "#ffffff",
      "speed": 0.3,
      "glow": false,
      "connections": {
        "enabled": true,
        "distance": 150,
        "color": "rgba(255, 255, 255, 0.1)",
        "width": 1,
        "maxOpacity": 0.3
      }
    },
    "gradient": {
      "enabled": true,
      "colors": [
        "rgba(139, 69, 19, 0.9)",
        "rgba(101, 67, 33, 0.7)",
        "rgba(62, 39, 35, 0.5)"
      ],
      "direction": "to bottom right"
    }
  }
}
```

### 5. High Performance Mode (Fewer Particles)
```json
{
  "background": {
    "type": "animated-network",
    "enabled": true,
    "particles": {
      "count": 50,
      "size": 2.5,
      "color": "#10b981",
      "speed": 0.4,
      "glow": true,
      "connections": {
        "enabled": true,
        "distance": 180,
        "color": "rgba(16, 185, 129, 0.15)"
      }
    },
    "animation": {
      "smoothness": 30
    }
  }
}
```

### 6. Intense Interactive Mode
```json
{
  "background": {
    "type": "animated-network",
    "enabled": true,
    "particles": {
      "count": 300,
      "size": 1.5,
      "color": "#f59e0b",
      "speed": 1.2,
      "mouseInfluence": 200,
      "mouseForce": 5,
      "returnSpeed": 0.02,
      "pulseIntensity": 0.6,
      "pulseSpeed": 0.005,
      "connections": {
        "enabled": true,
        "distance": 120,
        "color": "rgba(245, 158, 11, 0.3)",
        "width": 1.5,
        "maxOpacity": 0.7
      }
    },
    "animation": {
      "speed": 1.5,
      "smoothness": 120
    }
  }
}
```

### 7. No Background
```json
{
  "background": {
    "type": "none",
    "enabled": false
  }
}
```

## Configuration Options

### Density-Based Particle System

The animated background now uses an intelligent **density-based particle system** that automatically adjusts the number of particles based on screen size:

The animated background uses a **density-based particle system** that automatically adjusts the number of particles based on screen size. All configuration is managed under the `background` key in your `settings.json` file.

#### Key Properties:
| Property     | Type   | Description                                                  |
| ------------ | ------ | ------------------------------------------------------------ |
| count        | number | Base particle count for 1920x1080 screen (density reference) |
| minParticles | number | Minimum particles for small screens (default: 30)            |
| maxParticles | number | Maximum particles for large screens (default: 400)           |

#### Screen Size Examples:
- **Mobile Portrait (375x667)**: ~35 particles
- **Mobile Landscape (667x375)**: ~30 particles
- **Tablet (768x1024)**: ~90 particles
- **Laptop (1366x768)**: ~115 particles
- **Desktop (1920x1080)**: 150 particles (base)
- **4K Display (3840x2160)**: 300 particles (capped)
- **Ultrawide (3440x1440)**: ~280 particles

### Particle Properties
- `count`: Number of particles (10-500)
- `size`: Base particle size in pixels (0.5-10)
- `color`: Particle color (hex, rgb, rgba, or CSS color name)
- `speed`: Movement speed (0.1-5)
- `glow`: Enable/disable glow effect (boolean)
- `glowSize`: Size of glow effect (0-50)
- `pulseIntensity`: Opacity pulsing intensity (0-1)
- `pulseSpeed`: Speed of pulsing animation (0.001-0.01)
- `mouseInfluence`: Mouse interaction distance in pixels (0-300)
- `mouseForce`: Strength of mouse repulsion (0-10)
- `returnSpeed`: Speed of return to normal movement (0.01-1)

### Connection Properties (animated-network only)
- `enabled`: Enable/disable connections between particles
- `distance`: Maximum connection distance (50-400)
- `color`: Connection line color
- `width`: Line width in pixels (0.1-10)
- `maxOpacity`: Maximum line opacity (0-1)

### Animation Properties
- `speed`: Overall animation speed multiplier (0.1-5)
- `smoothness`: Target FPS (15-120, higher = smoother but more CPU intensive)

### Gradient Properties
- `enabled`: Enable gradient background
- `colors`: Array of 2-5 gradient colors
- `direction`: Gradient direction (8 options from "to bottom" to "to top left")

## Tips for Optimization

1. **Performance**: Lower `count`, `smoothness`, and disable `glow` for better performance
2. **Visual Appeal**: Use complementary colors for particles and connections
3. **Interactivity**: Adjust `mouseInfluence` and `mouseForce` for desired responsiveness
4. **Mobile**: Consider reducing particle count and effects for mobile devices
5. **Accessibility**: Provide option to disable animations for users with motion sensitivity

## Current Configuration
The current configuration in settings.json uses the animated-network type with red particles and purple connections, providing a modern and engaging background effect.
