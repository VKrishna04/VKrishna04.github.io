# Quick Migration Guide: Adding New Components

**For Developers Adding New Components or Modifying Existing Ones**

---

## 🚀 Using the Unified Icon System

### ❌ DON'T DO THIS (Old Way):
```jsx
import { FaReact } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { HiArrowUp } from "@heroicons/react/24/outline";

function MyComponent() {
  return (
    <div>
      <FaReact className="w-8 h-8 text-blue-400" />
      <SiTypescript className="w-8 h-8 text-blue-500" />
      <HiArrowUp className="w-5 h-5" />
    </div>
  );
}
```

### ✅ DO THIS (New Way):
```jsx
import { UnifiedIcon } from "../utils/unifiedIconSystem";

function MyComponent() {
  return (
    <div>
      <UnifiedIcon
        iconName="FaReact"
        className="w-8 h-8 text-blue-400"
        fallbackIcon="FaCode"
      />
      <UnifiedIcon
        iconName="SiTypescript"
        className="w-8 h-8 text-blue-500"
        fallbackIcon="FaCode"
      />
      <UnifiedIcon
        iconName="HiArrowUp"
        className="w-5 h-5"
        fallbackIcon="FaArrowUp"
      />
    </div>
  );
}
```

---

## 🎨 Using the Modular Color System

### ❌ DON'T DO THIS (Old Way):
```jsx
function MyComponent({ settings }) {
  return (
    <div className="border-4 border-purple-500/30 shadow-2xl shadow-purple-500/20">
      <button className="bg-purple-600 hover:bg-purple-700">
        Click Me
      </button>
    </div>
  );
}
```

### ✅ DO THIS (New Way):
```jsx
import { parseColor } from "../utils/themeUtils";

function MyComponent({ settings }) {
  return (
    <div
      className="border-4 shadow-2xl"
      style={{
        borderColor: parseColor(settings.myComponent?.borderColor || "#a855f7"),
        boxShadow: `0 25px 50px -12px ${parseColor(settings.myComponent?.shadowColor || "rgba(168, 85, 247, 0.2)")}`
      }}
    >
      <button
        className="px-4 py-2 rounded"
        style={{
          backgroundColor: parseColor(settings.myComponent?.buttonBg || "#9333ea"),
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = parseColor(settings.myComponent?.buttonHoverBg || "#7e22ce");
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = parseColor(settings.myComponent?.buttonBg || "#9333ea");
        }}
      >
        Click Me
      </button>
    </div>
  );
}
```

### Or Use Helper Functions:
```jsx
import { getButtonStyles } from "../utils/themeUtils";

function MyComponent({ settings }) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonConfig = {
    bg: settings.myComponent?.buttonBg || "#9333ea",
    hoverBg: settings.myComponent?.buttonHoverBg || "#7e22ce",
    text: settings.myComponent?.buttonText || "#ffffff"
  };

  return (
    <button
      style={getButtonStyles(buttonConfig, isHovered)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Click Me
    </button>
  );
}
```

---

## 📝 Configuration in `settings.json`

### Icon Configuration
```json
{
  "myComponent": {
    "icon": "FaReact",
    "secondaryIcon": "SiTypescript",
    "items": [
      { "name": "Item 1", "icon": "FaCheck" },
      { "name": "Item 2", "icon": "FaTimes" }
    ]
  }
}
```

### Color Configuration
```json
{
  "myComponent": {
    "borderColor": "rgba(168, 85, 247, 0.3)",
    "shadowColor": "rgba(168, 85, 247, 0.2)",
    "buttonBg": "#9333ea",
    "buttonHoverBg": "#7e22ce",
    "buttonText": "#ffffff",
    "gradient": "linear-gradient(to right, #a855f7, #ec4899)"
  }
}
```

**All Supported Color Formats:**
- Hex: `"#a855f7"`, `"#a855f799"` (with alpha)
- RGB: `"rgb(168, 85, 247)"`, `"rgba(168, 85, 247, 0.3)"`
- HSL: `"hsl(270, 90%, 65%)"`, `"hsla(270, 90%, 65%, 0.3)"`
- Named: `"purple"`, `"red"`, `"blue"`
- Tailwind: `"purple-500"`, `"blue-400"` (auto-converted)
- CSS Variables: `"var(--primary-color)"`
- Gradients: `"linear-gradient(to right, #a855f7, #ec4899)"`

---

## 🔍 Icon Name Conventions

### Finding Icon Names

1. **Font Awesome:** `Fa` prefix + PascalCase
   - `FaReact`, `FaPython`, `FaDocker`, `FaGithub`

2. **Simple Icons:** `Si` prefix + PascalCase
   - `SiJavascript`, `SiTypescript`, `SiTailwindcss`

3. **Heroicons:** `Hi` prefix + PascalCase
   - `HiArrowUp`, `HiBars3`, `HiXMark`, `HiUser`

4. **Material Design:** `Md` prefix + PascalCase
   - `MdHome`, `MdSettings`, `MdMenu`, `MdClose`

5. **Bootstrap Icons:** `Bs` prefix + PascalCase
   - `BsCheck`, `BsX`, `BsGear`, `BsHouse`

**Full List:** Check `src/utils/unifiedIconSystem.js` for all 40+ supported libraries.

