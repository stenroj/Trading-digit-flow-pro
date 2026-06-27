# 💹 Digit Flow Pro — Live Deriv Trading Dashboard

**Live Deriv digit analysis bot, auto trader, Matches/Differs scanner with real-time WebSocket streaming.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Chrome%20Extension%20%2B%20Web-orange)

## 🚀 Features

### Live Market Data
- **Real-time WebSocket streaming** from Deriv API
- **Live tick chart** (last 60 ticks with Chart.js)
- **Trend detection** (Up/Down/Flat)
- **Stream status indicator** with connection monitoring
- **Automatic reconnection** on disconnect

### Digit Analysis
- **Over/Under Analysis** (5 as threshold)
- **Matches/Differs** (consecutive digit comparison)
- **Even/Odd** (last digit parity)
- **Last Digit Frequency** (0-9 distribution heatmap)
- **Real-time stats** with percentage bars

### Trading Features
- **Live Trading Mode** - Trade with real Deriv account
- **Simulation Mode** - Practice with demo account
- **API Token Authentication** - Secure token storage
- **Multiple Symbols** - Digits Over/Under, Match/Differ, Even/Odd, Rise/Fall, High/Low
- **Tick History** - Last 10 ticks table with analysis

### Dashboard
- **Professional dark UI** with real-time updates
- **Responsive design** (desktop, tablet, mobile)
- **Settings modal** for configuration
- **Live status pill** (SIMULATION/LIVE indicator)
- **Ticker cards** with trend indicators
- **Analysis cards** with visual bar charts
- **Digit frequency heatmap** with color intensity

## 📋 Deployment Options

### Option 1: GitHub Pages (Recommended)
The dashboard is ready to deploy on GitHub Pages at:
```
https://stenroj.github.io/Trading-digit-flow-pro/
```

**To enable:**
1. Go to repository Settings → Pages
2. Set source to `main` branch, root folder
3. GitHub will automatically deploy to the URL above

### Option 2: Chrome Extension (Local)
Load as unpacked extension for local testing:

1. Clone the repository
2. In Chrome: `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the repository folder
6. Click the extension icon to open dashboard

### Option 3: Local Development Server
```bash
python3 -m http.server 8000
# or
npx http-server
```
Then visit `http://localhost:8000`

## 🔧 Configuration

