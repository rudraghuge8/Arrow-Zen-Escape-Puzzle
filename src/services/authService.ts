/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AuthUser } from './types';
import { storage } from '../storage/storage';

type AuthListener = (user: AuthUser | null) => void;

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: Set<AuthListener> = new Set();
  private isFirebaseConfigured = false;

  constructor() {
    this.init();
  }

  private init() {
    // Check if Firebase config exists in window / env
    const hasConfig = Boolean(
      typeof process !== 'undefined' &&
        process.env &&
        process.env.VITE_FIREBASE_API_KEY
    );
    this.isFirebaseConfigured = hasConfig;

    // Load persisted session
    const saved = storage.getData().profile;
    if (saved) {
      this.currentUser = {
        uid: saved.userId || 'guest_' + Math.random().toString(36).substring(2, 9),
        displayName: saved.name || 'Player',
        email: saved.email || '',
        avatar: saved.avatar || 'fox',
        isGuest: saved.isGuest,
      };
    }
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    listener(this.currentUser);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.currentUser));
  }

  public async loginAsGuest(name = 'Player', avatar = 'fox'): Promise<AuthUser> {
    const user: AuthUser = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      displayName: name.trim() || 'Player',
      email: '',
      avatar,
      isGuest: true,
    };
    this.currentUser = user;
    storage.update((d) => {
      d.profile = {
        name: user.displayName,
        avatar: user.avatar,
        email: user.email,
        userId: user.uid,
        isGuest: true,
      };
    });
    this.notify();
    return user;
  }

  public async loginWithGoogle(): Promise<AuthUser> {
    // High fidelity Mock Google OAuth when Firebase keys not provided
    const user: AuthUser = {
      uid: 'goog_' + Math.random().toString(36).substring(2, 9),
      displayName: 'Google Zen Master',
      email: 'zen.player@gmail.com',
      avatar: 'panda',
      isGuest: false,
    };
    this.currentUser = user;
    storage.update((d) => {
      d.profile = {
        name: user.displayName,
        avatar: user.avatar,
        email: user.email,
        userId: user.uid,
        isGuest: false,
      };
    });
    this.notify();
    return user;
  }

  public async loginWithEmail(name: string, email: string, avatar = 'lion'): Promise<AuthUser> {
    const user: AuthUser = {
      uid: 'usr_' + Math.random().toString(36).substring(2, 9),
      displayName: name.trim() || 'Zen Seeker',
      email: email.trim(),
      avatar,
      isGuest: false,
    };
    this.currentUser = user;
    storage.update((d) => {
      d.profile = {
        name: user.displayName,
        avatar: user.avatar,
        email: user.email,
        userId: user.uid,
        isGuest: false,
      };
    });
    this.notify();
    return user;
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    storage.update((d) => {
      d.profile = null;
    });
    this.notify();
  }

  public async deleteAccountAndData(): Promise<void> {
    this.currentUser = null;
    storage.resetAllProgress();
    this.notify();
  }
}

export const authService = new AuthService();
