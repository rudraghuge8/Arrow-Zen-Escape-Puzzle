/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import type { UserProfile } from '../storage/schema';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { authService } from '../services/authService';
import { CharacterAvatar, AVATAR_KEYS } from './GameIcons';

interface ProfileScreenProps {
  profile: UserProfile | null;
  unlockedLevel: number;
  totalStars: number;
  flawlessWins: number;
  todayLevelsCleared: number;
  language: LanguageCode;
  onSaveProfile: (profile: UserProfile) => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  unlockedLevel,
  totalStars,
  flawlessWins,
  todayLevelsCleared,
  language,
  onSaveProfile,
  onBack,
}) => {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || 'fox');
  const [isSaved, setIsSaved] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  const handleSave = () => {
    const updated: UserProfile = {
      name: name.trim() || 'Player',
      avatar: selectedAvatar,
      email: email.trim(),
      userId: profile?.userId || 'usr_' + Math.random().toString(36).substring(2, 9),
      isGuest: false,
    };
    onSaveProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleGoogleLogin = async () => {
    const user = await authService.loginWithGoogle();
    setName(user.displayName);
    setEmail(user.email);
    setSelectedAvatar(user.avatar);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f5e7d3] dark:bg-[#1c242d] text-[#6b4528] dark:text-[#9fb0cb] select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10 bg-inherit sticky top-0 z-20">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 active:scale-90 transition-transform text-slate-800 dark:text-slate-100 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{t('profile')}</h2>
        <div className="w-11" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-sm mx-auto w-full">
        {/* Avatar Display & Selector */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-black/5 dark:bg-white/5 rounded-3xl shadow-sm">
            <CharacterAvatar id={selectedAvatar} size={64} />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {AVATAR_KEYS.map((av) => (
              <button
                key={av}
                onClick={() => setSelectedAvatar(av)}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                  selectedAvatar === av
                    ? 'bg-amber-500/20 ring-2 ring-amber-500 scale-105 shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                <CharacterAvatar id={av} size={32} />
              </button>
            ))}
          </div>
        </div>

        {/* Name and Email Inputs */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-1 text-left">
              {t('yourName')}
            </label>
            <input
              type="text"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Zen Master"
              className="w-full px-3 py-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-inherit font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#c0773a]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-1 text-left">
              {t('emailOptional')}
            </label>
            <input
              type="email"
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="zen.solver@example.com"
              className="w-full px-3 py-2.5 rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-inherit font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#c0773a]"
            />
          </div>
        </div>

        {/* Cloud Login Options */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all text-gray-800 dark:text-gray-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#c0773a] hover:bg-[#aa632c] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Profile Saved!</span>
              </>
            ) : (
              t('saveAndContinue')
            )}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="pt-3 border-t border-black/10 dark:border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2 text-left">
            {t('stats')}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl">
              <p className="text-xl font-bold tabular-nums">{Math.max(0, unlockedLevel - 1)}</p>
              <p className="text-[11px] opacity-75">{t('levelsCleared')}</p>
            </div>
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl">
              <p className="text-xl font-bold tabular-nums">{totalStars}</p>
              <p className="text-[11px] opacity-75">{t('totalStars')}</p>
            </div>
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl">
              <p className="text-xl font-bold tabular-nums">{flawlessWins}</p>
              <p className="text-[11px] opacity-75">{t('flawlessWins')}</p>
            </div>
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl">
              <p className="text-xl font-bold tabular-nums">{todayLevelsCleared}</p>
              <p className="text-[11px] opacity-75">{t('todayLevels')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
