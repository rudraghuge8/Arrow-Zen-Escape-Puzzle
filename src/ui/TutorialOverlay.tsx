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
    <div className="fixed top-20 inset-x-0 mx-auto w-[min(90vw,380px)] z-20 pointer-events-none select-none">
      <div className="flex items-center gap-3 bg-white/95 dark:bg-black/90 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-lg pointer-events-auto animate-bounce-subtle">
        <Mascot mood="happy" size={42} />
        <div className="flex-1 text-left">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Tutorial · Step {levelNumber}/5
          </p>
          <p className="text-xs leading-snug mt-0.5 font-medium opacity-90">
            {getTutorialMessage()}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss tutorial hint"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-bold active:scale-95 transition-transform"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
