/**
 * Mobile Touchscreen Controls
 * Large, responsive virtual D-pad and jump button supporting multi-touch.
 */

import Phaser from 'phaser';

export class TouchControls {
  constructor(scene) {
    this.scene = scene;
    this.isLeftDown = false;
    this.isRightDown = false;
    this.justJumped = false;

    // Detect if device supports touch
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    this.visible = isTouchDevice;

    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(120);

    if (this.visible) {
      this.createButtons();
    }
  }

  createButtons() {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    // Button sizing
    const btnRadius = 38;
    const padding = 24;

    // 1. LEFT BUTTON
    this.btnLeft = this.createVirtualButton(
      padding + btnRadius,
      height - padding - btnRadius,
      btnRadius,
      '◀',
      () => { this.isLeftDown = true; },
      () => { this.isLeftDown = false; }
    );

    // 2. RIGHT BUTTON
    this.btnRight = this.createVirtualButton(
      padding + btnRadius * 3 + 18,
      height - padding - btnRadius,
      btnRadius,
      '▶',
      () => { this.isRightDown = true; },
      () => { this.isRightDown = false; }
    );

    // 3. JUMP BUTTON (Right side)
    this.btnJump = this.createVirtualButton(
      width - padding - btnRadius - 10,
      height - padding - btnRadius,
      btnRadius + 6,
      'JUMP',
      () => { this.justJumped = true; },
      () => { this.justJumped = false; },
      true
    );
  }

  createVirtualButton(x, y, radius, label, onDown, onUp, isJump = false) {
    const container = this.scene.add.container(x, y);

    // Background circle
    const bg = this.scene.add.graphics();
    bg.fillStyle(isJump ? 0xff4081 : 0x2979ff, 0.45);
    bg.fillCircle(0, 0, radius);
    bg.lineStyle(3, 0xffffff, 0.8);
    bg.strokeCircle(0, 0, radius);
    container.add(bg);

    // Label
    const text = this.scene.add.text(0, 0, label, {
      fontFamily: '"Press Start 2P", monospace, sans-serif',
      fontSize: isJump ? '12px' : '20px',
      color: '#FFFFFF'
    }).setOrigin(0.5);
    container.add(text);

    // Interactive zone
    const hitArea = new Phaser.Geom.Circle(0, 0, radius + 10);
    container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

    container.on('pointerdown', (pointer) => {
      bg.clear();
      bg.fillStyle(isJump ? 0xf50057 : 0x1565c0, 0.85);
      bg.fillCircle(0, 0, radius);
      bg.lineStyle(3, 0xffd700, 1);
      bg.strokeCircle(0, 0, radius);
      container.setScale(0.92);
      onDown();
    });

    const release = () => {
      bg.clear();
      bg.fillStyle(isJump ? 0xff4081 : 0x2979ff, 0.45);
      bg.fillCircle(0, 0, radius);
      bg.lineStyle(3, 0xffffff, 0.8);
      bg.strokeCircle(0, 0, radius);
      container.setScale(1.0);
      onUp();
    };

    container.on('pointerup', release);
    container.on('pointerout', release);

    this.container.add(container);
    return container;
  }

  update() {
    // Reset justJumped flag each frame so it triggers once per tap
    this.justJumped = false;
  }

  resize(width, height) {
    if (!this.visible) return;
    const btnRadius = 38;
    const padding = 24;

    if (this.btnLeft) this.btnLeft.setPosition(padding + btnRadius, height - padding - btnRadius);
    if (this.btnRight) this.btnRight.setPosition(padding + btnRadius * 3 + 18, height - padding - btnRadius);
    if (this.btnJump) this.btnJump.setPosition(width - padding - btnRadius - 10, height - padding - btnRadius);
  }
}

