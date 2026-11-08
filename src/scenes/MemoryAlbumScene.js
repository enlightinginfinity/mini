/**
 * Memory Album Scene
 * Revisit all 6 unlocked photographs and stories for every chapter (30 total photos + climax).
 * Features 5 chapter tabs, 6-photo thumbnail strip, active Polaroid stage, and full-screen lightbox.
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';
import { progressSystem } from '../systems/ProgressSystem.js';
import { memorySystem } from '../systems/MemorySystem.js';

export class MemoryAlbumScene extends Phaser.Scene {
  constructor() {
    super('MemoryAlbumScene');
    this.selectedChapter = 1;
    this.activePhotoIndex = 0;
  }

  init(data) {
    this.selectedChapter = data && data.chapterId ? data.chapterId : 1;
    this.activePhotoIndex = 0;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Rich background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x110b24, 0x110b24, 0x1b1338, 0x0f2b46, 1);
    bg.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, 28, '📖 MEMORY ALBUM 📖', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '18px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5);

    // Chapter Tab Buttons
    this.tabButtons = [];
    const tabW = 124;
    const tabH = 32;
    const startX = width / 2 - (tabW * 5 + 4 * 10) / 2 + tabW / 2;
    const tabY = 66;

    for (let c = 1; c <= 5; c++) {
      const tx = startX + (c - 1) * (tabW + 10);
      const btn = this.createTabButton(tx, tabY, tabW, tabH, `Ch ${c}`, c);
      this.tabButtons.push(btn);
    }

    // Dynamic containers for chapter content
    this.contentContainer = this.add.container(0, 0);

    // Render active chapter
    this.displayChapter(this.selectedChapter);

    // Bottom Navigation Bar
    const backBtn = this.add.text(80, height - 25, '◀ BACK TO MENU', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '10px',
      color: '#FFFFFF'
    }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#FFD700'));
    backBtn.on('pointerout', () => backBtn.setColor('#FFFFFF'));
    backBtn.on('pointerdown', () => {
      audioSystem.playButton();
      this.scene.start('MenuScene');
    });

    const keyHint = this.add.text(width - 40, height - 25, 'Keys: ◀/▶ Flip Photos  •  1-5 Jump Chapters', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#90A4AE'
    }).setOrigin(1, 0.5);

    // Keyboard support
    this.input.keyboard.on('keydown-LEFT', () => this.previousPhoto());
    this.input.keyboard.on('keydown-RIGHT', () => this.nextPhoto());
    this.input.keyboard.on('keydown-ESC', () => {
      audioSystem.playButton();
      this.scene.start('MenuScene');
    });

    for (let i = 1; i <= 5; i++) {
      this.input.keyboard.on(`keydown-${i}`, () => {
        this.selectChapter(i);
      });
    }
  }

  createTabButton(x, y, w, h, label, chapterId) {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    const isSelected = chapterId === this.selectedChapter;
    bg.fillStyle(isSelected ? 0xff4081 : 0x283593, 0.9);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    bg.lineStyle(2, isSelected ? 0xffeb3b : 0xffffff, 0.8);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    container.add(bg);

    const txt = this.add.text(0, 0, label, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '10px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    container.add(txt);

    container.setSize(w, h);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerdown', () => {
      this.selectChapter(chapterId);
    });

    container.bg = bg;
    container.txt = txt;
    container.w = w;
    container.h = h;
    container.chapterId = chapterId;

    return container;
  }

  selectChapter(chapterId) {
    audioSystem.playButton();
    this.selectedChapter = chapterId;
    this.activePhotoIndex = 0;
    this.updateTabs();
    this.displayChapter(chapterId);
  }

  updateTabs() {
    this.tabButtons.forEach(btn => {
      const isSelected = btn.chapterId === this.selectedChapter;
      btn.bg.clear();
      btn.bg.fillStyle(isSelected ? 0xff4081 : 0x283593, 0.9);
      btn.bg.fillRoundedRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h, 8);
      btn.bg.lineStyle(2, isSelected ? 0xffeb3b : 0xffffff, 0.8);
      btn.bg.strokeRoundedRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h, 8);
    });
  }

  displayChapter(chapterId) {
    this.contentContainer.removeAll(true);
    const width = this.scale.width;
    const isUnlocked = progressSystem.isLevelUnlocked(chapterId);
    const levelData = memorySystem.getLevelData(chapterId);
    this.photoItems = memorySystem.getChapterPhotoItems(chapterId);

    if (!isUnlocked) {
      // Locked Chapter Notice
      const lockBox = this.add.graphics();
      lockBox.fillStyle(0x000000, 0.5);
      lockBox.fillRoundedRect(width / 2 - 250, 160, 500, 220, 16);
      lockBox.lineStyle(2, 0x546e7a, 0.8);
      lockBox.strokeRoundedRect(width / 2 - 250, 160, 500, 220, 16);
      this.contentContainer.add(lockBox);

      const lockIcon = this.add.text(width / 2, 220, '🔒', { fontSize: '48px' }).setOrigin(0.5);
      const lockTxt = this.add.text(width / 2, 280, `Chapter ${chapterId} is Locked`, {
        fontFamily: '"Press Start 2P", monospace, sans-serif',
        fontSize: '14px',
        color: '#FFD700'
      }).setOrigin(0.5);
      const lockSub = this.add.text(width / 2, 320, `Complete Chapter ${chapterId - 1} in adventure mode to unlock!`, {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#B0BEC5'
      }).setOrigin(0.5);

      this.contentContainer.add([lockIcon, lockTxt, lockSub]);
      return;
    }

    // Active Photo Container & Story Container
    this.photoStage = this.add.container(0, 0);
    this.storyStage = this.add.container(0, 0);
    this.thumbsStage = this.add.container(0, 0);

    this.contentContainer.add([this.photoStage, this.storyStage, this.thumbsStage]);

    this.renderChapterPhoto();
    this.renderChapterThumbnails();
  }

  renderChapterPhoto() {
    this.photoStage.removeAll(true);
    this.storyStage.removeAll(true);

    const item = this.photoItems[this.activePhotoIndex];
    if (!item) return;

    // --- LEFT COLUMN: POLAROID PHOTO DISPLAY ---
    const photoCenterX = 205;
    const photoCenterY = 195;
    const photoW = 310;
    const photoH = 205;

    // Shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.45);
    shadow.fillRoundedRect(photoCenterX - photoW / 2 + 6, photoCenterY - photoH / 2 + 6, photoW, photoH, 10);
    this.photoStage.add(shadow);

    // Frame border
    const frame = this.add.graphics();
    frame.fillStyle(0xffffff, 0.95);
    frame.fillRoundedRect(photoCenterX - photoW / 2 - 4, photoCenterY - photoH / 2 - 4, photoW + 8, photoH + 8, 10);
    this.photoStage.add(frame);

    // Photo
    const photoImg = this.add.image(photoCenterX, photoCenterY, item.photoKey)
      .setDisplaySize(photoW, photoH)
      .setInteractive({ useHandCursor: true });
    this.photoStage.add(photoImg);

    photoImg.on('pointerdown', () => {
      audioSystem.playButton();
      this.showEnlargedPhoto(item);
    });

    // Navigation bar beneath photo
    const navY = 315;

    const prevBtn = this.createArrowButton(photoCenterX - 130, navY, '◀', () => this.previousPhoto());
    this.photoStage.add(prevBtn);

    const pill = this.add.graphics();
    pill.fillStyle(0x000000, 0.6);
    pill.fillRoundedRect(photoCenterX - 95, navY - 14, 190, 28, 14);
    pill.lineStyle(1, 0xffd700, 0.8);
    pill.strokeRoundedRect(photoCenterX - 95, navY - 14, 190, 28, 14);
    this.photoStage.add(pill);

    const counterTxt = this.add.text(photoCenterX, navY, `${this.activePhotoIndex + 1}/6: ${item.label}`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '10px',
      color: '#FFD700'
    }).setOrigin(0.5);
    this.photoStage.add(counterTxt);

    const nextBtn = this.createArrowButton(photoCenterX + 130, navY, '▶', () => this.nextPhoto());
    this.photoStage.add(nextBtn);

    const hintTxt = this.add.text(photoCenterX, 395, '🔍 Click photo to view full-screen', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#B0BEC5'
    }).setOrigin(0.5);
    this.photoStage.add(hintTxt);

    // --- RIGHT COLUMN: MEMORY STORY CARD ---
    const cardX = 385;
    const cardY = 92;
    const cardW = 385;
    const cardH = 328;

    const levelData = memorySystem.getLevelData(this.selectedChapter);

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x11162b, 0.92);
    cardBg.fillRoundedRect(cardX, cardY, cardW, cardH, 14);
    cardBg.lineStyle(2, Phaser.Display.Color.HexStringToColor(item.badgeColor).color, 0.9);
    cardBg.strokeRoundedRect(cardX, cardY, cardW, cardH, 14);
    this.storyStage.add(cardBg);

    // Chapter Header
    const chHeader = this.add.text(cardX + 20, cardY + 20, `CH ${this.selectedChapter}: ${levelData.levelTitle.toUpperCase()}`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '10px',
      color: '#80DEEA'
    });
    this.storyStage.add(chHeader);

    // Category Badge
    const badgeBg = this.add.graphics();
    badgeBg.fillStyle(Phaser.Display.Color.HexStringToColor(item.badgeColor).color, 0.2);
    badgeBg.fillRoundedRect(cardX + 20, cardY + 46, 210, 24, 6);
    badgeBg.lineStyle(1, Phaser.Display.Color.HexStringToColor(item.badgeColor).color, 0.8);
    badgeBg.strokeRoundedRect(cardX + 20, cardY + 46, 210, 24, 6);
    this.storyStage.add(badgeBg);

    const badgeTxt = this.add.text(cardX + 30, cardY + 58, item.badge, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontWeight: 'bold',
      color: item.badgeColor
    }).setOrigin(0, 0.5);
    this.storyStage.add(badgeTxt);

    // Title
    const titleTxt = this.add.text(cardX + 20, cardY + 86, item.title, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '12px',
      color: '#FFD700',
      lineSpacing: 5,
      wordWrap: { width: cardW - 40 }
    });
    this.storyStage.add(titleTxt);

    // Divider
    const div = this.add.graphics();
    div.lineStyle(1, 0x3949ab, 0.7);
    div.lineBetween(cardX + 20, cardY + 145, cardX + cardW - 20, cardY + 145);
    this.storyStage.add(div);

    // Enlarged View Full Image Button (descriptions removed from album)
    const viewBtn = this.createButton(cardX + cardW / 2, cardY + 230, '🔍 VIEW FULL IMAGE', item.badgeColor, () => {
      this.showEnlargedPhoto(item);
    }, 290, 52, '12px');
    this.storyStage.add(viewBtn);
  }

  renderChapterThumbnails() {
    this.thumbsStage.removeAll(true);

    const photoCenterX = 205;
    const thumbY = 362;
    const thumbW = 44;
    const thumbH = 32;
    const gap = 6;
    const totalW = this.photoItems.length * thumbW + (this.photoItems.length - 1) * gap;
    const startX = photoCenterX - totalW / 2 + thumbW / 2;

    this.photoItems.forEach((item, idx) => {
      const tx = startX + idx * (thumbW + gap);
      const isSelected = idx === this.activePhotoIndex;

      const thumbBox = this.add.container(tx, thumbY);

      const img = this.add.image(0, 0, item.photoKey).setDisplaySize(thumbW, thumbH);
      thumbBox.add(img);

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
        this.renderChapterPhoto();
        this.renderChapterThumbnails();
      });

      thumbBox.on('pointerover', () => thumbBox.setScale(1.12));
      thumbBox.on('pointerout', () => thumbBox.setScale(isSelected ? 1.05 : 1.0));

      if (isSelected) thumbBox.setScale(1.05);

      this.thumbsStage.add(thumbBox);
    });
  }

  previousPhoto() {
    audioSystem.playButton();
    this.activePhotoIndex = (this.activePhotoIndex - 1 + this.photoItems.length) % this.photoItems.length;
    this.renderChapterPhoto();
    this.renderChapterThumbnails();
  }

  nextPhoto() {
    audioSystem.playButton();
    this.activePhotoIndex = (this.activePhotoIndex + 1) % this.photoItems.length;
    this.renderChapterPhoto();
    this.renderChapterThumbnails();
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

  createButton(x, y, label, colorHex, onClick, w = 220, h = 34, fontSize = '10px') {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(colorHex).color, 0.95);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    bg.lineStyle(2, 0xffffff, 0.9);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
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
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    });

    container.on('pointerout', () => {
      container.setScale(1.0);
      bg.lineStyle(2, 0xffffff, 0.9);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
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

    const backdrop = this.add.graphics();
    backdrop.fillStyle(0x000000, 0.92);
    backdrop.fillRect(0, 0, width, height);
    modal.add(backdrop);

    const photoW = Math.min(width - 100, 560);
    const photoH = photoW * 0.65;
    const photoY = height / 2 - 12;

    const photoFrame = this.add.graphics();
    photoFrame.fillStyle(0xffffff, 1);
    photoFrame.fillRoundedRect(width / 2 - photoW / 2 - 6, photoY - photoH / 2 - 6, photoW + 12, photoH + 12, 10);
    modal.add(photoFrame);

    const photo = this.add.image(width / 2, photoY, item.photoKey).setDisplaySize(photoW, photoH);
    modal.add(photo);

    const title = this.add.text(width / 2, photoY - photoH / 2 - 20, `${item.badge}: ${item.title}`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '11px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    modal.add(title);

    const closeBtn = this.createButton(width / 2, height - 35, '✖ CLOSE', '#E91E63', () => {
      modal.destroy();
    }, 180, 36);
    modal.add(closeBtn);

    backdrop.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
    backdrop.on('pointerdown', () => modal.destroy());
  }
}
