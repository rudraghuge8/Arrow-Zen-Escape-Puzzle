/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_STORAGE_DATA, type StorageDataV2 } from './schema';

const STORAGE_KEY = 'arrow_zen_save_v2';
const LEGACY_STORAGE_KEY = 'ae';

class StorageManager {
  private cache: StorageDataV2;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.cache = this.loadSafe();
  }

  public getData(): StorageDataV2 {
    return { ...this.cache };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Storage listener error:', e);
      }
    });
  }

  public update(updater: (data: StorageDataV2) => void): void {
    try {
      updater(this.cache);
      this.saveSafe();
      this.notify();
    } catch (e) {
      console.warn('Failed to update storage state:', e);
    }
  }

  public resetAllProgress(): void {
    this.cache = {
      ...DEFAULT_STORAGE_DATA,
      soundEnabled: this.cache.soundEnabled,
      musicEnabled: this.cache.musicEnabled,
      language: this.cache.language,
      profile: this.cache.profile,
    };
    this.saveSafe();
    this.notify();
  }

  private saveSafe(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  private loadSafe(): StorageDataV2 {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_STORAGE_DATA };
    }

    try {
      // 1. Try loading V2 schema
      const rawV2 = window.localStorage.getItem(STORAGE_KEY);
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        if (parsed && parsed.version === 2) {
          // Merge with defaults to ensure any newly added fields exist
          const mergedThemes = Array.isArray(parsed.unlockedThemes)
            ? Array.from(new Set([...parsed.unlockedThemes, 8]))
            : DEFAULT_STORAGE_DATA.unlockedThemes;

          return {
            ...DEFAULT_STORAGE_DATA,
            ...parsed,
            unlockedThemes: mergedThemes,
            activeTheme: parsed.activeTheme !== undefined ? parsed.activeTheme : 8,
            todayStats: {
              ...DEFAULT_STORAGE_DATA.todayStats,
              ...(parsed.todayStats || {}),
            },
            dailyChallenge: {
              ...DEFAULT_STORAGE_DATA.dailyChallenge,
              ...(parsed.dailyChallenge || {}),
            },
            loginCalendar: {
              ...DEFAULT_STORAGE_DATA.loginCalendar,
              ...(parsed.loginCalendar || {}),
            },
            boosters: {
              ...DEFAULT_STORAGE_DATA.boosters,
              ...(parsed.boosters || {}),
            },
          };
        }
      }

      // 2. Try migrating legacy V1 'ae' data
      const rawLegacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (rawLegacy) {
        const legacy = JSON.parse(rawLegacy);
        if (legacy && typeof legacy === 'object') {
          const migrated: StorageDataV2 = {
            ...DEFAULT_STORAGE_DATA,
            unlockedLevel: Math.max(1, Math.min(500, Number(legacy.u) || 1)),
            currentLevel: Math.max(1, Math.min(500, Number(legacy.u) || 1)),
            soundEnabled: legacy.sd !== undefined ? Boolean(legacy.sd) : true,
            vibrationEnabled: legacy.vb !== undefined ? Boolean(legacy.vb) : true,
            musicEnabled: legacy.mu !== undefined ? Boolean(legacy.mu) : true,
            voiceEnabled: legacy.vo !== undefined ? Boolean(legacy.vo) : false,
            masterVolume: typeof legacy.mv === 'number' ? legacy.mv : 60,
            activeTheme: typeof legacy.th === 'number' ? legacy.th : 0,
            totalStars: Number(legacy.ts) || 0,
            flawlessWins: Number(legacy.fl) || 0,
            profile: legacy.pf
              ? {
                  name: legacy.pf.n || 'Player',
                  avatar: legacy.pf.a || 'fox',
                  email: legacy.pf.e || '',
                  isGuest: Boolean(legacy.gs),
                }
              : null,
          };
          // Persist upgraded schema immediately
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      }
    } catch (err) {
      console.warn('Storage parse error, resetting to clean defaults:', err);
    }

    return { ...DEFAULT_STORAGE_DATA };
  }
}

export const storage = new StorageManager();
