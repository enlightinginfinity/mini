/**
 * Memory Management System
 */

import { LEVEL_MEMORIES, BIRTHDAY_CONFIG } from '../data/memories.js';
import { progressSystem } from './ProgressSystem.js';

class MemorySystem {
  getLevelData(levelId) {
    return LEVEL_MEMORIES[levelId] || null;
  }

  getMemoriesForLevel(levelId) {
    const level = LEVEL_MEMORIES[levelId];
    return level ? level.memories : [];
  }

  getChapterPhotoItems(chapterId) {
    const level = this.getLevelData(chapterId);
    if (!level) return [];

    const badgeTitles = {
      coin: '🪙 FUNNY MOMENT',
      heart: '❤️ HEARTFELT MEMORY',
      star: '⭐ SPECIAL TREASURE'
    };
    const badgeColors = {
      coin: '#FFB300',
      heart: '#FF4081',
      star: '#00E676'
    };

    const items = [
      {
        index: 0,
        photoKey: `photo_${chapterId}`,
        badge: '🌟 CHAPTER MILESTONE',
        badgeColor: '#FFD700',
        title: level.rewardTitle,
        story: level.rewardText,
        type: 'landmark',
        label: 'Cover',
        id: `landmark_${chapterId}`
      }
    ];

    level.memories.forEach((mem, idx) => {
      const num = idx + 1;
      items.push({
        index: num,
        photoKey: `photo_${chapterId}_${num}`,
        badge: badgeTitles[mem.type] || `⭐ MEMORY #${num}`,
        badgeColor: badgeColors[mem.type] || '#FFD700',
        title: mem.title,
        story: mem.story,
        preview: mem.preview,
        type: mem.type,
        label: `Photo ${num}`,
        id: mem.id
      });
    });

    return items;
  }

  getMemoryById(memoryId) {
    for (const lvlId in LEVEL_MEMORIES) {
      const mems = LEVEL_MEMORIES[lvlId].memories;
      const found = mems.find(m => m.id === memoryId);
      if (found) return found;
    }
    return null;
  }

  getAllUnlockedMemories() {
    const list = [];
    for (let lvl = 1; lvl <= 5; lvl++) {
      const level = LEVEL_MEMORIES[lvl];
      if (level) {
        level.memories.forEach(m => {
          if (progressSystem.isMemoryUnlocked(m.id)) {
            list.push({ ...m, levelId: lvl, levelTitle: level.levelTitle });
          }
        });
      }
    }
    return list;
  }

  getBirthdayConfig() {
    try {
      const custom = localStorage.getItem('friendship_quest_custom_config');
      if (custom) {
        const parsed = JSON.parse(custom);
        return {
          ...BIRTHDAY_CONFIG,
          ...parsed,
          finalCelebration: {
            ...BIRTHDAY_CONFIG.finalCelebration,
            ...(parsed.finalCelebration || {})
          }
        };
      }
    } catch (e) {
      // Fallback to static config
    }
    return BIRTHDAY_CONFIG;
  }
}

export const memorySystem = new MemorySystem();

