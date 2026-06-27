# ⚡ Quick Start Guide

Get **Digit Flow Pro** running in under 5 minutes!

## 5-Minute Setup

### Step 1: Get Your Deriv API Token (2 min)

1. Visit: https://app.deriv.com/account/api-token
2. Click **"Create new token"**
3. Name it: `Digit Flow Pro`
4. Select scopes:
   - ✅ `read`
   - ✅ `trade`
   - ✅ `trading`
5. Click **Generate**
6. **Copy the token** (you'll paste it next)

### Step 2: Open Dashboard (1 min)

Choose one option:

**Option A: GitHub Pages (Recommended)**
```
https://stenroj.github.io/Trading-digit-flow-pro/
```

**Option B: Chrome Extension**
- Go to `chrome://extensions/`
- Enable Developer mode
- Click "Load unpacked"
- Select repository folder
- Click extension icon

**Option C: Local File**
- Open `index.html` in your browser

### Step 3: Paste Token & Start Trading (2 min)

1. Click ⚙️ **Settings** button (top right)
2. Paste your token in the text field
3. Click **"Validate & Save"**
4. Wait for ✅ confirmation
5. Toggle **"Real Trading"** to enable (optional - start with Simulation)
6. Close settings
7. Watch the ticks flow! 📊

## What You'll See

### Live Ticker
- Current tick value
- Trend indicator (↑ UP / ↓ DOWN / → FLAT)
- Ticks per minute
- Connection status (● green = connected)

### Live Chart
- Last 60 ticks displayed
- Updates every tick
- Hover for values

### Analysis Cards
- **Over/Under**: Digits > 5 vs < 5
- **Matches/Differs**: Current vs previous digit
- **Even/Odd**: Parity distribution
- **Digit Frequency**: 0-9 heatmap

### History Table
- Last 10 ticks
- All analysis metrics
- Timestamps

## First Trade Tips

### 1. Start with Simulation
- Don't toggle "Real Trading" immediately
- Practice with demo account first
- Understand the patterns

### 2. Watch the Analysis
- Over/Under shows ratio of digits
- Match/Differ reveals consecutive patterns
- Even/Odd shows parity trends
- Frequency heatmap identifies hot digits

### 3. Pick Your Symbol
- Click **Symbol** dropdown
- Choose from:
  - **Digits Over/Under** (default)
  - **Digits Match/Differ**
  - **Digits Even/Odd**
  - **Rise/Fall**
  - **High/Low**

### 4. Monitor the Stream
- Green indicator = connected
- Red indicator = disconnected
- Auto-reconnects in 5 seconds

### 5. Keep Settings Secure
- Token saved locally in browser
- Only you have access
- Never share your token

## Common Questions

### Q: Is my token safe?
**A:** Yes! Token is stored securely in your browser's local storage. Never sent to any server.

### Q: Can I use on multiple devices?
**A:** You'll need to paste the token on each device separately. Each browser has its own storage.

### Q: What's the difference between Simulation and Live?
**A:** 
- **Simulation**: Practice mode, no real money
- **Live**: Real trading with actual funds

### Q: Can I trade multiple symbols at once?
**A:** Not simultaneously in one dashboard. Open multiple tabs for different symbols.

### Q: Does it work on mobile?
**A:** Yes! Dashboard is responsive. Use a mobile browser or Chrome on mobile.

### Q: How often do I get ticks?
**A:** Typically 1 tick per second (1s contracts). Faster markets may have more.

### Q: Can I export data?
**A:** Currently, data is stored in memory only. It resets on page refresh. Use your browser's developer tools to export if needed.

## Troubleshooting

### "Token validation failed"

**Problem:** Can't connect with token

**Solution:**
1. Verify token is valid: https://app.deriv.com/account/api-token
2. Check token has correct scopes
3. Generate a new token if expired
4. Clear browser cache and try again

### No ticks showing up

**Problem:** Dashboard won't connect to market

**Solution:**
1. Check internet connection
2. Verify token is valid
3. Check stream status indicator (● should be green)
4. Refresh the page
5. Check if market is open for selected symbol

### "Network error" when validating

**Problem:** Can't reach Deriv API

**Solution:**
1. Check your internet connection
2. Try a different network (mobile hotspot, etc.)
3. Wait a minute and try again
4. Check Deriv status page

### Chart not updating

**Problem:** Live chart is frozen

**Solution:**
1. Refresh page (F5)
2. Check browser console (F12) for errors
3. Try a different browser
4. Verify JavaScript is enabled

### Settings modal won't close

**Problem:** Settings stuck open

**Solution:**
1. Click X button to close
2. Click outside modal
3. Press Escape key
4. Refresh page

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close settings modal |
| `F5` | Refresh dashboard |
| `F12` | Open developer tools |
| `Ctrl+Shift+R` | Hard refresh (clear cache) |

## Performance Tips

### For Faster Updates
- Close other browser tabs
- Disable browser extensions
- Use wired internet if possible
- Use Chrome/Edge (faster WebSocket)

### For Better Visibility
- Use full screen (F11)
- Maximize browser window
- Adjust zoom (Ctrl + or -)
- Use dark theme (already enabled)

## Next Steps

### Learn More
- 📖 Read full [README.md](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for advanced setup
- 🔗 Visit [Deriv API Docs](https://api.deriv.com/)

### Enhance Your Workflow
- Pin extension to toolbar for quick access
- Bookmark dashboard URL
- Create browser profile for trading only

### Contribute
- Found a bug? Open an [Issue](https://github.com/stenroj/Trading-digit-flow-pro/issues)
- Want to help? Make a [Pull Request](https://github.com/stenroj/Trading-digit-flow-pro/pulls)

## Safety Reminders

⚠️ **Important:**
- Never trade more than you can afford to lose
- Understand the instruments before trading
- Use stop loss and risk management
- Start small and learn patterns
- Past performance ≠ future results
- Check your local trading laws

## Support

- 🐛 **Bugs**: [GitHub Issues](https://github.com/stenroj/Trading-digit-flow-pro/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/stenroj/Trading-digit-flow-pro/discussions)
- 🌐 **Deriv Help**: [Deriv Support](https://www.deriv.com/contact)

## Useful Links

| Link | Purpose |
|------|---------|
| [Live Dashboard](https://stenroj.github.io/Trading-digit-flow-pro/) | Open dashboard |
| [Deriv App](https://app.deriv.com/) | Create account |
| [API Tokens](https://app.deriv.com/account/api-token) | Get tokens |
| [Repository](https://github.com/stenroj/Trading-digit-flow-pro) | Source code |
| [Deriv API](https://api.deriv.com/) | API docs |

---

## You're All Set! 🎉

Your **Digit Flow Pro** dashboard is ready to go!

1. ✅ Dashboard opened
2. ✅ Token pasted
3. ✅ Analysis running
4. ✅ Ticks streaming
5. ✅ Ready to trade!

**Start with simulation mode** to learn the patterns before trading with real money.

Happy trading! 📈
