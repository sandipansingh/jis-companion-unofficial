# JIS Companion (Unofficial)

Modern, unofficial student companion app, built with **Expo + React Native + TypeScript**.

It provides quick access to common student workflows like academics, fees, library, profile, feedback, virtual labs, and more—inside a mobile-first experience.

> This project is independent and **not officially affiliated with or endorsed by JIS**.

---

## Features

- Expo Router based navigation and screen structure
- Mobile + Web support from one codebase
- TypeScript-first architecture
- Tailwind (NativeWind) based styling
- Local/offline-friendly foundations (SQLite + sync services)
- Production/release helper scripts for Android and Web

---

## Tech Stack

- **App Framework:** Expo SDK 54, React Native 0.81
- **Language:** TypeScript
- **Routing:** `expo-router`
- **State:** Zustand
- **Networking:** Axios
- **Storage/Security:** Expo Secure Store, AsyncStorage, SQLite
- **UI/Styling:** NativeWind + Tailwind CSS
- **Build/Delivery:** EAS Build + custom release scripts

---

## Requirements

- **Node.js:** `>=22.0.0` (from `package.json` engines)
- **npm**
- **Java:** `17` (required for Android build scripts)
- **Expo tooling** (installed through project dependencies)
- For Android native builds: Android SDK + emulator/device
- For cloud builds/submission: Expo account + EAS login

---

## Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Start Expo (choose Android/iOS/Web from terminal menu)
npx expo start
```

Common alternatives:

```bash
# Open web directly
npm run web

# Run native Android app (requires Android setup)
npm run android

# Run native iOS app (macOS + Xcode required)
npm run ios
```

---

## Script Guide (What to run, when, and sequence)

This section maps every script in `package.json` to practical usage.

### 1) Daily development flow

**Use this sequence while building features:**

```bash
npm install
npx expo start
npm run typecheck
```

When to run:
- `npm install`: first setup or after dependency changes
- `npx expo start`: active development server
- `npm run typecheck`: before pushing/merging changes

---

### 2) Run app on specific platform

- `npm run android` → builds/runs Android native app locally via Expo
- `npm run ios` → builds/runs iOS native app locally (macOS only)
- `npm run web` → launches web target quickly

Use these when you need platform-specific verification beyond Expo start menu.

---

### 3) Type safety gate

- `npm run typecheck`

Runs TypeScript with `tsconfig.typecheck.json`.

Recommended usage:
- Before commits
- Before creating release builds
- Before opening PRs

---

### 4) Android build scripts (dev vs prod, local vs cloud)

> Android build scripts require **Java 17**.

#### Development APK

- **Local build:**
	- `npm run build:android:dev:local`
	- Creates APK locally using EAS Local Build
	- Moves resulting `.apk` to `builds/`

- **Cloud build:**
	- `npm run build:android:dev:cloud`
	- Starts development Android build in EAS Cloud

Use development builds for QA/internal testing.

#### Production Android

- **Cloud build (recommended for release):**
	- `npm run build:android:prod:cloud`

- **Local production build:**
	- `npm run build:android:prod:local`
	- Produces `.aab` and moves it to `builds/`

Use production builds for Play Store release artifacts.

---

### 5) Submit Android release

- `npm run submit:android`

Runs `scripts/submit-android.mjs`.

Use this after a successful production build when you are ready to submit to Play Console (or submission pipeline configured in your script).

---

### 6) Web build scripts

- `npm run build:web:cloud`
	- Cleans `dist`
	- Exports Expo web build
	- Generates service worker

- `npm run build:web:local`
	- Does everything above
	- Also creates a versioned zip in `dist/` (named from `package.json` version)

Use local web build when you need a deployable zip artifact.

---

### 7) Versioning scripts

- `npm run version:patch` → e.g., `1.5.0` → `1.5.1`
- `npm run version:minor` → e.g., `1.5.0` → `1.6.0`
- `npm run version:major` → e.g., `1.5.0` → `2.0.0`

These call `scripts/bump-version.mjs`.

Use these before creating formal releases.

---

### 8) One-command release helpers

- `npm run release:patch`
- `npm run release:minor`
- `npm run release:major`

These call `scripts/release.mjs` and are intended as guided release automation wrappers.

Use when you want your release workflow handled in one command for the selected semver bump.

---

## Recommended sequences by scenario

### A) Regular feature work

```bash
npm install
npx expo start
npm run typecheck
```

### B) Internal Android QA build

```bash
npm run typecheck
npm run build:android:dev:local
```

Or replace with `build:android:dev:cloud` for cloud build.

### C) Production Android release (safe order)

```bash
npm run typecheck
npm run version:patch   # or version:minor / version:major
npm run build:android:prod:cloud
npm run submit:android
```

### D) Production web artifact

```bash
npm run typecheck
npm run build:web:local
```

---

## Project Structure (high-level)

- `src/app` → Expo Router routes/screens
- `src/features` → feature modules (auth, academics, fees, library, etc.)
- `src/components` → shared UI components
- `src/services` → data, sync, and network services
- `scripts` → build/release automation scripts

---

## Disclaimer

This application is an unofficial project created for utility and learning purposes. It is not an official JIS product.

---

## License

MIT
