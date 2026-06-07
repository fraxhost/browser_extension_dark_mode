# Dark Mode Toggle

A minimal, privacy-focused browser extension that toggles dark mode on any website. Built with pure HTML/CSS/JS — no third-party dependencies, no data collection.

[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/dark-mode-toggle/mfhefbhlifdjmpijphhaflpffofiiiog)

---

## Why This Extension Exists

### For Everyone

Most popular dark mode extensions — the ones with millions of users — work by reading everything on the page: your emails, your banking details, the articles you read, the forms you fill out. They need to do this to recolor the page intelligently. When you install one of these extensions, you are granting a third party permanent access to everything you do in your browser. You are trusting that the developer will never sell your data, never get hacked, and never push a malicious update. That is a significant amount of trust to place in a free browser extension.

This extension does none of that. It applies a single CSS visual filter — the same kind used to turn a photo black and white — to the entire page. Your content never leaves your browser. There is nothing to collect, because nothing is read.

### For Developers

Existing third-party dark mode extensions commonly require the following permissions:

- `tabs` — access to all open tab URLs
- `webNavigation` — ability to monitor every page you visit
- `<all_urls>` host permissions — read/modify access to every website's DOM

Some go further and inject remotely-hosted scripts, meaning the extension's behavior can change at any time without a browser update — a known attack vector.

This extension uses only two permissions:

- `activeTab` — scoped to the tab you are currently on, only while the popup is open
- `storage` — to persist per-site preferences locally

Dark mode is achieved via `filter: invert(1) hue-rotate(180deg)` applied to the `<html>` element. No DOM traversal, no content scraping, no remote scripts. The content script is ~20 lines and fully auditable in seconds. The entire extension ships in under 10 files with zero npm dependencies.

---

## How It Works

Dark mode is applied using a CSS filter (`invert + hue-rotate`) on the `<html>` element. Images, videos, and iframes are double-inverted so they look natural. No page content is ever read or transmitted — it's a pure local rendering transform.

Per-site preferences are saved in `chrome.storage.local` keyed by hostname, so each website remembers its own setting independently.

**Permissions used:**

- `activeTab` — to send a message to the current tab
- `storage` — to save per-site dark mode preferences

---

## Development

To run the extension locally from source:

1. Clone this repository
2. Go to `chrome://extensions`
3. Enable **Developer Mode** (toggle in the top-right)
4. Click **Load unpacked** and select the cloned folder

For Firefox, go to `about:debugging` → **This Firefox** → **Load Temporary Add-on** → select `manifest.json`.

---

## File Structure

```text
browser_extension_dark_mode/
├── manifest.json          # MV3 manifest, works on Chrome and Firefox
├── popup/
│   ├── popup.html         # Toolbar popup UI
│   ├── popup.css          # Popup styles (respects prefers-color-scheme)
│   └── popup.js           # Toggle logic and storage reads/writes
├── content/
│   ├── content.js         # Injected into every page at document_start
│   └── dark-mode.css      # The CSS filter that applies dark mode
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```
