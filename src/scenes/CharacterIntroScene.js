/**
 * Character Introduction Scene
 * Introduces the birthday protagonist with animated dialogue and celebration.
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';
import { BIRTHDAY_CONFIG } from '../data/memories.js';

export class CharacterIntroScene extends Phaser.Scene {
  constructor() {
    super('CharacterIntroScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a237e, 0x1a237e, 0x0d47a1, 0x01579b, 1);
    bg.fillRect(0, 0, width, height);

    // Floating festive sparkles
    for (let i = 0; i < 25; i++) {
      const spk = this.add.image(
        Phaser.Math.Between(20, width - 20),
        Phaser.Math.Between(20, height - 20),
        'particle_sparkle'
      ).setScale(Phaser.Math.FloatBetween(0.5, 1.2)).setAlpha(0.7);

      this.tweens.add({
        targets: spk,
        y: spk.y - 30,
        alpha: 0.2,
        duration: Phaser.Math.Between(1500, 3000),
        yoyo: true,
        repeat: -1
      });
    }

    // Title
    this.add.text(width / 2, 50, 'MEET THE HERO!', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '22px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5);

    // Character showcase with glowing pedestal
    const pedestal = this.add.ellipse(width / 2, 205, 160, 28, 0xffd700, 0.4);
    this.tweens.add({
      targets: pedestal,
      scaleX: 1.15,
      alpha: 0.7,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    const hero = this.add.sprite(width / 2, 175, 'player_sheet', 0).setScale(2.2);
    hero.play('player_celebrate');

    // High-resolution static PNG face overlay (Smooth, non-pixelated)
    if (this.textures.exists('hero_face_cutout')) {
      const faceShowcase = this.add.image(width / 2, 173, 'hero_face_cutout')
        .setDisplaySize(86, 128)
        .setOrigin(0.5, 0.88);
      this.tweens.add({
        targets: faceShowcase,
        y: 170,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    this.add.text(width / 2, 226, `🌟 ${BIRTHDAY_CONFIG.recipientName} 🌟`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '14px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Dialogue speech box
    const boxW = Math.min(width - 60, 620);
    const boxH = 175;
    const boxX = (width - boxW) / 2;
    const boxY = 255;

    const dialogBox = this.add.graphics();
    dialogBox.fillStyle(0x000000, 0.6);
    dialogBox.fillRoundedRect(boxX, boxY, boxW, boxH, 16);
    dialogBox.lineStyle(3, 0xff4081, 1);
    dialogBox.strokeRoundedRect(boxX, boxY, boxW, boxH, 16);

    const introLines = [
      `"Well, look who's entering the adventure! 🎂"`,
      '',
      `Hey ${BIRTHDAY_CONFIG.recipientName}! Our precious memories have been scattered across`,
      `5 magical chapters of friendship. Your quest is to run, jump, and collect`,
      `every memory token to recover our story and unlock your Birthday Surprise!`
    ].join('\n');

    this.add.text(width / 2, boxY + 22, introLines, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#FFFFFF',
      lineSpacing: 4,
      align: 'center'
    }).setOrigin(0.5, 0);

    // Let's Go Button
    const startBtn = this.createButton(width / 2, boxY + boxH + 45, "LET'S BEGIN CHAPTER 1 ➔", () => {
      this.scene.start('Level1Scene');
    });

    // Keyboard support: Enter key
    this.input.keyboard.on('keydown-ENTER', () => {
      audioSystem.playButton();
      this.scene.start('Level1Scene');
    });
  }

  createButton(x, y, label, onClick) {
    const btnW = 320;
    const btnH = 46;

    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(0x4caf50, 1);
    bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 12);
    bg.lineStyle(2, 0xffffff, 1);
    bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 12);
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
      bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 12);
    });

    container.on('pointerout', () => {
      container.setScale(1.0);
      bg.lineStyle(2, 0xffffff, 1);
      bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 12);
    });

    container.on('pointerdown', () => {
      audioSystem.playButton();
      onClick();
    });

    return container;
  }
}

