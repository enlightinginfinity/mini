/**
 * Obstacle Entity
 * Gentle, low-density obstacles that walk back and forth.
 */

import Phaser from 'phaser';

export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, data) {
    const textureKey = `obs_${data.type}` in scene.textures.list ? `obs_${data.type}` : 'obs_caterpillar';
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(data.width || 28, data.height || 20);

    this.patrolRange = data.patrol || 50;
    this.speed = data.speed || 30;
    this.startX = x;

    if (this.patrolRange > 0) {
      this.setVelocityX(this.speed);
    }
  }

  update() {
    if (this.patrolRange <= 0) return;

    if (this.x > this.startX + this.patrolRange) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
    } else if (this.x < this.startX - this.patrolRange) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);
    }
  }
}

