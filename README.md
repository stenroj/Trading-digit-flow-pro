# Digit Flow Pro — Rise/Fall Bot

A comprehensive trading dashboard for live Deriv digit analysis with auto-trading capabilities.

## Features

### 🤖 Auto Trading
- **Auto Trader**: Start/stop automated trading with real-time status
- **Smart Auto Trader**: Picks the strongest signal (Rise/Fall/Over/Under/Matches/Differs)
- **Martingale**: Recover losses by scaling stake
- **Stop on Dominance Flip**: Halt when trend reverses

### 📊 Live Analysis
- **Volatility 75 Index**: Real-time price tracking
- **Digit Distribution**: Visual grid showing digit frequency (0-9)
- **Matches/Differs**: Pattern analysis with statistics
- **Even/Odd Analysis**: Last digit analysis
- **Digit Frequency**: Last 20 ticks analysis
- **Over/Under**: Statistical breakdown

### 🎯 Differs Scanner
- Scans every volatility for rarest digit
- Auto-trades Differs signals
- Configurable minimum win percentage
- Auto bulk firing (30 contracts per signal)
- Digit confirmation (wait 3 scans before trading)
- Edge-based filtering (95-100%)

### ⚙️ Advanced Settings
- **Time Frame**: 25, 50, 100, 200, 500, 1000 ticks
- **Stake**: Configurable stake amount
- **Duration**: Trade duration in ticks
- **Lookback**: Historical data window
- **Edge %**: Minimum edge requirement
- **SL/TP**: Stop loss and take profit
- **Predicted Digit**: Manual digit prediction
- **Volatility Guard**: Risk management (0 = off)
- **Multiplier**: Martingale multiplier
- **Max Stake**: Maximum stake limit

### 📈 Live Scanner
- Monitor all volatility indices simultaneously
- Real-time signal detection
- Multi-timeframe analysis

### 💰 Session Tracking
- Real-time balance display
- Profit/loss tracking
- Trade history

## Installation

1. Clone the repository
```bash
git clone https://github.com/stenroj/Trading-digit-flow-pro.git
cd Trading-digit-flow-pro
```

2. Open `index.html` in your browser

3. For GitHub Pages deployment:
   - Push to GitHub
   - Settings → Pages → Source: Deploy from a branch → main
   - Your site will be live at: `https://stenroj.github.io/Trading-digit-flow-pro`

## Deriv API Integration

1. Get your API token from [Deriv API Console](https://app.deriv.com/api-management)
2. Click Settings ⚙️ in the dashboard
3. Paste your token and validate
4. Switch between Simulation and Real Trading modes

## Configuration

All settings are automatically saved to browser localStorage.

### Trade Configuration
- **Stake**: Starting stake amount (0.5 - 100)
- **Contracts**: Number of contracts per trade
- **Duration**: Contract duration in ticks

### Risk Management
- **SL**: Stop loss in dollars
- **TP**: Take profit in dollars
- **Volatility Guard**: Protection against extreme volatility
- **Max Stake**: Upper limit for Martingale scaling

## Usage

1. **Setup**: Configure your trading parameters in the Advanced section
2. **Start**: Click "Start" button to begin auto-trading
3. **Monitor**: Watch real-time analysis in the dashboard
4. **Adjust**: Modify settings on-the-fly (changes auto-save)
5. **Stop**: Click "Stop" to halt trading

## Quick Trades

Use the quick buttons:
- **Matches 5**: Trade digit 5 matches
- **Differs 5**: Trade digit 5 differs

## Performance Tips

- Start with simulation mode to test settings
- Use 100-200 tick lookback for stable signals
- Set edge % to 95-100 for high-confidence trades
- Enable Martingale only with small multipliers (1.5-2.0)
- Monitor volatility guard to prevent large drawdowns

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Disclaimer

⚠️ **Use at your own risk.** Past performance does not guarantee future results. Always trade with money you can afford to lose.

## License

MIT License - See LICENSE file for details

## Support

For issues or feature requests, open an issue on GitHub.