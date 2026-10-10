import { extractAmazon } from './adapters/amazon.js';

function extractProductDetails() {
  const url = window.location.href;
  const domain = window.location.hostname;
  
  let details = {};

  if (domain.includes('amazon.com') || domain.includes('amazon.in')) {
    details = extractAmazon(document);
    details.domain = domain.includes('amazon.in') ? 'amazon.in' : 'amazon.com';
  }

  // Generic fallback if adapter fails or not supported
  if (!details.title) {
    let title = document.querySelector('title')?.innerText || '';
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
    if (ogTitle) title = ogTitle;
    details.title = title;
  }

  if (!details.price) {
    const priceEl = document.querySelector('[class*="price"], [id*="price"]');
    details.price = priceEl ? priceEl.innerText.trim() : 'Unknown';
  }

  if (!details.image) {
    details.image = document.querySelector('meta[property="og:image"]')?.content || null;
  }

  return {
    ...details,
    url,
    domain: details.domain || domain,
    timestamp: new Date().toISOString()
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_PRODUCT_DETAILS') {
    const details = extractProductDetails();
    sendResponse(details);
  }
  return true;
});
