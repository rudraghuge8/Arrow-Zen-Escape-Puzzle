# Google Play Billing Setup Guide - Arrow Zen

Arrow Zen contains a built-in mock billing layer that allows local testing without real monetary transactions. When connecting to Google Play Billing in production, follow these steps:

## 1. Prerequisites
- A Google Play Developer account.
- The signed release AAB uploaded to an Internal or Closed Testing track at least once.

## 2. In-App Product Catalog Configuration
Navigate to Google Play Console -> **Monetize** -> **In-app products** -> **Create product**:

1. **Remove Ads**:
   - Product ID: `remove_ads`
   - Name: `Remove Ads`
   - Description: `Permanently removes banner and interstitial advertisements.`
   - Price: $1.99 USD (or local currency equivalent)
   - Status: Active

2. **Small Coin Pack**:
   - Product ID: `coins_100`
   - Name: `100 Zen Coins`
   - Description: `A pouch of 100 Zen Coins for hints and power-ups.`
   - Price: $0.99 USD
   - Status: Active

3. **Medium Coin Pack**:
   - Product ID: `coins_500`
   - Name: `500 Zen Coins`
   - Description: `500 Zen Coins to unlock new skins and themes.`
   - Price: $2.99 USD
   - Status: Active

4. **Large Coin Pack**:
   - Product ID: `coins_1500`
   - Name: `1500 Zen Coins`
   - Description: `1500 Zen Coins treasury for dedicated solvers.`
   - Price: $6.99 USD
   - Status: Active

## 3. License Testing
1. In Google Play Console, go to **Setup** -> **License testing**.
2. Add your Google Account email.
3. Set **License response** to `RESPOND_NORMALLY`.
4. This permits testing in-app purchases on real Android devices without incurring real credit card charges.
