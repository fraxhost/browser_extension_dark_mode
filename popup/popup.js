document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-btn");
  const siteLabel = document.getElementById("site-label");
  const statusEl = document.getElementById("status");

  function updateUI(enabled) {
    toggleBtn.textContent = enabled ? "Disable Dark Mode" : "Enable Dark Mode";
    toggleBtn.className = "btn" + (enabled ? " btn--on" : "");
    statusEl.textContent = enabled ? "Dark mode is ON" : "Dark mode is OFF";
    statusEl.className = "status" + (enabled ? " status--on" : "");
  }

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab || !tab.url || !tab.url.startsWith("http")) {
      siteLabel.textContent = "Not available on this page";
      statusEl.textContent = "";
      return;
    }

    const hostname = new URL(tab.url).hostname;
    siteLabel.textContent = hostname;

    chrome.storage.local.get([hostname], (result) => {
      let isEnabled = result[hostname] ?? false;
      updateUI(isEnabled);
      toggleBtn.disabled = false;

      toggleBtn.addEventListener("click", () => {
        isEnabled = !isEnabled;
        chrome.storage.local.set({ [hostname]: isEnabled });
        chrome.tabs.sendMessage(
          tab.id,
          { type: "SET_DARK_MODE", enabled: isEnabled },
          () => { void chrome.runtime.lastError; }
        );
        updateUI(isEnabled);
      });
    });
  });
});
