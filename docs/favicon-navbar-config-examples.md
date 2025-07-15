/*
 * Example configuration for dynamic favicon and navbar logo
 * 
 * This file shows how to configure the new dynamic favicon and navbar features
 */

// Example 1: GitHub-based favicon and navbar
{
  "favicon": {
    "type": "github",
    "customUrl": "https://github.com/VKrishna04.png",
    "githubUsername": "VKrishna04",
    "sizes": ["16x16", "32x32", "96x96", "192x192", "512x512"],
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

// Example 2: Custom image favicon and navbar
{
  "favicon": {
    "type": "custom",
    "customUrl": "/custom-favicon.png",
    "sizes": ["16x16", "32x32", "96x96"],
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

// Example 3: Auto-match home profile settings
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

// Example 4: Text-only logo (default)
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