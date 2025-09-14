# Dynamic Favicon Manager with React Icons

This favicon system allows you to dynamically generate favicons from:
- **GitHub profile images**
- **Custom image URLs**
- **Any React Icon from react-icons.github.io**
- **Browser default favicon**

## Table of Contents
- [Dynamic Favicon Manager with React Icons](#dynamic-favicon-manager-with-react-icons)
	- [Table of Contents](#table-of-contents)
	- [🎨 **React Icons Support**](#-react-icons-support)
		- [**Icon Libraries Supported:**](#icon-libraries-supported)
	- [⚙️ **Configuration Examples**](#️-configuration-examples)
		- [**GitHub Profile Favicon**](#github-profile-favicon)
		- [**React Icon Favicon**](#react-icon-favicon)
		- [**Custom Image Favicon**](#custom-image-favicon)
		- [**Default Browser Favicon**](#default-browser-favicon)
	- [🎨 **Popular Icon Examples**](#-popular-icon-examples)
		- [**Technology Icons**](#technology-icons)
		- [**Social Media Icons**](#social-media-icons)
		- [**General Icons**](#general-icons)
	- [🔧 **How to Use**](#-how-to-use)
	- [🎨 **Color Examples**](#-color-examples)
	- [🏃‍♂️ **Dynamic Loading**](#️-dynamic-loading)
	- [🔄 **Automatic Updates**](#-automatic-updates)


## 🎨 **React Icons Support**

Visit [react-icons.github.io](https://react-icons.github.io/react-icons) to browse all available icons.

### **Icon Libraries Supported:**
- **Fa**: Font Awesome (e.g., `FaReact`, `FaGithub`, `FaHeart`)
- **Md**: Material Design (e.g., `MdHome`, `MdSettings`, `MdFavorite`)
- **Ai**: Ant Design (e.g., `AiFillStar`, `AiOutlineCode`)
- **Bi**: Bootstrap Icons (e.g., `BiCodeAlt`, `BiUser`)
- **Si**: Simple Icons (e.g., `SiJavascript`, `SiReact`, `SiPython`)
- **Hi**: Heroicons (e.g., `HiHome`, `HiUser`, `HiCog`)
- **Fi**: Feather Icons (e.g., `FiHome`, `FiUser`, `FiSettings`)
- **Bs**: Bootstrap (e.g., `BsGithub`, `BsLinkedin`)
- **Go**: GitHub Octicons (e.g., `GoGitBranch`, `GoRepo`)
- **Io**: Ionicons (e.g., `IoMdHome`, `IoIosSettings`)
- **Ti**: Tabler Icons (e.g., `TiHome`, `TiUser`)
- **Ri**: Remix Icons (e.g., `RiHomeLine`, `RiUserLine`)
- **Pi**: Phosphor Icons (e.g., `PiHouse`, `PiUser`)
- **Lu**: Lucide (e.g., `LuHome`, `LuUser`)
- **Wi**: Weather Icons (e.g., `WiDaySunny`, `WiNightClear`)
- **Vsc**: VS Code Icons (e.g., `VscHome`, `VscSettings`)
- **Tb**: Tabler Icons (e.g., `TbHome`, `TbUser`)
- **Im**: IcoMoon (e.g., `ImHome`, `ImUser`)
- **Gr**: Grommet Icons (e.g., `GrHome`, `GrUser`)
- **Di**: DevIcons (e.g., `DiReact`, `DiJavascript1`)
- **Fc**: Flat Color Icons (e.g., `FcHome`, `FcSettings`)
- **Sl**: Simple Line Icons (e.g., `SlHome`, `SlUser`)

## ⚙️ **Configuration Examples**

### **GitHub Profile Favicon**
```json
{
  "favicon": {
    "type": "github",
    "githubUsername": "VKrishna04",
    "sizes": ["16x16", "32x32", "96x96", "192x192", "512x512"],
    "appleTouchIcon": true
  }
}
```

### **React Icon Favicon**
```json
{
  "favicon": {
    "type": "icon",
    "iconName": "FaReact",
    "iconColor": "#61DAFB",
    "backgroundColor": "transparent",
    "iconSize": 32,
    "sizes": ["16x16", "32x32", "96x96"],
    "appleTouchIcon": true
  }
}
```

### **Custom Image Favicon**
```json
{
  "favicon": {
    "type": "custom",
    "customUrl": "https://example.com/favicon.png",
    "sizes": ["16x16", "32x32", "96x96"],
    "appleTouchIcon": true
  }
}
```

### **Default Browser Favicon**
```json
{
  "favicon": {
    "type": "default"
  }
}
```

## 🎨 **Popular Icon Examples**

### **Technology Icons**
- `SiReact` - React logo
- `SiJavascript` - JavaScript logo
- `SiTypescript` - TypeScript logo
- `SiNodedotjs` - Node.js logo
- `SiPython` - Python logo
- `SiGit` - Git logo
- `SiDocker` - Docker logo
- `SiKubernetes` - Kubernetes logo

### **Social Media Icons**
- `FaGithub` - GitHub
- `FaLinkedin` - LinkedIn
- `FaTwitter` - Twitter
- `FaInstagram` - Instagram
- `FaDiscord` - Discord
- `FaYoutube` - YouTube

### **General Icons**
- `FaHeart` - Heart
- `FaStar` - Star
- `FaRocket` - Rocket
- `FaCode` - Code
- `FaTerminal` - Terminal
- `FaCog` - Settings
- `MdHome` - Home
- `HiUser` - User

## 🔧 **How to Use**

1. **Visit [react-icons.github.io](https://react-icons.github.io/react-icons)**
2. **Search for your desired icon**
3. **Copy the icon name** (e.g., `FaReact`, `SiJavascript`)
4. **Update your settings.json**:

```json
{
  "favicon": {
    "type": "icon",
    "iconName": "YOUR_ICON_NAME_HERE",
    "iconColor": "#YOUR_HEX_COLOR",
    "backgroundColor": "transparent",
    "iconSize": 32
  }
}
```

## 🎨 **Color Examples**

- `#61DAFB` - React Blue
- `#F7DF1E` - JavaScript Yellow
- `#3178C6` - TypeScript Blue
- `#339933` - Node.js Green
- `#3776AB` - Python Blue
- `#F05032` - Git Orange
- `#2496ED` - Docker Blue
- `#326CE5` - Kubernetes Blue

## 🏃‍♂️ **Dynamic Loading**

The favicon manager dynamically loads only the icon library needed, ensuring optimal performance. No need to import all icons - just specify the name and it will be loaded automatically!

## 🔄 **Automatic Updates**

Favicons are automatically updated when:
- Settings change
- App reloads
- Configuration is modified

The system generates favicons in multiple sizes for optimal display across different devices and platforms.
