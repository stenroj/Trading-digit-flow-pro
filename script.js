// Dashboard State
const state = {
  traderRunning: false,
  balance: 1000.00,
  profitLoss: 0.00,
  currentTick: null,
  ticks: [],
  digitAnalysis: {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  },
  config: {
    timeframe: 100,
    stake: 0.5,
    contracts: 30,
    minDiffersWin: 100,
    bulkContracts: 30,
    autoBulk: true,
    confirmDigit: true,
    confirmScans: 3,
    confirmingCount: 0,
    smartTrader: false,
    differsScanner: false,
    advStake: 0.5,
    durationTicks: 1,
    lookback: 100,
    edgePercent: 100,
    stopLoss: 20,
    takeProfit: 50,
    predictedDigit: 5,
    martingale: false,
    multiplier: 2,
    maxStake: 40,
    stopDominance: true,
    volatilityGuard: 200
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
  setupEventListeners();
  loadSavedSettings();
  initializeDigitBars();
  simulateTicks();
});

// Initialize UI
function initializeUI() {
  updateBalanceDisplay();
  updateProfitDisplay();
}

// Event Listeners
function setupEventListeners() {
  // Settings
  const settingsBtn = document.getElementById('settingsBtn');
  const closeSettings = document.getElementById('closeSettings');
  const settingsModal = document.getElementById('settingsModal');
  
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('active');
  });
  
  closeSettings.addEventListener('click', () => {
    settingsModal.classList.remove('active');
  });

  // Trader Controls
  const startTrader = document.getElementById('startTrader');
  const stopTrader = document.getElementById('stopTrader');
  
  startTrader.addEventListener('click', () => {
    state.traderRunning = true;
    startTrader.disabled = true;
    stopTrader.disabled = false;
    updateTraderStatus();
  });
  
  stopTrader.addEventListener('click', () => {
    state.traderRunning = false;
    startTrader.disabled = false;
    stopTrader.disabled = true;
    updateTraderStatus();
  });

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // Time Frame Selection
  const tfBtns = document.querySelectorAll('[data-tf]');
  tfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.config.timeframe = parseInt(btn.dataset.tf);
      saveSettings();
    });
  });

  // Config Inputs
  const configInputs = [
    'tradeStake', 'tradeContracts', 'minDiffersWin', 'bulkContracts',
    'advStake', 'durationTicks', 'lookback', 'edgePercent',
    'stopLoss', 'takeProfit', 'predictedDigit', 'multiplier', 'maxStake', 'volatilityGuard'
  ];
  
  configInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('change', () => {
        const key = toCamelCase(id);
        state.config[key] = parseFloat(input.value) || 0;
        saveSettings();
      });
    }
  });

  // Toggles
  const toggles = ['smartTrader', 'differsScanner', 'autoBulk', 'confirmDigit', 'martingale', 'stopDominance'];
  toggles.forEach(id => {
    const toggle = document.getElementById(id);
    if (toggle) {
      toggle.addEventListener('change', () => {
        state.config[id] = toggle.checked;
        saveSettings();
      });
    }
  });

  // Action Buttons
  document.getElementById('matchesBtn')?.addEventListener('click', () => {
    executeTrade('Matches', 5);
  });
  
  document.getElementById('differsBtn')?.addEventListener('click', () => {
    executeTrade('Differs', 5);
  });
}

// Tab Switching
function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  
  // Update content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  document.getElementById(`${tabName}-tab`)?.classList.add('active');
}

// Trader Status Update
function updateTraderStatus() {
  const status = document.getElementById('traderStatus');
  if (state.traderRunning) {
    status.textContent = '● Running • Active';
    status.style.color = 'var(--success-green)';
  } else {
    status.textContent = '○ Idle • Idle';
    status.style.color = 'var(--text-secondary)';
  }
}

// Initialize Digit Bars
function initializeDigitBars() {
  const container = document.getElementById('digitBars');
  container.innerHTML = '';
  
  for (let i = 0; i < 10; i++) {
    const group = document.createElement('div');
    group.className = 'bar-group';
    group.innerHTML = `
      <div class="bar" style="height: ${Math.random() * 100}%"></div>
      <label>${i}</label>
      <span>${Math.floor(Math.random() * 30)}%</span>
    `;
    container.appendChild(group);
  }
}

