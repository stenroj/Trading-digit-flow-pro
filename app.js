// ============================================================================
// Digit Flow Pro - Live Deriv Trading Dashboard
// ============================================================================

const CONFIG = {
  DERIV_WS: 'wss://ws.derivws.com/websockets/v3?app_id=1089',
  STORAGE_KEYS: {
    TOKEN: 'derivToken',
    MODE: 'useReal',
    SYMBOL: 'symbol',
    APP_URL: 'appUrl'
  },
  SYMBOLS: {
    1: 'R_50',      // Digits Over/Under (1s)
    2: 'MATCH_50',  // Digits Match/Differ (1s)
    3: 'ODD_50',    // Digits Even/Odd (1s)
    4: 'FRXAUDCAD', // Rise/Fall (1s)
    5: 'EURUSD'     // High/Low (1s)
  }
};

let state = {
  token: '',
  isReal: false,
  symbol: 1,
  ws: null,
  ticks: [],
  analysis: {
    overUnder: { over: 0, under: 0, last: '' },
    matchDiffer: { match: 0, differ: 0, last: '' },
    evenOdd: { even: 0, odd: 0, last: '' },
    digitFreq: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }
  },
  chart: null,
  isConnected: false,
  tickCount: 0,
  lastTickTime: Date.now()
};

const $ = (id) => document.getElementById(id);

// ============================================================================
// INITIALIZATION
// ============================================================================

async function init() {
  setupEventListeners();
  await loadStorage();
  initChart();
}

async function loadStorage() {
  const data = await chrome.storage.local.get([
    CONFIG.STORAGE_KEYS.TOKEN,
    CONFIG.STORAGE_KEYS.MODE,
    CONFIG.STORAGE_KEYS.SYMBOL
  ]);

  state.token = data[CONFIG.STORAGE_KEYS.TOKEN] || '';
  state.isReal = data[CONFIG.STORAGE_KEYS.MODE] || false;
  state.symbol = data[CONFIG.STORAGE_KEYS.SYMBOL] || 1;

  updateStatusPill();
  $('symbolSelect').value = state.symbol;

  if (state.token) {
    connect();
  }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
  // Settings modal
  $('settingsBtn').addEventListener('click', openSettings);
  $('closeSettings').addEventListener('click', closeSettings);
  $('settingsModal').addEventListener('click', (e) => {
    if (e.target === $('settingsModal')) closeSettings();
  });

  // Token management
  $('toggleToken').addEventListener('click', toggleTokenVisibility);
  $('validateBtn').addEventListener('click', validateAndSaveToken);
  $('disconnectBtn').addEventListener('click', disconnectToken);

  // Settings
  $('realModeToggle').addEventListener('change', toggleRealMode);
  $('symbolSelect').addEventListener('change', changeSymbol);
}

function openSettings() {
  $('settingsModal').classList.remove('hidden');
  loadTokenStatus();
}

function closeSettings() {
  $('settingsModal').classList.add('hidden');
}

function toggleTokenVisibility() {
  const input = $('tokenInput');
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  $('toggleToken').textContent = isPassword ? 'Hide' : 'Show';
}

async function validateAndSaveToken() {
  const token = $('tokenInput').value.trim();
  const statusEl = $('tokenStatus');

  if (!TOKEN_RE.test(token)) {
    setStatus(statusEl, 'Token must be 8–64 chars (letters, digits, _ or -).', 'err');
    return;
  }

  setStatus(statusEl, 'Validating with Deriv…', '');

  const result = await validateToken(token);

  if (!result.ok) {
    setStatus(statusEl, result.err || 'Validation failed.', 'err');
    return;
  }

  await chrome.storage.local.set({
    [CONFIG.STORAGE_KEYS.TOKEN]: token
  });

  state.token = token;
  $('tokenInput').value = '';
  loadTokenStatus();
  setStatus(statusEl, 'Token validated and saved securely.', 'ok');
  updateStatusPill();

  // Connect to Deriv
  if (state.ws) state.ws.close();
  connect();
}

async function disconnectToken() {
  await chrome.storage.local.set({
    [CONFIG.STORAGE_KEYS.TOKEN]: '',
    [CONFIG.STORAGE_KEYS.MODE]: false
  });

  state.token = '';
  state.isReal = false;
  $('tokenInput').value = '';

  if (state.ws) {
    state.ws.close();
    state.ws = null;
  }

  loadTokenStatus();
  updateStatusPill();
  resetAnalysis();
  setStatus($('tokenStatus'), 'Disconnected. Switched back to simulation.', 'ok');
}

