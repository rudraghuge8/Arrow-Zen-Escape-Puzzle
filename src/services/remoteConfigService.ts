/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RemoteConfigValues {
  dailyLoginRewardCoins: number;
  hintCostCoins: number;
  undoCostCoins: number;
  boosterBombCostCoins: number;
  boosterXrayCostCoins: number;
  boosterExtraDropCostCoins: number;
  adInterstitialFrequencyLevels: number;
  doubleCoinsAdMultiplier: number;
}

const DEFAULT_REMOTE_CONFIG: RemoteConfigValues = {
  dailyLoginRewardCoins: 50,
  hintCostCoins: 30,
  undoCostCoins: 15,
  boosterBombCostCoins: 45,
  boosterXrayCostCoins: 40,
  boosterExtraDropCostCoins: 35,
  adInterstitialFrequencyLevels: 4,
  doubleCoinsAdMultiplier: 2,
};

class RemoteConfigService {
  private values: RemoteConfigValues = { ...DEFAULT_REMOTE_CONFIG };

  public get<K extends keyof RemoteConfigValues>(key: K): RemoteConfigValues[K] {
    return this.values[key];
  }

  public getAll(): RemoteConfigValues {
    return { ...this.values };
  }
}

export const remoteConfig = new RemoteConfigService();
