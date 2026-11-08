/**
 * Base Level Scene
 * Common foundation for all 5 gameplay levels.
 */

import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { Collectible } from '../entities/Collectible.js';
import { Obstacle } from '../entities/Obstacle.js';
import { MovingPlatform } from '../entities/MovingPlatform.js';
import { Checkpoint } from '../entities/Checkpoint.js';
import { LevelExit } from '../entities/LevelExit.js';
import { HUD } from '../ui/HUD.js';
import { TouchControls } from '../ui/TouchControls.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { audioSystem } from '../systems/AudioSystem.js';
import { progressSystem } from '../systems/ProgressSystem.js';
import { LEVELS } from '../data/levels.js';

export class BaseLevelScene extends Phaser.Scene {
  constructor(key, levelId) {
    super(key);
    this.levelId = levelId;
    this.levelData = LEVELS[levelId - 1];
  }

  create() {
    this.isPaused = false;
    this.isCompleted = false;
    this.tokensCollected = 0;

    // Start level BGM
    audioSystem.playMusic(this.levelData.theme);

    // Setup world physics bounds
    this.physics.world.setBounds(0, 0, this.levelData.worldWidth, this.levelData.worldHeight);

    // Create Thematic Parallax Background
    this.createBackground();

    // Create Level Geometry
    this.createGroundAndPlatforms();

    // Create Decorative Scenery
    this.createDecorations();

    // Create Interactive Objects (Checkpoints & Goal)
    this.createInteractives();

    // Create Collectibles (5 tokens)
    this.createCollectibles();

    // Create Obstacles
    this.createObstacles();

    // Create Player Protagonist
    const startPos = this.levelData.playerStart || { x: 100, y: 450 };
    this.player = new Player(this, startPos.x, startPos.y);

    // Collisions
    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.player, this.platformGroup);
    this.physics.add.collider(this.player, this.movingPlatformGroup);

    // Overlaps
    this.physics.add.overlap(this.player, this.collectibleGroup, this.onCollectToken, null, this);
    this.physics.add.overlap(this.player, this.checkpointGroup, this.onReachCheckpoint, null, this);
    this.physics.add.overlap(this.player, this.obstacleGroup, this.onHitObstacle, null, this);
    this.physics.add.overlap(this.player, this.goalExit, this.onReachGoal, null, this);

    // Setup Camera
    this.cameras.main.setBounds(0, 0, this.levelData.worldWidth, this.levelData.worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1);

    // Input Controls (Keyboard)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.cursors.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.cursors.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.cursors.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // On-screen Touch Controls (Mobile)
    this.touchControls = new TouchControls(this);

    // HUD Display
    this.hud = new HUD(this, this.levelData);

    // Pause Menu
    this.pauseMenu = new PauseMenu(
      this,
      () => { this.resumeGame(); },
      () => { this.scene.restart(); },
      () => { this.scene.start('MenuScene'); }
    );

    // Event Listeners
    this.events.on('pause_game', () => this.pauseGame());
    this.events.on('lives_changed', (lives) => this.hud.updateLives(lives));
    this.events.on('token_collected', (tokenData) => {
      this.tokensCollected++;
      this.hud.updateTokens(this.tokensCollected);
      this.hud.showMemoryToast(tokenData);
    });

    // ESC key for pause
    this.input.keyboard.on('keydown-ESC', () => {
      if (this.isPaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    });
  }

  createBackground() {
    const width = this.levelData.worldWidth;
    const height = this.levelData.worldHeight;
    const theme = this.levelData.theme;

    // Background gradient / sky
    const sky = this.add.graphics().setScrollFactor(0);
    const colors = this.levelData.colors;

    sky.fillGradientStyle(
      colors.sky, colors.sky,
      colors.skyBottom || colors.sky, colors.skyBottom || colors.sky,
      1
    );
    sky.fillRect(0, 0, this.scale.width, height);

    // Parallax scenic elements
    if (theme === 'countryside') {
      // Fluffy clouds drifting
      for (let x = 60; x < width; x += 380) {
        const cloud = this.add.ellipse(x, Phaser.Math.Between(60, 140), Phaser.Math.Between(100, 160), 40, 0xffffff, 0.85);
        cloud.setScrollFactor(0.2);
      }
      // Distant rolling green hills
      for (let x = 0; x < width; x += 300) {
        const hill = this.add.ellipse(x, 480, 480, 160, colors.hillsFar, 0.9);
        hill.setScrollFactor(0.4);
      }
    } else if (theme === 'cave') {
      // Cave ceiling stalactites & glowing background crystals
      for (let x = 40; x < width; x += 180) {
        const stal = this.add.triangle(x, 20, 0, 0, 24, 0, 12, Phaser.Math.Between(40, 80), 0x241d3b);
        stal.setScrollFactor(0.3);
      }
      for (let x = 120; x < width; x += 260) {
        const crys = this.add.image(x, Phaser.Math.Between(200, 360), 'deco_crystal').setScale(0.8).setAlpha(0.4);
        crys.setScrollFactor(0.5);
      }
    } else if (theme === 'mountains') {
      // Majestic mountain silhouettes in orange sunset
      for (let x = 100; x < width; x += 350) {
        const mtn = this.add.triangle(x, 420, 0, 260, 180, 0, 360, 260, colors.mountainFar);
        mtn.setScrollFactor(0.3);
      }
    } else if (theme === 'beach') {
      // Ocean horizon and sun
      const sun = this.add.circle(300, 120, 46, 0xffeb3b, 0.9).setScrollFactor(0.1);
      const sea = this.add.rectangle(width / 2, 460, width, 120, colors.ocean, 0.7).setScrollFactor(0.3);
    } else if (theme === 'castle') {
      // Starry castle towers and party banners
      for (let x = 100; x < width; x += 320) {
        const tower = this.add.rectangle(x, 340, 90, 300, colors.castleWall).setScrollFactor(0.4);
        const roof = this.add.triangle(x, 150, 0, 80, 45, 0, 90, 80, 0xf50057).setScrollFactor(0.4);
      }
    }
  }

