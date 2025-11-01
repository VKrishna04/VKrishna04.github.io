# Color System Quick Reference

## Quick Copy-Paste Examples

### Purple Theme (Default)
```json
"borderColor": "#a855f7",
"textColor": "rgb(192, 132, 252)",
"hoverBg": "#a855f7",
"hoverText": "#ffffff"
```

### Blue Theme
```json
"borderColor": "#3b82f6",
"textColor": "rgb(96, 165, 250)",
"hoverBg": "#3b82f6",
"hoverText": "#ffffff"
```

### Green Theme
```json
"borderColor": "#10b981",
"textColor": "rgb(52, 211, 153)",
"hoverBg": "#10b981",
"hoverText": "#ffffff"
```

### Red Theme
```json
"borderColor": "#ef4444",
"textColor": "rgb(248, 113, 113)",
"hoverBg": "#ef4444",
"hoverText": "#ffffff"
```

### Pink Theme
```json
"borderColor": "#ec4899",
"textColor": "rgb(244, 114, 182)",
"hoverBg": "#ec4899",
"hoverText": "#ffffff"
```

### Orange Theme
```json
"borderColor": "#f97316",
"textColor": "rgb(251, 146, 60)",
"hoverBg": "#f97316",
"hoverText": "#ffffff"
```

### Cyan Theme
```json
"borderColor": "#06b6d4",
"textColor": "rgb(34, 211, 238)",
"hoverBg": "#06b6d4",
"hoverText": "#ffffff"
```

### Gradient Examples

#### Purple-Pink Gradient
```json
"textColor": "linear-gradient(to right, #c770f0, #ec4899)",
"hoverBg": "linear-gradient(135deg, #667eea, #764ba2)"
```

#### Blue-Purple Gradient
```json
"textColor": "linear-gradient(to right, #3b82f6, #8b5cf6)",
"hoverBg": "linear-gradient(135deg, #667eea, #764ba2)"
```

#### Sunset Gradient
```json
"textColor": "linear-gradient(to right, #f97316, #ec4899)",
"hoverBg": "linear-gradient(135deg, #ff6b6b, #ee5a24)"
```

## Format Cheat Sheet

| Format      | Syntax             | Example                   |
| ----------- | ------------------ | ------------------------- |
| Hex         | `#RRGGBB`          | `#a855f7`                 |
| Hex + Alpha | `#RRGGBBAA`        | `#a855f780`               |
| RGB         | `rgb(R, G, B)`     | `rgb(168, 85, 247)`       |
| RGBA        | `rgba(R, G, B, A)` | `rgba(168, 85, 247, 0.5)` |
| HSL         | `hsl(H, S%, L%)`   | `hsl(270, 91%, 65%)`      |
| Named       | Color name         | `purple`, `blue`, `red`   |
| Tailwind    | `color-shade`      | `purple-500`              |

## Common Opacity Values

| Opacity | Description      | Hex Suffix | RGBA Value |
| ------- | ---------------- | ---------- | ---------- |
| 100%    | Fully opaque     | `FF`       | `1.0`      |
| 90%     | Very visible     | `E6`       | `0.9`      |
| 80%     | Clear            | `CC`       | `0.8`      |
| 70%     | Noticeable       | `B3`       | `0.7`      |
| 60%     | Medium           | `99`       | `0.6`      |
| 50%     | Half             | `80`       | `0.5`      |
| 40%     | Subtle           | `66`       | `0.4`      |
| 30%     | Very subtle      | `4D`       | `0.3`      |
| 20%     | Barely visible   | `33`       | `0.2`      |
| 10%     | Nearly invisible | `1A`       | `0.1`      |

## Tailwind to Hex Conversion

| Tailwind   | Hex     | RGB                |
| ---------- | ------- | ------------------ |
| purple-500 | #a855f7 | rgb(168, 85, 247)  |
| purple-400 | #c084fc | rgb(192, 132, 252) |
| purple-600 | #9333ea | rgb(147, 51, 234)  |
| blue-500   | #3b82f6 | rgb(59, 130, 246)  |
| blue-400   | #60a5fa | rgb(96, 165, 250)  |
| green-500  | #10b981 | rgb(16, 185, 129)  |
| red-500    | #ef4444 | rgb(239, 68, 68)   |
| pink-500   | #ec4899 | rgb(236, 72, 153)  |
| orange-500 | #f97316 | rgb(249, 115, 22)  |
| cyan-500   | #06b6d4 | rgb(6, 182, 212)   |

## Component Color Properties

### Home Buttons
```json
{
  "borderColor": "Color for button border",
  "textColor": "Color for button text",
  "hoverBg": "Background color on hover",
  "hoverText": "Text color on hover"
}
```

### Home Profile Image
```json
{
  "borderColor": "Color for image border",
  "shadowColor": "Color for drop shadow"
}
```

### Social Links
```json
{
  "color": "Normal state icon color",
  "hoverColor": "Hover state icon color"
}
```

## Testing Your Colors

1. **Update settings.json** with new color values
2. **Save the file** (changes reload automatically)
3. **Check browser** - colors update in real-time
4. **Test hover states** - move mouse over elements
5. **Verify contrast** - ensure text is readable

## Color Tools

- [HTML Color Codes](https://htmlcolorcodes.com/) - Color picker
- [Coolors](https://coolors.co/) - Palette generator
- [CSS Gradient](https://cssgradient.io/) - Gradient creator
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Accessibility

## Pro Tips

1. **Use RGBA for transparency** - easier than hex with alpha
2. **Test in dark mode** - ensure colors work on dark backgrounds
3. **Keep contrast high** - minimum 4.5:1 for text
4. **Use gradients sparingly** - can impact performance
5. **Stay consistent** - use same color family across site
6. **Test hover states** - ensure clear visual feedback
7. **Consider colorblind users** - don't rely on color alone

---

**Quick Start**: Copy any theme example above and paste into your `settings.json` button/link configurations!
