/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { storage } from './storage/storage';
import type { StorageDataV2 } from './storage/schema';
import { generateLevel, getWorldForLevel } from './game/generator';
import type { LevelData, BoosterType, ArrowSkinId, ThemeId, ArrowData } from './game/types';
import { getTheme } from './game/themes';
import { calculateStars, calculateCoinReward } from './game/rules';
import { soundEngine } from './audio/soundEngine';
import { analytics } from './services/analyticsService';
import { adService, type AdRewardType } from './services/adService';

// UI Components
import { CanvasBoard } from './game/CanvasBoard';
import { HUD } from './ui/HUD';
import { HomeScreen } from './ui/HomeScreen';
import { VictoryModal } from './ui/VictoryModal';
import { GameOverModal } from './ui/GameOverModal';
import { TutorialOverlay } from './ui/TutorialOverlay';
import { LevelPathScreen } from './ui/LevelPathScreen';
import { DailyChallengeModal } from './ui/DailyChallengeModal';
import { DailyRewardCalendar } from './ui/DailyRewardCalendar';
import { ShopScreen } from './ui/ShopScreen';
import { LeaderboardScreen } from './ui/LeaderboardScreen';
import { AchievementsScreen } from './ui/AchievementsScreen';
import { HowToPlayScreen } from './ui/HowToPlayScreen';
import { SettingsModal } from './ui/SettingsModal';
import { ProfileScreen } from './ui/ProfileScreen';
import { AdRewardModal } from './ui/AdRewardModal';
import type { MascotMood } from './ui/Mascot';

type AppScreen =
  | 'home'
  | 'play'
  | 'levels'
  | 'daily'
  | 'calendar'
  | 'shop'
  | 'leaderboard'
  | 'achievements'
  | 'how'
  | 'settings'
  | 'profile';

interface MoveHistoryRecord {
  arrowId: number;
  cells: number[];
}

