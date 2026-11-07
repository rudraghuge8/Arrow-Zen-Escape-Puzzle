# Arrow Zen: Escape Puzzle 🧩

A mindful, minimalist slide-and-escape puzzle game with 500 handcrafted levels, warm paper aesthetics, calming WebAudio procedural music, and water-drop lives.

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)]()
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue)]()
[![Android](https://img.shields.io/badge/Android-Capacitor%2014+-orange)]()
[![Solvability](https://img.shields.io/badge/500%20Levels-100%25%20Verified%20Solvable-success)]()

---

## 🎮 Core Gameplay
1. **Slide Out**: Tap any arrow and it glides smoothly along its path off the board.
2. **Clear Path Required**: An arrow can escape only if the entire corridor in front of its head is completely clear.
3. **Drops (Lives)**: Tapping a blocked arrow costs 1 drop. You have 3 drops per level (plus optional Extra Drop boosters).
4. **Combos & Flow**: Clear consecutive arrows within 2.5 seconds to build combo chains with ascending musical feedback!
5. **Boosters**:
   - 💣 **Bomb**: Instantly dissolve any blocker arrow.
   - 👁️ **X-Ray**: Illuminate all arrows currently free to leave.
   - 💧 **Extra Drop**: Gain an additional drop life.
   - ↩️ **Undo**: Step back and rethink your previous move.
   - 💡 **Smart Hint**: Gently highlight a path forward.

---

## 🛠️ Tech Stack & Architecture
- **Framework**: React 19 + TypeScript on Vite.
- **Styling**: Tailwind CSS v4 with WCAG AA-compliant palettes.
- **Rendering**: Hardware-accelerated HTML5 Canvas with decoupled 60fps simulation and offscreen static layer caching.
- **Audio Engine**: WebAudio API lookahead music sequencer (Music Box, Kalimba, Lo-Fi, Celestial Harp) + synthesized 16-bit PCM sound effects.
- **Offline & PWA**: Service Worker caching, Web App Manifest, install prompts, and 100% offline gameplay.
- **Mobile**: Capacitor Android wrapper with hardware back button routing, haptics, and status bar synchronization.
- **Cloud & Monetization**: Hybrid service architecture with full high-fidelity offline mock mode, switchable to Firebase Firestore/Auth, AdMob, and Google Play Billing.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Development Dev Server
Start the local dev server on port 3000:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Running Unit Tests & Bot Playtest
Verify solver math, level generator, rules, economy, and play all 500 levels through the automated bot:
```bash
npm test
npx tsx tests/botPlaytest.test.ts
```

### 4. Building Production Assets
Compile the production web bundle:
```bash
npm run build
```

### 5. Pre-generating 500 Levels & Audio (Optional)
To regenerate the 500 compact level packs or synthesize sound files:
```bash
npx tsx tools/generateLevels.ts
npx tsx tools/generateSounds.ts
```

---

## 📱 Android & Google Play Release
- **Release Documentation**: See [`docs/PLAY_STORE_PACK.md`](docs/PLAY_STORE_PACK.md) for full metadata in English, Hindi, and Marathi, Data Safety questionnaire answers, and content ratings.
- **Firebase Setup**: See [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md).
- **AdMob Setup**: See [`docs/ADMOB_SETUP.md`](docs/ADMOB_SETUP.md).
- **Billing Setup**: See [`docs/BILLING_SETUP.md`](docs/BILLING_SETUP.md).
- **GitHub Actions**: Automated release AAB / APK compilation via `.github/workflows/build-android.yml`.

---

## 📄 License & Credits
- See [`CREDITS.md`](CREDITS.md) for audio synthesis, art attributions, and design credits.
- See [`DECISIONS.md`](DECISIONS.md) for full architectural changelog.
- See [`PROGRESS.md`](PROGRESS.md) for milestone verification status.
