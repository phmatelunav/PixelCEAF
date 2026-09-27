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
  ns.LOOP_DURATION = 58.0;

  const PAL = {
    // Tonos base y Laboratorio Clínico Blanco
    void: '#04060e',
    labWallWhite: '#f5f8fc',
    labWallLight: '#ebf1f8',
    labWallShade: '#dde7f2',
    labWallLine: '#cad8e8',
    labTrim: '#b8c9de',

    // Mesada de laboratorio blanca
    benchSurface: '#ffffff',
    benchTop: '#eef3f9',
    benchFront: '#dbe4f0',
    benchShadow: '#c3d1e3',
    benchBase: '#e6edf5',

    // Exterior de la ventana: Cielo diurno, pradera e hileras de Cerezos (Sakura)
    skyTop: '#6ec3ff',
    skyMid: '#a6dcff',
    skyHorizon: '#e3f4ff',
    sunbeamCore: '#fffdf2',
    sunbeamWarm: '#fff4c7',
    sunMotel: '#ffe885',
    meadowLight: '#7ae089',
    meadowMid: '#4ec269',
    meadowDark: '#339650',
    pathLight: '#f2e8dc',
    pathShade: '#d9cbbb',
    trunkDark: '#4a2c3a',
    trunkLight: '#6e4555',
    sakuraDeep: '#d95b8a',
    sakuraMid: '#ff82b2',
    sakuraLight: '#ffb3d1',
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

  const PixelGFX = {
    pset(ctx, x, y, color) {
      const ix = x | 0;
      const iy = y | 0;
      if (ix < 0 || ix >= ns.WIDTH || iy < 0 || iy >= ns.HEIGHT) return;
      if (color) ctx.fillStyle = color;
      ctx.fillRect(ix, iy, 1, 1);
    },

    rect(ctx, x, y, w, h, color) {
      const ix = Math.round(x);
      const iy = Math.round(y);
      const iw = Math.round(w);
      const ih = Math.round(h);
      if (iw <= 0 || ih <= 0) return;
      if (color) ctx.fillStyle = color;
      ctx.fillRect(ix, iy, iw, ih);
    },

    rectOutline(ctx, x, y, w, h, color) {
      const ix = Math.round(x);
      const iy = Math.round(y);
      const iw = Math.round(w);
      const ih = Math.round(h);
      if (iw <= 0 || ih <= 0) return;
      if (color) ctx.fillStyle = color;
      ctx.fillRect(ix, iy, iw, 1);
      ctx.fillRect(ix, iy + ih - 1, iw, 1);
      ctx.fillRect(ix, iy, 1, ih);
      ctx.fillRect(ix + iw - 1, iy, 1, ih);
    },

    line(ctx, x0, y0, x1, y1, color) {
      let ix0 = Math.round(x0);
      let iy0 = Math.round(y0);
      const ix1 = Math.round(x1);
      const iy1 = Math.round(y1);

      const dx = Math.abs(ix1 - ix0);
      const dy = -Math.abs(iy1 - iy0);
      const sx = ix0 < ix1 ? 1 : -1;
      const sy = iy0 < iy1 ? 1 : -1;
      let err = dx + dy;

      if (color) ctx.fillStyle = color;

      while (true) {
        if (ix0 >= 0 && ix0 < ns.WIDTH && iy0 >= 0 && iy0 < ns.HEIGHT) {
          ctx.fillRect(ix0, iy0, 1, 1);
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
      const icx = Math.round(cx);
      const icy = Math.round(cy);
      const ir = Math.round(r);
      if (ir <= 0) {
        if (ir === 0) PixelGFX.pset(ctx, icx, icy, color);
        return;
      }
      if (color) ctx.fillStyle = color;
      const r2 = ir * ir + ir * 0.4;
      for (let dy = -ir; dy <= ir; dy++) {
        const py = icy + dy;
        if (py < 0 || py >= ns.HEIGHT) continue;
        const dxMax = Math.floor(Math.sqrt(Math.max(0, r2 - dy * dy)));
        const xStart = Math.max(0, icx - dxMax);
        const xEnd = Math.min(ns.WIDTH - 1, icx + dxMax);
        if (xEnd >= xStart) {
          ctx.fillRect(xStart, py, xEnd - xStart + 1, 1);
        }
      }
    },

    ellipseFill(ctx, cx, cy, rx, ry, color) {
      const icx = Math.round(cx);
      const icy = Math.round(cy);
      const irx = Math.round(rx);
      const iry = Math.round(ry);
      if (irx <= 0 || iry <= 0) return;
      if (color) ctx.fillStyle = color;
      for (let dy = -iry; dy <= iry; dy++) {
        const py = icy + dy;
        if (py < 0 || py >= ns.HEIGHT) continue;
        const ny = dy / (iry + 0.25);
        const span = Math.floor(irx * Math.sqrt(Math.max(0, 1 - ny * ny)));
        const xStart = Math.max(0, icx - span);
        const xEnd = Math.min(ns.WIDTH - 1, icx + span);
        if (xEnd >= xStart) {
          ctx.fillRect(xStart, py, xEnd - xStart + 1, 1);
        }
      }
    },

    circleOutline(ctx, cx, cy, r, color) {
      const icx = Math.round(cx);
      const icy = Math.round(cy);
      const ir = Math.round(r);
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

    ditherGlow(ctx, cx, cy, rInner, rOuter, color, intensity = 1.0) {
      const icx = Math.round(cx);
      const icy = Math.round(cy);
      const irOut = Math.ceil(rOuter);
      if (irOut <= 0 || intensity <= 0.02) return;

      ctx.fillStyle = color;
      const yMin = Math.max(0, icy - irOut);
      const yMax = Math.min(ns.HEIGHT - 1, icy + irOut);
      const xMin = Math.max(0, icx - irOut);
      const xMax = Math.min(ns.WIDTH - 1, icx + irOut);

      const rOutSq = rOuter * rOuter;
      const rIn = Math.max(0, rInner);

      for (let py = yMin; py <= yMax; py++) {
        const dy = py - icy;
        const dySq = dy * dy;
        const bayerRow = BAYER_4X4[py & 3];
        for (let px = xMin; px <= xMax; px++) {
          const dx = px - icx;
          const dSq = dx * dx + dySq;
          if (dSq > rOutSq) continue;
          const dist = Math.sqrt(dSq);
          let alpha = 1.0;
          if (dist > rIn) {
            alpha = 1.0 - (dist - rIn) / Math.max(0.001, rOuter - rIn);
          }
          alpha *= intensity;
          if (alpha > (bayerRow[px & 3] + 0.5) / 16.0) {
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    },

    ditherGradientV(ctx, x, y, w, h, topColor, bottomColor) {
      const ix = Math.round(x);
      const iy = Math.round(y);
      const iw = Math.round(w);
      const ih = Math.round(h);
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
      const ix = Math.round(cx);
      const iy = Math.round(cy);
      const r = Math.round(radius);
      if (r <= 0) {
        PixelGFX.pset(ctx, ix, iy, color);
        return;
      }
      ctx.fillStyle = color;
      ctx.fillRect(ix - r, iy, r * 2 + 1, 1);
      ctx.fillRect(ix, iy - r, 1, r * 2 + 1);
      if (r >= 2) {
        ctx.fillRect(ix - 1, iy - 1, 3, 3);
      }
      ctx.fillStyle = coreColor;
      ctx.fillRect(ix, iy, 1, 1);
    }
  };

  ns.PAL = PAL;
  ns.MathUtil = MathUtil;
  ns.PixelGFX = PixelGFX;
})(window.MicroCosmos);
