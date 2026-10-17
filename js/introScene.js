/**
 * introScene.js
 * Escena Inicial (0.0s .. 6.5s): Sede Principal y Campo Experimental CEAF.
 * Recreación Pixel-Art de alta fidelidad de la fotografía "logos/Building.png":
 *   - Edificio corporativo blanco de CEAF (ala izquierda acristalada con cubo blanco volado,
 *     torre central con ventanal superior y acceso de madera, ala derecha con puente vidriado).
 *   - Pequeñas águilas chilenas (aguiluchos / peucos) planeando y aleteando en el cielo azul.
 *   - Hileras en perspectiva de plantas frutales experimentales en macetas blancas/grises con malla y musgo.
 *   - Simulación de ráfagas de viento que mecen el follaje de cada planta en onda progresiva.
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  const { WIDTH, HEIGHT, PAL, PixelGFX, MathUtil } = ns;

  // Duración de la escena inicial del edificio CEAF antes de entrar al Laboratorio
  ns.INTRO_DURATION = 6.5;
  ns.LOOP_DURATION = 66.5;

  // ==========================================================================
  // 1. CIELO DE O'HIGGINS Y PEQUEÑAS ÁGUILAS CHILENAS EN VUELO (NATIVO 960x540)
  // ==========================================================================
  function drawSkyAndChileanEagles(ctx, time) {
    // Gradientes atmosféricos tramados en Bayer 4x4 nativo (1x1px)
    PixelGFX.ditherGradientV(ctx, 0, 0, WIDTH, 34, '#5b98e3', '#6faaf0');
    PixelGFX.ditherGradientV(ctx, 0, 34, WIDTH, 34, '#6faaf0', '#86bdf7');
    PixelGFX.ditherGradientV(ctx, 0, 68, WIDTH, 32, '#86bdf7', '#a2cffb');
    PixelGFX.ditherGradientV(ctx, 0, 100, WIDTH, 22, '#a2cffb', '#badcfd');

    // Pequeñas Águilas Chilenas (Aguiluchos / Peucos de CEAF) planeando en corrientes térmicas
    const eagles = [
      // Águila 1: Planeando alto a la izquierda (como en la foto original)
      { x0: 18, y0: 25, vx: 6.5, vy: -0.6, ampY: 2.5, freq: 1.8, flapSpeed: 5.2, scale: 1, glideRatio: 0.65 },
      // Águila 2: Más abajo a la izquierda, siguiendo a la primera en térmica
      { x0: 10, y0: 42, vx: 8.2, vy: -1.1, ampY: 3.0, freq: 1.5, flapSpeed: 6.0, scale: 1, glideRatio: 0.55 },
      // Águila 3: Cruzando sobre la torre central del edificio CEAF
      { x0: 112, y0: 36, vx: 7.0, vy: -0.4, ampY: 2.0, freq: 2.1, flapSpeed: 5.6, scale: 1, glideRatio: 0.72 },
      // Águila 4: Planeando a mayor altitud hacia la derecha
      { x0: 210, y0: 22, vx: 5.4, vy: 0.3, ampY: 1.8, freq: 1.6, flapSpeed: 4.8, scale: 0, glideRatio: 0.78 }
    ];

    for (let i = 0; i < eagles.length; i++) {
      const e = eagles[i];
      const ex = e.x0 + time * e.vx + Math.sin(time * 0.9 + i * 2) * 4;
      const ey = e.y0 + time * e.vy + Math.sin(time * e.freq + i * 1.7) * e.ampY;

      const cycle = (time * 0.7 + i * 0.31) % 1.0;
      let wingState = 0; // 0 = planeo diedro en V, 1 = alas arriba, -1 = alas abajo
      if (cycle > e.glideRatio) {
        const flap = Math.sin(time * e.flapSpeed * Math.PI * 2);
        wingState = flap > 0.25 ? 1 : (flap < -0.25 ? -1 : 0);
      }

      drawChileanEagle(ctx, ex, ey, wingState, e.scale);
    }
  }

  /**
   * Dibuja una pequeña águila chilena (peuco / aguilucho) en Pixel-Art nativo 960x540
   * con envergadura detallada (~24x12 px nativos), hombros rojizos, pecho claro, cola ahorquillada y rémiges primarias.
   */
  function drawChileanEagle(ctx, cx, cy, wingState, isLarge) {
    const S = ns.SCALE || 3;
    const fcx = Math.round(cx * S);
    const fcy = Math.round(cy * S);
    const darkWing = '#1e222d';
    const brownBack = '#5c4028';
    const rufousShoulder = '#9e5428';
    const lightBelly = '#f1f5f9';
    const beakGold = '#f59e0b';

    if (!isLarge) {
      // Silueta lejana en alta definición (14x7 px nativos)
      const wy = wingState === 1 ? -3 : (wingState === -1 ? 3 : -1);
      PixelGFX.fineLine(ctx, fcx - 6, fcy + wy, fcx, fcy, brownBack, 2);
      PixelGFX.fineLine(ctx, fcx, fcy, fcx + 6, fcy + wy, brownBack, 2);
      PixelGFX.fineRect(ctx, fcx - 7, fcy + wy - 1, 2, 2, darkWing);
      PixelGFX.fineRect(ctx, fcx + 6, fcy + wy - 1, 2, 2, darkWing);
      PixelGFX.fineRect(ctx, fcx - 1, fcy - 1, 3, 2, lightBelly);
      return;
    }

    // Cola abanicada con banda terminal oscura
    PixelGFX.fineLine(ctx, fcx - 1, fcy + 1, fcx - 5, fcy + 4, brownBack, 2);
    PixelGFX.fineLine(ctx, fcx - 1, fcy + 1, fcx - 3, fcy + 5, darkWing, 2);
    // Cuerpo fusiforme, pecho blanco iluminado y cabeza con pico ganchudo
    PixelGFX.fineRect(ctx, fcx - 2, fcy - 1, 5, 3, brownBack);
    PixelGFX.fineRect(ctx, fcx, fcy, 4, 2, lightBelly);
    PixelGFX.fineRect(ctx, fcx + 3, fcy - 1, 2, 2, brownBack);
    PixelGFX.finePset(ctx, fcx + 5, fcy, beakGold);

    const tipDY = wingState === 0 ? -5 : (wingState === 1 ? -9 : 5);
    const midDY = wingState === 0 ? -2 : (wingState === 1 ? -5 : 2);

    // Ala izquierda (posterior) con hombro rufo y 3 plumas primarias digitadas
    PixelGFX.fineLine(ctx, fcx - 1, fcy, fcx - 6, fcy + midDY, rufousShoulder, 2);
    PixelGFX.fineLine(ctx, fcx - 6, fcy + midDY, fcx - 11, fcy + tipDY, brownBack, 2);
    PixelGFX.fineLine(ctx, fcx - 9, fcy + tipDY + 1, fcx - 13, fcy + tipDY - 1, darkWing, 1);
    PixelGFX.fineLine(ctx, fcx - 9, fcy + tipDY + 1, fcx - 13, fcy + tipDY + 1, darkWing, 1);
    PixelGFX.fineLine(ctx, fcx - 8, fcy + tipDY + 2, fcx - 12, fcy + tipDY + 3, darkWing, 1);

    // Ala derecha (anterior)
    PixelGFX.fineLine(ctx, fcx + 1, fcy, fcx + 6, fcy + midDY, rufousShoulder, 2);
    PixelGFX.fineLine(ctx, fcx + 6, fcy + midDY, fcx + 11, fcy + tipDY, brownBack, 2);
    PixelGFX.fineLine(ctx, fcx + 9, fcy + tipDY + 1, fcx + 13, fcy + tipDY - 1, darkWing, 1);
    PixelGFX.fineLine(ctx, fcx + 9, fcy + tipDY + 1, fcx + 13, fcy + tipDY + 1, darkWing, 1);
    PixelGFX.fineLine(ctx, fcx + 8, fcy + tipDY + 2, fcx + 12, fcy + tipDY + 3, darkWing, 1);
  }

  // ==========================================================================
  // 2. ARBOLEDA TRASERA IZQUIERDA (EUCALIPTOS Y ÁLAMOS EN 960x540 NATIVO)
  // ==========================================================================
  function drawLacyTreeCrown(ctx, cx, cy, rx, ry, sway, seed) {
    const S = ns.SCALE || 3;
    const fcx = Math.round(cx * S);
    const fcy = Math.round(cy * S);
    const frx = Math.round(rx * S);
    const fry = Math.round(ry * S);
    const cDark = '#182b19';
    const cDeep = '#243d25';
    const cMid  = '#335434';
    const cLit  = '#466e46';
    const cSun  = '#5f8d5e';

    // Iteramos en bloques finos de 2x2 píxeles nativos para lograr follaje de eucalipto delicado y aireado
    for (let fdy = -fry; fdy <= fry; fdy += 2) {
      const fpy = fcy + fdy;
      if (fpy < 0 || fpy >= HEIGHT * S) continue;
      const vFrac = fdy / Math.max(1, fry);
      const rowSway = Math.round(sway * S * Math.max(0, 0.6 - vFrac * 0.6));
      const maxSpan = Math.round(frx * Math.sqrt(Math.max(0, 1 - vFrac * vFrac * 0.85)));

      for (let fdx = -maxSpan; fdx <= maxSpan; fdx += 2) {
        const fpx = fcx + fdx + rowSway;
        if (fpx < 0 || fpx >= WIDTH * S) continue;
        const h = Math.floor(MathUtil.hash(fdx * 7.3 + fdy * 19.1 + seed * 7.1) * 16);
        const edgeDist = Math.abs(fdx) / Math.max(1, maxSpan);
        if (edgeDist > 0.74 && h < 8) continue;
        if (h === 0 || (edgeDist > 0.48 && h === 3)) continue;

        let col = cMid;
        if (vFrac > 0.38 || fdx < -maxSpan * 0.35 || h < 4) {
          col = cDark;
        } else if (h < 9) {
          col = cDeep;
        } else if (fdx > maxSpan * 0.2 && vFrac < -0.15 && h >= 14) {
          col = cSun;
        } else if (fdx > 0 && vFrac < 0.12 && h > 10) {
          col = cLit;
        }
        PixelGFX.fineRect(ctx, fpx, fpy, 2, 2, col);
      }
    }
  }

  function drawBackgroundTrees(ctx, time) {
    const sway1 = Math.sin(time * 2.2) * 1.4;
    const sway2 = Math.sin(time * 2.5 + 1.2) * 1.4;

    // Árbol alto 1 (x = 16..28, y = 60..115, eucalipto esbelto tras el ala izquierda)
    PixelGFX.line(ctx, 21, 115, 22 + sway1 * 0.6, 65, '#26231f');
    PixelGFX.line(ctx, 21, 84, 17 + sway1, 74, '#26231f');
    PixelGFX.line(ctx, 22, 79, 26 + sway1, 70, '#26231f');
    drawLacyTreeCrown(ctx, 21, 68, 5, 10, sway1, 11);
    drawLacyTreeCrown(ctx, 19, 80, 7, 11, sway1 * 0.7, 23);

    // Árbol alto 2 (x = 34..47, y = 58..115, segundo eucalipto alto como en Building.png)
    PixelGFX.line(ctx, 40, 115, 41 + sway2 * 0.6, 61, '#26231f');
    PixelGFX.line(ctx, 40, 78, 36 + sway2, 68, '#26231f');
    PixelGFX.line(ctx, 41, 75, 45 + sway2, 66, '#26231f');
    drawLacyTreeCrown(ctx, 41, 64, 5, 9, sway2, 37);
    drawLacyTreeCrown(ctx, 39, 75, 7, 10, sway2 * 0.7, 49);

    // Arboleda densa en el borde izquierdo (x = 0..18, y = 74..118)
    drawLacyTreeCrown(ctx, 6, 84, 8, 13, sway1 * 0.8, 61);
    drawLacyTreeCrown(ctx, 11, 97, 10, 13, sway2 * 0.5, 73);
    drawLacyTreeCrown(ctx, 4, 108, 9, 10, sway1 * 0.3, 89);

    // Árboles frutales en el extremo derecho del horizonte (x = 301..320, y = 90..118)
    drawLacyTreeCrown(ctx, 311, 102, 10, 12, sway1 * 0.6, 97);
    drawLacyTreeCrown(ctx, 317, 96, 7, 11, sway2 * 0.8, 109);
  }

  // ==========================================================================
  // 3. EDIFICIO CORPORATIVO CEAF ( ARQUITECTURA FIEL A Building.png )
  // ==========================================================================
  function drawCEAFBuilding(ctx, time) {
    const wallWhite = '#f5f8fc';
    const wallBright = '#ffffff';
    const wallShade = '#dce5f0';
    const wallShadow = '#bccbe0';
    const wallDeepShadow = '#94a7c2';
    const mullionDark = '#475569';
    const mullionMid = '#64748b';

    // ------------------------------------------------------------------------
    // A) ALA IZQUIERDA (x = 16 .. 129, y = 73 .. 118)
    // ------------------------------------------------------------------------
    // Cuerpo superior izquierdo (x = 25..46, y = 75..96)
    PixelGFX.rect(ctx, 25, 75, 22, 43, wallWhite);
    PixelGFX.line(ctx, 25, 75, 46, 75, wallBright);
    // Ventana apaisada superior izquierda (x = 25..44, y = 86..91)
    PixelGFX.rect(ctx, 25, 86, 19, 5, '#5b7a96');
    PixelGFX.rect(ctx, 26, 87, 17, 2, '#8cb0cf');
    for (let vx = 29; vx <= 41; vx += 4) {
      PixelGFX.line(ctx, vx, 86, vx, 90, mullionDark);
    }

    // Pórtico blanco saliente inferior izquierdo (x = 16..38, y = 95..118)
    PixelGFX.rect(ctx, 16, 95, 22, 23, wallShade);
    PixelGFX.rect(ctx, 16, 95, 20, 3, wallBright);
    PixelGFX.rect(ctx, 16, 95, 5, 23, wallWhite); // Pilar izquierdo
    PixelGFX.rect(ctx, 29, 98, 3, 20, wallWhite); // Pilar central
    PixelGFX.rect(ctx, 21, 98, 8, 20, '#2a362e'); // Sombra interior del pórtico
    PixelGFX.rect(ctx, 32, 98, 5, 20, '#3b4a40');

    // Volumen principal acristalado del Ala Izquierda (x = 46..129, y = 73..118)
    PixelGFX.rect(ctx, 46, 73, 83, 45, wallWhite);
    PixelGFX.line(ctx, 46, 73, 128, 73, wallBright);
    // Cornisa blanca superior (y = 73..79)
    PixelGFX.rect(ctx, 46, 79, 83, 1, wallShadow);

    // Muro cortina vidriado (x = 46..127, y = 80..111)
    const cwX = 46;
    const cwY = 80;
    const cwW = 81;
    const cwH = 31;
    for (let py = cwY; py < cwY + cwH; py++) {
      const rowFrac = (py - cwY) / cwH;
      const baseGlass = rowFrac < 0.35
        ? '#7395b2'
        : (rowFrac < 0.68 ? '#8fb0cc' : '#b4d0e7');
      PixelGFX.rect(ctx, cwX, py, cwW, 1, baseGlass);
    }

    // Detalles interiores tras el cristal (escalera derecha, losa de entrepiso y reflejos)
    PixelGFX.rect(ctx, cwX, cwY + 15, cwW, 2, wallShade); // Losa de entrepiso visible tras el vidrio
    PixelGFX.line(ctx, 78, cwY + 17, 84, cwY + 30, wallWhite); // Baranda/estructura interior
    PixelGFX.rect(ctx, 54, cwY + 18, 18, 8, '#d8e6f2'); // Paneles blancos interiores

    // Grilla de perfiles (mullions) verticales y horizontales del muro cortina
    for (let gx = cwX; gx <= cwX + cwW; gx += 9) {
      PixelGFX.line(ctx, gx, cwY, gx, cwY + cwH - 1, mullionMid);
    }
    PixelGFX.line(ctx, cwX, cwY + 8, cwX + cwW - 1, cwY + 8, mullionMid);
    PixelGFX.line(ctx, cwX, cwY + 23, cwX + cwW - 1, cwY + 23, mullionMid);

    // Cubo blanco volado característico en el muro cortina izquierdo (x = 60..78, y = 84..101)
    // Sombra proyectada por el cubo volado sobre el cristal
    PixelGFX.rect(ctx, 59, 101, 19, 2, '#52677a');
    PixelGFX.rect(ctx, 59, 85, 2, 17, '#52677a');
    // Marco blanco sobresaliente de 2px
    PixelGFX.rect(ctx, 60, 84, 18, 17, wallBright);
    PixelGFX.rect(ctx, 62, 86, 14, 13, '#698aa6');
    PixelGFX.rect(ctx, 62, 91, 14, 3, wallShade);
    PixelGFX.line(ctx, 69, 86, 69, 98, mullionMid);

    // Segundo marco blanco saliente en la esquina inferior derecha del ala izquierda (x = 113..126, y = 99..111)
    PixelGFX.rect(ctx, 113, 99, 14, 12, wallBright);
    PixelGFX.rect(ctx, 115, 101, 10, 8, '#7b9ab5');
    PixelGFX.line(ctx, 116, 108, 124, 102, mullionMid); // Escalera interior

    // Planta baja sobre pilotes del ala izquierda (y = 111..118)
    PixelGFX.rect(ctx, 46, 111, 83, 2, wallWhite);
    PixelGFX.rect(ctx, 46, 113, 83, 5, '#334238');
    for (let px = 48; px <= 124; px += 12) {
      PixelGFX.rect(ctx, px, 113, 2, 5, wallShade);
    }

    // ------------------------------------------------------------------------
    // B) TORRE CENTRAL PRINCIPAL CEAF (x = 129 .. 201, y = 52 .. 118)
    // ------------------------------------------------------------------------
    // Cuerpo blanco luminoso de la Torre Central
    PixelGFX.rect(ctx, 129, 53, 67, 65, wallWhite);
    PixelGFX.rect(ctx, 131, 52, 63, 45, wallBright);
    // Retorno lateral derecho en sombra (x = 195..201)
    PixelGFX.rect(ctx, 195, 55, 6, 63, wallShade);
    PixelGFX.line(ctx, 194, 52, 194, 117, wallShadow);
    PixelGFX.rect(ctx, 197, 79, 2, 4, '#475569'); // Pequeño equipo/rejilla lateral
    // Pilastra vertical izquierda de la torre (x = 129..132)
    PixelGFX.line(ctx, 132, 53, 132, 117, wallShade);

    // Gran Ventanal Cuadrado Volado de la Torre Central (x = 153..186, y = 57..90)
    // Sombra inferior e izquierda bajo el marco del ventanal
    PixelGFX.rect(ctx, 152, 90, 34, 3, wallShadow);
    PixelGFX.rect(ctx, 152, 58, 2, 33, wallShadow);
    // Marco blanco saliente
    PixelGFX.rect(ctx, 153, 57, 33, 33, wallBright);
    PixelGFX.rectOutline(ctx, 153, 57, 33, 33, wallShade);

    // Interior acristalado del ventanal central (x = 155..183, y = 59..88)
    const winX = 155;
    const winY = 59;
    const winW = 29;
    const winH = 29;
    PixelGFX.rect(ctx, winX, winY, winW, 16, '#698ba8'); // Cielo reflejado en los paños superiores
    PixelGFX.rect(ctx, winX, winY + 10, winW, 6, '#8bb0cf');
    // Siluetas de butacas/asientos del auditorio/laboratorio superior visibles en la foto
    for (let sx = winX + 2; sx < winX + winW - 2; sx += 4) {
      PixelGFX.rect(ctx, sx, winY + 13, 2, 2, '#2d3b4e');
    }
    // Franja blanca de entrepiso y paños inferiores (y = 75..88)
    PixelGFX.rect(ctx, winX, winY + 16, winW, 4, wallWhite);
    PixelGFX.rect(ctx, winX, winY + 20, winW, 9, '#7a98b3');
    PixelGFX.rect(ctx, winX + 3, winY + 21, winW - 6, 3, '#cfe0f0');

    // Perfiles metálicos (3 columnas x 4 divisiones horizontales)
    PixelGFX.line(ctx, winX + 9, winY, winX + 9, winY + winH - 1, mullionMid);
    PixelGFX.line(ctx, winX + 19, winY, winX + 19, winY + winH - 1, mullionMid);
    PixelGFX.line(ctx, winX, winY + 8, winX + winW - 1, winY + 8, mullionMid);
    PixelGFX.line(ctx, winX, winY + 15, winX + winW - 1, winY + 15, mullionDark);
    PixelGFX.line(ctx, winX, winY + 22, winX + winW - 1, winY + 22, mullionMid);

    // Portal de Acceso Principal en Planta Baja con Cielo de Madera a Dos Aguas en 960x540 nativo (x = 136..188, y = 98..118)
    PixelGFX.line(ctx, 131, 96, 194, 96, wallShadow);
    const portalX = 137;
    const portalW = 50;
    const apexXN = (portalX + 25) * 3; // 486
    // Muro interior recedido bajo el portal
    PixelGFX.rect(ctx, portalX, 100, portalW, 18, '#d5cec4');
    // Alero triangular de madera cálida con pendiente suave nativa 1:1 y listones finos
    for (let fdx = 0; fdx < portalW * 3; fdx++) {
      const fpx = portalX * 3 + fdx;
      const distFromCenterN = Math.abs(fpx - apexXN);
      const roofTopYN = 99 * 3 + Math.round(distFromCenterN * 0.16);
      const roofBotYN = roofTopYN + 13;
      const plankIdx = Math.floor(fdx / 2);
      const woodCol = plankIdx % 4 === 0 ? '#5e3a1e' : (plankIdx % 2 === 0 ? '#875631' : '#734726');
      PixelGFX.fineRect(ctx, fpx, roofTopYN, 1, roofBotYN - roofTopYN, woodCol);
      PixelGFX.fineRect(ctx, fpx, roofBotYN, 1, 2, '#3d2412');
    }
    // Revestimiento de madera izquierdo en el acceso
    PixelGFX.rect(ctx, portalX + 1, 104, 8, 14, '#7c4d2b');

    // ------------------------------------------------------------------------
    // C) ALA DERECHA Y PUENTE VIDRIADO (x = 201 .. 301, y = 70 .. 118)
    // ------------------------------------------------------------------------
    // Puente conector acristalado (x = 201..242, y = 72..118)
    PixelGFX.rect(ctx, 201, 72, 42, 28, wallShade);
    // Sombra diagonal proyectada por la torre central sobre el puente en scanlines nativas 960x540
    for (let fy = 72 * 3; fy < 96 * 3; fy++) {
      const shadowEndN = Math.min(241 * 3, Math.round(201 * 3 + (fy - 70 * 3) * 1.6));
      PixelGFX.fineRect(ctx, 201 * 3, fy, shadowEndN - 201 * 3, 1, wallDeepShadow);
    }

    // Ventanal corrido del puente con borde de sombra diagonal suave en 960x540 (x = 202..240, y = 79..98)
    for (let fy = 79 * 3; fy <= 98 * 3 + 2; fy++) {
      const shadowLimitN = Math.min(241 * 3, Math.round(201 * 3 + (fy - 70 * 3) * 1.6));
      const winLeftN = 202 * 3;
      const winRightN = 241 * 3;
      const splitN = Math.max(winLeftN, Math.min(winRightN, shadowLimitN));
      if (splitN > winLeftN) {
        PixelGFX.fineRect(ctx, winLeftN, fy, splitN - winLeftN, 1, '#466178');
      }
      if (winRightN > splitN) {
        PixelGFX.fineRect(ctx, splitN, fy, winRightN - splitN, 1, '#7da1bf');
      }
    }
    for (let gx = 202; gx <= 240; gx += 6) {
      PixelGFX.line(ctx, gx, 79, gx, 98, '#2d3748');
    }
    PixelGFX.line(ctx, 202, 85, 240, 85, '#2d3748');
    PixelGFX.line(ctx, 202, 92, 240, 92, '#2d3748');

    // Vano inferior inclinado bajo el puente en 960x540 nativo (acceso al patio interior, y = 98..118)
    for (let fdx = 0; fdx < 41 * 3; fdx++) {
      const soffitYN = 98 * 3 + Math.round(fdx * 0.12);
      PixelGFX.fineRect(ctx, 201 * 3 + fdx, soffitYN, 1, 7, wallShade);
      PixelGFX.fineRect(ctx, 201 * 3 + fdx, soffitYN + 7, 1, 118 * 3 - (soffitYN + 7), fdx < 26 * 3 ? '#18221f' : '#4a5d54');
    }

    // Volumen derecho saliente (x = 242..301, y = 70..118)
    PixelGFX.rect(ctx, 242, 70, 59, 48, wallWhite);
    PixelGFX.line(ctx, 242, 70, 300, 70, wallBright);
    PixelGFX.rect(ctx, 258, 70, 43, 34, wallBright); // Bloque derecho en primer plano

    // Ventana vertical intermedia (x = 245..255, y = 78..100)
    PixelGFX.rect(ctx, 245, 78, 11, 22, '#6c8da8');
    PixelGFX.line(ctx, 250, 78, 250, 99, '#2d3748');
    PixelGFX.line(ctx, 245, 85, 255, 85, '#2d3748');
    PixelGFX.line(ctx, 245, 92, 255, 92, '#2d3748');

    // Gran ventanal de esquina derecha (x = 271..299, y = 76..100)
    PixelGFX.rect(ctx, 271, 76, 29, 24, '#56758f');
    PixelGFX.rect(ctx, 272, 77, 18, 10, '#7ea2bf');
    for (let gx = 271; gx <= 299; gx += 7) {
      PixelGFX.line(ctx, gx, 76, gx, 99, '#2d3748');
    }
    PixelGFX.line(ctx, 271, 84, 299, 84, '#2d3748');
    PixelGFX.line(ctx, 271, 92, 299, 92, '#2d3748');

    // Ventanales de planta baja del ala derecha (y = 105..118)
    PixelGFX.rect(ctx, 245, 105, 21, 13, '#2b3c47');
    PixelGFX.rect(ctx, 246, 106, 12, 8, '#526c80');
    PixelGFX.rect(ctx, 271, 105, 28, 13, '#334754');
    PixelGFX.line(ctx, 267, 104, 267, 118, wallWhite); // Pilar blanco

    // Pequeño equipo blanco de climatización en la cubierta derecha (x = 290, y = 68)
    PixelGFX.rect(ctx, 290, 68, 6, 2, wallWhite);
  }

  // ==========================================================================
  // 4. SUELO AGRÍCOLA, CAMINO Y PLANTAS EXPERIMENTALES MECIDAS POR EL VIENTO
  // ==========================================================================
  /**
   * Dibuja una hoja lanceolada individual en Pixel-Art nativo 960x540 con nervadura y brillo solar
   */
  function drawPointedLeaf(ctx, x0, y0, dx, dy, colDark, colMid, colLight) {
    const S = ns.SCALE || 3;
    const fx0 = Math.round(x0 * S);
    const fy0 = Math.round(y0 * S);
    const fx1 = Math.round((x0 + dx) * S);
    const fy1 = Math.round((y0 + dy) * S);
    const mx1 = Math.round(MathUtil.lerp(fx0, fx1, 0.6));
    const my1 = Math.round(MathUtil.lerp(fy0, fy1, 0.6));
    const mx2 = Math.round(MathUtil.lerp(fx0, fx1, 0.35));
    const my2 = Math.round(MathUtil.lerp(fy0, fy1, 0.35));
    PixelGFX.fineLine(ctx, fx0, fy0, fx1, fy1, colMid, 3);
    PixelGFX.fineLine(ctx, fx0, fy0 - 1, mx1, my1 - 1, colLight, 2);
    PixelGFX.fineLine(ctx, mx2, my2 + 2, fx1, fy1 + 1, colDark, 2);
    PixelGFX.fineRect(ctx, fx1 - 1, fy1 - 1, 2, 2, colLight);
  }

  /**
   * Dibuja un arbolito frutal joven ramificado (cerezo/duraznero experimental de CEAF)
   * con ramas leñosas flexibles y hojas individuales en resolución nativa 960x540.
   */
  function drawBranchingSapling(ctx, cx, potTopY, scale, time, seed, isBushy, isCompact) {
    const S = ns.SCALE || 3;
    const cDark  = '#1b3b14';
    const cDeep  = '#2d591e';
    const cMid   = '#48822d';
    const cLight = '#6eb043';
    const cSun   = '#9ed966';

    // Onda viajera de viento de izquierda a derecha a través del campo experimental
    const windPhase = time * 3.2 - cx * 0.038 + (seed % 7) * 0.25;
    const primaryWind = Math.sin(windPhase);
    const gustWave = Math.max(0, Math.sin(time * 1.7 - cx * 0.025));
    const totalWind = (primaryWind * 1.35 + gustWave * 1.45) * Math.min(1.3, Math.max(0.45, scale));
    const swayPx = Math.round(totalWind);

    const trunkH = Math.max(5, Math.round((isBushy ? 15 : 12) * scale));
    const trunkTopX = cx + totalWind * 0.65;
    const trunkTopY = potTopY - trunkH;

    // 1. Tronco leñoso joven saliendo del sustrato con grosor nativo proporcional
    const trunkThick = scale >= 0.85 ? 3 : 2;
    PixelGFX.fineLine(ctx, cx * S, potTopY * S, trunkTopX * S, trunkTopY * S, '#4a3625', trunkThick);
    if (scale >= 0.7) {
      PixelGFX.fineLine(ctx, cx * S + 1, potTopY * S, trunkTopX * S + 1, (trunkTopY + 1) * S, '#6b5038', 1);
    }

    // 2. Caso especial: arbolito tupido compacto (como el primero de la hilera izquierda en Building.png)
    if (isCompact) {
      const fCrownH = Math.round(20 * scale * S);
      const fCrownW = Math.round(11 * scale * S);
      const fcX = Math.round(cx * S);
      const fcY = Math.round((potTopY - 20 * scale * 0.68) * S);
      for (let fdy = -Math.round(fCrownH * 0.55); fdy <= Math.round(fCrownH * 0.45); fdy += 2) {
        const fpy = fcY + fdy;
        const vFrac = fdy / Math.max(1, fCrownH * 0.55);
        const rowSway = Math.round(totalWind * S * (0.6 - vFrac * 0.5));
        const span = Math.round(fCrownW * Math.sqrt(Math.max(0, 1 - vFrac * vFrac * 0.88)));
        for (let fdx = -span; fdx <= span; fdx += 2) {
          const fpx = fcX + fdx + rowSway;
          const n = Math.floor(MathUtil.hash(fdx * 8.7 + fdy * 19.3 + seed * 7.1) * 16);
          if (Math.abs(fdx) >= span - 2 && n < 7) continue;
          let col = cMid;
          if (fdx < -span * 0.3 || vFrac > 0.35 || n < 3) col = cDark;
          else if (n < 7) col = cDeep;
          else if (fdx > 0 && vFrac < 0.15 && n > 10) col = cLight;
          if (fdx > span * 0.15 && vFrac < -0.05 && n >= 14) col = cSun;
          PixelGFX.fineRect(ctx, fpx, fpy, 2, 2, col);
        }
      }
      return;
    }

    // 3. Estructura ramificada abierta con hojas lanceoladas mecidas por el viento (fiel a Building.png)
    const branches = isBushy
      ? [
          { bx: -11, by: -14, len: 1.0 },
          { bx:  -6, by: -21, len: 1.1 },
          { bx:   0, by: -24, len: 1.15 },
          { bx:   7, by: -20, len: 1.05 },
          { bx:  12, by: -13, len: 0.95 }
        ]
      : [
          { bx: -8, by: -13, len: 0.9 },
          { bx: -2, by: -19, len: 1.05 },
          { bx:  4, by: -18, len: 1.0 },
          { bx:  9, by: -12, len: 0.85 }
        ];

    for (let b = 0; b < branches.length; b++) {
      const br = branches[b];
      const bHash = ((seed * 11 + b * 7) % 5) - 2;
      const startX = MathUtil.lerp(cx, trunkTopX, 0.55 + (b % 2) * 0.25);
      const startY = MathUtil.lerp(potTopY, trunkTopY, 0.5 + (b % 3) * 0.2);

      const flutter = Math.sin(time * 6.8 + seed * 1.3 + b * 2.1) * 0.9 * scale;
      const tipX = cx + (br.bx + bHash) * scale + totalWind * 1.45 + flutter;
      const tipY = potTopY + (br.by - Math.abs(bHash)) * scale + Math.abs(totalWind) * 0.3;

      // Dibujar rama fina de 2px nativos
      PixelGFX.fineLine(ctx, startX * S, startY * S, tipX * S, tipY * S, b % 2 === 0 ? '#4d3b27' : '#3b5924', 2);

      // Hojas a lo largo de la rama y en el ápice
      const numLeafNodes = scale < 0.55 ? 2 : (scale < 0.85 ? 3 : 4);
      for (let l = 1; l <= numLeafNodes; l++) {
        const frac = l / numLeafNodes;
        const lx = MathUtil.lerp(startX, tipX, frac);
        const ly = MathUtil.lerp(startY, tipY, frac);
        const leafFlutter = Math.sin(time * 8.4 + seed + b * 3 + l * 2) * 0.8;

        if (scale < 0.55) {
          const flx = Math.round(lx * S);
          const fly = Math.round(ly * S);
          PixelGFX.fineRect(ctx, flx - 3, fly - 2, 7, 5, cMid);
          PixelGFX.fineRect(ctx, flx - 3, fly + 1, 4, 2, cDark);
          PixelGFX.fineRect(ctx, flx + 1, fly - 2, 3, 2, l === numLeafNodes ? cSun : cLight);
        } else {
          const windDir = swayPx >= 0 ? 1 : -1;
          const leafDX = (l % 2 === 0 ? 2 : -2) + windDir;
          const leafDY = (l % 3 === 0 ? -2 : 1) + leafFlutter;
          drawPointedLeaf(
            ctx,
            lx,
            ly,
            leafDX * Math.min(1.3, scale),
            leafDY * Math.min(1.2, scale),
            cDark,
            b % 2 === 0 ? cDeep : cMid,
            l === numLeafNodes ? cSun : cLight
          );
          drawPointedLeaf(
            ctx,
            lx,
            ly - 1,
            (1 + windDir) * scale,
            -2 * scale,
            cDeep,
            cMid,
            cLight
          );
        }
      }
    }
  }

  function drawExperimentalFieldAndPlants(ctx, time) {
    // 1. Pradera verde frente al ala derecha (y = 118..121)
    PixelGFX.rect(ctx, 0, 118, WIDTH, 62, '#6e5a49');
    PixelGFX.rect(ctx, 222, 118, 50, 3, '#5d9443');
    PixelGFX.rect(ctx, 224, 118, 46, 1, '#7ec25a');

    // 2. Gradiente y textura pedregosa del suelo del campo experimental en 960x540 nativo (y = 120..180)
    for (let fy = 120 * 3; fy < HEIGHT * 3; fy++) {
      const t = (fy - 120 * 3) / (60 * 3);
      const baseSoil = t < 0.32 ? '#7d6856' : (t < 0.68 ? '#6e5a49' : '#5c4a3b');
      PixelGFX.fineRect(ctx, 0, fy, WIDTH * 3, 1, baseSoil);

      const laneLeftN = Math.round(MathUtil.lerp(224 * 3, 186 * 3, t));
      const laneRightN = Math.round(MathUtil.lerp(256 * 3, 284 * 3, t));
      PixelGFX.fineRect(ctx, laneLeftN, fy, laneRightN - laneLeftN, 1, t < 0.5 ? '#8c7765' : '#7a6552');
    }

    for (let py = 120; py < HEIGHT; py++) {
      const stepX = py < 140 ? 6 : 4;
      for (let px = (py * 3) % stepX; px < WIDTH; px += stepX) {
        const h = (px * 19 + py * 37) % 17;
        if (h === 0) {
          PixelGFX.fineRect(ctx, px * 3, py * 3, 3, 2, '#9e8874');
        } else if (h === 1) {
          PixelGFX.fineRect(ctx, px * 3, py * 3, 3, 2, '#453629');
        } else if (h === 2 && py > 135) {
          PixelGFX.fineRect(ctx, px * 3, py * 3, 5, 2, '#8c7561');
        }
      }
    }

    // Sombras horizontales paralelas proyectadas sobre el camino por la hilera derecha de macetas
    for (let s = 0; s < 9; s++) {
      const frac = s / 8;
      const sy = Math.round(MathUtil.lerp(123, 168, frac * frac * 0.35 + frac * 0.65));
      const sLeft = Math.round(MathUtil.lerp(222, 198, frac));
      const sRight = Math.round(MathUtil.lerp(264, 308, frac));
      PixelGFX.rect(ctx, sLeft, sy, sRight - sLeft, 1, '#4c3d30');
      if (sy > 138) {
        PixelGFX.rect(ctx, sLeft + 2, sy + 1, sRight - (sLeft + 2), 1, '#544436');
      }
    }

    // 3. Hileras en perspectiva de Macetas Geotextiles con Plantas Frutales Experimentales
    const pots = [
      // Fila de fondo junto al edificio (y = 121..125)
      { cx: 18,  by: 123, s: 0.42, seed: 1 },
      { cx: 52,  by: 123, s: 0.44, seed: 2 },
      { cx: 74,  by: 123, s: 0.44, seed: 3 },
      { cx: 92,  by: 123, s: 0.45, seed: 4 },
      { cx: 112, by: 123, s: 0.45, seed: 5 },
      { cx: 132, by: 123, s: 0.46, seed: 6 },
      { cx: 148, by: 123, s: 0.46, seed: 7 },
      { cx: 215, by: 122, s: 0.45, seed: 8 },
      { cx: 224, by: 121, s: 0.42, seed: 9 },

      // Hileras intermedias (y = 126..136)
      { cx: 8,   by: 128, s: 0.52, seed: 10 },
      { cx: 44,  by: 127, s: 0.52, seed: 11 },
      { cx: 68,  by: 127, s: 0.52, seed: 12 },
      { cx: 88,  by: 127, s: 0.53, seed: 13 },
      { cx: 109, by: 127, s: 0.54, seed: 14 },
      { cx: 131, by: 127, s: 0.54, seed: 15 },
      { cx: 207, by: 127, s: 0.55, seed: 16 },
      { cx: 267, by: 124, s: 0.46, seed: 17 },
      { cx: 271, by: 127, s: 0.52, seed: 18 },

      // Hileras medias (y = 132..144)
      { cx: 34,  by: 133, s: 0.62, seed: 19 },
      { cx: 61,  by: 133, s: 0.62, seed: 20 },
      { cx: 84,  by: 133, s: 0.63, seed: 21 },
      { cx: 105, by: 133, s: 0.64, seed: 22 },
      { cx: 129, by: 132, s: 0.64, seed: 23 },
      { cx: 199, by: 132, s: 0.65, seed: 24 },
      { cx: 276, by: 131, s: 0.58, seed: 25 },
      { cx: 281, by: 135, s: 0.65, seed: 26 },

      // Hileras medio-delanteras (y = 138..154)
      { cx: 16,  by: 142, s: 0.78, seed: 27 },
      { cx: 52,  by: 140, s: 0.74, seed: 28 },
      { cx: 78,  by: 140, s: 0.75, seed: 29 },
      { cx: 101, by: 141, s: 0.76, seed: 30 },
      { cx: 191, by: 139, s: 0.78, seed: 31 },
      { cx: 287, by: 141, s: 0.74, seed: 32 },
      { cx: 294, by: 147, s: 0.84, seed: 33 },

      // Hileras delanteras (y = 148..166)
      { cx: 38,  by: 151, s: 0.96, seed: 34, compact: true },
      { cx: 71,  by: 150, s: 0.92, seed: 35 },
      { cx: 96,  by: 150, s: 0.92, seed: 36, bushy: true },
      { cx: 180, by: 147, s: 0.94, seed: 37, bushy: true },
      { cx: 302, by: 155, s: 0.98, seed: 38, bushy: true },
      { cx: 170, by: 154, s: 1.10, seed: 39, bushy: true },
      { cx: 312, by: 165, s: 1.15, seed: 40, bushy: true },

      // Primerísimo plano central (las 2 macetas protagonistas de Building.png)
      { cx: 156, by: 163, s: 1.25, seed: 41, bushy: true },
      { cx: 124, by: 165, s: 1.38, seed: 42, onlyPot: true }
    ];

    pots.sort((a, b) => a.by - b.by);

    for (let i = 0; i < pots.length; i++) {
      const p = pots[i];
      drawExperimentalPotAndSapling(ctx, p.cx, p.by, p.s, time, p.seed, !!p.bushy, !!p.onlyPot, !!p.compact);
    }

    // Manguera/rejilla negra de riego por goteo en el borde inferior izquierdo (fiel a Building.png)
    PixelGFX.fineLine(ctx, 38 * 3, 160 * 3, 88 * 3, 163 * 3, '#1e242b', 2);
    PixelGFX.fineLine(ctx, 40 * 3, 162 * 3, 78 * 3, 164 * 3, '#333c47', 2);
    PixelGFX.fineLine(ctx, 44 * 3, 159 * 3, 52 * 3, 164 * 3, '#1e242b', 2);

    // Rama de hojas grandes en primerísimo plano asomando por el borde izquierdo en 960x540 nativo (x = 0..22, y = 104..152)
    const fgSwayN = Math.round(Math.sin(time * 3.4) * 6.0);
    PixelGFX.fineLine(ctx, 0, 114 * 3, 12 * 3 + fgSwayN, 128 * 3, '#54432a', 3);
    for (let fd = 0; fd < 42; fd++) {
      const hwN = Math.max(2, Math.round(Math.sin((fd / 41) * Math.PI) * 12));
      const fx = fd + fgSwayN;
      const fy = 110 * 3 + fd;
      PixelGFX.fineRect(ctx, fx, fy - hwN, 1, hwN * 2 + 1, fd < 21 ? '#5c7d2f' : '#7ea644');
      PixelGFX.fineRect(ctx, fx, fy - 1, 1, 2, '#a2cc60');
    }
    for (let fd = 0; fd < 48; fd++) {
      const fx = Math.round(fd * 1.1) + fgSwayN;
      const fy = 122 * 3 + Math.round(fd * 1.15);
      const hwN = Math.max(2, Math.round(Math.sin((fd / 47) * Math.PI) * 13));
      PixelGFX.fineRect(ctx, fx - hwN, fy, hwN * 2 + 1, 1, fd < 24 ? '#3f5921' : '#587a2f');
      PixelGFX.fineRect(ctx, fx - 1, fy, 2, 1, '#8cb34b');
    }
    for (let fd = 0; fd < 33; fd++) {
      const hwN = Math.max(2, Math.round(Math.sin((fd / 32) * Math.PI) * 10));
      PixelGFX.fineRect(ctx, fd, 136 * 3 + fd - hwN, 1, hwN * 2 + 1, '#2e4218');
    }

    // Ráfagas sutiles de viento y hojas/polen viajando de izquierda a derecha sobre el campo
    for (let w = 0; w < 6; w++) {
      const wProg = (time * 0.36 + w * 0.17) % 1.0;
      const wx = Math.round(wProg * (WIDTH + 40) - 20);
      const wy = 108 + (w * 11) % 46 + Math.round(Math.sin(time * 3.5 + w) * 2);
      if (wx >= 0 && wx < WIDTH - 10) {
        PixelGFX.fineLine(ctx, wx * 3, wy * 3, (wx + 3) * 3, wy * 3, '#b5e57b', 2);
        PixelGFX.fineRect(ctx, (wx + 5) * 3, (wy - 1) * 3, 2, 2, '#e6f7ca');
      }
    }
  }

  /**
   * Dibuja una maceta experimental cilíndrica en resolución nativa 960x540
   * (blanca/gris con malla romboidal fina y musgo basal) y su arbolito frutal ramificado.
   */
  function drawExperimentalPotAndSapling(ctx, cx, baseY, scale, time, seed, isBushy, onlyPot, isCompact) {
    const S = ns.SCALE || 3;
    const potRX = Math.max(2, Math.round(10 * scale));
    const potH = Math.max(4, Math.round(16 * scale));
    const potTopY = baseY - potH;

    // 1. Sombra proyectada hacia la izquierda sobre el suelo
    const shadowW = Math.round(potRX * 1.9);
    PixelGFX.ellipseFill(ctx, cx - Math.round(potRX * 0.6), baseY - 1, shadowW, Math.max(1, Math.round(2.2 * scale)), '#433529');

    // 2. Cuerpo cilíndrico de la maceta geotextil en píxeles finos (pasos de 2x2 nativos)
    const fcx = Math.round(cx * S);
    const fTopY = Math.round(potTopY * S);
    const fPotH = Math.round(potH * S);
    const fPotRX = Math.round(potRX * S);

    for (let fdy = 0; fdy < fPotH; fdy += 2) {
      const fpy = fTopY + fdy;
      if (fpy >= HEIGHT * S) continue;
      const vFrac = fdy / fPotH;
      const rowRX = Math.round(fPotRX * (0.92 + Math.sin(vFrac * Math.PI) * 0.1));

      for (let fdx = -rowRX; fdx <= rowRX; fdx += 2) {
        const fpx = fcx + fdx;
        if (fpx < 0 || fpx >= WIDTH * S) continue;
        const hFrac = fdx / Math.max(1, rowRX);

        // Sombreado cilíndrico suave en 4 tonos
        let col = hFrac < -0.52 ? '#5c6673' : (hFrac < -0.1 ? '#8e9aa8' : (hFrac < 0.45 ? '#c4ced9' : '#e2eaf2'));

        // Parches orgánicos de musgo verde oscuro en la mitad inferior de las macetas
        const mossNoise = Math.floor(MathUtil.hash(fdx * 7.3 + fdy * 15.7 + seed * 5.9) * 16);
        if (vFrac > 0.35 && hFrac < 0.48 && mossNoise < 7) {
          col = mossNoise < 3 ? '#2f4720' : '#4a6932';
        }

        // Malla metálica hexagonal/romboidal fina en las macetas de primer plano
        if (scale >= 0.78 && (((fdx + fdy) % 6 === 0) || ((fdx - fdy) % 6 === 0)) && mossNoise > 4) {
          col = hFrac < 0 ? '#525d6b' : '#94a3b8';
        }

        PixelGFX.fineRect(ctx, fpx, fpy, 2, 2, col);
      }
    }

    // Boca superior oscura (sustrato dentro de la maceta) y reborde blanco
    PixelGFX.ellipseFill(ctx, cx, potTopY, Math.max(2, potRX - 1), Math.max(1, Math.round(2 * scale)), '#3b2f25');
    PixelGFX.line(ctx, cx - potRX + 1, potTopY, cx + potRX - 1, potTopY, '#e2e8f0');

    if (onlyPot) return;

    // 3. Planta Frutal Experimental ramificada reaccionando a la onda de viento
    drawBranchingSapling(ctx, cx, potTopY, scale, time, seed, isBushy, isCompact);
  }

  function render(ctx, time) {
    drawSkyAndChileanEagles(ctx, time);
    drawBackgroundTrees(ctx, time);
    drawCEAFBuilding(ctx, time);
    drawExperimentalFieldAndPlants(ctx, time);
  }

  ns.IntroScene = {
    render
  };
})(window.MicroCosmos);
