/**
 * Heads-Up Display (HUD)
 * Shows lives, token count, level name, pause button, sound button, and memory unlock toasts.
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';
import { memorySystem } from '../systems/MemorySystem.js';

export class HUD {
  constructor(scene, levelData) {
    this.scene = scene;
    this.levelData = levelData;
    this.tokensCollectedInLevel = 0;
    this.totalTokensInLevel = 5;

    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(100);

    this.createLayout();
  }

  createLayout() {
    const width = this.scene.scale.width;

    // Top Bar Background
    const topBar = this.scene.add.graphics();
    topBar.fillStyle(0x000000, 0.45);
    topBar.fillRect(0, 0, width, 46);
    this.container.add(topBar);

    // 1. Lives / Hearts Display
    this.heartIcons = [];
    for (let i = 0; i < 3; i++) {
      const heart = this.scene.add.text(14 + i * 26, 12, '❤️', { fontSize: '20px' });
      this.heartIcons.push(heart);
      this.container.add(heart);
    }

    // 2. Tokens Counter
    this.tokenText = this.scene.add.text(110, 14, `Tokens: 0/${this.totalTokensInLevel}`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '13px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.container.add(this.tokenText);

    // 3. Level Title (Centered)
    this.titleText = this.scene.add.text(width / 2, 22, `${this.levelData.name}`, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '13px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    this.container.add(this.titleText);

    // 4. Sound Toggle Button
    this.soundBtn = this.scene.add.text(width - 86, 12, audioSystem.soundEnabled ? '🔊' : '🔇', {
      fontSize: '22px'
    }).setInteractive({ useHandCursor: true });
    this.soundBtn.on('pointerdown', () => {
      const enabled = audioSystem.toggleSound();
      audioSystem.toggleMusic();
      this.soundBtn.setText(enabled ? '🔊' : '🔇');
      audioSystem.playButton();
    });
    this.container.add(this.soundBtn);

    // 5. Pause Button
    this.pauseBtn = this.scene.add.text(width - 42, 12, '⏸️', {
      fontSize: '22px'
    }).setInteractive({ useHandCursor: true });
    this.pauseBtn.on('pointerdown', () => {
      audioSystem.playButton();
      this.scene.events.emit('pause_game');
    });
    this.container.add(this.pauseBtn);

    // 6. Memory Notification Toast Banner (Initially hidden above top edge)
    this.toastContainer = this.scene.add.container(width / 2, -100);
    this.toastContainer.setScrollFactor(0);
    this.toastContainer.setDepth(150);

    const toastBg = this.scene.add.graphics();
    toastBg.fillStyle(0x1a237e, 0.92);
    toastBg.fillRoundedRect(-180, 0, 360, 56, 12);
    toastBg.lineStyle(2, 0xffd700, 1);
    toastBg.strokeRoundedRect(-180, 0, 360, 56, 12);
    this.toastContainer.add(toastBg);

    this.toastTitle = this.scene.add.text(0, 10, '✨ MEMORY UNLOCKED! ✨', {
      fontFamily: 'monospace',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#FFD700'
    }).setOrigin(0.5, 0);
    this.toastContainer.add(this.toastTitle);

    this.toastSub = this.scene.add.text(0, 30, '', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#FFFFFF',
      align: 'center',
      wordWrap: { width: 330 }
    }).setOrigin(0.5, 0);
    this.toastContainer.add(this.toastSub);
  }

  updateLives(lives) {
    for (let i = 0; i < 3; i++) {
      if (i < lives) {
        this.heartIcons[i].setText('❤️');
      } else {
        this.heartIcons[i].setText('🤍');
      }
    }
  }

  updateTokens(count) {
    this.tokensCollectedInLevel = count;
    this.tokenText.setText(`Tokens: ${count}/${this.totalTokensInLevel}`);
  }

  showMemoryToast(tokenData) {
    const memory = memorySystem.getMemoryById(tokenData.memoryId);
    const title = memory ? memory.title : 'New Memory Found!';
    const preview = memory ? memory.preview : 'A special moment recorded in your friendship!';

    this.toastTitle.setText(`✨ ${title.toUpperCase()} ✨`);
    this.toastSub.setText(preview);

    // Animate slide down, hold, then slide back up
    this.scene.tweens.killTweensOf(this.toastContainer);
    this.scene.tweens.add({
      targets: this.toastContainer,
      y: 54,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(2200, () => {
          this.scene.tweens.add({
            targets: this.toastContainer,
            y: -100,
            duration: 300,
            ease: 'Power2.easeIn'
          });
        });
      }
    });
  }

  resize(width, height) {
    this.titleText.setPosition(width / 2, 22);
    this.soundBtn.setPosition(width - 86, 12);
    this.pauseBtn.setPosition(width - 42, 12);
    this.toastContainer.setPosition(width / 2, this.toastContainer.y);
  }
}

