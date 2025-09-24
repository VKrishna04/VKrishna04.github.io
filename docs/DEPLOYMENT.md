# GitHub Pages & Cloudflare Pages Deployment Guide

See also: [Environment Variables Guide](./ENVIRONMENT%20VARIABLES.md) for details on configuring Environment Variables for Deployment.

This repository is configured to deploy to both GitHub Pages and Cloudflare Pages with environment variable support.

## Table of Contents
- [GitHub Pages \& Cloudflare Pages Deployment Guide](#github-pages--cloudflare-pages-deployment-guide)
	- [Table of Contents](#table-of-contents)
	- [GitHub Actions Setup](#github-actions-setup)
		- [1. Enable GitHub Pages](#1-enable-github-pages)
		- [2. Set Environment Variables](#2-set-environment-variables)
		- [3. Workflow Configuration](#3-workflow-configuration)
	- [Cloudflare Pages Setup](#cloudflare-pages-setup)
		- [1. Connect Repository](#1-connect-repository)
		- [2. Build Configuration](#2-build-configuration)
		- [3. Environment Variables](#3-environment-variables)
		- [4. Custom Domain (Optional)](#4-custom-domain-optional)
	- [Environment Variable Examples](#environment-variable-examples)
		- [Google Drive Resume](#google-drive-resume)
		- [OneDrive Resume](#onedrive-resume)
		- [CDN Hosted Resume](#cdn-hosted-resume)
		- [Local File (fallback)](#local-file-fallback)
	- [Verification](#verification)
	- [Troubleshooting](#troubleshooting)
		- [GitHub Actions Issues](#github-actions-issues)
		- [Cloudflare Pages Issues](#cloudflare-pages-issues)
		- [Environment Variable Not Working](#environment-variable-not-working)
	- [Performance Optimization](#performance-optimization)
	- [Security Features](#security-features)
	- [Monitoring](#monitoring)


## GitHub Actions Setup

### 1. Enable GitHub Pages
1. Go to your repository → Settings → Pages
2. Source: "Deploy from a branch" or "GitHub Actions" (recommended)
3. If using GitHub Actions, the workflow is already configured

### 2. Set Environment Variables
1. Go to repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:
   - **Name:** `VITE_RESUME_LINK`
   - **Value:** Your resume URL (e.g., `https://drive.google.com/file/d/YOUR_ID/view`)

### 3. Workflow Configuration
The `.github/workflows/deploy.yml` file is already configured with:
- Node.js 20 setup
- Dependency installation and caching
- Linting and building
- Environment variable injection
- GitHub Pages Deployment

## Cloudflare Pages Setup

### 1. Connect Repository
1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project"
3. Connect to Git provider (GitHub)
4. Select this repository

### 2. Build Configuration
Set these build settings:
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js version:** 18 or 20

### 3. Environment Variables
1. In Cloudflare Pages → Settings → Environment Variables
2. Add variable:
   - **Variable name:** `VITE_RESUME_LINK`
   - **Value:** Your resume URL
   - **Environment:** Production (and Preview if needed)

### 4. Custom Domain (Optional)
1. In Cloudflare Pages → Custom domains
2. Add your domain (e.g., `yourdomain.com`)
3. Follow DNS setup instructions

## Environment Variable Examples

### Google Drive Resume
```bash
VITE_RESUME_LINK="https://drive.google.com/drive/folders/1pLvckiL1bPmbkMn3BI1pqp3ud2z79DcN?usp=sharing"
```

If the environment variable is not set, the app will fallback to the value in `settings.json` or `/resume.pdf`.

### OneDrive Resume
```bash
VITE_RESUME_LINK="https://1drv.ms/b/s!ABC123def456ghi789"
```

### CDN Hosted Resume
```bash
VITE_RESUME_LINK="https://cdn.yoursite.com/resume.pdf"
```

### Local File (fallback)
```bash
VITE_RESUME_LINK="/resume.pdf"
```

## Verification

After Deployment, verify the setup:

1. **Check build logs** for environment variable loading
2. **Open browser console** on your site
3. **Look for:** `"Using environment resume URL: [your-url]"`
4. **Test the resume button** to ensure it works correctly

## Troubleshooting

### GitHub Actions Issues
- Check workflow logs in Actions tab
- Verify secret name is exactly `VITE_RESUME_LINK`
- Ensure permissions are correct in workflow file

### Cloudflare Pages Issues
- Check build logs in Cloudflare dashboard
- Verify environment variable is set for correct environment
- Redeploy after adding Environment Variables

### Environment Variable Not Working
- Ensure the variable name has `VITE_` prefix
- Check browser console for loading messages
- Verify URL is publicly accessible

## Performance Optimization

Both platforms provide:
- **Global CDN** for fast worldwide access
- **Automatic SSL** certificates
- **Gzip/Brotli compression**
- **HTTP/2 support**
- **Static asset caching**

## Security Features

- XSS protection headers
- Content type validation
- Secure URL handling in application
- HTTPS-only external links
- Frame options protection

## Monitoring

Track your Deployment:
- **GitHub Actions:** Check workflow status and logs
- **Cloudflare Pages:** Monitor build and Deployment status
- **Analytics:** Use Cloudflare Web Analytics or Google Analytics
- **Error Tracking:** Monitor browser console for errors
