/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { storage } from '../storage/storage';
import { analytics } from './analyticsService';
import { billingService } from './billingService';

export type AdRewardType = 'hint' | 'undo' | 'extraDrop' | 'doubleCoins' | 'coins';

class AdService {
  private levelsSinceLastAd = 0;
  private isFirstSession = true;
  private adOverlayCallback: ((rewardGranted: boolean) => void) | null = null;
  private isAdShowing = false;

  public canShowInterstitial(currentLevel: number, justFailed = false): boolean {
    if (billingService.isAdsRemoved()) return false;
    if (this.isFirstSession) return false;
    if (currentLevel <= 10) return false;
    if (justFailed) return false;
    return this.levelsSinceLastAd >= 3;
  }

  public recordLevelCompleted(): void {
    this.levelsSinceLastAd++;
    this.isFirstSession = false;
  }

  public async showInterstitial(): Promise<boolean> {
    if (billingService.isAdsRemoved()) return false;
    this.levelsSinceLastAd = 0;
    analytics.logEvent('ad_watched', { type: 'interstitial', provider: 'admob_mock' });
    return true;
  }

  public registerAdModal(callback: (type: AdRewardType, onComplete: (granted: boolean) => void) => void) {
    this.adModalTrigger = callback;
  }

  private adModalTrigger: ((type: AdRewardType, onComplete: (granted: boolean) => void) => void) | null = null;

  public async showRewardedAd(rewardType: AdRewardType): Promise<boolean> {
    return new Promise((resolve) => {
      analytics.logEvent('ad_watched', { type: 'rewarded', reward: rewardType });
      if (this.adModalTrigger) {
        this.adModalTrigger(rewardType, (granted) => {
          resolve(granted);
        });
      } else {
        // Fallback instant reward
        resolve(true);
      }
    });
  }
}

export const adService = new AdService();
