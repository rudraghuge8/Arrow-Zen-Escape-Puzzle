/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface TrackDef {
  type: 'box' | 'kal' | 'lofi' | 'harp';
  bpm: number;
  wave: OscillatorType;
  chords: number[][];
  bass: number[];
}

const TRACKS: TrackDef[] = [
  {
    type: 'box',
    bpm: 84,
    wave: 'triangle',
    chords: [
      [261.63, 329.63, 392.0],
      [220.0, 261.63, 329.63],
      [174.61, 220.0, 261.63],
      [196.0, 246.94, 293.66],
    ],
    bass: [65.41, 55.0, 43.65, 49.0],
  },
  {
    type: 'kal',
    bpm: 66,
    wave: 'sine',
    chords: [
      [220.0, 261.63, 329.63],
      [174.61, 220.0, 261.63],
      [261.63, 329.63, 392.0],
      [196.0, 246.94, 293.66],
    ],
    bass: [55.0, 43.65, 65.41, 49.0],
  },
  {
    type: 'lofi',
    bpm: 72,
    wave: 'triangle',
    chords: [
      [261.63, 329.63, 392.0],
      [220.0, 261.63, 329.63],
      [174.61, 220.0, 261.63],
      [196.0, 246.94, 293.66],
    ],
    bass: [65.41, 55.0, 43.65, 49.0],
  },
  {
    type: 'harp',
    bpm: 56,
    wave: 'sine',
    chords: [
      [220.0, 261.63, 329.63],
      [174.61, 220.0, 261.63],
      [261.63, 329.63, 392.0],
      [196.0, 246.94, 293.66],
    ],
    bass: [55.0, 43.65, 65.41, 49.0],
  },
];

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;
  private musicInterval: ReturnType<typeof setInterval> | null = null;
  private currentTrackIdx = -1;
  private kalimbaStep = 2;
  private isUnlocked = false;

  public soundEnabled = true;
  public musicEnabled = true;
  public vibrationEnabled = true;
  public voiceEnabled = false;
  public masterVolume = 0.65; // 0..1

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', () => this.unlock(), { once: true });
      window.addEventListener('keydown', () => this.unlock(), { once: true });

      // Clean pause on tab background / resume on focus
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseAll();
        } else {
          this.resumeAll();
        }
      });
    }
  }

  private initCtx(): boolean {
    if (this.audioCtx) return true;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return false;
      this.audioCtx = new AudioCtxClass();

      const compressor = this.audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-24, this.audioCtx.currentTime);
      compressor.knee.setValueAtTime(30, this.audioCtx.currentTime);
      compressor.ratio.setValueAtTime(12, this.audioCtx.currentTime);
      compressor.attack.setValueAtTime(0.003, this.audioCtx.currentTime);
      compressor.release.setValueAtTime(0.25, this.audioCtx.currentTime);

      this.masterGainNode = this.audioCtx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.audioCtx.currentTime);

      this.musicGainNode = this.audioCtx.createGain();
      this.musicGainNode.gain.setValueAtTime(this.musicEnabled ? 0.35 : 0, this.audioCtx.currentTime);

      this.sfxGainNode = this.audioCtx.createGain();
      this.sfxGainNode.gain.setValueAtTime(this.soundEnabled ? 0.6 : 0, this.audioCtx.currentTime);

      this.musicGainNode.connect(this.masterGainNode);
      this.sfxGainNode.connect(this.masterGainNode);
      this.masterGainNode.connect(compressor);
      compressor.connect(this.audioCtx.destination);

      return true;
    } catch (e) {
      console.warn('AudioContext init failed:', e);
      return false;
    }
  }

  public unlock(): void {
    if (this.isUnlocked) return;
    if (this.initCtx() && this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.isUnlocked = true;
    }
  }

  public setMasterVolume(pct: number): void {
    this.masterVolume = Math.max(0, Math.min(1, pct / 100));
    if (this.masterGainNode && this.audioCtx) {
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.audioCtx.currentTime);
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (this.sfxGainNode && this.audioCtx) {
      this.sfxGainNode.gain.setValueAtTime(enabled ? 0.6 : 0, this.audioCtx.currentTime);
    }
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (this.musicGainNode && this.audioCtx) {
      this.musicGainNode.gain.setValueAtTime(enabled ? 0.35 : 0, this.audioCtx.currentTime);
    }
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public pauseAll(): void {
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend();
    }
  }

  public resumeAll(): void {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // --- Sound Effects ---

  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.15, endFreq?: number): void {
    if (!this.soundEnabled || !this.initCtx() || !this.audioCtx || !this.sfxGainNode) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);
      }

      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(this.sfxGainNode);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Audio playback failsafe
    }
  }

  public playSfx(name: 'go' | 'no' | 'win' | 'coin' | 'tap' | 'booster' | 'button' | 'undo', comboCount = 0): void {
    if (!this.soundEnabled) return;
    this.unlock();

    switch (name) {
      case 'go': {
        const pitchBoost = Math.min(600, comboCount * 65);
        this.playTone(460 + pitchBoost, 0.22, 'sine', 0.16, 920 + pitchBoost);
        break;
      }
      case 'no':
        this.playTone(180, 0.28, 'sawtooth', 0.1, 75);
        break;
      case 'win':
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          setTimeout(() => this.playTone(freq, 0.35, 'triangle', 0.16), idx * 110);
        });
        break;
      case 'coin':
        this.playTone(987.77, 0.1, 'sine', 0.18);
        setTimeout(() => this.playTone(1318.51, 0.2, 'sine', 0.2), 90);
        break;
      case 'tap':
        this.playTone(600, 0.04, 'sine', 0.08, 400);
        break;
      case 'button':
        this.playTone(540, 0.08, 'sine', 0.12, 700);
        break;
      case 'booster':
        this.playTone(330, 0.4, 'triangle', 0.18, 1200);
        break;
      case 'undo':
        this.playTone(700, 0.15, 'sine', 0.12, 350);
        break;
    }
  }

  public vibrate(pattern: number | number[]): void {
    if (!this.vibrationEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Vibration failsafe
    }
  }

  public speak(text: string): void {
    if (!this.voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.05;
      utter.pitch = 1.1;
      window.speechSynthesis.speak(utter);
    } catch {
      // Speech failsafe
    }
  }

  // --- Ambient Music Sequencer ---

  public setLevelTrack(levelNumber: number): void {
    const targetIdx = (levelNumber - 1) % TRACKS.length;
    if (this.currentTrackIdx !== targetIdx) {
      this.currentTrackIdx = targetIdx;
      if (this.musicEnabled) {
        this.startMusic();
      }
    }
  }

  public startMusic(): void {
    this.stopMusic();
    if (!this.musicEnabled || !this.initCtx() || !this.audioCtx || !this.musicGainNode) return;

    if (this.currentTrackIdx < 0) this.currentTrackIdx = 0;
    const track = TRACKS[this.currentTrackIdx];
    let stepIndex = 0;
    let nextStepTime = this.audioCtx.currentTime + 0.1;

    this.musicInterval = setInterval(() => {
      if (!this.audioCtx || !this.musicGainNode || !this.musicEnabled) return;
      try {
        const stepDuration = 30 / track.bpm;
        while (nextStepTime < this.audioCtx.currentTime + 0.3) {
          this.scheduleMusicStep(track, stepIndex % 32, nextStepTime);
          nextStepTime += stepDuration;
          stepIndex++;
        }
      } catch (err) {
        console.warn('Music step error:', err);
      }
    }, 80);
  }

  public stopMusic(): void {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private schedulePluck(freq: number, time: number, duration: number, gain: number, wave: OscillatorType): void {
    if (!this.audioCtx || !this.musicGainNode) return;
    const osc = this.audioCtx.createOscillator();
    const g = this.audioCtx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, time);

    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(g);
    g.connect(this.musicGainNode);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private scheduleMusicStep(track: TrackDef, index: number, time: number): void {
    const chordIdx = (index >> 3) & 3;
    const subStep = index & 7;
    const chord = track.chords[chordIdx];
    const bass = track.bass[chordIdx];

    if (track.type === 'box') {
      const arpeggio = [0, 1, 2, 1, 2, 1, 0, 1];
      const note = chord[arpeggio[subStep]] * 2;
      this.schedulePluck(note, time, 0.9, 0.05, track.wave);
      if (subStep === 0) {
        this.schedulePluck(bass, time, 1.8, 0.05, 'sine');
      }
      if (subStep === 4) {
        this.schedulePluck(chord[2] * 4, time, 1.2, 0.02, 'sine');
      }
    } else if (track.type === 'kal') {
      if (Math.random() < 0.55) {
        this.kalimbaStep = Math.max(0, Math.min(7, this.kalimbaStep + [-2, -1, 1, 2][Math.floor(Math.random() * 4)]));
        const intervals = [1, 1.125, 1.25, 1.5, 1.667, 2, 2.25, 2.5];
        const freq = chord[0] * 2 * intervals[this.kalimbaStep];
        this.schedulePluck(freq, time, 1.5, 0.045, 'sine');
      }
      if (subStep === 0) {
        this.schedulePluck(bass, time, 2.0, 0.045, 'sine');
      }
    } else if (track.type === 'lofi') {
      if (subStep === 0 || subStep === 3 || subStep === 6) {
        chord.forEach((freq) => this.schedulePluck(freq, time, 1.2, 0.025, 'triangle'));
      }
      if (subStep === 0 || subStep === 4) {
        this.schedulePluck(bass, time, 1.3, 0.055, 'sine');
      }
    } else {
      this.schedulePluck(chord[subStep % 3] * Math.pow(2, Math.floor(subStep / 3)), time, 2.2, 0.04, track.wave);
      if (subStep === 0) {
        this.schedulePluck(bass, time, 2.4, 0.048, 'sine');
      }
    }
  }
}

export const soundEngine = new SoundEngine();
