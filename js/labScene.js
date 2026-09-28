/**
 * labScene.js
 * Escenario del Laboratorio Blanco de Biología Molecular de Plantas, Biotecnología y Bioinformática.
 * Incluye: Paredes y mesadas blancas clínicas, Gran Ventanal con Hileras de Árboles de Cerezo (Sakura)
 * y rayos de luz solar entrando al laboratorio, Fitotrón LED blanco, monitores de computadora
 * con secuenciación de ADN y telemetría vegetal, cultivos in vitro, microscopio y la Investigadora.
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  const { WIDTH, HEIGHT, PAL, PixelGFX, MathUtil, Sprites } = ns;

  const sceneCanvas = document.createElement('canvas');
  sceneCanvas.width = WIDTH;
  sceneCanvas.height = HEIGHT;
  const sctx = sceneCanvas.getContext('2d');
  sctx.imageSmoothingEnabled = false;

  // Pétalos de cerezo flotando en el exterior de la ventana
  const SAKURA_PETALS = [];
  for (let i = 0; i < 28; i++) {
    SAKURA_PETALS.push({
      h1: MathUtil.hash(i * 4.3),
      h2: MathUtil.hash(i * 8.9),
      h3: MathUtil.hash(i * 13.7)
    });
  }

  /**
   * 1. Arquitectura de Laboratorio Blanco (paredes, paneles modulares y luminarias de techo)
   */
  function drawWhiteLabArchitecture(ctx) {
    // Pared principal blanca impecable
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, PAL.labWallWhite);
    PixelGFX.ditherGradientV(ctx, 0, 0, WIDTH, 116, PAL.labWallWhite, PAL.labWallLight);

    // Franja superior de techo clínico blanco con paneles LED
    PixelGFX.rect(ctx, 0, 0, WIDTH, 4, PAL.labWallShade);
    PixelGFX.rect(ctx, 0, 4, WIDTH, 1, PAL.labWallLine);

    // Juntas verticales y horizontales de paneles limpios de laboratorio
    for (let x = 40; x < WIDTH; x += 48) {
      PixelGFX.line(ctx, x, 5, x, 114, PAL.labWallLine);
    }
    PixelGFX.line(ctx, 0, 56, WIDTH, 56, PAL.labWallLine);

    // Zócalo sanitario blanco/gris perla antes de la mesada
    PixelGFX.rect(ctx, 0, 114, WIDTH, 2, PAL.labTrim);
    PixelGFX.rect(ctx, 0, 116, WIDTH, 14, PAL.labWallShade);
  }

  /**
   * 2. Gran Ventanal Panorámico con Hileras de Árboles de Cerezo (Sakura)
   * Ubicado en el centro del laboratorio (x: 84..216, y: 10..94)
   */
  function drawCherryBlossomWindow(ctx, time) {
    const wx = 84;
    const wy = 10;
    const ww = 132;
    const wh = 84;

    ctx.save();
    ctx.beginPath();
    ctx.rect(wx, wy, ww, wh);
    ctx.clip();

    // A) Cielo diurno despejado y luminoso
    PixelGFX.ditherGradientV(ctx, wx, wy, ww, 52, PAL.skyTop, PAL.skyHorizon);
    PixelGFX.rect(ctx, wx, wy + 52, ww, wh - 52, PAL.skyHorizon);

    // Sol radiante en la parte superior izquierda del ventanal
    const sunX = wx + 22;
    const sunY = wy + 16;
    PixelGFX.ditherGlow(ctx, sunX, sunY, 6, 26, PAL.sunbeamCore, 0.9);
    PixelGFX.circleFill(ctx, sunX, sunY, 6, PAL.sunbeamCore);

    // Nubes blancas suaves con volumen pixel-art en el horizonte
    const cloudShift = Math.floor(time * 1.5) % 40;
    const c1x = Math.round(wx + 45 + cloudShift * 0.3);
    const c2x = Math.round(wx + 95 - cloudShift * 0.2);
    PixelGFX.ellipseFill(ctx, c1x, wy + 25, 16, 3, '#d8eeff');
    PixelGFX.ellipseFill(ctx, c1x - 3, wy + 23, 10, 4, PAL.white);
    PixelGFX.ellipseFill(ctx, c1x + 5, wy + 24, 8, 3, PAL.white);
    PixelGFX.ellipseFill(ctx, c2x, wy + 20, 18, 3, '#d8eeff');
    PixelGFX.ellipseFill(ctx, c2x - 4, wy + 18, 11, 4, PAL.white);
    PixelGFX.ellipseFill(ctx, c2x + 6, wy + 19, 9, 3, PAL.white);

    // B) Cordillera de los Andes (Valle de O'Higgins) en el horizonte lejano
    const horizonY = wy + 54;
    const peaks = [
      { cx: wx + 18, w: 28, h: 14, col: PAL.andesFar },
      { cx: wx + 46, w: 34, h: 18, col: PAL.andesMid },
      { cx: wx + 78, w: 30, h: 15, col: PAL.andesFar },
      { cx: wx + 108, w: 36, h: 19, col: PAL.andesMid }
    ];
    for (let p = 0; p < peaks.length; p++) {
      const pk = peaks[p];
      for (let dy = 0; dy < pk.h; dy++) {
        const span = Math.round((dy / pk.h) * (pk.w * 0.5));
        const py = horizonY - pk.h + dy;
        PixelGFX.rect(ctx, pk.cx - span, py, span * 2 + 1, 1, pk.col);
        // Cumbre nevada en el tercio superior
        if (dy < pk.h * 0.38) {
          const snowSpan = Math.max(1, span - (dy % 2));
          PixelGFX.rect(ctx, pk.cx - snowSpan, py, snowSpan, 1, PAL.andesSnow);
        }
      }
    }

    // Pradera verde primaveral y sendero central en perspectiva
    PixelGFX.rect(ctx, wx, horizonY, ww, wh - 54, PAL.meadowLight);
    PixelGFX.ditherGradientV(ctx, wx, horizonY + 8, ww, wh - 62, PAL.meadowMid, PAL.meadowDark);

    // Sendero claro entre las dos hileras de cerezos con pétalos caídos en los bordes
    const vanishX = wx + Math.floor(ww * 0.52);
    for (let py = horizonY; py < wy + wh; py++) {
      const t = (py - horizonY) / (wh - 54);
      const halfPath = Math.round(2 + t * 18);
      PixelGFX.rect(ctx, vanishX - halfPath, py, halfPath * 2 + 1, 1, PAL.pathLight);
      PixelGFX.pset(ctx, vanishX - halfPath, py, PAL.pathShade);
      PixelGFX.pset(ctx, vanishX + halfPath, py, PAL.pathShade);
      if (py % 3 === 0) {
        PixelGFX.pset(ctx, vanishX - halfPath - 1, py, PAL.sakuraLight);
        PixelGFX.pset(ctx, vanishX + halfPath + 1, py, PAL.sakuraMid);
      }
    }

    // C) Hileras de Árboles de Cerezo en Flor (Sakura) con copas multi-racimo y corteza detallada
    const treeRows = [
      { x: vanishX - 14, baseY: horizonY + 6, trunkH: 10, crownRX: 9, crownRY: 7, swayPhase: 0.2 },
      { x: vanishX + 14, baseY: horizonY + 6, trunkH: 10, crownRX: 9, crownRY: 7, swayPhase: 1.5 },
      { x: vanishX - 26, baseY: horizonY + 13, trunkH: 14, crownRX: 12, crownRY: 9, swayPhase: 2.4 },
      { x: vanishX + 26, baseY: horizonY + 13, trunkH: 14, crownRX: 12, crownRY: 9, swayPhase: 0.8 },
      { x: vanishX - 42, baseY: horizonY + 21, trunkH: 19, crownRX: 15, crownRY: 11, swayPhase: 3.7 },
      { x: vanishX + 41, baseY: horizonY + 21, trunkH: 19, crownRX: 15, crownRY: 11, swayPhase: 1.9 },
      { x: vanishX - 59, baseY: horizonY + 29, trunkH: 25, crownRX: 19, crownRY: 13, swayPhase: 4.5 },
      { x: vanishX + 58, baseY: horizonY + 29, trunkH: 25, crownRX: 19, crownRY: 13, swayPhase: 2.9 }
    ];

    const sakuraColors = [PAL.sakuraShadow, PAL.sakuraDeep, PAL.sakuraMid, PAL.sakuraLight, PAL.sakuraWhite];

    for (let i = 0; i < treeRows.length; i++) {
      const tr = treeRows[i];
      const breeze = Math.round(Math.sin(time * 2.0 + tr.swayPhase) * 1);
      const crownX = tr.x + breeze;
      const crownY = tr.baseY - tr.trunkH;

      // Sombra proyectada y pétalos sobre el césped
      PixelGFX.ellipseFill(ctx, tr.x, tr.baseY + 1, Math.round(tr.crownRX * 0.65), 2, PAL.meadowDark);
      PixelGFX.pset(ctx, tr.x - 3, tr.baseY + 1, PAL.sakuraLight);
      PixelGFX.pset(ctx, tr.x + 4, tr.baseY + 2, PAL.sakuraMid);

      // Tronco con raíces acampanadas, corteza texturizada y ramas secundarias
      const trunkW = tr.trunkH > 16 ? 3 : 2;
      PixelGFX.rect(ctx, tr.x - Math.floor(trunkW / 2), crownY + 2, trunkW, tr.trunkH, PAL.trunkBarkDark);
      PixelGFX.line(ctx, tr.x - Math.floor(trunkW / 2), crownY + 3, tr.x - Math.floor(trunkW / 2), tr.baseY - 1, PAL.trunkLight);
      PixelGFX.pset(ctx, tr.x - Math.floor(trunkW / 2) - 1, tr.baseY, PAL.trunkDark);
      PixelGFX.pset(ctx, tr.x + Math.ceil(trunkW / 2), tr.baseY, PAL.trunkBarkDark);
      PixelGFX.line(ctx, tr.x, crownY + 6, crownX - Math.round(tr.crownRX * 0.4), crownY + 1, PAL.trunkDark);
      PixelGFX.line(ctx, tr.x, crownY + 5, crownX + Math.round(tr.crownRX * 0.4), crownY + 1, PAL.trunkBarkDark);

      // Copa frondosa multi-racimo en 5 tonos de flor de cerezo
      PixelGFX.foliageCluster(ctx, crownX, crownY, tr.crownRX, tr.crownRY, sakuraColors, i * 3.1);
    }

    // D) Pétalos de cerezo volando suavemente con la brisa primaveral
    for (let p = 0; p < SAKURA_PETALS.length; p++) {
      const pt = SAKURA_PETALS[p];
      const px = wx + ((pt.h1 * ww + time * (8 + pt.h3 * 6)) % ww);
      const py = wy + 12 + ((pt.h2 * (wh - 14) + time * (4 + pt.h1 * 4) + Math.sin(time * 3 + p) * 3) % (wh - 14));
      const petalCol = (p % 3 === 0) ? PAL.sakuraWhite : (p % 3 === 1 ? PAL.sakuraLight : PAL.sakuraMid);
      PixelGFX.pset(ctx, px, py, petalCol);
    }

    ctx.restore();

    // E) Marco arquitectónico blanco/aluminio del gran ventanal (3 paños panorámicos)
    PixelGFX.rectOutline(ctx, wx - 3, wy - 3, ww + 6, wh + 6, PAL.windowFrameDark);
    PixelGFX.rectOutline(ctx, wx - 2, wy - 2, ww + 4, wh + 4, PAL.benchSurface);
    PixelGFX.rectOutline(ctx, wx - 1, wy - 1, ww + 2, wh + 2, PAL.windowFrameWhite);

    // Columnas divisorias de los 3 paños del ventanal
    const pane1X = wx + 44;
    const pane2X = wx + 88;
    PixelGFX.rect(ctx, pane1X - 1, wy, 2, wh, PAL.benchSurface);
    PixelGFX.line(ctx, pane1X + 1, wy, pane1X + 1, wy + wh - 1, PAL.windowFrameDark);
    PixelGFX.rect(ctx, pane2X - 1, wy, 2, wh, PAL.benchSurface);
    PixelGFX.line(ctx, pane2X + 1, wy, pane2X + 1, wy + wh - 1, PAL.windowFrameDark);

    // Travesaño horizontal superior del ventanal
    const transomY = wy + 22;
    PixelGFX.rect(ctx, wx, transomY, ww, 2, PAL.benchSurface);
    PixelGFX.line(ctx, wx, transomY + 2, wx + ww - 1, transomY + 2, PAL.windowFrameDark);

    // Alféizar blanco luminoso de la ventana
    PixelGFX.rect(ctx, wx - 4, wy + wh + 1, ww + 8, 3, PAL.benchSurface);
    PixelGFX.rect(ctx, wx - 4, wy + wh + 4, ww + 8, 2, PAL.windowFrameWhite);
  }

  /**
   * 3. Rayos de Luz Solar entrando por el gran ventanal hacia el laboratorio blanco
   */
  function drawIncomingSunbeams(ctx, time) {
    // Dos haces diagonales de luz solar suave que cruzan desde el ventanal hacia la derecha/abajo
    const beams = [
      { xTop: 94, xBot: 138, width: 26 },
      { xTop: 142, xBot: 192, width: 32 },
      { xTop: 188, xBot: 238, width: 22 }
    ];

    ctx.fillStyle = PAL.sunbeamCore;
    for (let b = 0; b < beams.length; b++) {
      const bm = beams[b];
      for (let py = 12; py < 134; py++) {
        const t = (py - 12) / (134 - 12);
        const startX = Math.round(MathUtil.lerp(bm.xTop, bm.xBot, t));
        const endX = startX + bm.width;
        // Dithering sutil para no tapar los objetos detrás pero dar calidez luminosa
        const intensity = (1.0 - t * 0.55) * 0.32;
        for (let px = startX; px < endX; px++) {
          if (intensity > MathUtil.bayer(px, py)) {
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    }

    // Pequeñas partículas de luz / polen brillando dentro de los haces solares
    for (let m = 0; m < 12; m++) {
      const mx = 98 + ((m * 17 + Math.floor(time * 4)) % 125);
      const my = 20 + ((m * 23 + Math.floor(time * 3)) % 95);
      if (((m + Math.floor(time * 3)) % 2) === 0) {
        PixelGFX.pset(ctx, mx, my, PAL.sunMotel);
      } else {
        PixelGFX.pset(ctx, mx, my, PAL.white);
      }
    }
  }

  /**
   * 4. Cámara de Crecimiento Vegetal (Fitotrón Blanco) a la izquierda (x: 8..74, y: 12..112)
   */
  function drawGrowthChamber(ctx, time) {
    const cx = 8;
    const cy = 12;
    const cw = 66;
    const ch = 98;

    // Carcasa exterior blanca clínica del fitotrón
    PixelGFX.rect(ctx, cx - 3, cy - 5, cw + 6, ch + 8, PAL.windowFrameDark);
    PixelGFX.rect(ctx, cx - 2, cy - 4, cw + 4, ch + 6, PAL.benchSurface);
    PixelGFX.rectOutline(ctx, cx - 1, cy - 3, cw + 2, ch + 4, PAL.windowFrameWhite);

    // Panel superior digital
    PixelGFX.rect(ctx, cx, cy - 2, cw, 3, PAL.metalDark);
    PixelGFX.rect(ctx, cx + 3, cy - 1, 7, 1, PAL.chloroplast);
    PixelGFX.rect(ctx, cx + 13, cy - 1, 5, 1, PAL.neonCyan);
    PixelGFX.pset(ctx, cx + cw - 4, cy - 1, (Math.floor(time * 3) & 1) ? PAL.neonEmerald : PAL.growLedPink);

    // Interior iluminado con LEDs fotosintéticos
    PixelGFX.rect(ctx, cx, cy + 1, cw, ch - 1, PAL.chamberBg);
    PixelGFX.ditherGlow(ctx, cx + 33, cy + 28, 4, 36, PAL.growLedViolet, 0.75);
    PixelGFX.ditherGlow(ctx, cx + 33, cy + 72, 4, 36, PAL.growLedViolet, 0.75);

    const shelvesY = [cy + 33, cy + 65, cy + 96];

    for (let idx = 0; idx < shelvesY.length; idx++) {
      const sy = shelvesY[idx];
      const topLightY = idx === 0 ? cy + 2 : shelvesY[idx - 1] + 2;

      // Barra de luces LED de cultivo vegetal
      PixelGFX.rect(ctx, cx + 3, topLightY, cw - 6, 2, PAL.benchSurface);
      for (let lx = cx + 5; lx < cx + cw - 5; lx += 4) {
        const ledCol = ((lx >> 2) % 2 === 0) ? PAL.growLedPink : PAL.growLedCyan;
        PixelGFX.rect(ctx, lx, topLightY + 1, 2, 1, ledCol);
      }

      // Bandeja blanca del estante
      PixelGFX.rect(ctx, cx + 1, sy, cw - 2, 2, PAL.equipWhite);

      if (idx === 0) {
        for (let p = 0; p < 3; p++) {
          const px = cx + 6 + p * 20;
          ctx.drawImage(Sprites.chamberPlant, px, sy - 12);
        }
      } else if (idx === 1) {
        for (let d = 0; d < 2; d++) {
          const dx = cx + 5 + d * 14;
          PixelGFX.rect(ctx, dx, sy - 4, 11, 4, PAL.glassEdge);
          PixelGFX.rect(ctx, dx + 1, sy - 3, 9, 2, PAL.agarLight);
          PixelGFX.rect(ctx, dx + 3, sy - 4, 4, 2, PAL.chloroplast);
        }
        const hx = cx + 35;
        PixelGFX.rect(ctx, hx, sy - 16, 26, 16, PAL.glassEdge);
        PixelGFX.rect(ctx, hx + 1, sy - 10, 24, 9, PAL.agarGel);
        for (let r = 0; r < 3; r++) {
          const rx = hx + 5 + r * 8;
          PixelGFX.rect(ctx, rx - 2, sy - 19, 5, 3, PAL.neonEmerald);
          PixelGFX.pset(ctx, rx, sy - 20, PAL.chloroplast);
          PixelGFX.line(ctx, rx, sy - 10, rx - 2, sy - 2, PAL.xylemGold);
          PixelGFX.line(ctx, rx, sy - 7, rx + 2, sy - 3, PAL.xylemLight);
        }
      } else {
        for (let b = 0; b < 3; b++) {
          const bx = cx + 11 + b * 21;
          PixelGFX.rect(ctx, bx - 5, sy - 8, 10, 8, PAL.agarGel);
          PixelGFX.rectOutline(ctx, bx - 5, sy - 8, 10, 8, PAL.glassEdge);
          PixelGFX.line(ctx, bx, sy - 7, bx - 2, sy - 2, PAL.xylemGold);
          PixelGFX.line(ctx, bx, sy - 6, bx + 3, sy - 2, PAL.neonCyan);
          const sway = Math.round(Math.sin(time * 2.2 + b) * 1);
          PixelGFX.ellipseFill(ctx, bx + sway, sy - 14, 4, 6, PAL.rootWallMid);
          PixelGFX.ellipseFill(ctx, bx - 3 + sway, sy - 12, 4, 3, PAL.neonEmerald);
          PixelGFX.ellipseFill(ctx, bx + 3 + sway, sy - 12, 4, 3, PAL.chloroplast);
        }
      }
    }
  }

  /**
   * 5. Estantería Blanca de Biología Molecular y Monitor Mural Bioinformático (Derecha: x: 226..312)
   */
  function drawRightWallBiotech(ctx, time) {
    // A) Estantería blanca superior (x: 226..312, y: 28)
    const sx = 226;
    const sy = 28;
    const sw = 86;
    PixelGFX.rect(ctx, sx + 6, sy + 3, 3, 6, PAL.windowFrameDark);
    PixelGFX.rect(ctx, sx + sw - 9, sy + 3, 3, 6, PAL.windowFrameDark);
    PixelGFX.rect(ctx, sx, sy, sw, 3, PAL.benchSurface);
    PixelGFX.rect(ctx, sx, sy + 2, sw, 1, PAL.windowFrameDark);

    // Frascos de reactivos y buffers sobre la estantería blanca (con menisco, etiqueta y brillo especular)
    const bottles = [
      { x: sx + 5, c: PAL.neonCyanMid, light: PAL.neonCyanLight, cap: '#1d4ed8' },
      { x: sx + 16, c: PAL.neonEmerald, light: PAL.chloroplast, cap: '#ea580c' },
      { x: sx + 27, c: PAL.growLedViolet, light: PAL.neonPinkLight, cap: '#00bbf9' }
    ];
    for (let i = 0; i < bottles.length; i++) {
      const b = bottles[i];
      PixelGFX.rect(ctx, b.x + 2, sy - 14, 5, 2, b.cap);
      PixelGFX.pset(ctx, b.x + 3, sy - 14, PAL.white);
      PixelGFX.rect(ctx, b.x + 2, sy - 12, 5, 2, PAL.windowFrameDark);
      PixelGFX.rect(ctx, b.x, sy - 10, 9, 10, PAL.windowFrameDark);
      PixelGFX.rect(ctx, b.x + 1, sy - 9, 7, 8, '#e2eef8');
      PixelGFX.rect(ctx, b.x + 1, sy - 7, 7, 6, b.c);
      PixelGFX.line(ctx, b.x + 1, sy - 7, b.x + 7, sy - 7, b.light);
      // Etiqueta blanca graduada y reflejo vertical de vidrio
      PixelGFX.rect(ctx, b.x + 3, sy - 5, 4, 3, PAL.white);
      PixelGFX.line(ctx, b.x + 4, sy - 4, b.x + 5, sy - 4, PAL.metalMid);
      PixelGFX.line(ctx, b.x + 1, sy - 9, b.x + 1, sy - 2, PAL.white);
    }

    // Termociclador PCR blanco/plata sobre el estante
    const pcrX = sx + 42;
    PixelGFX.rectOutline(ctx, pcrX - 1, sy - 14, 24, 14, PAL.windowFrameDark);
    PixelGFX.rect(ctx, pcrX, sy - 13, 22, 13, PAL.equipWhite);
    PixelGFX.rect(ctx, pcrX + 2, sy - 15, 18, 2, PAL.windowFrameWhite);
    PixelGFX.rect(ctx, pcrX + 3, sy - 9, 10, 5, PAL.screenBg);
    PixelGFX.line(ctx, pcrX + 4, sy - 6, pcrX + 7, sy - 8, PAL.neonCyan);
    PixelGFX.line(ctx, pcrX + 7, sy - 8, pcrX + 10, sy - 5, PAL.chloroplast);

    // Planta in vitro a la derecha del estante
    ctx.drawImage(Sprites.chamberPlant, sx + 70, sy - 12);

    // B) Monitor Mural de Bioinformática y Genómica Vegetal (x: 230..310, y: 42..78)
    const mx = 230;
    const my = 42;
    const mw = 78;
    const mh = 36;

    PixelGFX.rect(ctx, mx - 2, my - 2, mw + 4, mh + 4, PAL.windowFrameDark);
    PixelGFX.rectOutline(ctx, mx - 1, my - 1, mw + 2, mh + 2, PAL.benchSurface);
    PixelGFX.rect(ctx, mx, my, mw, mh, PAL.screenBg);

    // Doble hélice de ADN y electroforesis a la izquierda de la pantalla
    for (let x = 0; x < 26; x++) {
      const wave = Math.round(Math.sin(x * 0.45 - time * 3.0) * 4);
      PixelGFX.pset(ctx, mx + 4 + x, my + 10 + wave, PAL.chloroplast);
      PixelGFX.pset(ctx, mx + 4 + x, my + 10 - wave, PAL.neonCyan);
      if (x % 3 === 0) {
        PixelGFX.line(ctx, mx + 4 + x, my + 10 - wave, mx + 4 + x, my + 10 + wave, PAL.screenGrid);
      }
    }
    for (let lane = 0; lane < 5; lane++) {
      const lx = mx + 5 + lane * 5;
      PixelGFX.rect(ctx, lx, my + 20, 3, 1, PAL.neonCyan);
      PixelGFX.rect(ctx, lx, my + 24 + (lane % 2) * 2, 3, 1, PAL.chloroplast);
      PixelGFX.rect(ctx, lx, my + 30 - (lane % 3), 3, 1, PAL.neonPinkLight);
    }

    // Topología radicular y micorrizas a la derecha de la pantalla
    PixelGFX.line(ctx, mx + 36, my + 2, mx + 36, my + mh - 3, PAL.screenGrid);
    const rx = mx + 56;
    const ry = my + 5;
    PixelGFX.line(ctx, rx, ry, rx, ry + 18, PAL.chloroplast);
    PixelGFX.line(ctx, rx, ry + 6, rx - 9, ry + 13, PAL.neonEmerald);
    PixelGFX.line(ctx, rx, ry + 9, rx + 10, ry + 16, PAL.neonEmerald);
    PixelGFX.line(ctx, rx - 5, ry + 11, rx - 12, ry + 19, PAL.neonCyan);
    PixelGFX.line(ctx, rx + 5, ry + 13, rx + 12, ry + 20, PAL.neonCyan);
    PixelGFX.rect(ctx, mx + 42, my + 28, 18 + Math.round(Math.sin(time * 2) * 5), 2, PAL.chloroplast);
    PixelGFX.rect(ctx, mx + 42, my + 32, 22 + Math.round(Math.cos(time * 3) * 4), 2, PAL.neonCyan);
  }

  /**
   * 6. Mesada Blanca de Biotecnología, Gabinetes Clínicos, Computadoras y Cultivo In Vitro
   */
  function drawWhiteBenchAndComputers(ctx, time) {
    const deskY = 130;

    // Superficie de la mesada blanca clínica y mobiliario de cajoneras/gabinetes debajo
    PixelGFX.rect(ctx, 0, deskY, WIDTH, 9, PAL.benchFront);
    PixelGFX.rect(ctx, 0, deskY, WIDTH, 3, PAL.benchSurface);
    PixelGFX.rect(ctx, 0, deskY + 3, WIDTH, 3, PAL.benchTop);
    PixelGFX.drawLabCabinets(ctx, deskY + 8, HEIGHT, 0, WIDTH);

    // Reflejo cálido de la luz de la ventana sobre la mesada blanca
    PixelGFX.rect(ctx, 118, deskY, 88, 2, PAL.sunbeamCore);

    // Soporte carrusel de micropipetas sobre la mesada (x = 224)
    const pipStandX = 224;
    PixelGFX.rect(ctx, pipStandX, deskY - 2, 10, 2, PAL.metalDark);
    PixelGFX.line(ctx, pipStandX + 5, deskY - 16, pipStandX + 5, deskY - 2, PAL.metalLight);
    PixelGFX.rect(ctx, pipStandX + 1, deskY - 15, 8, 2, PAL.metalMid);
    PixelGFX.line(ctx, pipStandX + 2, deskY - 14, pipStandX + 2, deskY - 7, PAL.pipetteBody);
    PixelGFX.pset(ctx, pipStandX + 2, deskY - 16, PAL.neonPink);
    PixelGFX.line(ctx, pipStandX + 8, deskY - 14, pipStandX + 8, deskY - 7, PAL.pipetteBody);
    PixelGFX.pset(ctx, pipStandX + 8, deskY - 16, PAL.neonCyan);

    // 1. Cultivo In Vitro y Tubos Eppendorf (Izquierda)
    const plantVesselX = 18;
    const plantVesselY = deskY - 21;
    ctx.drawImage(Sprites.inVitroPlant, plantVesselX, plantVesselY);
    PixelGFX.rect(ctx, plantVesselX, deskY - 1, 16, 2, PAL.metalLight);
    PixelGFX.rect(ctx, plantVesselX + 3, deskY - 1, 10, 1, PAL.neonCyan);

    ctx.drawImage(Sprites.eppendorfRack, 40, deskY - 9);

    // 2. Computadora Izquierda (Carcasa Blanca/Plata con Cromatograma de ADN)
    const mon1X = 68;
    const mon1Y = 92;
    const mon1W = 50;
    const mon1H = 30;

    PixelGFX.rect(ctx, mon1X + 21, mon1Y + mon1H, 8, 8, PAL.windowFrameDark);
    PixelGFX.rect(ctx, mon1X + 22, mon1Y + mon1H, 6, 8, PAL.equipWhite);
    PixelGFX.rect(ctx, mon1X + 15, deskY - 2, 20, 2, PAL.windowFrameDark);

    PixelGFX.rect(ctx, mon1X - 2, mon1Y - 2, mon1W + 4, mon1H + 4, PAL.windowFrameDark);
    PixelGFX.rectOutline(ctx, mon1X - 1, mon1Y - 1, mon1W + 2, mon1H + 2, PAL.benchSurface);
    PixelGFX.rect(ctx, mon1X, mon1Y, mon1W, mon1H, PAL.screenBg);

    PixelGFX.rect(ctx, mon1X, mon1Y, mon1W, 4, PAL.metalMid);
    PixelGFX.pset(ctx, mon1X + 2, mon1Y + 1, PAL.neonPink);
    PixelGFX.pset(ctx, mon1X + 4, mon1Y + 1, PAL.starGold);
    PixelGFX.pset(ctx, mon1X + 6, mon1Y + 1, PAL.chloroplast);

    for (let x = 2; x < mon1W - 2; x++) {
      const tX = x * 0.35 + time * 4.2;
      const yG = Math.round(Math.max(0, Math.sin(tX) * 7));
      const yC = Math.round(Math.max(0, Math.cos(tX * 1.3 + 1.0) * 6));
      const yP = Math.round(Math.max(0, Math.sin(tX * 0.8 + 2.5) * 6));
      PixelGFX.pset(ctx, mon1X + x, mon1Y + 18 - yG, PAL.chloroplast);
      PixelGFX.pset(ctx, mon1X + x, mon1Y + 18 - yC, PAL.neonCyan);
      PixelGFX.pset(ctx, mon1X + x, mon1Y + 18 - yP, PAL.neonPinkLight);
    }
    PixelGFX.line(ctx, mon1X + 2, mon1Y + 19, mon1X + mon1W - 3, mon1Y + 19, PAL.screenGrid);
    for (let b = 3; b < mon1W - 4; b += 3) {
      const col = ((b + Math.floor(time * 5)) % 4 === 0) ? PAL.starGold : PAL.chloroplast;
      PixelGFX.rect(ctx, mon1X + b, mon1Y + 23, 2, 4, col);
    }

    PixelGFX.line(ctx, mon1X + mon1W, mon1Y + 26, 136, 128, PAL.windowFrameDark);

    // 3. Computadora Derecha (Monitor Blanco/Plata con Simulación de Estomas y Micorrizas)
    const mon2X = 244;
    const mon2Y = 90;
    const mon2W = 58;
    const mon2H = 33;

    PixelGFX.rect(ctx, mon2X + 25, mon2Y + mon2H, 8, 7, PAL.windowFrameDark);
    PixelGFX.rect(ctx, mon2X + 26, mon2Y + mon2H, 6, 7, PAL.equipWhite);
    PixelGFX.rect(ctx, mon2X + 18, deskY - 2, 22, 2, PAL.windowFrameDark);

    // Teclado blanco/plata sobre la mesada
    PixelGFX.rect(ctx, mon2X + 4, deskY + 2, 34, 4, PAL.windowFrameDark);
    PixelGFX.rect(ctx, mon2X + 5, deskY + 2, 32, 3, PAL.benchSurface);
    PixelGFX.line(ctx, mon2X + 7, deskY + 3, mon2X + 35, deskY + 3, PAL.neonCyanMid);

    PixelGFX.rect(ctx, mon2X - 2, mon2Y - 2, mon2W + 4, mon2H + 4, PAL.windowFrameDark);
    PixelGFX.rectOutline(ctx, mon2X - 1, mon2Y - 1, mon2W + 2, mon2H + 2, PAL.benchSurface);
    PixelGFX.rect(ctx, mon2X, mon2Y, mon2W, mon2H, PAL.screenBg);
    PixelGFX.rect(ctx, mon2X, mon2Y, mon2W, 4, PAL.metalMid);

    // Estoma animado en el monitor derecho
    const stX = mon2X + 16;
    const stY = mon2Y + 18;
    const poreOpen = 1 + Math.round((0.5 + 0.5 * Math.sin(time * 3.0)) * 2);
    PixelGFX.ellipseFill(ctx, stX, stY, 9, 7, PAL.epidermisMid);
    PixelGFX.circleOutline(ctx, stX, stY, 9, PAL.chloroplast);
    PixelGFX.ellipseFill(ctx, stX, stY, poreOpen, 4, PAL.screenBg);
    PixelGFX.pset(ctx, stX - 5, stY - 2, PAL.chloroplast);
    PixelGFX.pset(ctx, stX + 5, stY - 2, PAL.chloroplast);
    PixelGFX.pset(ctx, stX - 5, stY + 2, PAL.chloroplast);
    PixelGFX.pset(ctx, stX + 5, stY + 2, PAL.chloroplast);

    for (let r = 0; r < 5; r++) {
      const ry = mon2Y + 8 + r * 5;
      const barW = 10 + Math.round((0.5 + 0.5 * Math.sin(time * 2.5 + r * 1.4)) * 14);
      const barCol = r % 2 === 0 ? PAL.neonCyan : (r === 1 ? PAL.neonPinkLight : PAL.chloroplast);
      PixelGFX.rect(ctx, mon2X + 30, ry, barW, 3, barCol);
    }
  }

  function getLabTimelineState(time) {
    let leanProgress = 0;
    let amazed = 0;
    let knobTurn = time * 1.2;
    let slideGlow = 1.0;
    let cameraZoom = 1.0;

    const blink =
      (time > 1.0 && time < 1.18) ||
      (time > 3.5 && time < 3.65) ||
      (time > 50.2 && time < 50.36);

    if (time < 5.6) {
      leanProgress = MathUtil.easeInOutCubic(MathUtil.invLerp(1.3, 4.1, time));
      if (time > 1.3 && time < 4.5) {
        knobTurn += (time - 1.3) * 4.0;
      }
      slideGlow = 1.0 + 0.45 * MathUtil.smoothstep(2.8, 5.4, time);
      if (time > 4.3) {
        const zt = MathUtil.easeInCubic(MathUtil.invLerp(4.3, 5.6, time));
        cameraZoom = MathUtil.lerp(1.0, 2.2, zt);
      }
    } else if (time >= 5.6 && time < 9.0) {
      leanProgress = 1.0;
      slideGlow = 1.5;
      const zt = MathUtil.easeInOutCubic(MathUtil.invLerp(5.6, 7.8, time));
      cameraZoom = MathUtil.lerp(2.2, 9.5, zt);
    } else if (time >= 46.5) {
      const outT = MathUtil.easeOutCubic(MathUtil.invLerp(46.8, 48.6, time));
      cameraZoom = MathUtil.lerp(4.0, 1.0, outT);

      const pullBack = MathUtil.easeOutCubic(MathUtil.invLerp(47.2, 49.0, time));
      leanProgress = 1.0 - pullBack;

      const amazeIn = MathUtil.smoothstep(47.2, 48.5, time);
      const amazeOut = 1.0 - MathUtil.smoothstep(50.8, 51.95, time);
      amazed = amazeIn * amazeOut;

      slideGlow = 1.0 + 0.4 * amazeOut;
    }

    return {
      leanProgress,
      amazed,
      knobTurn,
      slideGlow,
      cameraZoom,
      blink
    };
  }

  function render(ctx, time) {
    const state = getLabTimelineState(time);

    sctx.clearRect(0, 0, WIDTH, HEIGHT);

    // 1. Paredes blancas del laboratorio
    drawWhiteLabArchitecture(sctx);

    // 2. Gran ventanal con hileras de árboles de cerezo (Sakura)
    drawCherryBlossomWindow(sctx, time);

    // 3. Cámara de crecimiento vegetal (Fitotrón) a la izquierda y estantería/monitor a la derecha
    drawGrowthChamber(sctx, time);
    drawRightWallBiotech(sctx, time);

    // 4. Rayos de luz solar entrando desde el ventanal de cerezos
    drawIncomingSunbeams(sctx, time);

    // 5. Investigadora sentada detrás de la mesada blanca
    const scientistInfo = Sprites.drawScientistBoyBodyAndHead(sctx, {
      time,
      leanProgress: state.leanProgress,
      amazed: state.amazed,
      blink: state.blink
    });

    // 6. Mesada blanca con cultivos in vitro y computadoras bioinformáticas
    drawWhiteBenchAndComputers(sctx, time);

    // 7. Microscopio de fluorescencia sobre la mesada
    const micInfo = Sprites.drawMicroscope(sctx, {
      time,
      knobTurn: state.knobTurn,
      slideGlow: state.slideGlow
    });

    // 8. Brazo de la investigadora ajustando el micrómetro
    Sprites.drawScientistBoyArm(sctx, scientistInfo, {
      x: micInfo.knobX,
      y: micInfo.knobY
    });

    // 9. Destellos de descubrimiento flotando entre el ocular y la investigadora en el Acto Final
    if (state.amazed > 0.15) {
      for (let i = 0; i < 5; i++) {
        const angle = time * 3.0 + i * 1.25;
        const sx = scientistInfo.leftLensX - 15 + Math.cos(angle) * (5 + i);
        const sy = scientistInfo.leftLensY - 5 + Math.sin(angle * 1.3) * (5 + i);
        const col = i % 2 === 0 ? PAL.chloroplast : PAL.neonCyan;
        PixelGFX.pset(sctx, sx, sy, col);
      }
    }

    const focusX = MathUtil.lerp(micInfo.ocularX + 2, scientistInfo.leftLensX, 0.45);
    const focusY = MathUtil.lerp(micInfo.ocularY, scientistInfo.leftLensY, 0.45);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (state.cameraZoom <= 1.001) {
      ctx.drawImage(sceneCanvas, 0, 0);
    } else {
      const z = state.cameraZoom;
      const viewW = WIDTH / z;
      const viewH = HEIGHT / z;
      const sx = MathUtil.clamp(focusX - viewW * 0.5, 0, WIDTH - viewW);
      const sy = MathUtil.clamp(focusY - viewH * 0.5, 0, HEIGHT - viewH);
      ctx.drawImage(sceneCanvas, sx, sy, viewW, viewH, 0, 0, WIDTH, HEIGHT);
    }
    ctx.restore();

    return {
      ...state,
      focusX,
      focusY
    };
  }

  ns.LabScene = {
    render,
    getLabTimelineState
  };
})(window.MicroCosmos);
