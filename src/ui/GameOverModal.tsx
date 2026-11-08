/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Tv, RotateCcw } from 'lucide-react';
import { Mascot } from './Mascot';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { DropIcon } from './GameIcons';

interface GameOverModalProps {
  coins: number;
  language: LanguageCode;
  onRetry: () => void;
  onContinueWithCoins: () => void;
  onWatchAdForDrop: () => void;
  onGoToHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  coins,
  language,
  onRetry,
  onContinueWithCoins,
  onWatchAdForDrop,
  onGoToHome,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-sm glass-card text-[var(--theme-text)] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center border border-theme-subtle backdrop-blur-2xl">
        {/* Top-left back button */}
        <button
          onClick={onGoToHome}
          aria-label="Back to home"
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-xl glass-button transition-transform active:scale-90 text-[var(--theme-text)] border border-theme-subtle cursor-pointer z-10"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <Mascot mood="worried" size={68} />

        <h2 id="gameover-heading" className="text-2xl font-bold tracking-tight text-[var(--theme-text)]">
          {t('outOfDrops')}
        </h2>

        <p className="text-sm opacity-85 leading-relaxed text-[var(--theme-text)]">
          Patience is the key to Zen. Take a breath and try once more.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-2">
          {/* Continue with coins if affordable */}
          {coins >= 25 && (
            <button
              onClick={onContinueWithCoins}
              className="w-full min-h-[48px] py-3 bg-gradient-to-r from-sky-500/90 to-blue-600/90 hover:from-sky-500 hover:to-blue-600 active:scale-[0.98] text-white font-bold rounded-2xl shadow-xl shadow-sky-500/25 border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <DropIcon size={20} active />
              <span>{t('continueWithDrop')}</span>
            </button>
          )}

          {/* Watch Ad for +1 Drop */}
          <button
            onClick={onWatchAdForDrop}
            className="w-full min-h-[48px] py-3 bg-gradient-to-r from-amber-500/90 to-orange-500/90 hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] text-white font-bold rounded-2xl shadow-xl shadow-amber-500/25 border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <Tv className="w-5 h-5" />
            <span>{t('watchAdForReward', { reward: '1 Drop' })}</span>
          </button>

          {/* Try Again (Free) */}
          <button
            onClick={onRetry}
            className="w-full min-h-[48px] py-3.5 glass-button active:scale-[0.98] text-[var(--theme-text)] font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-2 border border-theme-subtle"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t('tryAgain')}</span>
          </button>

          <button
            onClick={onGoToHome}
            className="w-full py-2.5 text-sm opacity-75 hover:opacity-100 transition-opacity font-semibold text-[var(--theme-text)]"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
