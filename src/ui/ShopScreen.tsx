/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Palette, Zap, Coins } from 'lucide-react';
import { THEMES } from '../game/themes';
import type { ArrowSkinId, ThemeId, BoosterType } from '../game/types';
import { getTranslation, type LanguageCode } from '../i18n/translations';
import { billingService, IAP_CATALOG } from '../services/billingService';
import { soundEngine } from '../audio/soundEngine';
import { CoinIcon, DropIcon, BombIcon, XrayIcon, ShieldIcon } from './GameIcons';
import { SKINS_CATALOG, ArrowSkinSvg } from '../game/skins';

interface ShopScreenProps {
  coins: number;
  unlockedSkins: ArrowSkinId[];
  unlockedThemes: ThemeId[];
  activeSkin: ArrowSkinId;
  activeTheme: ThemeId;
  language: LanguageCode;
  onSelectSkin: (skin: ArrowSkinId) => void;
  onUnlockSkin: (skin: ArrowSkinId, cost: number) => void;
  onSelectTheme: (themeId: ThemeId) => void;
  onUnlockTheme: (themeId: ThemeId, cost: number) => void;
  onBuyBooster: (booster: BoosterType, cost: number) => void;
  onBack: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  coins,
  unlockedSkins,
  unlockedThemes,
  activeSkin,
  activeTheme,
  language,
  onSelectSkin,
  onUnlockSkin,
  onSelectTheme,
  onUnlockTheme,
  onBuyBooster,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'themes' | 'boosters' | 'coins'>('skins');
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string | number>) =>
    getTranslation(language, key, params);

  const handleIapPurchase = async (productId: string) => {
    soundEngine.playSfx('button');
    const res = await billingService.purchase(productId);
    setPurchaseStatus(res.message);
    setTimeout(() => setPurchaseStatus(null), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f5e7d3] dark:bg-[#1c242d] text-[#6b4528] dark:text-[#9fb0cb] select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10 bg-inherit sticky top-0 z-20">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 active:scale-90 transition-transform text-slate-800 dark:text-slate-100 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{t('shop')}</h2>

        <div className="flex items-center gap-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs">
          <CoinIcon size={16} />
          <span>{coins}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-around border-b border-black/10 dark:border-white/10 px-2 py-2 text-xs font-bold bg-black/5 dark:bg-white/5">
        {(
          [
            { id: 'skins', label: 'skins', icon: Sparkles },
            { id: 'themes', label: 'themes', icon: Palette },
            { id: 'boosters', label: 'boosters', icon: Zap },
            { id: 'coins', label: 'coins', icon: Coins },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[38px] py-1.5 px-3 rounded-xl capitalize transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#c0773a] text-white shadow-sm'
                  : 'text-inherit opacity-70 hover:opacity-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback Toast */}
      {purchaseStatus && (
        <div className="mx-4 mt-3 p-2 bg-emerald-500 text-white text-xs font-bold text-center rounded-xl shadow-md flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4" />
          <span>{purchaseStatus}</span>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* SKINS TAB */}
        {activeTab === 'skins' && (
          <div className="grid grid-cols-1 gap-3">
            {SKINS_CATALOG.map((s) => {
              const isUnlocked = unlockedSkins.includes(s.id);
              const isActive = activeSkin === s.id;

              return (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400'
                      : 'bg-white/60 dark:bg-black/30 border-black/10 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left min-w-0">
                    {/* Stylized vector SVG arrow preview */}
                    <div className="w-16 h-12 shrink-0 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
                      <ArrowSkinSvg skin={s.id} size={54} animated={isActive} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-sm sm:text-base flex items-center gap-2 truncate">
                        {s.name}
                        {isActive && (
                          <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] opacity-75 line-clamp-2 mt-0.5">{s.desc}</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isUnlocked ? (
                      <button
                        disabled={isActive}
                        onClick={() => onSelectSkin(s.id)}
                        className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-black/10 text-inherit opacity-60'
                            : 'bg-[#c0773a] text-white hover:bg-[#a9652d] active:scale-95'
                        }`}
                      >
                        {isActive ? 'Equipped' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onUnlockSkin(s.id, s.cost)}
                        disabled={coins < s.cost}
                        className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          coins >= s.cost
                            ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                            : 'bg-black/10 text-inherit opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <span>{s.cost}</span>
                        <CoinIcon size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THEMES TAB */}
        {activeTab === 'themes' && (
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((th) => {
              const isUnlocked = unlockedThemes.includes(th.id);
              const isActive = activeTheme === th.id;
              const cost = th.id === 0 ? 0 : 120;

              return (
                <div
                  key={th.id}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'border-amber-500 ring-2 ring-amber-400'
                      : 'border-black/10 dark:border-white/10'
                  }`}
                  style={{ backgroundColor: th.bg, color: th.line }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{th.name}</span>
                    <div
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: th.drop }}
                    />
                  </div>

                  {isUnlocked ? (
                    <button
                      disabled={isActive}
                      onClick={() => onSelectTheme(th.id)}
                      className="w-full min-h-[40px] py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        backgroundColor: isActive ? 'rgba(0,0,0,0.1)' : th.line,
                        color: th.bg,
                      }}
                    >
                      {isActive ? 'Active' : 'Apply'}
                    </button>
                  ) : (
                    <button
                      onClick={() => onUnlockTheme(th.id, cost)}
                      disabled={coins < cost}
                      className="w-full min-h-[40px] py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      <span>{cost}</span>
                      <CoinIcon size={12} />
                      <span>Unlock</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* BOOSTERS TAB */}
        {activeTab === 'boosters' && (
          <div className="grid grid-cols-1 gap-3">
            {[
              { type: 'bomb' as BoosterType, icon: BombIcon, name: t('bombBooster'), desc: t('bombDesc'), cost: 45 },
              { type: 'xray' as BoosterType, icon: XrayIcon, name: t('xrayBooster'), desc: t('xrayDesc'), cost: 40 },
              { type: 'extraDrop' as BoosterType, icon: DropIcon, name: t('extraDropBooster'), desc: t('extraDropDesc'), cost: 35 },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.type}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-black/30 border border-black/10 dark:border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/10">
                      <Icon size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-base">{b.name}</h4>
                      <p className="text-xs opacity-75">{b.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onBuyBooster(b.type, b.cost)}
                    disabled={coins < b.cost}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      coins >= b.cost
                        ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                        : 'bg-black/10 text-inherit opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span>{b.cost}</span>
                    <CoinIcon size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* COINS & IAP TAB */}
        {activeTab === 'coins' && (
          <div className="space-y-3">
            {IAP_CATALOG.map((item) => {
              const isPurchased = item.id === 'remove_ads' && billingService.isAdsRemoved();

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-black/30 border border-black/10 dark:border-white/10 flex items-center justify-between"
                >
                  <div className="text-left">
                    <h4 className="font-bold text-base flex items-center gap-2">
                      {item.id === 'remove_ads' ? <ShieldIcon size={20} /> : <CoinIcon size={20} />}
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-xs opacity-75 mt-0.5">{item.description}</p>
                  </div>

                  <button
                    disabled={isPurchased}
                    onClick={() => handleIapPurchase(item.id)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isPurchased
                        ? 'bg-black/10 text-inherit opacity-50 cursor-not-allowed'
                        : 'bg-[#c0773a] text-white hover:bg-[#a9652d] active:scale-95 shadow-sm'
                    }`}
                  >
                    {isPurchased ? t('purchased') : item.priceFormatted}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
