/**
 * In-Game Pause Menu Overlay
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';

export class PauseMenu {
  constructor(scene, onResume, onRestart, onQuit) {
    this.scene = scene;
    this.onResume = onResume;
    this.onRestart = onRestart;
    this.onQuit = onQuit;
    this.visible = false;

    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(200);
    this.container.setVisible(false);

    this.createMenu();
  }

  createMenu() {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    // Dark backdrop
    const backdrop = this.scene.add.graphics();
    backdrop.fillStyle(0x000000, 0.75);
    backdrop.fillRect(0, 0, width, height);
    this.container.add(backdrop);

    // Modal Box
    const boxW = 340;
    const boxH = 320;
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;

    const box = this.scene.add.graphics();
    box.fillStyle(0x1a237e, 0.95);
    box.fillRoundedRect(boxX, boxY, boxW, boxH, 16);
    box.lineStyle(3, 0xffd700, 1);
    box.strokeRoundedRect(boxX, boxY, boxW, boxH, 16);
    this.container.add(box);

    // Title
    const title = this.scene.add.text(width / 2, boxY + 36, 'GAME PAUSED', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '18px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    this.container.add(title);

    // Buttons
    this.createButton(width / 2, boxY + 95, '▶ RESUME', () => {
      this.hide();
      this.onResume();
    });

    this.createButton(width / 2, boxY + 155, '🔄 RESTART LEVEL', () => {
      this.hide();
      this.onRestart();
    });

    this.createButton(width / 2, boxY + 215, '🏠 MAIN MENU', () => {
      this.hide();
      this.onQuit();
    });

    // Sound toggle row
    const soundText = this.scene.add.text(width / 2, boxY + 275, `Sound: ${audioSystem.soundEnabled ? 'ON 🔊' : 'OFF 🔇'}`, {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#FFFFFF'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    soundText.on('pointerdown', () => {
      const en = audioSystem.toggleSound();
      audioSystem.toggleMusic();
      soundText.setText(`Sound: ${en ? 'ON 🔊' : 'OFF 🔇'}`);
      audioSystem.playButton();
    });
    this.container.add(soundText);
  }

  createButton(x, y, label, onClick) {
    const btnW = 240;
    const btnH = 44;

    const btnContainer = this.scene.add.container(x, y);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x303f9f, 1);
    bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
    bg.lineStyle(2, 0xffffff, 0.8);
    bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
    btnContainer.add(bg);

    const txt = this.scene.add.text(0, 0, label, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '12px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    btnContainer.add(txt);

    btnContainer.setInteractive(new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH), Phaser.Geom.Rectangle.Contains);

    btnContainer.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x3f51b5, 1);
      bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
      bg.lineStyle(2, 0xffd700, 1);
      bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
      txt.setColor('#FFD700');
    });

    btnContainer.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x303f9f, 1);
      bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
      bg.lineStyle(2, 0xffffff, 0.8);
      bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);
      txt.setColor('#FFFFFF');
    });

    btnContainer.on('pointerdown', () => {
      audioSystem.playButton();
      onClick();
    });

    this.container.add(btnContainer);
  }

  show() {
    this.visible = true;
    this.container.setVisible(true);
  }

  hide() {
    this.visible = false;
    this.container.setVisible(false);
  }
}

