# Human Tasks Guide (HUMAN_TASKS.md)

This document contains **ONLY** the actions that strictly require your personal developer accounts, billing credentials, or physical hardware devices. Everything else in the code, build, and tests is 100% complete and working in offline/mock mode.

---

## 1. Google Play Console Account Setup (One-Time)
1. Go to [Google Play Console](https://play.google.com/console/signup).
2. Sign in with your Google account (`maharudraghuge05122004@gmail.com`) and pay the $25 registration fee.
3. Complete Identity Verification (upload Government Photo ID and address proof).
4. Create a new App:
   - App Name: `Arrow Zen: Escape Puzzle`
   - Default Language: `English (United States)`
   - App or Game: `Game`
   - Free or Paid: `Free`
5. Fill in the **Store Settings** using the copy provided in `docs/PLAY_STORE_PACK.md`.
6. Fill in the **Data Safety** questionnaire using the answers in `docs/PLAY_STORE_PACK.md`.

---

## 2. Closed Testing Requirement (Personal Account Rule)
If you are using a new personal Google Play Developer account, Google requires a 14-day closed test with at least 20 testers:
1. In Play Console, go to **Testing** -> **Closed testing**.
2. Click **Create track** (name it `Alpha`).
3. Click **Manage track** -> **Testers** tab.
4. Select **Google Groups** and enter the email of your testers group (or list 20 individual Gmail addresses).
5. Copy the invite template from `docs/PLAY_STORE_PACK.md` (Section 5) and send it to your 20 testers.
6. Ensure all 20 testers opt in and keep the app installed for 14 continuous days.
7. Click **Apply for Production** once the 14-day period concludes.

---

## 3. Connecting Real Firebase Cloud Sync (Optional)
If you wish to switch from local Mock mode to real Google cloud sync:
1. Open [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Go to **Authentication** -> **Sign-in method** and enable Google, Email/Password, and Anonymous.
3. Go to **Firestore Database** -> **Create database** (Production mode).
4. Copy the security rules from `docs/FIREBASE_SETUP.md` into the Rules tab and click **Publish**.
5. Copy your Firebase Web App configuration keys into `.env` (refer to `docs/FIREBASE_SETUP.md`).

---

## 4. Activating Google AdMob Ads (Optional)
If you wish to monetize with real advertisements:
1. Go to [Google AdMob](https://admob.google.com/) and register your app as `Arrow Zen`.
2. Create 3 ad units: Banner, Interstitial, and Rewarded (see `docs/ADMOB_SETUP.md`).
3. Add your real `APPLICATION_ID` and ad unit IDs to your Android project configuration.

---

## 5. Building & Signing on a Real Android Phone
1. Install Android Studio on your workstation if you wish to run on a plugged-in USB Android phone.
2. Run:
   ```bash
   npm run build
   npx cap copy android
   npx cap open android
   ```
3. In Android Studio, select your physical Android device from the device dropdown and click **Run** (green play button).
