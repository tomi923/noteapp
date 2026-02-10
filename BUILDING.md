# Building APK and EXE packages

This project is a minimal PWA. To generate native installers, use a wrapper tool that packages a PWA.

## Recommended: PWABuilder (APK + Windows)
PWABuilder can package the existing PWA into Android and Windows installers without changing the code.

### What you need installed
- Node.js 18+
- Java 17+ (for Android builds)
- Android Studio + Android SDK (for APK builds)
- Windows build tools (for Windows packages)

### Steps
1. Run a local server:
   ```bash
   python -m http.server 4173
   ```
2. Open PWABuilder and point it to `http://127.0.0.1:4173/`.
3. Generate:
   - **Android**: choose APK/AAB and follow signing prompts.
   - **Windows**: choose Windows (MSIX) and follow signing prompts.

PWABuilder uses the existing `manifest.json`, `sw.js`, and icons in this repo.

## Alternative: Tauri (Windows) + Capacitor (Android)
If you prefer local CLI-based builds:

### Windows (Tauri)
- Use Tauri to wrap the PWA into a Windows installer.
- Requires Rust + Node.js.

### Android (Capacitor)
- Use Capacitor to wrap the PWA into an Android app.
- Requires Node.js + Android Studio.

These options need extra scaffolding (not included yet). PWABuilder is the quickest path.
