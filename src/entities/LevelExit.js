/**
 * Level Exit Goal Entity (Portal, Arch, or Birthday Chest)
 */

import Phaser from 'phaser';

export class LevelExit extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'portal') {
    const tex = type === 'birthday_chest' ? 'goal_chest' : 'goal_portal';
    super(scene, x, y - 28, tex);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.exitType = type;
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(44, 56);

    // Subtle magical glow pulse
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}

