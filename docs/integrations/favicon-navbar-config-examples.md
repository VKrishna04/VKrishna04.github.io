/*
 * Example configuration for dynamic favicon and navbar logo
 *
 * This file shows how to configure the new dynamic favicon and navbar features
 */

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Quick Reference Table](#quick-reference-table)
	- [Example 1: GitHub-based favicon and navbar](#example-1-github-based-favicon-and-navbar)
	- [Example 2: Custom image favicon and navbar](#example-2-custom-image-favicon-and-navbar)
	- [Example 3: Auto-match home profile settings](#example-3-auto-match-home-profile-settings)
	- [Example 4: Text-only logo (default)](#example-4-text-only-logo-default)


## Quick Reference Table

| Key                        | Type    | Description                                |
| -------------------------- | ------- | ------------------------------------------ |
| favicon.type               | string  | 'github', 'custom', 'icon', 'default'      |
| favicon.customUrl          | string  | Custom favicon URL                         |
| favicon.githubUsername     | string  | GitHub username for profile image          |
| favicon.iconName           | string  | React Icon name from react-icons.github.io |
| favicon.iconColor          | string  | Icon color (hex)                           |
| favicon.backgroundColor    | string  | Background color or 'transparent'          |
| favicon.iconSize           | number  | Icon size in pixels                        |
| favicon.sizes              | array   | Icon sizes                                 |
| favicon.appleTouchIcon     | boolean | Generate Apple touch icon                  |
| navbar.logo.type           | string  | 'text', 'image', 'github', 'auto'          |
| navbar.logo.text           | string  | Logo text                                  |
| navbar.logo.name           | string  | Full name                                  |
| navbar.logo.showName       | boolean | Show name with logo                        |
| navbar.logo.gradient       | string  | Logo gradient                              |
| navbar.logo.customImageUrl | string  | Custom image URL                           |
| navbar.logo.githubUsername | string  | GitHub username for logo                   |
| navbar.logo.imageSize      | string  | Tailwind size classes                      |
| navbar.logo.borderRadius   | string  | Tailwind border radius                     |

All configuration is managed under the `favicon` and `navbar.logo` keys in your `settings.json` file.

### Example 1: GitHub-based favicon and navbar
{
  "favicon": {
    "type": "github",
    "customUrl": "https://github.com/VKrishna04.png",
    "githubUsername": "VKrishna04",
    "sizes": ["16x16", "32x32", "96x96", "192x192", "512x512"](),
    "appleTouchIcon": true
  },
  "navbar": {
    "logo": {
      "type": "github",
      "text": "VK",
      "name": "Krishna GSVV",
      "showName": true,
      "showNameOnMobile": false,
      "gradient": "from-purple-500 to-pink-500",
      "customImageUrl": "https://github.com/VKrishna04.png",
      "githubUsername": "VKrishna04",
      "imageSize": "w-8 h-8",
      "borderRadius": "rounded-full"
    }
  }
}

### Example 2: Custom image favicon and navbar
{
  "favicon": {
    "type": "custom",
    "customUrl": "/custom-favicon.png",
    "sizes": ["16x16", "32x32", "96x96"](),
    "appleTouchIcon": true
  },
  "navbar": {
    "logo": {
      "type": "image",
      "customImageUrl": "/custom-logo.png",
      "name": "My Website",
      "showName": true,
      "imageSize": "w-10 h-10",
      "borderRadius": "rounded-lg"
    }
  }
}

### Example 3: Auto-match home profile settings
{
  "navbar": {
    "logo": {
      "type": "auto", // This will match the home.profileImage settings
      "text": "VK", // Fallback text if image fails
      "name": "Krishna GSVV",
      "showName": true,
      "gradient": "from-blue-500 to-green-500"
    }
  }
}

### Example 4: Text-only logo (default)
{
  "navbar": {
    "logo": {
      "type": "text",
      "text": "KG",
      "name": "Krishna GSVV",
      "showName": true,
      "gradient": "from-purple-500 to-pink-500"
    }
  }
}
