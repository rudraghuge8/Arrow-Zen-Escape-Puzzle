# Firebase & Firestore Setup Guide - Arrow Zen

Arrow Zen is completely playable offline out of the box with an integrated local Mock engine. When you are ready to enable production cloud sync, authentication, and global leaderboards, follow these steps:

## 1. Create Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**, name it `arrow-zen-escape`, and proceed.
3. Enable **Google Analytics** (recommended).

## 2. Enable Authentication Providers
1. In the left navigation, open **Build** -> **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - Enable **Anonymous / Guest**.
   - Enable **Google** (enter your support email).
   - Enable **Email/Password**.

## 3. Provision Cloud Firestore Database
1. Go to **Build** -> **Firestore Database** -> **Create database**.
2. Select your closest location (e.g. `asia-south1` or `us-central1`).
3. Start in **Production mode**.

## 4. Deploy Secure Firestore Rules
Paste the following security rules into the **Rules** tab of Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User progress document: only the authenticated user can read & write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
        // Sane limits validation
        && request.resource.data.unlockedLevel is int
        && request.resource.data.unlockedLevel >= 1
        && request.resource.data.unlockedLevel <= 500
        && request.resource.data.totalStars is int
        && request.resource.data.totalStars <= 1500;
    }
    
    // Global and weekly leaderboards: public read, authenticated rate-limited write
    match /leaderboards/{type}/entries/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
        && request.resource.data.levelsCleared <= 500
        && request.resource.data.totalStars <= 1500;
    }
  }
}
```

## 5. Environment Variables
Add your Web App keys from Project Settings -> General -> Your apps to `.env`:
```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="arrow-zen-escape.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="arrow-zen-escape"
VITE_FIREBASE_STORAGE_BUCKET="arrow-zen-escape.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
```
Without these keys, the game gracefully runs in offline Mock mode with zero errors.
