# Privacy Policy — Dark Mode Toggle

**Last updated: June 5, 2026**

## Overview

Dark Mode Toggle is a browser extension that applies dark mode to websites using a CSS visual filter. This policy explains what data the extension does and does not collect.

## Data Collection

**Dark Mode Toggle collects no user data.**

The extension does not collect, store, transmit, or share any personal information, browsing history, page content, or any other user data.

## Local Storage

The extension stores one piece of information locally on your device: whether dark mode is enabled or disabled for each website you have toggled it on. This is saved as a simple on/off value keyed by website hostname (e.g. "github.com") using the browser's built-in `chrome.storage.local` API.

This data:
- Never leaves your device
- Is never transmitted to any server
- Is never accessible to the extension developer or any third party
- Can be cleared at any time by removing the extension

## Permissions

The extension requests two permissions:

- **activeTab** — used only to send a toggle message to the tab you are currently viewing. No tab content, URL history, or personal data is read.
- **storage** — used only to save your per-site dark mode preferences locally on your device.

## Third-Party Code

This extension contains no third-party code, no external scripts, and makes no network requests of any kind. All code is bundled within the extension package and is fully auditable in the [source repository](https://github.com/fraxhost/browser_extension_dark_mode).

## Changes to This Policy

If this policy changes in the future, the updated version will be posted in this repository with a revised date at the top.

## Contact

If you have any questions about this privacy policy, please open an issue in the [GitHub repository](https://github.com/fraxhost/browser_extension_dark_mode/issues).
