/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Volume2,
  Music,
  Vibrate,
  Volume1,
  Zap,
  Eye,
  Target,
} from 'lucide-react';
import { THEMES } from '../game/themes';
import type { ThemeId } from '../game/types';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { authService } from '../services/authService';
import { HintIcon } from './GameIcons';

interface SettingsModalProps {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  voiceEnabled: boolean;
  masterVolume: number;
  idleHelpEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  largeTapTargets: boolean;
  activeTheme: ThemeId;
  language: LanguageCode;
  showFpsOverlay: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onToggleVibration: () => void;
  onToggleVoice: () => void;
  onChangeVolume: (vol: number) => void;
  onToggleIdleHelp: () => void;
  onToggleReduceMotion: () => void;
  onToggleHighContrast: () => void;
  onToggleLargeTapTargets: () => void;
  onSelectTheme: (id: ThemeId) => void;
  onChangeLanguage: (lang: LanguageCode) => void;
  onToggleFpsOverlay: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  musicEnabled,
  vibrationEnabled,
  voiceEnabled,
  masterVolume,
  idleHelpEnabled,
  reduceMotion,
  highContrast,
  largeTapTargets,
  activeTheme,
  language,
  showFpsOverlay,
  onToggleSound,
  onToggleMusic,
  onToggleVibration,
  onToggleVoice,
  onChangeVolume,
  onToggleIdleHelp,
  onToggleReduceMotion,
  onToggleHighContrast,
  onToggleLargeTapTargets,
  onSelectTheme,
  onChangeLanguage,
  onToggleFpsOverlay,
  onResetProgress,
  onClose,
}) => {
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [deleteAccountConfirmed, setDeleteAccountConfirmed] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  const handleResetClick = () => {
    if (resetConfirmed) {
      onResetProgress();
      setResetConfirmed(false);
      onClose();
    } else {
      setResetConfirmed(true);
      setTimeout(() => setResetConfirmed(false), 4000);
    }
  };

  const handleDeleteAccountClick = async () => {
    if (deleteAccountConfirmed) {
      await authService.deleteAccountAndData();
      setDeleteAccountConfirmed(false);
      onClose();
    } else {
      setDeleteAccountConfirmed(true);
      setTimeout(() => setDeleteAccountConfirmed(false), 4000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-sm max-h-[85vh] bg-[#fcf6ee] dark:bg-[#252f3b] text-[#6b4528] dark:text-[#e2e8f0] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-black/10 dark:border-white/10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10 sticky top-0 bg-inherit z-10">
          <h2 id="settings-heading" className="text-xl font-bold">
            {t('settings')}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Switcher */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider opacity-70">
            {t('language')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'en' as const, label: 'English' },
              { code: 'hi' as const, label: 'हिंदी' },
              { code: 'mr' as const, label: 'मराठी' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => onChangeLanguage(item.code)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  language === item.code
                    ? 'bg-[#c0773a] text-white shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Toggles */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider opacity-70">Audio</label>
          <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t('sound')}</span>
              </span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={onToggleSound}
                className="w-5 h-5 accent-[#c0773a]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t('music')}</span>
              </span>
              <input
                type="checkbox"
                checked={musicEnabled}
                onChange={onToggleMusic}
                className="w-5 h-5 accent-[#c0773a]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{t('vibration')}</span>
              </span>
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={onToggleVibration}
                className="w-5 h-5 accent-[#c0773a]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume1 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('voice')}</span>
              </span>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={onToggleVoice}
                className="w-5 h-5 accent-[#c0773a]"
              />
            </div>

            {/* Volume slider */}
            <div className="pt-2 border-t border-black/10 dark:border-white/10">
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>{t('masterVolume')}</span>
                <span>{masterVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="w-full accent-[#c0773a]"
              />
            </div>
          </div>
        </div>

        {/* Gameplay & Accessibility */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider opacity-70">
            Gameplay & Accessibility
          </label>
          <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HintIcon size={18} />
                <span>{t('idleHelp')}</span>
              </span>
              <input
                type="checkbox"
                checked={idleHelpEnabled}
                onChange={onToggleIdleHelp}
                className="w-5 h-5 accent-[#c0773a]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{t('reduceMotion')}</span>
              </span>
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={onToggleReduceMotion}
                className="w-5 h-5 accent-[#c0773a]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{t('highContrast')}</span>
              </span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={onToggleHighContrast}
                className="w-5 h-5 accent-[#c0773a]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>{t('largeTapTargets')}</span>
              </span>
              <input
                type="checkbox"
                checked={largeTapTargets}
                onChange={onToggleLargeTapTargets}
                className="w-5 h-5 accent-[#c0773a]"
              />
            </div>
            <div className="flex items-center justify-between text-xs opacity-75">
              <span>Dev: Show FPS & Performance</span>
              <input
                type="checkbox"
                checked={showFpsOverlay}
                onChange={onToggleFpsOverlay}
                className="w-4 h-4 accent-[#c0773a]"
              />
            </div>
          </div>
        </div>

        {/* Themes Swatch Row */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider opacity-70">
            {t('theme')}
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {THEMES.map((th) => (
              <button
                key={th.id}
                onClick={() => onSelectTheme(th.id)}
                aria-label={`Theme ${th.name}`}
                className={`w-9 h-9 rounded-full border-2 transition-all flex-shrink-0 ${
                  activeTheme === th.id
                    ? 'border-[#c0773a] scale-110 shadow-sm ring-2 ring-amber-400'
                    : 'border-black/20'
                }`}
                style={{ backgroundColor: th.bg }}
              />
            ))}
          </div>
        </div>

        {/* Account Data & Safety Actions */}
        <div className="pt-2 space-y-2 border-t border-black/10 dark:border-white/10">
          <button
            onClick={handleResetClick}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
              resetConfirmed
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-black/5 dark:bg-white/5 hover:bg-black/10'
            }`}
          >
            {resetConfirmed ? t('resetProgressConfirm') : t('resetProgress')}
          </button>

          <button
            onClick={handleDeleteAccountClick}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
              deleteAccountConfirmed
                ? 'bg-red-700 text-white animate-pulse'
                : 'text-red-600 dark:text-red-400 opacity-80 hover:opacity-100'
            }`}
          >
            {deleteAccountConfirmed ? 'Tap again to permanently delete all data' : t('deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};
