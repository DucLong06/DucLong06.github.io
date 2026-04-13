# Deployment Guide

**Last Updated**: 2026-04-14
**Platform**: GitHub Pages (native, no `gh-pages` branch)
**Pipeline**: GitHub Actions (.github/workflows/deploy.yml)
**Repository**: https://github.com/DucLong06/DucLong06.github.io

## Overview

DucLong06.github.io uses GitHub Pages native deployment via GitHub Actions. Push to `master` → workflow builds Astro → deploys to Pages → live in ~3–5 minutes.

## Prerequisites

- Git installed locally
- Node.js 20.19.0 (pinned in `.nvmrc`)
- npm (comes with Node)
- GitHub account with repository access

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/DucLong06/DucLong06.github.io.git
cd DucLong06.github.io
```

### 2. Install Dependencies
```bash
nvm use               # Switch to Node 20.19.0
npm install           # Install packages
```

### 3. Start Dev Server
```bash
npm run dev           # Starts at http://localhost:4321
```

Open browser: http://localhost:4321

### 4. Build Locally
```bash
npm run build         # Creates ./dist
npm run preview       # Preview production build
```

## Making Changes

### Edit Content (Fastest Path)
Edit content files → no code changes needed:
```bash
# Edit project metadata
vim src/content/projects/my-project.md

# Edit profile info
vim src/content/profile/main.yaml

# Edit experience
vim src/content/experience/my-role.md
```

Save → `npm run dev` watches and rebuilds → refresh browser.

### Edit Code
```bash
# Edit React component
vim src/components/react/my-component.tsx

# Edit Astro layout
vim src/layouts/BaseLayout.astro

# Edit design tokens
vim src/styles/tokens.css
```

Dev server hot-reloads.

### Test Changes Locally
```bash
npm run build       # Full production build
npm run preview     # Preview built output at http://localhost:4321
curl http://localhost:4321
```

Check DevTools for errors: F12 → Console.

### Commit & Push
```bash
git add .
git commit -m "feat: add new project"
git push origin master
```

## Deployment Process

### Automatic Deployment (GitHub Actions)

**Trigger**: `git push master`

**Workflow** (`.github/workflows/deploy.yml`):
1. Checkout code
2. Setup Node 20 + cache `node_modules`
3. `npm ci` (clean install, respects `package-lock.json`)
4. `npm run build` (GITHUB_TOKEN env injected for GitHub stats API)
5. `actions/upload-pages-artifact` (uploads `./dist`)
6. `actions/deploy-pages@v4` (deploys to GitHub Pages)

**Time to Live**: ~3–5 minutes (includes build + deploy)

### Verify Deployment

1. **Check workflow status**:
   ```bash
   gh run list --workflow=deploy.yml
   # Or visit: https://github.com/DucLong06/DucLong06.github.io/actions
   ```

2. **Visit live site**:
   - https://duclong06.github.io
   - Check changes visible

3. **Smoke test routes**:
   - `/` (EN home)
   - `/vi/` (VI home)
   - `/projects/face-detection-ml-system/` (detail page)
   - `/cv.pdf` (download works)
   - `/sitemap-index.xml` (XML renders)
   - `/unknown-page` (404 loads)

## File Structure for Deployment

```
master branch (source)
├── .github/workflows/deploy.yml  ← Pipeline definition
├── .nvmrc                        ← Node 20.19.0 pin
├── public/
│   ├── .nojekyll                 ← Disable Jekyll
│   ├── cv.pdf
│   └── fonts/
├── src/
│   ├── content/                  ← Markdown + YAML
│   ├── components/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── tailwind.config.js
├── package.json + package-lock.json
├── tsconfig.json
├── docs/                         ← Docs only (not served)
├── .gitignore
└── README.md

             ↓ (npm run build)

