/**
 * Preload Scene
 * Loads images, generates procedural pixel-art textures & audio synth triggers.
 */

import Phaser from 'phaser';
import { TextureGenerator } from '../utils/TextureGenerator.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Loading background
    this.add.rectangle(width / 2, height / 2, width, height, 0x120d29);

    // Title
    this.add.text(width / 2, height / 2 - 50, 'FRIENDSHIP QUEST', {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: '22px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Subtitle
    this.statusText = this.add.text(width / 2, height / 2, 'Preparing your birthday adventure...', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    // Progress bar box
    const barBox = this.add.graphics();
    barBox.fillStyle(0x281e4b, 1);
    barBox.fillRoundedRect(width / 2 - 150, height / 2 + 30, 300, 20, 8);
    barBox.lineStyle(2, 0xffd700, 1);
    barBox.strokeRoundedRect(width / 2 - 150, height / 2 + 30, 300, 20, 8);

    const progressBar = this.add.graphics();
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xff4081, 1);
      progressBar.fillRoundedRect(width / 2 - 146, height / 2 + 34, 292 * value, 12, 5);
    });

    // Load Memory Photographs
    for (let i = 1; i <= 5; i++) {
      this.load.image(`photo_${i}`, `./assets/photos/photo${i}.png`);
      for (let m = 1; m <= 5; m++) {
        this.load.image(`photo_${i}_${m}`, `./assets/photos/photo${i}_${m}.png`);
      }
    }
    this.load.image('photo_final', './assets/photos/photo_final.png');
  }

  create() {
    // Generate all procedural pixel textures and composite player sheet
    TextureGenerator.createAll(this);

    this.statusText.setText('Adventure Ready! ✨');

    this.time.delayedCall(400, () => {
      this.scene.start('MenuScene');
    });
  }
}

