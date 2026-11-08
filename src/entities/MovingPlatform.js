/**
 * Moving Platform Entity
 * Smoothly glides horizontally or vertically to provide dynamic platforming.
 */

import Phaser from 'phaser';

export class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, width, height, theme, options = {}) {
    super(scene, x, y, `platform_${theme}`);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(width, height);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;

    this.startX = x;
    this.startY = y;
    this.rangeX = options.rangeX || 0;
    this.rangeY = options.rangeY || 0;
    this.speed = options.speed || 40;

    if (this.rangeX > 0) {
      this.setVelocityX(this.speed);
    }
    if (this.rangeY > 0) {
      this.setVelocityY(this.speed);
    }
  }

  update() {
    if (this.rangeX > 0) {
      if (this.x > this.startX + this.rangeX) {
        this.setVelocityX(-this.speed);
      } else if (this.x < this.startX - this.rangeX) {
        this.setVelocityX(this.speed);
      }
    }

    if (this.rangeY > 0) {
      if (this.y > this.startY + this.rangeY) {
        this.setVelocityY(-this.speed);
      } else if (this.y < this.startY - this.rangeY) {
        this.setVelocityY(this.speed);
      }
    }
  }
}