  createGroundAndPlatforms() {
    this.groundGroup = this.physics.add.staticGroup();
    this.platformGroup = this.physics.add.staticGroup();
    this.movingPlatformGroup = this.physics.add.group();

    const theme = this.levelData.theme;

    // 1. Ground segments
    this.levelData.groundSegments.forEach(g => {
      // We tile or draw the ground segment
      const ground = this.add.tileSprite(g.x + g.width / 2, g.y + g.height / 2, g.width, g.height, `ground_${theme}`);
      this.physics.add.existing(ground, true);
      this.groundGroup.add(ground);
    });

    // 2. Floating and moving platforms
    this.levelData.platforms.forEach(p => {
      if (p.type === 'moving') {
        const mp = new MovingPlatform(this, p.x, p.y, p.width, p.height, theme, {
          rangeX: p.rangeX,
          rangeY: p.rangeY,
          speed: p.speed
        });
        this.movingPlatformGroup.add(mp);
      } else {
        const plat = this.add.tileSprite(p.x, p.y, p.width, p.height, `platform_${theme}`);
        this.physics.add.existing(plat, true);
        // Generous one-way platform (can jump up through it, lands on top)
        plat.body.checkCollision.down = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        this.platformGroup.add(plat);
      }
    });
  }

  createDecorations() {
    if (!this.levelData.decorations) return;
    this.levelData.decorations.forEach(d => {
      const texKey = `deco_${d.type}`;
      if (this.textures.exists(texKey)) {
        const deco = this.add.image(d.x, d.y - 20, texKey).setOrigin(0.5, 1);
        if (d.color) deco.setTint(d.color);
      }
    });
  }

  createInteractives() {
    this.checkpointGroup = this.physics.add.staticGroup();

    // Checkpoints
    if (this.levelData.checkpoints) {
      this.levelData.checkpoints.forEach(cp => {
        const checkpoint = new Checkpoint(this, cp.x, cp.y, cp.id);
        this.checkpointGroup.add(checkpoint);
      });
    }

    // Goal Exit
    const goalData = this.levelData.goal;
    this.goalExit = new LevelExit(this, goalData.x, goalData.y, goalData.type);
  }

  createCollectibles() {
    this.collectibleGroup = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    this.levelData.collectibles.forEach(c => {
      const token = new Collectible(this, c.x, c.y, c);
      this.collectibleGroup.add(token);
      token.body.setAllowGravity(false);
      token.body.setImmovable(true);
      token.body.moves = false;
    });
  }

  createObstacles() {
    this.obstacleGroup = this.physics.add.group();
    if (this.levelData.obstacles) {
      this.levelData.obstacles.forEach(o => {
        const obs = new Obstacle(this, o.x, o.y, o);
        this.obstacleGroup.add(obs);
      });
    }
  }

  onCollectToken(player, token) {
    token.collect();
  }

  onReachCheckpoint(player, checkpoint) {
    if (!checkpoint.isActivated) {
      checkpoint.activate();
      player.setCheckpoint(checkpoint.x, checkpoint.y);
      this.hud.showMemoryToast({
        memoryId: null,
        title: 'Checkpoint Reached!',
        preview: 'Progress saved! Safe respawn point active.'
      });
    }
  }

  onHitObstacle(player, obstacle) {
    player.takeDamage();
  }

  onReachGoal(player, goal) {
    if (this.isCompleted) return;
    this.isCompleted = true;

    // Player celebration
    player.celebrate();
    audioSystem.stopMusic();

    // Mark completed in ProgressSystem
    progressSystem.completeLevel(this.levelId);

    // Standard chapter completion celebration and memory reveal
    audioSystem.playLevelComplete();
    this.triggerLevelCelebration(() => {
      this.scene.start('MemoryScene', { levelId: this.levelId, tokensCollected: this.tokensCollected });
    });
  }

  triggerLevelCelebration(callback) {
    // Confetti particles
    const emitter = this.add.particles(this.player.x, this.player.y - 40, 'confetti_0', {
      speed: { min: 80, max: 200 },
      angle: { min: 200, max: 340 },
      gravityY: 180,
      lifespan: 1400,
      quantity: 15
    });

    this.time.delayedCall(1600, () => {
      emitter.destroy();
      callback();
    });
  }

  pauseGame() {
    if (this.isCompleted) return;
    this.isPaused = true;
    this.physics.pause();
    this.pauseMenu.show();
  }

  resumeGame() {
    this.isPaused = false;
    this.physics.resume();
    this.pauseMenu.hide();
  }

  update(time, delta) {
    if (this.isPaused) return;

    this.player.update(time, delta, this.cursors, this.touchControls);

    // Update moving platforms
    this.movingPlatformGroup.getChildren().forEach(child => {
      if (child && child.update) child.update();
    });

    // Update obstacles
    this.obstacleGroup.getChildren().forEach(child => {
      if (child && child.update) child.update();
    });

    // Update touch controls frame state
    this.touchControls.update();
  }
}
