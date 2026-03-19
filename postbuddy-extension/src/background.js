/*global chrome */
import { FRONTEND_URL } from './api/BASEURL.js'
chrome.runtime.onInstalled.addListener(() => {
  console.log("PostBuddy Extension Installed.");
  chrome.storage.sync.set({
    enabledPlatforms: ["linkedin", "youtube", "facebook", "instagram", "twitter", "whatsapp"]
  });
});

chrome.runtime.onMessage.addListener((value, sendResponse) => {

})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openPostBuddy") {
    chrome.tabs.create({ url: `${FRONTEND_URL}?redirect=extension` });
  }

  if (request.action === "openPopup") {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs[0]) {
        const currentTab = tabs[0];

        // Method 1: Try with chrome.action.openPopup() (MV3)
        try {
          // This only works in background contexts
          chrome.action.openPopup();
          sendResponse({ success: true, method: "openPopup" });
        } catch (e) {
          console.error("Failed to open with action.openPopup:", e);

          try {
            // Focus on the extension itself
            chrome.tabs.create({ url: chrome.runtime.getURL("js/index.html") });
            sendResponse({ success: true, method: "tabs.create" });
          } catch (e2) {
            console.error("Failed to open extension page:", e2);
            sendResponse({ success: false, error: e2.message });
          }
        }
      }
    });

    // Required for async sendResponse
    return true;
  }
});
