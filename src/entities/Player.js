/**
 * Player Entity (Protagonist)
 * Equipped with responsive controls, coyote time, jump buffering, and generous collision margins.
 */

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_sheet', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics attributes
    this.setCollideWorldBounds(true);
    // Generous hitbox (shrunk slightly for forgiving platforming)
    this.body.setSize(26, 48);
    this.body.setOffset(11, 14);
    this.body.setMaxVelocity(300, 700);

    // Platforming parameters
    this.moveSpeed = 220;
    this.jumpForce = -470;

    // Forgiving jump helpers
    this.coyoteTimeMax = 120; // ms
    this.coyoteTimer = 0;
    this.jumpBufferMax = 120; // ms
    this.jumpBufferTimer = 0;

    // Status
    this.lives = 3;
    this.isInvulnerable = false;
    this.isCelebrating = false;
    this.isDead = false;
    this.checkpoint = { x, y };

    // High-resolution static PNG face overlay (Smooth, non-pixelated)
    if (scene.textures.exists('hero_face_cutout')) {
      this.faceSprite = scene.add.image(x, y + 1, 'hero_face_cutout');
      this.faceSprite.setDisplaySize(46, 69);
      this.faceSprite.setOrigin(0.5, 0.88);
      this.faceSprite.setDepth(this.depth + 1);
    }

    this.play('player_idle');
  }

  setCheckpoint(x, y) {
    this.checkpoint = { x, y };
  }

  update(time, delta, cursors, touchControls) {
    if (this.isCelebrating || this.isDead) {
      return;
    }

    const onGround = this.body.blocked.down || this.body.touching.down;

    // Coyote time tracking
    if (onGround) {
      this.coyoteTimer = this.coyoteTimeMax;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    // Input checking (Desktop keyboard + Touchscreen buttons)
    const moveLeft = cursors.left.isDown || cursors.keyA?.isDown || touchControls?.isLeftDown;
    const moveRight = cursors.right.isDown || cursors.keyD?.isDown || touchControls?.isRightDown;
    const jumpRequested = Phaser.Input.Keyboard.JustDown(cursors.up) ||
                          Phaser.Input.Keyboard.JustDown(cursors.space) ||
                          Phaser.Input.Keyboard.JustDown(cursors.keyW) ||
                          touchControls?.justJumped;

    // Jump buffer tracking
    if (jumpRequested) {
      this.jumpBufferTimer = this.jumpBufferMax;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);
    }

    // Horizontal Movement
    if (moveLeft) {
      this.setVelocityX(-this.moveSpeed);
      this.setFlipX(true);
      if (onGround && this.anims.currentAnim?.key !== 'player_run') {
        this.play('player_run');
      }
    } else if (moveRight) {
      this.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
      if (onGround && this.anims.currentAnim?.key !== 'player_run') {
        this.play('player_run');
      }
    } else {
      this.setVelocityX(0);
      if (onGround && this.anims.currentAnim?.key !== 'player_idle') {
        this.play('player_idle');
      }
    }

    // Jump Execution (Uses Coyote time & Jump buffer for maximum forgiving feel)
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.setVelocityY(this.jumpForce);
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
      this.play('player_jump');
      audioSystem.playJump();
    }

    // In-air animation
    if (!onGround && this.anims.currentAnim?.key !== 'player_jump') {
      this.play('player_jump');
    }

    // Level pit fall protection
    if (this.y > this.scene.physics.world.bounds.height + 40) {
      this.takeDamage(true);
    }

    // Sync high-resolution static face position with body animation
    if (this.faceSprite) {
      let bobY = 0;
      if (this.anims.currentAnim?.key === 'player_idle' && this.anims.currentFrame?.index === 2) {
        bobY = 2;
      } else if (this.anims.currentAnim?.key === 'player_run') {
        const fIdx = this.anims.currentFrame?.index || 1;
        if (fIdx === 2 || fIdx === 4) bobY = 1;
      } else if (this.anims.currentAnim?.key === 'player_jump') {
        bobY = -2;
      } else if (this.anims.currentAnim?.key === 'player_celebrate') {
        bobY = -2;
      }

      this.faceSprite.setPosition(this.x, this.y + 1 + bobY);
      this.faceSprite.setFlipX(this.flipX);
      this.faceSprite.setVisible(this.visible);
      this.faceSprite.setAlpha(this.alpha);
    }
  }

  destroy(fromScene) {
    if (this.faceSprite) {
      this.faceSprite.destroy();
    }
    super.destroy(fromScene);
  }

  takeDamage(fallOutOfBounds = false) {
    if (this.isInvulnerable || this.isCelebrating) return;

    this.lives = Math.max(0, this.lives - 1);
    this.scene.events.emit('lives_changed', this.lives);
    audioSystem.playHurt();

    if (this.lives <= 0 || fallOutOfBounds) {
      // Respawn at last reached checkpoint
      this.respawnAtCheckpoint();
    } else {
      // Small knockback and invulnerability flicker
      this.isInvulnerable = true;
      this.setVelocityY(-200);
      this.scene.tweens.add({
        targets: [this, this.faceSprite].filter(Boolean),
        alpha: 0.3,
        duration: 100,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          this.alpha = 1;
          if (this.faceSprite) this.faceSprite.alpha = 1;
          this.isInvulnerable = false;
        }
      });
    }
  }

  respawnAtCheckpoint() {
    this.setVelocity(0, 0);
    this.x = this.checkpoint.x;
    this.y = this.checkpoint.y;
    this.lives = 3; // Refill lives so the casual player is never blocked!
    this.scene.events.emit('lives_changed', this.lives);

    // Brief respawn protection
    this.isInvulnerable = true;
    this.alpha = 0.5;
    if (this.faceSprite) {
      this.faceSprite.setPosition(this.x, this.y + 1);
      this.faceSprite.alpha = 0.5;
    }
    this.scene.tweens.add({
      targets: [this, this.faceSprite].filter(Boolean),
      alpha: 1,
      duration: 150,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.alpha = 1;
        if (this.faceSprite) this.faceSprite.alpha = 1;
        this.isInvulnerable = false;
      }
    });
  }

  celebrate() {
    this.isCelebrating = true;
    this.setVelocity(0, 0);
    this.play('player_celebrate');
    if (this.faceSprite) {
      this.faceSprite.setPosition(this.x, this.y - 1);
      this.faceSprite.setFlipX(this.flipX);
    }
  }
}

