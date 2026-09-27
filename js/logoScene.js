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
  // MICRO-TIPOGRAFÍA PIXEL-ART 3x5 (NÍTIDA SIN DIFUMINADO)
  // ==========================================================================
  const FONT_3X5 = {
    'A': ['010', '101', '111', '101', '101'],
    'B': ['110', '101', '110', '101', '110'],
    'C': ['011', '100', '100', '100', '011'],
    'D': ['110', '101', '101', '101', '110'],
    'E': ['111', '100', '110', '100', '111'],
    'F': ['111', '100', '110', '100', '100'],
    'G': ['011', '100', '101', '101', '011'],
    'H': ['101', '101', '111', '101', '101'],
    'I': ['111', '010', '010', '010', '111'],
    'J': ['001', '001', '001', '101', '010'],
    'K': ['101', '101', '110', '101', '101'],
    'L': ['100', '100', '100', '100', '111'],
    'M': ['101', '111', '111', '101', '101'],
    'N': ['101', '111', '111', '111', '101'],
    'O': ['010', '101', '101', '101', '010'],
    'P': ['110', '101', '110', '100', '100'],
    'Q': ['010', '101', '101', '111', '011'],
    'R': ['110', '101', '110', '101', '101'],
    'S': ['011', '100', '010', '001', '110'],
    'T': ['111', '010', '010', '010', '010'],
    'U': ['101', '101', '101', '101', '111'],
    'V': ['101', '101', '101', '101', '010'],
    'W': ['101', '101', '111', '111', '101'],
    'X': ['101', '101', '010', '101', '101'],
    'Y': ['101', '101', '010', '010', '010'],
    'Z': ['111', '001', '010', '100', '111'],
    '\'': ['010', '010', '000', '000', '000'],
    '.': ['000', '000', '000', '000', '010'],
    '-': ['000', '000', '111', '000', '000'],
    ' ': ['000', '000', '000', '000', '000']
  };

  function drawPixelText3x5(ctx, text, x, y, color, spacing = 4) {
    const upper = text.toUpperCase();
    let cx = Math.round(x);
    const cy = Math.round(y);

    for (let i = 0; i < upper.length; i++) {
      let ch = upper[i];
      let hasAccent = false;
      if (ch === 'Ó') { ch = 'O'; hasAccent = true; }
      else if (ch === 'Í') { ch = 'I'; hasAccent = true; }
      else if (ch === 'Á') { ch = 'A'; hasAccent = true; }
      else if (ch === 'É') { ch = 'E'; hasAccent = true; }
      else if (ch === 'Ú') { ch = 'U'; hasAccent = true; }

      const glyph = FONT_3X5[ch] || FONT_3X5[' '];
      if (hasAccent) {
        PixelGFX.pset(ctx, cx + 1, cy - 2, color);
        PixelGFX.pset(ctx, cx + 2, cy - 3, color);
      }
      for (let r = 0; r < 5; r++) {
        const rowStr = glyph[r];
        for (let c = 0; c < 3; c++) {
          if (rowStr[c] === '1') {
            PixelGFX.pset(ctx, cx + c, cy + r, color);
          }
        }
      }
      cx += spacing;
    }
  }

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
   * Dibuja un anillo circular o arco con grosor definido en Pixel-Art
   */
  function drawThickArc(ctx, cx, cy, rOuter, rInner, startDeg, endDeg, color) {
    const rOut2 = rOuter * rOuter;
    const rIn2 = rInner * rInner;

    for (let dy = -rOuter; dy <= rOuter; dy++) {
      for (let dx = -rOuter; dx <= rOuter; dx++) {
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
            PixelGFX.pset(ctx, Math.round(cx + dx), Math.round(cy + dy), color);
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
    const growT = MathUtil.easeOutCubic(MathUtil.clamp(localTime / 1.1, 0, 1));
    const letterAlpha = MathUtil.smoothstep(0.15, 0.85, localTime);

    const centerY = 48;
    const rOut = 13;
    const rIn = 9;

    if (letterAlpha > 0.05) {
      // --- Letra 'c' geométrica (gris antracita #55565a) ---
      const cX = 96;
      drawThickArc(ctx, cX, centerY, rOut, rIn, 42, 318, PAL.ceafGray);

      // --- Letra 'e' geométrica con barra diagonal interna ---
      const eX = 130;
      drawThickArc(ctx, eX, centerY, rOut, rIn, 38, 325, PAL.ceafGray);
      // Travesaño diagonal característico de la 'e' de CEAF (desde el centro-izquierda al borde superior derecho)
      for (let t = -1; t <= 2; t++) {
        PixelGFX.line(ctx, eX - 3 + t, centerY + 3, eX + 9 + t, centerY - 9, PAL.ceafGray);
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
    PixelGFX.line(ctx, fStemX + 1, stemTopY, fStemX + 1, stemBottomY - 1, PAL.ceafGreenLight);

    if (growT > 0.45) {
      // Ligero rebote elástico de la rama media cuando el fruto se desprende (localTime ~ 3.1s)
      let branchSpringY = 0;
      if (localTime > 3.1 && localTime < 3.9) {
        const bt = localTime - 3.1;
        branchSpringY = Math.round(-Math.sin(bt * 18) * Math.exp(-bt * 4) * 2.2);
      }

      // Arco superior de la 'f' (curva hacia arriba a la derecha, dejando aire bajo el borde superior)
      drawThickArc(ctx, fStemX + 17, 28, 17, 13, 180, 272, PAL.ceafGreen);
      PixelGFX.rect(ctx, fStemX + 15, 11, 5, 4, PAL.ceafGreen);

      // Arco medio (travesaño curvo de la 'f')
      drawThickArc(ctx, fStemX + 17, 43 + branchSpringY, 17, 13, 185, 272, PAL.ceafGreen);
      PixelGFX.rect(ctx, fStemX + 15, 26 + branchSpringY, 5, 4, PAL.ceafGreen);
    }

    // Hoja verde lanceolada inclinada hacia arriba-izquierda
    if (growT > 0.6) {
      const leafX = fStemX - 8;
      const leafY = 22;
      for (let dy = -8; dy <= 8; dy++) {
        for (let dx = -10; dx <= 10; dx++) {
          const rx = dx * 0.76 + dy * 0.64;
          const ry = -dx * 0.64 + dy * 0.76;
          if ((rx * rx) / 52 + (ry * ry) / 13 <= 1.0) {
            const col = ry < -1.0 ? PAL.ceafGreenLight : PAL.ceafGreen;
            PixelGFX.pset(ctx, Math.round(leafX + dx), Math.round(leafY + dy), col);
          }
        }
      }
      PixelGFX.pset(ctx, leafX - 7, leafY - 6, PAL.ceafGreen);
      PixelGFX.pset(ctx, leafX - 8, leafY - 7, PAL.ceafGreen);
    }

    // Fruto circular rojo-terracota a la derecha del tallo bajo el arco de la 'f'
    // Fase 1 (0.72..2.7s): Crece y brilla junto a la 'f'
    // Fase 2 (2.7..3.1s): Pequeño temblor de madurez antes de soltarse
    // Fase 3 (3.1s+): Cae y rebota (bouncing con squash & stretch) moviéndose hacia la derecha sobre la línea divisoria (y=95)
    if (growT > 0.72) {
      const startX = fStemX + 20; // 208
      const startY = 48;
      const groundY = 87; // Con radio 8, la base toca exactamente la línea divisoria y = 95

      let fruitX = startX;
      let fruitY = startY;
      const fruitR = Math.round(MathUtil.lerp(1, 8, MathUtil.invLerp(0.72, 1.0, growT)));
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
        const impactTimes = [
          { t: 0.48, x: 230 },
          { t: 1.18, x: 258 },
          { t: 1.74, x: 282 },
          { t: 2.18, x: 300 },
          { t: 2.52, x: 313 }
        ];
        for (let i = 0; i < impactTimes.length; i++) {
          const dtImp = Math.abs(tDrop - impactTimes[i].t);
          if (dtImp < 0.065) {
            // Achatamiento elástico al tocar el suelo
            rx = i < 2 ? 10 : 9;
            ry = i < 2 ? 6 : 7;
            fruitY = 95 - ry;
          }
          // Destello/partículas de impacto en el punto de rebote
          const sinceImp = tDrop - impactTimes[i].t;
          if (sinceImp >= 0 && sinceImp < 0.24) {
            impactBounce = { x: impactTimes[i].x, p: sinceImp / 0.24, idx: i };
          }
        }

        // Sombra dinámica proyectada sobre la línea divisoria (y = 95)
        if (fruitX - rx < WIDTH - 6) {
          const heightAboveGround = Math.max(0, groundY - fruitY);
          const shadowHalfW = Math.max(2, Math.round(7 - heightAboveGround * 0.12));
          PixelGFX.line(
            ctx,
            Math.max(22, fruitX - shadowHalfW),
            95,
            Math.min(WIDTH - 8, fruitX + shadowHalfW),
            95,
            '#8fa3b8'
          );
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

      // Dibujar la esfera naranja (dentro del marco visible del lienzo)
      if (fruitX - rx < WIDTH - 5) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(6, 6, WIDTH - 12, HEIGHT - 12);
        ctx.clip();

        if (rx === ry) {
          PixelGFX.circleFill(ctx, fruitX, fruitY, fruitR, PAL.ceafFruit);
        } else {
          PixelGFX.ellipseFill(ctx, fruitX, fruitY, rx, ry, PAL.ceafFruit);
        }

        // Brillo especular que rota suavemente mientras la esfera avanza y rebota
        if (fruitR >= 6) {
          const hx = fruitX + Math.round(Math.cos(rotAngle - 2.35) * 2.8);
          const hy = fruitY + Math.round(Math.sin(rotAngle - 2.35) * 2.4);
          PixelGFX.circleFill(ctx, hx, hy, 2, PAL.ceafFruitLight);
          PixelGFX.pset(ctx, hx - 1, hy - 1, PAL.white);
        }
        ctx.restore();
      }

      // Destello sutil inicial sobre el fruto antes de que empiece a caer
      if (localTime > 1.2 && localTime < 2.6) {
        const sparklePhase = (localTime - 1.2) % 1.4;
        if (sparklePhase < 0.55) {
          const sx = startX + 3;
          const sy = startY - 7;
          PixelGFX.pset(ctx, sx, sy, PAL.starGold);
          PixelGFX.line(ctx, sx - 2, sy, sx + 2, sy, PAL.white);
          PixelGFX.line(ctx, sx, sy - 2, sx, sy + 2, PAL.white);
        }
      }
    }
  }

  // ==========================================================================
  // 2. LOGO INFERIOR IZQUIERDO: GORE O'HIGGINS (Gobierno Regional)
  // Tres paneles verticales (Ola costera, Cordillera/Río, Manzana/Agro) + Texto
  // ==========================================================================
  function drawGORELogo(ctx, baseX, baseY) {
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
    // Gaviotas celestes
    PixelGFX.line(ctx, p1X + 6, panelsY + 7, p1X + 8, panelsY + 7, PAL.goreSky);
    PixelGFX.line(ctx, p1X + 11, panelsY + 9, p1X + 13, panelsY + 9, PAL.goreSky);
    // Ola azul curvada y mar inferior
    PixelGFX.rect(ctx, p1X, panelsY + 17, pW, 10, PAL.goreWaveMid);
    PixelGFX.ellipseFill(ctx, p1X + 7, panelsY + 16, 7, 5, PAL.goreWaveDark);
    PixelGFX.ellipseFill(ctx, p1X + 3, panelsY + 16, 3, 2, PAL.white);
    PixelGFX.ellipseFill(ctx, p1X + 3, panelsY + 16, 2, 1, PAL.goreWaveLight);

    // --- PANEL 2: CORDILLERA Y RÍO DEL VALLE ---
    const p2X = panelsStartX + pW + gap;
    PixelGFX.rect(ctx, p2X, panelsY, pW, pH, PAL.goreSky);
    PixelGFX.circleFill(ctx, p2X + 8, panelsY + 5, 5, PAL.white);
    // Cumbres grises nevadas al fondo
    for (let x = 0; x < pW; x++) {
      const mH = Math.abs(x - 9);
      PixelGFX.line(ctx, p2X + x, panelsY + 6 + Math.floor(mH * 0.5), p2X + x, panelsY + 14, '#c7ccd1');
    }
    // Cerro café andino
    for (let x = 0; x < pW; x++) {
      const hillY = panelsY + 11 + Math.floor(Math.abs(x - 7) * 0.35);
      PixelGFX.line(ctx, p2X + x, hillY, p2X + x, panelsY + pH - 1, PAL.goreMountain);
      PixelGFX.pset(ctx, p2X + x, hillY, PAL.white);
    }
    // Río/camino naranja serpenteante en el valle
    PixelGFX.rect(ctx, p2X, panelsY + 22, pW, 5, '#f4976c');
    PixelGFX.line(ctx, p2X + 2, panelsY + 16, p2X + 7, panelsY + 17, PAL.goreRiver);
    PixelGFX.line(ctx, p2X + 7, panelsY + 17, p2X + 2, panelsY + 19, PAL.goreRiver);
    PixelGFX.line(ctx, p2X + 2, panelsY + 19, p2X + 14, panelsY + 21, PAL.goreRiver);
    PixelGFX.rect(ctx, p2X, panelsY + 21, pW, 2, PAL.goreRiver);

    // --- PANEL 3: FRUTICULTURA (MANZANA ROJA Y HOJA VERDE) ---
    const p3X = panelsStartX + (pW + gap) * 2;
    PixelGFX.rect(ctx, p3X, panelsY, pW, pH, PAL.goreSky);
    PixelGFX.circleFill(ctx, p3X + 4, panelsY + 8, 5, PAL.white);
    PixelGFX.circleFill(ctx, p3X + 12, panelsY + 7, 5, PAL.white);
    // Colinas verdes agrícolas
    PixelGFX.rect(ctx, p3X, panelsY + 15, pW, 12, '#267339');
    PixelGFX.rect(ctx, p3X, panelsY + 20, pW, 7, '#39b54a');
    // Manzana roja icónica en primer plano
    PixelGFX.circleFill(ctx, p3X + 10, panelsY + 16, 6, PAL.goreApple);
    PixelGFX.circleFill(ctx, p3X + 13, panelsY + 16, 5, PAL.goreApple);
    PixelGFX.line(ctx, p3X + 6, panelsY + 14, p3X + 6, panelsY + 18, '#ff758f');
    // Hoja verde y pedúnculo de la manzana
    PixelGFX.line(ctx, p3X + 12, panelsY + 10, p3X + 15, panelsY + 7, PAL.goreOchre);
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
    // 1. Estatua ecuestre en Pixel-Art a la izquierda
    ctx.drawImage(coreStatueSprite, baseX + 2, baseY);
    // Espada extendida hacia arriba-izquierda
    PixelGFX.line(ctx, baseX + 12, baseY + 3, baseX + 2, baseY, '#5d665e');

    // 2. Sigla 'CORE' grande y gruesa en color Bronce (#945f36) a la derecha de la estatua
    const cX = baseX + 34;
    const cY = baseY + 6;

    // Letra 'C' gruesa (11x14)
    drawThickArc(ctx, cX + 6, cY + 7, 7, 3, 45, 315, PAL.coreBronze);

    // Letra 'O' gruesa (13x14)
    drawThickArc(ctx, cX + 20, cY + 7, 7, 3, 0, 360, PAL.coreBronze);

    // Letra 'R' gruesa (11x14)
    const rX = cX + 30;
    PixelGFX.rect(ctx, rX, cY, 4, 14, PAL.coreBronze);
    PixelGFX.rect(ctx, rX + 4, cY, 5, 3, PAL.coreBronze);
    PixelGFX.rect(ctx, rX + 7, cY + 2, 3, 5, PAL.coreBronze);
    PixelGFX.rect(ctx, rX + 4, cY + 6, 5, 3, PAL.coreBronze);
    PixelGFX.line(ctx, rX + 5, cY + 9, rX + 9, cY + 13, PAL.coreBronze);
    PixelGFX.line(ctx, rX + 6, cY + 9, rX + 10, cY + 13, PAL.coreBronze);
    PixelGFX.line(ctx, rX + 7, cY + 9, rX + 10, cY + 12, PAL.coreBronze);

    // Letra 'E' gruesa (10x14)
    const eX = cX + 43;
    PixelGFX.rect(ctx, eX, cY, 4, 14, PAL.coreBronze);
    PixelGFX.rect(ctx, eX + 4, cY, 6, 3, PAL.coreBronze);
    PixelGFX.rect(ctx, eX + 4, cY + 5, 5, 3, PAL.coreBronze);
    PixelGFX.rect(ctx, eX + 4, cY + 11, 6, 3, PAL.coreBronze);

    // 3. Subtítulo 'CONSEJO REGIONAL' + Línea gris + 'REGIÓN DE O'HIGGINS'
    drawPixelText3x5(ctx, 'CONSEJO REGIONAL', baseX + 30, baseY + 24, PAL.coreStatueDark, 4);
    PixelGFX.rect(ctx, baseX + 4, baseY + 32, 90, 2, '#9da3a6');
    drawPixelText3x5(ctx, 'REGIÓN DE O\'HIGGINS', baseX + 10, baseY + 38, PAL.coreStatueDark, 4);
  }

  // ==========================================================================
  // 4. LOGO INFERIOR DERECHO: ANID (Ministerio de Ciencia / Gobierno de Chile)
  // Bloque Bicolor Azul/Rojo con Escudo + Bloque Rojo 'ANID'
  // ==========================================================================
  function drawANIDLogo(ctx, baseX, baseY) {
    const logoY = baseY + 2;
    const logoH = 44;

    // --- BLOQUE IZQUIERDO: MINISTERIO DE CIENCIA (Azul + Rojo) ---
    const b1X = baseX + 6;
    const blueW = 19;
    const red1W = 31;

    // Franja Azul con el Escudo de Chile en Pixel-Art blanco
    PixelGFX.rect(ctx, b1X, logoY, blueW, logoH, PAL.anidBlue);
    ctx.drawImage(chileCoatSprite, b1X + 2, logoY + 4);
    // Barrita blanca inferior en la franja azul (clásica del logo de Gobierno de Chile)
    PixelGFX.rect(ctx, b1X + 2, logoY + 39, blueW - 4, 2, PAL.white);

    // Franja Roja del Ministerio de Ciencia
    const r1X = b1X + blueW;
    PixelGFX.rect(ctx, r1X, logoY, red1W, logoH, PAL.anidRed);

    // Texto pixel-art blanco dentro del bloque del Ministerio
    drawPixelText3x5(ctx, 'MIN.', r1X + 3, logoY + 4, PAL.white, 4);
    drawPixelText3x5(ctx, 'CIENCIA', r1X + 3, logoY + 11, PAL.white, 4);
    // Líneas limpias de subtítulo institucional ("Tecnología, Conocimiento e Innovación")
    PixelGFX.rect(ctx, r1X + 3, logoY + 19, 24, 2, PAL.white);
    PixelGFX.rect(ctx, r1X + 3, logoY + 23, 26, 2, PAL.white);
    PixelGFX.rect(ctx, r1X + 3, logoY + 27, 21, 2, PAL.white);
    // Pie "Gobierno de Chile"
    PixelGFX.rect(ctx, r1X + 3, logoY + 39, 25, 2, PAL.white);

    // --- CALLE BLANCA SEPARADORA (4px) ---
    const r2X = r1X + red1W + 4;
    const red2W = 34;

    // --- BLOQUE DERECHO: ANID (Agencia Nacional de Investigación y Desarrollo) ---
    PixelGFX.rect(ctx, r2X, logoY, red2W, logoH, PAL.anidRed);

    // Sigla 'ANID' en tipografía pixel-art gruesa (5x6 por letra)
    const ax = r2X + 3;
    const ay = logoY + 4;
    // 'A'
    PixelGFX.rect(ctx, ax + 1, ay, 3, 1, PAL.white);
    PixelGFX.rect(ctx, ax, ay + 1, 2, 5, PAL.white);
    PixelGFX.rect(ctx, ax + 3, ay + 1, 2, 5, PAL.white);
    PixelGFX.rect(ctx, ax + 1, ay + 3, 3, 1, PAL.white);
    // 'N'
    const nx = ax + 7;
    PixelGFX.rect(ctx, nx, ay, 2, 6, PAL.white);
    PixelGFX.pset(ctx, nx + 2, ay + 1, PAL.white);
    PixelGFX.pset(ctx, nx + 2, ay + 2, PAL.white);
    PixelGFX.pset(ctx, nx + 3, ay + 3, PAL.white);
    PixelGFX.pset(ctx, nx + 3, ay + 4, PAL.white);
    PixelGFX.rect(ctx, nx + 4, ay, 2, 6, PAL.white);
    // 'I'
    const ix = nx + 8;
    PixelGFX.rect(ctx, ix, ay, 2, 6, PAL.white);
    // 'D'
    const dx = ix + 4;
    PixelGFX.rect(ctx, dx, ay, 2, 6, PAL.white);
    PixelGFX.rect(ctx, dx + 2, ay, 2, 1, PAL.white);
    PixelGFX.rect(ctx, dx + 2, ay + 5, 2, 1, PAL.white);
    PixelGFX.rect(ctx, dx + 4, ay + 1, 2, 4, PAL.white);

    // Subtítulo "Agencia Nacional de Investigación y Desarrollo"
    PixelGFX.rect(ctx, r2X + 3, logoY + 13, 21, 2, PAL.white);
    PixelGFX.rect(ctx, r2X + 3, logoY + 17, 26, 2, PAL.white);
    PixelGFX.rect(ctx, r2X + 3, logoY + 21, 28, 2, PAL.white);
    PixelGFX.rect(ctx, r2X + 3, logoY + 25, 23, 2, PAL.white);

    // Pie "Gobierno de Chile"
    PixelGFX.rect(ctx, r2X + 3, logoY + 39, 27, 2, PAL.white);
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