async function toggleRealMode() {
  const isChecked = $('realModeToggle').checked;

  if (isChecked && !state.token) {
    $('realModeToggle').checked = false;
    return;
  }

  await chrome.storage.local.set({
    [CONFIG.STORAGE_KEYS.MODE]: isChecked
  });

  state.isReal = isChecked;
  updateStatusPill();
  setStatus(
    $('settingsMsg'),
    isChecked ? 'Real trading enabled.' : 'Switched to simulation.',
    'ok'
  );
}

async function changeSymbol() {
  const symbol = parseInt($('symbolSelect').value);

  await chrome.storage.local.set({
    [CONFIG.STORAGE_KEYS.SYMBOL]: symbol
  });

  state.symbol = symbol;
  resetAnalysis();

  if (state.ws && state.isConnected) {
    state.ws.close();
    connect();
  }
}

function loadTokenStatus() {
  const tokenMask = maskToken(state.token);
  $('tokenInput').placeholder = 'Paste your Deriv API token';

  const realToggle = $('realModeToggle');
  realToggle.disabled = !state.token;
  realToggle.checked = state.isReal && !!state.token;

  $('tokenStatus').textContent = tokenMask;
  if (state.token) {
    $('tokenStatus').className = 'token-status ok';
  }
}

function maskToken(token) {
  if (!token) return 'No token saved.';
  const last = token.slice(-4);
  return `Saved: ••••${last}`;
}

function setStatus(el, text, kind) {
  el.textContent = text;
  el.className = `${el.id.includes('msg') ? 'message' : 'token-status'} ${kind || ''}`;
}

// ============================================================================
// TOKEN VALIDATION
// ============================================================================

const TOKEN_RE = /^[A-Za-z0-9_\-]{8,64}$/;

async function validateToken(token) {
  return new Promise((resolve) => {
    let done = false;

    const finish = (ok, err) => {
      if (done) return;
      done = true;
      try {
        ws.close();
      } catch {}
      resolve({ ok, err });
    };

    const ws = new WebSocket(CONFIG.DERIV_WS);
    const timeout = setTimeout(() => finish(false, 'Timeout contacting Deriv'), 12000);

    ws.onopen = () => ws.send(JSON.stringify({ authorize: token }));

    ws.onerror = () => {
      clearTimeout(timeout);
      finish(false, 'Network error');
    };

    ws.onmessage = (ev) => {
      clearTimeout(timeout);

      try {
        const data = JSON.parse(ev.data);

        if (data.error) {
          return finish(false, data.error.message || 'Invalid token');
        }

        if (data.authorize) {
          return finish(true, null);
        }

        finish(false, 'Unexpected response');
      } catch {
        finish(false, 'Bad response');
      }
    };
  });
}

// ============================================================================
// DERIV CONNECTION
// ============================================================================

function connect() {
  if (state.ws) state.ws.close();

  state.ws = new WebSocket(CONFIG.DERIV_WS);

  state.ws.onopen = () => {
    console.log('WebSocket connected');

    // Authorize
    if (state.token) {
      state.ws.send(JSON.stringify({ authorize: state.token }));
    } else {
      // Anonymous mode for simulation
      state.ws.send(JSON.stringify({ authorize: '' }));
    }

    // Subscribe to ticks after authorization
    setTimeout(() => subscribeToTicks(), 1000);
  };

  state.ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      handleMessage(data);
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };

  state.ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    setStreamStatus('disconnected');
    updateStatusPill();
  };

  state.ws.onclose = () => {
    console.log('WebSocket disconnected');
    state.isConnected = false;
    setStreamStatus('disconnected');
    updateStatusPill();

    // Attempt reconnect after 5 seconds
    setTimeout(() => {
      if (state.token || state.ticks.length > 0) {
        connect();
      }
    }, 5000);
  };
}

function subscribeToTicks() {
  if (!state.ws || state.ws.readyState !== WebSocket.OPEN) return;

  const symbol = CONFIG.SYMBOLS[state.symbol] || 'R_50';

  state.ws.send(
    JSON.stringify({
      ticks: symbol,
      subscribe: 1
    })
  );
}