export default function App() {
  const [saveData, setSaveData] = useState<StorageDataV2>(() => storage.getData());
  const [screen, setScreen] = useState<AppScreen>('home');
  const [currentLevelData, setCurrentLevelData] = useState<LevelData | null>(null);

  // Gameplay state
  const [lives, setLives] = useState(3);
  const [maxLives, setMaxLives] = useState(3);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>('zen');
  const [bombActive, setBombActive] = useState(false);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryRecord[]>([]);

  // Rewarded Ad state
  const [rewardAdRequest, setRewardAdRequest] = useState<{
    type: AdRewardType;
    onComplete: (granted: boolean) => void;
  } | null>(null);

  // Dev overlay
  const [showFpsOverlay, setShowFpsOverlay] = useState(false);

  // Sync storage updates
  useEffect(() => {
    return storage.subscribe(() => {
      setSaveData(storage.getData());
    });
  }, []);

  // Update sound engine settings when storage changes
  useEffect(() => {
    soundEngine.soundEnabled = saveData.soundEnabled;
    soundEngine.musicEnabled = saveData.musicEnabled;
    soundEngine.vibrationEnabled = saveData.vibrationEnabled;
    soundEngine.voiceEnabled = saveData.voiceEnabled;
    soundEngine.setMasterVolume(saveData.masterVolume);
  }, [saveData]);

  // Apply theme colors to CSS variables
  const currentTheme = getTheme(saveData.activeTheme);
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', currentTheme.bg);
    root.style.setProperty('--ln', currentTheme.line);
    root.style.setProperty('--dr', currentTheme.drop);
    root.style.backgroundColor = currentTheme.bg;
    root.style.color = currentTheme.line;
  }, [currentTheme]);

  // Register ad service callback
  useEffect(() => {
    adService.registerAdModal((type, onComplete) => {
      setRewardAdRequest({ type, onComplete });
    });
  }, []);

  // Check URL ?autostart=1 support (ultra-mode requirement)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autostart') === '1') {
        startLevel(saveData.currentLevel || 1);
      }
    }
  }, []);

  // Load level helper (fetches pack or generates)
  const startLevel = useCallback(async (levelNum: number) => {
    const clampedLevel = Math.max(1, Math.min(500, levelNum));
    analytics.logEvent('level_start', { level: clampedLevel });

    let loadedLevel: LevelData | null = null;

    // Try fetching from compact pre-generated level pack
    try {
      const packIdx = Math.ceil(clampedLevel / 50);
      const res = await fetch(`/levels/pack-${packIdx}.json`);
      if (res.ok) {
        const pack = await res.json();
        const found = pack.find((item: { l: number }) => item.l === clampedLevel);
        if (found) {
          const world = getWorldForLevel(clampedLevel);
          loadedLevel = {
            levelNumber: found.l,
            worldIndex: world.index,
            worldName: world.name,
            shapeName: found.s,
            gridSize: found.n,
            shapeMask: found.m.split('').map(Number),
            arrows: found.a.map((arr: [number[], number], idx: number) => ({
              id: idx,
              c: arr[0],
              d: arr[1] as 0 | 1 | 2 | 3,
            })),
            par: found.p,
            difficultyScore: found.ds,
            isReliefLevel: Boolean(found.r),
            isSpecialLevel: Boolean(found.b),
          };
        }
      }
    } catch {
      // Fallback to generator
    }

    if (!loadedLevel) {
      loadedLevel = generateLevel(clampedLevel);
    }

    setCurrentLevelData(loadedLevel);
    setLives(3);
    setMaxLives(3);
    setIsWon(false);
    setIsGameOver(false);
    setStartTime(Date.now());
    setMovesCount(0);
    setMascotMood('zen');
    setBombActive(false);
    setMoveHistory([]);
    setScreen('play');

    soundEngine.setLevelTrack(clampedLevel);
  }, []);

  // Gameplay Handlers
  const handleArrowEscaped = (arrowId: number, remainingCount: number, comboCount: number) => {
    setMovesCount((prev) => prev + 1);

    if (comboCount >= 3) {
      setMascotMood('cheering');
    } else {
      setMascotMood('happy');
    }

    if (remainingCount === 0) {
      // LEVEL WON!
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      setIsWon(true);
      setMascotMood('cheering');

      const currentLvl = currentLevelData?.levelNumber || 1;
      const dropsLost = maxLives - lives;
      const stars = calculateStars(dropsLost, movesCount + 1, currentLevelData?.par || 4);
      const isFirstClear = !saveData.levelStars[currentLvl];
      const coinsReward = calculateCoinReward(stars, isFirstClear, comboCount);

      // Persist progress immediately
      storage.update((d) => {
        d.unlockedLevel = Math.max(d.unlockedLevel, Math.min(500, currentLvl + 1));
        d.currentLevel = Math.min(500, currentLvl + 1);
        d.coins += coinsReward;
        if (!d.levelStars[currentLvl] || d.levelStars[currentLvl] < stars) {
          d.levelStars[currentLvl] = stars;
        }
        d.totalStars = Object.values(d.levelStars).reduce((sum, s) => sum + s, 0);
        if (dropsLost === 0) d.flawlessWins++;
        d.todayStats.levelsCleared++;
      });

      adService.recordLevelCompleted();
      analytics.logEvent('level_win', { level: currentLvl, stars, timeMs: elapsed });
    }
  };

  const handleArrowBlocked = (arrowId: number, blockerId: number) => {
    // In tutorial (levels 1-5), no lives are lost
    if (currentLevelData && currentLevelData.levelNumber <= 5) {
      setMascotMood('worried');
      setTimeout(() => setMascotMood('happy'), 1500);
      return;
    }

    setLives((prev) => {
      const nextLives = Math.max(0, prev - 1);
      if (nextLives === 0) {
        setIsGameOver(true);
        setMascotMood('worried');
        analytics.logEvent('level_fail', { level: currentLevelData?.levelNumber || 1 });
      } else {
        setMascotMood('worried');
        setTimeout(() => setMascotMood('zen'), 1600);
      }
      return nextLives;
    });
  };

  // Booster Actions
  const handleUseHint = () => {
    if (!currentLevelData) return;
    if (saveData.hintsRemaining > 0) {
      storage.update((d) => d.hintsRemaining--);
    } else if (saveData.coins >= 30) {
      storage.update((d) => (d.coins -= 30));
    } else {
      // Offer rewarded ad for hint
      adService.showRewardedAd('hint').then((granted) => {
        if (granted) storage.update((d) => d.hintsRemaining++);
      });
      return;
    }

    soundEngine.playSfx('booster');
    analytics.logEvent('hint_used', { level: currentLevelData.levelNumber });
  };

  const handleUseUndo = () => {
    if (moveHistory.length === 0) return;
    // Revert last move
    soundEngine.playSfx('undo');
    setMoveHistory((prev) => prev.slice(0, -1));
  };

  const handleToggleBomb = () => {
    if (saveData.boosters.bomb > 0 || saveData.coins >= 45) {
      setBombActive((prev) => !prev);
      soundEngine.playSfx('button');
    }
  };

  const handleBombUsed = (arrowId: number) => {
    if (saveData.boosters.bomb > 0) {
      storage.update((d) => d.boosters.bomb--);
    } else {
      storage.update((d) => (d.coins -= 45));
    }
    setBombActive(false);
    analytics.logEvent('booster_used', { type: 'bomb' });
  };

  const handleUseXray = () => {
    if (saveData.boosters.xray > 0) {
      storage.update((d) => d.boosters.xray--);
    } else if (saveData.coins >= 40) {
      storage.update((d) => (d.coins -= 40));
    } else {
      return;
    }
    soundEngine.playSfx('booster');
    analytics.logEvent('booster_used', { type: 'xray' });
  };

  const handleUseExtraDrop = () => {
    if (lives >= maxLives) return;
    if (saveData.boosters.extraDrop > 0) {
      storage.update((d) => d.boosters.extraDrop--);
    } else if (saveData.coins >= 35) {
      storage.update((d) => (d.coins -= 35));
    } else {
      return;
    }
    setLives((prev) => Math.min(maxLives, prev + 1));
    soundEngine.playSfx('coin');
    analytics.logEvent('booster_used', { type: 'extraDrop' });
  };

  // Continue with +1 Drop on Game Over
  const handleContinueWithCoins = () => {
    if (saveData.coins >= 25) {
      storage.update((d) => (d.coins -= 25));
      setLives(1);
      setIsGameOver(false);
      setMascotMood('zen');
      soundEngine.playSfx('coin');
    }
  };

  const handleWatchAdForDrop = () => {
    adService.showRewardedAd('extraDrop').then((granted) => {
      if (granted) {
        setLives(1);
        setIsGameOver(false);
        setMascotMood('zen');
      }
    });
  };

  const handleClaimDailyReward = (day: number, coins: number) => {
    storage.update((d) => {
      d.coins += coins;
      d.loginCalendar.lastClaimDate = new Date().toDateString();
      d.loginCalendar.claimedDayCount++;
      if (day === 7) d.boosters.bomb++;
    });
    soundEngine.playSfx('coin');
  };

  const handleClaimAchievement = (id: string, coins: number) => {
    storage.update((d) => {
      d.coins += coins;
      d.achievements[id] = true;
    });
    soundEngine.playSfx('coin');
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col font-sans select-none"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.line,
      }}
    >
      {/* 1. PLAYING SCREEN */}
      {screen === 'play' && currentLevelData && (
        <main className="relative flex-1 w-full h-full flex flex-col overflow-hidden">
          <HUD
            levelNumber={currentLevelData.levelNumber}
            worldName={currentLevelData.worldName}
            lives={lives}
            maxLives={maxLives}
            coins={saveData.coins}
            hintsRemaining={saveData.hintsRemaining}
            boosters={saveData.boosters}
            bombActive={bombActive}
            mascotMood={mascotMood}
            language={saveData.language}
            canUndo={moveHistory.length > 0}
            onBack={() => setScreen('home')}
            onOpenSettings={() => setScreen('settings')}
            onOpenThemePicker={() => setScreen('shop')}
            onUseHint={handleUseHint}
            onUseUndo={handleUseUndo}
            onToggleBomb={handleToggleBomb}
            onUseXray={handleUseXray}
            onUseExtraDrop={handleUseExtraDrop}
          />

          <TutorialOverlay
            levelNumber={currentLevelData.levelNumber}
            language={saveData.language}
          />

          <div className="flex-1 w-full h-full flex items-center justify-center p-2">
            <CanvasBoard
              levelData={currentLevelData}
              theme={currentTheme}
              skin={saveData.activeSkin}
              lives={lives}
              isGameOver={isGameOver}
              isWon={isWon}
              colorBlindMode={saveData.highContrast}
              reduceMotion={saveData.reduceMotion}
              largeTapTargets={saveData.largeTapTargets}
              idleHelpEnabled={saveData.idleHelpEnabled}
              showFpsOverlay={showFpsOverlay}
              bombActive={bombActive}
              onBombUsed={handleBombUsed}
              onArrowEscaped={handleArrowEscaped}
              onArrowBlocked={handleArrowBlocked}
            />
          </div>

          {/* Victory Modal */}
          {isWon && (
            <VictoryModal
              levelNumber={currentLevelData.levelNumber}
              stars={calculateStars(maxLives - lives, movesCount, currentLevelData.par)}
              coinsEarned={calculateCoinReward(
                calculateStars(maxLives - lives, movesCount, currentLevelData.par),
                true,
                1
              )}
              timeElapsedMs={elapsedTime}
              parWaves={currentLevelData.par}
              difficultyScore={currentLevelData.difficultyScore}
              todayLevelsCleared={saveData.todayStats.levelsCleared}
              language={saveData.language}
              theme={currentTheme}
              reduceMotion={saveData.reduceMotion}
              onNextLevel={() => {
                if (currentLevelData.levelNumber < 500) {
                  startLevel(currentLevelData.levelNumber + 1);
                } else {
                  setScreen('levels');
                }
              }}
              onGoToLevels={() => setScreen('levels')}
            />
          )}

          {/* Game Over Modal */}
          {isGameOver && (
            <GameOverModal
              coins={saveData.coins}
              language={saveData.language}
              onRetry={() => startLevel(currentLevelData.levelNumber)}
              onContinueWithCoins={handleContinueWithCoins}
              onWatchAdForDrop={handleWatchAdForDrop}
              onGoToHome={() => setScreen('home')}
            />
          )}
        </main>
      )}

      {/* 2. HOME SCREEN */}
      {screen === 'home' && (
        <HomeScreen
          unlockedLevel={saveData.unlockedLevel}
          profile={saveData.profile}
          coins={saveData.coins}
          streakDays={saveData.dailyChallenge.streak}
          language={saveData.language}
          onPlayCurrentLevel={() => startLevel(saveData.unlockedLevel)}
          onOpenLevels={() => setScreen('levels')}
          onOpenDaily={() => setScreen('daily')}
          onOpenCalendar={() => setScreen('calendar')}
          onOpenShop={() => setScreen('shop')}
          onOpenLeaderboard={() => setScreen('leaderboard')}
          onOpenAchievements={() => setScreen('achievements')}
          onOpenHowToPlay={() => setScreen('how')}
          onOpenSettings={() => setScreen('settings')}
          onOpenProfile={() => setScreen('profile')}
        />
      )}

      {/* 3. LEVEL PATH / WORLD MAP SCREEN */}
      {screen === 'levels' && (
        <LevelPathScreen
          unlockedLevel={saveData.unlockedLevel}
          currentLevel={currentLevelData?.levelNumber || saveData.currentLevel}
          levelStars={saveData.levelStars}
          language={saveData.language}
          onSelectLevel={(lvl) => startLevel(lvl)}
          onBack={() => setScreen('home')}
        />
      )}

      {/* 4. DAILY CHALLENGE MODAL */}
      {screen === 'daily' && (
        <DailyChallengeModal
          streakDays={saveData.dailyChallenge.streak}
          isTodayCompleted={saveData.dailyChallenge.lastDate === new Date().toDateString()}
          language={saveData.language}
          onPlayDaily={() => {
            // Generate seed from current date: YYYYMMDD
            const d = new Date();
            const dateNum = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
            const dailyLevelNum = (dateNum % 500) + 1;
            startLevel(dailyLevelNum);
          }}
          onClose={() => setScreen('home')}
        />
      )}

      {/* 5. 7-DAY REWARD CALENDAR */}
      {screen === 'calendar' && (
        <DailyRewardCalendar
          claimedDayCount={saveData.loginCalendar.claimedDayCount}
          lastClaimDate={saveData.loginCalendar.lastClaimDate}
          language={saveData.language}
          onClaim={handleClaimDailyReward}
          onClose={() => setScreen('home')}
        />
      )}

      {/* 6. SHOP SCREEN */}
      {screen === 'shop' && (
        <ShopScreen
          coins={saveData.coins}
          unlockedSkins={saveData.unlockedSkins}
          unlockedThemes={saveData.unlockedThemes}
          activeSkin={saveData.activeSkin}
          activeTheme={saveData.activeTheme}
          language={saveData.language}
          onSelectSkin={(skin) => storage.update((d) => (d.activeSkin = skin))}
          onUnlockSkin={(skin, cost) => {
            if (saveData.coins >= cost) {
              storage.update((d) => {
                d.coins -= cost;
                d.unlockedSkins.push(skin);
                d.activeSkin = skin;
              });
              soundEngine.playSfx('coin');
            }
          }}
          onSelectTheme={(themeId) => storage.update((d) => (d.activeTheme = themeId))}
          onUnlockTheme={(themeId, cost) => {
            if (saveData.coins >= cost) {
              storage.update((d) => {
                d.coins -= cost;
                d.unlockedThemes.push(themeId);
                d.activeTheme = themeId;
              });
              soundEngine.playSfx('coin');
            }
          }}
          onBuyBooster={(booster, cost) => {
            if (saveData.coins >= cost) {
              storage.update((d) => {
                d.coins -= cost;
                d.boosters[booster]++;
              });
              soundEngine.playSfx('coin');
            }
          }}
          onBack={() => setScreen('home')}
        />
      )}

      {/* 7. LEADERBOARD SCREEN */}
      {screen === 'leaderboard' && (
        <LeaderboardScreen
          language={saveData.language}
          onBack={() => setScreen('home')}
        />
      )}

      {/* 8. ACHIEVEMENTS SCREEN */}
      {screen === 'achievements' && (
        <AchievementsScreen
          unlockedLevel={saveData.unlockedLevel}
          totalStars={saveData.totalStars}
          flawlessWins={saveData.flawlessWins}
          streakDays={saveData.dailyChallenge.streak}
          achievements={saveData.achievements}
          language={saveData.language}
          onClaimReward={handleClaimAchievement}
          onBack={() => setScreen('home')}
        />
      )}

      {/* 9. HOW TO PLAY SCREEN */}
      {screen === 'how' && (
        <HowToPlayScreen
          language={saveData.language}
          onBack={() => setScreen('home')}
          onStartPlaying={() => startLevel(saveData.unlockedLevel)}
        />
      )}

      {/* 10. PROFILE SCREEN */}
      {screen === 'profile' && (
        <ProfileScreen
          profile={saveData.profile}
          unlockedLevel={saveData.unlockedLevel}
          totalStars={saveData.totalStars}
          flawlessWins={saveData.flawlessWins}
          todayLevelsCleared={saveData.todayStats.levelsCleared}
          language={saveData.language}
          onSaveProfile={(prof) => storage.update((d) => (d.profile = prof))}
          onBack={() => setScreen('home')}
        />
      )}

      {/* 11. SETTINGS MODAL */}
      {screen === 'settings' && (
        <SettingsModal
          soundEnabled={saveData.soundEnabled}
          musicEnabled={saveData.musicEnabled}
          vibrationEnabled={saveData.vibrationEnabled}
          voiceEnabled={saveData.voiceEnabled}
          masterVolume={saveData.masterVolume}
          idleHelpEnabled={saveData.idleHelpEnabled}
          reduceMotion={saveData.reduceMotion}
          highContrast={saveData.highContrast}
          largeTapTargets={saveData.largeTapTargets}
          activeTheme={saveData.activeTheme}
          language={saveData.language}
          showFpsOverlay={showFpsOverlay}
          onToggleSound={() => storage.update((d) => (d.soundEnabled = !d.soundEnabled))}
          onToggleMusic={() => storage.update((d) => (d.musicEnabled = !d.musicEnabled))}
          onToggleVibration={() => storage.update((d) => (d.vibrationEnabled = !d.vibrationEnabled))}
          onToggleVoice={() => storage.update((d) => (d.voiceEnabled = !d.voiceEnabled))}
          onChangeVolume={(vol) => storage.update((d) => (d.masterVolume = vol))}
          onToggleIdleHelp={() => storage.update((d) => (d.idleHelpEnabled = !d.idleHelpEnabled))}
          onToggleReduceMotion={() => storage.update((d) => (d.reduceMotion = !d.reduceMotion))}
          onToggleHighContrast={() => storage.update((d) => (d.highContrast = !d.highContrast))}
          onToggleLargeTapTargets={() => storage.update((d) => (d.largeTapTargets = !d.largeTapTargets))}
          onSelectTheme={(id) => storage.update((d) => (d.activeTheme = id))}
          onChangeLanguage={(lang) => storage.update((d) => (d.language = lang))}
          onToggleFpsOverlay={() => setShowFpsOverlay((prev) => !prev)}
          onResetProgress={() => storage.resetAllProgress()}
          onClose={() => setScreen('home')}
        />
      )}

      {/* REWARDED AD MODAL (Simulated) */}
      {rewardAdRequest && (
        <AdRewardModal
          rewardType={rewardAdRequest.type}
          onRewardClaimed={(granted) => {
            rewardAdRequest.onComplete(granted);
            setRewardAdRequest(null);
          }}
          onClose={() => {
            rewardAdRequest.onComplete(false);
            setRewardAdRequest(null);
          }}
        />
      )}
    </div>
  );
}
