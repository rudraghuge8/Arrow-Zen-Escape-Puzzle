/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
  timestamp: number;
}

class AnalyticsService {
  private eventLog: AnalyticsEvent[] = [];

  public logEvent(name: string, params?: Record<string, string | number | boolean>): void {
    const event: AnalyticsEvent = {
      name,
      params,
      timestamp: Date.now(),
    };
    this.eventLog.push(event);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${name}`, params || '');
    }
  }

  public getEventHistory(): AnalyticsEvent[] {
    return [...this.eventLog];
  }
}

export const analytics = new AnalyticsService();
