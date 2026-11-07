# Milestone 0 - Codebase & Architecture Audit

## 1. Executive Summary
The reference file (`Arrow Escape`) is an impressive single-file prototype implementing procedural arrow puzzle mechanics, 12 geometric board masks, WebAudio procedural synthesis, and hash-based navigation. However, as a single-file prototype (600+ lines of dense, compressed code with 1-2 letter variables), it possesses critical architectural, performance, and maintainability blockers that prevent production release on Web, PWA, and Android.

## 2. Key Audit Findings

### 2.1 Architecture & Maintainability
- **Monolithic Single File**: State, rendering, procedural level generation, audio synthesis, audio sequencing, DOM routing, and event handling are tightly coupled.
- **Minified / Obfuscated Variable Names**: Globals such as `S`, `G`, `n`, `o`, `cs`, `cu`, `dz`, `wb`, `TR`, `TH`, `A`, `dA`, `dC` reduce maintainability and make extension error-prone.
- **Global Mutable State**: Variables mutate across scopes without encapsulation, creating race conditions on rapid level transitions.

### 2.2 Gameplay & Solver Verification
- **No Guaranteed Solvability in Runtime**: While the generator attempts to carve paths in reverse, edge cases with complex masks (e.g., Star, Butterfly, Trophy) can occasionally create deadlocks where no arrows are free to leave, returning -1e9 score. All 500 levels must be verified offline via a deterministic solver.
- **Sync Level Generation Latency**: Higher levels (up to n=75 grid size) run up to 14 generator iterations on the main UI thread during `start()`, causing noticeable frame drops and touch latency.
- **Uncapped Tap Accuracy**: Small cell sizes on phones (16-20px) cause accidental mis-taps leading to unfair life loss.

### 2.3 Performance & Rendering
- **Full Canvas Redraws**: The grid dots and arrows are re-rasterized every frame during movement, even though 95% of arrows and background dots remain static.
- **DOM-based Confetti & 500 Level Buttons**: Opening Level Select instantiates 500 `<button>` elements into the DOM at once, causing layout recalculations on mobile devices.
- **Audio Interval Drift**: Music sequencing relies on `setInterval(..., 80)` polling rather than WebAudio lookahead scheduling, causing jitter when browser tabs are throttled.

### 2.4 Storage & Security
- **Unversioned LocalStorage**: `localStorage.getItem('ae')` has no schema version, checksum, or corrupted data recovery.
- **Production Cheat Leak**: The "Unlock all" button is exposed in the main UI without any dev check.
- **User Input**: Profile names and emails are inserted via partial string escaping into `innerHTML`.

## 3. Modular Modern Architecture Plan
The refactored project will be structured into clean, decoupled TypeScript modules:
- `/src/game/`: Core grid model, board shapes, rules, solver, level generator, rendering pipeline (offscreen static layer + dynamic active layer), input handling with pan/zoom.
- `/src/ui/`: Game shell, title screen, level path/map, HUD, victory/game over modals, mascot component, settings, shop, achievements, daily challenge calendar.
- `/src/audio/`: WebAudio sound effects engine, lookahead music sequencer with kalimba/lofi/music box presets, synthesized audio files.
- `/src/storage/`: Versioned storage schema (v1, v2), migration pipeline, corruption recovery, auto-save state manager.
- `/src/services/`: Modular interfaces with real + mock implementations for Auth, Firestore Cloud Save, Leaderboards, Analytics, Remote Config, AdMob, and In-App Billing.
- `/src/i18n/`: Translation dictionaries for English, Hindi, and Marathi with reactive switcher.
- `/tools/`: Offline level pack generator, solver validation CLI, sound synthesis script, asset generator.
- `/tests/`: Unit tests (rules, solver, generator, storage migration, economy) and Playwright E2E suites.
- `/docs/`: Play Store pack, AdMob setup, Firebase setup, Billing setup, and difficulty curve analysis.
