# 🚀 Deployment Guide

## GitHub Pages Deployment (Production)

Your **Digit Flow Pro** dashboard is now ready for automatic deployment on GitHub Pages.

### Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/stenroj/Trading-digit-flow-pro
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main`
   - **Folder**: Select `/ (root)`
4. Click **Save**

GitHub will automatically deploy the dashboard to:
```
https://stenroj.github.io/Trading-digit-flow-pro/
```

### Step 2: Wait for Deployment

- GitHub will start the deployment automatically
- Check the **Actions** tab to monitor progress
- Green checkmark = deployment successful
- Usually takes 1-2 minutes

### Step 3: Access Your Dashboard

Once deployed, access it at:
```
https://stenroj.github.io/Trading-digit-flow-pro/
```

## Local Development

### Option A: Python HTTP Server
```bash
# Navigate to repository directory
cd Trading-digit-flow-pro

# Start server
python3 -m http.server 8000

# Open browser
# http://localhost:8000
```

### Option B: Node.js HTTP Server
```bash
# Install http-server globally
npm install -g http-server

# Start server
http-server

# Open browser (usually http://localhost:8080)
```

### Option C: Direct File Opening
```bash
# Simply open index.html in your browser
open index.html
# or
start index.html
```

## Chrome Extension Deployment

### Load as Unpacked Extension (Development)

1. **Clone or download** the repository
2. Open Chrome: `chrome://extensions/`
3. **Enable** "Developer mode" (top right toggle)
4. Click **"Load unpacked"**
5. Select the repository folder
6. Extension will appear in your toolbar!

### Use the Extension

- Click the extension icon in your toolbar
- Dashboard opens in a new tab
- Or visit: https://stenroj.github.io/Trading-digit-flow-pro/

### Package for Distribution

To create a `.crx` file for distribution:

```bash
# Using Chrome DevTools
1. Go to chrome://extensions/
2. Click "Pack extension"
3. Select the repository folder
4. Create private key (first time only)
5. Chrome generates .crx file
```

## Quick Setup Checklist

- [ ] Repository exists at: https://github.com/stenroj/Trading-digit-flow-pro
- [ ] GitHub Pages enabled in repository settings
- [ ] Main branch selected as deployment source
- [ ] Deploy folder set to root `/`
- [ ] Deployment completed (check Actions tab)
- [ ] Dashboard accessible at: https://stenroj.github.io/Trading-digit-flow-pro/
- [ ] Settings ⚙️ button works
- [ ] Can paste Deriv API token
- [ ] Token validation works
- [ ] Live ticks stream when authorized
- [ ] Analysis updates in real-time

## Environment Variables

Create a `.env` file for local development (not needed for GitHub Pages):

```env
DERIV_WS_URL=wss://ws.derivws.com/websockets/v3?app_id=1089
API_TIMEOUT=12000
RECONNECT_INTERVAL=5000
```

## Troubleshooting Deployment

### Dashboard shows blank page

**Solution:**
- Clear browser cache (Ctrl+Shift+Del)
- Hard refresh (Ctrl+Shift+R)
- Check browser console (F12) for errors
- Verify all files are in repository

### GitHub Pages not updating

**Solution:**
- Go to Actions tab
- Check if deployment job passed
- If failed, check logs for errors
- Ensure index.html exists in root

### 404 Not Found

**Solution:**
- Verify correct URL: https://stenroj.github.io/Trading-digit-flow-pro/
- Check GitHub Pages is enabled
- Ensure main branch is selected
- Wait a few minutes for deployment

### WebSocket connection fails

**Solution:**
- Ensure you're using HTTPS (GitHub Pages enforces this)
- Check internet connection
- Verify Deriv API is accessible
- Try from a different network

### Extension won't load

**Solution:**
- Ensure Developer mode is ON
- Check manifest.json is valid JSON
- Review browser console for errors
- Try reloading the extension

## File Locations After Deployment

**GitHub Pages:**
```
index.html
├── app.js
├── styles.css
└── [Other assets]
```

**Live URL:**
```
https://stenroj.github.io/Trading-digit-flow-pro/index.html
https://stenroj.github.io/Trading-digit-flow-pro/app.js
https://stenroj.github.io/Trading-digit-flow-pro/styles.css
```

## Performance Optimization

### Already Optimized
- ✅ Minified CSS (can be further optimized)
- ✅ External Chart.js via CDN
- ✅ Efficient DOM updates
- ✅ Event delegation
- ✅ Debounced WebSocket messages

### Optional Enhancements
- Add ServiceWorker for offline capability
- Compress assets with Gzip
- Implement code splitting
- Use lazy loading for images

## Security Checklist

- ✅ HTTPS enforced (GitHub Pages)
- ✅ Token stored in browser `storage.local` (encrypted by browser)
- ✅ No credentials in code
- ✅ No backend required
- ✅ WebSocket uses encrypted WSS
- ✅ Input validation on token format

## Monitoring

### Check Deployment Status
```bash
# GitHub CLI
gh repo view stenroj/Trading-digit-flow-pro --web

# Or visit
https://github.com/stenroj/Trading-digit-flow-pro/deployments
```

### View Live Dashboard
```
https://stenroj.github.io/Trading-digit-flow-pro/
```

### Monitor Analytics
- GitHub provides traffic insights in repository Insights → Traffic

## Continuous Updates

### To Update the Dashboard

1. Make changes to files locally
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. GitHub automatically redeploys within 1-2 minutes
4. Changes appear at https://stenroj.github.io/Trading-digit-flow-pro/

## Custom Domain (Optional)

To use a custom domain instead of `stenroj.github.io`:

1. Go to **Settings** → **Pages**
2. Under "Custom domain", enter your domain
3. GitHub will provide DNS records to add
4. Add CNAME record to your DNS provider
5. Wait for verification (usually 24 hours)

## Support & Issues

If deployment fails:

1. Check GitHub Actions logs
2. Verify all files are committed
3. Ensure index.html exists at root
4. Clear GitHub Pages cache (may take time)
5. Open issue on GitHub for help

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#limits-on-use-of-github-pages)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Deriv API Documentation](https://api.deriv.com/)

---

**Deployment Status:** ✅ Ready for GitHub Pages

**Next Steps:**
1. Enable GitHub Pages in repository settings
2. Wait for automatic deployment
3. Visit https://stenroj.github.io/Trading-digit-flow-pro/
4. Paste your Deriv API token
5. Start trading! 🚀
