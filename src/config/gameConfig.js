/**
 * Phaser 3 Game Configuration
 * Responsive scaling, arcade physics, and pixel-art rendering.
 */

import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene.js';
import { PreloadScene } from '../scenes/PreloadScene.js';
import { MenuScene } from '../scenes/MenuScene.js';
import { CharacterIntroScene } from '../scenes/CharacterIntroScene.js';
import { LevelSelectScene } from '../scenes/LevelSelectScene.js';
import { Level1Scene } from '../scenes/Level1Scene.js';
import { Level2Scene } from '../scenes/Level2Scene.js';
import { Level3Scene } from '../scenes/Level3Scene.js';
import { Level4Scene } from '../scenes/Level4Scene.js';
import { Level5Scene } from '../scenes/Level5Scene.js';
import { MemoryScene } from '../scenes/MemoryScene.js';
import { MemoryAlbumScene } from '../scenes/MemoryAlbumScene.js';
import { BirthdayScene } from '../scenes/BirthdayScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 900,
  height: 520,
  pixelArt: false,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 950 },
      debug: false
    }
  },
  pauseOnBlur: false,
  fps: {
    target: 60,
    forceSetTimeOut: false,
    smoothStep: true
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true,
    powerPreference: 'high-performance',
    batchSize: 2048
  },
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    CharacterIntroScene,
    LevelSelectScene,
    Level1Scene,
    Level2Scene,
    Level3Scene,
    Level4Scene,
    Level5Scene,
    MemoryScene,
    MemoryAlbumScene,
    BirthdayScene
  ]
};
