// Helper function to inject the content script into the active tab
function injectContentScript(tabId) {
  console.log("Injecting from extension", tabId)
  chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"]
  });
}

// Listen for tab switching or focus changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url && tab.url.startsWith("http")) {
      injectContentScript(activeInfo.tabId);
  }
});

// Listen for tab updates (e.g., when the page is reloaded)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
      injectContentScript(tabId);
  }
});
