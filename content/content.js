(function () {
  const hostname = window.location.hostname;
  if (!hostname) return;

  chrome.storage.local.get([hostname], (result) => {
    if (result[hostname]) {
      document.documentElement.classList.add("dark-mode-active");
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== "SET_DARK_MODE") return;
    if (message.enabled) {
      document.documentElement.classList.add("dark-mode-active");
    } else {
      document.documentElement.classList.remove("dark-mode-active");
    }
    sendResponse({ ok: true });
  });
})();
