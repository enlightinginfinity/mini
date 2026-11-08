/**
 * Main Menu Scene
 * Features animated title, personalized character preview, buttons, and sound toggles.
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';
import { progressSystem } from '../systems/ProgressSystem.js';
import { BIRTHDAY_CONFIG } from '../data/memories.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Start background music
    audioSystem.playMusic('menu');

    // Gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a103c, 0x1a103c, 0x311b92, 0x4a148c, 1);
    bg.fillRect(0, 0, width, height);

    // Twinkling stars in background
    for (let i = 0; i < 35; i++) {
      const sx = Phaser.Math.Between(10, width - 10);
      const sy = Phaser.Math.Between(10, height - 10);
      const star = this.add.circle(sx, sy, Phaser.Math.Between(1, 2.5), 0xffffff, Phaser.Math.FloatBetween(0.3, 0.9));
      this.tweens.add({
        targets: star,
        alpha: { from: 0.2, to: 1 },
        duration: Phaser.Math.Between(1000, 2500),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1500)
      });
    }

    // Title
    this.add.text(width / 2, 54, 'FRIENDSHIP QUEST', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '26px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Subtitle with personalized name!
    this.add.text(width / 2, 90, `${BIRTHDAY_CONFIG.recipientName}'s Birthday Adventure! 🎂`, {
      fontFamily: 'sans-serif',
      fontSize: '17px',
      fontWeight: 'bold',
      color: '#FF4081',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Character Preview Box (Enclosing the hero and prominent static PNG face)
    const charBox = this.add.graphics();
    charBox.fillStyle(0x000000, 0.4);
    charBox.fillRoundedRect(width / 2 - 80, 112, 160, 155, 16);
    charBox.lineStyle(2, 0xffd700, 0.9);
    charBox.strokeRoundedRect(width / 2 - 80, 112, 160, 155, 16);

    // Animated protagonist body
    const playerPreview = this.add.sprite(width / 2, 214, 'player_sheet', 0).setScale(1.9);
    playerPreview.play('player_idle');

    // High-resolution static PNG face overlay (Smooth, non-pixelated)
    if (this.textures.exists('hero_face_cutout')) {
      const facePreview = this.add.image(width / 2, 216, 'hero_face_cutout')
        .setDisplaySize(76, 114)
        .setOrigin(0.5, 0.88);
      this.tweens.add({
        targets: facePreview,
        y: 218,
        duration: 450,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    this.add.text(width / 2, 252, BIRTHDAY_CONFIG.recipientName, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '11px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    // Menu Buttons
    const btnStartY = 286;
    const btnSpacing = 52;

    this.createButton(width / 2, btnStartY, '▶ START ADVENTURE', '#4CAF50', () => {
      // If no levels completed yet, show character intro; otherwise level select
      if (progressSystem.progress.completedLevels.length === 0) {
        this.scene.start('CharacterIntroScene');
      } else {
        this.scene.start('LevelSelectScene');
      }
    });

    this.createButton(width / 2, btnStartY + btnSpacing, '📖 MEMORY ALBUM', '#2196F3', () => {
      this.scene.start('MemoryAlbumScene');
    });

    this.createButton(width / 2, btnStartY + btnSpacing * 2, '❓ HOW TO PLAY', '#9C27B0', () => {
      this.showHowToPlay();
    });

    // Sound toggle and Reset progress buttons row
    this.soundBtn = this.add.text(width / 2 - 80, btnStartY + btnSpacing * 3, `Sound: ${audioSystem.soundEnabled ? 'ON 🔊' : 'OFF 🔇'}`, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#FFEB3B'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.soundBtn.on('pointerdown', () => {
      const en = audioSystem.toggleSound();
      audioSystem.toggleMusic();
      this.soundBtn.setText(`Sound: ${en ? 'ON 🔊' : 'OFF 🔇'}`);
      audioSystem.playButton();
    });

    const resetBtn = this.add.text(width / 2 + 80, btnStartY + btnSpacing * 3, 'Reset Progress ↺', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#B0BEC5'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    resetBtn.on('pointerdown', () => {
      if (confirm('Reset your adventure progress?')) {
        progressSystem.resetProgress();
        audioSystem.playButton();
        this.scene.restart();
      }
    });

    // Tagline at bottom
    this.add.text(width / 2, height - 22, 'Five levels. Countless memories. One unforgettable birthday.', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#B39DDB'
    }).setOrigin(0.5);

    // Keyboard support: Enter starts adventure
    this.input.keyboard.on('keydown-ENTER', () => {
      audioSystem.playButton();
      this.scene.start(progressSystem.progress.completedLevels.length === 0 ? 'CharacterIntroScene' : 'LevelSelectScene');
    });
  }

  createButton(x, y, label, colorHex, onClick) {
    const btnW = 270;
    const btnH = 42;

    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(colorHex).color, 0.9);
    bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
    bg.lineStyle(2, 0xffffff, 0.9);
    bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
    container.add(bg);

    const text = this.add.text(0, 0, label, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '12px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    container.add(text);

    container.setInteractive(new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH), Phaser.Geom.Rectangle.Contains);

    container.on('pointerover', () => {
      container.setScale(1.04);
      bg.lineStyle(2, 0xffd700, 1);
      bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
    });

    container.on('pointerout', () => {
      container.setScale(1.0);
      bg.lineStyle(2, 0xffffff, 0.9);
      bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
    });

    container.on('pointerdown', () => {
      audioSystem.playButton();
      onClick();
    });

    return container;
  }

  showHowToPlay() {
    audioSystem.playButton();
    const width = this.scale.width;
    const height = this.scale.height;

    const modal = this.add.container(0, 0).setDepth(200);

    const backdrop = this.add.graphics();
    backdrop.fillStyle(0x000000, 0.85);
    backdrop.fillRect(0, 0, width, height);
    modal.add(backdrop);

    const boxW = 540;
    const boxH = 400;
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;

    const box = this.add.graphics();
    box.fillStyle(0x1a237e, 0.98);
    box.fillRoundedRect(boxX, boxY, boxW, boxH, 16);
    box.lineStyle(3, 0xffd700, 1);
    box.strokeRoundedRect(boxX, boxY, boxW, boxH, 16);
    modal.add(box);

    const title = this.add.text(width / 2, boxY + 36, 'HOW TO PLAY', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '18px',
      color: '#FFD700'
    }).setOrigin(0.5);
    modal.add(title);

    const content = [
      '💻 WINDOWS CONTROLS:',
      '• Move: Arrow Keys or A / D',
      '• Jump: Spacebar / Up Arrow / W',
      '• Pause: ESC',
      '',
      '📱 ANDROID / MOBILE CONTROLS:',
      '• Touch D-pad on screen (Left ◀ / Right ▶)',
      '• Jump button on the right side',
      '',
      '🎯 OBJECTIVE:',
      '• Collect 5 Memory Tokens in each level to unlock special memories!',
      '• Avoid gentle obstacles or hop over them.',
      '• Reach the goal at the end of each level.',
      '• Complete all 5 chapters for your final birthday surprise!'
    ].join('\n');

    const body = this.add.text(width / 2, boxY + 70, content, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#FFFFFF',
      lineSpacing: 5,
      align: 'left'
    }).setOrigin(0.5, 0);
    modal.add(body);

    const closeBtn = this.createButton(width / 2, boxY + boxH - 40, 'GOT IT! ➔', '#E91E63', () => {
      modal.destroy();
    });
    modal.add(closeBtn);
  }
}

