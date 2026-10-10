chrome.runtime.onInstalled.addListener(() => {
  console.log('PricePilot Extension Installed');
  // Setup default settings
  chrome.storage.local.set({ targetCurrency: 'USD' });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkPrices') {
    console.log('Checking prices alarm triggered');
    // Future implementation: check prices for tracked items
  }
});