function handleMessage(data) {
  // Handle authorization
  if (data.authorize) {
    console.log('Authorized successfully');
    state.isConnected = true;
    setStreamStatus('connected');
    updateStatusPill();
    return;
  }

  // Handle tick data
  if (data.tick) {
    processTick(data.tick);
    return;
  }

  // Handle errors
  if (data.error) {
    console.error('Deriv error:', data.error);
    setStreamStatus('disconnected');
    return;
  }
}

function processTick(tick) {
  const quote = tick.quote;
  const digit = String(Math.floor(quote * 10) % 10);

  // Store tick
  state.ticks.push({
    value: quote,
    digit: digit,
    timestamp: tick.epoch * 1000
  });

  // Keep last 60 ticks
  if (state.ticks.length > 60) {
    state.ticks.shift();
  }

  // Analyze
  analyzeTick(digit);

  // Update UI
  updateTickerDisplay(quote, digit);
  updateChartDisplay();
  updateAnalysisUI();
  updateTable();

  state.tickCount++;
  updateTicksPerMin();
}

// ============================================================================
// ANALYSIS
// ============================================================================

function analyzeTick(digit) {
  const d = parseInt(digit);

  // Over/Under (5 is threshold)
  if (d > 5) {
    state.analysis.overUnder.over++;
    state.analysis.overUnder.last = 'Over';
  } else if (d < 5) {
    state.analysis.overUnder.under++;
    state.analysis.overUnder.last = 'Under';
  } else {
    state.analysis.overUnder.last = 'Equal';
  }

  // Match/Differ (compare with previous)
  if (state.ticks.length >= 2) {
    const prev = parseInt(state.ticks[state.ticks.length - 2].digit);
    if (d === prev) {
      state.analysis.matchDiffer.match++;
      state.analysis.matchDiffer.last = 'Match';
    } else {
      state.analysis.matchDiffer.differ++;
      state.analysis.matchDiffer.last = 'Differ';
    }
  }

  // Even/Odd
  if (d % 2 === 0) {
    state.analysis.evenOdd.even++;
    state.analysis.evenOdd.last = 'Even';
  } else {
    state.analysis.evenOdd.odd++;
    state.analysis.evenOdd.last = 'Odd';
  }

  // Digit frequency
  state.analysis.digitFreq[d]++;
}

function resetAnalysis() {
  state.ticks = [];
  state.analysis = {
    overUnder: { over: 0, under: 0, last: '' },
    matchDiffer: { match: 0, differ: 0, last: '' },
    evenOdd: { even: 0, odd: 0, last: '' },
    digitFreq: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }
  };
  state.tickCount = 0;
  updateAnalysisUI();
  updateChartDisplay();
  updateTable();
}

// ============================================================================
// UI UPDATES
// ============================================================================

function updateTickerDisplay(quote, digit) {
  $('currentTick').textContent = quote.toFixed(4);
  $('tickTime').textContent = new Date().toLocaleTimeString();

  // Trend (compare with previous)
  const trend = $('trend');
  if (state.ticks.length >= 2) {
    const prev = state.ticks[state.ticks.length - 2].value;
    if (quote > prev) {
      trend.textContent = '↑ UP';
      trend.className = 'ticker-value trend-up';
    } else if (quote < prev) {
      trend.textContent = '↓ DOWN';
      trend.className = 'ticker-value trend-down';
    } else {
      trend.textContent = '→ FLAT';
      trend.className = 'ticker-value trend-neutral';
    }
  }
}

function updateTicksPerMin() {
  const now = Date.now();
  const elapsed = (now - state.lastTickTime) / 1000 / 60; // minutes

  if (elapsed > 0) {
    const rate = Math.round(state.tickCount / elapsed);
    $('ticksPerMin').textContent = rate;
  }

  if (now - state.lastTickTime > 60000) {
    state.tickCount = 0;
    state.lastTickTime = now;
  }
}

function setStreamStatus(status) {
  const el = $('streamStatus');
  el.textContent = '●';
  if (status === 'connected') {
    el.className = 'ticker-value status-connected';
  } else {
    el.className = 'ticker-value status-disconnected';
  }
}

function updateStatusPill() {
  const pill = $('statusPill');
  if (state.isReal && state.token && state.isConnected) {
    pill.textContent = 'LIVE';
    pill.className = 'status-pill live';
  } else {
    pill.textContent = 'SIMULATION';
    pill.className = 'status-pill simulation';
  }
}

