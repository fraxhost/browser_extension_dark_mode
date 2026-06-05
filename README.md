# Dark Mode Toggle

A minimal, privacy-focused browser extension that toggles dark mode on any website. Built with pure HTML/CSS/JS — no third-party dependencies, no data collection.

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

## Load Locally (Development)

**Chrome / Brave / Edge:**
1. Go to `chrome://extensions`
2. Enable **Developer Mode** (toggle in the top-right)
3. Click **Load unpacked**
4. Select this folder

**Firefox:**
1. Go to `about:debugging` → **This Firefox**
2. Click **Load Temporary Add-on**
3. Select `manifest.json` inside this folder

> Firefox temporary add-ons are removed when the browser closes. For a permanent install, publish to the Firefox Add-ons store (see below).

---

## Publishing to the Chrome Web Store

### 1. Register as a Developer
- Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- Sign in with a Google account
- Pay the **one-time $5 registration fee**

### 2. Prepare Assets
Before uploading, prepare the following:

| Asset | Size | Required |
|---|---|---|
| Store icon | 128×128 PNG | Yes |
| Small promo tile | 440×280 PNG | Yes |
| Screenshot(s) | 1280×800 or 640×400 PNG | At least 1 |
| Large promo tile | 920×680 PNG | No |
| Marquee banner | 1400×560 PNG | No |

### 3. Package the Extension
The zip must only contain the files the browser runs. The `assets/`, `README.md`, and `CLAUDE.md` are repo-only files and must be excluded. Upload the store assets separately through the dashboard UI (see step 4).

```bash
cd browser_extension_dark_mode
zip -r ../dark-mode-toggle.zip manifest.json popup/ content/ icons/ --exclude "*.DS_Store"
```

The zip will contain exactly:

```text
manifest.json
popup/popup.html
popup/popup.css
popup/popup.js
content/content.js
content/dark-mode.css
icons/icon16.png
icons/icon32.png
icons/icon48.png
icons/icon128.png
```

### 4. Submit
1. In the Developer Dashboard, click **New Item**
2. Upload `dark-mode-toggle.zip`
3. Fill in the listing:
   - **Name:** Dark Mode Toggle
   - **Category:** Accessibility (or Productivity)
   - **Description:** explain it's privacy-focused and uses no third-party code
   - Upload your screenshots and promo tile
4. Under **Privacy**, state that no user data is collected
5. Set **Visibility** to Public (or Unlisted if you only want to share via link)
6. Click **Submit for Review**

### 5. Review Timeline
Google manually reviews new submissions — typically **3–7 business days**. The minimal permissions (`activeTab`, `storage`) and no remote code make approval straightforward. You'll get an email when it's approved or if changes are requested.

---

## Publishing to the Firefox Add-ons Store (AMO)

### 1. Create an Account
- Sign up at [addons.mozilla.org](https://addons.mozilla.org/developers/)
- No registration fee — Firefox add-on publishing is free

### 2. Prepare Assets
| Asset | Size | Required |
|---|---|---|
| Extension icon | 128×128 PNG | Recommended |
| Screenshot(s) | Any reasonable size | Recommended |

### 3. Package the Extension
Use the same zip as Chrome — the manifest already contains `browser_specific_settings.gecko` for Firefox compatibility. Exclude repo-only files the same way:

```bash
cd browser_extension_dark_mode
zip -r ../dark-mode-toggle-firefox.zip manifest.json popup/ content/ icons/ --exclude "*.DS_Store"
```

### 4. Submit
1. Go to [Submit a New Add-on](https://addons.mozilla.org/developers/addon/submit/agreement)
2. Choose **On this site** (listed publicly) or **On your own** (self-distributed)
3. Upload the zip
4. Fill in the listing details and screenshots
5. Submit for review

### 5. Review Timeline
Firefox add-ons go through automated checks first (instant), then manual human review which can take **a few days to a few weeks** depending on queue length. Extensions with minimal permissions are generally reviewed faster.

### Firefox-Specific Notes
- The `browser_specific_settings.gecko` block in `manifest.json` is required for Firefox and is already included
- Firefox supports both `chrome.*` and `browser.*` API namespaces — this extension uses `chrome.*` which works on both browsers

---

## File Structure

```
browser_extension_dark_mode/
├── manifest.json          # Extension manifest (MV3, works on Chrome + Firefox)
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
