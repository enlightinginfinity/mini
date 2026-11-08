/**
 * Progress Management and Persistence System (LocalStorage)
 */

import { STORAGE_KEYS } from '../data/settings.js';

class ProgressSystem {
  constructor() {
    this.progress = {
      unlockedLevels: [1], // Level 1 is always unlocked
      completedLevels: [],
      collectedTokens: [],
      unlockedMemories: []
    };

    this.load();
  }

  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (data) {
        const parsed = JSON.parse(data);
        this.progress.unlockedLevels = parsed.unlockedLevels || [1];
        this.progress.completedLevels = parsed.completedLevels || [];
        this.progress.collectedTokens = parsed.collectedTokens || [];
        this.progress.unlockedMemories = parsed.unlockedMemories || [];
      }
    } catch (e) {
      console.warn("Could not load game progress", e);
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(this.progress));
    } catch (e) {
      console.warn("Could not save game progress", e);
    }
  }

  isLevelUnlocked(levelId) {
    return this.progress.unlockedLevels.includes(Number(levelId));
  }

  isLevelCompleted(levelId) {
    return this.progress.completedLevels.includes(Number(levelId));
  }

  completeLevel(levelId) {
    const id = Number(levelId);
    if (!this.progress.completedLevels.includes(id)) {
      this.progress.completedLevels.push(id);
    }
    // Unlock next level (up to level 5)
    const nextLevel = id + 1;
    if (nextLevel <= 5 && !this.progress.unlockedLevels.includes(nextLevel)) {
      this.progress.unlockedLevels.push(nextLevel);
    }
    // Guarantee all 5 memories for this level are unlocked upon level completion
    for (let m = 1; m <= 5; m++) {
      const memId = `m_${id}_${m}`;
      if (!this.progress.unlockedMemories.includes(memId)) {
        this.progress.unlockedMemories.push(memId);
      }
    }
    this.save();
  }

  collectToken(tokenId, memoryId) {
    if (!this.progress.collectedTokens.includes(tokenId)) {
      this.progress.collectedTokens.push(tokenId);
    }
    if (memoryId && !this.progress.unlockedMemories.includes(memoryId)) {
      this.progress.unlockedMemories.push(memoryId);
    }
    this.save();
  }

  isTokenCollected(tokenId) {
    return this.progress.collectedTokens.includes(tokenId);
  }

  isMemoryUnlocked(memoryId) {
    return this.progress.unlockedMemories.includes(memoryId);
  }

  getUnlockedMemoriesCount() {
    return this.progress.unlockedMemories.length;
  }

  getTotalTokensCollected() {
    return this.progress.collectedTokens.length;
  }

  resetProgress() {
    this.progress = {
      unlockedLevels: [1],
      completedLevels: [],
      collectedTokens: [],
      unlockedMemories: []
    };
    this.save();
  }
}

export const progressSystem = new ProgressSystem();