function updateAnalysisUI() {
  const ou = state.analysis.overUnder;
  const md = state.analysis.matchDiffer;
  const eo = state.analysis.evenOdd;
  const df = state.analysis.digitFreq;

  // Over/Under
  const ouTotal = ou.over + ou.under;
  $('overCount').textContent = ou.over;
  $('underCount').textContent = ou.under;
  $('overBar').style.width = ouTotal > 0 ? `${(ou.over / ouTotal) * 100}%` : '0%';
  $('underBar').style.width = ouTotal > 0 ? `${(ou.under / ouTotal) * 100}%` : '0%';
  $('overUnderLast').textContent = ou.last || '—';

  // Match/Differ
  const mdTotal = md.match + md.differ;
  $('matchCount').textContent = md.match;
  $('differCount').textContent = md.differ;
  $('matchBar').style.width = mdTotal > 0 ? `${(md.match / mdTotal) * 100}%` : '0%';
  $('differBar').style.width = mdTotal > 0 ? `${(md.differ / mdTotal) * 100}%` : '0%';
  $('matchDiffLast').textContent = md.last || '—';

  // Even/Odd
  const eoTotal = eo.even + eo.odd;
  $('evenCount').textContent = eo.even;
  $('oddCount').textContent = eo.odd;
  $('evenBar').style.width = eoTotal > 0 ? `${(eo.even / eoTotal) * 100}%` : '0%';
  $('oddBar').style.width = eoTotal > 0 ? `${(eo.odd / eoTotal) * 100}%` : '0%';
  $('evenOddLast').textContent = eo.last || '—';

  // Digit frequency
  const maxFreq = Math.max(...Object.values(df));
  const digitBoxes = document.querySelectorAll('.digit-box');

  digitBoxes.forEach((box, i) => {
    const count = df[i];
    const countEl = box.querySelector('.digit-count');
    countEl.textContent = count;

    // Color intensity based on frequency
    if (maxFreq > 0) {
      const intensity = count / maxFreq;
      const hue = 210; // Blue hue
      const saturation = 50 + intensity * 50;
      const lightness = 40 - intensity * 20;
      box.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      box.style.borderColor = `hsl(${hue}, ${saturation}%, ${lightness + 10}%)`;
    }
  });
}

function updateTable() {
  const tbody = $('ticksTableBody');

  if (state.ticks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">Waiting for ticks...</td></tr>';
    return;
  }

  const last10 = state.ticks.slice(-10).reverse();

  tbody.innerHTML = last10
    .map((tick, i) => {
      const ou = tick.value > 5 ? 'Over' : tick.value < 5 ? 'Under' : 'Eq';
      const eo = parseInt(tick.digit) % 2 === 0 ? 'Even' : 'Odd';

      let md = '—';
      if (i < last10.length - 1) {
        md = last10[i + 1].digit === tick.digit ? 'Match' : 'Differ';
      }

      const time = new Date(tick.timestamp).toLocaleTimeString();

      return `
        <tr>
          <td>${state.ticks.length - i}</td>
          <td><strong>${tick.value.toFixed(4)}</strong></td>
          <td>${ou}</td>
          <td>${md}</td>
          <td>${eo}</td>
          <td>${time}</td>
        </tr>
      `;
    })
    .join('');
}

// ============================================================================
// CHART
// ============================================================================

function initChart() {
  const ctx = $('tickChart').getContext('2d');

  state.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Tick Value',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#8a97ad',
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(18, 24, 38, 0.9)',
          titleColor: '#e6edf7',
          bodyColor: '#e6edf7',
          borderColor: '#243049',
          borderWidth: 1,
          padding: 10,
          displayColors: true
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: '#243049', drawBorder: false },
          ticks: { color: '#8a97ad', font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#8a97ad', font: { size: 11 }, maxTicksLimit: 10 }
        }
      }
    }
  });
}

function updateChartDisplay() {
  if (!state.chart || state.ticks.length === 0) return;

  const lastN = Math.min(60, state.ticks.length);
  const ticksSlice = state.ticks.slice(-lastN);

  state.chart.data.labels = ticksSlice.map((t, i) => `T${i + 1}`);
  state.chart.data.datasets[0].data = ticksSlice.map((t) => t.value);
  state.chart.update('none');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', init);
