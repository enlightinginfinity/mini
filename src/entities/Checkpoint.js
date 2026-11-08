/**
 * Checkpoint Entity
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';

export class Checkpoint extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, id) {
    super(scene, x, y - 24, 'checkpoint_off');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.isActivated = false;
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(20, 48);
  }

  activate() {
    if (this.isActivated) return;
    this.isActivated = true;
    this.setTexture('checkpoint_on');
    audioSystem.playCheckpoint();

    // Flashy pulse tween
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 150,
      yoyo: true
    });
  }
}

