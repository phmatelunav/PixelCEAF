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
  subCanvasA.width = ns.CANVAS_WIDTH || 960;
  subCanvasA.height = ns.CANVAS_HEIGHT || 540;
  const ctxA = subCanvasA.getContext('2d', { willReadFrequently: true });
  ctxA.imageSmoothingEnabled = false;

  const subCanvasB = document.createElement('canvas');
  subCanvasB.width = ns.CANVAS_WIDTH || 960;
  subCanvasB.height = ns.CANVAS_HEIGHT || 540;
  const ctxB = subCanvasB.getContext('2d', { willReadFrequently: true });
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
   * Dibuja un bacilo PGPR (bacteria en forma de bastón redondeado 3D) con flagelos animados en 960x540 nativo
   */
  function drawBacterium(ctx, cx, cy, angle, bodyCol, coreCol, time, id) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const nx = -sin;
    const ny = cos;
    const ncx = Math.round(cx * 3);
    const ncy = Math.round(cy * 3);
    const halfLenN = 12;

    // 1. Flagelos bacterianos finos (1px nativo) ondulando detrás del polo posterior
    const tailBaseX = ncx - cos * (halfLenN + 6);
    const tailBaseY = ncy - sin * (halfLenN + 6);
    for (let f = -1; f <= 1; f += 2) {
      let px = Math.round(tailBaseX + nx * f * 3);
      let py = Math.round(tailBaseY + ny * f * 3);
      for (let s = 1; s <= 14; s++) {
        const whip = Math.sin(time * 14 - s * 0.48 + id * 2.1 + f * 0.6) * (4.8 + s * 0.25);
        const curX = Math.round(tailBaseX - cos * s * 2.5 + nx * (whip + f * 2.4));
        const curY = Math.round(tailBaseY - sin * s * 2.5 + ny * (whip + f * 2.4));
        PixelGFX.fineLine(ctx, px, py, curX, curY, s > 8 ? PAL.hyphaDark : PAL.neonCyanMid, 1);
        px = curX;
        py = curY;
      }
    }

    // 2. Sombra inferior / membrana externa de la cápsula bacteriana (nativo 960x540)
    for (let step = -halfLenN; step <= halfLenN; step++) {
      const bx = Math.round(ncx + cos * step + nx * 2.4);
      const by = Math.round(ncy + sin * step + ny * 2.4);
      PixelGFX.fineCircleFill(ctx, bx, by, 9, '#1a0b2e');
    }
    // 3. Cuerpo principal del bacilo (cápsula suave 3D)
    for (let step = -halfLenN; step <= halfLenN; step++) {
      const bx = Math.round(ncx + cos * step);
      const by = Math.round(ncy + sin * step);
      PixelGFX.fineCircleFill(ctx, bx, by, 8, bodyCol);
    }
    // 4. Cresta cilíndrica iluminada (sombreado 3D superior)
    for (let step = -halfLenN + 3; step <= halfLenN - 3; step++) {
      const bx = Math.round(ncx + cos * step - nx * 2.5);
      const by = Math.round(ncy + sin * step - ny * 2.5);
      PixelGFX.fineCircleFill(ctx, bx, by, 3, coreCol);
    }
    // Nucleoide / plásmido brillante
    PixelGFX.fineCircleFill(ctx, Math.round(ncx + cos * 3.5 - nx * 1.5), Math.round(ncy + sin * 3.5 - ny * 1.5), 2, PAL.white);
  }

  // ============================================================================
  // ESCENA MICRO 1: RAÍCES DE LAS PLANTAS, PELOS RADICULARES Y XILEMA/FLOEMA
  // ============================================================================
  function renderRootsScene(ctx, time) {
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, PAL.soilVoid);

    // Halos profundos de la rizosfera en el suelo
    PixelGFX.ditherGlow(ctx, 160, 85, 18, 98, PAL.soilWarm, 0.85);
    PixelGFX.ditherGlow(ctx, 160, 90, 12, 70, PAL.rootWallDark, 0.8);

    // Agregados minerales del suelo en la rizosfera (racimos orgánicos en 960x540 nativo)
    for (let m = 0; m < 18; m++) {
      const side = (m % 2 === 0) ? -1 : 1;
      const mx = (160 + side * (48 + ((m * 19) % 92))) * 3;
      const my = (12 + ((m * 29) % 156)) * 3;
      const mr = (2 + (m % 3)) * 3;
      PixelGFX.fineCircleFill(ctx, mx, my, mr, '#141024');
      PixelGFX.fineCircleFill(ctx, mx - 2, my - 2, Math.max(3, mr - 3), '#231c38');
      PixelGFX.fineCircleFill(ctx, mx - 4, my - 4, 2, '#3b3059');
    }

    // 1. Raíces laterales secundarias en segundo plano (suavizadas en 960x540)
    const lateralBranches = [
      { startY: 36, dir: -1, len: 78, angle: 0.42 },
      { startY: 54, dir: 1, len: 84, angle: 0.38 },
      { startY: 96, dir: -1, len: 68, angle: 0.48 },
      { startY: 112, dir: 1, len: 64, angle: 0.45 }
    ];

    for (let b = 0; b < lateralBranches.length; b++) {
      const br = lateralBranches[b];
      const baseX = (160 + br.dir * 16) * 3;
      const baseY = br.startY * 3;
      const stepsN = br.len * 3;
      for (let s = 0; s < stepsN; s++) {
        const frac = s / stepsN;
        const curve = Math.sin(frac * 2.5 + time * 1.5 + b) * 9;
        const lx = Math.round(baseX + br.dir * s * Math.cos(br.angle));
        const ly = Math.round(baseY + s * Math.sin(br.angle) + curve);
        const radiusN = Math.max(2, Math.round((1 - frac * 0.78) * 14));
        PixelGFX.fineCircleFill(ctx, lx, ly, radiusN, PAL.rootWallDark);
        PixelGFX.fineCircleFill(ctx, lx, ly - 2, Math.max(2, radiusN - 3), PAL.rootWallMid);
        if (s % 6 === 0 && radiusN >= 5) {
          PixelGFX.fineRect(ctx, lx - 1, ly - 3, 2, 2, PAL.rootWallLight);
        }
        if (Math.abs(((s / 3 - time * 24) % 22)) < 1.8) {
          PixelGFX.fineCircleFill(ctx, lx, ly, 2, PAL.xylemGold);
        }
      }
    }

    // 2. Pelos Radiculares (Root Hairs) extendiéndose con curvatura orgánica fina en 960x540
    for (let row = 14; row < 142; row += 9) {
      for (let side of [-1, 1]) {
        const taper = row > 115 ? Math.max(0.2, 1 - (row - 115) / 48) : 1.0;
        const rootHalfW = Math.round(25 * taper);
        const anchorX = (160 + side * rootHalfW) * 3;
        const anchorY = row * 3;
        const hairLenN = Math.round((22 + ((row * 7) % 18)) * taper * 3);

        let prevX = anchorX;
        let prevY = anchorY;
        for (let h = 3; h <= hairLenN; h += 4) {
          const hFrac = h / Math.max(1, hairLenN);
          const wave = Math.sin(time * 2.8 + row * 0.15 + hFrac * 2.5) * (hFrac * 15);
          const hx = Math.round(anchorX + side * h + (side * wave * 0.3));
          const hy = Math.round(anchorY + wave + hFrac * 12);
          const col = hFrac > 0.75 ? PAL.neonCyan : PAL.rootWallLight;
          PixelGFX.fineLine(ctx, prevX, prevY + 2, hx, hy + 2, PAL.rootWallDark, 2);
          PixelGFX.fineLine(ctx, prevX, prevY, hx, hy, col, 2);
          prevX = hx;
          prevY = hy;
        }
        PixelGFX.fineCircleFill(ctx, prevX, prevY, 2, PAL.xylemLight);
      }
    }

    // 3. Cuerpo Principal de la Raíz Primaria en resolución nativa (scanlines de 1px nativo)
    const rootTopYN = 0;
    const rootTipYN = 162 * 3;

    // Vaina de mucílago translúcido alrededor del ápice radicular (caliptra)
    PixelGFX.ditherGlow(ctx, 160, 146, 12, 32, PAL.rootWallMid, 0.55);

    // Base oscura del cilindro radicular con borde epidérmico suave por scanline nativa
    for (let yn = rootTopYN; yn <= rootTipYN; yn++) {
      let taper = 1.0;
      if (yn > 112 * 3) {
        const t = (yn - 112 * 3) / (rootTipYN - 112 * 3);
        taper = Math.sqrt(Math.max(0, 1 - t * t));
      }
      const halfWN = Math.round(75 * taper);
      if (halfWN <= 0) continue;
      PixelGFX.fineRect(ctx, 480 - halfWN, yn, halfWN * 2 + 1, 1, PAL.rootCellFill);
      // Contorno epidérmico exterior brillante de 2px nativos
      PixelGFX.fineRect(ctx, 480 - halfWN, yn, 2, 1, PAL.epidermisHighlight);
      PixelGFX.fineRect(ctx, 480 + halfWN - 1, yn, 2, 1, PAL.epidermisHighlight);
      PixelGFX.fineRect(ctx, 480 - halfWN + 2, yn, 2, 1, PAL.rootWallMid);
      PixelGFX.fineRect(ctx, 480 + halfWN - 3, yn, 2, 1, PAL.rootWallMid);
    }

    // Células individuales biseladas del córtex y epidermis
    let curY = 2;
    while (curY < 146) {
      const cellH = curY > 116 ? 7 : 11;
      const midY = curY + Math.floor(cellH * 0.5);
      let taper = 1.0;
      if (midY > 112) {
        const t = (midY - 112) / (162 - 112);
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
            // Núcleo celular con nucléolo brillante en 960x540
            const nx = Math.round((x0 + cw * 0.5) * 3);
            const ny = Math.round((curY + (cellH - 1) * 0.5) * 3);
            PixelGFX.fineCircleFill(ctx, nx, ny, 4, PAL.chloroplast);
            PixelGFX.fineCircleFill(ctx, nx - 1, ny - 1, 1, PAL.white);
          }
        }
      }
      curY += cellH;
    }

    // Cilindro Vascular Central (Estela: Endodermis, Floema y Xilema con hélices diagonales de lignina)
    for (let yn = rootTopYN; yn < 146 * 3; yn++) {
      let taper = 1.0;
      if (yn > 112 * 3) {
        const t = (yn - 112 * 3) / (rootTipYN - 112 * 3);
        taper = Math.sqrt(Math.max(0, 1 - t * t));
      }
      const steleHalfWN = Math.max(6, Math.round(18 * taper));
      PixelGFX.fineRect(ctx, 480 - steleHalfWN, yn, steleHalfWN * 2 + 1, 1, '#143828');
      // Endodermis y Banda de Caspary
      const endodermCol = (Math.floor(yn / 3) % 4 === 0) ? PAL.xylemGold : PAL.neonEmerald;
      PixelGFX.fineRect(ctx, 480 - steleHalfWN, yn, 2, 1, endodermCol);
      PixelGFX.fineRect(ctx, 480 + steleHalfWN - 1, yn, 2, 1, endodermCol);

      // Tubos cribosos del floema (naranja cálido con placas cribosas finas)
      const phloemCol = (yn % 16 < 2) ? PAL.xylemLight : PAL.phloemOrange;
      PixelGFX.fineRect(ctx, 480 - 10, yn, 3, 1, phloemCol);
      PixelGFX.fineRect(ctx, 480 + 8, yn, 3, 1, phloemCol);

      // Vaso del Xilema central con engrosamientos helicoidales de lignina en alta definición
      PixelGFX.fineRect(ctx, 480 - 4, yn, 9, 1, '#9c6800');
      PixelGFX.fineRect(ctx, 480 - 2, yn, 5, 1, PAL.xylemGold);
      const spiralX = Math.round(Math.sin(yn * 0.35) * 3.5);
      PixelGFX.fineRect(ctx, 480 + spiralX - 1, yn, 3, 1, PAL.xylemLight);
      PixelGFX.finePset(ctx, 480 + spiralX, yn, PAL.white);
    }

    // 5. Pulsos luminosos de transporte vascular (Agua/Minerales subiendo, Fotosintatos bajando)
    for (let p = 0; p < 8; p++) {
      const upYN = Math.round((145 - ((time * 38 + p * 19) % 145)) * 3);
      PixelGFX.fineCircleFill(ctx, 480 - 9, upYN, 3, PAL.neonCyanLight);
      PixelGFX.fineCircleFill(ctx, 480 + 9, upYN, 3, PAL.neonCyan);

      const downYN = Math.round(((time * 32 + p * 18) % 148) * 3);
      PixelGFX.fineCircleFill(ctx, 480, downYN, 5, PAL.xylemGold);
      PixelGFX.fineCircleFill(ctx, 480, downYN, 2, PAL.white);
    }

    // Cofia / Caliptra en el ápice radicular (y = 146..162) con células columelares y estatolitos
    for (let cy = 146; cy <= 160; cy += 3) {
      const span = Math.max(2, Math.round((162 - cy) * 0.75));
      PixelGFX.fineLine(ctx, (160 - span) * 3, cy * 3, (160 + span) * 3, cy * 3, PAL.rootWallLight, 2);
      PixelGFX.fineCircleFill(ctx, 480, (cy + 1) * 3, 2, PAL.xylemLight);
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
        PixelGFX.fineCircleFill(ctx, Math.round(px * 3), Math.round(py * 3), 2, col);
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
          const acxN = acx * 3;
          const acyN = acy * 3;
          const pulse = 0.75 + 0.25 * Math.sin(time * 4.5 + colIdx + rowIdx);

          // Membrana periarbuscular y halo de intercambio simbiótico
          PixelGFX.ditherGlow(ctx, acx, acy, 2, 16 * pulse, PAL.arbusculeViolet, 0.85);
          PixelGFX.ditherGlow(ctx, acx, acy, 1, 9 * pulse, PAL.arbusculePink, 0.9);
          PixelGFX.fineCircleOutline(ctx, acxN, acyN, 39, '#1f5c48', 2);

          // Tronco hifal penetrando con apresorio brillante desde la derecha (960x540 nativo)
          const trunkX0 = (cx0 + cellW) * 3;
          PixelGFX.fineLine(ctx, trunkX0, acyN + 2, acxN, acyN + 2, PAL.hyphaDark, 2);
          PixelGFX.fineLine(ctx, trunkX0, acyN, acxN, acyN, PAL.hyphaBright, 2);
          PixelGFX.fineCircleFill(ctx, trunkX0 - 6, acyN, 4, PAL.hyphaCore);

          // Ramificación dicotómica fractal fina del Arbúsculo (3 niveles en 960x540 nativo)
          for (let branch = 0; branch < 8; branch++) {
            const bAngle = (branch * Math.PI * 2) / 8 + Math.sin(time * 2 + rowIdx) * 0.15;
            const bLenN = 33;
            const bx1 = acxN + Math.round(Math.cos(bAngle) * (bLenN * 0.52));
            const by1 = acyN + Math.round(Math.sin(bAngle) * (bLenN * 0.52));
            PixelGFX.fineLine(ctx, acxN, acyN, bx1, by1, PAL.arbusculePink, 2);

            for (let sub of [-0.46, 0.46]) {
              const bx2 = bx1 + Math.round(Math.cos(bAngle + sub) * (bLenN * 0.42));
              const by2 = by1 + Math.round(Math.sin(bAngle + sub) * (bLenN * 0.42));
              PixelGFX.fineLine(ctx, bx1, by1, bx2, by2, PAL.arbusculeLight, 2);
              for (let twig of [-0.38, 0.38]) {
                const bx3 = bx2 + Math.round(Math.cos(bAngle + sub + twig) * 8);
                const by3 = by2 + Math.round(Math.sin(bAngle + sub + twig) * 8);
                PixelGFX.fineLine(ctx, bx2, by2, bx3, by3, (branch % 2 === 0) ? PAL.xylemGold : PAL.hyphaBright, 1);
                PixelGFX.finePset(ctx, bx3, by3, PAL.white);
              }
            }
          }
          // Núcleo brillante del arbúsculo
          PixelGFX.fineCircleFill(ctx, acxN, acyN, 6, PAL.starGoldLight);
          PixelGFX.fineCircleFill(ctx, acxN, acyN, 2, PAL.white);
        } else {
          // Célula vegetal normal con gran vacuola central tonopástica, citoplasma y núcleo detallado
          PixelGFX.bevelRect(ctx, cx0 + 6, cy0 + 14, cellW - 12, cellH - 20, '#0d3629', '#195e47', '#072119', '#144a38');
          PixelGFX.fineCircleFill(ctx, (cx0 + 11) * 3, (cy0 + 9) * 3, 8, PAL.chloroplast);
          PixelGFX.fineCircleFill(ctx, (cx0 + 10) * 3, (cy0 + 8) * 3, 3, PAL.white);
          // Gránulos citoplasmáticos en ciclosis
          const gx = Math.round((cx0 + 24 + Math.cos(time * 2 + rowIdx) * 3) * 3);
          const gy = Math.round((cy0 + 10 + Math.sin(time * 2 + colIdx) * 2) * 3);
          PixelGFX.fineCircleFill(ctx, gx, gy, 2, PAL.epidermisHighlight);
        }
      }
    }

    // 2. Red de Hifas Extrarradiculares (Micelio del Hongo Micorrícico) en 960x540 nativo
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
      const steps = 90;
      let prevX = Math.round(hp.x0 * 3);
      let prevY = Math.round((hp.y0 + Math.sin(hp.x0 * hp.freq + time * 1.5 + h) * hp.amp) * 3);

      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const baseX = MathUtil.lerp(hp.x0, hp.x1, t);
        const baseY = MathUtil.lerp(hp.y0, hp.y1, t);
        const wave = Math.sin(baseX * hp.freq + time * 1.5 + h) * hp.amp;
        const curX = Math.round(baseX * 3);
        const curY = Math.round((baseY + wave) * 3);

        PixelGFX.fineLine(ctx, prevX, prevY + 2, curX, curY + 2, PAL.hyphaDark, 2);
        PixelGFX.fineLine(ctx, prevX, prevY, curX, curY, PAL.hyphaMid, 2);

        if (s % 15 === 0) {
          PixelGFX.fineCircleFill(ctx, curX, curY, 2, PAL.hyphaCore);
        }

        prevX = curX;
        prevY = curY;
      }

      for (let pkt = 0; pkt < 3; pkt++) {
        const tPhos = 1.0 - ((time * 0.32 + pkt * 0.33 + h * 0.17) % 1.0);
        const pxP = MathUtil.lerp(hp.x0, hp.x1, tPhos);
        const pyP = MathUtil.lerp(hp.y0, hp.y1, tPhos) + Math.sin(pxP * hp.freq + time * 1.5 + h) * hp.amp;
        PixelGFX.fineCircleFill(ctx, Math.round(pxP * 3), Math.round(pyP * 3), 4, PAL.hyphaBright);
        PixelGFX.fineCircleFill(ctx, Math.round(pxP * 3), Math.round(pyP * 3), 2, PAL.white);

        const tCarb = (time * 0.26 + pkt * 0.33 + h * 0.21) % 1.0;
        const pxC = MathUtil.lerp(hp.x0, hp.x1, tCarb);
        const pyC = MathUtil.lerp(hp.y0, hp.y1, tCarb) + Math.sin(pxC * hp.freq + time * 1.5 + h) * hp.amp;
        PixelGFX.fineCircleFill(ctx, Math.round(pxC * 3), Math.round(pyC * 3), 3, PAL.xylemGold);
      }
    }

    // Espora Micorrícica (Glomerospora multicapa brillante) unida a la red hifal en (274, 94)
    const sporeX = 274;
    const sporeY = 94 + Math.sin(time * 2.5) * 2;
    const sporeXN = Math.round(sporeX * 3);
    const sporeYN = Math.round(sporeY * 3);
    PixelGFX.ditherGlow(ctx, sporeX, sporeY, 4, 18, PAL.hyphaMid, 0.75);
    PixelGFX.fineCircleFill(ctx, sporeXN, sporeYN, 24, '#062b4c');
    PixelGFX.fineCircleFill(ctx, sporeXN, sporeYN, 18, PAL.hyphaDark);
    PixelGFX.fineCircleFill(ctx, sporeXN - 3, sporeYN - 3, 12, PAL.hyphaMid);
    PixelGFX.fineCircleFill(ctx, sporeXN - 4, sporeYN - 4, 6, PAL.xylemGold);
    PixelGFX.fineCircleFill(ctx, sporeXN - 6, sporeYN - 6, 2, PAL.white);

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
        PixelGFX.fineCircleOutline(ctx, Math.round(bx * 3), Math.round(by * 3), signalR * 3, PAL.hyphaDark, 1);
      }

      drawBacterium(ctx, bx, by, heading, b.col, b.core, time, i);
    }
  }

  // ============================================================================
  // ESCENA MICRO 3: ESTOMAS DE LAS HOJAS, CLOROPLASTOS E INTERCAMBIO GASEOSO
  // ============================================================================
  /**
   * Dibuja un aparato estomático completo con micelación radial de celulosa y grana tilacoidal en 960x540
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

    // Microfibrillas de celulosa finas (líneas radiales de 1px nativo características de las células oclusivas)
    for (let side of [-1, 1]) {
      for (let m = -4; m <= 4; m++) {
        const ang = m * 0.24;
        const xIn = Math.round((cx + side * (poreRX + 2)) * 3);
        const yIn = Math.round((cy + Math.sin(ang) * poreRY * 0.75) * 3);
        const xOut = Math.round((cx + side * (outerRX - 3)) * 3);
        const yOut = Math.round((cy + Math.sin(ang) * outerRY * 0.85) * 3);
        PixelGFX.fineLine(ctx, xIn, yIn, xOut, yOut, PAL.guardCellFill, 1);
      }
    }

    // Vacuolas turgentes dentro de las células oclusivas
    PixelGFX.ellipseFill(ctx, cx - gcOffset, cy, Math.round(4 * scale), Math.round(8 * scale), PAL.epidermisMid);
    PixelGFX.ellipseFill(ctx, cx + gcOffset, cy, Math.round(4 * scale), Math.round(8 * scale), PAL.epidermisMid);

    // Línea divisoria polar con refuerzo terminal
    PixelGFX.fineLine(ctx, cx * 3, (cy - outerRY) * 3, cx * 3, (cy + outerRY) * 3, PAL.epidermisHighlight, 2);

    // 4. Ostíolo (Poro Estomático central con pared ventral engrosada)
    PixelGFX.ellipseFill(ctx, cx, cy, poreRX + 2, poreRY + 2, PAL.epidermisHighlight);
    PixelGFX.ellipseFill(ctx, cx, cy, poreRX + 1, poreRY + 1, PAL.epidermisWall);
    PixelGFX.ellipseFill(ctx, cx, cy, poreRX, poreRY, PAL.poreDark);

    if (openFactor > 0.25) {
      PixelGFX.ditherGlow(ctx, cx, cy, 1, poreRY, PAL.neonCyanDark, 0.8 * openFactor);
    }

    // 5. Cloroplastos con pilas de tilacoides (grana) circulando por ciclosis en 960x540 nativo
    const numChloro = 6;
    for (let side of [-1, 1]) {
      for (let c = 0; c < numChloro; c++) {
        const cAngle = (c * Math.PI * 2) / numChloro + time * 0.85 * side + seed;
        const orbitXN = Math.round((cx + side * gcOffset + Math.cos(cAngle) * (5.5 * scale)) * 3);
        const orbitYN = Math.round((cy + Math.sin(cAngle) * (10.5 * scale)) * 3);

        const chRN = Math.max(4, Math.round(7.5 * scale));
        PixelGFX.fineCircleFill(ctx, orbitXN, orbitYN, chRN, '#1b7a50');
        PixelGFX.fineCircleFill(ctx, orbitXN, orbitYN, Math.max(2, chRN - 2), PAL.chloroplast);
        // Pilas de grana tilacoidal internas (discos apilados finos) y autofluorescencia de clorofila
        if (chRN >= 6) {
          PixelGFX.fineRect(ctx, orbitXN - 3, orbitYN - 2, 7, 1, '#14593d');
          PixelGFX.fineRect(ctx, orbitXN - 3, orbitYN, 7, 1, '#14593d');
          PixelGFX.fineRect(ctx, orbitXN - 2, orbitYN + 2, 5, 1, '#14593d');
        }
        const isFlashing = ((c + Math.floor(time * 4)) % 3 === 0);
        PixelGFX.fineCircleFill(ctx, orbitXN - 1, orbitYN - 2, 2, isFlashing ? PAL.chloroplastRed : PAL.white);
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
          PixelGFX.fineCircleFill(ctx, Math.round(gx * 3), Math.round(gy * 3), 2, col);
        }
      }
    }
  }

  function renderStomataScene(ctx, time) {
    // 1. Fondo del mesófilo foliar y tejido epidérmico
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, PAL.leafBg);
    PixelGFX.ditherGlow(ctx, 160, 90, 25, 130, PAL.epidermisDark, 0.9);

    // 2. Mosaico de Células Epidérmicas Foliares con doble pared fina (2px nativo) y relieve cuticular
    const hexW = 36;
    const hexH = 26;
    for (let row = -1; row < 8; row++) {
      for (let col = -1; col < 10; col++) {
        const hx = col * hexW + (row % 2) * (hexW * 0.5);
        const hy = row * hexH;

        const x0 = Math.round(hx * 3);
        const y0 = Math.round((hy + 6) * 3);
        const x1 = Math.round((hx + hexW * 0.5) * 3);
        const y1 = Math.round(hy * 3);
        const x2 = Math.round((hx + hexW) * 3);
        const y2 = Math.round((hy + 6) * 3);
        const x3 = Math.round((hx + hexW) * 3);
        const y3 = Math.round((hy + hexH - 4) * 3);
        const x4 = Math.round((hx + hexW * 0.5) * 3);
        const y4 = Math.round((hy + hexH + 2) * 3);
        const x5 = Math.round(hx * 3);
        const y5 = Math.round((hy + hexH - 4) * 3);

        // Sombra de lámina media
        PixelGFX.fineLine(ctx, x0, y0 + 2, x1, y1 + 2, PAL.epidermisMid, 2);
        PixelGFX.fineLine(ctx, x1, y1 + 2, x2, y2 + 2, PAL.epidermisMid, 2);
        // Pared celular epidérmica primaria
        PixelGFX.fineLine(ctx, x0, y0, x1, y1, PAL.epidermisWall, 2);
        PixelGFX.fineLine(ctx, x1, y1, x2, y2, PAL.epidermisWall, 2);
        PixelGFX.fineLine(ctx, x2, y2, x3, y3, PAL.epidermisWall, 2);
        PixelGFX.fineLine(ctx, x3, y3, x4, y4, PAL.epidermisWall, 2);
        PixelGFX.fineLine(ctx, x4, y4, x5, y5, PAL.epidermisWall, 2);
        PixelGFX.fineLine(ctx, x5, y5, x0, y0, PAL.epidermisWall, 2);
        // Brillo en los vértices tricelulares
        PixelGFX.fineCircleFill(ctx, x1, y1, 2, PAL.epidermisHighlight);

        // Cloroplastos del parénquima en empalizada subyacente
        const mcx = Math.round((hx + hexW * 0.5 + Math.sin(time * 2 + row + col) * 3) * 3);
        const mcy = Math.round((hy + hexH * 0.5 + Math.cos(time * 2 + row) * 2) * 3);
        PixelGFX.fineCircleFill(ctx, mcx, mcy, 5, PAL.epidermisMid);
        PixelGFX.fineCircleFill(ctx, mcx - 1, mcy - 1, 2, PAL.rootWallLight);
      }
    }

    // 3. Nervaduras foliares (haces vasculares de la hoja) pulsando con savia
    PixelGFX.fineLine(ctx, 0, 148 * 3, 960, 24 * 3, PAL.epidermisHighlight, 2);
    PixelGFX.fineLine(ctx, 0, 149 * 3, 960, 25 * 3, PAL.epidermisWall, 2);

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
      PixelGFX.fineCircleFill(ctx, Math.round(hx * 3), Math.round(hy * 3), Math.round(heroR * 0.45 * 3), PAL.starGoldLight);
      PixelGFX.fineCircleFill(ctx, Math.round(hx * 3), Math.round(hy * 3), Math.round(heroR * 0.25 * 3), PAL.white);
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

    PixelGFX.ditherReveal(ctx, canvasTo, (px, py) => {
      const dx = px - cx;
      const dy = py - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      return MathUtil.clamp((waveR - d + 18) / 36, 0, 1);
    });

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
