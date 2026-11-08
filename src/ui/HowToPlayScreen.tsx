/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Play, Navigation, AlertTriangle, Eye } from 'lucide-react';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { DropIcon, BombIcon, StarIcon } from './GameIcons';

interface HowToPlayScreenProps {
  language: LanguageCode;
  onBack: () => void;
  onStartPlaying: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({
  language,
  onBack,
  onStartPlaying,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  const RULES = [
    {
      icon: <Navigation className="w-6 h-6 text-amber-600 dark:text-amber-400 rotate-45" />,
      title: 'Slide Out',
      desc: t('rule1'),
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-rose-500" />,
      title: 'Clear Path Required',
      desc: t('rule2'),
    },
    {
      icon: <DropIcon size={24} active />,
      title: '3 Drops Per Level',
      desc: t('rule3'),
    },
    {
      icon: <Eye className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      title: 'Long Press to Preview',
      desc: t('rule4'),
    },
    {
      icon: <BombIcon size={24} />,
      title: 'Power-ups & Boosters',
      desc: 'Use Bombs to remove blocker arrows, X-Ray to reveal all free arrows, or Extra Drops when in need.',
    },
    {
      icon: <StarIcon size={24} filled />,
      title: 'Mastery & Stars',
      desc: 'Complete levels without losing drops and within par rounds to earn a flawless 3-star rating!',
    },
  ];

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
        <h2 className="text-lg font-bold text-[var(--theme-text)] tracking-wide">{t('howToPlay')}</h2>
        <div className="w-11" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-sm mx-auto w-full">
        {RULES.map((rule, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl glass-card flex items-start gap-3.5 text-left border border-theme-subtle"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl glass-panel-subtle shrink-0 border border-theme-subtle">
              {rule.icon}
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--theme-text)]">{rule.title}</h4>
              <p className="text-xs opacity-75 mt-0.5 leading-relaxed">{rule.desc}</p>
            </div>
          </div>
        ))}

        <div className="pt-2">
          <button
            onClick={onStartPlaying}
            className="w-full min-h-[48px] py-3.5 bg-linear-to-r from-teal-500 to-cyan-500 hover:brightness-110 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-lg glass-glow-cyan transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t('continueGame')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
