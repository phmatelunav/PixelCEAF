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
    },

    /**
     * Dibuja un rectángulo con esquinas biseladas de 1px y relieve interior (ideal para células vegetales y paneles)
     */
    bevelRect(ctx, x, y, w, h, fillCol, lightCol, darkCol, outlineCol) {
      const ix = Math.round(x);
      const iy = Math.round(y);
      const iw = Math.round(w);
      const ih = Math.round(h);
      if (iw <= 2 || ih <= 2) {
        PixelGFX.rect(ctx, ix, iy, iw, ih, fillCol);
        return;
      }
      // Relleno interior sin las 4 esquinas extremas
      PixelGFX.rect(ctx, ix + 1, iy + 1, iw - 2, ih - 2, fillCol);
      if (outlineCol) {
        PixelGFX.line(ctx, ix + 1, iy, ix + iw - 2, iy, outlineCol);
        PixelGFX.line(ctx, ix + 1, iy + ih - 1, ix + iw - 2, iy + ih - 1, outlineCol);
        PixelGFX.line(ctx, ix, iy + 1, ix, iy + ih - 2, outlineCol);
        PixelGFX.line(ctx, ix + iw - 1, iy + 1, ix + iw - 1, iy + ih - 2, outlineCol);
      }
      if (lightCol && iw > 4 && ih > 4) {
        PixelGFX.line(ctx, ix + 1, iy + 1, ix + iw - 3, iy + 1, lightCol);
        PixelGFX.line(ctx, ix + 1, iy + 1, ix + 1, iy + ih - 3, lightCol);
      }
      if (darkCol && iw > 4 && ih > 4) {
        PixelGFX.line(ctx, ix + 2, iy + ih - 2, ix + iw - 2, iy + ih - 2, darkCol);
        PixelGFX.line(ctx, ix + iw - 2, iy + 2, ix + iw - 2, iy + ih - 2, darkCol);
      }
    },

    /**
     * Dibuja una copa frondosa de árbol o arbusto Pixel-Art mediante racimos orgánicos (5 tonos de sombreado)
     */
    foliageCluster(ctx, cx, cy, rx, ry, colors, seed = 0) {
      const cShadow = colors[0] || PAL.sakuraShadow;
      const cDeep   = colors[1] || PAL.sakuraDeep;
      const cMid    = colors[2] || PAL.sakuraMid;
      const cLight  = colors[3] || PAL.sakuraLight;
      const cWhite  = colors[4] || PAL.sakuraWhite;

      const icx = Math.round(cx);
      const icy = Math.round(cy);
      const irx = Math.max(4, Math.round(rx));
      const iry = Math.max(3, Math.round(ry));

      // 1. Racimos inferiores en sombra profunda (base de la copa)
      const puffsShadow = [
        { dx: -Math.round(irx * 0.48), dy: Math.round(iry * 0.25), r: Math.max(3, Math.round(iry * 0.58)) },
        { dx:  Math.round(irx * 0.48), dy: Math.round(iry * 0.28), r: Math.max(3, Math.round(iry * 0.60)) },
        { dx:  0,                      dy: Math.round(iry * 0.35), r: Math.max(3, Math.round(iry * 0.62)) }
      ];
      for (let i = 0; i < puffsShadow.length; i++) {
        const p = puffsShadow[i];
        PixelGFX.circleFill(ctx, icx + p.dx, icy + p.dy, p.r, cShadow);
      }

      // 2. Racimos medios oscuros (volumen secundario)
      const puffsDeep = [
        { dx: -Math.round(irx * 0.55), dy: Math.round(iry * 0.05), r: Math.max(3, Math.round(iry * 0.58)) },
        { dx:  Math.round(irx * 0.52), dy: Math.round(iry * 0.08), r: Math.max(3, Math.round(iry * 0.58)) },
        { dx: -Math.round(irx * 0.22), dy: Math.round(iry * 0.16), r: Math.max(3, Math.round(iry * 0.65)) },
        { dx:  Math.round(irx * 0.24), dy: Math.round(iry * 0.18), r: Math.max(3, Math.round(iry * 0.64)) }
      ];
      for (let i = 0; i < puffsDeep.length; i++) {
        const p = puffsDeep[i];
        PixelGFX.circleFill(ctx, icx + p.dx, icy + p.dy, p.r, cDeep);
      }

      // 3. Racimos principales de tono medio
      const puffsMid = [
        { dx: -Math.round(irx * 0.44), dy: -Math.round(iry * 0.10), r: Math.max(3, Math.round(iry * 0.56)) },
        { dx:  Math.round(irx * 0.40), dy: -Math.round(iry * 0.06), r: Math.max(3, Math.round(iry * 0.54)) },
        { dx:  0,                      dy: -Math.round(iry * 0.18), r: Math.max(3, Math.round(iry * 0.66)) },
        { dx: -Math.round(irx * 0.16), dy:  Math.round(iry * 0.04), r: Math.max(3, Math.round(iry * 0.58)) }
      ];
      for (let i = 0; i < puffsMid.length; i++) {
        const p = puffsMid[i];
        PixelGFX.circleFill(ctx, icx + p.dx, icy + p.dy, p.r, cMid);
      }

      // 4. Racimos iluminados por el sol (arriba e izquierda)
      const puffsLight = [
        { dx: -Math.round(irx * 0.38), dy: -Math.round(iry * 0.22), r: Math.max(2, Math.round(iry * 0.44)) },
        { dx: -Math.round(irx * 0.06), dy: -Math.round(iry * 0.32), r: Math.max(2, Math.round(iry * 0.48)) },
        { dx:  Math.round(irx * 0.28), dy: -Math.round(iry * 0.18), r: Math.max(2, Math.round(iry * 0.40)) }
      ];
      for (let i = 0; i < puffsLight.length; i++) {
        const p = puffsLight[i];
        PixelGFX.circleFill(ctx, icx + p.dx, icy + p.dy, p.r, cLight);
      }

      // 5. Destellos especulares y pétalos individuales en las crestas superiores
      const puffsWhite = [
        { dx: -Math.round(irx * 0.40), dy: -Math.round(iry * 0.34), r: Math.max(1, Math.round(iry * 0.24)) },
        { dx: -Math.round(irx * 0.10), dy: -Math.round(iry * 0.44), r: Math.max(1, Math.round(iry * 0.28)) },
        { dx:  Math.round(irx * 0.22), dy: -Math.round(iry * 0.30), r: Math.max(1, Math.round(iry * 0.22)) }
      ];
      for (let i = 0; i < puffsWhite.length; i++) {
        const p = puffsWhite[i];
        PixelGFX.circleFill(ctx, icx + p.dx, icy + p.dy, p.r, cWhite);
      }

      // Textura de racimos sueltos de píxeles (pixel clusters de hojas/flores)
      const numClusters = Math.max(5, Math.round((irx + iry) * 0.45));
      for (let k = 0; k < numClusters; k++) {
        const angle = (k / numClusters) * Math.PI * 2 + seed * 0.7;
        const dist = 0.45 + MathUtil.hash(k * 7.1 + seed) * 0.42;
        const px = Math.round(icx + Math.cos(angle) * irx * dist);
        const py = Math.round(icy + Math.sin(angle) * iry * dist);
        const col = Math.sin(angle) < -0.15 ? cWhite : (Math.sin(angle) < 0.3 ? cLight : cDeep);
        PixelGFX.pset(ctx, px, py, col);
        if (k % 2 === 0) PixelGFX.pset(ctx, px + 1, py, col);
      }
    },

    /**
     * Dibuja mobiliario clínico de laboratorio (cajoneras, puertas de gabinete, tiradores y zócalo) bajo la mesada
     */
    drawLabCabinets(ctx, yTop, yBottom, startX = 0, endX = ns.WIDTH) {
      const h = yBottom - yTop;
      if (h <= 6) return;

      // Fondo general del bajo-mesada
      PixelGFX.rect(ctx, startX, yTop, endX - startX, h, PAL.cabinetBody);
      // Sombra proyectada por el borde saliente de la mesada
      PixelGFX.rect(ctx, startX, yTop, endX - startX, 2, PAL.cabinetShadow);
      PixelGFX.line(ctx, startX, yTop + 2, endX - 1, yTop + 2, PAL.cabinetBorder);

      // Zócalo sanitario inferior retraído
      const kickH = Math.min(6, Math.max(3, Math.floor(h * 0.14)));
      const kickY = yBottom - kickH;
      PixelGFX.rect(ctx, startX, kickY, endX - startX, kickH, PAL.cabinetKickplate);
      PixelGFX.line(ctx, startX, kickY, endX - 1, kickY, PAL.metalDark);

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
        // Cajón superior con bisel y tirador metálico
        PixelGFX.bevelRect(ctx, mx, cabTop, mw, drawerH, PAL.cabinetDoor, PAL.white, PAL.cabinetBorder, PAL.cabinetShadow);
        PixelGFX.rect(ctx, mx + Math.floor(mw / 2) - 5, cabTop + Math.floor(drawerH / 2) - 1, 10, 2, PAL.metalLight);
        PixelGFX.line(ctx, mx + Math.floor(mw / 2) - 5, cabTop + Math.floor(drawerH / 2) - 1, mx + Math.floor(mw / 2) + 4, cabTop + Math.floor(drawerH / 2) - 1, PAL.metalShine);

        // Puertas dobles inferiores del gabinete
        if (doorH >= 8) {
          const halfW = Math.floor((mw - 2) / 2);
          // Puerta izquierda
          PixelGFX.bevelRect(ctx, mx, doorY, halfW, doorH, PAL.cabinetDoor, PAL.white, PAL.cabinetBorder, PAL.cabinetShadow);
          PixelGFX.rect(ctx, mx + halfW - 4, doorY + 4, 1, Math.min(7, doorH - 6), PAL.metalLight);
          // Puerta derecha
          PixelGFX.bevelRect(ctx, mx + halfW + 2, doorY, mw - halfW - 2, doorH, PAL.cabinetDoor, PAL.white, PAL.cabinetBorder, PAL.cabinetShadow);
          PixelGFX.rect(ctx, mx + halfW + 5, doorY + 4, 1, Math.min(7, doorH - 6), PAL.metalLight);
        }
      }
    }
  };

  ns.PAL = PAL;
  ns.MathUtil = MathUtil;
  ns.PixelGFX = PixelGFX;
})(window.MicroCosmos);
