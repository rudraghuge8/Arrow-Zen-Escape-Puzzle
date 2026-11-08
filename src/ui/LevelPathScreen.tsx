/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { ArrowLeft, Crown, Lock } from 'lucide-react';
import { WORLDS } from '../game/generator';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { StarIcon } from './GameIcons';

interface LevelPathScreenProps {
  unlockedLevel: number;
  currentLevel: number;
  levelStars: Record<number, number>;
  language: LanguageCode;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

export const LevelPathScreen: React.FC<LevelPathScreenProps> = ({
  unlockedLevel,
  currentLevel,
  levelStars,
  language,
  onSelectLevel,
  onBack,
}) => {
  const currentLevelRef = useRef<HTMLButtonElement | null>(null);

  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  // Auto-scroll to current active level node
  useEffect(() => {
    if (currentLevelRef.current) {
      currentLevelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [unlockedLevel]);

  return (
    <div className="w-full h-full flex flex-col bg-transparent text-[var(--theme-text)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-theme-subtle glass-panel-subtle sticky top-0 z-20">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-11 h-11 flex items-center justify-center rounded-xl glass-button active:scale-90 transition-transform text-[var(--theme-text)] border border-theme-subtle"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-[var(--theme-text)] tracking-wide">{t('levels')}</h2>
        <div className="w-11" />
      </div>

      {/* Scrollable World Path List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {WORLDS.map((world) => {
          const startL = world.levels[0];
          const endL = world.levels[1];
          const isWorldUnlocked = unlockedLevel >= startL;

          return (
            <div
              key={world.index}
              className={`rounded-3xl p-4.5 transition-all border border-theme-subtle ${
                isWorldUnlocked
                  ? 'glass-card'
                  : 'glass-panel-subtle opacity-50'
              }`}
            >
              {/* World Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-500">
                    World {world.index + 1}
                  </span>
                  <h3 className="text-base font-bold text-[var(--theme-text)]">{world.name}</h3>
                </div>
                <span className="text-xs font-semibold opacity-75">
                  Levels {startL}–{endL}
                </span>
              </div>

              {/* Levels Grid */}
              <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: endL - startL + 1 }, (_, idx) => {
                  const levelNum = startL + idx;
                  const isUnlocked = levelNum <= unlockedLevel;
                  const isCurrent = levelNum === currentLevel;
                  const stars = levelStars[levelNum] || 0;
                  const isBoss = levelNum % 25 === 0;

                  return (
                    <button
                      key={levelNum}
                      ref={isCurrent ? currentLevelRef : null}
                      disabled={!isUnlocked}
                      onClick={() => onSelectLevel(levelNum)}
                      aria-label={`Level ${levelNum}${stars ? `, ${stars} stars` : ''}${!isUnlocked ? ', locked' : ''}`}
                      className={`relative min-h-[50px] flex flex-col items-center justify-center py-2 rounded-2xl font-bold transition-all border border-theme-subtle ${
                        isCurrent
                          ? 'bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-lg glass-glow-cyan scale-105 ring-2 ring-cyan-300'
                          : isUnlocked
                            ? 'glass-button text-[var(--theme-text)] hover:scale-105 active:scale-95'
                            : 'bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 cursor-not-allowed border-transparent'
                      }`}
                    >
                      <span className="text-sm">{levelNum}</span>

                      {/* Stars indicator */}
                      <div className="h-3 flex items-center justify-center gap-0.5">
                        {isUnlocked ? (
                          stars > 0 ? (
                            Array.from({ length: stars }).map((_, sIdx) => (
                              <StarIcon key={sIdx} size={8} filled />
                            ))
                          ) : (
                            <span className="text-[10px] opacity-40">•</span>
                          )
                        ) : (
                          <Lock className="w-2.5 h-2.5 opacity-40" />
                        )}
                      </div>

                      {/* Boss badge */}
                      {isBoss && (
                        <div className="absolute -top-1 -right-1">
                          <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-300 drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
