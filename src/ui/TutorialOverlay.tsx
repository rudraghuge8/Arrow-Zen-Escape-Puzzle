/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { Mascot } from './Mascot';
import { getTranslation, type LanguageCode } from '../i18n/translations';

interface TutorialOverlayProps {
  levelNumber: number;
  language: LanguageCode;
  onDismiss?: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  levelNumber,
  language,
  onDismiss,
}) => {
  if (levelNumber > 5) return null;

  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  const getTutorialMessage = () => {
    switch (levelNumber) {
      case 1:
        return t('tutorialStep1');
      case 2:
        return t('tutorialStep2');
      case 3:
        return t('tutorialStep3');
      case 4:
        return t('tutorialStep4');
      case 5:
        return t('tutorialStep5');
      default:
        return '';
    }
  };

  return (
    <div className="relative mx-auto w-[min(92vw,390px)] z-10 pointer-events-none select-none px-2 my-1 shrink-0">
      <div className="flex items-center gap-3 glass-card rounded-2xl p-3 shadow-lg pointer-events-auto border border-theme-subtle">
        <Mascot mood="happy" size={38} />
        <div className="flex-1 text-left">
          <p className="text-[10px] font-bold text-teal-500 uppercase tracking-wider">
            Tutorial · Step {levelNumber}/5
          </p>
          <p className="text-xs leading-snug mt-0.5 font-medium opacity-90 text-[var(--theme-text)]">
            {getTutorialMessage()}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss tutorial hint"
            className="w-7 h-7 flex items-center justify-center rounded-lg glass-button text-xs font-bold active:scale-95 transition-transform text-[var(--theme-text)]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
