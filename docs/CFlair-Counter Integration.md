# CFlair-Counter Integration Guide

This portfolio is integrated with [CFlair-Counter](https://github.com/Life-Experimentalists/CFlair-Counter), a hyper-efficient serverless view counter built on Cloudflare Workers.

## Overview

CFlair-Counter provides:
- **Automatic Project Tracking**: View counts for all GitHub projects
- **Portfolio Analytics**: Track portfolio page views
- **SVG Badges**: Beautiful view count badges for projects
- **Privacy-First**: Anonymous visitor tracking
- **Ultra-Fast**: Sub-100ms response times globally
- **Free Forever**: Powered by Cloudflare's free tier

## Architecture

```
Portfolio → CFlair-Counter API → Cloudflare D1 Database
     ↓
Build Process → Project Registration
     ↓
Page Views → View Tracking
```

## Configuration

### settings.json

```json
{
  "counterAPI": {
    "enabled": true,
    "baseUrl": "https://cflaircounter.pages.dev",
    "timeout": 10000,
    "fallbackOnError": true,
    "projectMapping": {
      "autoGenerate": true,
      "customMappings": {
        "repo-name": "custom-project-name"
      }
    }
  }
}
```

### Options

- **enabled**: Enable/disable CFlair-Counter integration
- **baseUrl**: CFlair-Counter API endpoint
- **timeout**: Request timeout in milliseconds
- **fallbackOnError**: Continue even if tracking fails
- **projectMapping.autoGenerate**: Auto-map repository names to projects
- **projectMapping.customMappings**: Custom name mappings for specific repos

## Build Process

### Automatic Project Registration

During the build process, the portfolio automatically registers all GitHub projects with CFlair-Counter:

```bash
npm run build
```

This runs:
1. Pre-build validation
2. Vite build
3. Manifest generation
4. **CFlair-Counter project registration**

### Manual Registration

You can manually register projects without building:

```bash
npm run register-cflair
```

### How Registration Works

The `scripts/register-cflair-projects.js` script:

1. Fetches all repositories from GitHub API
2. Filters based on `settings.json` configuration
3. Checks if each project exists in CFlair-Counter
4. Initializes projects with zero views if they don't exist
5. Reports registration status for each project

## Runtime Integration

### View Tracking

The portfolio tracks views automatically:

**Portfolio View Tracking** (on page load):
```javascript
import { trackPortfolioView } from './utils/cflairCounter';

// Track portfolio view
trackPortfolioView();
```

**Project View Tracking** (individual projects):
```javascript
import { trackProjectView } from './utils/cflairCounter';

// Track view for a specific project
trackProjectView('project-name');
```

### Getting View Statistics

Fetch current view statistics for a project:

```javascript
import { getProjectStats } from './utils/cflairCounter';

const stats = await getProjectStats('project-name');
// Returns: { projectName, totalViews, uniqueViews, description, createdAt }
```

### Display View Counts

The `useProjectsData` hook automatically fetches view counts for all projects:

```javascript
import useProjectsData from './hooks/useProjectsData';

function ProjectList() {
  const { repos, counterLoading } = useProjectsData();

  return repos.map(repo => (
    <div key={repo.id}>
      <h3>{repo.name}</h3>
      <p>Views: {repo.counterValue || 0}</p>
    </div>
  ));
}
```

### SVG Badges

Generate badge URLs for projects:

```javascript
import { getProjectBadgeUrl } from './utils/cflairCounter';

// Basic badge
const badgeUrl = getProjectBadgeUrl('project-name');

// Custom colored badge
const customBadge = getProjectBadgeUrl('project-name', {
  color: 'green',
  label: 'views'
});

// Use in HTML/JSX
<img src={badgeUrl} alt="View Count" />
```

## API Endpoints

CFlair-Counter provides these endpoints:

### GET /api/views/{projectName}
Get current statistics for a project.

**Response:**
```json
{
  "success": true,
  "projectName": "my-project",
  "totalViews": 1337,
  "uniqueViews": 256,
  "description": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/views/{projectName}
Increment view count for a project. Creates project if it doesn't exist.

**Response:**
```json
{
  "success": true,
  "projectName": "my-project",
  "totalViews": 1338,
  "uniqueViews": 256,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET /api/views/{projectName}/badge
Generate SVG badge with view count.

**Query Parameters:**
- `color`: Badge color (blue, green, red, orange, purple, brightgreen)
- `label`: Custom label text (default: "views")

**Example:**
```
https://cflaircounter.pages.dev/api/views/my-project/badge?color=green&label=hits
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "worker": "cflaircounter-api",
  "version": "2.0.0"
}
```

## Utility Functions

The `src/utils/cflairCounter.js` module provides:

### trackProjectView(projectName, baseUrl)
Track a view for a project.

**Parameters:**
- `projectName` (string): The project name
- `baseUrl` (string, optional): Custom API endpoint

**Returns:** Promise<object|null>

### getProjectStats(projectName, baseUrl)
Get view statistics for a project.

**Parameters:**
- `projectName` (string): The project name
- `baseUrl` (string, optional): Custom API endpoint

**Returns:** Promise<object|null>

### getProjectBadgeUrl(projectName, options, baseUrl)
Generate badge URL.

**Parameters:**
- `projectName` (string): The project name
- `options` (object, optional): { color, label }
- `baseUrl` (string, optional): Custom API endpoint

**Returns:** string

### trackPortfolioView(baseUrl)
Track portfolio page view.

**Parameters:**
- `baseUrl` (string, optional): Custom API endpoint

**Returns:** Promise<object|null>

### batchTrackViews(projectNames, baseUrl, delayMs)
Track multiple projects with rate limiting.

**Parameters:**
- `projectNames` (string[]): Array of project names
- `baseUrl` (string, optional): Custom API endpoint
- `delayMs` (number, optional): Delay between requests (default: 200ms)

**Returns:** Promise<object[]>

### isCFlairCounterAvailable(baseUrl)
Check if service is available.

**Parameters:**
- `baseUrl` (string, optional): Custom API endpoint

**Returns:** Promise<boolean>

## Deployment

### GitHub Actions Integration

The `.github/workflows/deploy.yml` automatically runs project registration during deployment:

```yaml
- name: Build project
  run: npm run build
  env:
    VITE_RESUME_LINK: ${{ secrets.VITE_RESUME_LINK }}
```

The build script includes CFlair-Counter registration, so projects are automatically registered on every deployment.

### Manual Deployment

For manual deployments:

```bash
# Build and register projects
npm run build

# Or register projects separately
npm run register-cflair
```

## Troubleshooting

### CORS Errors

If you see CORS errors like:
```
Access to fetch at 'https://cflaircounter.pages.dev//projects' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

**Solution**: The old `/projects` endpoint doesn't exist. The integration now uses individual project endpoints (`/api/views/{projectName}`), which have proper CORS headers.

### Projects Not Registered

If projects don't appear in CFlair-Counter:

1. **Check build logs**: Look for registration output during `npm run build`
2. **Manual registration**: Run `npm run register-cflair`
3. **Verify settings**: Ensure `counterAPI.enabled` is `true` in `settings.json`
4. **Check filters**: Verify projects aren't in the `projects.ignore` list

### View Counts Not Showing

If view counts don't appear on the Projects page:

1. **Check console**: Look for CFlair-Counter errors
2. **Verify integration**: Ensure `counterAPI.enabled` is `true`
3. **Test API**: Visit `https://cflaircounter.pages.dev/api/views/your-project-name`
4. **Check network**: Verify requests succeed in browser DevTools

### Rate Limiting

CFlair-Counter uses Cloudflare's standard rate limits:

- **Normal usage**: No limits for typical portfolio traffic
- **Batch operations**: The build script includes 500ms delays between requests
- **High traffic**: Automatically handled by Cloudflare edge network

## Best Practices

### 1. Enable Fallback Mode
```json
{
  "counterAPI": {
    "fallbackOnError": true
  }
}
```
This ensures your portfolio works even if CFlair-Counter is temporarily unavailable.

### 2. Use Custom Mappings for Renamed Projects
```json
{
  "counterAPI": {
    "projectMapping": {
      "customMappings": {
        "old-repo-name": "new-project-name"
      }
    }
  }
}
```

### 3. Track Important Events
```javascript
// Track when users click project links
const handleProjectClick = async (projectName) => {
  await trackProjectView(projectName);
  window.open(projectUrl, '_blank');
};
```

### 4. Display Badges in README
Add badges to your GitHub project READMEs:
```markdown
![Views](https://cflaircounter.pages.dev/api/views/your-project/badge?color=blue)
```

## Privacy

CFlair-Counter is privacy-first:

- **No personal data collection**: Only anonymous visitor hashing
- **No cookies**: No tracking cookies used
- **GDPR compliant**: No PII stored
- **Optional analytics**: Unique visitor tracking can be disabled

## Performance

- **Edge network**: Deployed on Cloudflare's global network
- **Sub-100ms**: Response times under 100ms globally
- **Caching**: Intelligent caching for badge requests
- **Efficient**: Optimized D1 queries for minimal latency

## Cost

CFlair-Counter runs on Cloudflare's free tier:

- **1K views/month**: $0.00 (free)
- **100K views/month**: ~$0.50
- **1M views/month**: ~$1.30-$3.40

For a typical portfolio:
- **Expected cost**: $0.00/month (well within free tier)
- **No credit card required**: Uses Cloudflare's generous free limits

## Support

- **Documentation**: [CFlair-Counter README](https://github.com/Life-Experimentalists/CFlair-Counter)
- **Issues**: [GitHub Issues](https://github.com/Life-Experimentalists/CFlair-Counter/issues)
- **Author**: [@VKrishna04](https://github.com/VKrishna04)

## Self-Hosting

To deploy your own CFlair-Counter instance:

```bash
# Clone the repository
git clone https://github.com/Life-Experimentalists/CFlair-Counter.git
cd CFlair-Counter

# Install dependencies
npm install

# Create D1 database
npm run db:create
npm run db:init

# Deploy to Cloudflare Pages
npm run deploy
```

Then update your portfolio's `settings.json`:
```json
{
  "counterAPI": {
    "baseUrl": "https://your-cflair-instance.pages.dev"
  }
}
```

## License

CFlair-Counter is licensed under Apache 2.0 - free for personal, educational, and commercial use.

---

**Made with ❤️ by [VKrishna04](https://github.com/VKrishna04)**