// Simulate Ticks
function simulateTicks() {
  setInterval(() => {
    const newTick = Math.floor(Math.random() * 10);
    state.ticks.push(newTick);
    
    if (state.ticks.length > 100) {
      state.ticks.shift();
    }
    
    // Update digit analysis
    state.digitAnalysis[newTick]++;
    
    // Update UI
    updateVolatilityDisplay();
    updateDigitAnalysis();
  }, 1000);
}

// Update Volatility Display
function updateVolatilityDisplay() {
  if (state.ticks.length === 0) return;
  
  const price = 43900 + Math.random() * 100;
  document.getElementById('volatilityPrice').textContent = price.toFixed(4);
  
  // Update matches/differs
  let matches = 0, differs = 0;
  for (let i = 1; i < state.ticks.length; i++) {
    if (state.ticks[i] === state.ticks[i-1]) matches++;
    else differs++;
  }
  
  document.getElementById('matchesCount').textContent = matches;
  document.getElementById('differsCount').textContent = differs;
}

// Update Digit Analysis
function updateDigitAnalysis() {
  const total = Object.values(state.digitAnalysis).reduce((a, b) => a + b, 0);
  if (total === 0) return;
  
  const bars = document.querySelectorAll('.digit-bars .bar');
  bars.forEach((bar, i) => {
    const percent = (state.digitAnalysis[i] / total) * 100;
    bar.style.height = `${percent}%`;
  });
  
  // Update percentages
  document.querySelectorAll('.bar-group span').forEach((span, i) => {
    const percent = Math.round((state.digitAnalysis[i] / total) * 100);
    span.textContent = `${percent}%`;
  });
}

// Update Balance Display
function updateBalanceDisplay() {
  document.getElementById('balanceAmount').textContent = state.balance.toFixed(2);
}

// Update Profit Display
function updateProfitDisplay() {
  const element = document.getElementById('profitLoss');
  element.textContent = `${state.profitLoss >= 0 ? '+' : ''}${state.profitLoss.toFixed(2)}`;
  element.style.color = state.profitLoss >= 0 ? 'var(--success-green)' : 'var(--error-red)';
}

// Execute Trade
function executeTrade(type, digit) {
  if (!state.traderRunning) {
    alert('Start the trader first!');
    return;
  }
  
  const stake = parseFloat(document.getElementById('tradeStake').value);
  const payout = Math.random() > 0.5 ? stake * 1.85 : -stake;
  
  state.balance += payout;
  state.profitLoss += payout;
  
  updateBalanceDisplay();
  updateProfitDisplay();
  
  console.log(`${type} trade on digit ${digit}: ${payout >= 0 ? 'WIN' : 'LOSS'}`);
}

// Save Settings
function saveSettings() {
  localStorage.setItem('digitFlowConfig', JSON.stringify(state.config));
}

// Load Settings
function loadSavedSettings() {
  const saved = localStorage.getItem('digitFlowConfig');
  if (saved) {
    Object.assign(state.config, JSON.parse(saved));
    applySettingsToUI();
  }
}

// Apply Settings to UI
function applySettingsToUI() {
  // Time frame
  const tfBtn = document.querySelector(`[data-tf="${state.config.timeframe}"]`);
  if (tfBtn) {
    document.querySelectorAll('[data-tf]').forEach(b => b.classList.remove('active'));
    tfBtn.classList.add('active');
  }
  
  // Inputs
  const mappings = {
    'tradeStake': 'tradeStake',
    'tradeContracts': 'tradeContracts',
    'minDiffersWin': 'minDiffersWin',
    'bulkContracts': 'bulkContracts',
    'advStake': 'advStake',
    'durationTicks': 'durationTicks',
    'lookback': 'lookback',
    'edgePercent': 'edgePercent',
    'stopLoss': 'stopLoss',
    'takeProfit': 'takeProfit',
    'predictedDigit': 'predictedDigit',
    'multiplier': 'multiplier',
    'maxStake': 'maxStake',
    'volatilityGuard': 'volatilityGuard'
  };
  
  Object.entries(mappings).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (input) input.value = state.config[key];
  });
  
  // Toggles
  const toggles = ['smartTrader', 'differsScanner', 'autoBulk', 'confirmDigit', 'martingale', 'stopDominance'];
  toggles.forEach(id => {
    const toggle = document.getElementById(id);
    if (toggle) toggle.checked = state.config[id];
  });
}

// Utility: Convert to camelCase
function toCamelCase(str) {
  return str.replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
            .replace(/^(.)/, (_, c) => c.toLowerCase());
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('settingsModal').classList.remove('active');
  }
});