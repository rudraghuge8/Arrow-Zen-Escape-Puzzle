# Google AdMob Setup Guide - Arrow Zen

Arrow Zen includes a built-in mock advertising engine for local and offline testing. To activate real production ads through Google AdMob, follow these exact console steps:

## 1. Create AdMob Account & App
1. Go to [Google AdMob Console](https://admob.google.com/).
2. Click **Apps** -> **Add App**.
3. Select **Android** as the platform.
4. If your app is not yet published on Google Play, select **No**. Name it `Arrow Zen`.

## 2. Create Ad Units
Create three ad units in the console:
1. **Banner Ad Unit**:
   - Format: Banner (Anchored Adaptive Banner)
   - Name: `Menu_Banner`
2. **Interstitial Ad Unit**:
   - Format: Interstitial
   - Name: `Level_Transition_Interstitial`
3. **Rewarded Ad Unit**:
   - Format: Rewarded
   - Name: `Booster_Hint_Rewarded`
   - Reward item: 1 Hint / Extra Drop / Coins

## 3. Configure Android Manifest (`android/app/src/main/AndroidManifest.xml`)
Add your AdMob App ID inside the `<application>` tag:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
```

## 4. Test Device Configuration
Always register your real test phone's advertising ID in the AdMob console under **Settings** -> **Test devices** to avoid accidental policy strikes during development.

## 5. Ad Frequency Policies Enforced in Arrow Zen
- **First Session Protection**: Interstitials are never shown during the player's initial session.
- **Tutorial Protection**: Interstitials are never displayed on levels 1–10.
- **Failure Grace**: Interstitials never trigger right after a level loss.
- **Capped Interval**: At most 1 interstitial per 3–4 completed levels.
- **Remove Ads IAP**: All banner and interstitial ads are immediately suppressed upon purchasing "Remove Ads".
