/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { storage } from '../storage/storage';
import type { StorageDataV2 } from '../storage/schema';
import { authService } from './authService';

class CloudSaveService {
  private lastSyncTime = 0;
  private isSyncing = false;

  public async syncProgress(): Promise<{ success: boolean; merged: boolean }> {
    const user = authService.getCurrentUser();
    if (!user || user.isGuest) {
      // Local-only for guests
      return { success: true, merged: false };
    }

    if (this.isSyncing) return { success: true, merged: false };
    this.isSyncing = true;

    try {
      const localData = storage.getData();

      // In mock/offline mode: simulate successful cloud merge
      const remoteMockLevel = Number(localStorage.getItem('zen_cloud_mock_level') || 0);
      let merged = false;

      if (remoteMockLevel > localData.unlockedLevel) {
        storage.update((d) => {
          d.unlockedLevel = remoteMockLevel;
          d.currentLevel = remoteMockLevel;
        });
        merged = true;
      } else {
        localStorage.setItem('zen_cloud_mock_level', String(localData.unlockedLevel));
      }

      this.lastSyncTime = Date.now();
      return { success: true, merged };
    } catch (e) {
      console.warn('Cloud sync offline fallback:', e);
      return { success: false, merged: false };
    } finally {
      this.isSyncing = false;
    }
  }

  public getLastSyncTime(): number {
    return this.lastSyncTime;
  }
}

export const cloudSaveService = new CloudSaveService();
