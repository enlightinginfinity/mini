import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPng(width, height, getPixelFn) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a ?? 255;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const header = Buffer.alloc(8);
    header.writeUInt32BE(len, 0);
    header.write(type, 4, 4, 'ascii');
    const crcPayload = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const tail = Buffer.alloc(4);
    tail.writeUInt32BE(crc32(crcPayload), 0);
    return Buffer.concat([header, data, tail]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// -------------------------------------------------------------
// 1. GENERATE PWA APP ICONS (192x192 and 512x512)
// -------------------------------------------------------------
function generateAppIcon(size) {
  return createPng(size, size, (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;
    const cx = nx - 0.5;
    const cy = ny - 0.5;
    const dist = Math.sqrt(cx * cx + cy * cy);

    // Rounded app icon background
    if (Math.abs(cx) > 0.44 || Math.abs(cy) > 0.44) {
      if (dist > 0.62) return [0, 0, 0, 0];
    }

    // Gradient background: Deep royal purple to vibrant magenta
    const rBg = Math.floor(100 + ny * 140);
    const gBg = Math.floor(30 + ny * 20);
    const bBg = Math.floor(180 - ny * 60);

    // Center Birthday Gift / Cake Icon
    // Cake base
    if (nx >= 0.28 && nx <= 0.72 && ny >= 0.52 && ny <= 0.76) {
      // Cake layers (yellow & strawberry)
      if (ny > 0.64) return [255, 183, 77, 255]; // Warm sponge
      return [240, 98, 146, 255]; // Pink icing
    }
    // Cake top icing drips
    if (nx >= 0.26 && nx <= 0.74 && ny >= 0.48 && ny <= 0.54) {
      return [255, 255, 255, 255]; // White frosting
    }
    // Candles
    if ((Math.abs(nx - 0.4) < 0.02 || Math.abs(nx - 0.5) < 0.02 || Math.abs(nx - 0.6) < 0.02) && ny >= 0.36 && ny <= 0.48) {
      return [79, 195, 247, 255]; // Blue candle
    }
    // Candle flames
    if ((Math.abs(nx - 0.4) < 0.025 || Math.abs(nx - 0.5) < 0.025 || Math.abs(nx - 0.6) < 0.025) && ny >= 0.30 && ny <= 0.35) {
      return [255, 238, 88, 255]; // Bright flame
    }

    // Party confetti dots
    const dots = [
      [0.2, 0.25], [0.8, 0.28], [0.22, 0.42], [0.78, 0.4], [0.35, 0.2], [0.65, 0.22]
    ];
    for (const [dx, dy] of dots) {
      if (Math.sqrt((nx - dx) ** 2 + (ny - dy) ** 2) < 0.03) {
        return [255, 215, 0, 255];
      }
    }

    return [rBg, gBg, bBg, 255];
  });
}

// -------------------------------------------------------------
// 2. GENERATE CUSTOMIZABLE CHARACTER FACE PLACEHOLDER
// -------------------------------------------------------------
function generateCharacterFace(size = 64) {
  return createPng(size, size, (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;
    const cx = nx - 0.5;
    const cy = ny - 0.5;
    const dist = Math.sqrt(cx * cx + cy * cy);

    // Transparent outside circular head
    if (dist > 0.46) return [0, 0, 0, 0];

    // Hair on top
    if (ny < 0.35) {
      // Warm dark brown hair with stylish bangs
      return [62, 39, 35, 255];
    }

    // Cheerful peach skin
    let r = 255, g = 218, b = 185;

    // Rosy cheeks
    if (ny >= 0.52 && ny <= 0.62 && (Math.abs(nx - 0.3) < 0.09 || Math.abs(nx - 0.7) < 0.09)) {
      return [255, 138, 128, 255];
    }

    // Smiling eyes (curved pixel eyes)
    if (ny >= 0.42 && ny <= 0.48) {
      if (Math.abs(nx - 0.32) < 0.05 || Math.abs(nx - 0.68) < 0.05) {
        return [40, 20, 20, 255];
      }
    }

    // Big happy smile
    if (ny >= 0.64 && ny <= 0.74) {
      const smileCurve = 0.68 + (nx - 0.5) * (nx - 0.5) * 1.5;
      if (Math.abs(ny - smileCurve) < 0.04 && nx >= 0.38 && nx <= 0.62) {
        return [211, 47, 47, 255];
      }
    }

    // Tiny golden party crown on hair
    if (ny >= 0.06 && ny <= 0.22 && nx >= 0.36 && nx <= 0.64) {
      return [255, 215, 0, 255];
    }

    return [r, g, b, 255];
  });
}

// -------------------------------------------------------------
// 3. GENERATE RETRO MEMORY POLAROID PHOTOS
// -------------------------------------------------------------
function generatePolaroidPhoto(levelId, title, theme) {
  const width = 360;
  const height = 300;

  return createPng(width, height, (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;

    // Polaroid frame border (warm vintage off-white)
    const isBorder = nx < 0.05 || nx > 0.95 || ny < 0.06 || ny > 0.82;
    if (isBorder) {
      // Polaroid paper texture
      return [248, 247, 243, 255];
    }

    // Bottom caption bar area
    if (ny > 0.82) {
      return [248, 247, 243, 255];
    }

    // Inner photo canvas (nx: 0.05..0.95, ny: 0.06..0.82)
    const px = (nx - 0.05) / 0.9;
    const py = (ny - 0.06) / 0.76;

    // Distinct theme scenes for each level
    switch (levelId) {
      case 1: // The Beginning: Two friends on a sunny hill with blooming flowers
        if (py < 0.45) return [100, 181, 246, 255]; // Sky
        if (py >= 0.45 && py < 0.55) {
          // Rolling hills
          const hill = 0.5 + Math.sin(px * 6) * 0.05;
          if (py >= hill) return [129, 199, 132, 255];
          return [100, 181, 246, 255];
        }
        // Fore ground grass & flowers
        if (py > 0.75 && Math.sin(px * 40) > 0.7) return [255, 235, 59, 255]; // Yellow flowers
        return [76, 175, 80, 255];

      case 2: // The Chaos: Underground glowing crystal cavern with funny expressions
        if (py < 0.8) {
          const caveGlow = Math.sin(px * 8) * Math.cos(py * 6);
          if (caveGlow > 0.5) return [0, 229, 255, 255]; // Neon cyan crystals
          if (caveGlow < -0.5) return [224, 64, 251, 255]; // Magenta crystals
          return [36, 29, 59, 255]; // Deep cave background
        }
        return [49, 27, 146, 255];

      case 3: // The Journey: Sunset mountain peaks & golden hour silhouettes
        const sunsetGrad = py;
        const rS = Math.floor(255 - sunsetGrad * 90);
        const gS = Math.floor(112 - sunsetGrad * 50);
        const bS = Math.floor(67 + sunsetGrad * 120);
        if (py > 0.55) {
          // Jagged mountain silhouette
          const mountain = 0.65 + Math.abs(Math.sin(px * 7)) * 0.15;
          if (py >= mountain) return [49, 27, 146, 255];
        }
        return [rS, gS, bS, 255];

      case 4: // The Adventure: Tropical beach, turquoise ocean, sun & palm
        if (py < 0.35) return [77, 208, 225, 255]; // Bright tropical sky
        if (py >= 0.35 && py < 0.6) return [0, 172, 193, 255]; // Sea
        // Sandy beach
        return [255, 224, 130, 255];

      case 5: // The Birthday Kingdom: Magical castle, fireworks & celebration
      default:
        // Night sky with colorful firework bursts
        const d1 = Math.sqrt((px - 0.3) ** 2 + (py - 0.3) ** 2);
        const d2 = Math.sqrt((px - 0.7) ** 2 + (py - 0.35) ** 2);
        if (d1 < 0.12 && Math.sin(Math.atan2(py - 0.3, px - 0.3) * 12) > 0.3) {
          return [255, 215, 0, 255]; // Gold fireworks
        }
        if (d2 < 0.14 && Math.sin(Math.atan2(py - 0.35, px - 0.7) * 10) > 0.3) {
          return [255, 64, 129, 255]; // Pink fireworks
        }
        if (py > 0.6) return [61, 41, 99, 255]; // Castle rooftop silhouette
        return [26, 15, 53, 255]; // Midnight sky
    }
  });
}

// Execute asset generation
console.log('Generating game assets...');

// Write icons
fs.writeFileSync('public/icons/icon-192.png', generateAppIcon(192));
fs.writeFileSync('public/icons/icon-512.png', generateAppIcon(512));
fs.writeFileSync('public/favicon.png', generateAppIcon(64));

// Write character face
fs.writeFileSync('public/assets/character/face.png', generateCharacterFace(64));

// Write chapter memory polaroids (Level 1 to 5)
for (let lvl = 1; lvl <= 5; lvl++) {
  const mainPhoto = generatePolaroidPhoto(lvl, `Chapter ${lvl}`, `theme_${lvl}`);
  fs.writeFileSync(`public/assets/photos/photo${lvl}.png`, mainPhoto);
  
  // Individual sub-memory photos
  for (let m = 1; m <= 5; m++) {
    fs.writeFileSync(`public/assets/photos/photo${lvl}_${m}.png`, mainPhoto);
  }
}

// Final celebration photo
fs.writeFileSync('public/assets/photos/photo_final.png', generatePolaroidPhoto(5, 'Birthday Finale', 'birthday'));

console.log('All icons, character face, and memory photographs generated successfully!');
