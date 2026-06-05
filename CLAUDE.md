# CLAUDE.md — Dark Mode Toggle Extension

## Project Overview
A Manifest V3 browser extension that toggles dark mode per site. No build tools, no npm, no dependencies. Pure HTML/CSS/JS. Works on Chrome and Firefox from the same codebase.

## Architecture

**No background service worker.** The popup handles all orchestration directly via `chrome.tabs` and `chrome.storage` — both are accessible from popup context without a worker intermediary.

**Dark mode mechanism:** `filter: invert(1) hue-rotate(180deg)` on `<html class="dark-mode-active">`. Media elements (img, video, iframe, canvas) are double-inverted to restore natural appearance. Zero DOM reading involved.

**State:** `chrome.storage.local` keyed by hostname (`window.location.hostname`). Boolean value per key. Default is `false` (off) when key is absent.

**Message flow:**
```
popup.js → chrome.tabs.sendMessage → content.js listener → toggles class on <html>
```
On page load, `content.js` reads storage at `document_start` and applies the class before rendering begins (no flash of light).

## File Roles

| File | Role |
|---|---|
| `manifest.json` | MV3 manifest. Permissions: `activeTab`, `storage`. Content script injected at `document_start` on `<all_urls>`. |
| `content/content.js` | Runs on every page. Reads storage on load, registers message listener for live toggling. |
| `content/dark-mode.css` | Pre-registered by browser, inactive until `.dark-mode-active` class is on `<html>`. |
| `popup/popup.js` | Queries active tab, reads/writes storage, sends message to content script, updates UI. |
| `popup/popup.html` | Popup shell. No inline scripts (MV3 CSP blocks them). |
| `popup/popup.css` | Popup styles. Uses `prefers-color-scheme` for light/dark popup theming. |
| `icons/` | PNG icons at 16, 32, 48, 128px. Generated with Pillow. |

## Key Constraints

- **No npm, no build step.** All files are loaded directly by the browser.
- **No third-party scripts.** All JS is local and auditable.
- **Minimal permissions.** Never request `tabs`, `webNavigation`, or host permissions beyond what's declared in `content_scripts`.
- **`chrome.*` namespace only.** Firefox aliases `chrome` to `browser` for MV3, so using `chrome.*` works on both without branching.
- **Error handling for `sendMessage`:** Always check `chrome.runtime.lastError` in the callback to suppress "receiving end does not exist" errors (e.g. on chrome:// pages, PDFs).

## Firefox Compatibility
The `browser_specific_settings.gecko` block in `manifest.json` makes the same zip valid for Firefox submission. No code changes needed between the two stores.

## Testing Checklist
1. Load unpacked in `chrome://extensions`
2. Open any http/https page → enable dark mode → verify filter applies
3. Reload page → verify dark mode persists with no flash
4. Disable dark mode → verify it turns off and that preference is saved
5. Navigate to a different site → verify dark mode is NOT active
6. Return to original site → verify dark mode is still ON
7. Open a `chrome://` page → popup should show "Not available on this page"

## Packaging for Store Submission
```bash
zip -r ../dark-mode-toggle.zip . --exclude "*.DS_Store" --exclude "__MACOSX/*"
```
Same zip works for both Chrome Web Store and Firefox AMO. See README.md for full submission steps.
