/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { execSync } from 'node:child_process';

console.log('Running Playwright E2E User Journey Validations...');

function runPlaywrightStep(name: string, script: string) {
  console.log(`[E2E] Testing: ${name}...`);
  try {
    const cmd = `playwright-cli run-code '${script.replace(/'/g, "'\\''")}'`;
    execSync(cmd, { stdio: 'pipe', encoding: 'utf8' });
    console.log(`[E2E] ✓ ${name} Passed`);
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string };
    console.error(`[E2E] ✗ ${name} Failed:`, error.stdout || error.stderr);
    throw err;
  }
}

async function runAll() {
  // Session setup
  execSync('playwright-cli open --browser=chromium http://localhost:3000', { stdio: 'pipe' });
  execSync('playwright-cli resize 390 844', { stdio: 'pipe' });

  // 1. Verify Home Screen Title & Mascot
  runPlaywrightStep('Home Screen Load', `async (page) => {
    const title = await page.textContent('h1');
    if (!title || !title.includes('Arrow Zen')) throw new Error('Title missing');
    const playBtn = await page.getByRole('button', { name: /Play · Level/ }).isVisible();
    if (!playBtn) throw new Error('Play button missing');
  }`);

  // 2. Open Settings & Toggle Sound
  runPlaywrightStep('Settings & Audio Toggles', `async (page) => {
    await page.click('button:has-text("Settings")');
    await page.waitForTimeout(300);
    const heading = await page.textContent('h2');
    if (!heading || !heading.includes('Settings')) throw new Error('Settings not open');
    await page.click('button[aria-label="Close"]');
    await page.waitForTimeout(200);
  }`);

  // 3. Open How To Play
  runPlaywrightStep('How to Play Screen', `async (page) => {
    await page.click('button:has-text("How to play")');
    await page.waitForTimeout(300);
    const title = await page.textContent('h2');
    if (!title || !title.includes('How to play')) throw new Error('How to play not open');
    await page.click('button[aria-label="Back"]');
    await page.waitForTimeout(200);
  }`);

  // 4. Open Shop & Check Tabs
  runPlaywrightStep('Shop & Skins Catalog', `async (page) => {
    await page.click('button:has-text("Shop")');
    await page.waitForTimeout(300);
    const shopTitle = await page.textContent('h2');
    if (!shopTitle || !shopTitle.includes('Shop')) throw new Error('Shop not open');
    await page.click('button:has-text("themes")');
    await page.waitForTimeout(200);
    await page.click('button[aria-label="Back"]');
    await page.waitForTimeout(200);
  }`);

  // 5. Open Levels Path Screen
  runPlaywrightStep('Levels World Path', `async (page) => {
    await page.click('button:has-text("Levels")');
    await page.waitForTimeout(300);
    const pathTitle = await page.textContent('h2');
    if (!pathTitle || !pathTitle.includes('Levels')) throw new Error('Levels screen not open');
    await page.click('button[aria-label="Back"]');
    await page.waitForTimeout(200);
  }`);

  // 6. Start Gameplay
  runPlaywrightStep('Level 1 Gameplay & Tutorial', `async (page) => {
    await page.click('button:has-text("Play · Level 1")');
    await page.waitForTimeout(500);
    const levelTitle = await page.textContent('h1');
    if (!levelTitle || !levelTitle.includes('Level 1')) throw new Error('Gameplay not started');
    const tutorial = await page.locator('text=Tutorial · Step 1/5').isVisible();
    if (!tutorial) throw new Error('Tutorial banner missing');
  }`);

  execSync('playwright-cli close', { stdio: 'pipe' });
  console.log('All Playwright E2E User Journeys successfully verified!');
}

runAll().catch((err) => {
  try {
    execSync('playwright-cli close', { stdio: 'pipe' });
  } catch {}
  process.exit(1);
});
