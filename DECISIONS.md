# Architectural & Technical Decisions (DECISIONS.md)

This log records all high-level technical decisions made autonomously during the project lifecycle.

## [D001] Original Title & Brand Identity
- **Decision**: Brand the game as **Arrow Zen: Escape Puzzle**.
- **Rationale**: Respects the user's directive ("Use an original name, icon and art; never imitate another game's assets"), preserving the warm paper background, calming ambient audio, water drop mascot, and brown line arrows while creating a distinctive, trademarkable identity.

## [D002] State Management & React Architecture
- **Decision**: Use a single-direction decoupled React state tree for UI overlays and routing, while housing the high-performance 60 FPS puzzle canvas inside an isolated container (`CanvasBoard`) without React re-render overhead.
- **Rationale**: Keeps React render cycles off the 60fps canvas loop. UI overlays (HUD, modals, shop, settings) communicate via a lightweight reactive state/event store.

## [D003] Pre-Generated Level Packs vs On-Demand Generation
- **Decision**: Pre-generate all 500 levels into compact JSON level packs partitioned into worlds of 25-50 levels in `/public/levels/pack-*.json`, verified offline with 100% solvability. Maintain a Web Worker for procedural Daily Challenge generation.
- **Rationale**: Eliminates main-thread freeze on mobile when launching levels (especially large grids n=50..75).

## [D004] Hybrid Storage Engine with Schema Versioning & Auto-Migration
- **Decision**: Use a schema-versioned storage engine (`ArrowZenStorage_v2`) with automatic migration from legacy `ae` format, corruption rollback, and immediate persistence on move.
- **Rationale**: Guarantees zero progress loss if player refreshes or device shuts down.

## [D005] Offline-First Mock Service Architecture
- **Decision**: Implement all external services (Firebase Auth, Cloud Save, Leaderboards, Analytics, Remote Config, AdMob, Google Play Billing) with an interface-driven architecture (`IAuthService`, `ICloudSaveService`, `IAdService`, `IBillingService`, etc.) backed by high-fidelity local Mock providers by default, switchable via environment variables / config.
- **Rationale**: Enables 100% interactive testing, Playwright verification, and flawless offline gameplay out of the box without requiring real API keys or third-party cloud accounts.

## [D006] Offscreen Static Canvas + Dynamic Sprite Layer
- **Decision**: Split canvas rendering into a cached offscreen background (board shape dots, static grid) and a dynamic foreground (moving arrows, highlight glows, touch ripples, particles).
- **Rationale**: Achieves steady 60 FPS even on low-end 4x CPU throttling, meeting Milestone 7 hardening constraints.

## [D007] Accessibility First & Multilingual Support
- **Decision**: Native support for English, Hindi (हिंदी), and Marathi (मराठी) with zero hardcoded UI strings; color-blind high-contrast patterns; minimum 44px tap targets; and customizable motion settings.
- **Rationale**: Ensures universal accessibility across key target global and Indian mobile audiences.
## [D008] Complete Zero-Emoji UI & Tactile 3D Arrow Dynamics
- **Decision**: Replaced all raw unicode emojis throughout all application screens with bespoke SVG game vector assets (`CoinIcon`, `DropIcon`, `BombIcon`, `XrayIcon`, `HintIcon`, `UndoIcon`, `FlameIcon`, `StarIcon`, `RankMedal`, `ShieldIcon`), 8 custom animal mascot avatars (`CharacterAvatar`), and precision UI icons from `lucide-react`. Upgraded Canvas arrow visuals with 3D ambient drop shadows, dual-tone stroke shading, specular cylindrical light reflection spines, animated directional chevrons flowing along the arrow body, and aerodynamic chiseled arrowheads with center-ridge highlights. Added elastic damped recoil with collision shockwaves and crimson spark bursts.
- **Rationale**: Eliminates cross-platform emoji rendering disparities (iOS vs Android vs Windows), prevents pixelation, delivers a high-end, tactile, cohesive real-world game feel, and satisfies the user's explicit directive for an interactive, polished experience with custom assets and animations.

## [D009] Idle-Pausing requestAnimationFrame Loop with Continuous Slide Easing, Press Squish, & Blocked Jitter
- **Decision**: Implemented an adaptive `requestAnimationFrame` render engine in `CanvasBoard`:
  1. **Idle Pausing**: Automatically pauses `requestAnimationFrame` when the board is at rest (zero moving arrows, zero active particles, zero pointer interactions), achieving 0% CPU/GPU overhead. Automatically wakes via `wakeLoop()` on pointer interaction, prop change, or when reaching the 8-second idle-help breathing threshold.
  2. **Continuous Sub-Pixel Slide Easing**: Implemented `sampleTraj(t)` continuous parametric trajectory sampler with micro-anticipation recoil (-0.06 cell pullback during initial 8%) and quintic ease-out (`1 - (1-t)^4`), eliminating discrete integer coordinate snapping.
  3. **Press-Squish on Tap**: Added mechanical squash-and-stretch volume conservation (~0.92 scale compression with widened tube) and drop-shadow indentation (sinking from 3.0px to 1.0px) upon pointer down, followed by a damped harmonic rebound spring on release.
  4. **Multi-Axis Blocked Jitter**: Added dual-axis high-frequency vibration combining longitudinal recoil along the arrow's movement direction with orthogonal lateral buzzing rattle, accompanied by blocker crimson pulse aura.
- **Rationale**: Delivers console-grade tactile responsiveness and smooth 60 FPS transitions while maximizing battery life and eliminating CPU consumption when the game is idle.

## [D010] Level-Completion Joyful Water-Drop Particle System with CSS Transforms
- **Decision**: Built `VictoryDropParticles` component triggered on level completion:
  1. **Theme-Adaptive Droplets**: Emits 38 water-drop particles matching the active game theme's `theme.drop` and `theme.accent` colors, featuring 3 visual variants (Joyful Mascot Droppy with happy expressions, Crystalline Dew Drops with specular glints, and Sparkle Star Drops).
  2. **Multi-Emitter Fountain Physics**: Employs dual corner cannons (launching upward arcs from left and right) plus a 360-degree center radial burst.
  3. **Hardware-Accelerated CSS Transforms**: Driven entirely via GPU-accelerated CSS keyframe transforms (`translate3d`, `rotate`, `scale`, `opacity`, `will-change`), with natural gravity deceleration, apex peak trajectory, and surface-tension droplet wobbling.
  4. **Accessibility Support**: Automatically throttles to a soft floating ambient dispersion when `reduceMotion` is enabled.
- **Rationale**: Elevates player emotional payoff on victory with bespoke branded water-drop physics while maintaining 60 FPS performance without canvas context contention.
