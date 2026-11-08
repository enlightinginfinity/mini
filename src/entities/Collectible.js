/**
 * Collectible Memory Token Entity (Coins, Hearts, Stars)
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';
import { progressSystem } from '../systems/ProgressSystem.js';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data) {
    const textureKey = `token_${data.type || 'coin'}`;
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.tokenData = data;
    this.baseY = y;
    this.isCollected = false;

    // Completely disable gravity and physics forces on token so it stays floating
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.moves = false;
    this.body.setSize(32, 32);

    // Smooth floating bobbing tween (No physics fighting or glitching!)
    this.bobTween = this.scene.tweens.add({
      targets: this,
      y: y - 8,
      duration: 1200 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        // Keep Arcade Physics body synced cleanly without gravity interference
        if (this.body && this.body.enable) {
          this.body.position.x = this.x - this.body.halfWidth;
          this.body.position.y = this.y - this.body.halfHeight;
        }
      }
    });

    // Check if previously collected in earlier run
    if (progressSystem.isTokenCollected(this.tokenData.id)) {
      this.alpha = 0.45; // Shows it was collected, but still present
    }
  }

  collect() {
    if (this.isCollected) return;
    this.isCollected = true;

    // 1. Immediately disable physics to prevent duplicate triggers
    this.body.enable = false;

    // 2. Immediately stop & remove the bobbing tween so it never fights the collect animation
    if (this.bobTween) {
      this.bobTween.stop();
      this.bobTween.remove();
      this.bobTween = null;
    }

    progressSystem.collectToken(this.tokenData.id, this.tokenData.memoryId);

    // 3. Play specific sound for token type
    if (this.tokenData.type === 'heart') {
      audioSystem.playHeart();
    } else if (this.tokenData.type === 'star') {
      audioSystem.playStar();
    } else {
      audioSystem.playCoin();
    }

    // 4. Sparkle burst effect
    const particles = this.scene.add.particles(this.x, this.y, 'particle_sparkle', {
      speed: { min: 40, max: 120 },
      scale: { start: 1, end: 0 },
      lifespan: 400,
      blendMode: 'ADD',
      quantity: 8
    });
    this.scene.time.delayedCall(450, () => {
      if (particles) particles.destroy();
    });

    // 5. Float up and fade out smoothly
    this.scene.tweens.add({
      targets: this,
      y: this.y - 28,
      alpha: 0,
      scale: 1.4,
      duration: 350,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });

    this.scene.events.emit('token_collected', this.tokenData);
  }
}