---

## ⚡ Performance Best Practices

### 1. Preload Icons (For Heavy Components)
```jsx
import { getUnifiedIcon } from "../utils/unifiedIconSystem";

useEffect(() => {
  const preloadIcons = async () => {
    const iconNames = ["FaReact", "SiTypescript", "HiArrowUp"];
    await Promise.all(
      iconNames.map(name => getUnifiedIcon(name))
    );
  };
  preloadIcons();
}, []);
```

### 2. Use Fallback Icons
Always provide a fallback icon to prevent broken UI:
```jsx
<UnifiedIcon
  iconName="SomeUnknownIcon"
  fallbackIcon="FaCode"  // Will show FaCode if SomeUnknownIcon fails
/>
```

### 3. Avoid Inline Styles in Loops
Extract styles to a variable:
```jsx
// ❌ Bad (creates new object each render)
{items.map(item => (
  <div style={{ color: parseColor(item.color) }}>
    {item.name}
  </div>
))}

// ✅ Good (reuses style object)
{items.map(item => {
  const itemStyle = { color: parseColor(item.color) };
  return <div style={itemStyle}>{item.name}</div>;
})}
```

---

## 🐛 Common Mistakes to Avoid

### Mistake 1: Hardcoding Icon Imports
```jsx
// ❌ DON'T
import { FaReact } from "react-icons/fa";
<FaReact />

// ✅ DO
import { UnifiedIcon } from "../utils/unifiedIconSystem";
<UnifiedIcon iconName="FaReact" />
```

### Mistake 2: Using Tailwind Classes for Dynamic Colors
```jsx
// ❌ DON'T (Tailwind JIT won't compile dynamic classes)
<div className={`border-${color}-500`}>

// ✅ DO
<div style={{ borderColor: parseColor(color) }}>
```

### Mistake 3: Forgetting Fallback Icons
```jsx
// ❌ DON'T
<UnifiedIcon iconName={userProvidedIcon} />

// ✅ DO
<UnifiedIcon iconName={userProvidedIcon} fallbackIcon="FaCode" />
```

### Mistake 4: Not Handling Async Icon Loading
```jsx
// ❌ DON'T (getUnifiedIcon returns a Promise)
const IconComponent = getUnifiedIcon("FaReact");
<IconComponent />

// ✅ DO (Use UnifiedIcon component)
<UnifiedIcon iconName="FaReact" />
```

---

## 📚 Quick Reference Links

- **Unified Icon System Guide:** `docs/Unified Icon System Guide.md`
- **Color System Guide:** `docs/Color System Guide.md`
- **Settings Schema:** `public/settings.schema.json` (IntelliSense support)
- **Implementation Summary:** `docs/Recursive Implementation Summary.md`

---

## 🎯 Component Checklist

When creating/updating a component:

- [ ] Import `UnifiedIcon` instead of direct icon imports
- [ ] Import `parseColor` or helper functions for colors
- [ ] Use inline styles for dynamic colors (not Tailwind classes)
- [ ] Provide fallback icons
- [ ] Add configuration section to `settings.json`
- [ ] Update `settings.schema.json` if needed
- [ ] Test with different color formats
- [ ] Test icon loading

---

## 💡 Example: Complete Component Migration

### Before:
```jsx
import { FaReact, FaPython } from "react-icons/fa";

function SkillCard({ skill }) {
  return (
    <div className="p-4 border-2 border-purple-500/30 bg-gray-800/50">
      {skill.name === "React" ? (
        <FaReact className="w-8 h-8 text-blue-400" />
      ) : (
        <FaPython className="w-8 h-8 text-green-400" />
      )}
      <h3 className="text-purple-400">{skill.name}</h3>
    </div>
  );
}
```

### After:
```jsx
import { UnifiedIcon } from "../utils/unifiedIconSystem";
import { parseColor } from "../utils/themeUtils";

function SkillCard({ skill, settings }) {
  const cardStyle = {
    borderColor: parseColor(settings.skillCard?.borderColor || "rgba(168, 85, 247, 0.3)"),
    backgroundColor: parseColor(settings.skillCard?.bgColor || "rgba(31, 41, 55, 0.5)")
  };

  const titleStyle = {
    color: parseColor(settings.skillCard?.titleColor || "#c084fc")
  };

  return (
    <div className="p-4 border-2" style={cardStyle}>
      <UnifiedIcon
        iconName={skill.icon}
        className={`w-8 h-8 ${skill.iconColor || 'text-blue-400'}`}
        fallbackIcon="FaCode"
      />
      <h3 style={titleStyle}>{skill.name}</h3>
    </div>
  );
}
```

### Configuration:
```json
{
  "skillCard": {
    "borderColor": "rgba(168, 85, 247, 0.3)",
    "bgColor": "rgba(31, 41, 55, 0.5)",
    "titleColor": "#c084fc"
  },
  "skills": [
    { "name": "React", "icon": "FaReact", "iconColor": "text-blue-400" },
    { "name": "Python", "icon": "FaPython", "iconColor": "text-green-400" }
  ]
}
```

---

**Last Updated:** January 2025
**Maintained by:** Krishna GSVV
**Questions?** Check `docs/` folder for detailed guides.
