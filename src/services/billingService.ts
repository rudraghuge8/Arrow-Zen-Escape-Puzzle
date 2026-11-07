/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { storage } from '../storage/storage';
import { analytics } from './analyticsService';
import type { PurchaseItem } from './types';

const REMOVE_ADS_KEY = 'zen_iap_remove_ads';

export const IAP_CATALOG: PurchaseItem[] = [
  {
    id: 'remove_ads',
    title: 'Remove Ads',
    description: 'Permanently removes banner and interstitial ads forever.',
    priceFormatted: '$1.99',
    type: 'inapp',
  },
  {
    id: 'coins_100',
    title: '100 Zen Coins',
    description: 'A pocketful of coins for hints and boosters.',
    priceFormatted: '$0.99',
    type: 'inapp',
  },
  {
    id: 'coins_500',
    title: '500 Zen Coins',
    description: 'Popular pack! Unlock exclusive arrow skins and themes.',
    priceFormatted: '$2.99',
    type: 'inapp',
  },
  {
    id: 'coins_1500',
    title: '1500 Zen Coins',
    description: 'Best value treasury of coins for the dedicated solver.',
    priceFormatted: '$6.99',
    type: 'inapp',
  },
];

class BillingService {
  private adsRemoved = false;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.adsRemoved = localStorage.getItem(REMOVE_ADS_KEY) === 'true';
    }
  }

  public isAdsRemoved(): boolean {
    return this.adsRemoved;
  }

  public getProducts(): PurchaseItem[] {
    return [...IAP_CATALOG];
  }

  public async purchase(productId: string): Promise<{ success: boolean; message: string }> {
    analytics.logEvent('purchase_attempt', { productId });

    if (productId === 'remove_ads') {
      this.adsRemoved = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem(REMOVE_ADS_KEY, 'true');
      }
      analytics.logEvent('purchase_success', { productId });
      return { success: true, message: 'Ads removed successfully!' };
    }

    if (productId === 'coins_100') {
      storage.update((d) => (d.coins += 100));
      analytics.logEvent('purchase_success', { productId, coinsAdded: 100 });
      return { success: true, message: 'Added 100 Zen Coins to your balance!' };
    }

    if (productId === 'coins_500') {
      storage.update((d) => (d.coins += 500));
      analytics.logEvent('purchase_success', { productId, coinsAdded: 500 });
      return { success: true, message: 'Added 500 Zen Coins to your balance!' };
    }

    if (productId === 'coins_1500') {
      storage.update((d) => (d.coins += 1500));
      analytics.logEvent('purchase_success', { productId, coinsAdded: 1500 });
      return { success: true, message: 'Added 1500 Zen Coins to your balance!' };
    }

    return { success: false, message: 'Product not recognized.' };
  }

  public async restorePurchases(): Promise<boolean> {
    if (typeof window !== 'undefined' && localStorage.getItem(REMOVE_ADS_KEY) === 'true') {
      this.adsRemoved = true;
      return true;
    }
    return false;
  }
}

export const billingService = new BillingService();
