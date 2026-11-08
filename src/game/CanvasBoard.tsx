/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { DIRECTIONS, type DirectionIndex, type LevelData, type RuntimeArrow, type ArrowSkinId, type ThemeColors } from './types';
import { findBlocker, pointToSegmentDistance } from './rules';
import { soundEngine } from '../audio/soundEngine';
import { renderCanvasSkinHead } from './skins';

export interface CanvasBoardProps {
  levelData: LevelData;
  theme: ThemeColors;
  skin: ArrowSkinId;
  lives: number;
  isGameOver: boolean;
  isWon: boolean;
  colorBlindMode?: boolean;
  reduceMotion?: boolean;
  largeTapTargets?: boolean;
  idleHelpEnabled?: boolean;
  showFpsOverlay?: boolean;
  onArrowEscaped: (arrowId: number, remainingCount: number, comboCount: number) => void;
  onArrowBlocked: (arrowId: number, blockerId: number) => void;
  onPreviewArrow?: (arrowId: number | null, blockerId: number | null) => void;
  bombActive?: boolean;
  onBombUsed?: (arrowId: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  life: number;
  maxLife: number;
}

interface FloatingPopup {
  text: string;
  x: number;
  y: number;
  color: string;
  startTime: number;
  duration: number;
}

export const CanvasBoard: React.FC<CanvasBoardProps> = ({
  levelData,
  theme,
  skin,
  lives,
  isGameOver,
  isWon,
  colorBlindMode = false,
  reduceMotion = false,
  largeTapTargets = false,
  idleHelpEnabled = true,
  showFpsOverlay = false,
  onArrowEscaped,
  onArrowBlocked,
  onPreviewArrow,
  bombActive = false,
  onBombUsed,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Runtime mutable state (isolated from React state for 60fps)
  const stateRef = useRef<{
    arrows: RuntimeArrow[];
    occupancy: Int16Array;
    remaining: number;
    cellSize: number;
    gridSize: number;
    dpr: number;
    scale: number;
    panX: number;
    panY: number;
    isDragging: boolean;
    dragStartX: number;
    dragStartY: number;
    lastTapTime: number;
    particles: Particle[];
    shockwaves: Shockwave[];
    floatingPopups: FloatingPopup[];
    comboCount: number;
    lastClearTime: number;
    lastActivityTime: number;
    idlePulsingArrowId: number | null;
    longPressTimer: ReturnType<typeof setTimeout> | null;
    previewArrowId: number | null;
    previewBlockerId: number | null;
    fps: number;
    framesThisSec: number;
    lastFpsUpdateTime: number;
    animationFrameId: number | null;
    isPointerDown: boolean;
    pointerDownPos: { x: number; y: number } | null;
    isLoopRunning: boolean;
    idleTimer: ReturnType<typeof setTimeout> | null;
    pressedArrow: RuntimeArrow | null;
    lastFrameTime: number;
  }>({
    arrows: [],
    occupancy: new Int16Array(0),
    remaining: 0,
    cellSize: 24,
    gridSize: levelData.gridSize,
    dpr: 1,
    scale: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    lastTapTime: 0,
    particles: [],
    shockwaves: [],
    floatingPopups: [],
    comboCount: 0,
    lastClearTime: 0,
    lastActivityTime: Date.now(),
    idlePulsingArrowId: null,
    longPressTimer: null,
    previewArrowId: null,
    previewBlockerId: null,
    fps: 60,
    framesThisSec: 0,
    lastFpsUpdateTime: Date.now(),
    animationFrameId: null,
    isPointerDown: false,
    pointerDownPos: null,
    isLoopRunning: false,
    idleTimer: null,
    pressedArrow: null,
    lastFrameTime: performance.now(),
  });

  // Keep callback props updated in refs
  const callbacksRef = useRef({
    onArrowEscaped,
    onArrowBlocked,
    onPreviewArrow,
    onBombUsed,
  });
  callbacksRef.current = { onArrowEscaped, onArrowBlocked, onPreviewArrow, onBombUsed };

  const loopRef = useRef<(timestamp: number) => void>(() => {});

  // Wake loop up immediately whenever state changes or user interacts
  const wakeLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.idleTimer) {
      clearTimeout(s.idleTimer);
      s.idleTimer = null;
    }
    s.lastFrameTime = performance.now();
    if (!s.isLoopRunning) {
      s.isLoopRunning = true;
      if (s.animationFrameId) {
        cancelAnimationFrame(s.animationFrameId);
      }
      s.animationFrameId = requestAnimationFrame((ts) => loopRef.current(ts));
    }
  }, []);

  // Setup / reset level runtime state
  useEffect(() => {
    const n = levelData.gridSize;
    const occupancy = new Int16Array(n * n).fill(-1);

    const runtimeArrows: RuntimeArrow[] = levelData.arrows.map((arrow) => {
      for (const cell of arrow.c) {
        occupancy[cell] = arrow.id;
      }

      const headIdx = arrow.c[arrow.c.length - 1];
      const hx = headIdx % n;
      const hy = Math.floor(headIdx / n);
      const dir = DIRECTIONS[arrow.d];

      // Calculate exit trajectory
      let x = hx;
      let y = hy;
      let exitSteps = 0;
      while (x >= 0 && y >= 0 && x < n && y < n) {
        x += dir.dx;
        y += dir.dy;
        exitSteps++;
      }

      const trajectory: [number, number][] = arrow.c.map((cell) => [
        (cell % n) + 0.5,
        Math.floor(cell / n) + 0.5,
      ]);

      const lastPoint = trajectory[trajectory.length - 1];
      const totalExitSteps = exitSteps + arrow.c.length + 3;
      for (let i = 1; i <= totalExitSteps; i++) {
        trajectory.push([lastPoint[0] + dir.dx * i, lastPoint[1] + dir.dy * i]);
      }

      return {
        ...arrow,
        trajectory,
        exitLength: arrow.c.length - 1 + exitSteps + 2,
        isMoving: false,
        isGone: false,
        moveProgress: 0,
        moveStartTime: 0,
        slideOffset: 0,
        highlightUntil: 0,
        blockedFlashUntil: 0,
        blockedShakeTime: 0,
        blockedJitterTime: 0,
        isPressed: false,
        pressTime: 0,
        pressReleaseTime: 0,
      };
    });

    const s = stateRef.current;
    s.arrows = runtimeArrows;
    s.occupancy = occupancy;
    s.remaining = runtimeArrows.length;
    s.gridSize = n;
    s.scale = 1;
    s.panX = 0;
    s.panY = 0;
    s.particles = [];
    s.shockwaves = [];
    s.floatingPopups = [];
    s.comboCount = 0;
    s.lastActivityTime = Date.now();
    s.idlePulsingArrowId = null;
    s.pressedArrow = null;

    renderOffscreenGrid();
    wakeLoop();
  }, [levelData, theme, wakeLoop]);

  // Pre-render tactile puzzle box container, shape perimeter rim, and recessed cell bed onto offscreen canvas
  const renderOffscreenGrid = useCallback(() => {
    const s = stateRef.current;
    const n = s.gridSize;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    s.dpr = dpr;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const minDim = Math.min(rect.width || 360, rect.height || 360) - 24;
    s.cellSize = Math.max(16, Math.min(48, Math.floor(minDim / (n + 2))));

    const cs = s.cellSize;
    const boardPx = (n + 2) * cs;
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
    const offCanvas = offscreenCanvasRef.current;
    offCanvas.width = boardPx * dpr;
    offCanvas.height = boardPx * dpr;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, boardPx, boardPx);

    const mask = levelData.shapeMask;
    const isGlass = theme.id === 8;

    // Minimal, organic Zen grid pins: NO box boundary, border, or rim around the arrows
    ctx.save();
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (!mask[y * n + x]) continue;

        const px = (x + 1) * cs;
        const py = (y + 1) * cs;
        const cx = px + cs * 0.5;
        const cy = py + cs * 0.5;

        // Subtle tactile locator dot at cell centers
        ctx.fillStyle = theme.line;
        ctx.globalAlpha = isGlass ? 0.20 : 0.10;
        ctx.beginPath();
        ctx.arc(cx, cy, cs * 0.06, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }, [levelData, theme]);

  // Main render loop with idle sleeping and smooth physics
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      const s = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) {
        s.isLoopRunning = false;
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        s.isLoopRunning = false;
        return;
      }

      // Update FPS counter
      s.framesThisSec++;
      if (Date.now() - s.lastFpsUpdateTime >= 1000) {
        s.fps = s.framesThisSec;
        s.framesThisSec = 0;
        s.lastFpsUpdateTime = Date.now();
      }

      // Check idle help
      if (idleHelpEnabled && !isGameOver && !isWon && s.remaining > 0) {
        if (Date.now() - s.lastActivityTime > 8000) {
          if (s.idlePulsingArrowId === null) {
            const free = s.arrows.filter((a) => !a.isGone && !a.isMoving && findBlocker(a, s.occupancy, s.gridSize) < 0);
            if (free.length > 0) {
              s.idlePulsingArrowId = free[0].id;
            }
          }
        } else {
          s.idlePulsingArrowId = null;
        }
      }

      // Resize main canvas if needed
      const n = s.gridSize;
      const boardPx = (n + 2) * s.cellSize;
      const dpr = s.dpr;

      if (canvas.width !== boardPx * dpr || canvas.height !== boardPx * dpr) {
        canvas.width = boardPx * dpr;
        canvas.height = boardPx * dpr;
        canvas.style.width = `${boardPx}px`;
        canvas.style.height = `${boardPx}px`;
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Pan & Zoom transform
      ctx.translate(boardPx / 2 + s.panX, boardPx / 2 + s.panY);
      ctx.scale(s.scale, s.scale);
      ctx.translate(-boardPx / 2, -boardPx / 2);

      ctx.clearRect(0, 0, boardPx, boardPx);

      // 1. Draw static offscreen grid layer
      if (offscreenCanvasRef.current) {
        ctx.drawImage(offscreenCanvasRef.current, 0, 0, boardPx, boardPx);
      }

      // 2. Animate and draw arrows
      const now = performance.now();
      const isCurved = levelData.levelNumber % 2 !== 0 && skin !== 'sharp' && skin !== 'pixel';

      s.arrows.forEach((arrow) => {
        if (arrow.isGone) return;

        // Animate moving arrow with micro-anticipation recoil and quintic ease-out
        if (arrow.isMoving) {
          const elapsed = now - arrow.moveStartTime;
          const duration = reduceMotion ? 240 : 420;
          arrow.moveProgress = Math.min(1, elapsed / duration);
          const p = arrow.moveProgress;

          // Tactile physics curve: micro-recoil during first 8% of launch, then smooth quintic ease-out
          let easeProgress: number;
          if (p < 0.08 && !reduceMotion) {
            easeProgress = -0.06 * Math.sin((p / 0.08) * Math.PI);
          } else {
            const adjustedP = (p - 0.08) / 0.92;
            easeProgress = 1 - Math.pow(1 - adjustedP, 4.0);
          }
          arrow.slideOffset = arrow.exitLength * easeProgress;

          // Spawn faint trail speed particles during flight
          if (Math.random() < 0.4 && p > 0.15 && p < 0.85) {
            const headPoint = arrow.trajectory[Math.min(arrow.trajectory.length - 1, Math.floor(arrow.slideOffset + arrow.c.length))];
            s.particles.push({
              x: (headPoint[0] + 1) * s.cellSize + (Math.random() - 0.5) * 6,
              y: (headPoint[1] + 1) * s.cellSize + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 40,
              vy: (Math.random() - 0.5) * 40,
              color: '#38bdf8',
              size: Math.random() * 2.5 + 1.5,
              life: 0,
              maxLife: 0.35,
            });
          }

          if (arrow.moveProgress >= 1) {
            arrow.isGone = true;
            arrow.isMoving = false;
            s.remaining--;

            // Spawn celebration burst particles
            const headPoint = arrow.trajectory[arrow.trajectory.length - 1];
            for (let i = 0; i < 14; i++) {
              s.particles.push({
                x: (headPoint[0] + 1) * s.cellSize,
                y: (headPoint[1] + 1) * s.cellSize,
                vx: (Math.random() - 0.5) * 180,
                vy: (Math.random() - 0.5) * 180,
                color: theme.drop,
                size: Math.random() * 3.5 + 2,
                life: 0,
                maxLife: 0.45,
              });
            }

            callbacksRef.current.onArrowEscaped(arrow.id, s.remaining, s.comboCount);
          }
        }

        // Draw enhanced tactile arrow
        drawTactileArrow(
          ctx,
          arrow,
          s.cellSize,
          now,
          theme,
          isCurved,
          skin,
          colorBlindMode,
          s.idlePulsingArrowId === arrow.id,
          s.previewArrowId === arrow.id,
          s.previewBlockerId === arrow.id
        );
      });

      // 3. Draw shockwave rings (impact ripples)
      for (let i = s.shockwaves.length - 1; i >= 0; i--) {
        const sw = s.shockwaves[i];
        sw.life += dt;
        if (sw.life >= sw.maxLife) {
          s.shockwaves.splice(i, 1);
          continue;
        }
        const prog = sw.life / sw.maxLife;
        const currentR = sw.radius + (sw.maxRadius - sw.radius) * prog;
        const alpha = Math.max(0, 1 - prog);

        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2.5 * (1 - prog);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, currentR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Draw particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          s.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // 5. Draw floating combo / score popups
      for (let i = s.floatingPopups.length - 1; i >= 0; i--) {
        const f = s.floatingPopups[i];
        const elapsed = (now - f.startTime) / 1000;
        if (elapsed >= f.duration) {
          s.floatingPopups.splice(i, 1);
          continue;
        }
        const alpha = 1 - elapsed / f.duration;
        const currentY = f.y - elapsed * 42;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = f.color;
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(f.text, f.x, currentY);
        ctx.restore();
      }

      ctx.restore();

      // Determine whether active animations require continuing the rAF loop
      let hasActiveAnimations = false;

      // 1. Any arrow moving, pressed, releasing, jittering, or flashing
      for (const a of s.arrows) {
        if (a.isGone) continue;
        if (a.isMoving) {
          hasActiveAnimations = true;
          break;
        }
        if (a.isPressed) {
          hasActiveAnimations = true;
          break;
        }
        if (a.pressReleaseTime && now - a.pressReleaseTime < 280) {
          hasActiveAnimations = true;
          break;
        }
        if (a.blockedJitterTime && now - a.blockedJitterTime < 400) {
          hasActiveAnimations = true;
          break;
        }
        if (a.blockedShakeTime && now - a.blockedShakeTime < 400) {
          hasActiveAnimations = true;
          break;
        }
        if (a.blockedFlashUntil && a.blockedFlashUntil > now) {
          hasActiveAnimations = true;
          break;
        }
        if (a.highlightUntil && a.highlightUntil > now) {
          hasActiveAnimations = true;
          break;
        }
      }

      // 2. User pointer interactions
      if (s.isPointerDown || s.isDragging || s.previewArrowId !== null) {
        hasActiveAnimations = true;
      }

      // 3. Transient visual effects
      if (s.particles.length > 0 || s.shockwaves.length > 0 || s.floatingPopups.length > 0) {
        hasActiveAnimations = true;
      }

      // 4. Idle help breathing pulse
      if (s.idlePulsingArrowId !== null) {
        hasActiveAnimations = true;
      }

      // Dev FPS overlay (shows real-time active FPS or idle sleep state)
      if (showFpsOverlay) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.72)';
        ctx.fillRect(8, 8, hasActiveAnimations ? 90 : 124, 24);
        ctx.fillStyle = hasActiveAnimations ? '#00ff88' : '#94a3b8';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(hasActiveAnimations ? `FPS: ${s.fps}` : 'FPS: 0 (idle)', 16, 24);
        ctx.restore();
      }

      if (hasActiveAnimations) {
        s.animationFrameId = requestAnimationFrame((ts) => loopRef.current(ts));
      } else {
        // Stop animation loop and sleep to preserve battery & CPU (0% overhead while idle)
        s.isLoopRunning = false;
        s.animationFrameId = null;

        // Schedule timer to wake loop when 8-second idle help threshold is reached
        if (idleHelpEnabled && !isGameOver && !isWon && s.remaining > 0) {
          const timeUntilIdleHelp = Math.max(100, 8000 - (Date.now() - s.lastActivityTime));
          if (s.idleTimer) clearTimeout(s.idleTimer);
          s.idleTimer = setTimeout(() => {
            wakeLoop();
          }, timeUntilIdleHelp);
        }
      }
    };

    loopRef.current = loop;
    wakeLoop();

    return () => {
      const s = stateRef.current;
      if (s.animationFrameId) {
        cancelAnimationFrame(s.animationFrameId);
        s.animationFrameId = null;
      }
      if (s.idleTimer) {
        clearTimeout(s.idleTimer);
        s.idleTimer = null;
      }
      s.isLoopRunning = false;
    };
  }, [levelData, theme, skin, colorBlindMode, reduceMotion, idleHelpEnabled, showFpsOverlay, isGameOver, isWon, wakeLoop]);

  // Pointer & Tap Handling with press-squish tactile feedback
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isGameOver || isWon) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    const s = stateRef.current;

    s.isPointerDown = true;
    s.pointerDownPos = { x: clientX, y: clientY };
    s.lastActivityTime = Date.now();
    s.idlePulsingArrowId = null;

    // Detect pressed arrow for physical squash & indentation
    const targetArrow = getArrowAtPoint(clientX, clientY, rect);
    if (targetArrow && !targetArrow.isGone && !targetArrow.isMoving) {
      targetArrow.isPressed = true;
      targetArrow.pressTime = performance.now();
      s.pressedArrow = targetArrow;
    }

    wakeLoop();

    // Long press preview setup (450ms)
    if (s.longPressTimer) clearTimeout(s.longPressTimer);
    s.longPressTimer = setTimeout(() => {
      if (s.isPointerDown && !s.isDragging) {
        const arrow = getArrowAtPoint(clientX, clientY, rect);
        if (arrow && !arrow.isGone && !arrow.isMoving) {
          const blocker = findBlocker(arrow, s.occupancy, s.gridSize);
          s.previewArrowId = arrow.id;
          s.previewBlockerId = blocker >= 0 ? blocker : null;
          soundEngine.vibrate(25);
          if (callbacksRef.current.onPreviewArrow) {
            callbacksRef.current.onPreviewArrow(arrow.id, blocker >= 0 ? blocker : null);
          }
          wakeLoop();
        }
      }
    }, 450);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    if (!s.isPointerDown || !s.pointerDownPos) return;

    const dx = e.clientX - s.pointerDownPos.x;
    const dy = e.clientY - s.pointerDownPos.y;

    if (!s.isDragging && Math.hypot(dx, dy) > 8) {
      s.isDragging = true;
      if (s.longPressTimer) {
        clearTimeout(s.longPressTimer);
        s.longPressTimer = null;
      }
      s.previewArrowId = null;
      s.previewBlockerId = null;

      // Cancel press-squish on drag
      if (s.pressedArrow) {
        s.pressedArrow.isPressed = false;
        s.pressedArrow.pressReleaseTime = performance.now();
        s.pressedArrow = null;
      }
    }

    if (s.isDragging) {
      s.panX += dx;
      s.panY += dy;
      s.pointerDownPos = { x: e.clientX, y: e.clientY };
      wakeLoop();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = stateRef.current;
    if (s.longPressTimer) {
      clearTimeout(s.longPressTimer);
      s.longPressTimer = null;
    }

    // Release press-squish with damped harmonic spring bounce
    if (s.pressedArrow) {
      s.pressedArrow.isPressed = false;
      s.pressedArrow.pressReleaseTime = performance.now();
      s.pressedArrow = null;
    }

    // Reset preview
    s.previewArrowId = null;
    s.previewBlockerId = null;
    if (callbacksRef.current.onPreviewArrow) {
      callbacksRef.current.onPreviewArrow(null, null);
    }

    const wasDragging = s.isDragging;
    s.isPointerDown = false;
    s.isDragging = false;
    s.pointerDownPos = null;

    wakeLoop();

    if (wasDragging) return;

    // Normal tap execution
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const arrow = getArrowAtPoint(e.clientX, e.clientY, rect);

    if (!arrow || arrow.isGone || arrow.isMoving) return;

    // Bomb booster mode
    if (bombActive) {
      useBombOnArrow(arrow);
      return;
    }

    // Standard arrow escape check
    executeArrowTap(arrow, e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerCancel = () => {
    const s = stateRef.current;
    if (s.longPressTimer) {
      clearTimeout(s.longPressTimer);
      s.longPressTimer = null;
    }
    if (s.pressedArrow) {
      s.pressedArrow.isPressed = false;
      s.pressedArrow.pressReleaseTime = performance.now();
      s.pressedArrow = null;
    }
    s.previewArrowId = null;
    s.previewBlockerId = null;
    s.isPointerDown = false;
    s.isDragging = false;
    s.pointerDownPos = null;
    wakeLoop();
  };

  const executeArrowTap = (arrow: RuntimeArrow, tapX: number, tapY: number) => {
    const s = stateRef.current;
    const blockerId = findBlocker(arrow, s.occupancy, s.gridSize);

    if (blockerId < 0) {
      // Clear path! Arrow escapes!
      arrow.isMoving = true;
      arrow.moveStartTime = performance.now();

      // Free occupancy cells immediately so other arrows can move
      for (const cell of arrow.c) {
        s.occupancy[cell] = -1;
      }

      // Combo streak tracking (if cleared within 2.5s)
      const now = Date.now();
      if (now - s.lastClearTime < 2500) {
        s.comboCount++;
      } else {
        s.comboCount = 1;
      }
      s.lastClearTime = now;

      soundEngine.playSfx('go', s.comboCount);
      soundEngine.vibrate(18);

      // Show floating combo text if combo > 1
      if (s.comboCount >= 2) {
        s.floatingPopups.push({
          text: `Combo x${s.comboCount}!`,
          x: tapX,
          y: tapY,
          color: theme.accent,
          startTime: performance.now(),
          duration: 1.2,
        });
      }

      wakeLoop();
    } else {
      // Arrow is blocked! Trigger multi-axis jitter and blocker flash
      arrow.blockedShakeTime = performance.now();
      arrow.blockedJitterTime = performance.now();
      const blocker = s.arrows.find((a) => a.id === blockerId);
      if (blocker) {
        blocker.blockedFlashUntil = performance.now() + 650;
      }

      // Trigger impact shockwave and spark burst at collision point
      const headIdx = arrow.c[arrow.c.length - 1];
      const hx = (headIdx % s.gridSize + 1.5) * s.cellSize;
      const hy = (Math.floor(headIdx / s.gridSize) + 1.5) * s.cellSize;

      s.shockwaves.push({
        x: hx,
        y: hy,
        radius: 4,
        maxRadius: s.cellSize * 1.4,
        color: '#ef4444',
        life: 0,
        maxLife: 0.35,
      });

      for (let i = 0; i < 8; i++) {
        s.particles.push({
          x: hx,
          y: hy,
          vx: (Math.random() - 0.5) * 120,
          vy: (Math.random() - 0.5) * 120,
          color: '#f87171',
          size: Math.random() * 2.5 + 1.5,
          life: 0,
          maxLife: 0.3,
        });
      }

      s.comboCount = 0;
      soundEngine.playSfx('no');
      soundEngine.vibrate([40, 60, 40]);
      callbacksRef.current.onArrowBlocked(arrow.id, blockerId);
      wakeLoop();
    }
  };

  const useBombOnArrow = (arrow: RuntimeArrow) => {
    const s = stateRef.current;
    arrow.isGone = true;
    for (const cell of arrow.c) {
      s.occupancy[cell] = -1;
    }
    s.remaining--;

    // Bomb explosion shockwave + particles
    const headPoint = arrow.trajectory[arrow.c.length - 1];
    const bx = (headPoint[0] + 1) * s.cellSize;
    const by = (headPoint[1] + 1) * s.cellSize;

    s.shockwaves.push({
      x: bx,
      y: by,
      radius: 6,
      maxRadius: s.cellSize * 2.2,
      color: '#fbbf24',
      life: 0,
      maxLife: 0.45,
    });

    for (let i = 0; i < 22; i++) {
      s.particles.push({
        x: bx,
        y: by,
        vx: (Math.random() - 0.5) * 240,
        vy: (Math.random() - 0.5) * 240,
        color: i % 2 === 0 ? '#f97316' : '#ef4444',
        size: Math.random() * 4 + 2,
        life: 0,
        maxLife: 0.55,
      });
    }

    soundEngine.playSfx('booster');
    soundEngine.vibrate([60, 80, 60]);

    if (callbacksRef.current.onBombUsed) {
      callbacksRef.current.onBombUsed(arrow.id);
    }
    callbacksRef.current.onArrowEscaped(arrow.id, s.remaining, 1);
    wakeLoop();
  };

  // Find nearest arrow to tap coordinate within effective tap area
  const getArrowAtPoint = (clientX: number, clientY: number, rect: DOMRect): RuntimeArrow | null => {
    const s = stateRef.current;
    const n = s.gridSize;
    const boardPx = (n + 2) * s.cellSize;

    // Invert pan and zoom
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    const unscaledX = (canvasX - (boardPx / 2 + s.panX)) / s.scale + boardPx / 2;
    const unscaledY = (canvasY - (boardPx / 2 + s.panY)) / s.scale + boardPx / 2;

    const gridX = unscaledX / s.cellSize - 1;
    const gridY = unscaledY / s.cellSize - 1;

    // Minimum 44px effective tap tolerance
    const tapTolerance = largeTapTargets ? 0.95 : 0.65;
    let closestArrow: RuntimeArrow | null = null;
    let minDistance = tapTolerance;

    for (const arrow of s.arrows) {
      if (arrow.isGone || arrow.isMoving) continue;
      const pts = arrow.trajectory.slice(0, arrow.c.length);
      for (let i = 0; i < pts.length - 1; i++) {
        const dist = pointToSegmentDistance(
          gridX,
          gridY,
          pts[i][0],
          pts[i][1],
          pts[i + 1][0],
          pts[i + 1][1]
        );
        if (dist < minDistance) {
          minDistance = dist;
          closestArrow = arrow;
        }
      }
    }

    return closestArrow;
  };

  // Wheel zoom / reset
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const s = stateRef.current;
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    s.scale = Math.max(0.6, Math.min(2.5, s.scale * zoomFactor));
    wakeLoop();
  };

  const handleDoubleClick = () => {
    const s = stateRef.current;
    s.scale = 1;
    s.panX = 0;
    s.panY = 0;
    wakeLoop();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none select-none"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerCancel}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        className="block cursor-pointer active:cursor-grabbing drop-shadow-md"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

/**
 * Enhanced Tactile Arrow Renderer
 * Renders 3D beveled arrow shafts with ambient drop shadows, specular highlights,
 * embedded flow chevrons, and sculpted aerodynamic arrowheads.
 */
function drawTactileArrow(
  ctx: CanvasRenderingContext2D,
  arrow: RuntimeArrow,
  cs: number,
  now: number,
  theme: ThemeColors,
  isCurved: boolean,
  skin: ArrowSkinId,
  colorBlindMode: boolean,
  isIdleHint: boolean,
  isPreview: boolean,
  isBlockerFlash: boolean
) {
  const traj = arrow.trajectory;
  const k = arrow.c.length;
  const slide = arrow.slideOffset;

  const isFlashing = (arrow.blockedFlashUntil && arrow.blockedFlashUntil > now) || isBlockerFlash;
  const isHighlighted = (arrow.highlightUntil && arrow.highlightUntil > now) || isIdleHint || isPreview;

  // Color selection
  let baseColor = theme.line;
  let highlightColor = '#ffffff';

  if (arrow.isMoving) {
    baseColor = '#10b981'; // Emerald rush on exit
    highlightColor = '#a7f3d0';
  } else if (isFlashing) {
    baseColor = '#ef4444'; // Crimson danger
    highlightColor = '#fca5a5';
  } else if (isHighlighted) {
    baseColor = '#f59e0b'; // Amber golden glow
    highlightColor = '#fef3c7';
  } else if (skin === 'neon') {
    baseColor = '#38bdf8'; // Electric cyan
    highlightColor = '#e0f2fe';
  } else if (theme.id === 8) {
    baseColor = '#e2e8f0'; // Crystalline frosted glass
    highlightColor = '#ffffff';
  }

  // Continuous parametric trajectory sampling for liquid sub-pixel smooth movement
  const sampleTraj = (t: number): [number, number] => {
    if (t <= 0) {
      return [(traj[0][0] + 1) * cs, (traj[0][1] + 1) * cs];
    }
    if (t >= traj.length - 1) {
      const last = traj[traj.length - 1];
      return [(last[0] + 1) * cs, (last[1] + 1) * cs];
    }
    const idx0 = Math.floor(t);
    const idx1 = idx0 + 1;
    const frac = t - idx0;
    const p0 = traj[idx0];
    const p1 = traj[idx1];
    return [
      ((p0[0] + (p1[0] - p0[0]) * frac) + 1) * cs,
      ((p0[1] + (p1[1] - p0[1]) * frac) + 1) * cs,
    ];
  };

  // Sample points along trajectory with high parametric density during motion
  const points: [number, number][] = [];
  const startParam = Math.max(0, slide);

  if (arrow.isMoving || isCurved) {
    // Dense sub-cell parametric sampling (10-14 samples per cell)
    // Ensures fluid, liquid bending around 90-degree corners with no linear kinks!
    const sampleCount = Math.max(k * 10, 24);
    for (let i = 0; i < sampleCount; i++) {
      const t = startParam + (i / (sampleCount - 1)) * (k - 1);
      points.push(sampleTraj(t));
    }
  } else {
    for (let i = 0; i < k; i++) {
      points.push(sampleTraj(startParam + i));
    }
  }

  if (points.length < 2) return;

  // Luminous slipstream contrail ribbon trailing behind the arrow tail during escape
  if (arrow.isMoving && startParam > 0.08) {
    const trailSpan = Math.min(startParam, 2.8);
    const trailSamples = 18;
    const trailPts: [number, number][] = [];
    for (let i = 0; i < trailSamples; i++) {
      const t = Math.max(0, startParam - trailSpan + (i / (trailSamples - 1)) * trailSpan);
      trailPts.push(sampleTraj(t));
    }
    if (trailPts.length >= 2) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const trailGrad = ctx.createLinearGradient(
        trailPts[0][0], trailPts[0][1],
        trailPts[trailPts.length - 1][0], trailPts[trailPts.length - 1][1]
      );
      trailGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      trailGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.40)');
      trailGrad.addColorStop(1, 'rgba(16, 185, 129, 0.85)');
      ctx.strokeStyle = trailGrad;
      ctx.lineWidth = cs * 0.16;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = cs * 0.38;
      ctx.beginPath();
      buildPath(ctx, trailPts, true);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Press-squish physics (mechanical depression + damped harmonic rebound spring)
  let squish = 1.0;
  let shadowDepth = 3.0;

  if (arrow.isPressed) {
    const pressElapsed = Math.min(0.12, (now - (arrow.pressTime || now)) / 1000);
    // Mechanical depression: squash scale down to ~0.90
    squish = 1 - 0.10 * Math.sin((pressElapsed / 0.12) * (Math.PI / 2));
    // Physical contact indentation: shadow sinks towards surface
    shadowDepth = 1.0 + 2.0 * (1 - pressElapsed / 0.12);
  } else if (arrow.pressReleaseTime && now - arrow.pressReleaseTime < 280) {
    const relSec = (now - arrow.pressReleaseTime) / 1000;
    // Damped harmonic rebound spring bounce
    squish = 1 + Math.sin(relSec * 32) * Math.exp(-relSec * 13) * 0.09;
    shadowDepth = 3.0;
  }

  // Multi-axis blocked-arrow jitter (longitudinal recoil + orthogonal buzzing rattle)
  let jitterX = 0;
  let jitterY = 0;

  if (arrow.blockedJitterTime && now - arrow.blockedJitterTime < 400) {
    const t = (now - arrow.blockedJitterTime) / 1000;
    const damp = Math.exp(-t * 9.5);
    const dir = DIRECTIONS[arrow.d];
    // Longitudinal recoil (bounce away from blocker)
    const longMag = -Math.sin(t * 36) * damp * (cs * 0.28);
    // Orthogonal high-frequency rattle
    const orthoMag = Math.sin(t * 76) * damp * (cs * 0.16);
    jitterX = dir.dx * longMag + (-dir.dy) * orthoMag;
    jitterY = dir.dy * longMag + (dir.dx) * orthoMag;
  }

  // Apply centroid squish scaling & jitter translation
  let cx = 0;
  let cy = 0;
  for (const pt of points) {
    cx += pt[0];
    cy += pt[1];
  }
  cx /= points.length;
  cy /= points.length;

  for (const pt of points) {
    pt[0] = cx + (pt[0] - cx) * squish + jitterX;
    pt[1] = cy + (pt[1] - cy) * squish + jitterY;
  }

  // Aerodynamic Velocity Elongation (squash & stretch during mid-flight)
  let speedStretch = 0;
  if (arrow.isMoving) {
    const p = arrow.moveProgress;
    if (p > 0.08 && p < 0.90) {
      speedStretch = Math.sin(((p - 0.08) / 0.82) * Math.PI) * 0.22;
    }
  }

  // Elongate tip forward along current motion heading
  const headPoint = points[points.length - 1];
  const prevPoint = points[points.length - 2];
  const motionDx = headPoint[0] - prevPoint[0];
  const motionDy = headPoint[1] - prevPoint[1];
  const motionDist = Math.hypot(motionDx, motionDy);
  const headAngle = Math.atan2(motionDy, motionDx);

  if (speedStretch > 0 && motionDist > 0.001) {
    headPoint[0] += (motionDx / motionDist) * (cs * speedStretch);
    headPoint[1] += (motionDy / motionDist) * (cs * speedStretch);
  }

  // Volume-conserving tube width (widens when compressed, slims when running fast)
  const tubeWidth =
    Math.max(3.2, cs * (isCurved ? 0.22 : 0.17)) *
    (2 - squish) *
    (1 - speedStretch * 0.20);

  ctx.save();
  ctx.lineCap = isCurved ? 'round' : 'butt';
  ctx.lineJoin = isCurved ? 'round' : 'miter';

  // 1. Drop shadow pass (gives tactile elevation off the paper board)
  if (!arrow.isMoving) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = tubeWidth + 2;
    ctx.beginPath();
    buildPath(ctx, points, isCurved, shadowDepth * 0.5, shadowDepth);
    ctx.stroke();
    ctx.restore();
  }

  // 1b. Blocker danger flash pulse aura
  if (isFlashing) {
    ctx.save();
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = cs * (0.6 + 0.3 * Math.sin(now / 45));
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = tubeWidth + 4;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    buildPath(ctx, points, isCurved);
    ctx.stroke();
    ctx.restore();
  }

  // 2. Highlight glow on active/idle
  if (isHighlighted) {
    ctx.save();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = cs * (0.8 + 0.3 * Math.sin(now / 160));
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = tubeWidth + 3;
    ctx.beginPath();
    buildPath(ctx, points, isCurved);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Main arrow body tube
  ctx.save();
  ctx.strokeStyle = baseColor;
  ctx.lineWidth = tubeWidth;

  if (colorBlindMode) {
    if (arrow.d === 0) ctx.setLineDash([]);
    else if (arrow.d === 1) ctx.setLineDash([7, 3]);
    else if (arrow.d === 2) ctx.setLineDash([3, 3]);
    else if (arrow.d === 3) ctx.setLineDash([9, 2, 2, 2]);
  }

  ctx.beginPath();
  buildPath(ctx, points, isCurved);
  ctx.stroke();
  ctx.restore();

  // 4. Specular spine highlight (cylindrical light reflection along the center)
  if (skin !== 'pixel' && !colorBlindMode) {
    ctx.save();
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = tubeWidth * 0.32;
    ctx.globalAlpha = 0.42;
    ctx.beginPath();
    buildPath(ctx, points, isCurved, -0.6, -0.8);
    ctx.stroke();
    ctx.restore();
  }

  // 5. Embedded directional flow chevrons along the shaft
  if (points.length >= 2 && !arrow.isMoving) {
    drawFlowChevrons(ctx, points, cs, now, baseColor, isHighlighted);
  }

  // 5b. Sonic Bow-Shock Wave Arc ahead of head during flight
  if (arrow.isMoving && speedStretch > 0.05) {
    ctx.save();
    ctx.translate(headPoint[0], headPoint[1]);
    ctx.rotate(headAngle);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = cs * 0.28;
    ctx.beginPath();
    ctx.arc(cs * 0.22, 0, cs * 0.30, -Math.PI * 0.36, Math.PI * 0.36);
    ctx.stroke();
    ctx.restore();
  }

  // 6. Sculpted Aerodynamic Arrowhead
  ctx.save();
  ctx.translate(headPoint[0], headPoint[1]);
  ctx.rotate(headAngle);

  const headSize = cs * (skin === 'pixel' ? 0.48 : 0.42) * (1 + speedStretch * 0.2);
  renderCanvasSkinHead(ctx, skin, headSize, baseColor, highlightColor);

  ctx.restore();
}

/**
 * Builds continuous path with smooth quadratic curves for bends
 */
function buildPath(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  isCurved: boolean,
  offsetX = 0,
  offsetY = 0
) {
  ctx.moveTo(points[0][0] + offsetX, points[0][1] + offsetY);
  if (isCurved && points.length > 2) {
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i][0] + points[i + 1][0]) / 2 + offsetX;
      const yc = (points[i][1] + points[i + 1][1]) / 2 + offsetY;
      ctx.quadraticCurveTo(points[i][0] + offsetX, points[i][1] + offsetY, xc, yc);
    }
    ctx.lineTo(points[points.length - 1][0] + offsetX, points[points.length - 1][1] + offsetY);
  } else {
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0] + offsetX, points[i][1] + offsetY);
    }
  }
}

/**
 * Draws animated directional flow chevrons along the arrow body
 */
function drawFlowChevrons(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  cs: number,
  now: number,
  color: string,
  isHighlighted: boolean
) {
  if (points.length < 2) return;
  const chevronSize = cs * 0.14;
  const flowPhase = (now / 400) % 1; // Animated wave

  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = isHighlighted ? 0.8 : 0.45;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const segLen = Math.hypot(dx, dy);
    if (segLen < cs * 0.8) continue;

    const angle = Math.atan2(dy, dx);
    const midX = p1[0] + dx * ((0.5 + flowPhase * 0.3) % 1);
    const midY = p1[1] + dy * ((0.5 + flowPhase * 0.3) % 1);

    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-chevronSize, -chevronSize * 0.8);
    ctx.lineTo(0, 0);
    ctx.lineTo(-chevronSize, chevronSize * 0.8);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

