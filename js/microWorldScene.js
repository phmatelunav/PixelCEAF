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
   * Dibuja un bacilo (bacteria en forma de bastón redondeado) con flagelos animados
   */
  function drawBacterium(ctx, cx, cy, angle, bodyCol, coreCol, time, id) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const halfLen = 4;

    // 1. Flagelos bacterianos ondulando detrás del polo posterior
    const tailBaseX = cx - cos * (halfLen + 2);
    const tailBaseY = cy - sin * (halfLen + 2);
    let px = tailBaseX;
    let py = tailBaseY;
    for (let s = 1; s <= 8; s++) {
      const whip = Math.sin(time * 14 - s * 0.9 + id * 2.1) * 2.2;
      const nx = Math.round(tailBaseX - cos * s * 1.8 - sin * whip);
      const ny = Math.round(tailBaseY - sin * s * 1.8 + cos * whip);
      PixelGFX.line(ctx, px, py, nx, ny, s > 5 ? PAL.hyphaDark : PAL.neonCyanMid);
      px = nx;
      py = ny;
    }

    // 2. Cápsula del bacilo (bastón de 8px con extremos redondeados)
    for (let step = -halfLen; step <= halfLen; step++) {
      const bx = Math.round(cx + cos * step);
      const by = Math.round(cy + sin * step);
      PixelGFX.circleFill(ctx, bx, by, 3, bodyCol);
    }
    for (let step = -halfLen + 1; step <= halfLen - 1; step++) {
      const bx = Math.round(cx + cos * step);
      const by = Math.round(cy + sin * step);
      PixelGFX.circleFill(ctx, bx, by, 1, coreCol);
    }
    // Nucleoide / plásmido brillante
    PixelGFX.pset(ctx, Math.round(cx + cos * 1), Math.round(cy + sin * 1), PAL.white);
  }

  // ============================================================================
  // ESCENA MICRO 1: RAÍCES DE LAS PLANTAS, PELOS RADICULARES Y XILEMA/FLOEMA
  // ============================================================================
  function renderRootsScene(ctx, time) {
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, PAL.soilVoid);

    // Halos profundos de la rizosfera en el suelo
    PixelGFX.ditherGlow(ctx, 160, 85, 18, 95, PAL.soilWarm, 0.85);
    PixelGFX.ditherGlow(ctx, 160, 90, 12, 68, PAL.rootWallDark, 0.8);

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
        PixelGFX.circleFill(ctx, lx, ly, Math.max(1, radius - 1), PAL.rootWallMid);
        // Pulso de savia en la raíz lateral
        if (Math.abs(((s - time * 24) % 22)) < 2.2) {
          PixelGFX.pset(ctx, lx, ly, PAL.xylemGold);
        }
      }
    }

    // 2. Pelos Radiculares (Root Hairs) extendiéndose desde la epidermis hacia el suelo
    for (let row = 14; row < 142; row += 9) {
      for (let side of [-1, 1]) {
        const taper = row > 115 ? Math.max(0.2, 1 - (row - 115) / 48) : 1.0;
        const rootHalfW = Math.round(24 * taper);
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
          PixelGFX.line(ctx, prevX, prevY, hx, hy, col);
          prevX = hx;
          prevY = hy;
        }
        // Gota de exudado radicular brillante en la punta del pelo radicular
        PixelGFX.pset(ctx, prevX, prevY, PAL.xylemLight);
      }
    }

    // 3. Cuerpo Principal de la Raíz Primaria (Arquitectura Celular y Cilindro Vascular)
    const rootTopY = 0;
    const rootTipY = 162;

    for (let y = rootTopY; y <= rootTipY; y++) {
      // Forma ahusada hacia el ápice meristemático (cofia)
      let taper = 1.0;
      if (y > 112) {
        const t = (y - 112) / (rootTipY - 112);
        taper = Math.sqrt(Math.max(0, 1 - t * t));
      }
      const halfW = Math.round(25 * taper);
      if (halfW <= 0) continue;

      const xLeft = 160 - halfW;
      const xRight = 160 + halfW;

      // Relleno del córtex radicular
      PixelGFX.rect(ctx, xLeft, y, halfW * 2 + 1, 1, PAL.rootCellFill);

      // Paredes celulares longitudinales (hileras de células del córtex y epidermis)
      const colOffsets = [-1.0, -0.68, -0.36, 0.36, 0.68, 1.0];
      for (let c = 0; c < colOffsets.length; c++) {
        const cx = 160 + Math.round(colOffsets[c] * halfW);
        const isOuter = Math.abs(colOffsets[c]) > 0.9;
        PixelGFX.pset(ctx, cx, y, isOuter ? PAL.epidermisHighlight : PAL.rootWallMid);
      }

      // Paredes celulares transversales (ladrillos celulares)
      const cellH = y > 122 ? 6 : 11; // células más pequeñas en el meristemo apical
      if (y % cellH === 0) {
        PixelGFX.line(ctx, xLeft + 1, y, xRight - 1, y, PAL.rootWallMid);
      }

      // Cilindro Vascular Central (Estela: Xilema y Floema)
      const steleHalfW = Math.max(1, Math.round(6 * taper));
      if (y < 146) {
        PixelGFX.rect(ctx, 160 - steleHalfW, y, steleHalfW * 2 + 1, 1, '#143828');
        PixelGFX.pset(ctx, 160 - steleHalfW, y, PAL.neonEmerald);
        PixelGFX.pset(ctx, 160 + steleHalfW, y, PAL.neonEmerald);
        // Vasos del xilema en el centro
        PixelGFX.pset(ctx, 160 - 2, y, PAL.phloemOrange);
        PixelGFX.pset(ctx, 160 + 2, y, PAL.phloemOrange);
        PixelGFX.pset(ctx, 160, y, PAL.xylemGold);
      }
    }

    // 4. Núcleos celulares brillando dentro de las células del córtex y meristemo
    for (let y = 8; y < 145; y += 11) {
      const taper = y > 112 ? Math.sqrt(Math.max(0, 1 - Math.pow((y - 112) / 50, 2))) : 1.0;
      const halfW = Math.round(25 * taper);
      if (halfW < 8) continue;
      for (let frac of [-0.82, -0.52, 0.52, 0.82]) {
        const nx = 160 + Math.round(frac * halfW);
        const ny = y + 5;
        PixelGFX.circleFill(ctx, nx, ny, 1, PAL.chloroplast);
        PixelGFX.pset(ctx, nx, ny, PAL.white);
      }
    }

    // 5. Pulsos luminosos de transporte vascular (Agua/Minerales subiendo, Fotosintatos bajando)
    for (let p = 0; p < 8; p++) {
      // Agua y minerales subiendo en cian hacia el tallo
      const upY = 145 - ((time * 38 + p * 19) % 145);
      PixelGFX.circleFill(ctx, 160 - 2, upY, 1, PAL.neonCyanLight);
      PixelGFX.circleFill(ctx, 160 + 2, upY, 1, PAL.neonCyan);

      // Auxinas y azúcares bajando en dorado hacia el ápice radicular
      const downY = (time * 32 + p * 18) % 148;
      PixelGFX.circleFill(ctx, 160, downY, 2, PAL.xylemGold);
      PixelGFX.pset(ctx, 160, downY, PAL.white);
    }

    // Brillo mitótico en el meristemo apical (punta de la raíz en y = 148..162)
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

    // 1. Tejido Cortical de la Raíz a la izquierda (x: 14..144) donde se alojan los Arbúsculos
    const cellCols = [18, 58, 98];
    const cellW = 38;
    const cellH = 42;

    for (let colIdx = 0; colIdx < cellCols.length; colIdx++) {
      const cx0 = cellCols[colIdx];
      for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
        const cy0 = 8 + rowIdx * (cellH + 2) - (colIdx % 2) * 12;
        // Interior de la célula vegetal
        PixelGFX.rect(ctx, cx0, cy0, cellW, cellH, PAL.rootCellFill);
        // Pared celular vegetal de doble capa
        PixelGFX.rectOutline(ctx, cx0, cy0, cellW, cellH, PAL.rootWallMid);
        PixelGFX.rectOutline(ctx, cx0 + 1, cy0 + 1, cellW - 2, cellH - 2, PAL.rootWallLight);

        // En las células corticales medias/internas, dibujar ARBÚSCULOS MICORRÍCICOS ramificados
        const hasArbuscule =
          (colIdx === 1 && (rowIdx === 1 || rowIdx === 2)) ||
          (colIdx === 2 && (rowIdx === 1 || rowIdx === 2 || rowIdx === 3));

        if (hasArbuscule) {
          const acx = cx0 + Math.floor(cellW * 0.5);
          const acy = cy0 + Math.floor(cellH * 0.5);
          const pulse = 0.75 + 0.25 * Math.sin(time * 4.5 + colIdx + rowIdx);

          // Halo de intercambio de nutrientes dentro de la célula
          PixelGFX.ditherGlow(ctx, acx, acy, 2, 16 * pulse, PAL.arbusculeViolet, 0.85);
          PixelGFX.ditherGlow(ctx, acx, acy, 1, 9 * pulse, PAL.arbusculePink, 0.9);

          // Tronco hifal penetrando desde la derecha hacia el centro de la célula
          PixelGFX.line(ctx, cx0 + cellW, acy, acx, acy, PAL.hyphaBright);

          // Ramificación dicotómica del Arbúsculo (estructura arbórea fúngica intracelular)
          for (let branch = 0; branch < 8; branch++) {
            const bAngle = (branch * Math.PI * 2) / 8 + Math.sin(time * 2 + rowIdx) * 0.15;
            const bLen = 11;
            const bx1 = acx + Math.round(Math.cos(bAngle) * (bLen * 0.55));
            const by1 = acy + Math.round(Math.sin(bAngle) * (bLen * 0.55));
            PixelGFX.line(ctx, acx, acy, bx1, by1, PAL.arbusculePink);

            // Sub-ramas finas del arbúsculo
            for (let sub of [-0.45, 0.45]) {
              const bx2 = bx1 + Math.round(Math.cos(bAngle + sub) * (bLen * 0.5));
              const by2 = by1 + Math.round(Math.sin(bAngle + sub) * (bLen * 0.5));
              PixelGFX.line(ctx, bx1, by1, bx2, by2, PAL.arbusculeLight);
              PixelGFX.pset(ctx, bx2, by2, (branch % 2 === 0) ? PAL.xylemGold : PAL.hyphaBright);
            }
          }
          // Núcleo brillante del arbúsculo
          PixelGFX.circleFill(ctx, acx, acy, 2, PAL.starGoldLight);
          PixelGFX.pset(ctx, acx, acy, PAL.white);
        } else {
          // Célula vegetal normal con núcleo y vacuola
          PixelGFX.circleFill(ctx, cx0 + 10, cy0 + 12, 3, PAL.chloroplast);
          PixelGFX.pset(ctx, cx0 + 10, cy0 + 12, PAL.white);
        }
      }
    }

    // 2. Red de Hifas Extrarradiculares (Micelio del Hongo Micorrícico) en la rizosfera (x: 130..315)
    const hyphaePaths = [
      { x0: 136, y0: 42, x1: 310, y1: 18, amp: 8, freq: 0.045, speed: 2.2 },
      { x0: 136, y0: 74, x1: 315, y1: 68, amp: 10, freq: 0.05, speed: 2.5 },
      { x0: 136, y0: 108, x1: 312, y1: 122, amp: 9, freq: 0.04, speed: 2.0 },
      { x0: 136, y0: 142, x1: 305, y1: 166, amp: 7, freq: 0.05, speed: 2.8 },
      // Hifas secundarias diagonales interconectando la red (Wood Wide Web)
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

        // Tubo de la hifa fúngica (doble línea para dar grosor celular)
        PixelGFX.line(ctx, prevX, prevY + 1, curX, curY + 1, PAL.hyphaDark);
        PixelGFX.line(ctx, prevX, prevY, curX, curY, PAL.hyphaMid);

        // Septos y vesículas brillantes a lo largo de la hifa
        if (s % 9 === 0) {
          PixelGFX.pset(ctx, curX, curY, PAL.hyphaCore);
        }

        prevX = curX;
        prevY = curY;
      }

      // Paquetes de nutrientes viajando en ambas direcciones por la hifa:
      // Fósforo/Agua (Cian) hacia la raíz (t: 1 -> 0), Carbono/Glucosa (Dorado) hacia el hongo (t: 0 -> 1)
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

    // Espora Micorrícica (Glomerospora brillante) unida a la red hifal en (274, 94)
    const sporeX = 274;
    const sporeY = 94 + Math.round(Math.sin(time * 2.5) * 2);
    PixelGFX.ditherGlow(ctx, sporeX, sporeY, 4, 18, PAL.hyphaMid, 0.75);
    PixelGFX.circleFill(ctx, sporeX, sporeY, 7, PAL.hyphaDark);
    PixelGFX.circleFill(ctx, sporeX, sporeY, 5, PAL.hyphaMid);
    PixelGFX.circleFill(ctx, sporeX - 1, sporeY - 1, 3, PAL.xylemGold);
    PixelGFX.pset(ctx, sporeX - 1, sporeY - 1, PAL.white);

    // 3. Bacterias de la Rizosfera (Rizobios / Bacilos PGPR con flagelos nadando activamente)
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

      // Orientación tangente a su trayectoria de nado
      const vx = -Math.sin(ang) * b.rx * b.speed;
      const vy = Math.cos(ang * 1.4) * 1.4 * b.ry * b.speed;
      const heading = Math.atan2(vy, vx);

      // Anillo de señalización química (Quorum Sensing / Factores Nod)
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
   * Dibuja un aparato estomático completo (2 células oclusivas reniformes, ostíolo y cloroplastos)
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

    // 3. par de Células Oclusivas (Guard Cells) que se arquean al ganar turgencia
    const bowShift = Math.round(openFactor * 3 * scale);
    // Célula oclusiva izquierda y derecha
    PixelGFX.ellipseFill(ctx, cx - bowShift, cy, outerRX - 2, outerRY - 1, PAL.guardCellFill);
    PixelGFX.ellipseFill(ctx, cx + bowShift, cy, outerRX - 2, outerRY - 1, PAL.guardCellFill);

    // Volumen interno iluminado de cada célula oclusiva
    const gcOffset = Math.round(11 * scale + bowShift);
    PixelGFX.ellipseFill(ctx, cx - gcOffset, cy, Math.round(8 * scale), Math.round(13 * scale), PAL.epidermisWall);
    PixelGFX.ellipseFill(ctx, cx + gcOffset, cy, Math.round(8 * scale), Math.round(13 * scale), PAL.epidermisWall);

    // Vacuolas turgentes dentro de las células oclusivas
    PixelGFX.ellipseFill(ctx, cx - gcOffset, cy, Math.round(4 * scale), Math.round(8 * scale), PAL.epidermisMid);
    PixelGFX.ellipseFill(ctx, cx + gcOffset, cy, Math.round(4 * scale), Math.round(8 * scale), PAL.epidermisMid);

    // Línea divisoria polar (extremos superior e inferior donde se unen las 2 células oclusivas)
    PixelGFX.line(ctx, cx, cy - outerRY, cx, cy + outerRY, PAL.epidermisHighlight);

    // 4. Ostíolo (Poro Estomático central que se abre y se cierra dinámicamente)
    PixelGFX.ellipseFill(ctx, cx, cy, poreRX + 2, poreRY + 2, PAL.epidermisHighlight); // pared interna engrosada
    PixelGFX.ellipseFill(ctx, cx, cy, poreRX, poreRY, PAL.poreDark);

    // Si el poro está abierto, brillo profundo de la cámara subestomática
    if (openFactor > 0.25) {
      PixelGFX.ditherGlow(ctx, cx, cy, 1, poreRY, PAL.neonCyanDark, 0.8 * openFactor);
    }

    // 5. Cloroplastos circulando por ciclosis dentro de ambas células oclusivas
    const numChloro = 6;
    for (let side of [-1, 1]) {
      for (let c = 0; c < numChloro; c++) {
        const cAngle = (c * Math.PI * 2) / numChloro + time * 0.85 * side + seed;
        const orbitX = cx + side * gcOffset + Math.round(Math.cos(cAngle) * (5.5 * scale));
        const orbitY = cy + Math.round(Math.sin(cAngle) * (10.5 * scale));

        const chR = Math.max(1, Math.round(2.2 * scale));
        PixelGFX.circleFill(ctx, orbitX, orbitY, chR, PAL.chloroplast);
        // Punto de autofluorescencia de clorofila (rojo/magenta o blanco brillante)
        const isFlashing = ((c + Math.floor(time * 4)) % 3 === 0);
        PixelGFX.pset(ctx, orbitX, orbitY, isFlashing ? PAL.chloroplastRed : PAL.white);
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

    // 2. Mosaico de Células Epidérmicas Foliares (teselación hexagonal/ondulada)
    const hexW = 36;
    const hexH = 26;
    for (let row = -1; row < 8; row++) {
      for (let col = -1; col < 10; col++) {
        const hx = col * hexW + (row % 2) * (hexW * 0.5);
        const hy = row * hexH;

        // Dibujar paredes celulares poligonales con ligera ondulación orgánica
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

        PixelGFX.line(ctx, x0, y0, x1, y1, PAL.epidermisWall);
        PixelGFX.line(ctx, x1, y1, x2, y2, PAL.epidermisWall);
        PixelGFX.line(ctx, x2, y2, x3, y3, PAL.epidermisWall);
        PixelGFX.line(ctx, x3, y3, x4, y4, PAL.epidermisWall);
        PixelGFX.line(ctx, x4, y4, x5, y5, PAL.epidermisWall);
        PixelGFX.line(ctx, x5, y5, x0, y0, PAL.epidermisWall);

        // Cloroplastos del mesófilo subyacente brillando suavemente
        const mcx = Math.round(hx + hexW * 0.5 + Math.sin(time * 2 + row + col) * 3);
        const mcy = Math.round(hy + hexH * 0.5 + Math.cos(time * 2 + row) * 2);
        PixelGFX.circleFill(ctx, mcx, mcy, 1, PAL.rootWallMid);
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
