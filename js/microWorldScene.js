/**
 * microWorldScene.js
 * Renderizador de Microscopía de Fluorescencia y Biología Molecular Vegetal.
 * Contiene 3 sub-escenas científicas animadas con transiciones ópticas entre ellas:
 *   1. Raíces de las Plantas y Pelos Radiculares (Xilema/Floema, Córtex y Exudados)
 *   2. Simbiosis: Hongos Micorrícicos (Hifas y Arbúsculos) y Bacterias (Bacilos flagelados / PGPR)
 *   3. Estomas de las Hojas y Cloroplastos (Células oclusivas, ciclosis e intercambio gaseoso O2/CO2)
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  const { WIDTH, HEIGHT, PAL, PixelGFX, MathUtil } = ns;

  // Buffer auxiliar para mezclar suavemente las transiciones entre sub-escenas del microscopio
  const subCanvasA = document.createElement('canvas');
  subCanvasA.width = WIDTH;
  subCanvasA.height = HEIGHT;
  const ctxA = subCanvasA.getContext('2d');
  ctxA.imageSmoothingEnabled = false;

  const subCanvasB = document.createElement('canvas');
  subCanvasB.width = WIDTH;
  subCanvasB.height = HEIGHT;
  const ctxB = subCanvasB.getContext('2d');
  ctxB.imageSmoothingEnabled = false;

  // Partículas del suelo / exudados / moléculas gaseosas
  const PARTICLES = [];
  for (let i = 0; i < 75; i++) {
    PARTICLES.push({
      h1: MathUtil.hash(i * 3.7),
      h2: MathUtil.hash(i * 9.1),
      h3: MathUtil.hash(i * 15.3)
    });
  }

  /**
   * Dibuja un bacilo PGPR (bacteria en forma de bastón redondeado 3D) con flagelos animados
   */
  function drawBacterium(ctx, cx, cy, angle, bodyCol, coreCol, time, id) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const nx = -sin;
    const ny = cos;
    const halfLen = 4;

    // 1. Flagelos bacterianos ondulando detrás del polo posterior
    const tailBaseX = cx - cos * (halfLen + 2);
    const tailBaseY = cy - sin * (halfLen + 2);
    for (let f = -1; f <= 1; f += 2) {
      let px = tailBaseX + nx * f;
      let py = tailBaseY + ny * f;
      for (let s = 1; s <= 7; s++) {
        const whip = Math.sin(time * 14 - s * 0.95 + id * 2.1 + f * 0.6) * (1.6 + s * 0.15);
        const curX = Math.round(tailBaseX - cos * s * 1.7 + nx * (whip + f * 0.8));
        const curY = Math.round(tailBaseY - sin * s * 1.7 + ny * (whip + f * 0.8));
        PixelGFX.line(ctx, px, py, curX, curY, s > 4 ? PAL.hyphaDark : PAL.neonCyanMid);
        px = curX;
        py = curY;
      }
    }

    // 2. Sombra inferior / membrana externa de la cápsula bacteriana
    for (let step = -halfLen; step <= halfLen; step++) {
      const bx = Math.round(cx + cos * step + nx * 0.8);
      const by = Math.round(cy + sin * step + ny * 0.8);
      PixelGFX.circleFill(ctx, bx, by, 3, '#1a0b2e');
    }
    // 3. Cuerpo principal del bacilo
    for (let step = -halfLen; step <= halfLen; step++) {
      const bx = Math.round(cx + cos * step);
      const by = Math.round(cy + sin * step);
      PixelGFX.circleFill(ctx, bx, by, 3, bodyCol);
    }
    // 4. Cresta cilíndrica iluminada (sombreado 3D superior)
    for (let step = -halfLen + 1; step <= halfLen - 1; step++) {
      const bx = Math.round(cx + cos * step - nx * 0.9);
      const by = Math.round(cy + sin * step - ny * 0.9);
      PixelGFX.circleFill(ctx, bx, by, 1, coreCol);
    }
    // Nucleoide / plásmido brillante
    PixelGFX.pset(ctx, Math.round(cx + cos * 1.2 - nx * 0.5), Math.round(cy + sin * 1.2 - ny * 0.5), PAL.white);
  }

  // ============================================================================
  // ESCENA MICRO 1: RAÍCES DE LAS PLANTAS, PELOS RADICULARES Y XILEMA/FLOEMA
  // ============================================================================
  function renderRootsScene(ctx, time) {
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, PAL.soilVoid);

    // Halos profundos de la rizosfera en el suelo
    PixelGFX.ditherGlow(ctx, 160, 85, 18, 98, PAL.soilWarm, 0.85);
    PixelGFX.ditherGlow(ctx, 160, 90, 12, 70, PAL.rootWallDark, 0.8);

    // Agregados minerales del suelo en la rizosfera (racimos orgánicos pixel-art)
    for (let m = 0; m < 18; m++) {
      const side = (m % 2 === 0) ? -1 : 1;
      const mx = 160 + side * (48 + ((m * 19) % 92));
      const my = 12 + ((m * 29) % 156);
      const mr = 2 + (m % 3);
      PixelGFX.circleFill(ctx, mx, my, mr, '#141024');
      PixelGFX.circleFill(ctx, mx - 1, my - 1, Math.max(1, mr - 1), '#231c38');
      PixelGFX.pset(ctx, mx - 1, my - 1, '#3b3059');
    }

    // 1. Raíces laterales secundarias en segundo plano
    const lateralBranches = [
      { startY: 36, dir: -1, len: 78, angle: 0.42 },
      { startY: 54, dir: 1, len: 84, angle: 0.38 },
      { startY: 96, dir: -1, len: 68, angle: 0.48 },
      { startY: 112, dir: 1, len: 64, angle: 0.45 }
    ];

    for (let b = 0; b < lateralBranches.length; b++) {
      const br = lateralBranches[b];
      const baseX = 160 + br.dir * 16;
      const baseY = br.startY;
      for (let s = 0; s < br.len; s++) {
        const frac = s / br.len;
        const curve = Math.sin(frac * 2.5 + time * 1.5 + b) * 3;
        const lx = Math.round(baseX + br.dir * s * Math.cos(br.angle));
        const ly = Math.round(baseY + s * Math.sin(br.angle) + curve);
        const radius = Math.max(1, Math.round((1 - frac * 0.75) * 5));
        PixelGFX.circleFill(ctx, lx, ly, radius, PAL.rootWallDark);
        PixelGFX.circleFill(ctx, lx, ly - 1, Math.max(1, radius - 1), PAL.rootWallMid);
        if (s % 4 === 0 && radius >= 2) {
          PixelGFX.pset(ctx, lx, ly - 1, PAL.rootWallLight);
        }
        if (Math.abs(((s - time * 24) % 22)) < 2.2) {
          PixelGFX.pset(ctx, lx, ly, PAL.xylemGold);
        }
      }
    }

    // 2. Pelos Radiculares (Root Hairs) extendiéndose desde la epidermis hacia el suelo
    for (let row = 14; row < 142; row += 9) {
      for (let side of [-1, 1]) {
        const taper = row > 115 ? Math.max(0.2, 1 - (row - 115) / 48) : 1.0;
        const rootHalfW = Math.round(25 * taper);
        const anchorX = 160 + side * rootHalfW;
        const anchorY = row;
        const hairLen = Math.round((22 + ((row * 7) % 18)) * taper);

        let prevX = anchorX;
        let prevY = anchorY;
        for (let h = 1; h <= hairLen; h += 3) {
          const hFrac = h / Math.max(1, hairLen);
          const wave = Math.sin(time * 2.8 + row * 0.15 + hFrac * 2.5) * (hFrac * 5);
          const hx = Math.round(anchorX + side * h + (side * wave * 0.3));
          const hy = Math.round(anchorY + wave + hFrac * 4);
          const col = hFrac > 0.75 ? PAL.neonCyan : PAL.rootWallLight;
          PixelGFX.line(ctx, prevX, prevY + 1, hx, hy + 1, PAL.rootWallDark);
          PixelGFX.line(ctx, prevX, prevY, hx, hy, col);
          prevX = hx;
          prevY = hy;
        }
        PixelGFX.pset(ctx, prevX, prevY, PAL.xylemLight);
      }
    }

    // 3. Cuerpo Principal de la Raíz Primaria (Células Biseladas Orgánicas y Cilindro Vascular con Espirales de Lignina)
    const rootTopY = 0;
    const rootTipY = 162;

    // Vaina de mucílago translúcido alrededor del ápice radicular (caliptra)
    PixelGFX.ditherGlow(ctx, 160, 146, 12, 32, PAL.rootWallMid, 0.55);

    // Base oscura del cilindro radicular
    for (let y = rootTopY; y <= rootTipY; y++) {
      let taper = 1.0;
      if (y > 112) {
        const t = (y - 112) / (rootTipY - 112);
        taper = Math.sqrt(Math.max(0, 1 - t * t));
      }
      const halfW = Math.round(25 * taper);
      if (halfW <= 0) continue;
      PixelGFX.rect(ctx, 160 - halfW, y, halfW * 2 + 1, 1, PAL.rootCellFill);
      // Contorno epidérmico exterior brillante con Sel-Out
      PixelGFX.pset(ctx, 160 - halfW, y, PAL.epidermisHighlight);
      PixelGFX.pset(ctx, 160 + halfW, y, PAL.epidermisHighlight);
      PixelGFX.pset(ctx, 160 - halfW + 1, y, PAL.rootWallMid);
      PixelGFX.pset(ctx, 160 + halfW - 1, y, PAL.rootWallMid);
    }

    // Células individuales biseladas del córtex y epidermis (evitando rejilla plana de ladrillos)
    let curY = 2;
    while (curY < 146) {
      const cellH = curY > 116 ? 7 : 11;
      const midY = curY + Math.floor(cellH * 0.5);
      let taper = 1.0;
      if (midY > 112) {
        const t = (midY - 112) / (rootTipY - 112);
        taper = Math.sqrt(Math.max(0, 1 - t * t));
      }
      const halfW = Math.round(25 * taper);
      if (halfW >= 10) {
        const bands = [
          { f0: -0.96, f1: -0.64 },
          { f0: -0.62, f1: -0.28 },
          { f0:  0.28, f1:  0.62 },
          { f0:  0.64, f1:  0.96 }
        ];
        for (let b = 0; b < bands.length; b++) {
          const x0 = 160 + Math.round(bands[b].f0 * halfW);
          const x1 = 160 + Math.round(bands[b].f1 * halfW);
          const cw = x1 - x0;
          if (cw >= 4) {
            PixelGFX.bevelRect(ctx, x0, curY, cw, cellH - 1, '#0d3024', PAL.rootWallLight, PAL.rootWallDark, PAL.rootWallMid);
            // Núcleo celular con nucléolo brillante
            const nx = x0 + Math.floor(cw * 0.5);
            const ny = curY + Math.floor((cellH - 1) * 0.5);
            PixelGFX.circleFill(ctx, nx, ny, 1, PAL.chloroplast);
            PixelGFX.pset(ctx, nx, ny, PAL.white);
          }
        }
      }
      curY += cellH;
    }

    // Cilindro Vascular Central (Estela: Endodermis con Banda de Caspary, Floema y Xilema Helicoidal)
    for (let y = rootTopY; y < 146; y++) {
      let taper = 1.0;
      if (y > 112) {
        const t = (y - 112) / (rootTipY - 112);
        taper = Math.sqrt(Math.max(0, 1 - t * t));
      }
      const steleHalfW = Math.max(2, Math.round(6 * taper));
      PixelGFX.rect(ctx, 160 - steleHalfW, y, steleHalfW * 2 + 1, 1, '#143828');
      // Endodermis y Banda de Caspary
      const endodermCol = (y % 4 === 0) ? PAL.xylemGold : PAL.neonEmerald;
      PixelGFX.pset(ctx, 160 - steleHalfW, y, endodermCol);
      PixelGFX.pset(ctx, 160 + steleHalfW, y, endodermCol);

      // Tubos cribosos del floema (naranja cálido con placas cribosas cada 6px)
      const phloemCol = (y % 6 === 0) ? PAL.xylemLight : PAL.phloemOrange;
      PixelGFX.pset(ctx, 160 - 3, y, phloemCol);
      PixelGFX.pset(ctx, 160 + 3, y, phloemCol);

      // Vasos del Xilema central con engrosamientos anulares/helicoidales de lignina
      const isRing = (y % 3 === 0);
      PixelGFX.pset(ctx, 160 - 1, y, isRing ? PAL.xylemLight : PAL.xylemGold);
      PixelGFX.pset(ctx, 160,     y, isRing ? PAL.white : PAL.xylemGold);
      PixelGFX.pset(ctx, 160 + 1, y, isRing ? PAL.xylemLight : '#b87d00');
    }

    // 5. Pulsos luminosos de transporte vascular (Agua/Minerales subiendo, Fotosintatos bajando)
    for (let p = 0; p < 8; p++) {
      const upY = 145 - ((time * 38 + p * 19) % 145);
      PixelGFX.circleFill(ctx, 160 - 3, upY, 1, PAL.neonCyanLight);
      PixelGFX.circleFill(ctx, 160 + 3, upY, 1, PAL.neonCyan);

      const downY = (time * 32 + p * 18) % 148;
      PixelGFX.circleFill(ctx, 160, downY, 2, PAL.xylemGold);
      PixelGFX.pset(ctx, 160, downY, PAL.white);
    }

    // Cofia / Caliptra en el ápice radicular (y = 146..162) con células columelares y estatolitos
    for (let cy = 146; cy <= 160; cy += 3) {
      const span = Math.max(2, Math.round((162 - cy) * 0.75));
      PixelGFX.line(ctx, 160 - span, cy, 160 + span, cy, PAL.rootWallLight);
      PixelGFX.pset(ctx, 160, cy + 1, PAL.xylemLight);
    }
    PixelGFX.ditherGlow(ctx, 160, 150, 3, 20 + Math.sin(time * 5) * 4, PAL.chloroplast, 0.85);
    PixelGFX.sparkle(ctx, 160, 150, 2, PAL.xylemGold, PAL.white);

    // 6. Exudados radiculares y señales químicas flotando en la rizosfera
    for (let i = 0; i < 45; i++) {
      const pt = PARTICLES[i];
      const side = (i % 2 === 0) ? 1 : -1;
      const dist = 26 + ((pt.h1 * 110 + time * 12) % 115);
      const py = (pt.h2 * 170 + Math.sin(time * 2 + i) * 6) % HEIGHT;
      const px = 160 + side * dist;
      const col = (i % 3 === 0) ? PAL.xylemGold : (i % 3 === 1 ? PAL.neonCyan : PAL.chloroplast);
      if (i % 6 === 0) {
        PixelGFX.sparkle(ctx, px, py, 1, col, PAL.white);
      } else {
        PixelGFX.pset(ctx, px, py, col);
      }
    }
  }

  // ============================================================================
  // ESCENA MICRO 2: HONGOS MICORRÍCICOS (ARBÚSCULOS E HIFAS) Y BACTERIAS (PGPR)
  // ============================================================================
  function renderMycorrhizaAndBacteriaScene(ctx, time) {
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, PAL.soilVoid);

    // Halos bioluminiscentes de actividad simbiótica
    PixelGFX.ditherGlow(ctx, 92, 90, 15, 80, PAL.rootWallDark, 0.85);
    PixelGFX.ditherGlow(ctx, 215, 90, 15, 85, PAL.nebulaViolet, 0.75);

    // 1. Tejido Cortical de la Raíz a la izquierda (x: 18..136) con células biseladas orgánicas y vacuolas
    const cellCols = [18, 58, 98];
    const cellW = 38;
    const cellH = 42;

    for (let colIdx = 0; colIdx < cellCols.length; colIdx++) {
      const cx0 = cellCols[colIdx];
      for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
        const cy0 = 8 + rowIdx * (cellH + 2) - (colIdx % 2) * 12;

        // Pared celular vegetal biselada de doble capa (sin esquinas cuadradas rígidas)
        PixelGFX.bevelRect(ctx, cx0, cy0, cellW, cellH, PAL.rootCellFill, PAL.rootWallLight, PAL.rootWallDark, PAL.rootWallMid);
        PixelGFX.bevelRect(ctx, cx0 + 2, cy0 + 2, cellW - 4, cellH - 4, '#082119', PAL.rootWallMid, PAL.rootWallDark, PAL.rootWallDark);

        // En las células corticales medias/internas, dibujar ARBÚSCULOS MICORRÍCICOS ramificados
        const hasArbuscule =
          (colIdx === 1 && (rowIdx === 1 || rowIdx === 2)) ||
          (colIdx === 2 && (rowIdx === 1 || rowIdx === 2 || rowIdx === 3));

        if (hasArbuscule) {
          const acx = cx0 + Math.floor(cellW * 0.5);
          const acy = cy0 + Math.floor(cellH * 0.5);
          const pulse = 0.75 + 0.25 * Math.sin(time * 4.5 + colIdx + rowIdx);

          // Membrana periarbuscular y halo de intercambio simbiótico
          PixelGFX.ditherGlow(ctx, acx, acy, 2, 16 * pulse, PAL.arbusculeViolet, 0.85);
          PixelGFX.ditherGlow(ctx, acx, acy, 1, 9 * pulse, PAL.arbusculePink, 0.9);
          PixelGFX.circleOutline(ctx, acx, acy, 13, '#1f5c48');

          // Tronco hifal penetrando con apresorio brillante desde la derecha
          PixelGFX.line(ctx, cx0 + cellW, acy + 1, acx, acy + 1, PAL.hyphaDark);
          PixelGFX.line(ctx, cx0 + cellW, acy, acx, acy, PAL.hyphaBright);
          PixelGFX.circleFill(ctx, cx0 + cellW - 2, acy, 1, PAL.hyphaCore);

          // Ramificación dicotómica fractal del Arbúsculo (3 niveles de detalle)
          for (let branch = 0; branch < 8; branch++) {
            const bAngle = (branch * Math.PI * 2) / 8 + Math.sin(time * 2 + rowIdx) * 0.15;
            const bLen = 11;
            const bx1 = acx + Math.round(Math.cos(bAngle) * (bLen * 0.55));
            const by1 = acy + Math.round(Math.sin(bAngle) * (bLen * 0.55));
            PixelGFX.line(ctx, acx, acy, bx1, by1, PAL.arbusculePink);

            for (let sub of [-0.45, 0.45]) {
              const bx2 = bx1 + Math.round(Math.cos(bAngle + sub) * (bLen * 0.5));
              const by2 = by1 + Math.round(Math.sin(bAngle + sub) * (bLen * 0.5));
              PixelGFX.line(ctx, bx1, by1, bx2, by2, PAL.arbusculeLight);
              const bx3 = bx2 + Math.round(Math.cos(bAngle + sub * 1.4) * 2.2);
              const by3 = by2 + Math.round(Math.sin(bAngle + sub * 1.4) * 2.2);
              PixelGFX.pset(ctx, bx3, by3, (branch % 2 === 0) ? PAL.xylemGold : PAL.hyphaBright);
            }
          }
          // Núcleo brillante del arbúsculo
          PixelGFX.circleFill(ctx, acx, acy, 2, PAL.starGoldLight);
          PixelGFX.pset(ctx, acx, acy, PAL.white);
        } else {
          // Célula vegetal normal con gran vacuola central tonopástica, citoplasma y núcleo detallado
          PixelGFX.bevelRect(ctx, cx0 + 6, cy0 + 14, cellW - 12, cellH - 20, '#0d3629', '#195e47', '#072119', '#144a38');
          PixelGFX.circleFill(ctx, cx0 + 11, cy0 + 9, 3, PAL.chloroplast);
          PixelGFX.circleFill(ctx, cx0 + 10, cy0 + 8, 1, PAL.white);
          // Gránulos citoplasmáticos en ciclosis
          const gx = cx0 + 24 + Math.round(Math.cos(time * 2 + rowIdx) * 3);
          const gy = cy0 + 10 + Math.round(Math.sin(time * 2 + colIdx) * 2);
          PixelGFX.pset(ctx, gx, gy, PAL.epidermisHighlight);
        }
      }
    }

    // 2. Red de Hifas Extrarradiculares (Micelio del Hongo Micorrícico) en la rizosfera (x: 130..315)
    const hyphaePaths = [
      { x0: 136, y0: 42, x1: 310, y1: 18, amp: 8, freq: 0.045, speed: 2.2 },
      { x0: 136, y0: 74, x1: 315, y1: 68, amp: 10, freq: 0.05, speed: 2.5 },
      { x0: 136, y0: 108, x1: 312, y1: 122, amp: 9, freq: 0.04, speed: 2.0 },
      { x0: 136, y0: 142, x1: 305, y1: 166, amp: 7, freq: 0.05, speed: 2.8 },
      { x0: 175, y0: 36, x1: 255, y1: 126, amp: 6, freq: 0.06, speed: 1.9 },
      { x0: 195, y0: 145, x1: 280, y1: 48, amp: 6, freq: 0.05, speed: 2.3 }
    ];

    for (let h = 0; h < hyphaePaths.length; h++) {
      const hp = hyphaePaths[h];
      const steps = 45;
      let prevX = hp.x0;
      let prevY = hp.y0;

      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const baseX = MathUtil.lerp(hp.x0, hp.x1, t);
        const baseY = MathUtil.lerp(hp.y0, hp.y1, t);
        const wave = Math.sin(baseX * hp.freq + time * 1.5 + h) * hp.amp;
        const curX = Math.round(baseX);
        const curY = Math.round(baseY + wave);

        PixelGFX.line(ctx, prevX, prevY + 1, curX, curY + 1, PAL.hyphaDark);
        PixelGFX.line(ctx, prevX, prevY, curX, curY, PAL.hyphaMid);

        if (s % 9 === 0) {
          PixelGFX.pset(ctx, curX, curY, PAL.hyphaCore);
        }

        prevX = curX;
        prevY = curY;
      }

      for (let pkt = 0; pkt < 3; pkt++) {
        const tPhos = 1.0 - ((time * 0.32 + pkt * 0.33 + h * 0.17) % 1.0);
        const pxP = MathUtil.lerp(hp.x0, hp.x1, tPhos);
        const pyP = MathUtil.lerp(hp.y0, hp.y1, tPhos) + Math.sin(pxP * hp.freq + time * 1.5 + h) * hp.amp;
        PixelGFX.circleFill(ctx, pxP, pyP, 1, PAL.hyphaBright);
        PixelGFX.pset(ctx, pxP, pyP, PAL.white);

        const tCarb = (time * 0.26 + pkt * 0.33 + h * 0.21) % 1.0;
        const pxC = MathUtil.lerp(hp.x0, hp.x1, tCarb);
        const pyC = MathUtil.lerp(hp.y0, hp.y1, tCarb) + Math.sin(pxC * hp.freq + time * 1.5 + h) * hp.amp;
        PixelGFX.circleFill(ctx, pxC, pyC, 1, PAL.xylemGold);
      }
    }

    // Espora Micorrícica (Glomerospora multicapa brillante) unida a la red hifal en (274, 94)
    const sporeX = 274;
    const sporeY = 94 + Math.round(Math.sin(time * 2.5) * 2);
    PixelGFX.ditherGlow(ctx, sporeX, sporeY, 4, 18, PAL.hyphaMid, 0.75);
    PixelGFX.circleFill(ctx, sporeX, sporeY, 8, '#062b4c');
    PixelGFX.circleFill(ctx, sporeX, sporeY, 6, PAL.hyphaDark);
    PixelGFX.circleFill(ctx, sporeX - 1, sporeY - 1, 4, PAL.hyphaMid);
    PixelGFX.circleFill(ctx, sporeX - 1, sporeY - 1, 2, PAL.xylemGold);
    PixelGFX.pset(ctx, sporeX - 2, sporeY - 2, PAL.white);

    // 3. Bacterias de la Rizosfera (Rizobios / Bacilos PGPR con sombreado 3D y flagelos)
    const bacteriaSwarm = [
      { cx: 168, cy: 30, rx: 16, ry: 8, speed: 2.4, col: PAL.bacteriaBody, core: PAL.bacteriaCore },
      { cx: 218, cy: 52, rx: 22, ry: 11, speed: -2.1, col: PAL.bacteriaCyan, core: PAL.white },
      { cx: 164, cy: 92, rx: 14, ry: 9, speed: 2.7, col: PAL.bacteriaBody, core: PAL.bacteriaCore },
      { cx: 235, cy: 108, rx: 20, ry: 12, speed: 1.9, col: PAL.neonEmerald, core: PAL.xylemLight },
      { cx: 178, cy: 152, rx: 18, ry: 8, speed: -2.5, col: PAL.bacteriaCyan, core: PAL.white },
      { cx: 282, cy: 40, rx: 14, ry: 10, speed: 2.2, col: PAL.bacteriaBody, core: PAL.bacteriaCore },
      { cx: 258, cy: 148, rx: 16, ry: 9, speed: -2.3, col: PAL.xylemGold, core: PAL.white }
    ];

    for (let i = 0; i < bacteriaSwarm.length; i++) {
      const b = bacteriaSwarm[i];
      const ang = time * b.speed + i * 1.3;
      const bx = b.cx + Math.cos(ang) * b.rx;
      const by = b.cy + Math.sin(ang * 1.4) * b.ry;

      const vx = -Math.sin(ang) * b.rx * b.speed;
      const vy = Math.cos(ang * 1.4) * 1.4 * b.ry * b.speed;
      const heading = Math.atan2(vy, vx);

      const signalR = Math.round(((time * 16 + i * 7) % 24));
      if (signalR > 4 && signalR < 16) {
        PixelGFX.circleOutline(ctx, bx, by, signalR, PAL.hyphaDark);
      }

      drawBacterium(ctx, bx, by, heading, b.col, b.core, time, i);
    }
  }

  // ============================================================================
  // ESCENA MICRO 3: ESTOMAS DE LAS HOJAS, CLOROPLASTOS E INTERCAMBIO GASEOSO
  // ============================================================================
  /**
   * Dibuja un aparato estomático completo con micelación radial de celulosa y grana tilacoidal
   */
  function drawStoma(ctx, cx, cy, scale, openFactor, time, seed) {
    const outerRX = Math.round(28 * scale);
    const outerRY = Math.round(20 * scale);
    const poreRX = Math.max(1, Math.round((1 + openFactor * 7.5) * scale));
    const poreRY = Math.max(2, Math.round((8 + openFactor * 4) * scale));

    // 1. Halo fotosintético alrededor del estoma
    PixelGFX.ditherGlow(
      ctx,
      cx,
      cy,
      outerRY * 0.4,
      outerRX + 14 * openFactor,
      PAL.epidermisWall,
      0.65 + openFactor * 0.3
    );

    // 2. Células acompañantes / subsidiarias alrededor de las células oclusivas
    PixelGFX.ellipseFill(ctx, cx, cy, outerRX + 4, outerRY + 3, PAL.epidermisDark);
    PixelGFX.ellipseFill(ctx, cx, cy, outerRX + 2, outerRY + 1, PAL.epidermisWall);

    // 3. Par de Células Oclusivas (Guard Cells) arriñonadas que se arquean con la turgencia
    const bowShift = Math.round(openFactor * 3 * scale);
    PixelGFX.ellipseFill(ctx, cx - bowShift, cy, outerRX - 2, outerRY - 1, PAL.guardCellFill);
    PixelGFX.ellipseFill(ctx, cx + bowShift, cy, outerRX - 2, outerRY - 1, PAL.guardCellFill);

    // Volumen interno iluminado de cada célula oclusiva
    const gcOffset = Math.round(11 * scale + bowShift);
    PixelGFX.ellipseFill(ctx, cx - gcOffset, cy, Math.round(8 * scale), Math.round(13 * scale), PAL.epidermisWall);
    PixelGFX.ellipseFill(ctx, cx + gcOffset, cy, Math.round(8 * scale), Math.round(13 * scale), PAL.epidermisWall);

    // Microfibrillas de celulosa (líneas de micelación radial características de las células oclusivas)
    for (let side of [-1, 1]) {
      for (let m = -2; m <= 2; m++) {
        const ang = m * 0.42;
        const xIn = cx + side * (poreRX + 2);
        const yIn = cy + Math.round(Math.sin(ang) * poreRY * 0.7);
        const xOut = cx + side * (outerRX - 3);
        const yOut = cy + Math.round(Math.sin(ang) * outerRY * 0.82);
        PixelGFX.line(ctx, xIn, yIn, xOut, yOut, PAL.guardCellFill);
      }
    }

    // Vacuolas turgentes dentro de las células oclusivas
    PixelGFX.ellipseFill(ctx, cx - gcOffset, cy, Math.round(4 * scale), Math.round(8 * scale), PAL.epidermisMid);
    PixelGFX.ellipseFill(ctx, cx + gcOffset, cy, Math.round(4 * scale), Math.round(8 * scale), PAL.epidermisMid);

    // Línea divisoria polar con refuerzo terminal
    PixelGFX.line(ctx, cx, cy - outerRY, cx, cy + outerRY, PAL.epidermisHighlight);

    // 4. Ostíolo (Poro Estomático central con pared ventral engrosada)
    PixelGFX.ellipseFill(ctx, cx, cy, poreRX + 2, poreRY + 2, PAL.epidermisHighlight);
    PixelGFX.ellipseFill(ctx, cx, cy, poreRX + 1, poreRY + 1, PAL.epidermisWall);
    PixelGFX.ellipseFill(ctx, cx, cy, poreRX, poreRY, PAL.poreDark);

    if (openFactor > 0.25) {
      PixelGFX.ditherGlow(ctx, cx, cy, 1, poreRY, PAL.neonCyanDark, 0.8 * openFactor);
    }

    // 5. Cloroplastos con pilas de tilacoides (grana) circulando por ciclosis
    const numChloro = 6;
    for (let side of [-1, 1]) {
      for (let c = 0; c < numChloro; c++) {
        const cAngle = (c * Math.PI * 2) / numChloro + time * 0.85 * side + seed;
        const orbitX = cx + side * gcOffset + Math.round(Math.cos(cAngle) * (5.5 * scale));
        const orbitY = cy + Math.round(Math.sin(cAngle) * (10.5 * scale));

        const chR = Math.max(1, Math.round(2.3 * scale));
        PixelGFX.circleFill(ctx, orbitX, orbitY, chR, '#1b7a50');
        PixelGFX.circleFill(ctx, orbitX, orbitY, Math.max(1, chR - 1), PAL.chloroplast);
        // Pilas de grana tilacoidal y destello de autofluorescencia de clorofila
        if (chR >= 2) {
          PixelGFX.line(ctx, orbitX - 1, orbitY, orbitX + 1, orbitY, '#14593d');
        }
        const isFlashing = ((c + Math.floor(time * 4)) % 3 === 0);
        PixelGFX.pset(ctx, orbitX, orbitY - 1, isFlashing ? PAL.chloroplastRed : PAL.white);
      }
    }

    // 6. Flujo de Intercambio Gaseoso (O2 y vapor de H2O saliendo, CO2 entrando)
    if (openFactor > 0.2) {
      const numGas = Math.round(8 * scale);
      for (let g = 0; g < numGas; g++) {
        const phase = (time * 1.8 + g * (1 / numGas) + seed) % 1.0;
        const gAngle = (g * Math.PI * 2) / numGas + Math.sin(time + g) * 0.4;
        const dist = phase * (34 * scale);
        const gx = cx + Math.cos(gAngle) * dist;
        const gy = cy + Math.sin(gAngle) * dist * 0.75;
        const col = g % 3 === 0 ? PAL.oxygenCyan : (g % 3 === 1 ? PAL.waterBlue : PAL.co2Gold);

        if (g % 2 === 0 && dist > 6) {
          PixelGFX.sparkle(ctx, gx, gy, 1, col, PAL.white);
        } else {
          PixelGFX.pset(ctx, gx, gy, col);
        }
      }
    }
  }

  function renderStomataScene(ctx, time) {
    // 1. Fondo del mesófilo foliar y tejido epidérmico
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, PAL.leafBg);
    PixelGFX.ditherGlow(ctx, 160, 90, 25, 130, PAL.epidermisDark, 0.9);

    // 2. Mosaico de Células Epidérmicas Foliares con doble pared y relieve cuticular
    const hexW = 36;
    const hexH = 26;
    for (let row = -1; row < 8; row++) {
      for (let col = -1; col < 10; col++) {
        const hx = col * hexW + (row % 2) * (hexW * 0.5);
        const hy = row * hexH;

        const x0 = Math.round(hx);
        const y0 = Math.round(hy + 6);
        const x1 = Math.round(hx + hexW * 0.5);
        const y1 = Math.round(hy);
        const x2 = Math.round(hx + hexW);
        const y2 = Math.round(hy + 6);
        const x3 = Math.round(hx + hexW);
        const y3 = Math.round(hy + hexH - 4);
        const x4 = Math.round(hx + hexW * 0.5);
        const y4 = Math.round(hy + hexH + 2);
        const x5 = Math.round(hx);
        const y5 = Math.round(hy + hexH - 4);

        // Sombra de lámina media
        PixelGFX.line(ctx, x0, y0 + 1, x1, y1 + 1, PAL.epidermisMid);
        PixelGFX.line(ctx, x1, y1 + 1, x2, y2 + 1, PAL.epidermisMid);
        // Pared celular epidérmica primaria
        PixelGFX.line(ctx, x0, y0, x1, y1, PAL.epidermisWall);
        PixelGFX.line(ctx, x1, y1, x2, y2, PAL.epidermisWall);
        PixelGFX.line(ctx, x2, y2, x3, y3, PAL.epidermisWall);
        PixelGFX.line(ctx, x3, y3, x4, y4, PAL.epidermisWall);
        PixelGFX.line(ctx, x4, y4, x5, y5, PAL.epidermisWall);
        PixelGFX.line(ctx, x5, y5, x0, y0, PAL.epidermisWall);
        // Brillo en los vértices tricelulares
        PixelGFX.pset(ctx, x1, y1, PAL.epidermisHighlight);

        // Cloroplastos del parénquima en empalizada subyacente
        const mcx = Math.round(hx + hexW * 0.5 + Math.sin(time * 2 + row + col) * 3);
        const mcy = Math.round(hy + hexH * 0.5 + Math.cos(time * 2 + row) * 2);
        PixelGFX.circleFill(ctx, mcx, mcy, 2, PAL.epidermisMid);
        PixelGFX.pset(ctx, mcx, mcy, PAL.rootWallLight);
      }
    }

    // 3. Nervaduras foliares (haces vasculares de la hoja) pulsando con savia
    PixelGFX.line(ctx, 0, 148, 320, 24, PAL.epidermisHighlight);
    PixelGFX.line(ctx, 0, 149, 320, 25, PAL.epidermisWall);

    // 4. Apertura rítmica de los Estomas por presión de turgencia
    const mainOpen = MathUtil.clamp(0.25 + 0.75 * (0.5 + 0.5 * Math.sin((time - 21.0) * 1.6)), 0.15, 1.0);
    const sideOpen1 = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 1.9 + 1.2));
    const sideOpen2 = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 1.9 + 3.5));

    // Estomas secundarios en las esquinas
    drawStoma(ctx, 64, 48, 0.72, sideOpen1, time, 1.1);
    drawStoma(ctx, 256, 134, 0.75, sideOpen2, time, 3.4);
    drawStoma(ctx, 258, 42, 0.62, sideOpen2, time, 5.0);
    drawStoma(ctx, 62, 138, 0.62, sideOpen1, time, 2.2);

    // Estoma Principal (Hero Stoma) en el centro del campo óptico
    drawStoma(ctx, 160, 90, 1.25, mainOpen, time, 0.0);

    // 5. En t = 26.0s .. 28.5s: Destello fotosintético de O2 / Clorofila desde el ostíolo central
    // para el enlace (match-cut) con el reflejo en las gafas de la investigadora
    if (time >= 26.0 && time <= 28.6) {
      const heroT = MathUtil.easeInOutCubic(MathUtil.invLerp(26.0, 28.0, time));
      const hx = WIDTH * 0.5;
      const hy = HEIGHT * 0.5;
      const heroR = MathUtil.lerp(2, 28, heroT);

      PixelGFX.ditherGlow(ctx, hx, hy, heroR * 0.3, heroR * 2.1, PAL.chloroplast, 0.9);
      PixelGFX.ditherGlow(ctx, hx, hy, heroR * 0.2, heroR * 1.4, PAL.neonCyan, 0.95);
      PixelGFX.circleFill(ctx, hx, hy, Math.round(heroR * 0.45), PAL.starGoldLight);
      PixelGFX.circleFill(ctx, hx, hy, Math.round(heroR * 0.25), PAL.white);
      PixelGFX.sparkle(ctx, hx, hy, Math.round(heroR * 0.85), PAL.chloroplast, PAL.white);
    }
  }

  /**
   * Mezcla dos lienzos mediante tramado ordenado Bayer 4x4 + anillo de reenfoque óptico
   */
  function blendWithOpticalDither(ctx, canvasFrom, canvasTo, progress) {
    ctx.drawImage(canvasFrom, 0, 0);
    if (progress <= 0.01) return;
    if (progress >= 0.99) {
      ctx.drawImage(canvasTo, 0, 0);
      return;
    }

    // Transición radial desde el centro del lente con borde Bayer dithered
    const cx = WIDTH * 0.5;
    const cy = HEIGHT * 0.5;
    const maxR = 195;
    const waveR = progress * maxR;

    for (let py = 0; py < HEIGHT; py++) {
      const dy = py - cy;
      const distApprox = Math.abs(dy);
      if (distApprox < waveR - 28) {
        // Fila completamente dentro de la nueva escena
        ctx.drawImage(canvasTo, 0, py, WIDTH, 1, 0, py, WIDTH, 1);
        continue;
      }
      for (let px = 0; px < WIDTH; px++) {
        const dx = px - cx;
        const d = Math.sqrt(dx * dx + dy * dy);
        const localT = MathUtil.clamp((waveR - d + 18) / 36, 0, 1);
        if (localT > MathUtil.bayer(px, py)) {
          ctx.drawImage(canvasTo, px, py, 1, 1, px, py, 1, 1);
        }
      }
    }

    // Anillo de reenfoque del objetivo del microscopio
    if (waveR > 4 && waveR < 180) {
      PixelGFX.circleOutline(ctx, cx, cy, Math.round(waveR), PAL.neonCyan);
      PixelGFX.circleOutline(ctx, cx, cy, Math.round(waveR + 2), PAL.chloroplast);
    }
  }

  /**
   * Renderiza la secuencia completa del mundo microscópico vegetal con sus 3 actos internos:
   * - 5.6s .. 14.2s: Raíces y Pelos Radiculares
   * - 14.2s .. 21.0s: Hongos Micorrícicos (Arbúsculos) y Bacterias (Rizobios)
   * - 21.0s .. 28.8s: Estomas de Hojas y Cloroplastos
   */
  function render(ctx, time) {
    if (time < 13.6) {
      renderRootsScene(ctx, time);
    } else if (time >= 13.6 && time < 14.8) {
      // Transición óptica 1: Raíces -> Micorrizas y Bacterias
      const t = MathUtil.easeInOutCubic(MathUtil.invLerp(13.6, 14.8, time));
      renderRootsScene(ctxA, time);
      renderMycorrhizaAndBacteriaScene(ctxB, time);
      blendWithOpticalDither(ctx, subCanvasA, subCanvasB, t);
    } else if (time >= 14.8 && time < 20.4) {
      renderMycorrhizaAndBacteriaScene(ctx, time);
    } else if (time >= 20.4 && time < 21.6) {
      // Transición óptica 2: Micorrizas y Bacterias -> Estomas de Hojas
      const t = MathUtil.easeInOutCubic(MathUtil.invLerp(20.4, 21.6, time));
      renderMycorrhizaAndBacteriaScene(ctxA, time);
      renderStomataScene(ctxB, time);
      blendWithOpticalDither(ctx, subCanvasA, subCanvasB, t);
    } else {
      renderStomataScene(ctx, time);
    }
  }

  ns.MicroWorldScene = {
    render
  };
})(window.MicroCosmos);
