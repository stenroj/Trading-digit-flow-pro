const APP_URL = "https://stenroj.github.io/Trading-digit-flow-pro/";

chrome.action.onClicked.addListener(async () => {
  const url = (await chrome.storage.local.get("appUrl")).appUrl || APP_URL;
  chrome.tabs.create({ url });
});