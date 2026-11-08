/**
 * Boot Scene
 * Initializes display and loads initial face texture.
 */

import Phaser from 'phaser';
import { BIRTHDAY_CONFIG } from '../data/memories.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load custom face texture
    const faceUrl = BIRTHDAY_CONFIG.customFaceUrl || './assets/character/face.png';
    this.load.image('player_face', faceUrl);
  }

  create() {
    this.scene.start('PreloadScene');
  }
}

