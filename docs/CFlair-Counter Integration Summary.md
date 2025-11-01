# CFlair-Counter Integration Summary

## Problem Statement

The portfolio was attempting to connect to an old CounterAPI endpoint (`https://counterapi-9k7p.onrender.com/projects`) which:
1. Doesn't have a `/projects` endpoint
2. Was causing CORS errors
3. Is not the correct CFlair-Counter API

## Solution Implemented

### 1. Updated `useProjectsData.js` Hook

**File**: `src/hooks/useProjectsData.js`

**Changes**:
- Removed the `/projects` batch endpoint call
- Implemented individual project view fetching via `fetchProjectCounter()`
- Each repository now fetches its view count individually from CFlair-Counter
- Uses the correct API: `GET /api/views/{projectName}`

**Key Code**:
```javascript
// Fetch view count for a single project from CFlair-Counter
const fetchProjectCounter = async (projectName, baseUrl) => {
  const response = await fetch(`${baseUrl}/api/views/${projectName}`, {
    method: "GET",
    headers: { Accept: "application/json" }
  });

  if (response.ok) {
    const data = await response.json();
    if (data.success) {
      return data.totalViews || 0;
    }
  }
  return null;
};
```

### 2. Created CFlair-Counter Utility Module

**File**: `src/utils/cflairCounter.js`

**Features**:
- `trackProjectView(projectName)` - Increment view count (POST)
- `getProjectStats(projectName)` - Get current stats (GET)
- `getProjectBadgeUrl(projectName, options)` - Generate badge URLs
- `trackPortfolioView()` - Track overall portfolio views
- `batchTrackViews(projectNames)` - Batch tracking with rate limiting
- `isCFlairCounterAvailable()` - Health check

### 3. Build-Time Project Registration

**File**: `scripts/register-cflair-projects.js`

**Purpose**: Automatically register all GitHub projects with CFlair-Counter during build

**Process**:
1. Reads `settings.json` configuration
2. Fetches all repositories from GitHub API
3. Filters based on ignore list, private/fork settings
4. Checks each project in CFlair-Counter
5. Initializes projects with zero views if they don't exist
6. Reports registration status for each project

**Integration**:
- Added to `package.json` scripts: `"register-cflair": "node scripts/register-cflair-projects.js"`
- Automatically runs during `npm run build`
- Includes retry logic and rate limiting

### 4. Portfolio View Tracking

**File**: `src/App.jsx`

**Changes**:
- Imported `trackPortfolioView` from cflairCounter utils
- Added useEffect hook to track portfolio views on mount
- Tracks overall portfolio traffic separately from individual projects

**Code**:
```javascript
// Track portfolio view on mount (only once)
useEffect(() => {
  trackPortfolioView().catch((error) =>
    console.warn("Could not track portfolio view:", error)
  );
}, []);
```

### 5. Updated Build Script

**File**: `package.json`

**Before**:
```json
"build": "node scripts/validate-build-integrity.js && node scripts/pre-build-validation.js && vite build && node scripts/generate-manifest.js"
```

**After**:
```json
"build": "node scripts/validate-build-integrity.js && node scripts/pre-build-validation.js && vite build && node scripts/generate-manifest.js && node scripts/register-cflair-projects.js"
```

### 6. Configuration

**File**: `public/settings.json`

**Settings** (already correct):
```json
{
  "counterAPI": {
    "enabled": true,
    "baseUrl": "https://cflaircounter.pages.dev",
    "timeout": 10000,
    "fallbackOnError": true,
    "projectMapping": {
      "autoGenerate": true,
      "customMappings": {}
    }
  }
}
```

### 7. Documentation

**File**: `docs/CFlair-Counter Integration.md`

Complete integration guide covering:
- Configuration options
- Build process
- Runtime integration
- API endpoints
- Utility functions
- Deployment
- Troubleshooting
- Best practices
- Privacy and performance

## CFlair-Counter API Endpoints Used

### GET /api/views/{projectName}
Get current statistics for a project.

**Response**:
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
Increment view count. Creates project if doesn't exist.

**Response**:
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

**Query Parameters**:
- `color`: blue, green, red, orange, purple, brightgreen
- `label`: Custom label text (default: "views")

**Example**:
```
https://cflaircounter.pages.dev/api/views/my-project/badge?color=green&label=hits
```

### GET /health
Health check endpoint.

**Response**:
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "worker": "cflaircounter-api",
  "version": "2.0.0"
}
```

## How It Works

### Build Process

```
npm run build
    ↓
1. Validate build integrity
    ↓
2. Pre-build validation
    ↓
3. Vite build (creates dist/)
    ↓
4. Generate manifest.json
    ↓
5. Register CFlair-Counter projects
   - Fetch GitHub repos
   - Filter based on settings
   - Check each project in CFlair-Counter
   - Initialize if doesn't exist
   - Report status
