/**
 * Chiptune Web Audio Synthesizer & BGM Engine
 * 100% self-contained, no external audio files required, zero CORS or broken link issues!
 */

import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../data/settings.js';

class AudioSystem {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.sfxVolume = 0.7;
    this.musicVolume = 0.45;
    this.currentTrack = null;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.isMuted = false;

    this.loadSettings();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.soundEnabled = parsed.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled;
        this.musicEnabled = parsed.musicEnabled ?? DEFAULT_SETTINGS.musicEnabled;
        this.sfxVolume = parsed.sfxVolume ?? DEFAULT_SETTINGS.sfxVolume;
        this.musicVolume = parsed.musicVolume ?? DEFAULT_SETTINGS.musicVolume;
      }
    } catch (e) {
      console.warn("Could not load audio settings from localStorage", e);
    }
  }

  saveSettings() {
    try {
      const data = {
        soundEnabled: this.soundEnabled,
        musicEnabled: this.musicEnabled,
        sfxVolume: this.sfxVolume,
        musicVolume: this.musicVolume
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
    } catch (e) {
      console.warn("Could not save audio settings", e);
    }
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.saveSettings();
    return this.soundEnabled;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopMusic();
    } else if (this.currentTrack) {
      this.playMusic(this.currentTrack);
    }
    this.saveSettings();
    return this.musicEnabled;
  }

  // -------------------------------------------------------------
  // SOUND EFFECTS GENERATORS
  // -------------------------------------------------------------

  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.2, pitchBend = 0) {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (pitchBend !== 0) {
        osc.frequency.linearRampToValueAtTime(freq + pitchBend, now + duration);
      }

      const masterVol = gainVal * this.sfxVolume;
      gain.gain.setValueAtTime(masterVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Audio error handling
    }
  }

  playJump() {
    this.initContext();
    this.playTone(180, 'square', 0.14, 0.2, 280);
  }

  playCoin() {
    this.initContext();
    if (!this.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.playTone(987.77, 'square', 0.08, 0.22); // B5
    setTimeout(() => {
      this.playTone(1318.51, 'square', 0.16, 0.22); // E6
    }, 70);
  }

  playHeart() {
    this.initContext();
    if (!this.soundEnabled || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.18, 0.28);
      }, idx * 60);
    });
  }

  playStar() {
    this.initContext();
    if (!this.soundEnabled || !this.ctx) return;
    const notes = [659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.25, 0.3);
      }, idx * 60);
    });
  }

  playCheckpoint() {
    this.initContext();
    if (!this.soundEnabled || !this.ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.15, 0.25);
      }, idx * 70);
    });
  }

  playHurt() {
    this.initContext();
    this.playTone(180, 'sawtooth', 0.2, 0.25, -120);
  }

  playButton() {
    this.initContext();
    this.playTone(600, 'square', 0.05, 0.15, 200);
  }

  playLevelComplete() {
    this.initContext();
    if (!this.soundEnabled || !this.ctx) return;
    const fanfare = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.50, d: 0.28 }, // C6
      { f: 880.00, d: 0.14 }, // A5
      { f: 1046.50, d: 0.40 } // C6
    ];
    let offset = 0;
    fanfare.forEach(item => {
      setTimeout(() => {
        this.playTone(item.f, 'triangle', item.d, 0.35);
        this.playTone(item.f / 2, 'square', item.d, 0.15);
      }, offset);
      offset += item.d * 1000 + 40;
    });
  }

  playBirthdayFanfare() {
    this.initContext();
    if (!this.soundEnabled || !this.ctx) return;
    // Classic Happy Birthday melody snippet in retro square/triangle
    const melody = [
      { f: 392, d: 0.25 },  // G4
      { f: 392, d: 0.15 },  // G4
      { f: 440, d: 0.4 },   // A4
      { f: 392, d: 0.4 },   // G4
      { f: 523.25, d: 0.4 },// C5
      { f: 493.88, d: 0.8 },// B4
      { f: 392, d: 0.25 },  // G4
      { f: 392, d: 0.15 },  // G4
      { f: 440, d: 0.4 },   // A4
      { f: 392, d: 0.4 },   // G4
      { f: 587.33, d: 0.4 },// D5
      { f: 523.25, d: 0.8 } // C5
    ];
    let delay = 0;
    melody.forEach(n => {
      setTimeout(() => {
        this.playTone(n.f, 'triangle', n.d * 0.9, 0.35);
        this.playTone(n.f / 2, 'square', n.d * 0.9, 0.15);
      }, delay);
      delay += n.d * 600;
    });
  }

  // -------------------------------------------------------------
  // RETRO BACKGROUND MUSIC ARPEGGIATOR / CHIPTUNE SYNTH
  // -------------------------------------------------------------

  playMusic(trackName) {
    this.initContext();
    this.currentTrack = trackName;
    if (!this.musicEnabled || !this.ctx) return;

    this.stopMusic();

    // Track patterns (notes in Hz)
    const tracks = {
      menu: [
        392.00, 440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00,
        329.63, 392.00, 440.00, 493.88, 523.25, 493.88, 440.00, 392.00
      ],
      countryside: [
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23,
        440.00, 587.33, 440.00, 349.23, 261.63, 329.63, 392.00, 329.63
      ],
      cave: [
        164.81, 196.00, 220.00, 246.94, 220.00, 196.00, 174.61, 220.00,
        164.81, 196.00, 246.94, 329.63, 246.94, 196.00, 146.83, 174.61
      ],
      mountains: [
        220.00, 277.18, 329.63, 440.00, 369.99, 329.63, 277.18, 220.00,
        293.66, 369.99, 440.00, 554.37, 440.00, 369.99, 293.66, 246.94
      ],
      beach: [
        329.63, 392.00, 493.88, 659.25, 587.33, 493.88, 392.00, 329.63,
        261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 329.63, 293.66
      ],
      castle: [
        261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63,
        349.23, 440.00, 523.25, 698.46, 587.33, 523.25, 440.00, 349.23
      ]
    };

    const pattern = tracks[trackName] || tracks.menu;
    this.bgmStep = 0;

    const tempo = trackName === 'cave' ? 240 : (trackName === 'beach' ? 170 : 190);

    this.bgmTimer = setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      const freq = pattern[this.bgmStep % pattern.length];
      const now = this.ctx.currentTime;

      // Lead melodic note
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = trackName === 'cave' ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(freq, now);

      const noteVol = 0.08 * this.musicVolume;
      gain.gain.setValueAtTime(noteVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (tempo / 1000) * 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + (tempo / 1000) * 0.9);

      // Bass note on every 4th beat
      if (this.bgmStep % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(freq / 2, now);
        const bassVol = 0.12 * this.musicVolume;
        bassGain.gain.setValueAtTime(bassVol, now);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + (tempo / 1000) * 1.8);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + (tempo / 1000) * 1.8);
      }

      this.bgmStep++;
    }, tempo);
  }

  stopMusic() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const audioSystem = new AudioSystem();

