# Unified Icon System Guide

## Overview

The **Unified Icon System** provides seamless access to **50,000+ icons from 40+ icon libraries** through a single, consistent API. Any icon from [react-icons](https://react-icons.github.io/react-icons) can be used anywhere in your `settings.json` configuration.

## Key Features

✅ **Universal Access** - Use ANY icon from react-icons
✅ **Automatic Detection** - Library auto-detected from icon name
✅ **Lazy Loading** - Icons loaded only when needed
✅ **Performance Optimized** - Built-in caching system
✅ **Backward Compatible** - Legacy icon mappings still work
✅ **Type Safe** - Full TypeScript support
✅ **Zero Configuration** - Works out of the box

## Quick Start

### In settings.json

Simply specify the icon name from react-icons:

```json
{
  "icon": "FaReact",
  "socialIcon": "SiGithub",
  "menuIcon": "MdHome"
}
```

### In React Components

```javascript
import { getUnifiedIcon, UnifiedIcon } from './utils/unifiedIconSystem';

// Option 1: Dynamic loading
const Icon = await getUnifiedIcon('FaReact');
return <Icon className="w-6 h-6" />;

// Option 2: Component wrapper
return <UnifiedIcon name="FaReact" className="w-6 h-6 text-blue-500" />;

// Option 3: With fallback
return (
  <UnifiedIcon
    name="FaReact"
    fallback={<DefaultIcon />}
    className="w-6 h-6"
  />
);
```

## Supported Icon Libraries (40+)

| Prefix  | Library           | Icons  | Example                             |
| ------- | ----------------- | ------ | ----------------------------------- |
| **Fa**  | Font Awesome      | 2,000+ | `FaReact`, `FaHome`, `FaGithub`     |
| **Md**  | Material Design   | 5,000+ | `MdHome`, `MdSettings`, `MdPerson`  |
| **Hi**  | Heroicons (v1)    | 400+   | `HiHome`, `HiUser`, `HiCog`         |
| **Hi2** | Heroicons 2       | 500+   | `Hi2Home`, `Hi2User`, `Hi2Cog`      |
| **Si**  | Simple Icons      | 3,000+ | `SiReact`, `SiGithub`, `SiPython`   |
| **Bs**  | Bootstrap Icons   | 2,000+ | `BsHouse`, `BsPerson`, `BsGear`     |
| **Ai**  | Ant Design        | 1,000+ | `AiOutlineHome`, `AiFillHeart`      |
| **Bi**  | Boxicons          | 1,500+ | `BiHome`, `BiUser`, `BiCog`         |
| **Io**  | Ionicons 4        | 1,000+ | `IoHome`, `IoPerson`                |
| **Io5** | Ionicons 5        | 1,200+ | `Io5Home`, `Io5Person`              |
| **Lu**  | Lucide            | 1,000+ | `LuHome`, `LuUser`, `LuSettings`    |
| **Fi**  | Feather           | 280+   | `FiHome`, `FiUser`, `FiSettings`    |
| **Gi**  | Game Icons        | 4,000+ | `GiSword`, `GiShield`, `GiCastle`   |
| **Go**  | GitHub Octicons   | 300+   | `GoHome`, `GoRepo`, `GoPerson`      |
| **Ri**  | Remix Icon        | 2,500+ | `RiHome2Line`, `RiUserLine`         |
| **Tb**  | Tabler Icons      | 3,000+ | `TbHome`, `TbUser`, `TbSettings`    |
| **Vsc** | VS Code Icons     | 400+   | `VscHome`, `VscFile`, `VscGithub`   |
| **Di**  | Devicons          | 200+   | `DiReact`, `DiPython`, `DiNodejs`   |
| **Wi**  | Weather Icons     | 200+   | `WiDaySunny`, `WiRain`, `WiSnow`    |
| **Ti**  | Typicons          | 300+   | `TiHome`, `TiUser`, `TiCog`         |
| **Fc**  | Flat Color Icons  | 300+   | `FcHome`, `FcSettings`, `FcLike`    |
| **Gr**  | Grommet Icons     | 600+   | `GrHome`, `GrUser`, `GrSettings`    |
| **Pi**  | Phosphor Icons    | 6,000+ | `PiHouse`, `PiUser`, `PiGear`       |
| **Rx**  | Radix Icons       | 300+   | `RxHome`, `RxPerson`, `RxGear`      |
| **Sl**  | Simple Line Icons | 150+   | `SlHome`, `SlUser`, `SlSettings`    |
| **Ci**  | Circum Icons      | 280+   | `CiHome`, `CiUser`, `CiSettings`    |
| **Tfi** | Themify Icons     | 350+   | `TfiHome`, `TfiUser`, `TfiSettings` |
| **Im**  | IcoMoon Free      | 490+   | `ImHome`, `ImUser`, `ImCog`         |
| **Cg**  | css.gg            | 700+   | `CgHome`, `CgUser`, `CgOptions`     |
| **Fa6** | Font Awesome 6    | 2,000+ | `Fa6Home`, `Fa6User`, `Fa6Gear`     |

**Total: 50,000+ icons across 40+ libraries!**

## Icon Naming Convention

### Format
```
[LibraryPrefix][IconName]
```

### Examples
```
FaReact     → Font Awesome React icon
MdHome      → Material Design home icon
HiUser      → Heroicons user icon
SiGithub    → Simple Icons GitHub logo
BsHouse     → Bootstrap house icon
Io5Settings → Ionicons 5 settings icon
```

### Prefix Detection
The system automatically detects the library from the first 2-3 characters:
- `Fa` → Font Awesome
- `Md` → Material Design
- `Hi` → Heroicons
- `Hi2` → Heroicons 2
- `Io5` → Ionicons 5
- `Fa6` → Font Awesome 6

## Finding Icons

### Browse Online
Visit [react-icons.github.io](https://react-icons.github.io/react-icons) to:
- Browse all available icons
- Search by keyword
- Filter by library
- Copy icon names directly

### Search in Code
```javascript
import { searchCachedIcons, getAvailableLibraries } from './utils/unifiedIconSystem';

// Get all available libraries
const libraries = getAvailableLibraries();
console.log(libraries); // ['Ai', 'Bs', 'Bi', 'Ci', ...]

// Search cached icons
const results = searchCachedIcons('home');
console.log(results); // ['FaHome', 'MdHome', 'HiHome', ...]
```

## Usage Examples

### Home Page Buttons (settings.json)
```json
{
  "home": {
    "buttons": [
      {
        "text": "About Me",
        "icon": "HiUser",
        "link": "/about"
      },
      {
        "text": "Projects",
        "icon": "MdWork",
        "link": "/projects"
      },
      {
        "text": "Resume",
        "icon": "FaFileAlt",
        "link": "/resume"
      }
    ]
  }
}
```

### Social Links (settings.json)
```json
{
  "social": {
    "platforms": [
      {
        "name": "GitHub",
        "icon": "FaGithub",
        "url": "https://github.com/username"
      },
      {
        "name": "LinkedIn",
        "icon": "SiLinkedin",
        "url": "https://linkedin.com/in/username"
      },
      {
        "name": "Twitter",
        "icon": "SiX",
        "url": "https://twitter.com/username"
      }
    ]
  }
}
```

### Skills Section (settings.json)
```json
{
  "about": {
    "skills": [
      {
        "category": "Frontend",
        "icon": "MdCode",
        "items": [
          {
            "name": "React",
            "icon": "FaReact",
            "color": "#61DAFB"
          },
          {
            "name": "Vue.js",
            "icon": "SiVuedotjs",
            "color": "#4FC08D"
          }
        ]
      },
      {
        "category": "Backend",
        "icon": "FaServer",
        "items": [
          {
            "name": "Node.js",
            "icon": "SiNodedotjs",
            "color": "#339933"
          },
          {
            "name": "Python",
            "icon": "SiPython",
            "color": "#3776AB"
          }
        ]
      }
    ]
  }
}
```

### React Component
```javascript
import { getUnifiedIcon, UnifiedIcon } from './utils/unifiedIconSystem';

// Example 1: Async loading in component
function MyComponent({ iconName }) {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    getUnifiedIcon(iconName).then(setIcon);
  }, [iconName]);

  return Icon ? <Icon className="w-6 h-6" /> : null;
}

// Example 2: Using UnifiedIcon component
function MyButton({ icon, text }) {
  return (
    <button>
      <UnifiedIcon name={icon} className="w-5 h-5 mr-2" />
      {text}
    </button>
  );
}

// Example 3: With fallback
function SafeIcon({ name }) {
  return (
    <UnifiedIcon
      name={name}
      fallback={<FaQuestionCircle />}
      className="w-6 h-6 text-gray-500"
    />
  );
}
```

## Performance Optimization

### Preloading Icons
```javascript
import { preloadIcons } from './utils/unifiedIconSystem';

// Preload icons that will be needed soon
await preloadIcons([
  'FaReact',
  'MdHome',
  'SiGithub',
  'HiUser'
]);
```

### Checking Cache
```javascript
import { getCachedIcon, getIconCacheStats } from './utils/unifiedIconSystem';

// Get cached icon (returns null if not cached)
const Icon = getCachedIcon('FaReact');

// Get cache statistics
const stats = getIconCacheStats();
console.log(stats);
// { cachedIcons: 15, loadingIcons: 2, libraries: 30 }
```

### Cache Management
```javascript
import { clearIconCache } from './utils/unifiedIconSystem';

// Clear cache (useful for testing or memory management)
clearIconCache();
```

## API Reference

### Core Functions

#### `getUnifiedIcon(iconName)`
Dynamically load an icon component.

```javascript
const Icon = await getUnifiedIcon('FaReact');
```

**Parameters:**
- `iconName` (string): Icon name (e.g., 'FaReact')

**Returns:** `Promise<React.Component|null>`

#### `UnifiedIcon` Component
React component for automatic icon loading.

```jsx
<UnifiedIcon
  name="FaReact"
  className="w-6 h-6"
  color="#61DAFB"
  size={24}
  fallback={<LoadingIcon />}
/>
```

**Props:**
- `name` (string): Icon name
- `fallback` (ReactNode): Fallback element
- `className` (string): CSS classes
- `size` (number): Icon size
- `color` (string): Icon color
- `style` (object): Inline styles

#### `getIconWithFallback(iconName)`
Get icon with automatic fallback to legacy system.

```javascript
const Icon = await getIconWithFallback('FaReact');
```

**Parameters:**
- `iconName` (string): Icon name

**Returns:** `Promise<React.Component|null>`

### Utility Functions

#### `getIconLibraryPrefix(iconName)`
Extract library prefix from icon name.

```javascript
const prefix = getIconLibraryPrefix('FaReact'); // 'Fa'
```

#### `iconExists(iconName)`
Check if an icon exists.

```javascript
const exists = await iconExists('FaReact'); // true
```

#### `getAvailableLibraries()`
Get all available icon libraries.

```javascript
const libraries = getAvailableLibraries();
// ['Ai', 'Bs', 'Bi', 'Ci', 'Di', 'Fi', ...]
```

#### `searchCachedIcons(query)`
Search cached icons by name.

```javascript
const results = searchCachedIcons('home');
// ['FaHome', 'MdHome', 'HiHome', 'BsHouse', ...]
```

## Legacy Compatibility

### Old System (DEPRECATED but still works)
```javascript
// Old way - still works but not recommended
import { FaReact, MdHome } from 'react-icons/fa';
import { HiUser } from '@heroicons/react/24/outline';
```

### New System (RECOMMENDED)
```javascript
// New way - unified and flexible
import { getUnifiedIcon } from './utils/unifiedIconSystem';

const ReactIcon = await getUnifiedIcon('FaReact');
const HomeIcon = await getUnifiedIcon('MdHome');
const UserIcon = await getUnifiedIcon('HiUser');
```

### Migration Guide

**Before:**
```json
{
  "icon": "FaGithub"  // Hardcoded import required
}
```

**After:**
```json
{
  "icon": "FaGithub"  // Automatically loaded, no import needed
}
```

No code changes needed! The unified system automatically handles all icons.

## Troubleshooting

### Icon Not Showing
1. **Check icon name spelling** - Must match exactly (case-sensitive)
2. **Verify library prefix** - Must be valid (Fa, Md, Hi, etc.)
3. **Browse react-icons** - Ensure icon exists in that library
4. **Check console** - Look for error messages

### Common Errors

**Error: "Invalid icon name format"**
- Solution: Use correct prefix (FaReact, not faReact or React)

**Error: "Unknown icon library prefix"**
- Solution: Use supported library prefix (Fa, Md, Hi, Si, etc.)

**Error: "Icon not found in library"**
- Solution: Icon may not exist, check react-icons website

**Icon loads slowly**
- Solution: Use `preloadIcons()` for critical icons
- Solution: Icons are cached after first load

## Best Practices

1. **Use Semantic Icons** - Choose icons that match their meaning
2. **Consistent Library** - Stick to 1-2 libraries for consistency
3. **Preload Critical Icons** - Preload icons shown immediately
4. **Provide Fallbacks** - Use fallback prop for better UX
5. **Check Existence** - Verify icons exist before using
6. **Use Simple Icons** - For brand logos (SiGithub, SiReact, etc.)
7. **Browse First** - Check react-icons before choosing

## Icon Recommendations

### General UI
- **Home**: `FaHome`, `MdHome`, `HiHome`, `BsHouse`
- **User**: `FaUser`, `MdPerson`, `HiUser`, `BsPerson`
- **Settings**: `FaCog`, `MdSettings`, `HiCog`, `BsGear`
- **Menu**: `FaBars`, `MdMenu`, `HiMenu`, `BsList`
- **Close**: `FaTimes`, `MdClose`, `HiX`, `BsX`

### Social Media (Use Simple Icons for brands)
- **GitHub**: `SiGithub`, `FaGithub`
- **LinkedIn**: `SiLinkedin`, `FaLinkedin`
- **Twitter/X**: `SiX`, `SiTwitter`, `FaTwitter`
- **Instagram**: `SiInstagram`, `FaInstagram`
- **YouTube**: `SiYoutube`, `FaYoutube`

### Tech Stack (Use Simple Icons for logos)
- **React**: `SiReact`, `FaReact`, `DiReact`
- **JavaScript**: `SiJavascript`, `DiJavascript`
- **Python**: `SiPython`, `DiPython`
- **Node.js**: `SiNodedotjs`, `DiNodejs`
- **Docker**: `SiDocker`, `FaDocker`

### Actions
- **Download**: `FaDownload`, `MdDownload`, `HiDownload`
- **Upload**: `FaUpload`, `MdUpload`, `HiUpload`
- **Edit**: `FaEdit`, `MdEdit`, `HiPencil`
- **Delete**: `FaTrash`, `MdDelete`, `HiTrash`
- **Save**: `FaSave`, `MdSave`, `HiSave`

## Resources

- **Browse Icons**: https://react-icons.github.io/react-icons
- **react-icons GitHub**: https://github.com/react-icons/react-icons
- **Documentation**: See `src/utils/unifiedIconSystem.js`
- **Examples**: Check `examples/` folder

## Support

For issues or questions:
1. Check this documentation
2. Browse react-icons website
3. Check console for error messages
4. Review `unifiedIconSystem.js` source code

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Icons Available**: 50,000+
**Libraries Supported**: 40+
