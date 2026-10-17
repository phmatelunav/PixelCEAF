/**
 * palette.js
 * Paleta de colores Pixel-Art para el Laboratorio Blanco de Biología Molecular de Plantas,
 * Ventanal con Hileras de Cerezos en Flor (Sakura), Biotecnología, Bioinformática
 * y Microscopía de Fluorescencia (Raíces, Micorrizas, Bacterias y Estomas).
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  ns.WIDTH = 320;
  ns.HEIGHT = 180;
  ns.BASE_WIDTH = 320;
  ns.BASE_HEIGHT = 180;
  ns.CANVAS_WIDTH = 960;
  ns.CANVAS_HEIGHT = 540;
  ns.SCALE = 3;
  ns.LOOP_DURATION = 60.0;

  const PAL = {
    // Tonos base y Laboratorio Clínico Blanco
    void: '#04060e',
    labWallWhite: '#f5f8fc',
    labWallLight: '#ebf1f8',
    labWallShade: '#dde7f2',
    labWallLine: '#cad8e8',
    labTrim: '#b8c9de',

    // Mesada y mobiliario de laboratorio blanco
    benchSurface: '#ffffff',
    benchTop: '#eef3f9',
    benchFront: '#dbe4f0',
    benchShadow: '#c3d1e3',
    benchEdge: '#9bb0d1',
    benchBase: '#e6edf5',
    cabinetBody: '#dfe9f5',
    cabinetDoor: '#eef4fb',
    cabinetBorder: '#b5c7de',
    cabinetShadow: '#9bb0cc',
    cabinetKickplate: '#334155',

    // Exterior de la ventana: Cordillera de los Andes, Cielo, Pradera y Cerezos (Sakura)
    skyTop: '#6ec3ff',
    skyMid: '#a6dcff',
    skyHorizon: '#e3f4ff',
    andesFar: '#a3bce0',
    andesMid: '#7e9cc7',
    andesSnow: '#f2f8ff',
    sunbeamCore: '#fffdf2',
    sunbeamWarm: '#fff4c7',
    sunMotel: '#ffe885',
    meadowLight: '#7ae089',
    meadowMid: '#4ec269',
    meadowDark: '#339650',
    pathLight: '#f2e8dc',
    pathShade: '#d9cbbb',
    trunkBarkDark: '#331c26',
    trunkDark: '#4a2c3a',
    trunkLight: '#6e4555',
    trunkHighlight: '#8c5c6e',
    sakuraShadow: '#a32458',
    sakuraDeep: '#d94882',
    sakuraMid: '#f77cb1',
    sakuraLight: '#ffb8d6',
    sakuraWhite: '#fff0f6',
    windowFrameWhite: '#c2d1e3',
    windowFrameDark: '#8fa5c2',

    // Cámara de cultivo vegetal (Fitotrón blanco con LEDs fotosintéticos)
    chamberBg: '#1c1236',
    growLedPink: '#ff2a85',
    growLedViolet: '#7b2cbf',
    growLedCyan: '#00bbf9',
    agarGel: '#194d47',
    agarLight: '#2a7a6e',

    // Investigadora (Mujer Científica)
    hairDark: '#1c1226',
    hairMid: '#341f47',
    hairLight: '#533470',
    hairShine: '#3b8ea5',
    skinDeep: '#8f4d43',
    skinShadow: '#bf7260',
    skinMid: '#eba087',
    skinLight: '#ffd0bd',
    blush: '#ef6b7b',
    lips: '#c94a63',
    coatOutline: '#637899',
    coatShadow: '#9bb0d1',
    coatDeep: '#9bb0d1',
    coatMid: '#dce8fa',
    coatLight: '#ffffff',
    shirtDark: '#0e4d45',
    shirtMid: '#19786a',
    glassesRim: '#0f766e',
    glassesRimBright: '#00f5d4',
    scrunchie: '#f72585',

    // Equipos, Microscopio y Computadoras
    metalDark: '#222d42',
    metalMid: '#415375',
    metalLight: '#7389b0',
    metalShine: '#b5c7e6',
    equipWhite: '#f0f5fa',
    equipShade: '#cbd7e8',
    brassDark: '#875212',
    brassMid: '#cc851d',
    brassLight: '#ffd059',
    screenBg: '#071829',
    screenGrid: '#0f3654',
    glassEdge: '#38b2ac',

    // Mundo Microscópico Vegetal (Fluorescencia Confocal y Bioluminiscencia)
    soilVoid: '#04050c',
    soilDeep: '#0c0a1c',
    soilWarm: '#1c1326',
    rootWallDark: '#0e402d',
    rootWallMid: '#1b7a50',
    rootWallLight: '#38b876',
    rootCellFill: '#0a261d',
    xylemGold: '#ffbe0b',
    xylemLight: '#fff3b0',
    phloemOrange: '#fb8500',

    // Micorrizas (Hongos simbióticos) y Bacterias (Rizobios / PGPR)
    hyphaDark: '#094a7a',
    hyphaMid: '#00bbf9',
    hyphaBright: '#00f5d4',
    hyphaCore: '#c4fff7',
    arbusculeViolet: '#7209b7',
    arbusculePink: '#f72585',
    arbusculeLight: '#ff85c0',
    bacteriaBody: '#ff2a85',
    bacteriaCore: '#ff9ebb',
    bacteriaCyan: '#4cc9f0',

    // Hoja, Estomas y Cloroplastos
    leafBg: '#051c14',
    epidermisDark: '#0a3826',
    epidermisMid: '#14593d',
    epidermisWall: '#2ec486',
    epidermisHighlight: '#7bf1a8',
    guardCellFill: '#1a754c',
    guardCellBright: '#4ad688',
    chloroplast: '#80ed99',
    chloroplastRed: '#ff4d6d',
    poreDark: '#020b08',
    oxygenCyan: '#00f5d4',
    waterBlue: '#4cc9f0',
    co2Gold: '#ffbe0b',

    // Acentos generales
    neonCyanDark: '#094a7a',
    neonCyanMid: '#00bbf9',
    neonCyan: '#00f5d4',
    neonCyanLight: '#b8fff4',
    neonPinkDark: '#a61158',
    neonPink: '#f72585',
    neonPinkLight: '#ff75b8',
    neonEmeraldDark: '#057a5c',
    neonEmerald: '#06d6a0',
    neonLime: '#80ffdb',
    nebulaViolet: '#3a0ca3',
    nebulaMagenta: '#7209b7',
    starGold: '#ffbe0b',
    starGoldLight: '#fff3b0',
    white: '#ffffff',

    // Biotecnología, Invernadero de Campo y Bioinformática
    gloveCyan: '#2ec4b6',
    gloveHighlight: '#80ffdb',
    gloveOutline: '#0f766e',
    pipetteBody: '#3b82f6',
    pipetteLight: '#93c5fd',
    soilDryLight: '#a47551',
    soilDryMid: '#7f5539',
    soilWetMid: '#4a2e1b',
    soilWetDark: '#2d1b0e',
    terracottaLight: '#e07a5f',
    terracottaDark: '#9e4733',
    waterDropLight: '#caf0f8',
    waterDropMid: '#48cae4',
    waterDropDeep: '#0077b6',
    greenhouseFrame: '#94a3b8',
    greenhouseGlass: '#dcfce7',

    // Logos Institucionales (CEAF, GORE, CORE, ANID)
    ceafGray: '#55565a',
    ceafGrayLight: '#7a7b80',
    ceafGreen: '#1e8238',
    ceafGreenLight: '#2ea84e',
    ceafFruit: '#d45132',
    ceafFruitLight: '#f07154',
    anidBlue: '#0f69b4',
    anidRed: '#e63946',
    coreBronze: '#945f36',
    coreBronzeLight: '#b57848',
    coreStatueDark: '#373d38',
    coreStatueMid: '#5d665e',
    coreStatueLight: '#8a948b',
    goreNavy: '#293d6b',
    goreOchre: '#9e6b3b',
    goreSky: '#7ec8e3',
    goreWaveDark: '#2b579a',
    goreWaveMid: '#0077c8',
    goreWaveLight: '#29abe2',
    goreMountain: '#594a42',
    goreRiver: '#f17343',
    goreApple: '#ef3340'
  };

  const BAYER_4X4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  const MathUtil = {
    clamp(v, min, max) {
      return v < min ? min : v > max ? max : v;
    },
    lerp(a, b, t) {
      return a + (b - a) * t;
    },
    invLerp(a, b, v) {
      if (Math.abs(b - a) < 1e-6) return 0;
      return MathUtil.clamp((v - a) / (b - a), 0, 1);
    },
    smoothstep(edge0, edge1, x) {
      const t = MathUtil.invLerp(edge0, edge1, x);
      return t * t * (3 - 2 * t);
    },
    easeInOutCubic(t) {
      t = MathUtil.clamp(t, 0, 1);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },
    easeOutCubic(t) {
      t = MathUtil.clamp(t, 0, 1);
      return 1 - Math.pow(1 - t, 3);
    },
    easeInCubic(t) {
      t = MathUtil.clamp(t, 0, 1);
      return t * t * t;
    },
    bayer(x, y) {
      const ix = ((x | 0) & 3);
      const iy = ((y | 0) & 3);
      return BAYER_4X4[iy][ix] / 16.0;
    },
    hash(n) {
      const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
      return s - Math.floor(s);
    }
  };


  // Umbrales Bayer 4x4 precalculados para todo el lienzo nativo (960x540) y lienzo auxiliar reutilizable
  let revealThresholds = null;
  let revealScratch = null;
  let revealScratchCtx = null;

  function ensureRevealBuffers() {
    const w = ns.CANVAS_WIDTH || 960;
    const h = ns.CANVAS_HEIGHT || 540;
    if (revealThresholds && revealScratch && revealScratch.width === w && revealScratch.height === h) return;
    revealThresholds = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        revealThresholds[y * w + x] = BAYER_4X4[y & 3][x & 3] / 16.0;
      }
    }
    revealScratch = document.createElement('canvas');
    revealScratch.width = w;
    revealScratch.height = h;
    revealScratchCtx = revealScratch.getContext('2d', { willReadFrequently: true });
    revealScratchCtx.imageSmoothingEnabled = false;
  }

  const PixelGFX = {
    /**
     * Dibuja un píxel escalado (3x3 en 960x540) en las coordenadas base (320x180)
     */
    pset(ctx, x, y, color) {
      const S = ns.SCALE || 3;
      const ix = Math.round(x * S);
      const iy = Math.round(y * S);
      const cW = ns.CANVAS_WIDTH || 960;
      const cH = ns.CANVAS_HEIGHT || 540;
      if (ix < 0 || ix >= cW || iy < 0 || iy >= cH) return;
      if (color) ctx.fillStyle = color;
      ctx.fillRect(ix, iy, S, S);
    },

    /**
     * Dibuja un píxel de precisión nativa 1:1 en el lienzo 960x540 (para micro-detalles y cabello fino)
     */
    finePset(ctx, fx, fy, color) {
      const ix = fx | 0;
      const iy = fy | 0;
      const cW = ns.CANVAS_WIDTH || 960;
      const cH = ns.CANVAS_HEIGHT || 540;
      if (ix < 0 || ix >= cW || iy < 0 || iy >= cH) return;
      if (color) ctx.fillStyle = color;
      ctx.fillRect(ix, iy, 1, 1);
    },

    rect(ctx, x, y, w, h, color) {
      const S = ns.SCALE || 3;
      const ix = Math.round(x * S);
      const iy = Math.round(y * S);
      const iw = Math.round(w * S);
      const ih = Math.round(h * S);
      if (iw <= 0 || ih <= 0) return;
      if (color) ctx.fillStyle = color;
      ctx.fillRect(ix, iy, iw, ih);
    },

    fineRect(ctx, fx, fy, fw, fh, color) {
      const ix = Math.round(fx);
      const iy = Math.round(fy);
      const iw = Math.round(fw);
      const ih = Math.round(fh);
      if (iw <= 0 || ih <= 0) return;
      if (color) ctx.fillStyle = color;
      ctx.fillRect(ix, iy, iw, ih);
    },

    rectOutline(ctx, x, y, w, h, color, borderW = 2) {
      const S = ns.SCALE || 3;
      const ix = Math.round(x * S);
      const iy = Math.round(y * S);
      const iw = Math.round(w * S);
      const ih = Math.round(h * S);
      if (iw <= 0 || ih <= 0) return;
      if (color) ctx.fillStyle = color;
      ctx.fillRect(ix, iy, iw, borderW);
      ctx.fillRect(ix, iy + ih - borderW, iw, borderW);
      ctx.fillRect(ix, iy, borderW, ih);
      ctx.fillRect(ix + iw - borderW, iy, borderW, ih);
    },

    fineRectOutline(ctx, fx, fy, fw, fh, color, borderW = 1) {
      const ix = Math.round(fx);
      const iy = Math.round(fy);
      const iw = Math.round(fw);
      const ih = Math.round(fh);
      if (iw <= 0 || ih <= 0) return;
      if (color) ctx.fillStyle = color;
      ctx.fillRect(ix, iy, iw, borderW);
      ctx.fillRect(ix, iy + ih - borderW, iw, borderW);
      ctx.fillRect(ix, iy, borderW, ih);
      ctx.fillRect(ix + iw - borderW, iy, borderW, ih);
    },

    line(ctx, x0, y0, x1, y1, color, lineWidth = 2) {
      const S = ns.SCALE || 3;
      let ix0 = Math.round(x0 * S);
      let iy0 = Math.round(y0 * S);
      const ix1 = Math.round(x1 * S);
      const iy1 = Math.round(y1 * S);
      const cW = ns.CANVAS_WIDTH || 960;
      const cH = ns.CANVAS_HEIGHT || 540;

      const dx = Math.abs(ix1 - ix0);
      const dy = -Math.abs(iy1 - iy0);
      const sx = ix0 < ix1 ? 1 : -1;
      const sy = iy0 < iy1 ? 1 : -1;
      let err = dx + dy;

      if (color) ctx.fillStyle = color;

      while (true) {
        if (ix0 >= 0 && ix0 < cW && iy0 >= 0 && iy0 < cH) {
          ctx.fillRect(ix0, iy0, lineWidth, lineWidth);
        }
        if (ix0 === ix1 && iy0 === iy1) break;
        const e2 = 2 * err;
        if (e2 >= dy) {
          err += dy;
          ix0 += sx;
        }
        if (e2 <= dx) {
          err += dx;
          iy0 += sy;
        }
      }
    },

    fineLine(ctx, fx0, fy0, fx1, fy1, color, lineWidth = 1) {
      let ix0 = Math.round(fx0);
      let iy0 = Math.round(fy0);
      const ix1 = Math.round(fx1);
      const iy1 = Math.round(fy1);
      const lw = Math.max(1, Math.round(lineWidth));
      const cW = ns.CANVAS_WIDTH || 960;
      const cH = ns.CANVAS_HEIGHT || 540;

      const dx = Math.abs(ix1 - ix0);
      const dy = -Math.abs(iy1 - iy0);
      const sx = ix0 < ix1 ? 1 : -1;
      const sy = iy0 < iy1 ? 1 : -1;
      let err = dx + dy;

      if (color) ctx.fillStyle = color;

      while (true) {
        if (ix0 >= 0 && ix0 < cW && iy0 >= 0 && iy0 < cH) {
          ctx.fillRect(ix0, iy0, lw, lw);
        }
        if (ix0 === ix1 && iy0 === iy1) break;
        const e2 = 2 * err;
        if (e2 >= dy) {
          err += dy;
          ix0 += sx;
        }
        if (e2 <= dx) {
          err += dx;
          iy0 += sy;
        }
      }
    },

    circleFill(ctx, cx, cy, r, color) {
      const S = ns.SCALE || 3;
      const icx = Math.round(cx * S);
      const icy = Math.round(cy * S);
      const ir = Math.round(r * S);
      const cW = ns.CANVAS_WIDTH || 960;
      const cH = ns.CANVAS_HEIGHT || 540;
      if (ir <= 0) {
        if (ir === 0) PixelGFX.pset(ctx, cx, cy, color);
        return;
      }
      if (color) ctx.fillStyle = color;
      const r2 = ir * ir + ir * 0.4;
      for (let dy = -ir; dy <= ir; dy++) {
        const py = icy + dy;
        if (py < 0 || py >= cH) continue;
        const dxMax = Math.floor(Math.sqrt(Math.max(0, r2 - dy * dy)));
        const xStart = Math.max(0, icx - dxMax);
        const xEnd = Math.min(cW - 1, icx + dxMax);
        if (xEnd >= xStart) {
          ctx.fillRect(xStart, py, xEnd - xStart + 1, 1);
        }
      }
    },

    fineCircleFill(ctx, fcx, fcy, fr, color) {
      const icx = Math.round(fcx);
      const icy = Math.round(fcy);
      const ir = Math.round(fr);
      const cW = ns.CANVAS_WIDTH || 960;
      const cH = ns.CANVAS_HEIGHT || 540;
      if (ir <= 0) {
        if (ir === 0) PixelGFX.finePset(ctx, icx, icy, color);
        return;
      }
      if (color) ctx.fillStyle = color;
      const r2 = ir * ir + ir * 0.4;
      for (let dy = -ir; dy <= ir; dy++) {
        const py = icy + dy;
        if (py < 0 || py >= cH) continue;
        const dxMax = Math.floor(Math.sqrt(Math.max(0, r2 - dy * dy)));
        const xStart = Math.max(0, icx - dxMax);
        const xEnd = Math.min(cW - 1, icx + dxMax);
        if (xEnd >= xStart) {
          ctx.fillRect(xStart, py, xEnd - xStart + 1, 1);
        }
      }
    },

    ellipseFill(ctx, cx, cy, rx, ry, color) {
      const S = ns.SCALE || 3;
      const icx = Math.round(cx * S);
      const icy = Math.round(cy * S);
      const irx = Math.round(rx * S);
      const iry = Math.round(ry * S);
      const cW = ns.CANVAS_WIDTH || 960;
      const cH = ns.CANVAS_HEIGHT || 540;
      if (irx <= 0 || iry <= 0) return;
      if (color) ctx.fillStyle = color;
      for (let dy = -iry; dy <= iry; dy++) {
        const py = icy + dy;
        if (py < 0 || py >= cH) continue;
        const ny = dy / (iry + 0.25);
        const span = Math.floor(irx * Math.sqrt(Math.max(0, 1 - ny * ny)));
        const xStart = Math.max(0, icx - span);
        const xEnd = Math.min(cW - 1, icx + span);
        if (xEnd >= xStart) {
          ctx.fillRect(xStart, py, xEnd - xStart + 1, 1);
        }
      }
    },

    fineEllipseFill(ctx, fcx, fcy, frx, fry, color) {
      const icx = Math.round(fcx);
      const icy = Math.round(fcy);
      const irx = Math.round(frx);
      const iry = Math.round(fry);
      const cW = ns.CANVAS_WIDTH || 960;
      const cH = ns.CANVAS_HEIGHT || 540;
      if (irx <= 0 || iry <= 0) return;
      if (color) ctx.fillStyle = color;
      for (let dy = -iry; dy <= iry; dy++) {
        const py = icy + dy;
        if (py < 0 || py >= cH) continue;
        const ny = dy / (iry + 0.25);
        const span = Math.floor(irx * Math.sqrt(Math.max(0, 1 - ny * ny)));
        const xStart = Math.max(0, icx - span);
        const xEnd = Math.min(cW - 1, icx + span);
        if (xEnd >= xStart) {
          ctx.fillRect(xStart, py, xEnd - xStart + 1, 1);
        }
      }
    },

    circleOutline(ctx, cx, cy, r, color, thickness = 2) {
      const S = ns.SCALE || 3;
      const icx = Math.round(cx * S);
      const icy = Math.round(cy * S);
      const ir = Math.round(r * S);
      if (ir <= 0) return;
      if (color) ctx.fillStyle = color;

      let x = ir;
      let y = 0;
      let err = 1 - x;

      while (x >= y) {
        ctx.fillRect(icx + x, icy + y, thickness, thickness);
        ctx.fillRect(icx + y, icy + x, thickness, thickness);
        ctx.fillRect(icx - y, icy + x, thickness, thickness);
        ctx.fillRect(icx - x, icy + y, thickness, thickness);
        ctx.fillRect(icx - x, icy - y, thickness, thickness);
        ctx.fillRect(icx - y, icy - x, thickness, thickness);
        ctx.fillRect(icx + y, icy - x, thickness, thickness);
        ctx.fillRect(icx + x, icy - y, thickness, thickness);
        y++;
        if (err < 0) {
          err += 2 * y + 1;
        } else {
          x--;
          err += 2 * (y - x + 1);
        }
      }
    },

    fineCircleOutline(ctx, fcx, fcy, fr, color) {
      const icx = Math.round(fcx);
      const icy = Math.round(fcy);
      const ir = Math.round(fr);
      if (ir <= 0) return;
      if (color) ctx.fillStyle = color;
      let x = ir;
      let y = 0;
      let err = 1 - x;
      while (x >= y) {
        ctx.fillRect(icx + x, icy + y, 1, 1);
        ctx.fillRect(icx + y, icy + x, 1, 1);
        ctx.fillRect(icx - y, icy + x, 1, 1);
        ctx.fillRect(icx - x, icy + y, 1, 1);
        ctx.fillRect(icx - x, icy - y, 1, 1);
        ctx.fillRect(icx - y, icy - x, 1, 1);
        ctx.fillRect(icx + y, icy - x, 1, 1);
        ctx.fillRect(icx + x, icy - y, 1, 1);
        y++;
        if (err < 0) {
          err += 2 * y + 1;
        } else {
          x--;
          err += 2 * (y - x + 1);
        }
      }
    },

    /**
     * Dibuja un sprite compilado escalado a coordenadas de composición base
     */
    drawSprite(ctx, sprite, x, y) {
      if (!sprite) return;
      ctx.drawImage(sprite, Math.round(x * (ns.SCALE || 3)), Math.round(y * (ns.SCALE || 3)));
    },

    /**
     * Dibuja un sprite compilado a coordenadas nativas 1:1 en el lienzo 960x540
     */
    fineDrawSprite(ctx, sprite, fx, fy) {
      if (!sprite) return;
      ctx.drawImage(sprite, Math.round(fx), Math.round(fy));
    },

    /**
     * Revela `srcCanvas` sobre `ctx` con tramado Bayer 4x4 en una sola pasada (ImageData).
     * `limit` es un número 0..1 o una función (x, y) => 0..1 en coordenadas base (0..320, 0..180).
     */
    ditherReveal(ctx, srcCanvas, limit) {
      ensureRevealBuffers();
      const w = ns.CANVAS_WIDTH || 960;
      const h = ns.CANVAS_HEIGHT || 540;
      const S = ns.SCALE || 3;
      const img = srcCanvas.getContext('2d').getImageData(0, 0, w, h);
      const data = img.data;
      const thr = revealThresholds;
      if (typeof limit === 'function') {
        for (let y = 0; y < h; y++) {
          const vy = y / S;
          for (let x = 0; x < w; x++) {
            const vx = x / S;
            const i = y * w + x;
            if (!(limit(vx, vy) > thr[i])) data[i * 4 + 3] = 0;
          }
        }
      } else {
        for (let i = 0; i < w * h; i++) {
          if (!(limit > thr[i])) data[i * 4 + 3] = 0;
        }
      }
      revealScratchCtx.putImageData(img, 0, 0);
      ctx.drawImage(revealScratch, 0, 0);
    },

    ditherGlow(ctx, cx, cy, rInner, rOuter, color, intensity = 1.0) {
      const S = ns.SCALE || 3;
      const icx = Math.round(cx * S);
      const icy = Math.round(cy * S);
      const irIn = rInner * S;
      const irOut = Math.ceil(rOuter * S);
      const cW = ns.CANVAS_WIDTH || 960;
      const cH = ns.CANVAS_HEIGHT || 540;
      if (irOut <= 0 || intensity <= 0.02) return;

      ctx.fillStyle = color;
      const yMin = Math.max(0, icy - irOut);
      const yMax = Math.min(cH - 1, icy + irOut);
      const xMin = Math.max(0, icx - irOut);
      const xMax = Math.min(cW - 1, icx + irOut);

      const rOutSq = irOut * irOut;
      const rIn = Math.max(0, irIn);

      for (let py = yMin; py <= yMax; py++) {
        const dy = py - icy;
        const dySq = dy * dy;
        const bayerRow = BAYER_4X4[py & 3];
        for (let px = xMin; px <= xMax; px++) {
          const dx = px - icx;
          const distSq = dx * dx + dySq;
          if (distSq > rOutSq) continue;
          const dist = Math.sqrt(distSq);
          let alpha = 1.0;
          if (dist > rIn) {
            alpha = 1.0 - (dist - rIn) / Math.max(0.001, irOut - rIn);
          }
          alpha *= intensity;
          if (alpha > (bayerRow[px & 3] + 0.5) / 16.0) {
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    },

    ditherGradientV(ctx, x, y, w, h, topColor, bottomColor) {
      const S = ns.SCALE || 3;
      const ix = Math.round(x * S);
      const iy = Math.round(y * S);
      const iw = Math.round(w * S);
      const ih = Math.round(h * S);
      ctx.fillStyle = topColor;
      ctx.fillRect(ix, iy, iw, ih);
      ctx.fillStyle = bottomColor;
      for (let py = iy; py < iy + ih; py++) {
        const t = (py - iy) / Math.max(1, ih - 1);
        const bayerRow = BAYER_4X4[py & 3];
        for (let px = ix; px < ix + iw; px++) {
          if (t > (bayerRow[px & 3] + 0.5) / 16.0) {
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    },

    sparkle(ctx, cx, cy, radius, color, coreColor = PAL.white) {
      const S = ns.SCALE || 3;
      const icx = Math.round(cx * S);
      const icy = Math.round(cy * S);
      const r = Math.round(radius * S);
      if (r <= 1) {
        PixelGFX.fineRect(ctx, icx, icy, 2, 2, color);
        PixelGFX.finePset(ctx, icx, icy, coreColor);
        return;
      }
      ctx.fillStyle = color;
      // Brazos finos de 1-2px afilados en las puntas (estética 960x540)
      ctx.fillRect(icx - r, icy, r * 2 + 1, 1);
      ctx.fillRect(icx, icy - r, 1, r * 2 + 1);
      if (r >= 4) {
        const innerR = Math.max(1, Math.floor(r * 0.55));
        ctx.fillRect(icx - innerR, icy - 1, innerR * 2 + 1, 3);
        ctx.fillRect(icx - 1, icy - innerR, 3, innerR * 2 + 1);
      }
      if (r >= 6) {
        ctx.fillRect(icx - 2, icy - 2, 5, 5);
      }
      ctx.fillStyle = coreColor;
      ctx.fillRect(icx - 1, icy - 1, 3, 3);
      ctx.fillStyle = PAL.white;
      ctx.fillRect(icx, icy, 1, 1);
    },

    /**
     * Dibuja un rectángulo con esquinas biseladas de alta precisión y relieve interior en 960x540
     */
    bevelRect(ctx, x, y, w, h, fillCol, lightCol, darkCol, outlineCol) {
      const S = ns.SCALE || 3;
      const fx = Math.round(x * S);
      const fy = Math.round(y * S);
      const fw = Math.round(w * S);
      const fh = Math.round(h * S);
      if (fw <= 4 || fh <= 4) {
        PixelGFX.fineRect(ctx, fx, fy, fw, fh, fillCol);
        return;
      }
      const bev = fw >= 14 && fh >= 14 ? 2 : 1;
      // Relleno interior con esquinas biseladas
      PixelGFX.fineRect(ctx, fx + bev, fy + 1, fw - bev * 2, fh - 2, fillCol);
      PixelGFX.fineRect(ctx, fx + 1, fy + bev, fw - 2, fh - bev * 2, fillCol);

      if (outlineCol) {
        PixelGFX.fineRect(ctx, fx + bev, fy, fw - bev * 2, 1, outlineCol);
        PixelGFX.fineRect(ctx, fx + bev, fy + fh - 1, fw - bev * 2, 1, outlineCol);
        PixelGFX.fineRect(ctx, fx, fy + bev, 1, fh - bev * 2, outlineCol);
        PixelGFX.fineRect(ctx, fx + fw - 1, fy + bev, 1, fh - bev * 2, outlineCol);
        if (bev === 2) {
          PixelGFX.finePset(ctx, fx + 1, fy + 1, outlineCol);
          PixelGFX.finePset(ctx, fx + fw - 2, fy + 1, outlineCol);
          PixelGFX.finePset(ctx, fx + 1, fy + fh - 2, outlineCol);
          PixelGFX.finePset(ctx, fx + fw - 2, fy + fh - 2, outlineCol);
        }
      }
      if (lightCol && fw > 8 && fh > 8) {
        PixelGFX.fineRect(ctx, fx + bev, fy + 1, fw - bev * 2 - 1, 1, lightCol);
        PixelGFX.fineRect(ctx, fx + 1, fy + bev, 1, fh - bev * 2 - 1, lightCol);
      }
      if (darkCol && fw > 8 && fh > 8) {
        PixelGFX.fineRect(ctx, fx + bev + 1, fy + fh - 2, fw - bev * 2 - 1, 1, darkCol);
        PixelGFX.fineRect(ctx, fx + fw - 2, fy + bev + 1, 1, fh - bev * 2 - 1, darkCol);
      }
    },

    /**
     * Dibuja una copa frondosa de árbol o arbusto en alta precisión 960x540 mediante racimos orgánicos (5 tonos)
     */
    foliageCluster(ctx, cx, cy, rx, ry, colors, seed = 0) {
      const S = ns.SCALE || 3;
      const cShadow = colors[0] || PAL.sakuraShadow;
      const cDeep   = colors[1] || PAL.sakuraDeep;
      const cMid    = colors[2] || PAL.sakuraMid;
      const cLight  = colors[3] || PAL.sakuraLight;
      const cWhite  = colors[4] || PAL.sakuraWhite;

      const fcx = Math.round(cx * S);
      const fcy = Math.round(cy * S);
      const frx = Math.max(10, Math.round(rx * S));
      const fry = Math.max(8, Math.round(ry * S));

      // 1. Racimos inferiores en sombra profunda (base de la copa)
      const puffsShadow = [
        { dx: -0.50, dy: 0.26, r: 0.56 },
        { dx:  0.50, dy: 0.28, r: 0.58 },
        { dx: -0.18, dy: 0.36, r: 0.60 },
        { dx:  0.20, dy: 0.34, r: 0.58 }
      ];
      for (let i = 0; i < puffsShadow.length; i++) {
        const p = puffsShadow[i];
        PixelGFX.fineCircleFill(ctx, fcx + p.dx * frx, fcy + p.dy * fry, Math.max(6, fry * p.r), cShadow);
      }

      // 2. Racimos medios oscuros (volumen secundario)
      const puffsDeep = [
        { dx: -0.58, dy: 0.06, r: 0.54 },
        { dx:  0.54, dy: 0.08, r: 0.54 },
        { dx: -0.26, dy: 0.16, r: 0.64 },
        { dx:  0.26, dy: 0.18, r: 0.62 },
        { dx:  0.00, dy: 0.12, r: 0.60 }
      ];
      for (let i = 0; i < puffsDeep.length; i++) {
        const p = puffsDeep[i];
        PixelGFX.fineCircleFill(ctx, fcx + p.dx * frx, fcy + p.dy * fry, Math.max(6, fry * p.r), cDeep);
      }

      // 3. Racimos principales de tono medio
      const puffsMid = [
        { dx: -0.46, dy: -0.10, r: 0.54 },
        { dx:  0.42, dy: -0.06, r: 0.52 },
        { dx:  0.00, dy: -0.18, r: 0.65 },
        { dx: -0.20, dy:  0.02, r: 0.56 },
        { dx:  0.18, dy:  0.00, r: 0.54 }
      ];
      for (let i = 0; i < puffsMid.length; i++) {
        const p = puffsMid[i];
        PixelGFX.fineCircleFill(ctx, fcx + p.dx * frx, fcy + p.dy * fry, Math.max(5, fry * p.r), cMid);
      }

      // 4. Racimos iluminados por el sol (arriba e izquierda)
      const puffsLight = [
        { dx: -0.38, dy: -0.24, r: 0.44 },
        { dx: -0.08, dy: -0.34, r: 0.48 },
        { dx:  0.26, dy: -0.20, r: 0.40 },
        { dx: -0.22, dy: -0.12, r: 0.38 }
      ];
      for (let i = 0; i < puffsLight.length; i++) {
        const p = puffsLight[i];
        PixelGFX.fineCircleFill(ctx, fcx + p.dx * frx, fcy + p.dy * fry, Math.max(4, fry * p.r), cLight);
      }

      // 5. Destellos especulares y pétalos individuales en las crestas superiores
      const puffsWhite = [
        { dx: -0.40, dy: -0.36, r: 0.25 },
        { dx: -0.10, dy: -0.46, r: 0.28 },
        { dx:  0.20, dy: -0.32, r: 0.22 }
      ];
      for (let i = 0; i < puffsWhite.length; i++) {
        const p = puffsWhite[i];
        PixelGFX.fineCircleFill(ctx, fcx + p.dx * frx, fcy + p.dy * fry, Math.max(2, fry * p.r), cWhite);
      }

      // 6. Micro-racimos de hojas/flores en resolución nativa 960x540 (textura detallada de follaje)
      const numClusters = Math.max(18, Math.round((frx + fry) * 0.65));
      for (let k = 0; k < numClusters; k++) {
        const angle = (k / numClusters) * Math.PI * 2 + seed * 0.7;
        const hVal = MathUtil.hash(k * 7.1 + seed);
        const dist = 0.35 + hVal * 0.58;
        const px = Math.round(fcx + Math.cos(angle) * frx * dist);
        const py = Math.round(fcy + Math.sin(angle) * fry * dist);
        const sinA = Math.sin(angle);
        const col = sinA < -0.25 ? cWhite : (sinA < 0.15 ? cLight : (sinA < 0.55 ? cMid : cDeep));
        // Pequeña hoja / flor de 2x2 o 3x2 px nativos
        PixelGFX.fineRect(ctx, px, py, 2, 2, col);
        if (k % 3 === 0) {
          PixelGFX.finePset(ctx, px + 2, py, col);
          PixelGFX.finePset(ctx, px, py - 1, sinA < 0 ? cWhite : cLight);
        }
      }
    },

    /**
     * Dibuja mobiliario clínico de laboratorio (cajoneras, puertas de gabinete, tiradores y zócalo) bajo la mesada
     */
    drawLabCabinets(ctx, yTop, yBottom, startX = 0, endX = (ns.BASE_WIDTH || 320)) {
      const h = yBottom - yTop;
      if (h <= 6) return;

      // Fondo general del bajo-mesada
      PixelGFX.rect(ctx, startX, yTop, endX - startX, h, PAL.cabinetBody);
      // Sombra proyectada por el borde saliente de la mesada
      PixelGFX.rect(ctx, startX, yTop, endX - startX, 2, PAL.cabinetShadow);
      PixelGFX.line(ctx, startX, yTop + 2, endX - 1, yTop + 2, PAL.cabinetBorder, 1);

      // Zócalo sanitario inferior retraído
      const kickH = Math.min(6, Math.max(3, Math.floor(h * 0.14)));
      const kickY = yBottom - kickH;
      PixelGFX.rect(ctx, startX, kickY, endX - startX, kickH, PAL.cabinetKickplate);
      PixelGFX.line(ctx, startX, kickY, endX - 1, kickY, PAL.metalDark, 2);

      // Módulos de cajoneras y puertas cada 40px
      const moduleW = 40;
      const cabTop = yTop + 4;
      const cabH = kickY - cabTop - 2;
      if (cabH < 10) return;

      const drawerH = Math.max(7, Math.floor(cabH * 0.32));
      const doorY = cabTop + drawerH + 2;
      const doorH = cabH - drawerH - 2;

      for (let mx = startX + 4; mx + moduleW - 4 <= endX; mx += moduleW) {
        const mw = moduleW - 4;
        // Cajón superior con bisel fino y tirador metálico cepillado
        PixelGFX.bevelRect(ctx, mx, cabTop, mw, drawerH, PAL.cabinetDoor, PAL.white, PAL.cabinetBorder, PAL.cabinetShadow);
        const handleX = mx + Math.floor(mw / 2) - 5;
        const handleY = cabTop + Math.floor(drawerH / 2) - 1;
        PixelGFX.rect(ctx, handleX, handleY, 10, 2, PAL.metalMid);
        PixelGFX.line(ctx, handleX, handleY, handleX + 9, handleY, PAL.metalShine, 1);
        PixelGFX.pset(ctx, handleX, handleY + 1, PAL.metalDark);
        PixelGFX.pset(ctx, handleX + 9, handleY + 1, PAL.metalDark);

        // Puertas dobles inferiores del gabinete
        if (doorH >= 8) {
          const halfW = Math.floor((mw - 2) / 2);
          // Puerta izquierda
          PixelGFX.bevelRect(ctx, mx, doorY, halfW, doorH, PAL.cabinetDoor, PAL.white, PAL.cabinetBorder, PAL.cabinetShadow);
          PixelGFX.rect(ctx, mx + halfW - 3, doorY + 4, 1, Math.min(7, doorH - 6), PAL.metalMid);
          PixelGFX.line(ctx, mx + halfW - 3, doorY + 4, mx + halfW - 3, doorY + 4 + Math.min(7, doorH - 6) - 1, PAL.metalShine, 1);
          // Puerta derecha
          PixelGFX.bevelRect(ctx, mx + halfW + 2, doorY, mw - halfW - 2, doorH, PAL.cabinetDoor, PAL.white, PAL.cabinetBorder, PAL.cabinetShadow);
          PixelGFX.rect(ctx, mx + halfW + 4, doorY + 4, 1, Math.min(7, doorH - 6), PAL.metalMid);
          PixelGFX.line(ctx, mx + halfW + 4, doorY + 4, mx + halfW + 4, doorY + 4 + Math.min(7, doorH - 6) - 1, PAL.metalShine, 1);
        }
      }
    }
  };

  ns.PAL = PAL;
  ns.MathUtil = MathUtil;
  ns.PixelGFX = PixelGFX;
})(window.MicroCosmos);
