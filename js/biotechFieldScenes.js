/**
 * biotechFieldScenes.js
 * Renderiza las 3 escenas extendidas del ciclo de investigación biotecnológica (27.4s .. 46.8s):
 *   - Escena 6 (27.4s .. 33.8s): Trabajo Biotecnológico en Laboratorio (Micropipeteo, PCR, Electroforesis e In Vitro)
 *   - Escena 7 (33.8s .. 40.4s): Invernadero Experimental y Riego en Muestras de Campo (Rizotrón y Sensores)
 *   - Escena 8 (40.4s .. 46.8s): Estación de Bioinformática y Genómica Computacional (Alineamiento ADN, Heatmap RNA-seq, Proteína 3D)
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  const { WIDTH, HEIGHT, PAL, PixelGFX, MathUtil, Sprites } = ns;

  // Lienzos fuera de pantalla para transiciones suaves Bayer-dither entre escenas
  const sceneCanvasA = document.createElement('canvas');
  sceneCanvasA.width = WIDTH;
  sceneCanvasA.height = HEIGHT;
  const ctxA = sceneCanvasA.getContext('2d');
  ctxA.imageSmoothingEnabled = false;

  const sceneCanvasB = document.createElement('canvas');
  sceneCanvasB.width = WIDTH;
  sceneCanvasB.height = HEIGHT;
  const ctxB = sceneCanvasB.getContext('2d');
  ctxB.imageSmoothingEnabled = false;

  // ==========================================================================
  // SPRITES COMPILADOS PARA MANOS CON GUANTES, REGADERA Y TECLADO
  // ==========================================================================
  const CHAR_MAP = {
    'H': PAL.hairDark,
    'h': PAL.hairMid,
    'l': PAL.hairLight,
    's': PAL.hairShine,
    'o': '#7d4038',       // contorno piel
    'd': PAL.skinDeep,
    'k': PAL.skinShadow,
    'f': '#f5b59d',       // piel iluminada
    'b': '#f2788b',       // rubor
    'C': PAL.neonCyan,
    'O': '#64748b',       // contorno bata
    'S': '#cbd5e1',       // sombra bata
    'B': '#f1f5f9',       // medio bata
    'W': '#ffffff',       // luz bata
    't': '#0d9488',       // blusa turquesa
    'T': '#0f766e',       // sombra blusa
    'Y': PAL.starGold,
    'g': PAL.gloveOutline,
    'G': PAL.gloveCyan,
    'L': PAL.gloveHighlight,
    'P': PAL.pipetteBody,
    'p': PAL.pipetteLight,
    'M': PAL.metalDark,
    'm': PAL.metalLight,
    'V': '#2d6a4f',       // chaleco botánico verde
    'v': '#40916c'        // luz chaleco botánico
  };

  // Mano Derecha con Guante de Nitrilo Cian sujetando Micropipeta de Precisión (16x22)
  const glovedPipetteHandSprite = Sprites.compileSprite([
    '......gGGGg.....',
    '.....gGLLLGg....',
    '.....gpppppG....',
    '....gGPPPPPGg...',
    '...gGLLPPPGGGg..',
    '...gGGGPPPGGGg..',
    '...gGGGPPPggGg..',
    '....ggGPPPgggg..',
    '......mPPPm.....',
    '......mPPPm.....',
    '.......mPm......',
    '.......mPm......',
    '.......mCm......',
    '........m.......',
    '........m.......',
    '........C.......',
    '........C.......',
    '................',
    '................',
    '................',
    '................',
    '................'
  ], CHAR_MAP);

  // Mano Izquierda con Guante de Nitrilo Cian sosteniendo un tubo Eppendorf / gradilla (13x10)
  const glovedRackHandSprite = Sprites.compileSprite([
    '....ggggg....',
    '..ggGLLLGg...',
    '.gGLLLLLLGgOO',
    'gGLLGGGGGGOWW',
    'gGGGggggGGOWB',
    '.gggg..gGGOWB',
    '........ggOSS',
    '..........OOO',
    '.............',
    '.............'
  ], CHAR_MAP);

  // Mano en Invernadero sujetando el asa superior de la regadera (12x9)
  const handWateringTopSprite = Sprites.compileSprite([
    '...ooooo....',
    '..offfffo...',
    '.okfffffkoOO',
    '.offkkkkkOWW',
    '.okkodddoOWB',
    '..oookkdoOSS',
    '....oooo.OOO',
    '............',
    '............'
  ], CHAR_MAP);

  // Mano en Invernadero sosteniendo el cuerpo/lanza de la regadera (12x9)
  const handWateringSideSprite = Sprites.compileSprite([
    '....oooo....',
    '..ooffffo...',
    '.okffffffoOO',
    '.offkkkkkOWW',
    '..ookkkddOWB',
    '...oookdoOSS',
    '.....ooo.OOO',
    '............',
    '............'
  ], CHAR_MAP);

  // Mano Bioinformática tecleando sobre teclado mecánico (13x8) - Frame A
  const handTypingSpriteA = Sprites.compileSprite([
    '....ooooo....',
    '..oofffffo...',
    '.ookffffffoOO',
    'offokfokkkOWW',
    'oo..oo.ookOWB',
    '........ooOSS',
    '..........OOO',
    '.............'
  ], CHAR_MAP);

  // Mano Bioinformática tecleando sobre teclado mecánico (13x8) - Frame B
  const handTypingSpriteB = Sprites.compileSprite([
    '....ooooo....',
    '..oofffffo...',
    '.ookffffffoOO',
    '.offfokfkkOWW',
    '.oo..oo.ooOWB',
    '..........OSS',
    '..........OOO',
    '.............'
  ], CHAR_MAP);

  // Mano Bioinformática señalando la pantalla con el hallazgo genómico (13x10)
  const handPointScreenSprite = Sprites.compileSprite([
    'oo...........',
    'ofoo.........',
    '.offooo......',
    '..okfffko....',
    '..offfffkoOOO',
    '...okkkkkOWWW',
    '....ookkdOWBB',
    '......oooOSSS',
    '.........OOOO',
    '.............'
  ], CHAR_MAP);

  /**
   * Dibuja un segmento de brazo con bordes de 1px y sombreado cel-shaded
   */
  function drawArmSegment(ctx, x0, y0, w0, x1, y1, w1, isForearm, sleeveColors) {
    const outlineCol = sleeveColors ? sleeveColors.outline : PAL.coatOutline;
    const lightCol = sleeveColors ? sleeveColors.light : PAL.white;
    const midCol = sleeveColors ? sleeveColors.mid : PAL.coatMid;
    const shadowCol = sleeveColors ? sleeveColors.shadow : PAL.coatShadow;

    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = MathUtil.lerp(x0, x1, t);
      const cy = MathUtil.lerp(y0, y1, t);
      const halfW = MathUtil.lerp(w0, w1, t);

      for (let d = -halfW; d <= halfW; d += 0.45) {
        const px = Math.round(cx + nx * d);
        const py = Math.round(cy + ny * d);
        let col = midCol;
        if (d < -halfW + 1.2) {
          col = lightCol;
        } else if (d > halfW - 1.4) {
          col = shadowCol;
        }
        PixelGFX.pset(ctx, px, py, col);
      }
    }

    const topX0 = Math.round(x0 - nx * w0);
    const topY0 = Math.round(y0 - ny * w0);
    const topX1 = Math.round(x1 - nx * w1);
    const topY1 = Math.round(y1 - ny * w1);

    const botX0 = Math.round(x0 + nx * w0);
    const botY0 = Math.round(y0 + ny * w0);
    const botX1 = Math.round(x1 + nx * w1);
    const botY1 = Math.round(y1 + ny * w1);

    PixelGFX.line(ctx, topX0, topY0, topX1, topY1, outlineCol);
    PixelGFX.line(ctx, botX0, botY0, botX1, botY1, outlineCol);

    if (isForearm) {
      PixelGFX.line(ctx, topX1, topY1, botX1, botY1, outlineCol);
    }
  }

  // ==========================================================================
  // ESCENA 6 (27.4s .. 33.8s): TRABAJO BIOTECNOLÓGICO EN LABORATORIO
  // Micropipeteo de precisión, PCR, Electroforesis en Gel de Agarosa e In Vitro
  // ==========================================================================
  function drawBiotechBenchScene(ctx, localTime, globalTime) {
    // 1. Fondo de Cabina de Bioseguridad / Flujo Laminar Blanca
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, PAL.labWallWhite);
    PixelGFX.rect(ctx, 0, 0, WIDTH, 22, PAL.labWallShade);
    PixelGFX.line(ctx, 0, 22, WIDTH - 1, 22, PAL.windowFrameDark);

    // Rejilla difusora HEPA superior y barra de luz estéril cian/UV suave
    for (let x = 16; x < WIDTH - 16; x += 6) {
      PixelGFX.rect(ctx, x, 6, 4, 10, PAL.labWallLine);
      PixelGFX.pset(ctx, x + 1, 8, PAL.white);
    }
    PixelGFX.rect(ctx, 24, 19, WIDTH - 48, 2, PAL.neonCyan);
    PixelGFX.line(ctx, 24, 20, WIDTH - 25, 20, PAL.white);

    // Paneles modulares blancos de fondo
    for (let x = 40; x < WIDTH; x += 48) {
      PixelGFX.line(ctx, x, 23, x, 124, PAL.labWallLine);
    }
    PixelGFX.line(ctx, 0, 74, WIDTH - 1, 74, PAL.labWallLine);

    // Ventana lateral izquierda mostrando cerezos Sakura al exterior
    const winX = 12;
    const winY = 30;
    const winW = 74;
    const winH = 56;
    PixelGFX.rect(ctx, winX - 2, winY - 2, winW + 4, winH + 4, PAL.windowFrameDark);
    PixelGFX.rect(ctx, winX, winY, winW, winH, PAL.skyMid);
    PixelGFX.rect(ctx, winX, winY + 34, winW, 22, PAL.meadowMid);
    // Copas de cerezos tras el cristal
    PixelGFX.ellipseFill(ctx, winX + 20, winY + 30, 18, 12, PAL.sakuraMid);
    PixelGFX.ellipseFill(ctx, winX + 18, winY + 27, 14, 8, PAL.sakuraLight);
    PixelGFX.ellipseFill(ctx, winX + 54, winY + 32, 16, 11, PAL.sakuraMid);
    PixelGFX.ellipseFill(ctx, winX + 52, winY + 29, 12, 7, PAL.sakuraLight);
    PixelGFX.line(ctx, winX + 37, winY, winX + 37, winY + winH - 1, PAL.windowFrameWhite);
    PixelGFX.rectOutline(ctx, winX, winY, winW, winH, PAL.white);

    // Estantería derecha con matraces Erlenmeyer de callos vegetales y cajas Magenta In Vitro
    const shelfX = 236;
    const shelfY = 54;
    PixelGFX.rect(ctx, shelfX, shelfY, 74, 3, PAL.windowFrameDark);
    PixelGFX.line(ctx, shelfX, shelfY, shelfX + 73, shelfY, PAL.white);

    for (let i = 0; i < 3; i++) {
      const fx = shelfX + 6 + i * 23;
      const fy = shelfY - 21;
      ctx.drawImage(Sprites.inVitroPlant, fx, fy);
      // Burbujeo sutil en el medio nutritivo
      if ((Math.floor(globalTime * 4) + i) % 3 === 0) {
        PixelGFX.pset(ctx, fx + 7, fy + 15, PAL.neonCyanLight);
      }
    }

    // 2. Mesada Blanca de Biotecnología Molecular (y = 122)
    const deskY = 122;
    PixelGFX.rect(ctx, 0, deskY, WIDTH, HEIGHT - deskY, PAL.benchBase);
    PixelGFX.rect(ctx, 0, deskY, WIDTH, 10, PAL.benchFront);
    PixelGFX.rect(ctx, 0, deskY, WIDTH, 3, PAL.benchSurface);
    PixelGFX.rect(ctx, 0, deskY + 3, WIDTH, 3, PAL.benchTop);
    PixelGFX.rect(ctx, 0, deskY + 9, WIDTH, 2, PAL.benchShadow);

    // 3. Termociclador PCR Digital (Izquierda sobre la mesada)
    const pcrX = 14;
    const pcrY = deskY - 34;
    PixelGFX.rect(ctx, pcrX, pcrY, 44, 34, PAL.metalDark);
    PixelGFX.rect(ctx, pcrX + 1, pcrY + 1, 42, 32, PAL.equipWhite);
    PixelGFX.rect(ctx, pcrX + 2, pcrY + 2, 40, 8, PAL.equipShade);
    // Tapa térmica del PCR
    PixelGFX.rect(ctx, pcrX + 6, pcrY - 4, 32, 4, PAL.metalMid);
    PixelGFX.line(ctx, pcrX + 8, pcrY - 3, pcrX + 36, pcrY - 3, PAL.metalShine);
    // Pantalla LCD del termociclador mostrando los escalones de temperatura (95°C -> 58°C -> 72°C)
    const lcdX = pcrX + 5;
    const lcdY = pcrY + 12;
    PixelGFX.rect(ctx, lcdX, lcdY, 34, 15, PAL.screenBg);
    PixelGFX.line(ctx, lcdX + 2, lcdY + 11, lcdX + 10, lcdY + 4, PAL.neonPinkLight);
    PixelGFX.line(ctx, lcdX + 10, lcdY + 4, lcdX + 18, lcdY + 10, PAL.neonCyan);
    PixelGFX.line(ctx, lcdX + 18, lcdY + 10, lcdX + 26, lcdY + 6, PAL.chloroplast);
    PixelGFX.line(ctx, lcdX + 26, lcdY + 6, lcdX + 31, lcdY + 6, PAL.chloroplast);
    // Cursor térmico activo en el perfil PCR
    const pcrCursor = Math.floor(localTime * 5) % 28;
    PixelGFX.line(ctx, lcdX + 3 + pcrCursor, lcdY + 2, lcdX + 3 + pcrCursor, lcdY + 13, PAL.starGold);
    // LEDs de estado del PCR
    PixelGFX.pset(ctx, pcrX + 8, pcrY + 30, PAL.chloroplast);
    PixelGFX.pset(ctx, pcrX + 12, pcrY + 30, (Math.floor(globalTime * 6) % 2 === 0) ? PAL.neonCyan : PAL.screenGrid);

    // 4. Cámara de Electroforesis en Gel de Agarosa / Transiluminador UV (x = 66)
    const gelX = 64;
    const gelY = deskY - 22;
    PixelGFX.rect(ctx, gelX, gelY, 48, 22, PAL.metalDark);
    PixelGFX.rect(ctx, gelX + 2, gelY + 2, 44, 15, '#120b29'); // ventana UV oscura
    PixelGFX.rectOutline(ctx, gelX + 2, gelY + 2, 44, 15, PAL.nebulaMagenta);

    // Carriles de ADN fluorescente migrando en el gel
    const migrationShift = Math.floor((localTime % 3.2) * 1.8);
    for (let lane = 0; lane < 6; lane++) {
      const lx = gelX + 6 + lane * 6;
      // Pocillo superior
      PixelGFX.rect(ctx, lx, gelY + 4, 4, 1, PAL.neonCyanDark);
      // Bandas de ADN (escalera molecular en carril 0 y muestras en 1..5)
      const b1Y = gelY + 6 + ((lane + migrationShift) % 4);
      const b2Y = gelY + 10 + ((lane * 2 + migrationShift) % 4);
      const b3Y = gelY + 14;
      PixelGFX.rect(ctx, lx, b1Y, 4, 1, lane === 0 ? PAL.starGold : PAL.neonCyan);
      PixelGFX.rect(ctx, lx, b2Y, 4, 1, PAL.chloroplast);
      if (lane % 2 === 0) {
        PixelGFX.rect(ctx, lx, b3Y, 4, 1, PAL.neonPinkLight);
      }
    }
    // Cables rojo y negro de electroforesis
    PixelGFX.line(ctx, gelX + 4, gelY + 19, gelX - 4, deskY - 1, PAL.neonPink);
    PixelGFX.line(ctx, gelX + 44, gelY + 19, gelX + 50, deskY - 1, PAL.metalMid);

    // 5. Investigadora Biotecnóloga en Plano Medio (con Guantes de Nitrilo Cian y Micropipeta)
    // Ciclo de pipeteo: cada 1.25 segundos pipetea un pocillo distinto (0..4)
    const cycleDuration = 1.25;
    const wellIndex = Math.min(4, Math.floor(localTime / cycleDuration));
    const cyclePhase = (localTime % cycleDuration) / cycleDuration;
    // Bajada de la pipeta entre 0.25 y 0.65 del ciclo
    const dipProgress = Math.sin(MathUtil.clamp((cyclePhase - 0.15) / 0.6, 0, 1) * Math.PI);
    const headNod = Math.round(dipProgress * 2);

    const headBaseX = 192;
    const headBaseY = 48 + headNod;
    const torsoX = 175;
    const torsoY = 68;

    // Coleta larga detrás de los hombros
    const ponyTieX = headBaseX + 15;
    const ponyTieY = headBaseY + 4;
    PixelGFX.rect(ctx, ponyTieX - 2, ponyTieY - 2, 5, 5, PAL.scrunchie);
    PixelGFX.rect(ctx, ponyTieX - 1, ponyTieY - 1, 3, 2, PAL.neonPinkLight);
    for (let s = 0; s < 26; s++) {
      const frac = s / 26;
      const px = Math.round(ponyTieX + 2 + Math.sin(frac * 2.6 + globalTime * 2.2) * 2.0 + frac * 5);
      const py = ponyTieY + s;
      const w = Math.max(2, Math.round(5.2 * (1 - frac * 0.45)));
      PixelGFX.rect(ctx, px - w, py, w * 2, 1, PAL.hairDark);
      PixelGFX.rect(ctx, px - w + 1, py, Math.max(1, w + 1), 1, PAL.hairMid);
    }

    // Torso con bata blanca (dibujado antes de la mesada o recortado en deskY)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH, deskY);
    ctx.clip();
    ctx.drawImage(Sprites.scientistTorso || createFallbackTorso(), torsoX, torsoY);
    ctx.restore();

    // Cuello anatómico continuo
    const neckTopX = headBaseX + 2;
    const neckTopY = headBaseY + 14;
    const neckBotX = torsoX + 17;
    const neckBotY = torsoY + 2;
    for (let ny = neckTopY; ny <= neckBotY; ny++) {
      const t = (ny - neckTopY) / Math.max(1, neckBotY - neckTopY);
      const nx = Math.round(MathUtil.lerp(neckTopX, neckBotX, t));
      const isUnderChin = (ny <= headBaseY + 19);
      PixelGFX.pset(ctx, nx - 3, ny, '#7d4038');
      PixelGFX.pset(ctx, nx + 4, ny, '#7d4038');
      PixelGFX.pset(ctx, nx - 2, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx - 1, ny, isUnderChin ? PAL.skinShadow : '#f5b59d');
      PixelGFX.pset(ctx, nx,     ny, isUnderChin ? PAL.skinShadow : '#f5b59d');
      PixelGFX.pset(ctx, nx + 1, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx + 2, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx + 3, ny, PAL.skinDeep);
    }

    // Cabeza y rostro mirando hacia la placa de pocillos
    ctx.drawImage(Sprites.scientistHead || createFallbackHead(), headBaseX - 11, headBaseY - 4);
    // Boca concentrada / sonriente
    PixelGFX.line(ctx, headBaseX - 5, headBaseY + 16, headBaseX - 2, headBaseY + 16, PAL.lips);
    PixelGFX.pset(ctx, headBaseX - 1, headBaseY + 15, PAL.lips);

    // Ojos mirando hacia abajo (hacia la micropipeta y los pocillos) + Gafas finas 1px
    const lx = headBaseX - 8;
    const ly = headBaseY + 7;
    const rx = headBaseX;
    const ry = headBaseY + 7;
    PixelGFX.rect(ctx, lx, ly, 4, 4, PAL.white);
    PixelGFX.rect(ctx, rx, ry, 6, 4, PAL.white);
    PixelGFX.rect(ctx, lx, ly + 2, 2, 2, '#1ca3b8');
    PixelGFX.pset(ctx, lx, ly + 2, PAL.hairDark);
    PixelGFX.rect(ctx, rx, ry + 2, 3, 2, '#1ca3b8');
    PixelGFX.rect(ctx, rx, ry + 2, 2, 2, PAL.hairDark);
    PixelGFX.pset(ctx, lx + 1, ly + 1, PAL.white);
    PixelGFX.pset(ctx, rx + 2, ry + 1, PAL.white);
    PixelGFX.line(ctx, lx, ly - 1, lx + 3, ly - 1, PAL.hairDark);
    PixelGFX.line(ctx, rx, ry - 1, rx + 5, ry - 1, PAL.hairDark);
    // Montura fina de 1px
    PixelGFX.line(ctx, lx, ly - 2, lx + 3, ly - 2, '#8ecae6');
    PixelGFX.line(ctx, lx, ly + 4, lx + 3, ly + 4, '#5fa8d3');
    PixelGFX.line(ctx, lx - 1, ly - 1, lx - 1, ly + 3, '#8ecae6');
    PixelGFX.line(ctx, rx, ry - 2, rx + 5, ry - 2, '#8ecae6');
    PixelGFX.line(ctx, rx, ry + 4, rx + 5, ry + 4, '#5fa8d3');
    PixelGFX.line(ctx, rx - 1, ry - 1, rx - 1, ry + 3, '#5fa8d3');
    PixelGFX.line(ctx, rx + 6, ry - 1, rx + 6, ry + 3, '#5fa8d3');
    PixelGFX.line(ctx, lx + 4, ly, rx - 1, ly, '#8ecae6');
    PixelGFX.line(ctx, rx + 7, ry, headBaseX + 12, headBaseY + 9, '#5fa8d3');
    PixelGFX.line(ctx, lx, ly - 4, lx + 3, ly - 4, PAL.hairMid);
    PixelGFX.line(ctx, rx + 1, ry - 4, rx + 5, ry - 4, PAL.hairMid);

    // 6. Gradilla Iluminada de Microtubos / Placa de 96 Pocillos sobre la Mesada (x = 126..166)
    const rackX = 128;
    const rackY = deskY - 14;
    PixelGFX.rect(ctx, rackX, rackY + 6, 38, 8, PAL.metalDark);
    PixelGFX.rect(ctx, rackX + 1, rackY + 7, 36, 6, PAL.metalMid);
    PixelGFX.rect(ctx, rackX + 2, rackY + 12, 34, 2, PAL.neonCyan);

    // 5 Tubos de reacción fluorescentes en la gradilla
    for (let w = 0; w < 5; w++) {
      const wx = rackX + 4 + w * 7;
      const isFilled = w < wellIndex || (w === wellIndex && cyclePhase > 0.55);
      // Cuerpo translúcido del tubo PCR
      PixelGFX.rect(ctx, wx, rackY, 5, 7, PAL.windowFrameWhite);
      PixelGFX.rect(ctx, wx + 1, rackY + 1, 3, 5, isFilled ? PAL.chloroplast : '#194d47');
      if (isFilled) {
        PixelGFX.pset(ctx, wx + 2, rackY + 2, PAL.white);
        PixelGFX.ditherGlow(ctx, wx + 2, rackY + 3, 2, 7, PAL.chloroplast, 0.55);
      }
    }

    // Coordenada X del pocillo objetivo actual
    const targetWellX = rackX + 6 + wellIndex * 7;
    const targetWellY = rackY;

    // 7. AMBOS BRAZOS ARTICULADOS CON GUANTES DE NITRILO CIAN
    // A) Brazo Derecho (en segundo plano, sujetando y estabilizando la gradilla de tubos)
    const rShoulderX = torsoX + 9;
    const rShoulderY = torsoY + 13;
    const rElbowX = torsoX - 2;
    const rElbowY = torsoY + 32;
    const rWristX = rackX + 38;
    const rWristY = rackY + 6;

    drawArmSegment(ctx, rShoulderX, rShoulderY, 4.0, rElbowX, rElbowY, 3.4, false);
    drawArmSegment(ctx, rElbowX, rElbowY, 3.4, rWristX, rWristY, 2.8, true);
    PixelGFX.line(ctx, rElbowX - 1, rElbowY - 1, rElbowX + 2, rElbowY - 2, PAL.coatShadow);
    ctx.drawImage(glovedRackHandSprite, rWristX - 9, rWristY - 4);

    // B) Brazo Izquierdo (en primer plano, operando la Micropipeta de precisión sobre cada pocillo)
    const lShoulderX = torsoX + 25;
    const lShoulderY = torsoY + 15;
    const lElbowX = torsoX + 19;
    const lElbowY = torsoY + 33;
    const pipetteHandX = targetWellX + 8;
    const pipetteHandY = targetWellY - 19 + Math.round(dipProgress * 4);

    drawArmSegment(ctx, lShoulderX, lShoulderY, 4.2, lElbowX, lElbowY, 3.6, false);
    drawArmSegment(ctx, lElbowX, lElbowY, 3.6, pipetteHandX + 4, pipetteHandY + 4, 3.0, true);
    PixelGFX.line(ctx, lElbowX - 2, lElbowY - 1, lElbowX + 1, lElbowY - 2, PAL.coatShadow);

    // Mano enguantada + Micropipeta
    ctx.drawImage(glovedPipetteHandSprite, pipetteHandX - 8, pipetteHandY);

    // Émbolo superior de la micropipeta (baja cuando el pulgar presiona)
    const plungerPress = (cyclePhase > 0.35 && cyclePhase < 0.70) ? 2 : 0;
    PixelGFX.rect(ctx, pipetteHandX - 1, pipetteHandY - 3 + plungerPress, 3, 3, PAL.neonPink);

    // Microgota fluorescente cayendo de la punta de la micropipeta al pocillo
    if (cyclePhase > 0.42 && cyclePhase < 0.68) {
      const dropFrac = (cyclePhase - 0.42) / 0.26;
      const dropY = Math.round(MathUtil.lerp(pipetteHandY + 17, targetWellY + 1, dropFrac));
      PixelGFX.rect(ctx, targetWellX, dropY, 2, 2, PAL.neonCyan);
      PixelGFX.pset(ctx, targetWellX, dropY, PAL.white);
    }
    // Destello al dispensar la muestra en el tubo
    if (cyclePhase >= 0.55 && cyclePhase < 0.82) {
      const ringR = Math.round(((cyclePhase - 0.55) / 0.27) * 8);
      PixelGFX.circleOutline(ctx, targetWellX, targetWellY + 1, ringR, PAL.neonCyanLight);
    }
  }

  // ==========================================================================
  // ESCENA 7 (33.8s .. 40.4s): INVERNADERO Y RIEGO EN MUESTRAS DE CAMPO
  // Invernadero soleado, bancal con rizotrón, sensores de humedad y riego activo
  // ==========================================================================
  function drawGreenhouseIrrigationScene(ctx, localTime, globalTime) {
    // Nivel de hidratación progresiva del sustrato y las plantas (0.0 -> 1.0)
    const hydration = MathUtil.clamp(localTime / 5.2, 0, 1);

    // 1. Cielo luminoso y colinas exteriores vistas a través de los cristales del invernadero
    PixelGFX.rect(ctx, 0, 0, WIDTH, 48, PAL.skyTop);
    PixelGFX.rect(ctx, 0, 48, WIDTH, 42, PAL.skyMid);
    PixelGFX.rect(ctx, 0, 90, WIDTH, 34, PAL.skyHorizon);

    // Sol radiante y colinas agrícolas al fondo
    PixelGFX.circleFill(ctx, 56, 36, 14, PAL.sunbeamCore);
    PixelGFX.ditherGlow(ctx, 56, 36, 12, 34, PAL.sunbeamWarm, 0.7);

    // Colinas verdes y cerezos exteriores en lontananza
    PixelGFX.ellipseFill(ctx, 70, 118, 95, 28, PAL.meadowDark);
    PixelGFX.ellipseFill(ctx, 220, 120, 110, 30, PAL.meadowMid);
    for (let c = 0; c < 4; c++) {
      const cx = 28 + c * 62;
      const cy = 92 + (c % 2) * 4;
      PixelGFX.rect(ctx, cx - 1, cy + 4, 3, 10, PAL.trunkDark);
      PixelGFX.ellipseFill(ctx, cx, cy, 14, 9, PAL.sakuraMid);
      PixelGFX.ellipseFill(ctx, cx - 2, cy - 2, 10, 6, PAL.sakuraLight);
    }

    // 2. Estructura Metálica Acristalada del Invernadero Experimental
    // Vigas diagonales del techo de cristal
    for (let x = 0; x <= WIDTH; x += 54) {
      PixelGFX.line(ctx, x, 18, x, 124, PAL.windowFrameWhite);
      PixelGFX.line(ctx, x + 1, 18, x + 1, 124, PAL.white);
      PixelGFX.line(ctx, x, 18, x + 27, 0, PAL.windowFrameWhite);
      PixelGFX.line(ctx, x, 18, x - 27, 0, PAL.windowFrameWhite);
    }
    PixelGFX.rect(ctx, 0, 16, WIDTH, 3, PAL.windowFrameDark);
    PixelGFX.line(ctx, 0, 16, WIDTH - 1, 16, PAL.white);
    PixelGFX.line(ctx, 0, 68, WIDTH - 1, 68, PAL.windowFrameWhite);

    // Rayos de sol diagonales atravesando el techo del invernadero
    for (let py = 19; py < 126; py++) {
      const shift = (py - 19) * 0.5;
      for (let px = 12; px < 260; px++) {
        const relX = px - shift;
        if ((relX > 20 && relX < 64) || (relX > 95 && relX < 145)) {
          if (MathUtil.bayer(px, py) < 0.22) {
            ctx.fillStyle = PAL.sunbeamCore;
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    }

    // 3. Tubería Superior de Microaspersión Automatizada
    PixelGFX.rect(ctx, 12, 22, 198, 2, PAL.metalMid);
    PixelGFX.line(ctx, 12, 22, 209, 22, PAL.metalShine);
    for (let n = 0; n < 4; n++) {
      const nx = 36 + n * 46;
      PixelGFX.rect(ctx, nx - 1, 24, 3, 3, PAL.brassMid);
      // Rocío fino desde los microaspersores superiores
      for (let d = 0; d < 6; d++) {
        const dropAge = (localTime * 2.8 + d * 0.17 + n * 0.3) % 1.0;
        const spread = (d - 2.5) * 3.2 * dropAge;
        const dx = Math.round(nx + spread);
        const dy = Math.round(28 + dropAge * 68);
        if (dy < 104) {
          PixelGFX.pset(ctx, dx, dy, d % 2 === 0 ? PAL.waterDropLight : PAL.waterDropMid);
        }
      }
    }

    // 4. Bancal Elevado de Muestras de Campo con Ventana de Rizotrón (x = 10 .. 214, y = 108 .. 170)
    const bedX = 10;
    const bedY = 110;
    const bedW = 204;
    const bedH = 62;

    // Estructura del bancal agrícola y borde de terracota/metal
    PixelGFX.rect(ctx, bedX - 2, bedY - 3, bedW + 4, bedH + 5, PAL.metalDark);
    PixelGFX.rect(ctx, bedX, bedY - 2, bedW, 4, PAL.terracottaLight);
    PixelGFX.line(ctx, bedX, bedY + 1, bedX + bedW - 1, bedY + 1, PAL.terracottaDark);

    // Sustrato de campo que se oscurece progresivamente con el riego (seco -> húmedo)
    const wetRows = Math.round(hydration * (bedH - 6));
    for (let sy = 0; sy < bedH - 4; sy++) {
      const py = bedY + 2 + sy;
      const isMoist = sy <= wetRows;
      const baseCol = isMoist
        ? (sy < wetRows - 6 ? PAL.soilWetDark : PAL.soilWetMid)
        : (sy < 12 ? PAL.soilDryLight : PAL.soilDryMid);
      PixelGFX.rect(ctx, bedX, py, bedW, 1, baseCol);

      // Textura granulada de suelo orgánico y minerales
      for (let sx = 6; sx < bedW - 6; sx += 9) {
        if ((sx + sy * 3) % 7 === 0) {
          PixelGFX.pset(ctx, bedX + sx, py, isMoist ? PAL.soilDryMid : PAL.soilDryLight);
        }
      }
    }

    // Ventana transparente de Rizotrón en el frente del bancal mostrando las raíces vivas
    const rhizoX = bedX + 10;
    const rhizoY = bedY + 8;
    const rhizoW = bedW - 20;
    const rhizoH = 44;
    PixelGFX.rectOutline(ctx, rhizoX - 1, rhizoY - 1, rhizoW + 2, rhizoH + 2, PAL.metalLight);
    PixelGFX.line(ctx, rhizoX, rhizoY, rhizoX + rhizoW - 1, rhizoY, PAL.neonCyan);

    // 5. Cinco Muestras de Plantas Experimentales + Raíces en Rizotrón + Sensores de Suelo
    for (let p = 0; p < 5; p++) {
      const px = bedX + 24 + p * 38;
      const py = bedY - 2;
      // Cuánto ha crecido/erguido esta planta gracias al agua
      const plantVigor = MathUtil.clamp((hydration - p * 0.08) * 1.4, 0, 1);
      const lift = Math.round(plantVigor * 3);
      const sway = Math.round(Math.sin(globalTime * 2.5 + p) * 1);

      // A) Sistema radicular visible bajo tierra dentro del rizotrón
      const rootLen = 18 + Math.round(plantVigor * 14);
      PixelGFX.line(ctx, px, bedY + 4, px + sway, bedY + 4 + rootLen, PAL.rootWallLight);
      PixelGFX.line(ctx, px, bedY + 11, px - 7, bedY + 19 + Math.round(plantVigor * 5), PAL.rootWallMid);
      PixelGFX.line(ctx, px, bedY + 14, px + 8, bedY + 23 + Math.round(plantVigor * 5), PAL.rootWallMid);
      if (plantVigor > 0.35) {
        // Pelos radiculares y simbiosis micorrícica activándose con el agua
        PixelGFX.pset(ctx, px - 5, bedY + 17, PAL.neonCyan);
        PixelGFX.pset(ctx, px + 6, bedY + 20, PAL.neonCyan);
        PixelGFX.pset(ctx, px, bedY + 4 + rootLen, PAL.chloroplast);
      }

      // B) Tallo aéreo, ramas laterales, hojas turgentes y floración/fructificación sobre el sustrato
      const stemTopY = py - 19 - lift - (p % 2) * 3;
      PixelGFX.line(ctx, px, py, px + sway, stemTopY, PAL.rootWallLight);
      PixelGFX.line(ctx, px + 1, py, px + 1 + sway, stemTopY, PAL.epidermisMid);

      // Pares de hojas detalladas
      const leafSpread = 6 + Math.round(plantVigor * 2);
      PixelGFX.ellipseFill(ctx, px - leafSpread + sway, stemTopY + 9, 5, 3, PAL.epidermisWall);
      PixelGFX.ellipseFill(ctx, px - leafSpread + sway, stemTopY + 8, 4, 2, PAL.chloroplast);

      PixelGFX.ellipseFill(ctx, px + leafSpread + sway, stemTopY + 7, 5, 3, PAL.epidermisWall);
      PixelGFX.ellipseFill(ctx, px + leafSpread + sway, stemTopY + 6, 4, 2, PAL.chloroplast);

      PixelGFX.ellipseFill(ctx, px + sway, stemTopY, 4, 3, PAL.chloroplast);
      PixelGFX.pset(ctx, px + sway, stemTopY - 1, PAL.epidermisHighlight);

      // Floración de cerezo (Sakura) cuando la hidratación supera el 30%
      if (plantVigor > 0.3) {
        const fx = px + sway;
        const fy = stemTopY - 3;
        PixelGFX.circleFill(ctx, fx, fy, 2, PAL.sakuraLight);
        PixelGFX.pset(ctx, fx - 1, fy, PAL.sakuraPink);
        PixelGFX.pset(ctx, fx + 1, fy, PAL.sakuraPink);
        PixelGFX.pset(ctx, fx, fy, PAL.starGold);
      }

      // Frutos rojos/terracota (drupas/cerezos CEAF) colgando de las ramas hidratadas
      if (plantVigor > 0.46) {
        const fruitGrow = MathUtil.invLerp(0.46, 0.9, plantVigor);
        const fRadius = fruitGrow > 0.55 ? 2 : 1;

        // Fruto izquierdo con pedúnculo verde
        const flX = px - leafSpread + 2 + sway;
        const flY = stemTopY + 12;
        PixelGFX.line(ctx, px - 2 + sway, stemTopY + 9, flX, flY - 1, PAL.ceafGreen);
        PixelGFX.circleFill(ctx, flX, flY, fRadius, PAL.ceafFruit);
        if (fRadius >= 2) {
          PixelGFX.pset(ctx, flX - 1, flY - 1, PAL.ceafFruitLight);
        }

        // Segundo fruto derecho en las plantas pares o más vigorosas
        if (plantVigor > 0.62) {
          const frX = px + leafSpread - 2 + sway;
          const frY = stemTopY + 10;
          PixelGFX.line(ctx, px + 2 + sway, stemTopY + 7, frX, frY - 1, PAL.ceafGreen);
          PixelGFX.circleFill(ctx, frX, frY, fRadius, PAL.ceafFruit);
          if (fRadius >= 2) {
            PixelGFX.pset(ctx, frX - 1, frY - 1, PAL.white);
          }
        }
      }

      // Gotas de rocío brillando sobre las hojas recién regadas
      if (plantVigor > 0.25 && (Math.floor(globalTime * 4) + p) % 2 === 0) {
        PixelGFX.pset(ctx, px - leafSpread + 1 + sway, stemTopY + 7, PAL.waterDropLight);
        PixelGFX.pset(ctx, px + leafSpread - 1 + sway, stemTopY + 5, PAL.white);
      }

      // C) Etiqueta de fenotipado de campo y sensor digital de humedad junto a cada planta
      const tagX = px + 11;
      const tagY = py - 9;
      PixelGFX.line(ctx, tagX + 2, tagY + 5, tagX + 2, py + 2, PAL.metalLight);
      PixelGFX.rect(ctx, tagX, tagY, 6, 5, PAL.white);
      PixelGFX.line(ctx, tagX + 1, tagY + 1, tagX + 4, tagY + 1, p % 2 === 0 ? PAL.neonCyanDark : PAL.neonPink);
      // LED del sensor de humedad (cambia de ámbar a verde esmeralda al hidratarse)
      PixelGFX.pset(ctx, tagX + 2, tagY + 3, plantVigor > 0.4 ? PAL.chloroplast : PAL.starGold);
    }

    // 6. Investigadora de cuerpo completo en el Invernadero regando las muestras
    // Sendero pavimentado del invernadero a la derecha del bancal
    PixelGFX.rect(ctx, 214, 136, WIDTH - 214, HEIGHT - 136, '#cbd5e1');
    PixelGFX.rect(ctx, 214, 136, WIDTH - 214, 4, '#94a3b8');
    for (let tx = 220; tx < WIDTH; tx += 24) {
      PixelGFX.line(ctx, tx, 140, tx - 8, HEIGHT - 1, '#94a3b8');
    }

    const swayBody = Math.round(Math.sin(localTime * 2.2) * 1);
    const headBaseX = 258 + swayBody;
    const headBaseY = 46;
    const torsoX = 241 + swayBody;
    const torsoY = 66;

    // Sombra en el piso del invernadero y piernas/calzado de laboratorio (debajo de la bata)
    PixelGFX.ellipseFill(ctx, torsoX + 20, 165, 16, 4, '#94a3b8');
    // Pierna derecha e izquierda (pantalón azul marino de laboratorio)
    PixelGFX.rect(ctx, torsoX + 11, torsoY + 56, 7, 38, '#1e293b');
    PixelGFX.rect(ctx, torsoX + 12, torsoY + 56, 3, 38, '#334155');
    PixelGFX.rect(ctx, torsoX + 21, torsoY + 56, 8, 39, '#1e293b');
    PixelGFX.rect(ctx, torsoX + 22, torsoY + 56, 4, 39, '#334155');
    // Calzado clínico blanco/gris
    PixelGFX.rect(ctx, torsoX + 8, 159, 10, 5, PAL.metalDark);
    PixelGFX.rect(ctx, torsoX + 9, 159, 8, 3, PAL.white);
    PixelGFX.rect(ctx, torsoX + 18, 160, 11, 5, PAL.metalDark);
    PixelGFX.rect(ctx, torsoX + 19, 160, 9, 3, PAL.white);

    // Macetas de terracota adicionales en el suelo del invernadero (derecha) con frutos CEAF
    PixelGFX.rect(ctx, 288, 148, 16, 16, PAL.terracottaDark);
    PixelGFX.rect(ctx, 286, 145, 20, 4, PAL.terracottaLight);
    PixelGFX.ellipseFill(ctx, 296, 140, 7, 5, PAL.chloroplast);
    PixelGFX.ellipseFill(ctx, 292, 142, 5, 3, PAL.epidermisWall);
    PixelGFX.circleFill(ctx, 299, 142, 2, PAL.ceafFruit);
    PixelGFX.pset(ctx, 298, 141, PAL.ceafFruitLight);
    PixelGFX.circleFill(ctx, 293, 138, 2, PAL.sakuraLight);

    // Coleta larga con movimiento suave de brisa
    const ponyTieX = headBaseX + 15;
    const ponyTieY = headBaseY + 4;
    PixelGFX.rect(ctx, ponyTieX - 2, ponyTieY - 2, 5, 5, PAL.scrunchie);
    PixelGFX.rect(ctx, ponyTieX - 1, ponyTieY - 1, 3, 2, PAL.neonPinkLight);
    for (let s = 0; s < 26; s++) {
      const frac = s / 26;
      const px = Math.round(ponyTieX + 2 + Math.sin(frac * 2.6 + globalTime * 2.5) * 2.2 + frac * 5);
      const py = ponyTieY + s;
      const w = Math.max(2, Math.round(5.2 * (1 - frac * 0.45)));
      PixelGFX.rect(ctx, px - w, py, w * 2, 1, PAL.hairDark);
      PixelGFX.rect(ctx, px - w + 1, py, Math.max(1, w + 1), 1, PAL.hairMid);
    }

    // Torso de la investigadora
    ctx.drawImage(Sprites.scientistTorso || createFallbackTorso(), torsoX, torsoY);

    // Cuello anatómico continuo
    const neckTopX = headBaseX + 2;
    const neckTopY = headBaseY + 14;
    const neckBotX = torsoX + 17;
    const neckBotY = torsoY + 2;
    for (let ny = neckTopY; ny <= neckBotY; ny++) {
      const t = (ny - neckTopY) / Math.max(1, neckBotY - neckTopY);
      const nx = Math.round(MathUtil.lerp(neckTopX, neckBotX, t));
      const isUnderChin = (ny <= headBaseY + 19);
      PixelGFX.pset(ctx, nx - 3, ny, '#7d4038');
      PixelGFX.pset(ctx, nx + 4, ny, '#7d4038');
      PixelGFX.pset(ctx, nx - 2, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx - 1, ny, isUnderChin ? PAL.skinShadow : '#f5b59d');
      PixelGFX.pset(ctx, nx,     ny, isUnderChin ? PAL.skinShadow : '#f5b59d');
      PixelGFX.pset(ctx, nx + 1, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx + 2, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx + 3, ny, PAL.skinDeep);
    }

    // Cabeza y sonrisa cálida cuidando las plantas
    ctx.drawImage(Sprites.scientistHead || createFallbackHead(), headBaseX - 11, headBaseY - 4);
    PixelGFX.line(ctx, headBaseX - 5, headBaseY + 16, headBaseX - 1, headBaseY + 16, PAL.lips);
    PixelGFX.pset(ctx, headBaseX, headBaseY + 15, PAL.lips);

    // Ojos expresivos y gafas finas 1px
    const lx = headBaseX - 8;
    const ly = headBaseY + 7;
    const rx = headBaseX;
    const ry = headBaseY + 7;
    PixelGFX.rect(ctx, lx, ly, 4, 4, PAL.white);
    PixelGFX.rect(ctx, rx, ry, 6, 4, PAL.white);
    PixelGFX.rect(ctx, lx, ly + 1, 2, 3, '#1ca3b8');
    PixelGFX.pset(ctx, lx, ly + 2, PAL.hairDark);
    PixelGFX.rect(ctx, rx, ry + 1, 3, 3, '#1ca3b8');
    PixelGFX.rect(ctx, rx, ry + 1, 2, 2, PAL.hairDark);
    PixelGFX.pset(ctx, lx + 1, ly + 1, PAL.white);
    PixelGFX.pset(ctx, rx + 2, ry + 1, PAL.white);
    PixelGFX.line(ctx, lx, ly - 1, lx + 3, ly - 1, PAL.hairDark);
    PixelGFX.line(ctx, rx, ry - 1, rx + 5, ry - 1, PAL.hairDark);
    PixelGFX.line(ctx, lx, ly - 2, lx + 3, ly - 2, '#8ecae6');
    PixelGFX.line(ctx, lx, ly + 4, lx + 3, ly + 4, '#5fa8d3');
    PixelGFX.line(ctx, lx - 1, ly - 1, lx - 1, ly + 3, '#8ecae6');
    PixelGFX.line(ctx, rx, ry - 2, rx + 5, ry - 2, '#8ecae6');
    PixelGFX.line(ctx, rx, ry + 4, rx + 5, ry + 4, '#5fa8d3');
    PixelGFX.line(ctx, rx - 1, ry - 1, rx - 1, ry + 3, '#5fa8d3');
    PixelGFX.line(ctx, rx + 6, ry - 1, rx + 6, ry + 3, '#5fa8d3');
    PixelGFX.line(ctx, lx + 4, ly, rx - 1, ly, '#8ecae6');
    PixelGFX.line(ctx, rx + 7, ry, headBaseX + 12, headBaseY + 9, '#5fa8d3');
    PixelGFX.line(ctx, lx, ly - 4, lx + 3, ly - 4, PAL.hairMid);
    PixelGFX.line(ctx, rx + 1, ry - 4, rx + 5, ry - 4, PAL.hairMid);

    // 7. Regadera Científica / Lanza de Riego y Ambos Brazos Articulados
    const canX = 212 + swayBody;
    const canY = 82 + Math.round(Math.sin(localTime * 3.0) * 2);

    // A) Brazo Derecho (sosteniendo el cuerpo/lanza inferior de la regadera)
    const rShoulderX = torsoX + 10;
    const rShoulderY = torsoY + 13;
    const rElbowX = torsoX + 2;
    const rElbowY = torsoY + 29;
    const rWristX = canX + 12;
    const rWristY = canY + 12;
    drawArmSegment(ctx, rShoulderX, rShoulderY, 4.0, rElbowX, rElbowY, 3.4, false);
    drawArmSegment(ctx, rElbowX, rElbowY, 3.4, rWristX, rWristY, 2.8, true);

    // Cuerpo de la regadera de laboratorio (acero/turquesa con medidor de volumen)
    PixelGFX.rect(ctx, canX, canY + 2, 18, 14, PAL.metalDark);
    PixelGFX.rect(ctx, canX + 1, canY + 3, 16, 12, PAL.gloveCyan);
    PixelGFX.rect(ctx, canX + 2, canY + 4, 14, 3, PAL.gloveHighlight);
    PixelGFX.rect(ctx, canX + 5, canY + 7, 8, 6, PAL.screenBg);
    PixelGFX.rect(ctx, canX + 6, canY + 9, 6, 3, PAL.waterDropMid);
    PixelGFX.line(ctx, canX + 4, canY + 2, canX + 8, canY - 5, PAL.metalDark);
    PixelGFX.line(ctx, canX + 8, canY - 5, canX + 18, canY - 3, PAL.metalLight);
    PixelGFX.line(ctx, canX + 18, canY - 3, canX + 18, canY + 10, PAL.metalDark);
    const spoutTipX = canX - 18;
    const spoutTipY = canY + 8;
    PixelGFX.line(ctx, canX, canY + 11, spoutTipX, spoutTipY, PAL.metalDark);
    PixelGFX.line(ctx, canX, canY + 10, spoutTipX, spoutTipY - 1, PAL.metalLight);
    PixelGFX.ellipseFill(ctx, spoutTipX - 2, spoutTipY, 3, 4, PAL.brassMid);
    PixelGFX.line(ctx, spoutTipX - 4, spoutTipY - 3, spoutTipX - 4, spoutTipY + 3, PAL.brassLight);

    ctx.drawImage(handWateringSideSprite, rWristX - 8, rWristY - 4);

    // B) Brazo Izquierdo en primer plano (sujetando el asa superior e inclinando la regadera)
    const lShoulderX = torsoX + 25;
    const lShoulderY = torsoY + 15;
    const lElbowX = torsoX + 19;
    const lElbowY = torsoY + 30;
    const lWristX = canX + 14;
    const lWristY = canY - 3;
    drawArmSegment(ctx, lShoulderX, lShoulderY, 4.2, lElbowX, lElbowY, 3.6, false);
    drawArmSegment(ctx, lElbowX, lElbowY, 3.6, lWristX, lWristY, 3.0, true);
    PixelGFX.line(ctx, lElbowX - 2, lElbowY - 1, lElbowX + 1, lElbowY - 2, PAL.coatShadow);
    ctx.drawImage(handWateringTopSprite, lWristX - 9, lWristY - 4);

    // 8. Chorros Parabólicos de Gotas de Agua y Salpicaduras sobre las Muestras
    const numStreams = 5;
    for (let s = 0; s < numStreams; s++) {
      for (let k = 0; k < 7; k++) {
        const phase = (localTime * 2.6 + k * 0.14 + s * 0.11) % 1.0;
        const startX = spoutTipX - 5;
        const startY = spoutTipY - 2 + s * 1.2;
        const rangeX = 42 + s * 28;
        const dropX = Math.round(startX - phase * rangeX);
        const dropY = Math.round(startY - Math.sin(phase * Math.PI) * 8 + phase * phase * 26);

        if (dropY <= bedY) {
          const col = (k + s) % 2 === 0 ? PAL.waterDropLight : PAL.waterDropMid;
          PixelGFX.pset(ctx, dropX, dropY, col);
          if (phase > 0.2 && phase < 0.85) {
            PixelGFX.pset(ctx, dropX + 1, dropY - 1, PAL.white);
          }
        } else if (phase > 0.86) {
          PixelGFX.pset(ctx, dropX - 2, bedY - 2, PAL.waterDropLight);
          PixelGFX.pset(ctx, dropX + 2, bedY - 2, PAL.white);
        }
      }
    }
  }

  // ==========================================================================
  // ESCENA 8 (40.4s .. 46.8s): ESTACIÓN DE BIOINFORMÁTICA Y GENÓMICA
  // Investigador revisando triple monitor con ADN, Heatmap RNA-seq y Proteína 3D
  // ==========================================================================
  function drawBioinformaticsScene(ctx, localTime, globalTime) {
    // 1. Ambiente del Centro de Bioinformática en el Laboratorio
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, '#0b1324');
    PixelGFX.rect(ctx, 0, 0, WIDTH, 122, '#111c33');

    for (let x = 32; x < WIDTH; x += 48) {
      PixelGFX.line(ctx, x, 0, x, 122, '#1a2a4a');
    }
    PixelGFX.line(ctx, 0, 28, WIDTH - 1, 28, '#1a2a4a');

    // 2. Torre Secuenciadora de Alto Rendimiento (NGS Sequencer) a la izquierda
    const seqX = 8;
    const seqY = 18;
    PixelGFX.rect(ctx, seqX, seqY, 34, 98, PAL.metalDark);
    PixelGFX.rect(ctx, seqX + 2, seqY + 2, 30, 94, '#162238');
    PixelGFX.rectOutline(ctx, seqX, seqY, 34, 98, PAL.metalMid);
    PixelGFX.rect(ctx, seqX + 5, seqY + 10, 24, 34, PAL.screenBg);
    const baseColors = [PAL.chloroplast, PAL.neonPinkLight, PAL.neonCyan, PAL.starGold];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 5; c++) {
        const idx = (r * 5 + c + Math.floor(globalTime * 8)) % 4;
        PixelGFX.rect(ctx, seqX + 7 + c * 4, seqY + 13 + r * 5, 2, 3, baseColors[idx]);
      }
    }
    for (let b = 0; b < 4; b++) {
      const bw = 8 + ((Math.floor(localTime * 6) + b * 5) % 14);
      PixelGFX.rect(ctx, seqX + 6, seqY + 52 + b * 6, bw, 3, b % 2 === 0 ? PAL.neonCyan : PAL.chloroplast);
    }

    // 3. Estación de Trabajo de Triple Monitor Bioinformático
    // A) Monitor Izquierdo: Estructura 3D de Proteína Vegetal + Árbol Filogenético
    const m1X = 48;
    const m1Y = 24;
    const m1W = 62;
    const m1H = 54;
    PixelGFX.rect(ctx, m1X + 26, m1Y + m1H, 10, 18, PAL.metalMid);
    PixelGFX.rect(ctx, m1X - 2, m1Y - 2, m1W + 4, m1H + 4, PAL.metalLight);
    PixelGFX.rect(ctx, m1X, m1Y, m1W, m1H, PAL.screenBg);
    PixelGFX.rect(ctx, m1X, m1Y, m1W, 5, '#153252');

    const protCX = m1X + 19;
    const protCY = m1Y + 29;
    let prevPX = null;
    let prevPY = null;
    for (let a = 0; a < 14; a++) {
      const ang = globalTime * 2.4 + a * 0.65;
      const px = protCX + Math.round(Math.cos(ang) * 11);
      const py = protCY - 15 + a * 2.3 + Math.round(Math.sin(ang * 1.5) * 2);
      const col = a % 3 === 0 ? PAL.neonPinkLight : (a % 2 === 0 ? PAL.neonCyan : PAL.chloroplast);
      if (prevPX !== null) {
        PixelGFX.line(ctx, prevPX, prevPY, px, py, col);
      }
      PixelGFX.pset(ctx, px, py, PAL.white);
      prevPX = px;
      prevPY = py;
    }

    const treeX = m1X + 36;
    const treeY = m1Y + 14;
    PixelGFX.line(ctx, treeX, treeY + 14, treeX + 6, treeY + 14, PAL.chloroplast);
    PixelGFX.line(ctx, treeX + 6, treeY + 5, treeX + 6, treeY + 24, PAL.chloroplast);
    PixelGFX.line(ctx, treeX + 6, treeY + 5, treeX + 14, treeY + 5, PAL.neonCyan);
    PixelGFX.line(ctx, treeX + 6, treeY + 24, treeX + 12, treeY + 24, PAL.neonCyan);
    PixelGFX.line(ctx, treeX + 12, treeY + 18, treeX + 12, treeY + 30, PAL.neonCyan);
    PixelGFX.line(ctx, treeX + 12, treeY + 18, treeX + 20, treeY + 18, PAL.neonPinkLight);
    PixelGFX.line(ctx, treeX + 12, treeY + 30, treeX + 20, treeY + 30, PAL.starGold);
    PixelGFX.pset(ctx, treeX + 21, treeY + 18, PAL.white);

    // B) Monitor Central Ultrawide: Alineamiento de Secuencias ADN/ARN, Heatmap RNA-seq y Volcano Plot
    const m2X = 114;
    const m2Y = 16;
    const m2W = 108;
    const m2H = 64;
    PixelGFX.rect(ctx, m2X + 48, m2Y + m2H, 12, 16, PAL.metalMid);
    PixelGFX.rect(ctx, m2X + 36, m2Y + m2H + 14, 36, 3, PAL.metalLight);
    PixelGFX.rect(ctx, m2X - 2, m2Y - 2, m2W + 4, m2H + 4, PAL.equipWhite);
    PixelGFX.rect(ctx, m2X, m2Y, m2W, m2H, PAL.screenBg);
    PixelGFX.rect(ctx, m2X, m2Y, m2W, 5, '#0f3654');
    PixelGFX.pset(ctx, m2X + 3, m2Y + 2, PAL.neonPink);
    PixelGFX.pset(ctx, m2X + 6, m2Y + 2, PAL.starGold);
    PixelGFX.pset(ctx, m2X + 9, m2Y + 2, PAL.chloroplast);

    // Panel Superior: Alineamiento Múltiple de Secuencias
    const seqStartX = m2X + 5;
    const seqStartY = m2Y + 9;
    const scrollOffset = Math.floor(localTime * 6);
    for (let row = 0; row < 4; row++) {
      PixelGFX.rect(ctx, seqStartX, seqStartY + row * 4, 8, 2, row === 0 ? PAL.neonCyan : PAL.metalLight);
      for (let col = 0; col < 27; col++) {
        const baseIdx = (row * 7 + col + scrollOffset) % 4;
        const bx = seqStartX + 12 + col * 3;
        const by = seqStartY + row * 4;
        PixelGFX.rect(ctx, bx, by, 2, 2, baseColors[baseIdx]);
      }
    }
    const locusBoxX = seqStartX + 30 + Math.round(Math.sin(localTime * 2.0) * 8);
    PixelGFX.rectOutline(ctx, locusBoxX, seqStartY - 1, 18, 17, PAL.white);

    PixelGFX.line(ctx, m2X + 3, m2Y + 27, m2X + m2W - 4, m2Y + 27, PAL.screenGrid);

    // Subpanel Inferior Izquierdo: RNA-seq Heatmap
    const hmX = m2X + 5;
    const hmY = m2Y + 31;
    for (let hr = 0; hr < 6; hr++) {
      for (let hc = 0; hc < 8; hc++) {
        const val = Math.sin(hr * 1.3 + hc * 0.9 + localTime * 2.2);
        const cellCol = val > 0.35
          ? PAL.chloroplast
          : (val > -0.2 ? PAL.neonCyanDark : PAL.neonPink);
        PixelGFX.rect(ctx, hmX + hc * 5, hmY + hr * 5, 4, 4, cellCol);
      }
    }

    // Subpanel Inferior Derecho: Volcano Plot y Alerta de Descubrimiento Genómico
    const vpX = m2X + 50;
    const vpY = m2Y + 31;
    const vpW = 52;
    const vpH = 29;
    PixelGFX.rect(ctx, vpX, vpY, vpW, vpH, '#04101c');
    PixelGFX.rectOutline(ctx, vpX, vpY, vpW, vpH, PAL.screenGrid);
    PixelGFX.line(ctx, vpX + 26, vpY + 2, vpX + 26, vpY + vpH - 2, PAL.screenGrid);
    PixelGFX.line(ctx, vpX + 2, vpY + 12, vpX + vpW - 2, vpY + 12, PAL.neonPinkDark);
    for (let g = 0; g < 22; g++) {
      const side = g % 2 === 0 ? 1 : -1;
      const spread = 2 + (g % 11) * 1.8;
      const gx = Math.round(vpX + 26 + side * spread);
      const gy = Math.round(vpY + 25 - (spread * 1.1) + ((g * 3) % 4));
      const isSig = gy < vpY + 12;
      const gCol = isSig ? (side > 0 ? PAL.chloroplast : PAL.neonCyan) : PAL.metalMid;
      PixelGFX.pset(ctx, gx, gy, gCol);
    }

    const hitActive = localTime > 3.2;
    const hitTargetX = vpX + 36;
    const hitTargetY = vpY + 7;
    if (hitActive) {
      PixelGFX.circleOutline(ctx, hitTargetX, hitTargetY, 3 + (Math.floor(globalTime * 6) % 2), PAL.starGold);
      PixelGFX.pset(ctx, hitTargetX, hitTargetY, PAL.white);
      PixelGFX.rect(ctx, vpX + 3, vpY + 2, 24, 5, PAL.chloroplast);
      PixelGFX.line(ctx, vpX + 5, vpY + 4, vpX + 24, vpY + 4, PAL.screenBg);
    }

    // C) Monitor Derecho: Correlación Fenómica (Riego/Estomas vs Expresión Génica)
    const m3X = 248;
    const m3Y = 24;
    const m3W = 64;
    const m3H = 52;
    PixelGFX.rect(ctx, m3X - 2, m3Y - 2, m3W + 4, m3H + 4, PAL.metalLight);
    PixelGFX.rect(ctx, m3X, m3Y, m3W, m3H, PAL.screenBg);
    PixelGFX.rect(ctx, m3X, m3Y, m3W, 5, '#153252');
    for (let x = 0; x < m3W - 10; x++) {
      const y1 = m3Y + 22 + Math.round(Math.sin(x * 0.18 - localTime * 3.5) * 7);
      const y2 = m3Y + 38 + Math.round(Math.cos(x * 0.18 - localTime * 3.5) * 6);
      PixelGFX.pset(ctx, m3X + 5 + x, y1, PAL.neonCyan);
      PixelGFX.pset(ctx, m3X + 5 + x, y2, PAL.chloroplast);
    }

    // 4. Silla Ergonómica y Personaje Bioinformático (dibujado ANTES de la superficie del escritorio)
    const deskY = 122;
    const isPointing = localTime > 3.6;
    const headBaseX = 230;
    const headBaseY = 54;
    const torsoX = 213;
    const torsoY = 74;

    // Respaldo de silla ergonómica de laboratorio detrás de la investigadora
    PixelGFX.rect(ctx, torsoX + 26, torsoY + 6, 12, 42, '#1e293b');
    PixelGFX.rectOutline(ctx, torsoX + 26, torsoY + 6, 12, 42, PAL.metalMid);

    // Coleta alta
    const ponyTieX = headBaseX + 15;
    const ponyTieY = headBaseY + 4;
    PixelGFX.rect(ctx, ponyTieX - 2, ponyTieY - 2, 5, 5, PAL.scrunchie);
    PixelGFX.rect(ctx, ponyTieX - 1, ponyTieY - 1, 3, 2, PAL.neonPinkLight);
    for (let s = 0; s < 26; s++) {
      const frac = s / 26;
      const px = Math.round(ponyTieX + 2 + Math.sin(frac * 2.5 + globalTime * 2.2) * 1.8 + frac * 5);
      const py = ponyTieY + s;
      const w = Math.max(2, Math.round(5.2 * (1 - frac * 0.45)));
      PixelGFX.rect(ctx, px - w, py, w * 2, 1, PAL.hairDark);
      PixelGFX.rect(ctx, px - w + 1, py, Math.max(1, w + 1), 1, PAL.hairMid);
    }

    // Torso recortado limpiamente por el borde del escritorio (deskY = 122)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH, deskY);
    ctx.clip();
    ctx.drawImage(Sprites.scientistTorso || createFallbackTorso(), torsoX, torsoY);
    ctx.restore();

    // Cuello anatómico continuo
    const neckTopX = headBaseX + 2;
    const neckTopY = headBaseY + 14;
    const neckBotX = torsoX + 17;
    const neckBotY = torsoY + 2;
    for (let ny = neckTopY; ny <= neckBotY; ny++) {
      const t = (ny - neckTopY) / Math.max(1, neckBotY - neckTopY);
      const nx = Math.round(MathUtil.lerp(neckTopX, neckBotX, t));
      const isUnderChin = (ny <= headBaseY + 19);
      PixelGFX.pset(ctx, nx - 3, ny, '#7d4038');
      PixelGFX.pset(ctx, nx + 4, ny, '#7d4038');
      PixelGFX.pset(ctx, nx - 2, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx - 1, ny, isUnderChin ? PAL.skinShadow : '#f5b59d');
      PixelGFX.pset(ctx, nx,     ny, isUnderChin ? PAL.skinShadow : '#f5b59d');
      PixelGFX.pset(ctx, nx + 1, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx + 2, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx + 3, ny, PAL.skinDeep);
    }

    // Cabeza y expresión
    ctx.drawImage(Sprites.scientistHead || createFallbackHead(), headBaseX - 11, headBaseY - 4);
    if (isPointing) {
      PixelGFX.rect(ctx, headBaseX - 5, headBaseY + 15, 5, 3, PAL.lips);
      PixelGFX.rect(ctx, headBaseX - 4, headBaseY + 15, 3, 1, PAL.white);
    } else {
      PixelGFX.line(ctx, headBaseX - 5, headBaseY + 16, headBaseX - 2, headBaseY + 16, PAL.lips);
    }

    // Ojos y Gafas finas 1px con reflejo de datos bioinformáticos
    const lx = headBaseX - 8;
    const ly = headBaseY + 7;
    const rx = headBaseX;
    const ry = headBaseY + 7;
    PixelGFX.rect(ctx, lx, ly, 4, 4, PAL.white);
    PixelGFX.rect(ctx, rx, ry, 6, 4, PAL.white);
    const eyeScan = Math.floor(localTime * 4) % 2;
    PixelGFX.rect(ctx, lx + eyeScan, ly + 1, 2, 3, '#1ca3b8');
    PixelGFX.pset(ctx, lx + eyeScan, ly + 2, PAL.hairDark);
    PixelGFX.rect(ctx, rx + eyeScan, ry + 1, 3, 3, '#1ca3b8');
    PixelGFX.rect(ctx, rx + eyeScan, ry + 1, 2, 2, PAL.hairDark);
    PixelGFX.pset(ctx, lx + 1, ly, PAL.chloroplast);
    PixelGFX.pset(ctx, rx + 3, ry, PAL.neonCyan);
    PixelGFX.line(ctx, lx, ly - 1, lx + 3, ly - 1, PAL.hairDark);
    PixelGFX.line(ctx, rx, ry - 1, rx + 5, ry - 1, PAL.hairDark);
    PixelGFX.line(ctx, lx, ly - 2, lx + 3, ly - 2, '#8ecae6');
    PixelGFX.line(ctx, lx, ly + 4, lx + 3, ly + 4, '#5fa8d3');
    PixelGFX.line(ctx, lx - 1, ly - 1, lx - 1, ly + 3, '#8ecae6');
    PixelGFX.line(ctx, rx, ry - 2, rx + 5, ry - 2, '#8ecae6');
    PixelGFX.line(ctx, rx, ry + 4, rx + 5, ry + 4, '#5fa8d3');
    PixelGFX.line(ctx, rx - 1, ry - 1, rx - 1, ry + 3, '#5fa8d3');
    PixelGFX.line(ctx, rx + 6, ry - 1, rx + 6, ry + 3, '#5fa8d3');
    PixelGFX.line(ctx, lx + 4, ly, rx - 1, ly, '#8ecae6');
    PixelGFX.line(ctx, rx + 7, ry, headBaseX + 12, headBaseY + 9, '#5fa8d3');
    const browOffset = isPointing ? -1 : 0;
    PixelGFX.line(ctx, lx, ly - 4 + browOffset, lx + 3, ly - 4 + browOffset, PAL.hairMid);
    PixelGFX.line(ctx, rx + 1, ry - 4 + browOffset, rx + 5, ry - 4 + browOffset, PAL.hairMid);

    // 5. Escritorio Técnico y Teclado Mecánico Retroiluminado (en primer plano sobre la cintura)
    PixelGFX.rect(ctx, 0, deskY, WIDTH, HEIGHT - deskY, '#1e293b');
    PixelGFX.rect(ctx, 0, deskY, WIDTH, 4, '#475569');
    PixelGFX.line(ctx, 0, deskY, WIDTH - 1, deskY, PAL.neonCyan);

    const kbX = 142;
    const kbY = deskY - 5;
    PixelGFX.rect(ctx, kbX, kbY, 46, 6, PAL.metalDark);
    PixelGFX.line(ctx, kbX + 1, kbY + 5, kbX + 44, kbY + 5, PAL.neonCyan);
    for (let k = 0; k < 12; k++) {
      const activeKey = (Math.floor(localTime * 12) + k * 3) % 12 === 0;
      PixelGFX.rect(ctx, kbX + 3 + k * 3, kbY + 1, 2, 2, activeKey ? PAL.chloroplast : PAL.metalLight);
    }

    // 6. AMBOS BRAZOS ARTICULADOS EN LA ESTACIÓN BIOINFORMÁTICA
    // A) Brazo Derecho (tecleando o apuntando hacia el Volcano Plot a la izquierda de su rostro, sin tapar la cara)
    const pointT = MathUtil.smoothstep(3.5, 4.1, localTime);
    const rShoulderX = torsoX + 10;
    const rShoulderY = torsoY + 13;
    const rElbowX = Math.round(MathUtil.lerp(torsoX - 1, torsoX - 8, pointT));
    const rElbowY = Math.round(MathUtil.lerp(torsoY + 29, torsoY + 20, pointT));
    const rWristX = Math.round(MathUtil.lerp(kbX + 16, hitTargetX + 8, pointT));
    const rWristY = Math.round(MathUtil.lerp(kbY - 1, hitTargetY + 14, pointT));

    drawArmSegment(ctx, rShoulderX, rShoulderY, 4.0, rElbowX, rElbowY, 3.4, false);
    drawArmSegment(ctx, rElbowX, rElbowY, 3.4, rWristX, rWristY, 2.8, true);
    PixelGFX.line(ctx, rElbowX - 1, rElbowY - 1, rElbowX + 2, rElbowY - 2, PAL.coatShadow);

    if (pointT > 0.5) {
      ctx.drawImage(handPointScreenSprite, rWristX - 11, rWristY - 5);
    } else {
      const rightTypeFrame = (Math.floor(localTime * 9) % 2 === 0) ? handTypingSpriteA : handTypingSpriteB;
      ctx.drawImage(rightTypeFrame, rWristX - 10, rWristY - 4);
    }

    // B) Brazo Izquierdo en primer plano (tecleando activamente sobre el teclado mecánico)
    const lShoulderX = torsoX + 25;
    const lShoulderY = torsoY + 15;
    const lElbowX = torsoX + 19;
    const lElbowY = torsoY + 33;
    const typeBob = (Math.floor(localTime * 11) % 2);
    const lWristX = kbX + 36;
    const lWristY = kbY - 1 + typeBob;

    drawArmSegment(ctx, lShoulderX, lShoulderY, 4.2, lElbowX, lElbowY, 3.6, false);
    drawArmSegment(ctx, lElbowX, lElbowY, 3.6, lWristX, lWristY, 3.0, true);
    PixelGFX.line(ctx, lElbowX - 2, lElbowY - 1, lElbowX + 1, lElbowY - 2, PAL.coatShadow);

    const leftTypeFrame = (Math.floor(localTime * 11) % 2 === 0) ? handTypingSpriteB : handTypingSpriteA;
    ctx.drawImage(leftTypeFrame, lWristX - 10, lWristY - 4);
  }

  /**
   * Fundido óptico por matriz de Bayer 4x4 entre dos escenas
   */
  function drawBayerTransition(ctx, canvasFrom, canvasTo, progress) {
    ctx.drawImage(canvasFrom, 0, 0);
    for (let y = 0; y < HEIGHT; y++) {
      const sweepOffset = (y / HEIGHT) * 0.18;
      for (let x = 0; x < WIDTH; x++) {
        const localP = MathUtil.clamp((progress - sweepOffset) / 0.82, 0, 1);
        if (localP > MathUtil.bayer(x, y)) {
          ctx.drawImage(canvasTo, x, y, 1, 1, x, y, 1, 1);
        }
      }
    }
  }

  function createFallbackTorso() {
    const c = document.createElement('canvas');
    c.width = 36;
    c.height = 58;
    return c;
  }

  function createFallbackHead() {
    const c = document.createElement('canvas');
    c.width = 28;
    c.height = 23;
    return c;
  }

  /**
   * Renderiza la secuencia de escenas 6, 7 y 8 según el tiempo maestro (27.4s .. 46.8s)
   */
  function render(ctx, time) {
    // Escena 6: Biotecnología en Laboratorio (27.4s .. 33.8s)
    // Transición 6 -> 7: (33.3s .. 34.3s)
    // Escena 7: Invernadero y Riego de Campo (33.8s .. 40.4s)
    // Transición 7 -> 8: (39.9s .. 40.9s)
    // Escena 8: Estación de Bioinformática (40.4s .. 46.8s)

    if (time < 33.3) {
      drawBiotechBenchScene(ctx, Math.max(0, time - 27.4), time);
    } else if (time >= 33.3 && time < 34.3) {
      const p = MathUtil.easeInOutCubic(MathUtil.invLerp(33.3, 34.3, time));
      drawBiotechBenchScene(ctxA, time - 27.4, time);
      drawGreenhouseIrrigationScene(ctxB, Math.max(0, time - 33.3), time);
      drawBayerTransition(ctx, sceneCanvasA, sceneCanvasB, p);
    } else if (time >= 34.3 && time < 39.9) {
      drawGreenhouseIrrigationScene(ctx, time - 33.8, time);
    } else if (time >= 39.9 && time < 40.9) {
      const p = MathUtil.easeInOutCubic(MathUtil.invLerp(39.9, 40.9, time));
      drawGreenhouseIrrigationScene(ctxA, time - 33.8, time);
      drawBioinformaticsScene(ctxB, Math.max(0, time - 39.9), time);
      drawBayerTransition(ctx, sceneCanvasA, sceneCanvasB, p);
    } else {
      drawBioinformaticsScene(ctx, time - 40.4, time);
    }
  }

  ns.BiotechFieldScenes = {
    render,
    drawBiotechBenchScene,
    drawGreenhouseIrrigationScene,
    drawBioinformaticsScene
  };
})(window.MicroCosmos);
