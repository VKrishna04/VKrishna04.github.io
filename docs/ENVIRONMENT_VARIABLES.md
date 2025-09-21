# Environment Variables Guide

This project supports environment variables for customizing behavior during build and deployment. This guide covers all supported variables and platform-specific configuration.

## Overview

The project uses Vite's environment variable system, which requires the `VITE_` prefix for client-side variables. Environment variables take priority over configuration files.

## Supported Variables

### VITE_RESUME_LINK

Controls the resume download/view link on the Resume page.

**Usage:**
- External links (Google Drive, OneDrive, etc.)
- Local files (relative to public directory)
- CDN links

**Examples:**
```bash
# External Google Drive link
VITE_RESUME_LINK="https://drive.google.com/file/d/YOUR_FILE_ID/view"

# OneDrive share link
VITE_RESUME_LINK="https://1drv.ms/b/YOUR_SHARE_ID"

# Local file in public directory
VITE_RESUME_LINK="/resume.pdf"

# CDN hosted file
VITE_RESUME_LINK="https://cdn.example.com/files/resume.pdf"
```

**Priority System:**
1. Environment variable (VITE_RESUME_LINK) - Highest priority
2. settings.json configuration - Fallback
3. Default local file (/resume.pdf) - Last resort

## Platform Configuration

### GitHub Actions

Create or update `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build
      env:
        VITE_RESUME_LINK: ${{ secrets.VITE_RESUME_LINK }}

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

**Setting GitHub Secrets:**
1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `VITE_RESUME_LINK`
4. Value: Your resume URL (e.g., `https://drive.google.com/file/d/YOUR_ID/view`)

### Cloudflare Pages

**Method 1: Environment Variables in Dashboard**
1. Go to Cloudflare Dashboard → Pages
2. Select your project
3. Go to Settings → Environment variables
4. Add variable:
   - Name: `VITE_RESUME_LINK`
   - Value: Your resume URL
   - Environment: Production (and Preview if needed)

**Method 2: Build Configuration**
In your build settings:
```bash
# Build command
npm run build

# Build output directory
dist

# Environment variables (set in dashboard)
VITE_RESUME_LINK=https://drive.google.com/file/d/YOUR_FILE_ID/view
```

### Cloudflare Workers (if using Wrangler)

Update your `wrangler.toml`:

```toml
[env.production.vars]
VITE_RESUME_LINK = "https://drive.google.com/file/d/YOUR_FILE_ID/view"

[env.preview.vars]
VITE_RESUME_LINK = "https://drive.google.com/file/d/YOUR_FILE_ID/view"
```

### Local Development

Create `.env` file in project root:

```bash
# .env (for local development only)
VITE_RESUME_LINK="https://drive.google.com/file/d/YOUR_FILE_ID/view"
```

**Important:** Never commit `.env` files to version control. They're already in `.gitignore`.

## Security Considerations

1. **URL Validation:** The application validates URLs to prevent XSS attacks
2. **No Sensitive Data:** Only use public resume links in environment variables
3. **HTTPS Only:** External links should use HTTPS for security
4. **Access Control:** Ensure resume links are publicly accessible

## Validation and Testing

**Check if environment variable is loaded:**
1. Open browser dev tools
2. Go to Console tab
3. Look for: `"Using environment resume URL: [your-url]"`

**Test the button:**
1. Click the resume button
2. Verify it opens your specified URL
3. Check that external links open in new tabs

## Troubleshooting

### Environment Variable Not Working

1. **Check the prefix:** Must be `VITE_RESUME_LINK` (not `RESUME_LINK`)
2. **Rebuild the project:** Changes require a rebuild to take effect
3. **Check platform settings:** Verify the variable is set in your deployment platform
4. **Case sensitivity:** Variable names are case-sensitive

### URL Not Opening

1. **Verify URL format:** Must be valid HTTP/HTTPS or relative path
2. **Check permissions:** Ensure the URL is publicly accessible
3. **Test manually:** Copy the URL and test it in a browser

### Platform-Specific Issues

**GitHub Actions:**
- Ensure secret is named exactly `VITE_RESUME_LINK`
- Check workflow logs for build errors
- Verify the secret is accessible to the workflow

**Cloudflare Pages:**
- Environment variables take effect on next deployment
- Check build logs for environment variable loading
- Ensure variable is set for correct environment (production/preview)

## Examples

### Google Drive Integration
```bash
# Share your resume on Google Drive and get the shareable link
# Format: https://drive.google.com/file/d/FILE_ID/view
VITE_RESUME_LINK="https://drive.google.com/file/d/1abc123def456ghi789/view"
```

### Local File with CDN Fallback
```bash
# Use environment variable for CDN, fallback to local file
VITE_RESUME_LINK="https://cdn.mywebsite.com/resume.pdf"
```

### Development vs Production
```bash
# .env.development
VITE_RESUME_LINK="/resume.pdf"

# .env.production (set in deployment platform)
VITE_RESUME_LINK="https://drive.google.com/file/d/YOUR_ID/view"
```

## Best Practices

1. **Use External Links:** For better availability and faster loading
2. **Test Regularly:** Ensure links remain accessible
3. **Update Documentation:** Keep resume links current
4. **Monitor Analytics:** Track resume download/view metrics
5. **Backup Strategy:** Have both external and local copies available

## Support

If you encounter issues with environment variables:
1. Check the troubleshooting section above
2. Verify your platform-specific configuration
3. Test with a simple URL first (like a local file)
4. Check browser console for error messages
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```bash
   VITE_RESUME_LINK=https://your-resume-link.com
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

## Security

- Environment variables are validated for security
- Dangerous URL schemes (javascript:, data:, vbscript:) are blocked
- Invalid URLs fallback to default resume.pdf

## CI/CD

Set environment variables in your deployment platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **GitHub Pages**: Repository Settings → Secrets and Variables
