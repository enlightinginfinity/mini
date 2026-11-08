/**
 * Memory Reward Scene
 * Displayed upon completing a chapter.
 * Shows all 6 Polaroid photographs and stories unlocked for this chapter:
 *  - 1 Chapter Landmark / Cover Photograph
 *  - 5 Collected Memory Token Photographs
 * Full interactive carousel, clickable thumbnails, and full-screen lightbox!
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';
import { memorySystem } from '../systems/MemorySystem.js';

export class MemoryScene extends Phaser.Scene {
  constructor() {
    super('MemoryScene');
    this.activePhotoIndex = 0;
  }

  init(data) {
    this.levelId = data.levelId || 1;
    this.tokensCollected = data.tokensCollected || 5;
    this.levelMemories = memorySystem.getLevelData(this.levelId);
    this.photoItems = memorySystem.getChapterPhotoItems(this.levelId);
    this.activePhotoIndex = 0;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Start celebratory music
    audioSystem.playMusic('menu');

    // Rich gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x130a2a, 0x130a2a, 0x241147, 0x4a148c, 1);
    bg.fillRect(0, 0, width, height);

    // Floating confetti particles
    for (let i = 0; i < 22; i++) {
      const conf = this.add.image(
        Phaser.Math.Between(20, width - 20),
        Phaser.Math.Between(10, height - 10),
        `confetti_${i % 5}`
      );
      this.tweens.add({
        targets: conf,
        y: height + 20,
        rotation: Phaser.Math.FloatBetween(2, 6),
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    // Title
    this.add.text(width / 2, 26, `CHAPTER ${this.levelId} COMPLETE! 🎉`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '18px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 50, `✨ All 6 Memories & Photographs Recovered! ✨`, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#80DEEA',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Dynamic containers for gallery display
    this.photoContainer = this.add.container(0, 0);
    this.detailsContainer = this.add.container(0, 0);
    this.thumbnailsContainer = this.add.container(0, 0);

    // Render active photo and memory details
    this.renderActivePhoto();
    this.renderThumbnails();

    // Bottom Action Buttons
    const btnY = height - 42;
    const nextLevelId = this.levelId + 1;

    this.createButton(width / 2 - 150, btnY, 'CHAPTER SELECT 📋', '#2196F3', () => {
      this.scene.start('LevelSelectScene');
    });

    if (nextLevelId <= 5) {
      this.createButton(width / 2 + 150, btnY, `NEXT CHAPTER ${nextLevelId} ➔`, '#4CAF50', () => {
        this.scene.start(`Level${nextLevelId}Scene`);
      });
    } else {
      this.createButton(width / 2 + 150, btnY, 'BIRTHDAY FINALE 🎂➔', '#E91E63', () => {
        this.scene.start('BirthdayScene');
      });
    }

    // Keyboard support: Left/Right to flip photos, Enter to advance
    this.input.keyboard.on('keydown-LEFT', () => this.previousPhoto());
    this.input.keyboard.on('keydown-RIGHT', () => this.nextPhoto());
    this.input.keyboard.on('keydown-ENTER', () => {
      audioSystem.playButton();
      if (nextLevelId <= 5) {
        this.scene.start(`Level${nextLevelId}Scene`);
      } else {
        this.scene.start('BirthdayScene');
      }
    });
  }

  renderActivePhoto() {
    this.photoContainer.removeAll(true);
    this.detailsContainer.removeAll(true);

    const item = this.photoItems[this.activePhotoIndex];
    if (!item) return;

    // --- LEFT COLUMN: POLAROID PHOTO DISPLAY ---
    const photoCenterX = 205;
    const photoCenterY = 175;
    const photoW = 310;
    const photoH = 205;

    // Drop shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.45);
    shadow.fillRoundedRect(photoCenterX - photoW / 2 + 6, photoCenterY - photoH / 2 + 6, photoW, photoH, 10);
    this.photoContainer.add(shadow);

    // Polaroid frame border
    const frame = this.add.graphics();
    frame.fillStyle(0xffffff, 0.95);
    frame.fillRoundedRect(photoCenterX - photoW / 2 - 4, photoCenterY - photoH / 2 - 4, photoW + 8, photoH + 8, 10);
    this.photoContainer.add(frame);

    // Main Photograph image
    const photoImg = this.add.image(photoCenterX, photoCenterY, item.photoKey)
      .setDisplaySize(photoW, photoH)
      .setInteractive({ useHandCursor: true });
    this.photoContainer.add(photoImg);

    photoImg.on('pointerdown', () => {
      audioSystem.playButton();
      this.showEnlargedPhoto(item);
    });

    // Arrow navigation bar beneath main photo
    const navY = 295;

    // Left Arrow Button
    const prevBtn = this.createArrowButton(photoCenterX - 130, navY, '◀', () => this.previousPhoto());
    this.photoContainer.add(prevBtn);

    // Indicator pill in center
    const pill = this.add.graphics();
    pill.fillStyle(0x000000, 0.6);
    pill.fillRoundedRect(photoCenterX - 95, navY - 14, 190, 28, 14);
    pill.lineStyle(1, 0xffd700, 0.8);
    pill.strokeRoundedRect(photoCenterX - 95, navY - 14, 190, 28, 14);
    this.photoContainer.add(pill);

    const counterTxt = this.add.text(photoCenterX, navY, `${this.activePhotoIndex + 1}/6: ${item.label}`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '10px',
      color: '#FFD700'
    }).setOrigin(0.5);
    this.photoContainer.add(counterTxt);

    // Right Arrow Button
    const nextBtn = this.createArrowButton(photoCenterX + 130, navY, '▶', () => this.nextPhoto());
    this.photoContainer.add(nextBtn);

    // Click to enlarge hint below photo
    const enlargeHint = this.add.text(photoCenterX, 382, '🔍 Click photo to view full-screen', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#B0BEC5'
    }).setOrigin(0.5);
    this.photoContainer.add(enlargeHint);

    // --- RIGHT COLUMN: MEMORY STORY & CAPTION CARD ---
    const cardX = 385;
    const cardY = 72;
    const cardW = 385;
    const cardH = 318;

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x11162b, 0.92);
    cardBg.fillRoundedRect(cardX, cardY, cardW, cardH, 14);
    cardBg.lineStyle(2, Phaser.Display.Color.HexStringToColor(item.badgeColor).color, 0.9);
    cardBg.strokeRoundedRect(cardX, cardY, cardW, cardH, 14);
    this.detailsContainer.add(cardBg);

    // Category Badge
    const badgeBg = this.add.graphics();
    badgeBg.fillStyle(Phaser.Display.Color.HexStringToColor(item.badgeColor).color, 0.2);
    badgeBg.fillRoundedRect(cardX + 16, cardY + 16, 210, 24, 6);
    badgeBg.lineStyle(1, Phaser.Display.Color.HexStringToColor(item.badgeColor).color, 0.8);
    badgeBg.strokeRoundedRect(cardX + 16, cardY + 16, 210, 24, 6);
    this.detailsContainer.add(badgeBg);

    const badgeTxt = this.add.text(cardX + 26, cardY + 28, item.badge, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontWeight: 'bold',
      color: item.badgeColor
    }).setOrigin(0, 0.5);
    this.detailsContainer.add(badgeTxt);

    // Title
    const titleTxt = this.add.text(cardX + 16, cardY + 54, item.title, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '12px',
      color: '#FFD700',
      lineSpacing: 4,
      wordWrap: { width: cardW - 32 }
    });
    this.detailsContainer.add(titleTxt);

    // Divider
    const div = this.add.graphics();
    div.lineStyle(1, 0x3949ab, 0.7);
    div.lineBetween(cardX + 16, cardY + 104, cardX + cardW - 16, cardY + 104);
    this.detailsContainer.add(div);

    // Enlarged View Full Image Button (descriptions removed)
    const expandBtn = this.createButton(cardX + cardW / 2, cardY + 225, '🔍 VIEW FULL IMAGE', item.badgeColor, () => {
      this.showEnlargedPhoto(item);
    }, 290, 52, '12px');
    this.detailsContainer.add(expandBtn);
  }

  renderThumbnails() {
    this.thumbnailsContainer.removeAll(true);

    const photoCenterX = 205;
    const thumbY = 345;
    const thumbW = 44;
    const thumbH = 32;
    const gap = 6;
    const totalW = this.photoItems.length * thumbW + (this.photoItems.length - 1) * gap;
    const startX = photoCenterX - totalW / 2 + thumbW / 2;

    this.photoItems.forEach((item, idx) => {
      const tx = startX + idx * (thumbW + gap);
      const isSelected = idx === this.activePhotoIndex;

      const thumbBox = this.add.container(tx, thumbY);

      // Thumbnail Image
      const img = this.add.image(0, 0, item.photoKey).setDisplaySize(thumbW, thumbH);
      thumbBox.add(img);

      // Frame Outline
      const border = this.add.graphics();
      if (isSelected) {
        border.lineStyle(2, 0xffd700, 1);
        border.strokeRoundedRect(-thumbW / 2 - 2, -thumbH / 2 - 2, thumbW + 4, thumbH + 4, 4);
      } else {
        border.lineStyle(1, 0xffffff, 0.4);
        border.strokeRoundedRect(-thumbW / 2, -thumbH / 2, thumbW, thumbH, 4);
      }
      thumbBox.add(border);

      thumbBox.setSize(thumbW, thumbH);
      thumbBox.setInteractive({ useHandCursor: true });

      thumbBox.on('pointerdown', () => {
        audioSystem.playButton();
        this.activePhotoIndex = idx;
        this.renderActivePhoto();
        this.renderThumbnails();
      });

      thumbBox.on('pointerover', () => {
        thumbBox.setScale(1.12);
      });
      thumbBox.on('pointerout', () => {
        thumbBox.setScale(isSelected ? 1.05 : 1.0);
      });

      if (isSelected) thumbBox.setScale(1.05);

      this.thumbnailsContainer.add(thumbBox);
    });
  }

  previousPhoto() {
    audioSystem.playButton();
    this.activePhotoIndex = (this.activePhotoIndex - 1 + this.photoItems.length) % this.photoItems.length;
    this.renderActivePhoto();
    this.renderThumbnails();
  }

  nextPhoto() {
    audioSystem.playButton();
    this.activePhotoIndex = (this.activePhotoIndex + 1) % this.photoItems.length;
    this.renderActivePhoto();
    this.renderThumbnails();
  }

  createArrowButton(x, y, symbol, onClick) {
    const btn = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(0x311b92, 0.9);
    bg.fillRoundedRect(-18, -14, 36, 28, 6);
    bg.lineStyle(1, 0xffd700, 0.9);
    bg.strokeRoundedRect(-18, -14, 36, 28, 6);
    btn.add(bg);

    const txt = this.add.text(0, 0, symbol, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '11px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    btn.add(txt);

    btn.setSize(36, 28);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerdown', onClick);
    btn.on('pointerover', () => btn.setScale(1.1));
    btn.on('pointerout', () => btn.setScale(1.0));

    return btn;
  }

  createButton(x, y, label, colorHex, onClick, w = 220, h = 42, fontSize = '10px') {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(colorHex).color, 0.95);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    bg.lineStyle(2, 0xffffff, 0.9);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    container.add(bg);

    const text = this.add.text(0, 0, label, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: fontSize,
      color: '#FFFFFF'
    }).setOrigin(0.5);
    container.add(text);

    container.setSize(w, h);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerover', () => {
      container.setScale(1.04);
      bg.lineStyle(2, 0xffd700, 1);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    });

    container.on('pointerout', () => {
      container.setScale(1.0);
      bg.lineStyle(2, 0xffffff, 0.9);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    });

    container.on('pointerdown', () => {
      audioSystem.playButton();
      onClick();
    });

    return container;
  }

  showEnlargedPhoto(item) {
    const width = this.scale.width;
    const height = this.scale.height;

    const modal = this.add.container(0, 0).setDepth(400);

    // Dark backdrop
    const backdrop = this.add.graphics();
    backdrop.fillStyle(0x000000, 0.92);
    backdrop.fillRect(0, 0, width, height);
    modal.add(backdrop);

    // Enlarged Photo
    const photoW = Math.min(width - 100, 560);
    const photoH = photoW * 0.65;
    const photoY = height / 2 - 12;

    const photoFrame = this.add.graphics();
    photoFrame.fillStyle(0xffffff, 1);
    photoFrame.fillRoundedRect(width / 2 - photoW / 2 - 6, photoY - photoH / 2 - 6, photoW + 12, photoH + 12, 10);
    modal.add(photoFrame);

    const photo = this.add.image(width / 2, photoY, item.photoKey).setDisplaySize(photoW, photoH);
    modal.add(photo);

    // Title above
    const title = this.add.text(width / 2, photoY - photoH / 2 - 20, `${item.badge}: ${item.title}`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '11px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    modal.add(title);

    // Close Button
    const closeBtn = this.createButton(width / 2, height - 35, '✖ CLOSE', '#E91E63', () => {
      modal.destroy();
    }, 180, 36);
    modal.add(closeBtn);

    backdrop.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
    backdrop.on('pointerdown', () => modal.destroy());
  }
}
