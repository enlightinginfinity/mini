/**
 * Application Entry Point
 * Initializes Phaser game, service worker registration, and mobile touch optimizers.
 */

import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';
import { audioSystem } from './systems/AudioSystem.js';

// Initialize Game
const game = new Phaser.Game(gameConfig);
window.__game = game;

// Resume audio on first user touch / click
window.addEventListener('pointerdown', () => {
  audioSystem.initContext();
}, { once: true });

window.addEventListener('keydown', () => {
  audioSystem.initContext();
}, { once: true });

// Prevent mobile scroll/zoom gesture interference during gameplay
document.addEventListener('touchmove', (e) => {
  if (e.target.tagName === 'CANVAS') {
    e.preventDefault();
  }
}, { passive: false });

// Register PWA Service Worker for offline capability
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => {
        console.log('Friendship Quest Service Worker registered:', reg.scope);
      })
      .catch(err => {
        console.warn('Service Worker registration skipped or failed:', err);
      });
  });
}
