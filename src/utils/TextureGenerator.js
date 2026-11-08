/**
 * Dynamic Retro Pixel-Art Texture & SpriteSheet Generator
 * Creates crisp, beautiful 16-bit retro graphics directly into Phaser's TextureManager.
 */

export class TextureGenerator {
  static createAll(scene) {
    this.createHeroFaceCutout(scene);
    this.createPlayerSheet(scene);
    this.createCollectibleTextures(scene);
    this.createEnvironmentTextures(scene);
    this.createObstacleTextures(scene);
    this.createInteractiveTextures(scene);
    this.createParticleTextures(scene);
  }

  // -------------------------------------------------------------
  // HIGH-RESOLUTION STATIC PNG FACE (Smooth, True-to-Life Cutout)
  // -------------------------------------------------------------
  static createHeroFaceCutout(scene) {
    if (!scene.textures.exists('player_face')) return;

    const faceImg = scene.textures.get('player_face').getSourceImage();
    if (!faceImg || !faceImg.width) return;

    // Scan bounding box of non-transparent pixels to tightly crop the face/head silhouette
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = faceImg.width;
    tempCanvas.height = faceImg.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(faceImg, 0, 0);
    const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;

    let minX = tempCanvas.width;
    let minY = tempCanvas.height;
    let maxX = 0;
    let maxY = 0;
    let hasAlpha = false;

    // Fast scan by 4px step
    for (let y = 0; y < tempCanvas.height; y += 4) {
      for (let x = 0; x < tempCanvas.width; x += 4) {
        const a = imgData[(y * tempCanvas.width + x) * 4 + 3];
        if (a > 15) {
          hasAlpha = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Fallback if fully opaque
    if (!hasAlpha || maxX <= minX || maxY <= minY) {
      minX = 0;
      minY = 0;
      maxX = faceImg.width;
      maxY = faceImg.height;
    } else {
      // Find the optical facial center (sampling chin & mid-face) to guarantee 100% horizontal symmetry
      let chinSumX = 0, chinCount = 0;
      const chinTop = maxY - Math.round((maxY - minY) * 0.18);
      for (let y = chinTop; y < maxY; y += 2) {
        for (let x = minX; x < maxX; x += 2) {
          if (imgData[(y * tempCanvas.width + x) * 4 + 3] > 20) {
            chinSumX += x;
            chinCount++;
          }
        }
      }

      const facialCenter = chinCount > 0 ? (chinSumX / chinCount) : ((minX + maxX) / 2);
      const halfW = Math.max(facialCenter - minX, maxX - facialCenter) + 6;
      minX = Math.max(0, Math.round(facialCenter - halfW));
      maxX = Math.min(faceImg.width, Math.round(facialCenter + halfW));
      minY = Math.max(0, minY - 4);
      maxY = Math.min(faceImg.height, maxY + 4);
    }

    const cropW = maxX - minX;
    const cropH = maxY - minY;

    // High resolution target for crisp, non-pixelated rendering
    const targetH = 512;
    const targetW = Math.round(targetH * (cropW / cropH));

    const canvas = scene.textures.createCanvas('hero_face_cutout', targetW, targetH);
    const ctx = canvas.context;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the static, smooth PNG image with perfect horizontal symmetry centered
    ctx.drawImage(faceImg, minX, minY, cropW, cropH, 0, 0, targetW, targetH);

    canvas.refresh();
    if (canvas.texture) {
      canvas.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
  }

  // -------------------------------------------------------------
  // COMPOSITE PLAYER SPRITESHEET (With Customizable Face)
  // -------------------------------------------------------------
  static createPlayerSheet(scene) {
    const frameW = 48;
    const frameH = 62;
    const totalFrames = 8;
    const canvas = scene.textures.createCanvas('player_sheet', frameW * totalFrames, frameH);
    const ctx = canvas.context;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Retrieve face image from Phaser cache if loaded, or fallback
    let faceImg = null;
    if (scene.textures.exists('player_face')) {
      faceImg = scene.textures.get('player_face').getSourceImage();
    }

    // Palette
    const shirtColor = '#2196F3'; // Blue adventurer shirt
    const shirtShadow = '#1565C0';
    const pantsColor = '#37474F'; // Slate pants
    const shoesColor = '#5D4037'; // Leather boots
    const hatColor = '#E91E63'; // Birthday party hat!

    // Frame definitions:
    // 0: idle 1
    // 1: idle 2
    // 2: run 1
    // 3: run 2
    // 4: run 3
    // 5: run 4
    // 6: jump
    // 7: celebrate
    for (let f = 0; f < totalFrames; f++) {
      const ox = f * frameW;
      const oy = 0;

      let bobY = 0;
      let legOffsetL = 0;
      let legOffsetR = 0;
      let armAngle = 0;
      let isCelebrating = (f === 7);
      let isJumping = (f === 6);

      if (f === 1) bobY = 2; // Idle breath
      if (f === 2) { legOffsetL = -4; legOffsetR = 4; armAngle = 1; }
      if (f === 3) { legOffsetL = 0; legOffsetR = 0; bobY = 1; }
      if (f === 4) { legOffsetL = 4; legOffsetR = -4; armAngle = -1; }
      if (f === 5) { legOffsetL = 0; legOffsetR = 0; bobY = 1; }
      if (isJumping) { legOffsetL = -3; legOffsetR = -3; bobY = -2; }
      if (isCelebrating) { armAngle = 2; bobY = -2; }

      const headX = ox + 24;
      const headY = oy + 22 + bobY;
      const headRadius = 16; // ENLARGED FACE (32px diameter)

      // --- Body / Torso ---
      ctx.fillStyle = shirtColor;
      ctx.fillRect(ox + 14, oy + 36 + bobY, 20, 14);
      ctx.fillStyle = shirtShadow;
      ctx.fillRect(ox + 14, oy + 48 + bobY, 20, 2);

      // --- Arms ---
      ctx.fillStyle = shirtColor;
      if (isCelebrating) {
        // Arms high up celebrating
        ctx.fillRect(ox + 8, oy + 22 + bobY, 5, 16);
        ctx.fillRect(ox + 35, oy + 22 + bobY, 5, 16);
      } else if (isJumping) {
        // Arms outstretched
        ctx.fillRect(ox + 7, oy + 34 + bobY, 6, 10);
        ctx.fillRect(ox + 35, oy + 34 + bobY, 6, 10);
      } else {
        // Normal swinging arms
        ctx.fillRect(ox + 8, oy + 38 + bobY + armAngle * 2, 5, 12);
        ctx.fillRect(ox + 35, oy + 38 + bobY - armAngle * 2, 5, 12);
      }

      // --- Legs ---
      ctx.fillStyle = pantsColor;
      // Left leg
      ctx.fillRect(ox + 15, oy + 50 + bobY, 6, 8 + legOffsetL);
      // Right leg
      ctx.fillRect(ox + 27, oy + 50 + bobY, 6, 8 + legOffsetR);

      // --- Boots ---
      ctx.fillStyle = shoesColor;
      ctx.fillRect(ox + 13, oy + 57 + bobY + legOffsetL, 8, 4);
      ctx.fillRect(ox + 27, oy + 57 + bobY + legOffsetR, 8, 4);

      // --- Neck & Head (Static PNG face overlay is used when faceImg exists) ---
      if (faceImg) {
        // Clean neck and shirt collar connecting the body to the static PNG face
        ctx.fillStyle = '#FFE0B2';
        ctx.fillRect(ox + 21, oy + 30 + bobY, 6, 7);
        ctx.fillStyle = shirtShadow;
        ctx.fillRect(ox + 18, oy + 35 + bobY, 12, 3);
      } else {
        // Fallback pixel art head if no custom photo is provided
        ctx.save();
        ctx.fillStyle = '#FFE0B2';
        ctx.fillRect(headX - headRadius, headY - headRadius, headRadius * 2, headRadius * 2);
        // Eyes
        ctx.fillStyle = '#212121';
        ctx.fillRect(headX - 6, headY - 3, 3, 4);
        ctx.fillRect(headX + 4, headY - 3, 3, 4);
        // Smile
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(headX - 4, headY + 5, 8, 3);
        ctx.restore();

        // Face outline border for crisp retro definition
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Festive Birthday Party Hat
        ctx.fillStyle = hatColor;
        ctx.beginPath();
        ctx.moveTo(headX, headY - headRadius - 10);
        ctx.lineTo(headX - 9, headY - headRadius + 2);
        ctx.lineTo(headX + 9, headY - headRadius + 2);
        ctx.closePath();
        ctx.fill();

        // Yellow pom-pom on top of hat
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.arc(headX, headY - headRadius - 10, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add frame definition to the CanvasTexture
      canvas.add(f, 0, ox, oy, frameW, frameH);
    }

    canvas.refresh();

    // Register animations
    if (!scene.anims.exists('player_idle')) {
      scene.anims.create({
        key: 'player_idle',
        frames: scene.anims.generateFrameNumbers('player_sheet', { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
      });
    }
    if (!scene.anims.exists('player_run')) {
      scene.anims.create({
        key: 'player_run',
        frames: scene.anims.generateFrameNumbers('player_sheet', { start: 2, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
    }
    if (!scene.anims.exists('player_jump')) {
      scene.anims.create({
        key: 'player_jump',
        frames: [{ key: 'player_sheet', frame: 6 }],
        frameRate: 10
      });
    }
    if (!scene.anims.exists('player_celebrate')) {
      scene.anims.create({
        key: 'player_celebrate',
        frames: [{ key: 'player_sheet', frame: 7 }],
        frameRate: 6,
        repeat: -1
      });
    }
  }

  // -------------------------------------------------------------
  // COLLECTIBLE TOKENS (Coins, Hearts, Stars)
  // -------------------------------------------------------------
  static createCollectibleTextures(scene) {
    // 1. Golden Memory Coin
    const coinCanvas = scene.textures.createCanvas('token_coin', 28, 28);
    const cCtx = coinCanvas.context;
    cCtx.fillStyle = '#FFD700';
    cCtx.beginPath();
    cCtx.arc(14, 14, 12, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.strokeStyle = '#FFA000';
    cCtx.lineWidth = 2;
    cCtx.stroke();
    // Inner sparkle
    cCtx.fillStyle = '#FFF9C4';
    cCtx.beginPath();
    cCtx.arc(11, 10, 4, 0, Math.PI * 2);
    cCtx.fill();
    // Letter M for Memory
    cCtx.fillStyle = '#E65100';
    cCtx.font = 'bold 12px sans-serif';
    cCtx.textAlign = 'center';
    cCtx.fillText('M', 14, 18);
    coinCanvas.refresh();

    // 2. Heart Token
    const heartCanvas = scene.textures.createCanvas('token_heart', 30, 30);
    const hCtx = heartCanvas.context;
    hCtx.fillStyle = '#E91E63';
    hCtx.beginPath();
    hCtx.moveTo(15, 26);
    hCtx.bezierCurveTo(4, 18, 2, 7, 9, 4);
    hCtx.bezierCurveTo(13, 2, 15, 7, 15, 7);
    hCtx.bezierCurveTo(15, 7, 17, 2, 21, 4);
    hCtx.bezierCurveTo(28, 7, 26, 18, 15, 26);
    hCtx.fill();
    hCtx.fillStyle = '#F8BBD0';
    hCtx.beginPath();
    hCtx.arc(10, 8, 2.5, 0, Math.PI * 2);
    hCtx.fill();
    heartCanvas.refresh();

    // 3. Star Token
    const starCanvas = scene.textures.createCanvas('token_star', 32, 32);
    const sCtx = starCanvas.context;
    sCtx.fillStyle = '#FFCA28';
    sCtx.strokeStyle = '#FF6F00';
    sCtx.lineWidth = 1.5;
    sCtx.beginPath();
    const cx = 16, cy = 16, spikes = 5, outerR = 14, innerR = 6;
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    sCtx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerR;
      let y = cy + Math.sin(rot) * outerR;
      sCtx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      sCtx.lineTo(x, y);
      rot += step;
    }
    sCtx.lineTo(cx, cy - outerR);
    sCtx.closePath();
    sCtx.fill();
    sCtx.stroke();
    // Inner sparkle
    sCtx.fillStyle = '#FFFDE7';
    sCtx.beginPath();
    sCtx.arc(14, 12, 3, 0, Math.PI * 2);
    sCtx.fill();
    starCanvas.refresh();
  }

  // -------------------------------------------------------------
  // ENVIRONMENT TILES (Grounds, Platforms, Decorations)
  // -------------------------------------------------------------
  static createEnvironmentTextures(scene) {
    const themes = [
      { name: 'countryside', top: '#66BB6A', base: '#795548', accent: '#81C784' },
      { name: 'cave', top: '#AB47BC', base: '#311B92', accent: '#CE93D8' },
      { name: 'mountains', top: '#FFA726', base: '#4E342E', accent: '#FFCC80' },
      { name: 'beach', top: '#FFE082', base: '#FFB300', accent: '#FFF8E1' },
      { name: 'castle', top: '#E91E63', base: '#261447', accent: '#FF4081' }
    ];

    themes.forEach(t => {
      // Ground tile
      const gCanvas = scene.textures.createCanvas(`ground_${t.name}`, 64, 64);
      const gCtx = gCanvas.context;
      gCtx.fillStyle = t.base;
      gCtx.fillRect(0, 0, 64, 64);
      // Grass/top layer
      gCtx.fillStyle = t.top;
      gCtx.fillRect(0, 0, 64, 18);
      // Serrated edge / pixel fringe
      gCtx.fillStyle = t.accent;
      for (let x = 0; x < 64; x += 8) {
        gCtx.fillRect(x, 16, 4, 4);
      }
      gCanvas.refresh();

      // Platform tile
      const pCanvas = scene.textures.createCanvas(`platform_${t.name}`, 64, 32);
      const pCtx = pCanvas.context;
      pCtx.fillStyle = t.base;
      pCtx.fillRect(0, 0, 64, 32);
      pCtx.fillStyle = t.top;
      pCtx.fillRect(0, 0, 64, 10);
      pCtx.fillStyle = t.accent;
      for (let x = 0; x < 64; x += 12) {
        pCtx.fillRect(x, 10, 6, 3);
      }
      // Rounded side shading
      pCtx.fillStyle = 'rgba(0,0,0,0.2)';
      pCtx.fillRect(0, 28, 64, 4);
      pCanvas.refresh();
    });

    // Decorative assets:
    // Tree
    const treeCanvas = scene.textures.createCanvas('deco_tree', 64, 96);
    const tCtx = treeCanvas.context;
    tCtx.fillStyle = '#6D4C41';
    tCtx.fillRect(26, 44, 12, 52);
    tCtx.fillStyle = '#2E7D32';
    tCtx.beginPath();
    tCtx.arc(32, 34, 30, 0, Math.PI * 2);
    tCtx.fill();
    tCtx.fillStyle = '#4CAF50';
    tCtx.beginPath();
    tCtx.arc(26, 26, 18, 0, Math.PI * 2);
    tCtx.fill();
    treeCanvas.refresh();

    // Flower
    const flCanvas = scene.textures.createCanvas('deco_flower', 24, 24);
    const fCtx = flCanvas.context;
    fCtx.fillStyle = '#4CAF50';
    fCtx.fillRect(11, 10, 2, 14);
    fCtx.fillStyle = '#FF5252';
    fCtx.beginPath();
    fCtx.arc(12, 8, 6, 0, Math.PI * 2);
    fCtx.fill();
    fCtx.fillStyle = '#FFEB3B';
    fCtx.beginPath();
    fCtx.arc(12, 8, 2.5, 0, Math.PI * 2);
    fCtx.fill();
    flCanvas.refresh();

    // Glowing Cave Crystal
    const crysCanvas = scene.textures.createCanvas('deco_crystal', 28, 48);
    const crCtx = crysCanvas.context;
    crCtx.fillStyle = '#00E5FF';
    crCtx.beginPath();
    crCtx.moveTo(14, 2);
    crCtx.lineTo(26, 22);
    crCtx.lineTo(20, 48);
    crCtx.lineTo(8, 48);
    crCtx.lineTo(2, 22);
    crCtx.closePath();
    crCtx.fill();
    crCtx.fillStyle = '#E0F7FA';
    crCtx.beginPath();
    crCtx.moveTo(14, 2);
    crCtx.lineTo(18, 20);
    crCtx.lineTo(14, 46);
    crCtx.lineTo(10, 20);
    crCtx.closePath();
    crCtx.fill();
    crysCanvas.refresh();

    // Palm Tree
    const palmCanvas = scene.textures.createCanvas('deco_palm_tree', 72, 100);
    const plCtx = palmCanvas.context;
    plCtx.fillStyle = '#795548';
    plCtx.beginPath();
    plCtx.moveTo(34, 98);
    plCtx.quadraticCurveTo(38, 50, 48, 24);
    plCtx.lineTo(40, 24);
    plCtx.quadraticCurveTo(30, 50, 26, 98);
    plCtx.closePath();
    plCtx.fill();
    // Palm leaves
    plCtx.fillStyle = '#388E3C';
    plCtx.beginPath();
    plCtx.ellipse(24, 20, 26, 8, -Math.PI / 6, 0, Math.PI * 2);
    plCtx.fill();
    plCtx.beginPath();
    plCtx.ellipse(62, 22, 26, 8, Math.PI / 6, 0, Math.PI * 2);
    plCtx.fill();
    plCtx.beginPath();
    plCtx.ellipse(44, 12, 24, 8, 0, 0, Math.PI * 2);
    plCtx.fill();
    palmCanvas.refresh();

    // Birthday Balloons
    const balCanvas = scene.textures.createCanvas('deco_balloons', 48, 70);
    const bCtx = balCanvas.context;
    const balloonColors = ['#FF1744', '#00E676', '#FFEA00', '#2979FF'];
    const bPos = [{ x: 18, y: 20 }, { x: 30, y: 16 }, { x: 24, y: 28 }, { x: 34, y: 32 }];
    bPos.forEach((p, idx) => {
      bCtx.strokeStyle = '#FFFFFF';
      bCtx.lineWidth = 1;
      bCtx.beginPath();
      bCtx.moveTo(p.x, p.y + 12);
      bCtx.lineTo(24, 66);
      bCtx.stroke();

      bCtx.fillStyle = balloonColors[idx % balloonColors.length];
      bCtx.beginPath();
      bCtx.ellipse(p.x, p.y, 10, 13, 0, 0, Math.PI * 2);
      bCtx.fill();
    });
    balCanvas.refresh();
  }

  // -------------------------------------------------------------
  // OBSTACLES (Gentle, cute critters and hazards)
  // -------------------------------------------------------------
  static createObstacleTextures(scene) {
    // 1. Cute Caterpillar (Level 1)
    const catCanvas = scene.textures.createCanvas('obs_caterpillar', 32, 22);
    const cCtx = catCanvas.context;
    cCtx.fillStyle = '#8BC34A';
    for (let i = 0; i < 4; i++) {
      cCtx.beginPath();
      cCtx.arc(7 + i * 6, 12, 6, 0, Math.PI * 2);
      cCtx.fill();
    }
    // Eyes
    cCtx.fillStyle = '#212121';
    cCtx.fillRect(24, 9, 2, 2);
    catCanvas.refresh();

    // 2. Crystal Bug (Level 2)
    const bugCanvas = scene.textures.createCanvas('obs_crystal_bug', 32, 22);
    const bCtx = bugCanvas.context;
    bCtx.fillStyle = '#00E5FF';
    bCtx.beginPath();
    bCtx.ellipse(16, 12, 12, 7, 0, 0, Math.PI * 2);
    bCtx.fill();
    bCtx.fillStyle = '#E040FB';
    bCtx.fillRect(10, 8, 12, 4);
    bugCanvas.refresh();

    // 3. Rolling Pebble (Level 3)
    const pebCanvas = scene.textures.createCanvas('obs_rolling_pebble', 28, 24);
    const pCtx = pebCanvas.context;
    pCtx.fillStyle = '#78909C';
    pCtx.beginPath();
    pCtx.ellipse(14, 12, 12, 10, 0, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillStyle = '#B0BEC5';
    pCtx.beginPath();
    pCtx.arc(10, 8, 4, 0, Math.PI * 2);
    pCtx.fill();
    pebCanvas.refresh();

    // 4. Beach Crab (Level 4)
    const crabCanvas = scene.textures.createCanvas('obs_beach_crab', 32, 22);
    const crCtx = crabCanvas.context;
    crCtx.fillStyle = '#FF5252';
    crCtx.beginPath();
    crCtx.ellipse(16, 13, 10, 7, 0, 0, Math.PI * 2);
    crCtx.fill();
    // Claws
    crCtx.fillRect(4, 6, 6, 6);
    crCtx.fillRect(22, 6, 6, 6);
    crabCanvas.refresh();

    // 5. Party Bot (Level 5)
    const botCanvas = scene.textures.createCanvas('obs_party_bot', 28, 24);
    const btCtx = botCanvas.context;
    btCtx.fillStyle = '#9C27B0';
    btCtx.fillRect(6, 6, 16, 14);
    btCtx.fillStyle = '#FFEB3B';
    btCtx.fillRect(9, 9, 3, 3);
    btCtx.fillRect(16, 9, 3, 3);
    btCtx.fillStyle = '#FF4081';
    btCtx.fillRect(10, 15, 8, 2);
    botCanvas.refresh();
  }

  // -------------------------------------------------------------
  // INTERACTIVE OBJECTS (Checkpoints, Goals, Birthday Chest)
  // -------------------------------------------------------------
  static createInteractiveTextures(scene) {
    // Checkpoint flag off/on
    const cpOff = scene.textures.createCanvas('checkpoint_off', 24, 48);
    const c1 = cpOff.context;
    c1.fillStyle = '#757575';
    c1.fillRect(4, 4, 3, 44);
    c1.fillStyle = '#BDBDBD';
    c1.fillRect(7, 8, 14, 10);
    cpOff.refresh();

    const cpOn = scene.textures.createCanvas('checkpoint_on', 24, 48);
    const c2 = cpOn.context;
    c2.fillStyle = '#FFD700';
    c2.fillRect(4, 4, 3, 44);
    c2.fillStyle = '#00E676';
    c2.fillRect(7, 8, 14, 10);
    cpOn.refresh();

    // Goal Flags / Exit Portals (Levels 1 to 4)
    const goalCanvas = scene.textures.createCanvas('goal_portal', 48, 64);
    const gCtx = goalCanvas.context;
    gCtx.fillStyle = '#673AB7';
    gCtx.beginPath();
    gCtx.ellipse(24, 32, 20, 28, 0, 0, Math.PI * 2);
    gCtx.fill();
    gCtx.fillStyle = '#00E5FF';
    gCtx.beginPath();
    gCtx.ellipse(24, 32, 14, 20, 0, 0, Math.PI * 2);
    gCtx.fill();
    gCtx.fillStyle = '#FFF';
    gCtx.font = 'bold 11px sans-serif';
    gCtx.textAlign = 'center';
    gCtx.fillText('GOAL', 24, 36);
    goalCanvas.refresh();

    // Birthday Treasure Chest (Level 5 Climax)
    const chestCanvas = scene.textures.createCanvas('goal_chest', 54, 46);
    const chCtx = chestCanvas.context;
    // Chest base
    chCtx.fillStyle = '#8D6E63';
    chCtx.fillRect(6, 18, 42, 24);
    // Gold trim
    chCtx.fillStyle = '#FFD700';
    chCtx.fillRect(6, 18, 42, 4);
    chCtx.fillRect(6, 38, 42, 4);
    chCtx.fillRect(23, 18, 8, 24);
    // Lid (curved)
    chCtx.fillStyle = '#A1887F';
    chCtx.beginPath();
    chCtx.arc(27, 18, 20, Math.PI, 0);
    chCtx.fill();
    chCtx.fillStyle = '#FFCA28';
    chCtx.beginPath();
    chCtx.arc(27, 24, 4, 0, Math.PI * 2);
    chCtx.fill();
    chestCanvas.refresh();
  }

  // -------------------------------------------------------------
  // PARTICLES (Sparkles, Confetti)
  // -------------------------------------------------------------
  static createParticleTextures(scene) {
    const spk = scene.textures.createCanvas('particle_sparkle', 12, 12);
    const sCtx = spk.context;
    sCtx.fillStyle = '#FFFFFF';
    sCtx.beginPath();
    sCtx.arc(6, 6, 5, 0, Math.PI * 2);
    sCtx.fill();
    spk.refresh();

    const confColors = ['#FF1744', '#FFEA00', '#00E676', '#2979FF', '#E040FB'];
    confColors.forEach((col, idx) => {
      const conf = scene.textures.createCanvas(`confetti_${idx}`, 10, 8);
      const cCtx = conf.context;
      cCtx.fillStyle = col;
      cCtx.fillRect(0, 0, 10, 8);
      conf.refresh();
    });
  }
}
