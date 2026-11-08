/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import type { AdRewardType } from '../services/adService';
import { soundEngine } from '../audio/soundEngine';

interface AdRewardModalProps {
  rewardType: AdRewardType;
  onRewardClaimed: (granted: boolean) => void;
  onClose: () => void;
}

export const AdRewardModal: React.FC<AdRewardModalProps> = ({
  rewardType,
  onRewardClaimed,
  onClose,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClaim(true);
          soundEngine.playSfx('coin');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    onRewardClaimed(true);
  };

  const handleSkip = () => {
    onRewardClaimed(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="relative w-full max-w-sm glass-card text-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center pt-12">
        {/* Top-left back button */}
        <button
          onClick={handleSkip}
          aria-label="Back"
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-xl glass-button transition-transform active:scale-90 text-white/80 hover:text-white border border-white/20 cursor-pointer z-10"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="w-full flex items-center justify-between text-xs opacity-75">
          <span className="glass-panel-subtle text-amber-300 font-bold px-2.5 py-0.5 rounded border border-amber-400/30">
            Ad Sponsored
          </span>
          <span>{canClaim ? 'Reward Unlocked' : `Reward in ${secondsLeft}s`}</span>
        </div>

        {/* Video simulation box */}
        <div className="w-full h-44 bg-gradient-to-br from-indigo-950/80 via-slate-900/80 to-teal-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 border border-white/10 relative overflow-hidden shadow-inner">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl glass-panel-subtle text-teal-300">
            <Sparkles className="w-7 h-7 text-teal-300 animate-pulse" />
          </div>
          <p className="text-sm font-bold mt-2 text-teal-300">Zen Mind Meditation</p>
          <p className="text-[11px] opacity-75 mt-0.5">Find stillness between every puzzle move.</p>

          {!canClaim && (
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full glass-panel-subtle flex items-center justify-center text-xs font-mono font-bold">
              {secondsLeft}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2 pt-2">
          {canClaim ? (
            <button
              onClick={handleClaim}
              className="w-full py-3.5 bg-linear-to-r from-teal-500 to-cyan-500 hover:brightness-110 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-lg glass-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Claim Reward!</span>
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="w-full py-2.5 text-xs opacity-50 hover:opacity-100 transition-opacity"
            >
              Skip (No reward)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