### API Token Setup
1. Get your Deriv API token from [https://app.deriv.com/account/api-token](https://app.deriv.com/account/api-token)
2. Open settings (⚙️ icon)
3. Paste token and click "Validate & Save"
4. Select trading mode (Simulation or Live)

### Trading Symbols
- **1s Digits Over/Under**: `R_50`
- **1s Digits Match/Differ**: `MATCH_50`
- **1s Digits Even/Odd**: `ODD_50`
- **1s Rise/Fall**: `FRXAUDCAD`
- **1s High/Low**: `EURUSD`

## 📊 UI Components

### Header
- Logo with tagline
- Settings button
- Live/Simulation status indicator

### Ticker Section
- Current tick value
- Trend (↑ UP / ↓ DOWN / → FLAT)
- Ticks per minute
- Stream status indicator

### Chart Section
- Interactive Chart.js line graph
- Last 60 ticks
- Real-time updates
- Hover tooltips

### Analysis Cards
- **Over/Under**: Distribution bar chart
- **Matches/Differs**: Consecutive comparison
- **Even/Odd**: Parity analysis
- **Last Digit Frequency**: 0-9 heatmap with intensity coloring

### History Table
- Last 10 ticks
- Tick value, Over/Under, Match/Differ, Even/Odd, Time
- Responsive scrolling

## 🎨 Design

### Color Scheme (Dark Mode)
- **Background**: `#0b0f1a`
- **Secondary**: `#121826`
- **Border**: `#243049`
- **Text**: `#e6edf7`
- **Accent**: `#3b82f6`
- **Success**: `#4ade80`
- **Danger**: `#ef4444`

### Analysis Colors
- **Over**: `#3b82f6` (Blue)
- **Under**: `#ef4444` (Red)
- **Match**: `#4ade80` (Green)
- **Differ**: `#f59e0b` (Amber)
- **Even**: `#8b5cf6` (Purple)
- **Odd**: `#ec4899` (Pink)

## 📱 Responsive Breakpoints
- **Desktop**: Full layout, 4-column grid
- **Tablet** (≤768px): 2-column grid, adjusted padding
- **Mobile** (≤480px): 1-column layout, optimized touch targets

## 🔐 Security

- **Token Storage**: Secure storage via Chrome `storage.local` API
- **WebSocket**: Encrypted WSS connection to Deriv
- **No Backend**: All processing client-side
- **HTTPS Only**: GitHub Pages enforces HTTPS

## 📦 File Structure

```
Trading-digit-flow-pro/
├── index.html          # Main dashboard HTML
├── app.js              # Core application logic
├── styles.css          # Dashboard styling
├── manifest.json       # Chrome extension manifest
├── background.js       # Extension background worker
├── options.html        # Settings page (optional)
├── options.js          # Settings logic (optional)
├── icon.png           # Extension icon (48x48, 128x128)
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/stenroj/Trading-digit-flow-pro.git
cd Trading-digit-flow-pro
```

### 2. Get Deriv API Token
- Visit [https://app.deriv.com/account/api-token](https://app.deriv.com/account/api-token)
- Create a new token with scopes: `read`, `trade`, `trading`
- Copy the token

### 3. Open Dashboard
- **GitHub Pages**: https://stenroj.github.io/Trading-digit-flow-pro/
- **Local**: Load `index.html` in your browser
- **Chrome Extension**: Load unpacked from repository

### 4. Paste Token & Trade
1. Click ⚙️ (Settings)
2. Paste your Deriv token
3. Click "Validate & Save"
4. Toggle "Real Trading" to enable (optional)
5. Start analyzing ticks!

## 💡 How It Works

### Live Tick Stream
1. WebSocket connects to Deriv at `wss://ws.derivws.com/websockets/v3`
2. Authorizes with API token
3. Subscribes to selected symbol (e.g., `R_50` for digits)
4. Receives tick updates in real-time (typically every 1 second)

### Analysis Pipeline
```
Raw Tick → Extract Last Digit → Analyze (Over/Under, Match/Differ, Even/Odd)
→ Update UI → Store in History → Update Chart
```

### Storage
- **Browser LocalStorage**: Settings, token, mode
- **In-Memory State**: Last 60 ticks, analysis data, chart instance

## ⚙️ API Reference

### Deriv WebSocket Messages

**Authorization:**
```json
{ "authorize": "YOUR_API_TOKEN" }
```

**Subscribe to Ticks:**
```json
{ "ticks": "R_50", "subscribe": 1 }
```

**Tick Response:**
```json
{
  "tick": {
    "epoch": 1234567890,
    "quote": 1234.5678
  }
}
```

## 🐛 Troubleshooting

### "Network error" or "Timeout contacting Deriv"
- Check internet connection
- Verify token is valid at https://app.deriv.com
- Check Deriv API status
- Clear browser cache and reload

### "Token validation failed"
- Ensure token has proper scopes: `read`, `trade`, `trading`
- Token may be revoked or expired
- Generate a new token

### Chart not updating
- Refresh the page
- Check browser console for errors (F12)
- Ensure JavaScript is enabled

### No ticks received
- Verify stream status indicator (● should be green/connected)
- Check if symbol is tradable during market hours
- Some symbols only available during trading hours

## 🔄 Reconnection Logic

The dashboard automatically:
- Detects WebSocket disconnects
- Attempts reconnect every 5 seconds
- Maintains tick history during reconnection
- Updates UI status indicator

## 📈 Analysis Metrics

### Over/Under
- Counts digits > 5 as "Over"
- Counts digits < 5 as "Under"
- Excludes 5 as neutral

### Match/Differ
- Compares current digit with previous
- Displays match percentage
- Shows last result

### Even/Odd
- Even: digits 0, 2, 4, 6, 8
- Odd: digits 1, 3, 5, 7, 9
- Real-time ratio

### Frequency Heatmap
- 0-9 digit distribution
- Color intensity = frequency
- Updates with each tick

## ⚠️ Disclaimer

**This tool is for educational and analysis purposes only.**

- ⚠️ Past performance does not guarantee future results
- ⚠️ Use at your own risk with real funds
- ⚠️ Always use proper risk management
- ⚠️ Never trade more than you can afford to lose
- ⚠️ Deriv carries financial risk; understand instruments before trading

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**stenroj** - [GitHub Profile](https://github.com/stenroj)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/stenroj/Trading-digit-flow-pro/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/stenroj/Trading-digit-flow-pro/discussions)
- 🌐 Deriv Support: [https://www.deriv.com/contact](https://www.deriv.com/contact)

## 🔗 Links

- **Live Dashboard**: https://stenroj.github.io/Trading-digit-flow-pro/
- **Repository**: https://github.com/stenroj/Trading-digit-flow-pro
- **Deriv Platform**: https://app.deriv.com
- **Deriv API Docs**: https://api.deriv.com

---

**Built with ❤️ for Deriv Traders | v1.0.0**
