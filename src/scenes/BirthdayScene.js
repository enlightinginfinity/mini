/**
 * Final Birthday Screen
 * The grand emotional climax of Friendship Quest!
 * Features continuous fireworks, opening treasure chest, personalized letter, and celebration.
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';
import { BIRTHDAY_CONFIG } from '../data/memories.js';

export class BirthdayScene extends Phaser.Scene {
  constructor() {
    super('BirthdayScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Start celebration fanfare
    audioSystem.playBirthdayFanfare();
    audioSystem.playMusic('castle');

    // Deep midnight sky background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d081e, 0x0d081e, 0x1f0d3d, 0x3d0b5e, 1);
    bg.fillRect(0, 0, width, height);

    // Continuous fireworks emitter
    this.createFireworks(width, height);

    // Confetti falling continuously
    for (let i = 0; i < 30; i++) {
      const conf = this.add.image(
        Phaser.Math.Between(10, width - 10),
        Phaser.Math.Between(-50, height),
        `confetti_${i % 5}`
      );
      this.tweens.add({
        targets: conf,
        y: height + 30,
        x: conf.x + Phaser.Math.Between(-40, 40),
        rotation: Phaser.Math.FloatBetween(4, 10),
        duration: Phaser.Math.Between(2500, 5000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    // Royal Banner Title
    this.add.text(width / 2, 34, BIRTHDAY_CONFIG.finalCelebration.title, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '20px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, 60, BIRTHDAY_CONFIG.finalCelebration.tagline, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#FF80AB',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Golden Treasure Chest with Radiant Light Beams (Placed beside the hero)
    const chestX = width / 2 - 120;
    const chestY = 180;

    // Light rays
    const rays = this.add.graphics();
    rays.fillStyle(0xffd700, 0.22);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      rays.slice(chestX, chestY, 120, a, a + 0.25, false);
      rays.fillPath();
    }
    this.tweens.add({
      targets: rays,
      angle: 360,
      duration: 12000,
      repeat: -1
    });

    const chest = this.add.image(chestX, chestY, 'goal_chest').setScale(1.7);
    this.tweens.add({
      targets: chest,
      scaleX: 1.8,
      scaleY: 1.8,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // Dancing Protagonist (Proudly standing beside the treasure chest)
    const heroX = width / 2 - 280;
    const heroY = 190;
    const hero = this.add.sprite(heroX, heroY, 'player_sheet', 0).setScale(2.2);
    hero.play('player_celebrate');

    // High-resolution static PNG face overlay (Smooth, non-pixelated)
    if (this.textures.exists('hero_face_cutout')) {
      const heroFace = this.add.image(heroX, heroY - 2, 'hero_face_cutout')
        .setDisplaySize(86, 128)
        .setOrigin(0.5, 0.88);
      this.tweens.add({
        targets: heroFace,
        y: heroY - 5,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Final Polaroid Photo (Centered below hero and treasure chest)
    const photoW = 200;
    const photoH = 145;
    const photoImg = this.add.image(width / 2 - 200, 335, 'photo_final').setDisplaySize(photoW, photoH);

    // Heartfelt Birthday Letter Box (Right Side)
    const letterW = Math.min(width / 2 + 80, 480);
    const letterH = 340;
    const letterX = width / 2 - 40;
    const letterY = 82;

    const letterBox = this.add.graphics();
    letterBox.fillStyle(0x1a237e, 0.92);
    letterBox.fillRoundedRect(letterX, letterY, letterW, letterH, 16);
    letterBox.lineStyle(3, 0xffd700, 1);
    letterBox.strokeRoundedRect(letterX, letterY, letterW, letterH, 16);

    // Letter Content
    const letterText = BIRTHDAY_CONFIG.finalCelebration.letterParagraphs.join('\n\n');
    this.add.text(letterX + 22, letterY + 18, letterText, {
      fontFamily: 'Georgia, serif, sans-serif',
      fontSize: '13.5px',
      color: '#FFFFFF',
      lineSpacing: 3,
      wordWrap: { width: letterW - 44 }
    });

    // Buttons at Bottom
    const btnY = height - 42;

    this.createButton(width / 2 - 140, btnY, '🔄 REPLAY ADVENTURE', '#4CAF50', () => {
      this.scene.start('Level1Scene');
    });

    this.createButton(width / 2 + 140, btnY, '📖 VIEW ALL MEMORIES', '#2196F3', () => {
      this.scene.start('MemoryAlbumScene');
    });
  }

  createFireworks(w, h) {
    const fireworkTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const fx = Phaser.Math.Between(80, w - 80);
        const fy = Phaser.Math.Between(60, 240);
        const colorIdx = Phaser.Math.Between(0, 4);

        const burst = this.add.particles(fx, fy, `confetti_${colorIdx}`, {
          speed: { min: 60, max: 180 },
          angle: { min: 0, max: 360 },
          scale: { start: 1, end: 0 },
          lifespan: 800,
          gravityY: 100,
          quantity: 20
        });

        this.time.delayedCall(850, () => burst.destroy());
      }
    });
  }

  createButton(x, y, label, colorHex, onClick) {
    const btnW = 240;
    const btnH = 44;

    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(colorHex).color, 0.95);
    bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
    bg.lineStyle(2, 0xffffff, 0.9);
    bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
    container.add(bg);

    const text = this.add.text(0, 0, label, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '10px',
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
}

