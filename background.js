// ============================================================================
// Digit Flow Pro - Background Service Worker
// ============================================================================

const APP_URL = "https://stenroj.github.io/Trading-digit-flow-pro/";
const STORAGE_KEYS = {
  TOKEN: 'derivToken',
  MODE: 'useReal',
  SYMBOL: 'symbol',
  APP_URL: 'appUrl'
};

// Open dashboard in new tab when extension icon is clicked
chrome.action.onClicked.addListener(async () => {
  const url = (await chrome.storage.local.get(STORAGE_KEYS.APP_URL))[STORAGE_KEYS.APP_URL] || APP_URL;
  
  // Check if dashboard tab already exists
  const tabs = await chrome.tabs.query({ url: url + '*' });
  
  if (tabs.length > 0) {
    // Focus existing tab
    chrome.tabs.update(tabs[0].id, { active: true });
    chrome.windows.update(tabs[0].windowId, { focused: true });
  } else {
    // Create new tab
    chrome.tabs.create({ url });
  }
});

// Initialize storage with default values
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get([
    STORAGE_KEYS.TOKEN,
    STORAGE_KEYS.MODE,
    STORAGE_KEYS.SYMBOL,
    STORAGE_KEYS.APP_URL
  ]);

  if (!data[STORAGE_KEYS.TOKEN]) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.TOKEN]: '',
      [STORAGE_KEYS.MODE]: false,
      [STORAGE_KEYS.SYMBOL]: 1,
      [STORAGE_KEYS.APP_URL]: APP_URL
    });
  }

  console.log('Digit Flow Pro initialized');
});

// Listen for messages from dashboard
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getToken') {
    chrome.storage.local.get(STORAGE_KEYS.TOKEN, (data) => {
      sendResponse({ token: data[STORAGE_KEYS.TOKEN] });
    });
    return true; // Will respond asynchronously
  }

  if (request.action === 'saveToken') {
    chrome.storage.local.set({
      [STORAGE_KEYS.TOKEN]: request.token
    });
    sendResponse({ success: true });
    return true;
  }

  if (request.action === 'clearToken') {
    chrome.storage.local.set({
      [STORAGE_KEYS.TOKEN]: '',
      [STORAGE_KEYS.MODE]: false
    });
    sendResponse({ success: true });
    return true;
  }
});

// Keep service worker alive (optional)
chrome.alarms.create('keepAlive', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('Service worker keep-alive ping');
  }
});
