/* global chrome */

console.log("Postbuddy script is running...");

async function syncToken() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["websiteToken"], function (result) {
      if (chrome.runtime.lastError) {
        console.log(
          "Error retrieving token from Chrome storage:",
          chrome.runtime.lastError
        );
        resolve(null);
      } else {
        console.log(
          "🔹 Retrieved token from Chrome storage:",
          result.websiteToken
        );
        resolve(result.websiteToken || null);
      }
    });
  });
}

(async () => {
  try {
    const extToken = await syncToken();
    const webToken = localStorage.getItem("token");

    if ((!webToken || webToken === "undefined") && extToken) {
      console.log("🔹 Condition met, setting token in localStorage");
      localStorage.setItem("token", extToken);
      chrome.storage.sync.remove("websiteToken");
    }
  } catch (error) {
    console.error("Error in content script:", error);
  }
})();