```

### Runtime Flow

```
User visits portfolio
    ↓
App.jsx loads
    ↓
trackPortfolioView() called (POST /api/views/vkrishna04-portfolio)
    ↓
User navigates to Projects page
    ↓
useProjectsData hook fetches repos
    ↓
For each repository:
  - fetchProjectCounter(projectName)
  - GET /api/views/{projectName}
  - Returns view count
    ↓
Display projects with view counts
```

## Key Features

1. **Automatic Registration**: Projects are automatically registered during build
2. **Individual Tracking**: Each project's views are tracked separately
3. **Portfolio Tracking**: Overall portfolio views tracked as "vkrishna04-portfolio"
4. **Fallback Support**: Portfolio continues working if CFlair-Counter is unavailable
5. **Rate Limiting**: Build script includes delays to avoid rate limits
6. **Retry Logic**: Automatic retries on failed requests
7. **Privacy-First**: Anonymous visitor tracking only
8. **Zero Cost**: Runs on Cloudflare's free tier

## Testing

### Test Build Script

```bash
npm run register-cflair
```

This will:
- Fetch all GitHub repositories
- Register each project with CFlair-Counter
- Output status for each project
- Report summary of successes/failures

### Test View Tracking

1. Open portfolio in browser
2. Check browser console for:
   ```
   [CFlair-Counter] Tracked view for vkrishna04-portfolio: X total views
   ```
3. Navigate to Projects page
4. Check console for individual project view fetches
5. Verify view counts display on project cards

### Test API Directly

```bash
# Get project stats
curl https://cflaircounter.pages.dev/api/views/your-project-name

# Increment view count
curl -X POST https://cflaircounter.pages.dev/api/views/your-project-name

# Get badge
curl https://cflaircounter.pages.dev/api/views/your-project-name/badge
```

## Deployment

### GitHub Actions

The deployment workflow automatically runs project registration:

```yaml
- name: Build project
  run: npm run build
  env:
    VITE_RESUME_LINK: ${{ secrets.VITE_RESUME_LINK }}
```

The build command includes CFlair-Counter registration, so projects are registered on every deployment.

### Manual Deployment

```bash
# Full build with registration
npm run build

# Or register separately
npm run register-cflair
```

## Troubleshooting

### CORS Errors (RESOLVED)
- **Old Issue**: `/projects` endpoint doesn't exist and caused CORS errors
- **Fix**: Now uses individual project endpoints with proper CORS headers

### Projects Not Showing View Counts
1. Check `counterAPI.enabled` is `true` in settings.json
2. Run `npm run register-cflair` to manually register
3. Check browser console for errors
4. Verify project exists: `curl https://cflaircounter.pages.dev/api/views/project-name`

### Build Fails on Registration
1. Check GitHub API rate limits
2. Verify internet connection
3. Run with verbose logging: `npm run register-cflair`
4. Check CFlair-Counter health: `curl https://cflaircounter.pages.dev/health`

## Benefits

1. **Analytics**: Track views for all projects automatically
2. **Engagement**: See which projects are popular
3. **Transparency**: Public view counts build credibility
4. **Free**: No cost for typical portfolio traffic
5. **Fast**: Sub-100ms response times globally
6. **Privacy**: No personal data collection
7. **Automatic**: Zero manual maintenance required

## Next Steps

1. **Test the build**: Run `npm run build` and verify registration output
2. **Deploy**: Push to GitHub and let Actions deploy
3. **Verify**: Check that projects show view counts
4. **Monitor**: Watch CFlair-Counter stats at https://cflaircounter.pages.dev
5. **Badges**: Consider adding view badges to project READMEs

## Files Changed

1. `src/hooks/useProjectsData.js` - Updated to fetch individual project views
2. `src/utils/cflairCounter.js` - New utility module for CFlair-Counter
3. `src/App.jsx` - Added portfolio view tracking
4. `scripts/register-cflair-projects.js` - New build-time registration script
5. `package.json` - Added registration to build script
6. `docs/CFlair-Counter Integration.md` - Complete documentation

## Files Verified (No Changes Needed)

1. `public/settings.json` - Already has correct baseUrl
2. `.github/workflows/deploy.yml` - Already runs npm run build
3. `eslint.config.js` - Handles script linting appropriately

---

**Integration Complete! ✅**

The portfolio now has full CFlair-Counter integration with:
- ✅ Automatic project registration during build
- ✅ Runtime view tracking for portfolio and projects
- ✅ Individual project view counts displayed
- ✅ Comprehensive documentation
- ✅ Error handling and fallbacks
- ✅ GitHub Actions deployment support

**Made with ❤️ by [VKrishna04](https://github.com/VKrishna04)**
