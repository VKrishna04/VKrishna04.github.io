# Dynamic Projects Configuration Guide

Your portfolio now supports both **static** and **dynamic** project modes that are configurable from `settings.json`.

## 📋 Project Modes

### 1. **Static Mode** (Currently Active)
```json
{
  "projects": {
    "mode": "static",
    "staticProjects": [
      // Your project configurations
    ]
  }
}
```

### 2. **GitHub API Mode**
```json
{
  "projects": {
    "mode": "github", // or "api"
    "github": {
      "type": "org", // or "user"
      "username": "Life-Experimentalist",
      "apiUrl": "https://api.github.com/orgs/Life-Experimentalist/repos"
    }
  }
}
```

## 🎨 Static Project Configuration

Each static project in your `staticProjects` array supports these fields:

### Required Fields
```json
{
  "id": 1,
  "name": "Project Name",
  "description": "Project description...",
  "technologies": ["React", "Node.js", "MongoDB"],
  "category": "Full Stack",
  "status": "Completed" // "Completed", "In Progress", "Planned"
}
```

### Optional Fields
```json
{
  "featured": true,
  "startDate": "2023-06-01",
  "endDate": "2023-09-15", // null for ongoing projects
  "githubUrl": "https://github.com/username/repo",
  "liveUrl": "https://project-demo.com",
  "demoUrl": "https://demo.project.com",
  "documentationUrl": "https://docs.project.com",
  "imageUrl": "https://example.com/image.jpg",
  "tags": ["e-commerce", "payment", "full-stack"],
  "highlights": [
    "Feature 1 description",
    "Feature 2 description",
    "Feature 3 description"
  ],
  "stats": {
    "stars": 24,
    "forks": 8,
    "watchers": 12,
    "issues": 2
  }
}
```

## 🔧 How to Add New Projects

### For Static Mode:
1. Open `public/settings.json`
2. Find the `projects.staticProjects` array
3. Add a new project object with the required fields
4. Save the file - changes will be reflected immediately

### Example New Project:
```json
{
  "id": 7,
  "name": "AI Chatbot",
  "description": "Intelligent chatbot built with OpenAI API and React for customer support automation.",
  "technologies": ["React", "OpenAI API", "Node.js", "Express"],
  "category": "AI/ML",
  "featured": true,
  "status": "In Progress",
  "startDate": "2024-01-01",
  "endDate": null,
  "githubUrl": "https://github.com/VKrishna04/ai-chatbot",
  "liveUrl": "https://chatbot.vkrishna04.me",
  "tags": ["ai", "chatbot", "openai", "automation"],
  "highlights": [
    "OpenAI GPT integration",
    "Real-time conversations",
    "Multi-language support",
    "Admin analytics panel"
  ],
  "stats": {
    "stars": 45,
    "forks": 12,
    "watchers": 20,
    "issues": 3
  }
}
```

## 🎯 Project Categories

Recommended categories for consistent styling:
- `"Full Stack"`
- `"Frontend"`
- `"Backend"`
- `"Web App"`
- `"Mobile App"`
- `"AI/ML"`
- `"DevOps"`
- `"API"`
- `"Library"`
- `"Tool"`

## 🎨 Status Options

Available status values with color coding:
- `"Completed"` - Green badge
- `"In Progress"` - Yellow badge
- `"Planned"` - Gray badge
- `"On Hold"` - Red badge

## 📊 Technology Icons

The component automatically maps technology names to icons. Supported technologies include:

**Languages:** JavaScript, TypeScript, Python, Java, PHP, Go, Rust, Swift, Kotlin, Dart, HTML, CSS, C++, C, Ruby, Shell

**Frameworks:** React, Vue, Next.js, Node.js, Express

**Databases:** MongoDB, PostgreSQL, MySQL, Redis

**Tools:** Docker, AWS, Git, Tailwind CSS

## 🔄 Switching Between Modes

To switch from static to GitHub API mode:

1. Change `"mode": "static"` to `"mode": "github"`
2. Ensure your GitHub configuration is correct
3. The app will automatically fetch projects from GitHub API

To switch back to static mode:
1. Change `"mode": "github"` to `"mode": "static"`
2. Your static projects will be displayed

## 🎛️ Additional Configuration

### Filtering & Sorting
```json
{
  "projects": {
    "maxProjects": 15,
    "sortBy": "updated", // "updated", "created", "stars", "name"
    "sortOrder": "desc", // "desc", "asc"
    "showForks": false,
    "showPrivate": false
  }
}
```

### GitHub Ignore List
```json
{
  "projects": {
    "ignore": [
      "VKrishna04.github.io",
      ".github",
      "private-repo"
    ]
  }
}
```

## ✨ Features

Your dynamic projects page now includes:

- 🔍 **Search** - Search by name, description, category, or tags
- 🏷️ **Technology Filtering** - Filter by programming languages/technologies
- 📊 **Sorting Options** - Sort by name, date, or popularity
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Consistent Styling** - Unified design for both static and GitHub projects
- 🔗 **Multiple Links** - GitHub, live demo, documentation links
- 📈 **Project Stats** - Stars, forks, views (if available)
- 🎯 **Project Status** - Visual indicators for project status
- ✨ **Smooth Animations** - Beautiful hover effects and transitions

## 🔄 Migration from ProjectsStatic

Your existing `ProjectsStatic.jsx` file has been preserved as a backup. The new `Projects.jsx` component now handles both modes dynamically, giving you the flexibility to:

1. Use curated static projects for a professional portfolio
2. Switch to live GitHub data when you want to showcase all repositories
3. Easily add new projects through configuration without code changes

This makes your portfolio much more maintainable and allows you to update project information quickly without touching any code!
