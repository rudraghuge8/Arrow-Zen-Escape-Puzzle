# Project Brief: Arrow Zen - Escape Puzzle (Evolution of Arrow Escape)

## Overview
Transform "Arrow Escape" (a single-file HTML5 canvas puzzle game with 500 levels, 12 board shapes, drops/lives, hints, themes, WebAudio music, and hash routing) into a polished, responsive, production-ready cross-platform game:
- Progressive Web App (PWA) with offline-first service worker and installability.
- Capacitor-ready Android structure with adaptive icons, splash screens, hardware back button handling, and GitHub Actions build workflow.
- Complete Google Play Release Pack (Store listing in English, Hindi, Marathi, Data Safety, Content Rating, staged rollout, and privacy policy).
- All three version tiers:
  - **v1.0**: Offline-first core puzzle game, offline level generator & pre-generated compact packs, solver verification, interactive tutorial, boosters (Bomb, X-ray, Extra Drop), undo, star ratings, combos, zoom/pan, custom canvas mascot, rich accessibility, sound effects, multilingual (English, Hindi, Marathi).
  - **v1.1**: Accounts, Cloud Save, Global/Weekly Leaderboards, Remote Config, Analytics, Account Deletion (with full local mock mode when keys are not supplied).
  - **v1.2**: Ads (AdMob mock + real config switch), In-App Purchases (Google Play Billing mock + real config switch).

## Autonomy Rules
- Never ask questions; make decisions and document in `DECISIONS.md`.
- Milestone workflow with tests, commits, and `PROGRESS.md`.
- Real verification: build, unit tests, solver, Lighthouse, Playwright E2E.
- TypeScript, modular architecture, readable code, no dead code.

## Milestones
- **Milestone 0**: Audit and folder structure setup.
- **Milestone 1**: Modular foundation, offline level generation & solver verification, safety storage migration, audio engine.
- **Milestone 2**: Gameplay, progression, economy, boosters, daily challenge, streak, calendar, achievements.
- **Milestone 3**: Game feel, juice, canvas mascot, skins, accessibility, i18n (EN/HI/MR), Playwright E2E.
- **Milestone 4**: Online features (v1.1) with Mock mode + Firebase/Firestore config option.
- **Milestone 5**: Monetization (v1.2) with Mock mode + AdMob/Billing docs.
- **Milestone 6**: PWA + Android (Capacitor), icons/graphics, GitHub Actions, Play Store pack.
- **Milestone 7**: Performance hardening, 60fps low-end throttling, automated bot playtest of all 500 levels, Lighthouse audit, security, final reports.
