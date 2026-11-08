/**
 * Level Selection Scene
 * Displays all 5 chapters with locked/unlocked states and token progress.
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';
import { progressSystem } from '../systems/ProgressSystem.js';
import { LEVELS } from '../data/levels.js';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x120d29, 0x120d29, 0x241d3b, 0x311b92, 1);
    bg.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, 50, 'SELECT CHAPTER', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '22px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(width / 2, 85, 'Relive your favorite memories or continue your adventure', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#B39DDB'
    }).setOrigin(0.5);

    // Grid of 5 Level Cards
    const cardW = 145;
    const cardH = 260;
    const startX = (width - (cardW * 5 + 4 * 16)) / 2 + cardW / 2;
    const cardY = 240;

    LEVELS.forEach((lvl, idx) => {
      const cx = startX + idx * (cardW + 16);
      this.createLevelCard(cx, cardY, cardW, cardH, lvl);
    });

    // Back to Menu Button
    const backBtn = this.add.text(width / 2, height - 45, '◀ BACK TO MENU', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '13px',
      color: '#FFFFFF'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#FFD700'));
    backBtn.on('pointerout', () => backBtn.setColor('#FFFFFF'));
    backBtn.on('pointerdown', () => {
      audioSystem.playButton();
      this.scene.start('MenuScene');
    });
  }

  createLevelCard(x, y, w, h, level) {
    const isUnlocked = progressSystem.isLevelUnlocked(level.id);
    const isCompleted = progressSystem.isLevelCompleted(level.id);

    const card = this.add.container(x, y);

    // Card background
    const bg = this.add.graphics();
    const bgColor = isUnlocked ? (isCompleted ? 0x1b5e20 : 0x283593) : 0x263238;
    bg.fillStyle(bgColor, 0.95);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
    bg.lineStyle(2, isUnlocked ? (isCompleted ? 0x00e676 : 0xffd700) : 0x546e7a, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
    card.add(bg);

    // Level Number Header
    const num = this.add.text(0, -h / 2 + 25, `CH ${level.id}`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '14px',
      color: isUnlocked ? '#FFD700' : '#78909C'
    }).setOrigin(0.5);
    card.add(num);

    // Level Name
    const name = this.add.text(0, -h / 2 + 55, level.name, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      align: 'center',
      wordWrap: { width: w - 16 }
    }).setOrigin(0.5);
    card.add(name);

    // Icon / Thumbnail representation
    const icons = { 1: '🌻', 2: '💎', 3: '⛰️', 4: '🏖️', 5: '🎂' };
    const iconTxt = this.add.text(0, -5, isUnlocked ? icons[level.id] : '🔒', {
      fontSize: '40px'
    }).setOrigin(0.5);
    card.add(iconTxt);

    // Status / Subtitle
    const sub = this.add.text(0, 52, isUnlocked ? (isCompleted ? 'COMPLETED ⭐' : 'PLAY ➔') : 'LOCKED', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '9px',
      color: isUnlocked ? (isCompleted ? '#69F0AE' : '#FFEB3B') : '#90A4AE'
    }).setOrigin(0.5);
    card.add(sub);

    // Count collected tokens in this level
    let collectedInLevel = 0;
    level.collectibles.forEach(c => {
      if (progressSystem.isTokenCollected(c.id)) collectedInLevel++;
    });

    const tokenCount = this.add.text(0, 95, isUnlocked ? `Tokens: ${collectedInLevel}/5` : 'Complete Ch ' + (level.id - 1), {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#CFD8DC'
    }).setOrigin(0.5);
    card.add(tokenCount);

    if (isUnlocked) {
      card.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h), Phaser.Geom.Rectangle.Contains);
      card.on('pointerover', () => {
        card.setScale(1.05);
        bg.lineStyle(3, 0xffeb3b, 1);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
      });
      card.on('pointerout', () => {
        card.setScale(1.0);
        bg.lineStyle(2, isCompleted ? 0x00e676 : 0xffd700, 1);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
      });
      card.on('pointerdown', () => {
        audioSystem.playButton();
        this.scene.start(`Level${level.id}Scene`);
      });
    }

    return card;
  }
}

