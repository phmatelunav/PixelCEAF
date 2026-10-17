/**
 * logoScene.js
 * Escena 10 (52.0s .. 58.0s): Cierre Institucional en formato Pixel-Art.
 * Recrea píxel a píxel los 4 logos corporativos de la carpeta /logos:
 *   - Arriba (Principal): CEAF (Centro de Estudios Avanzados en Fruticultura)
 *   - Abajo (Alineados): GORE O'Higgins, CORE O'Higgins y ANID (Ministerio de Ciencia / Gobierno de Chile)
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  const { WIDTH, HEIGHT, PAL, PixelGFX, MathUtil, Sprites } = ns;

  // ==========================================================================
  // TIPOGRAFÍA PIXEL-ART NATIVA 7x11 PARA 960x540 (NÍTIDA SIN DIFUMINADO)
  // Mantiene exactamente el mismo espaciado lógico (spacing=4 => 12px nativos)
  // ==========================================================================
  const FONT_7X11 = {
    'A': [
      '..111..',
      '.11.11.',
      '11...11',
      '11...11',
      '11...11',
      '1111111',
      '1111111',
      '11...11',
      '11...11',
      '11...11',
      '11...11'
    ],
    'B': [
      '111111.',
      '11...11',
      '11...11',
      '11...11',
      '111111.',
      '111111.',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '111111.'
    ],
    'C': [
      '.11111.',
      '11...11',
      '11....1',
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '11....1',
      '11...11',
      '.11111.'
    ],
    'D': [
      '11111..',
      '11..11.',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11..11.',
      '11111..'
    ],
    'E': [
      '1111111',
      '1111111',
      '11.....',
      '11.....',
      '111111.',
      '111111.',
      '11.....',
      '11.....',
      '11.....',
      '1111111',
      '1111111'
    ],
    'F': [
      '1111111',
      '1111111',
      '11.....',
      '11.....',
      '111111.',
      '111111.',
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '11.....'
    ],
    'G': [
      '.11111.',
      '11...11',
      '11.....',
      '11.....',
      '11.....',
      '11..111',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    'H': [
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '1111111',
      '1111111',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11'
    ],
    'I': [
      '.11111.',
      '.11111.',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '.11111.',
      '.11111.'
    ],
    'J': [
      '..11111',
      '....11.',
      '....11.',
      '....11.',
      '....11.',
      '....11.',
      '....11.',
      '11..11.',
      '11..11.',
      '11..11.',
      '.1111..'
    ],
    'K': [
      '11...11',
      '11..11.',
      '11.11..',
      '1111...',
      '111....',
      '1111...',
      '11.11..',
      '11..11.',
      '11...11',
      '11...11',
      '11...11'
    ],
    'L': [
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '1111111',
      '1111111'
    ],
    'M': [
      '11...11',
      '111.111',
      '1111111',
      '11.1.11',
      '11.1.11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11'
    ],
    'N': [
      '11...11',
      '111..11',
      '111..11',
      '1111.11',
      '11.1111',
      '11.1111',
      '11..111',
      '11..111',
      '11...11',
      '11...11',
      '11...11'
    ],
    'O': [
      '.11111.',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    'P': [
      '111111.',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '111111.',
      '11.....',
      '11.....',
      '11.....',
      '11.....',
      '11.....'
    ],
    'Q': [
      '.11111.',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11.1.11',
      '11..111',
      '.11111.',
      '.....11'
    ],
    'R': [
      '111111.',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '111111.',
      '11.11..',
      '11..11.',
      '11...11',
      '11...11',
      '11...11'
    ],
    'S': [
      '.11111.',
      '11...11',
      '11.....',
      '11.....',
      '.1111..',
      '..1111.',
      '.....11',
      '.....11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    'T': [
      '1111111',
      '1111111',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..'
    ],
    'U': [
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    'V': [
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '.11.11.',
      '.11.11.',
      '..111..',
      '..111..',
      '...1...'
    ],
    'W': [
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11.1.11',
      '11.1.11',
      '1111111',
      '111.111',
      '11...11',
      '11...11'
    ],
    'X': [
      '11...11',
      '11...11',
      '.11.11.',
      '.11.11.',
      '..111..',
      '..111..',
      '.11.11.',
      '.11.11.',
      '11...11',
      '11...11',
      '11...11'
    ],
    'Y': [
      '11...11',
      '11...11',
      '.11.11.',
      '.11.11.',
      '..111..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..'
    ],
    'Z': [
      '1111111',
      '1111111',
      '....11.',
      '....11.',
      '...11..',
      '..11...',
      '..11...',
      '.11....',
      '11.....',
      '1111111',
      '1111111'
    ],
    '0': [
      '.11111.',
      '11...11',
      '11..111',
      '11..111',
      '11.1.11',
      '11.1.11',
      '111..11',
      '111..11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    '1': [
      '...11..',
      '..111..',
      '.1111..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '...11..',
      '.111111',
      '.111111'
    ],
    '2': [
      '.11111.',
      '11...11',
      '.....11',
      '.....11',
      '....11.',
      '..111..',
      '.11....',
      '11.....',
      '11.....',
      '1111111',
      '1111111'
    ],
    '3': [
      '.11111.',
      '11...11',
      '.....11',
      '.....11',
      '..1111.',
      '..1111.',
      '.....11',
      '.....11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    '4': [
      '....11.',
      '...111.',
      '..1111.',
      '.11.11.',
      '11..11.',
      '11..11.',
      '1111111',
      '1111111',
      '....11.',
      '....11.',
      '....11.'
    ],
    '5': [
      '1111111',
      '1111111',
      '11.....',
      '11.....',
      '111111.',
      '111111.',
      '.....11',
      '.....11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    '6': [
      '.11111.',
      '11...11',
      '11.....',
      '11.....',
      '111111.',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    '7': [
      '1111111',
      '1111111',
      '.....11',
      '....11.',
      '....11.',
      '...11..',
      '...11..',
      '..11...',
      '..11...',
      '..11...',
      '..11...'
    ],
    '8': [
      '.11111.',
      '11...11',
      '11...11',
      '11...11',
      '.11111.',
      '.11111.',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    '9': [
      '.11111.',
      '11...11',
      '11...11',
      '11...11',
      '11...11',
      '.111111',
      '.....11',
      '.....11',
      '11...11',
      '11...11',
      '.11111.'
    ],
    '\'': [
      '..11...',
      '..11...',
      '.11....',
      '.11....',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......'
    ],
    '.': [
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '..11...',
      '..11...'
    ],
    ',': [
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '..11...',
      '..11...',
      '.11....'
    ],
    ':': [
      '.......',
      '.......',
      '..11...',
      '..11...',
      '.......',
      '.......',
      '.......',
      '..11...',
      '..11...',
      '.......',
      '.......'
    ],
    '·': [
      '.......',
      '.......',
      '.......',
      '.......',
      '..111..',
      '..111..',
      '..111..',
      '.......',
      '.......',
      '.......',
      '.......'
    ],
    '/': [
      '.....11',
      '.....11',
      '....11.',
      '....11.',
      '...11..',
      '...11..',
      '..11...',
      '..11...',
      '.11....',
      '11.....',
      '11.....'
    ],
    '-': [
      '.......',
      '.......',
      '.......',
      '.......',
      '.11111.',
      '.11111.',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......'
    ],
    ' ': [
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......',
      '.......'
    ]
  };

  function drawPixelText3x5(ctx, text, x, y, color, spacing = 4) {
    const S = ns.SCALE || 3;
    const upper = text.toUpperCase();
    let cx = Math.round(x * S);
    const cy = Math.round(y * S) + 2;

    ctx.fillStyle = color;
    for (let i = 0; i < upper.length; i++) {
      let ch = upper[i];
      let hasAccent = false;
      let hasTilde = false;
      if (ch === 'Ó') { ch = 'O'; hasAccent = true; }
      else if (ch === 'Í') { ch = 'I'; hasAccent = true; }
      else if (ch === 'Á') { ch = 'A'; hasAccent = true; }
      else if (ch === 'É') { ch = 'E'; hasAccent = true; }
      else if (ch === 'Ú') { ch = 'U'; hasAccent = true; }
      else if (ch === 'Ñ') { ch = 'N'; hasTilde = true; }

      const glyph = FONT_7X11[ch] || FONT_7X11[' '];
      if (hasAccent) {
        PixelGFX.fineRect(ctx, cx + 4, cy - 4, 2, 1, color);
        PixelGFX.fineRect(ctx, cx + 3, cy - 3, 2, 1, color);
        PixelGFX.fineRect(ctx, cx + 2, cy - 2, 2, 1, color);
      } else if (hasTilde) {
        PixelGFX.fineRect(ctx, cx + 1, cy - 3, 2, 1, color);
        PixelGFX.fineRect(ctx, cx + 3, cy - 4, 2, 1, color);
        PixelGFX.fineRect(ctx, cx + 5, cy - 3, 1, 1, color);
      }
      for (let r = 0; r < 11; r++) {
        const rowStr = glyph[r];
        for (let c = 0; c < 7; c++) {
          if (rowStr[c] === '1') {
            PixelGFX.finePset(ctx, cx + c + 1, cy + r, color);
          }
        }
      }
      cx += Math.round(spacing * S);
    }
  }

  // Exponer motor tipográfico en PixelGFX para rótulos HUD en el lienzo
  PixelGFX.drawText3x5 = drawPixelText3x5;

  // ==========================================================================
  // SPRITES COMPILADOS PARA ELEMENTOS COMPLEJOS DE LOS LOGOS
  // ==========================================================================
  // 1. Estatua Ecuestre de Bernardo O'Higgins para el logo CORE (28x34)
  const CORE_STATUE_MAP = {
    'D': '#373d38', // sombra bronce/piedra oscura
    'M': '#5d665e', // tono medio verdoso estatua
    'L': '#8a948b', // luz estatua
    'H': '#b8bfb9', // brillo piedra/metal
    'P': '#7d746d'  // pedestal
  };

  const coreStatueSprite = Sprites.compileSprite([
    '............DM..............',
    'LL.........DMLD.............',
    '..LLL.....DMMLMD............',
    '....LLL..DMMLLMMD...........',
    '......LLDMMMLLMMMD..........',
    '.......DMMMMLLMMD...........',
    '......DMLLMMLMMD............',
    '.....DMLLLMMMMMD............',
    '....DMLLLMMMMMMMD...........',
    '...DMMLLMMMMMMMMMD..........',
    '..DMMLLMMMMMMMMMMMD.........',
    '..DMLMMMMMMMMMMMMMMD........',
    '.DMD.DMMMMMMMMMMMMMMD.......',
    '.DD...DMMMMMLLLMMMMMMD......',
    '......DMMMMMLLLMMMMMMMD.....',
    '.....DMMMMMMLLMMMMMMMMD.....',
    '....DMMMMMMMLLMMMMMD.DMD....',
    '....DD..DMMMMLLMMMMD..DMD...',
    '.........DMMMLLMMMMD...DD...',
    '........DMMMMLLMMMMD........',
    '......DDMMMMMLLMMMMMD.......',
    '.....DMHLLMMMLLMMMMMMD......',
    '....DMHHHLLMMLLMMMMMMMD.....',
    '....DMMHHLLMMLLMMMMMMMMD....',
    '...DMMMMMLLMMLLMMMMMMMMD....',
    '...DMMMMMMMMMMMMMMMMMMMD....',
    '..DMMMMMMMMMMMMMMMMMMMMD....',
    '.DHHHHHHHHHHHHHHHHHHHHHHD...',
    '.DPPPPPPPPPPPPPPPPPPPPPPD...',
    'DPPPPPPPPPPPPPPPPPPPPPPPPD..',
    'DDDDDDDDDDDDDDDDDDDDDDDDDD..'
  ], CORE_STATUE_MAP);

  // 2. Escudo de Chile en Pixel-Art para el logo ANID (15x13)
  const COAT_MAP = {
    'W': '#ffffff',
    'B': '#7ec8e3'
  };

  const chileCoatSprite = Sprites.compileSprite([
    '.....WWWWW.....',
    '..WW.WWWWW.WW..',
    '.WWW..WWW..WWW.',
    '.WWWWWWWWWWWWW.',
    'WWWWWWBWBWWWWWW',
    'WWWWWBWWWBWWWWW',
    '.WWWWWWBWWWWWW.',
    '.WWWWBWWWBWWWW.',
    '..WWWWWWWWWWW..',
    '...WWWWWWWWW...',
    '.WWWWWWWWWWWWW.',
    '..WWW.WWW.WWW..',
    '...............'
  ], COAT_MAP);

  /**
   * Dibuja un anillo circular o arco de alta precisión nativa 960x540
   */
  function drawThickArc(ctx, cx, cy, rOuter, rInner, startDeg, endDeg, color) {
    const S = ns.SCALE || 3;
    const fcx = Math.round(cx * S);
    const fcy = Math.round(cy * S);
    const fOut = Math.round(rOuter * S);
    const fIn = Math.round(rInner * S);
    const rOut2 = fOut * fOut;
    const rIn2 = fIn * fIn;

    ctx.fillStyle = color;
    for (let dy = -fOut; dy <= fOut; dy++) {
      for (let dx = -fOut; dx <= fOut; dx++) {
        const d2 = dx * dx + dy * dy;
        if (d2 <= rOut2 && d2 >= rIn2) {
          let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (deg < 0) deg += 360;

          let inside = false;
          if (startDeg <= endDeg) {
            inside = deg >= startDeg && deg <= endDeg;
          } else {
            inside = deg >= startDeg || deg <= endDeg;
          }
          if (inside) {
            ctx.fillRect(fcx + dx, fcy + dy, 1, 1);
          }
        }
      }
    }
  }

  // ==========================================================================
  // 1. LOGO PRINCIPAL: CEAF (Centro de Estudios Avanzados en Fruticultura)
  // Ubicado en la mitad superior del lienzo (centrado y jerárquicamente mayor)
  // ==========================================================================
  function drawCEAFMainLogo(ctx, localTime, globalTime) {
    const S = ns.SCALE || 3;
    const growT = MathUtil.easeOutCubic(MathUtil.clamp(localTime / 1.1, 0, 1));
    const letterAlpha = MathUtil.smoothstep(0.15, 0.85, localTime);

    const centerY = 48;
    const rOut = 13;
    const rIn = 9;

    if (letterAlpha > 0.05) {
      // --- Letra 'c' geométrica (gris antracita #55565a) ---
      const cX = 96;
      drawThickArc(ctx, cX, centerY, rOut, rIn, 42, 318, PAL.ceafGray);

      // --- Letra 'e' geométrica con barra diagonal interna de alta precisión ---
      const eX = 130;
      drawThickArc(ctx, eX, centerY, rOut, rIn, 38, 325, PAL.ceafGray);
      // Travesaño diagonal característico de la 'e' de CEAF en píxeles nativos
      for (let t = -5; t <= 5; t++) {
        PixelGFX.fineLine(ctx, eX * S - 9 + t, centerY * S + 9, eX * S + 27 + t, centerY * S - 27, PAL.ceafGray, 1);
      }

      // --- Letra 'a' geométrica con asta vertical derecha ---
      const aX = 164;
      drawThickArc(ctx, aX, centerY, rOut, rIn, 0, 360, PAL.ceafGray);
      // Asta derecha de la 'a' hasta la línea base
      PixelGFX.rect(ctx, aX + 9, centerY, 4, 13, PAL.ceafGray);

      // --- Subtítulo Institucional en 2 líneas bajo 'cea' ---
      // Línea 1: CENTRO DE ESTUDIOS
      drawPixelText3x5(ctx, 'CENTRO DE ESTUDIOS', 102, 68, PAL.ceafGray, 4);
      // Línea 2: AVANZADOS EN FRUTICULTURA
      drawPixelText3x5(ctx, 'AVANZADOS EN FRUTICULTURA', 74, 77, PAL.ceafGray, 4);
    }

    // --- Letra 'f' botánica en Verde CEAF (#1e8238) + Hoja + Fruto Naranja (#d45132) ---
    const fStemX = 188;
    const stemBottomY = 84;
    const stemTopY = Math.round(MathUtil.lerp(stemBottomY, 26, growT));

    // Tallo vertical verde de la 'f'
    PixelGFX.rect(ctx, fStemX, stemTopY, 4, stemBottomY - stemTopY, PAL.ceafGreen);
    PixelGFX.fineRect(ctx, fStemX * S + 3, stemTopY * S, 2, (stemBottomY - stemTopY) * S, PAL.ceafGreenLight);

    if (growT > 0.45) {
      // Ligero rebote elástico de la rama media cuando el fruto se desprende (localTime ~ 3.1s)
      let branchSpringY = 0;
      if (localTime > 3.1 && localTime < 3.9) {
        const bt = localTime - 3.1;
        branchSpringY = -Math.sin(bt * 18) * Math.exp(-bt * 4) * 2.2;
      }

      // Arco superior de la 'f' (curva hacia arriba a la derecha, dejando aire bajo el borde superior)
      drawThickArc(ctx, fStemX + 17, 28, 17, 13, 180, 272, PAL.ceafGreen);
      PixelGFX.rect(ctx, fStemX + 15, 11, 5, 4, PAL.ceafGreen);

      // Arco medio (travesaño curvo de la 'f')
      drawThickArc(ctx, fStemX + 17, 43 + branchSpringY, 17, 13, 185, 272, PAL.ceafGreen);
      PixelGFX.rect(ctx, fStemX + 15, 26 + branchSpringY, 5, 4, PAL.ceafGreen);
    }

    // Hoja verde lanceolada inclinada hacia arriba-izquierda en resolución nativa 960x540
    if (growT > 0.6) {
      const leafX = (fStemX - 8) * S;
      const leafY = 22 * S;
      for (let dy = -24; dy <= 24; dy++) {
        for (let dx = -30; dx <= 30; dx++) {
          const rx = (dx / S) * 0.76 + (dy / S) * 0.64;
          const ry = -(dx / S) * 0.64 + (dy / S) * 0.76;
          const dNorm = (rx * rx) / 52 + (ry * ry) / 13;
          if (dNorm <= 1.0) {
            let col = ry < -0.6 ? PAL.ceafGreenLight : PAL.ceafGreen;
            if (Math.abs(ry) < 0.35 && rx > -5.5 && rx < 5.5) col = '#6ee7b7'; // nervadura central fina
            PixelGFX.finePset(ctx, Math.round(leafX + dx), Math.round(leafY + dy), col);
          }
        }
      }
      PixelGFX.fineLine(ctx, leafX - 20, leafY - 17, leafX - 25, leafY - 21, PAL.ceafGreen, 2);
    }

    // Fruto circular rojo-terracota a la derecha del tallo bajo el arco de la 'f'
    if (growT > 0.72) {
      const startX = fStemX + 20; // 208
      const startY = 48;
      const groundY = 87;

      let fruitX = startX;
      let fruitY = startY;
      const fruitR = MathUtil.lerp(1, 8, MathUtil.invLerp(0.72, 1.0, growT));
      let rx = fruitR;
      let ry = fruitR;
      let rotAngle = 0;
      let impactBounce = null;

      if (localTime >= 2.7 && localTime < 3.1) {
        // Temblor previo a caer
        fruitX = startX + Math.round(Math.sin((localTime - 2.7) * 45) * 1.2);
      } else if (localTime >= 3.1) {
        const tDrop = localTime - 3.1;
        // Definición de arcos parabólicos sucesivos hacia la derecha:
        // [tStart, tEnd, x0, x1, apexHeight]
        const bounces = [
          { t0: 0.00, t1: 0.48, x0: 208, x1: 230, h: 0, isDrop: true },
          { t0: 0.48, t1: 1.18, x0: 230, x1: 258, h: 26, isDrop: false },
          { t0: 1.18, t1: 1.74, x0: 258, x1: 282, h: 16, isDrop: false },
          { t0: 1.74, t1: 2.18, x0: 282, x1: 300, h: 9, isDrop: false },
          { t0: 2.18, t1: 2.52, x0: 300, x1: 313, h: 4, isDrop: false }
        ];

        rotAngle = tDrop * 5.5;

        let foundArc = false;
        for (let i = 0; i < bounces.length; i++) {
          const b = bounces[i];
          if (tDrop >= b.t0 && tDrop < b.t1) {
            const u = (tDrop - b.t0) / (b.t1 - b.t0);
            fruitX = Math.round(MathUtil.lerp(b.x0, b.x1, u));
            if (b.isDrop) {
              // Caída libre acelerada desde startY (48) hasta groundY (87)
              fruitY = Math.round(startY + (groundY - startY) * (u * u));
              if (u > 0.65 && u < 0.94) {
                rx = 7;
                ry = 9; // Estiramiento vertical en caída rápida
              }
            } else {
              // Parábola de rebote: 4 * u * (1 - u) vale 0 en los extremos y 1 en el ápice (u=0.5)
              const parabola = 4 * u * (1 - u);
              fruitY = Math.round(groundY - b.h * parabola);
            }
            foundArc = true;
            break;
          }
        }

        if (!foundArc) {
          // Después del último rebote (tDrop >= 2.52), rueda suavemente hacia la derecha hasta salir del cuadro
          const tRoll = tDrop - 2.52;
          fruitX = Math.round(313 + tRoll * 22);
          fruitY = groundY;
        }

        // Efecto Squash & Stretch en los instantes exactos de impacto contra el suelo (y = 95)
        // y germinación de pequeños brotes frutales verdes en cada bote ("El Fruto que Siembra")
        const impactTimes = [
          { t: 0.48, x: 230, maxH: 8, hasBud: true },
          { t: 1.18, x: 258, maxH: 7, hasBud: false },
          { t: 1.74, x: 282, maxH: 6, hasBud: true },
          { t: 2.18, x: 300, maxH: 5, hasBud: false },
          { t: 2.52, x: 313, maxH: 4, hasBud: false }
        ];
        for (let i = 0; i < impactTimes.length; i++) {
          const imp = impactTimes[i];
          const dtImp = Math.abs(tDrop - imp.t);
          if (dtImp < 0.065) {
            // Achatamiento elástico al tocar el suelo
            rx = i < 2 ? 10 : 9;
            ry = i < 2 ? 6 : 7;
            fruitY = 95 - ry;
          }
          // Destello/partículas de impacto en el punto de rebote
          const sinceImp = tDrop - imp.t;
          if (sinceImp >= 0 && sinceImp < 0.24) {
            impactBounce = { x: imp.x, p: sinceImp / 0.24, idx: i };
          }

          // Germinación de un brote frutal detallado sobre la línea divisoria tras cada bote
          if (sinceImp >= 0.08 && i < 4) {
            const sproutP = MathUtil.easeOutCubic(MathUtil.clamp((sinceImp - 0.08) / 0.45, 0, 1));
            const sh = Math.max(1, Math.round(imp.maxH * sproutP));
            const sx = imp.x;
            const syTop = 95 - sh;

            // Tallo verde sombreado en 2 tonos
            PixelGFX.line(ctx, sx, 95, sx, syTop, PAL.ceafGreen);
            if (sh >= 3) {
              PixelGFX.line(ctx, sx - 1, 95, sx - 1, syTop + 2, PAL.ceafGreenLight);
            }

            // Par de hojas lanceoladas con borde superior iluminado
            if (sproutP > 0.35) {
              // Hoja izquierda
              PixelGFX.line(ctx, sx - 1, syTop + 2, sx - 4, syTop + 1, PAL.ceafGreen);
              PixelGFX.line(ctx, sx - 2, syTop + 1, sx - 4, syTop, PAL.ceafGreenLight);
              // Hoja derecha
              PixelGFX.line(ctx, sx + 1, syTop + 1, sx + 4, syTop, PAL.ceafGreen);
              PixelGFX.line(ctx, sx + 2, syTop, sx + 4, syTop - 1, PAL.ceafGreenLight);
            }

            // Yema / fruto miniatura con brillo especular blanco en el ápice
            if (imp.hasBud && sproutP > 0.72) {
              const budCol = i === 0 ? PAL.ceafFruit : PAL.sakuraMid;
              const budLight = i === 0 ? PAL.ceafFruitLight : PAL.white;
              PixelGFX.rect(ctx, sx - 1, syTop - 2, 3, 2, budCol);
              PixelGFX.pset(ctx, sx, syTop - 3, budCol);
              PixelGFX.pset(ctx, sx - 1, syTop - 2, budLight);
            }
          }
        }

        // Sombra elíptica de contacto de 2 capas (se encoge en el aire y se ensancha al impactar)
        if (fruitX - rx < WIDTH - 6) {
          const heightAboveGround = Math.max(0, groundY - fruitY);
          const shadowHalfW = Math.max(2, Math.round(8.5 - heightAboveGround * 0.22));
          const coreHalfW = Math.max(1, Math.round(shadowHalfW * 0.55));
          const sLeft = Math.max(22, fruitX - shadowHalfW);
          const sRight = Math.min(WIDTH - 8, fruitX + shadowHalfW);
          const cLeft = Math.max(22, fruitX - coreHalfW);
          const cRight = Math.min(WIDTH - 8, fruitX + coreHalfW);

          // Halo exterior suave sobre la línea divisoria
          PixelGFX.line(ctx, sLeft, 95, sRight, 95, '#94a3b8');
          if (heightAboveGround < 14) {
            PixelGFX.line(ctx, sLeft + 1, 96, sRight - 1, 96, '#cbd5e1');
            // Núcleo oscuro de contacto directo cuando está cerca del suelo
            PixelGFX.line(ctx, cLeft, 95, cRight, 95, '#475569');
          }
        }

        // Dibujar pequeñas chispas pixel-art al rebotar en la línea
        if (impactBounce) {
          const spread = Math.round(3 + impactBounce.p * 8);
          const lift = Math.round((1 - impactBounce.p) * 4);
          PixelGFX.pset(ctx, impactBounce.x - spread, 94 - lift, PAL.ceafFruitLight);
          PixelGFX.pset(ctx, impactBounce.x + spread, 94 - lift, PAL.ceafFruitLight);
          if (impactBounce.idx < 2) {
            PixelGFX.pset(ctx, impactBounce.x - Math.round(spread * 0.6), 92 - lift, PAL.starGold);
            PixelGFX.pset(ctx, impactBounce.x + Math.round(spread * 0.6), 92 - lift, PAL.starGold);
          }
        }
      }

      // Dibujar la esfera naranja en resolución nativa 960x540 (sin picos cardinales)
      if (fruitX - rx < WIDTH - 5) {
        const S = ns.SCALE || 3;
        ctx.save();
        ctx.beginPath();
        ctx.rect(6 * S, 6 * S, (WIDTH - 12) * S, (HEIGHT - 12) * S);
        ctx.clip();

        const fcx = Math.round(fruitX * S);
        const fcy = Math.round(fruitY * S);
        const frx = Math.max(2, Math.round(rx * S));
        const fry = Math.max(2, Math.round(ry * S));

        for (let dy = -fry; dy <= fry; dy++) {
          for (let dx = -frx; dx <= frx; dx++) {
            const normDist = (dx * dx) / (frx * frx) + (dy * dy) / (fry * fry);
            if (normDist <= 1.0) {
              let pCol = PAL.ceafFruit;
              // Sombra creciente inferior-derecha y Sel-Out en el borde inferior
              if (normDist > 0.82 && dy > 2) {
                pCol = '#8c2d19';
              } else if (dx + dy > frx * 0.42) {
                pCol = '#b53d22';
              } else if (dx + dy < -frx * 0.35 && normDist < 0.72) {
                pCol = '#e06344';
              }
              PixelGFX.finePset(ctx, fcx + dx, fcy + dy, pCol);
            }
          }
        }

        // Brillo especular que rota suavemente mientras la esfera avanza y rebota
        if (fruitR >= 6) {
          const hx = fcx + Math.round(Math.cos(rotAngle - 2.35) * 2.8 * S);
          const hy = fcy + Math.round(Math.sin(rotAngle - 2.35) * 2.4 * S);
          PixelGFX.fineCircleFill(ctx, hx, hy, 5, PAL.ceafFruitLight);
          PixelGFX.fineCircleFill(ctx, hx - 2, hy - 2, 2, PAL.white);
        }
        ctx.restore();
      }

      // Destello sutil inicial sobre el fruto antes de que empiece a caer
      if (localTime > 1.2 && localTime < 2.6) {
        const sparklePhase = (localTime - 1.2) % 1.4;
        if (sparklePhase < 0.55) {
          const sx = startX + 3;
          const sy = startY - 7;
          PixelGFX.sparkle(ctx, sx, sy, PAL.white, PAL.starGold);
        }
      }
    }
  }

  // ==========================================================================
  // 2. LOGO INFERIOR IZQUIERDO: GORE O'HIGGINS (Gobierno Regional)
  // Tres paneles verticales (Ola costera, Cordillera/Río, Manzana/Agro) + Texto
  // ==========================================================================
  function drawGORELogo(ctx, baseX, baseY) {
    const S = ns.SCALE || 3;
    // Dimensiones de cada uno de los 3 paneles verticales: 17x27 px
    const pW = 17;
    const pH = 27;
    const gap = 3;
    const panelsStartX = baseX + 16;
    const panelsY = baseY + 1;

    // --- PANEL 1: COSTA Y OLA MARINA ---
    const p1X = panelsStartX;
    PixelGFX.rect(ctx, p1X, panelsY, pW, pH, PAL.goreSky);
    // Nubes blancas diagonales
    PixelGFX.circleFill(ctx, p1X + 14, panelsY + 6, 4, PAL.white);
    PixelGFX.circleFill(ctx, p1X + 9, panelsY + 9, 4, PAL.white);
    PixelGFX.circleFill(ctx, p1X + 3, panelsY + 11, 4, PAL.white);
    PixelGFX.rect(ctx, p1X, panelsY + 10, pW, 9, PAL.white);
    // Gaviotas celestes de trazo fino
    PixelGFX.fineLine(ctx, (p1X + 5) * S, (panelsY + 7) * S, (p1X + 7) * S, (panelsY + 6) * S, PAL.goreSky, 2);
    PixelGFX.fineLine(ctx, (p1X + 7) * S, (panelsY + 6) * S, (p1X + 9) * S, (panelsY + 7) * S, PAL.goreSky, 2);
    PixelGFX.fineLine(ctx, (p1X + 10) * S, (panelsY + 9) * S, (p1X + 12) * S, (panelsY + 8) * S, PAL.goreSky, 2);
    PixelGFX.fineLine(ctx, (p1X + 12) * S, (panelsY + 8) * S, (p1X + 14) * S, (panelsY + 9) * S, PAL.goreSky, 2);
    // Ola azul curvada y mar inferior
    PixelGFX.rect(ctx, p1X, panelsY + 17, pW, 10, PAL.goreWaveMid);
    PixelGFX.ellipseFill(ctx, p1X + 7, panelsY + 16, 7, 5, PAL.goreWaveDark);
    PixelGFX.ellipseFill(ctx, p1X + 3, panelsY + 16, 3, 2, PAL.white);
    PixelGFX.ellipseFill(ctx, p1X + 3, panelsY + 16, 2, 1, PAL.goreWaveLight);

    // --- PANEL 2: CORDILLERA Y RÍO DEL VALLE ---
    const p2X = panelsStartX + pW + gap;
    PixelGFX.rect(ctx, p2X, panelsY, pW, pH, PAL.goreSky);
    PixelGFX.circleFill(ctx, p2X + 8, panelsY + 5, 5, PAL.white);
    // Cumbres grises nevadas al fondo con pendiente suave nativa
    for (let fx = 0; fx < pW * S; fx++) {
      const mH = Math.abs(fx - 9 * S);
      const topY = Math.round((panelsY + 6) * S + mH * 0.5);
      PixelGFX.fineRect(ctx, p2X * S + fx, topY, 1, (panelsY + 14) * S - topY, '#c7ccd1');
    }
    // Cerro café andino con cresta blanca nítida
    for (let fx = 0; fx < pW * S; fx++) {
      const hillY = Math.round((panelsY + 11) * S + Math.abs(fx - 7 * S) * 0.35);
      PixelGFX.fineRect(ctx, p2X * S + fx, hillY, 1, (panelsY + pH) * S - hillY, PAL.goreMountain);
      PixelGFX.fineRect(ctx, p2X * S + fx, hillY, 1, 2, PAL.white);
    }
    // Río/camino naranja serpenteante en el valle
    PixelGFX.rect(ctx, p2X, panelsY + 22, pW, 5, '#f4976c');
    PixelGFX.fineLine(ctx, (p2X + 2) * S, (panelsY + 16) * S, (p2X + 7) * S, (panelsY + 17) * S, PAL.goreRiver, 2);
    PixelGFX.fineLine(ctx, (p2X + 7) * S, (panelsY + 17) * S, (p2X + 2) * S, (panelsY + 19) * S, PAL.goreRiver, 3);
    PixelGFX.fineLine(ctx, (p2X + 2) * S, (panelsY + 19) * S, (p2X + 14) * S, (panelsY + 21) * S, PAL.goreRiver, 3);
    PixelGFX.rect(ctx, p2X, panelsY + 21, pW, 2, PAL.goreRiver);

    // --- PANEL 3: FRUTICULTURA (MANZANA ROJA Y HOJA VERDE) ---
    const p3X = panelsStartX + (pW + gap) * 2;
    PixelGFX.rect(ctx, p3X, panelsY, pW, pH, PAL.goreSky);
    PixelGFX.circleFill(ctx, p3X + 4, panelsY + 8, 5, PAL.white);
    PixelGFX.circleFill(ctx, p3X + 12, panelsY + 7, 5, PAL.white);
    // Colinas verdes agrícolas
    PixelGFX.rect(ctx, p3X, panelsY + 15, pW, 12, '#267339');
    PixelGFX.rect(ctx, p3X, panelsY + 20, pW, 7, '#39b54a');
    // Manzana roja icónica en primer plano con brillo suave
    PixelGFX.circleFill(ctx, p3X + 10, panelsY + 16, 6, PAL.goreApple);
    PixelGFX.circleFill(ctx, p3X + 13, panelsY + 16, 5, PAL.goreApple);
    PixelGFX.fineLine(ctx, (p3X + 6) * S + 1, (panelsY + 14) * S, (p3X + 6) * S + 1, (panelsY + 18) * S, '#ff758f', 2);
    // Hoja verde y pedúnculo de la manzana
    PixelGFX.fineLine(ctx, (p3X + 12) * S, (panelsY + 10) * S, (p3X + 15) * S, (panelsY + 7) * S, PAL.goreOchre, 2);
    PixelGFX.ellipseFill(ctx, p3X + 9, panelsY + 7, 2, 3, '#267339');

    // --- TIPOGRAFÍA INFERIOR GORE (con separación limpia para la tilde de REGIÓN) ---
    drawPixelText3x5(ctx, 'GOBIERNO REGIONAL', baseX + 10, baseY + 33, PAL.goreNavy, 4);
    drawPixelText3x5(ctx, 'REGIÓN DE O\'HIGGINS', baseX + 8, baseY + 43, PAL.goreOchre, 4);
  }

  // ==========================================================================
  // 3. LOGO INFERIOR CENTRAL: CORE O'HIGGINS (Consejo Regional)
  // Estatua ecuestre de O'Higgins + letras 'CORE' en bronce + subtítulo
  // ==========================================================================
  function drawCORELogo(ctx, baseX, baseY) {
    const S = ns.SCALE || 3;
    // 1. Estatua ecuestre en Pixel-Art a la izquierda (suavizada con Scale3x)
    PixelGFX.drawSprite(ctx, coreStatueSprite, baseX + 2, baseY);
    // Espada extendida hacia arriba-izquierda en trazo fino
    PixelGFX.fineLine(ctx, (baseX + 12) * S, (baseY + 3) * S, (baseX + 2) * S, baseY * S, '#5d665e', 2);
    PixelGFX.fineLine(ctx, (baseX + 12) * S, (baseY + 3) * S - 1, (baseX + 2) * S, baseY * S - 1, '#8a948b', 1);

    // 2. Sigla 'CORE' grande y gruesa en color Bronce (#945f36) a la derecha de la estatua
    const cX = baseX + 34;
    const cY = baseY + 6;

    // Letra 'C' gruesa (11x14)
    drawThickArc(ctx, cX + 6, cY + 7, 7, 3, 45, 315, PAL.coreBronze);

    // Letra 'O' gruesa (13x14)
    drawThickArc(ctx, cX + 20, cY + 7, 7, 3, 0, 360, PAL.coreBronze);

    // Letra 'R' gruesa (11x14) con panza redonda y pata diagonal suave
    const rX = cX + 30;
    PixelGFX.rect(ctx, rX, cY, 4, 14, PAL.coreBronze);
    PixelGFX.rect(ctx, rX + 3, cY, 4, 3, PAL.coreBronze);
    PixelGFX.rect(ctx, rX + 3, cY + 6, 4, 3, PAL.coreBronze);
    drawThickArc(ctx, rX + 6, cY + 4.5, 4.5, 1.5, 270, 90, PAL.coreBronze);
    for (let t = -4; t <= 4; t++) {
      PixelGFX.fineLine(ctx, (rX + 5) * S + t, (cY + 8) * S, (rX + 9) * S + t, (cY + 14) * S - 1, PAL.coreBronze, 1);
    }

    // Letra 'E' gruesa (10x14)
    const eX = cX + 43;
    PixelGFX.rect(ctx, eX, cY, 4, 14, PAL.coreBronze);
    PixelGFX.rect(ctx, eX + 4, cY, 6, 3, PAL.coreBronze);
    PixelGFX.rect(ctx, eX + 4, cY + 5.5, 5, 3, PAL.coreBronze);
    PixelGFX.rect(ctx, eX + 4, cY + 11, 6, 3, PAL.coreBronze);

    // 3. Subtítulo 'CONSEJO REGIONAL' + Línea gris + 'REGIÓN DE O'HIGGINS'
    drawPixelText3x5(ctx, 'CONSEJO REGIONAL', baseX + 30, baseY + 24, PAL.coreStatueDark, 4);
    PixelGFX.fineRect(ctx, (baseX + 4) * S, (baseY + 32) * S, 90 * S, 4, '#9da3a6');
    drawPixelText3x5(ctx, 'REGIÓN DE O\'HIGGINS', baseX + 10, baseY + 38, PAL.coreStatueDark, 4);
  }

  // ==========================================================================
  // 4. LOGO INFERIOR DERECHO: ANID (Ministerio de Ciencia / Gobierno de Chile)
  // Bloque Bicolor Azul/Rojo con Escudo + Bloque Rojo 'ANID'
  // ==========================================================================
  function drawANIDLogo(ctx, baseX, baseY) {
    const S = ns.SCALE || 3;
    const logoY = baseY + 2;
    const logoH = 44;

    // --- BLOQUE IZQUIERDO: MINISTERIO DE CIENCIA (Azul + Rojo) ---
    const b1X = baseX + 6;
    const blueW = 19;
    const red1W = 31;

    // Franja Azul con el Escudo de Chile en Pixel-Art blanco
    PixelGFX.rect(ctx, b1X, logoY, blueW, logoH, PAL.anidBlue);
    PixelGFX.drawSprite(ctx, chileCoatSprite, b1X + 2, logoY + 4);
    // Barrita blanca inferior en la franja azul (clásica del logo de Gobierno de Chile)
    PixelGFX.rect(ctx, b1X + 2, logoY + 39, blueW - 4, 2, PAL.white);

    // Franja Roja del Ministerio de Ciencia
    const r1X = b1X + blueW;
    PixelGFX.rect(ctx, r1X, logoY, red1W, logoH, PAL.anidRed);

    // Texto pixel-art blanco dentro del bloque del Ministerio
    drawPixelText3x5(ctx, 'MIN.', r1X + 3, logoY + 4, PAL.white, 4);
    drawPixelText3x5(ctx, 'CIENCIA', r1X + 2, logoY + 11, PAL.white, 4);
    // Líneas limpias de subtítulo institucional ("Tecnología, Conocimiento e Innovación")
    PixelGFX.fineRect(ctx, (r1X + 3) * S, (logoY + 19) * S, 24 * S, 3, PAL.white);
    PixelGFX.fineRect(ctx, (r1X + 3) * S, (logoY + 23) * S, 26 * S, 3, PAL.white);
    PixelGFX.fineRect(ctx, (r1X + 3) * S, (logoY + 27) * S, 21 * S, 3, PAL.white);
    // Pie "Gobierno de Chile"
    PixelGFX.fineRect(ctx, (r1X + 3) * S, (logoY + 39) * S, 25 * S, 4, PAL.white);

    // --- CALLE BLANCA SEPARADORA (4px) ---
    const r2X = r1X + red1W + 4;
    const red2W = 34;

    // --- BLOQUE DERECHO: ANID (Agencia Nacional de Investigación y Desarrollo) ---
    PixelGFX.rect(ctx, r2X, logoY, red2W, logoH, PAL.anidRed);

    // Sigla 'ANID' en tipografía geométrica nítida 960x540
    const ax = (r2X + 3) * S;
    const ay = (logoY + 4) * S;
    // 'A'
    PixelGFX.fineLine(ctx, ax + 6, ay, ax + 1, ay + 17, PAL.white, 3);
    PixelGFX.fineLine(ctx, ax + 8, ay, ax + 13, ay + 17, PAL.white, 3);
    PixelGFX.fineRect(ctx, ax + 3, ay + 10, 9, 3, PAL.white);
    // 'N'
    const nx = ax + 20;
    PixelGFX.fineRect(ctx, nx, ay, 4, 18, PAL.white);
    PixelGFX.fineLine(ctx, nx + 2, ay + 1, nx + 13, ay + 16, PAL.white, 3);
    PixelGFX.fineRect(ctx, nx + 12, ay, 4, 18, PAL.white);
    // 'I'
    const ix = nx + 21;
    PixelGFX.fineRect(ctx, ix, ay, 4, 18, PAL.white);
    // 'D'
    const dx = ix + 9;
    PixelGFX.fineRect(ctx, dx, ay, 4, 18, PAL.white);
    PixelGFX.fineRect(ctx, dx + 4, ay, 5, 3, PAL.white);
    PixelGFX.fineRect(ctx, dx + 4, ay + 15, 5, 3, PAL.white);
    drawThickArc(ctx, (dx + 8) / S, (ay + 9) / S, 3.0, 1.6, 270, 90, PAL.white);

    // Subtítulo "Agencia Nacional de Investigación y Desarrollo"
    PixelGFX.fineRect(ctx, (r2X + 3) * S, (logoY + 13) * S, 21 * S, 3, PAL.white);
    PixelGFX.fineRect(ctx, (r2X + 3) * S, (logoY + 17) * S, 26 * S, 3, PAL.white);
    PixelGFX.fineRect(ctx, (r2X + 3) * S, (logoY + 21) * S, 28 * S, 3, PAL.white);
    PixelGFX.fineRect(ctx, (r2X + 3) * S, (logoY + 25) * S, 23 * S, 3, PAL.white);

    // Pie "Gobierno de Chile"
    PixelGFX.fineRect(ctx, (r2X + 3) * S, (logoY + 39) * S, 27 * S, 4, PAL.white);
  }

  /**
   * Renderiza la Escena 10 de Cierre Institucional (52.0s .. 58.0s)
   */
  function render(ctx, time) {
    const localTime = Math.max(0, time - 52.0);

    // 1. Fondo Blanco Luminoso de Cierre Institucional con Marco Científico
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, '#f8fafc');
    PixelGFX.rectOutline(ctx, 4, 4, WIDTH - 8, HEIGHT - 8, PAL.labWallLine);
    PixelGFX.rectOutline(ctx, 6, 6, WIDTH - 12, HEIGHT - 12, '#e2e8f0');

    // Pétalos de cerezo (Sakura) y partículas bioluminiscentes flotando suavemente en los bordes
    for (let i = 0; i < 8; i++) {
      const px = Math.round((i * 43 + time * 10) % (WIDTH - 20)) + 10;
      const py = Math.round((i * 29 + time * 8) % (HEIGHT - 16)) + 8;
      // Mantener despejada el área central de los logos
      if (px > 26 && px < WIDTH - 26 && py > 12 && py < HEIGHT - 12) continue;
      const col = i % 2 === 0 ? PAL.sakuraLight : PAL.neonCyan;
      PixelGFX.pset(ctx, px, py, col);
    }

    // 2. Línea Divisoria Institucional con Detalle Botánico/Científico (y = 95)
    // Se dibuja antes del logo CEAF para que la esfera naranja rebote y proyecte sombra sobre ella
    const lineProgress = MathUtil.easeOutCubic(MathUtil.clamp((localTime - 0.6) / 0.8, 0, 1));
    if (lineProgress > 0.01) {
      const halfSpan = Math.round(138 * lineProgress);
      PixelGFX.line(ctx, 160 - halfSpan, 95, 160 + halfSpan, 95, PAL.labWallLine);
      PixelGFX.line(ctx, 160 - Math.round(halfSpan * 0.35), 95, 160 + Math.round(halfSpan * 0.35), 95, PAL.ceafGreen);
      PixelGFX.pset(ctx, 160, 95, PAL.ceafFruit);
    }

    // 3. LOGO PRINCIPAL EN LA MITAD SUPERIOR: CEAF (Centro de Estudios Avanzados en Fruticultura)
    drawCEAFMainLogo(ctx, localTime, time);

    // 4. FILA INFERIOR DE LOGOS CORPORATIVOS (GORE, CORE y ANID)
    // Aparecen escalonadamente con efecto Bayer-dither entre localTime = 0.9s y 2.2s
    const gAlpha = MathUtil.clamp((localTime - 0.85) / 0.6, 0, 1);
    const cAlpha = MathUtil.clamp((localTime - 1.15) / 0.6, 0, 1);
    const aAlpha = MathUtil.clamp((localTime - 1.45) / 0.6, 0, 1);

    if (gAlpha > 0.05) {
      drawGORELogo(ctx, 10, 108);
    }
    if (cAlpha > 0.05) {
      drawCORELogo(ctx, 112, 112);
    }
    if (aAlpha > 0.05) {
      drawANIDLogo(ctx, 214, 110);
    }
  }

  ns.LogoScene = {
    render
  };
})(window.MicroCosmos);