./dist/ (output, what gets deployed)
├── index.html                    ← Served as /
├── vi/index.html                 ← Served as /vi/
├── projects/*/index.html
├── cv.pdf
├── sitemap-index.xml
├── robots.txt
├── og-*.png                      ← OG images
└── _astro/                       ← CSS + JS bundles
```

**Pipeline**: `master` → GitHub Actions → build → `./dist` → GitHub Pages.

## GitHub Pages Configuration (One-Time Setup)

### Manual Step: Enable GitHub Actions Deployment

1. Go to repo **Settings → Pages**
2. Under **Build and deployment**:
   - **Source**: Change from "Deploy from a branch" → **"GitHub Actions"**
3. Save

This tells GitHub Pages to use the workflow at `.github/workflows/deploy.yml` instead of expecting a pre-built `gh-pages` branch.

### Current Setup

- **Domain**: duclong06.github.io (GitHub default)
- **HTTPS**: Automatic (enforced by GitHub Pages)
- **Custom Domain**: None configured (optional for future)

### Environment Variables

The workflow passes `GITHUB_TOKEN` at build time:
```yaml
- name: Build
  run: npm run build
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This allows `src/lib/github-stats.ts` to query GitHub API for contribution graph without rate limiting.

### (Optional) Custom Domain Setup

If using custom domain (e.g., `duclong.dev`):

1. **Register domain** via registrar
2. **Update DNS records**:
   ```
   A      example.com              185.199.108.153
   A      example.com              185.199.109.153
   A      example.com              185.199.110.153
   A      example.com              185.199.111.153
   CNAME  www.example.com          DucLong06.github.io
   ```

3. **Create `public/CNAME`** in repo:
   ```
   example.com
   ```

4. **Push & verify**:
   ```bash
   git add public/CNAME
   git commit -m "chore: add custom domain"
   git push origin master
   ```

5. **Wait 24 hours** for HTTPS provisioning, then verify in Settings → Pages

## Performance Optimization

### Current Performance

**Load Time Breakdown**:
- HTML: ~10ms
- CSS: ~50ms
- JavaScript: ~200ms
- Fonts: ~500ms (first load, cached after)
- Total: ~1-2 seconds (optimal conditions)

### Optimization Tips

### 1. Minimize JavaScript Bundle
Currently using jQuery 3.2.1 (87 KB) + plugins (311 KB).

**Option A**: Minify custom code
```bash
# Install UglifyJS globally
npm install -g uglify-js

# Minify main.js
uglifyjs js/main.js -o js/main.min.js -c -m

# Update HTML to use main.min.js
```

**Option B**: Lazy-load plugins
Only load jQuery plugins on pages that need them.

### 2. Optimize Fonts

**Current**: Google Fonts + FontAwesome (large)

**Recommendations**:
- Use system fonts for body text (faster)
- Subset icon fonts (only needed icons)
- Use `font-display: swap` to avoid FOIT

### 3. Compress Images

```bash
# Install ImageMagick
# On Mac: brew install imagemagick
# On Linux: sudo apt-get install imagemagick

# Compress images
convert img/original.jpg -quality 85 img/optimized.jpg

# Convert to WebP
convert img/original.jpg -quality 85 img/optimized.webp
```

Update HTML to use WebP with fallback:
```html
<picture>
  <source srcset="img/hero.webp" type="image/webp">
  <img src="img/hero.jpg" alt="Hero">
</picture>
```

### 4. Enable HTTP/2 Push
GitHub Pages supports HTTP/2 automatically. No configuration needed.

### 5. Cache Busting
If assets don't update after push:

```html
<!-- Add version query string -->
<link rel="stylesheet" href="css/style-light.css?v=2">
<script src="js/main.js?v=2"></script>
```

## Troubleshooting

### Site Not Updating After Push

**Problem**: Changes not visible on GitHub Pages after push

**Solutions**:

1. **Clear browser cache**
   ```
   Ctrl+Shift+Delete (Windows/Linux)
   Cmd+Shift+Delete (Mac)
   ```

2. **Hard refresh page**
   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

3. **Wait 30-60 seconds** for GitHub Pages to rebuild

4. **Check GitHub Actions**
   - Repo → Actions tab
   - Look for "pages build and deployment" workflow
   - Verify it completed successfully

5. **Verify file was actually pushed**
   ```bash
   git log --oneline -5
   # Should show your recent commits
   ```

### Broken Links in Subprojects

**Problem**: Links between subprojects don't work

**Solution**: Use absolute paths from repository root
```html
<!-- Good -->
<a href="/index.html">Back to Portfolio</a>
<a href="/LoginForm/Login_v1/">Login v1</a>

<!-- Avoid (relative paths may break) -->
<a href="../index.html">Back to Portfolio</a>
```

### Theme Not Persisting

**Problem**: Theme color resets on page reload

**Solution**: Check browser localStorage is enabled
```javascript
// In browser console
localStorage.getItem('theme')  // Should return current theme
```

If localStorage disabled:
- Check browser privacy settings
- Try incognito/private mode
- Verify no browser extension blocking storage

### Google Analytics Not Tracking

**Problem**: Analytics data not showing

**Solution**:

1. **Verify GA ID in code**
   ```html
   <script>
   var ga_id = 'UA-XXXXXXXXX-X';  // Check this ID
   ```

2. **Check GA account**
   - Log in to Google Analytics
   - Verify property exists
   - Check that data collection is enabled

3. **Check in GA real-time view**
   - Analytics → Real-time → Overview
   - Visit site and check for traffic

### CSS Not Loading

**Problem**: Styles look broken or missing

**Solutions**:

1. **Check CSS file order** in HTML
   ```html
   <link rel="stylesheet" href="css/plugins.css">
   <link rel="stylesheet" href="css/style-light.css">
   <link rel="stylesheet" href="css/[color]-color.css">
   ```

2. **Verify CSS files exist**
   - Check in repository
   - Verify filenames match exactly (case-sensitive)

3. **Check DevTools Network tab**
   - F12 → Network tab
   - Reload page
   - Look for failed CSS requests (red)

## Rollback Procedure

If deployment introduces errors:

### Option 1: Revert Last Commit
```bash
git log --oneline -5          # View recent commits
git revert <commit-hash>      # Revert bad commit
git push origin master        # Push revert
```

### Option 2: Reset to Previous State
```bash
git log --oneline -5
git reset --hard <commit-hash>  # Reset to good commit
git push --force origin master  # Force push
```

**Warning**: Use `--force` carefully. It rewrites history.

### Option 3: Restore from GitHub
If local repository corrupted:

```bash
# Clone fresh copy from GitHub
git clone https://github.com/DucLong06/DucLong06.github.io.git new-copy
cd new-copy

# Checkout previous commit
git checkout <commit-hash>

# Create new branch and push
git checkout -b restore-<date>
git push origin restore-<date>
```

## Monitoring

### Check Deployment Status

**GitHub Actions** (if configured):
```bash
# View workflow status
gh run list

# View specific run details
gh run view <run-id>
```

### Monitor Performance

**Google PageSpeed Insights**:
1. Visit https://pagespeed.web.dev
2. Enter: https://duclong06.github.io
3. Check performance score

**Expected Scores**:
- Performance: 70-85 (acceptable for static site)
- Accessibility: 90+ (good semantic HTML)
- Best Practices: 90+ (security, standards)
- SEO: 90+ (meta tags, responsive design)

### Check Uptime

**StatusPage.io** (optional setup):
- Create free account
- Monitor site uptime
- Get alerts if site goes down

## Security Considerations

### No Sensitive Data
- No API keys in repository
- No database credentials
- No user data stored

### Content Security
- No user-generated content accepted
- Static files only
- HTML sanitization built-in (no XSS vectors)

### HTTPS Enforcement
GitHub Pages enforces HTTPS automatically.

### Keep Dependencies Updated
Periodically check for:
- jQuery security updates (currently 3.2.1)
- Plugin updates (FontAwesome, etc.)
- Browser compatibility

## Maintenance Schedule

### Daily
- Monitor site accessibility

### Weekly
- Check analytics for errors
- Review broken links
- Test form submissions

### Monthly
- Review PageSpeed Insights scores
- Check for broken asset links
- Update content as needed

### Quarterly
- Review and update documentation
- Check for outdated libraries
- Plan modernization efforts

## Backup & Recovery

### Backup Strategy

**GitHub is Your Backup**:
- All code versioned in git
- GitHub keeps history for 90+ days
- Can recover from any previous commit

### Recovery Procedure

```bash
# Find when issue started
git log --oneline --grep="keyword" 

# Check diff to see what changed
git show <commit-hash>

# Revert to working state
git revert <bad-commit-hash>
git push origin master
```

## Contact & Support

For issues:
- Check GitHub Issues: https://github.com/DucLong06/DucLong06.github.io/issues
- Contact author: https://www.facebook.com/duclong2k
- Review GitHub Pages docs: https://docs.github.com/en/pages

## Related Documentation

- [System Architecture](./system-architecture.md)
- [Code Standards](./code-standards.md)
- [Codebase Summary](./codebase-summary.md)
- [Project Overview](./project-overview-pdr.md)
