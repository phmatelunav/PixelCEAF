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
  sceneCanvasA.width = ns.CANVAS_WIDTH || 960;
  sceneCanvasA.height = ns.CANVAS_HEIGHT || 540;
  const ctxA = sceneCanvasA.getContext('2d', { willReadFrequently: true });
  ctxA.imageSmoothingEnabled = false;

  const sceneCanvasB = document.createElement('canvas');
  sceneCanvasB.width = ns.CANVAS_WIDTH || 960;
  sceneCanvasB.height = ns.CANVAS_HEIGHT || 540;
  const ctxB = sceneCanvasB.getContext('2d', { willReadFrequently: true });
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
   * Dibuja un segmento de brazo con sombreado cilíndrico de 4 tonos y Sel-Out
   */
  /**
   * Dibuja un segmento de brazo en resolución nativa 960x540 delegando a Sprites.drawTailoredArmSegment
   */
  function drawArmSegment(ctx, x0, y0, w0, x1, y1, w1, isForearm) {
    Sprites.drawTailoredArmSegment(ctx, x0, y0, w0, x1, y1, w1, isForearm);
  }

  // ==========================================================================
  // ESCENA 6 (27.4s .. 33.8s): TRABAJO BIOTECNOLÓGICO EN LABORATORIO
  // Micropipeteo de precisión, PCR, Electroforesis en Gel de Agarosa e In Vitro
  // ==========================================================================
  function drawBiotechBenchScene(ctx, localTime, globalTime) {
    const S = ns.SCALE || 3;
    // 1. Fondo de Cabina de Bioseguridad / Flujo Laminar Blanca
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, PAL.labWallWhite);
    PixelGFX.rect(ctx, 0, 0, WIDTH, 22, PAL.labWallShade);
    PixelGFX.line(ctx, 0, 22, WIDTH - 1, 22, PAL.windowFrameDark);

    // Rejilla difusora HEPA superior y barra de luz estéril cian/UV suave
    for (let x = 16; x < WIDTH - 16; x += 6) {
      PixelGFX.rect(ctx, x, 6, 4, 10, PAL.labWallLine);
      PixelGFX.fineRect(ctx, x * S + 2, 7 * S, 3, 4, PAL.white);
    }
    PixelGFX.rect(ctx, 24, 19, WIDTH - 48, 2, PAL.neonCyan);
    PixelGFX.line(ctx, 24, 20, WIDTH - 25, 20, PAL.white);

    // Paneles modulares blancos de fondo
    for (let x = 40; x < WIDTH; x += 48) {
      PixelGFX.line(ctx, x, 23, x, 124, PAL.labWallLine);
    }
    PixelGFX.line(ctx, 0, 74, WIDTH - 1, 74, PAL.labWallLine);

    // Ventana lateral izquierda mostrando Cordillera de los Andes, nube, cerezos y pétalos al viento
    const winX = 12;
    const winY = 30;
    const winW = 74;
    const winH = 56;
    const sakuraPalette = [PAL.sakuraShadow, PAL.sakuraDeep, PAL.sakuraMid, PAL.sakuraLight, PAL.sakuraWhite];
    PixelGFX.rect(ctx, winX - 2, winY - 2, winW + 4, winH + 4, PAL.windowFrameDark);
    ctx.save();
    ctx.beginPath();
    ctx.rect(winX * S, winY * S, winW * S, winH * S);
    ctx.clip();
    PixelGFX.ditherGradientV(ctx, winX, winY, winW, 38, PAL.skyTop, PAL.skyMid);
    // Nube suave desplazándose lentamente por el cielo exterior
    const cloudX = winX + 12 + Math.round((globalTime * 1.4) % 52);
    PixelGFX.ellipseFill(ctx, cloudX, winY + 11, 11, 4, PAL.white);
    PixelGFX.ellipseFill(ctx, cloudX + 7, winY + 12, 8, 3, PAL.skyHorizon);
    // Cordillera nevada al fondo con pendiente suave por píxel nativo
    for (let fx = 0; fx < winW * S; fx++) {
      const vx = fx / S;
      const mY = Math.round((winY + 25 + Math.sin(vx * 0.11) * 5 + Math.cos(vx * 0.23) * 3) * S);
      PixelGFX.fineRect(ctx, winX * S + fx, mY, 1, (winY + 38) * S - mY, PAL.andesFar);
      if (mY < (winY + 24.5) * S) {
        PixelGFX.fineRect(ctx, winX * S + fx, mY, 1, 6, PAL.andesSnow);
      }
    }
    PixelGFX.rect(ctx, winX, winY + 36, winW, 20, PAL.meadowMid);
    PixelGFX.rect(ctx, winX, winY + 46, winW, 10, PAL.meadowDark);
    // Troncos ramificados y copas de cerezos con racimos de hojas
    PixelGFX.rect(ctx, winX + 18, winY + 30, 4, 16, PAL.trunkDark);
    PixelGFX.line(ctx, winX + 19, winY + 30, winX + 19, winY + 45, PAL.trunkHighlight);
    PixelGFX.foliageCluster(ctx, winX + 20, winY + 26, 16, 11, sakuraPalette, 31);
    PixelGFX.rect(ctx, winX + 52, winY + 32, 4, 15, PAL.trunkDark);
    PixelGFX.line(ctx, winX + 53, winY + 32, winX + 53, winY + 46, PAL.trunkHighlight);
    PixelGFX.foliageCluster(ctx, winX + 54, winY + 28, 15, 10, sakuraPalette, 67);
    // Pétalos de cerezo delicados de dos tonos flotando en diagonal con la brisa tras el cristal
    for (let p = 0; p < 8; p++) {
      const pProg = (globalTime * 0.42 + p * 0.15) % 1.0;
      const fpx = Math.round((winX + ((p * 17 + pProg * 36) % (winW - 4))) * S);
      const fpy = Math.round((winY + 14 + pProg * 38 + Math.sin(globalTime * 3 + p) * 1.5) * S);
      PixelGFX.fineRect(ctx, fpx, fpy, 2, 1, p % 2 === 0 ? PAL.sakuraWhite : PAL.sakuraLight);
      PixelGFX.finePset(ctx, fpx + 1, fpy + 1, PAL.sakuraWhite);
    }
    ctx.restore();
    PixelGFX.line(ctx, winX + 37, winY, winX + 37, winY + winH - 1, PAL.windowFrameWhite);
    PixelGFX.rectOutline(ctx, winX, winY, winW, winH, PAL.white);

    // Estantería derecha doble: Cajas Magenta In Vitro arriba + Matraces Erlenmeyer abajo
    const shelfX = 236;
    const shelfY = 54;
    PixelGFX.rect(ctx, shelfX, shelfY, 74, 3, PAL.windowFrameDark);
    PixelGFX.line(ctx, shelfX, shelfY, shelfX + 73, shelfY, PAL.white);

    for (let i = 0; i < 3; i++) {
      const fx = shelfX + 6 + i * 23;
      const fy = shelfY - 21;
      PixelGFX.drawSprite(ctx, Sprites.inVitroPlant, fx, fy);
      if ((Math.floor(globalTime * 4) + i) % 3 === 0) {
        PixelGFX.fineCircleFill(ctx, (fx + 7) * S, (fy + 15) * S, 2, PAL.neonCyanLight);
      }
    }

    // Segunda repisa inferior con Matraces Erlenmeyer cónicos de paredes suaves 960x540
    const shelf2Y = 88;
    PixelGFX.rect(ctx, shelfX, shelf2Y, 74, 3, PAL.windowFrameDark);
    PixelGFX.line(ctx, shelfX, shelf2Y, shelfX + 73, shelf2Y, PAL.white);
    const mediaColors = [PAL.neonCyan, PAL.chloroplast, PAL.sakuraMid];
    for (let i = 0; i < 3; i++) {
      const ex = shelfX + 14 + i * 22;
      const ey = shelf2Y - 1;
      // Cuello del matraz Erlenmeyer y tapón de algodón estéril
      PixelGFX.rect(ctx, ex - 2, ey - 15, 5, 5, PAL.windowFrameWhite);
      PixelGFX.rect(ctx, ex - 2, ey - 17, 5, 2, PAL.white);
      // Cuerpo cónico de vidrio por scanline nativo
      const fex = ex * S + 1;
      const fey = (ey - 10) * S;
      for (let fr = 0; fr < 10 * S; fr++) {
        const hw = Math.round(6 + fr * 0.55);
        const fry = fey + fr;
        const isLiquid = fr >= 4 * S;
        PixelGFX.fineRect(ctx, fex - hw, fry, hw * 2 + 1, 1, isLiquid ? mediaColors[i] : '#e2e8f0');
        PixelGFX.fineRect(ctx, fex - hw, fry, 2, 1, PAL.windowFrameDark);
        PixelGFX.fineRect(ctx, fex + hw - 1, fry, 2, 1, PAL.windowFrameDark);
        if (fr === 4 * S) {
          PixelGFX.fineRect(ctx, fex - hw + 2, fry, hw * 2 - 3, 2, PAL.white);
        }
        PixelGFX.fineRect(ctx, fex - hw + 3, fry, 2, 1, PAL.white);
      }
      // Micro-burbuja ascendente dentro del medio líquido
      const bubPhase = (globalTime * 1.8 + i * 0.37) % 1.0;
      const bubY = Math.round((ey - 2 - bubPhase * 4) * S);
      PixelGFX.fineCircleFill(ctx, fex + (i % 2 === 0 ? 3 : -3), bubY, 2, PAL.white);
    }

    // 2. Mesada Blanca de Biotecnología Molecular (y = 122) + Gabinetes Clínicos Inferiores
    const deskY = 122;
    PixelGFX.drawLabCabinets(ctx, deskY + 9, HEIGHT, 0, WIDTH);
    PixelGFX.rect(ctx, 0, deskY, WIDTH, 9, PAL.benchFront);
    PixelGFX.rect(ctx, 0, deskY, WIDTH, 3, PAL.benchSurface);
    PixelGFX.rect(ctx, 0, deskY + 3, WIDTH, 3, PAL.benchTop);
    PixelGFX.rect(ctx, 0, deskY + 8, WIDTH, 2, PAL.benchShadow);

    // Carrusel porta-micropipetas y caja de puntas estériles a la derecha de la investigadora
    const standX = 248;
    const standY = deskY - 22;
    PixelGFX.rect(ctx, standX - 5, deskY - 3, 12, 3, PAL.metalDark);
    PixelGFX.rect(ctx, standX, standY, 2, 20, PAL.metalMid);
    PixelGFX.rect(ctx, standX - 6, standY + 2, 14, 3, PAL.gloveCyan);
    PixelGFX.line(ctx, standX - 4, standY + 5, standX - 4, standY + 15, PAL.equipWhite);
    PixelGFX.line(ctx, standX + 5, standY + 5, standX + 5, standY + 15, PAL.equipWhite);
    // Caja de puntas estériles (Tip Box)
    PixelGFX.bevelRect(ctx, 270, deskY - 13, 28, 13, PAL.equipWhite, PAL.white, PAL.equipShade, PAL.metalDark);
    PixelGFX.rect(ctx, 272, deskY - 11, 24, 4, PAL.gloveCyan);
    for (let tx = 274; tx < 294; tx += 3) {
      PixelGFX.fineRect(ctx, tx * S, (deskY - 10) * S, 3, 4, PAL.white);
    }

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
    PixelGFX.fineRect(ctx, (lcdX + 3 + pcrCursor) * S, (lcdY + 2) * S, 2, 11 * S, PAL.starGold);
    // LEDs de estado del PCR
    PixelGFX.pset(ctx, pcrX + 8, pcrY + 30, PAL.chloroplast);
    PixelGFX.pset(ctx, pcrX + 12, pcrY + 30, (Math.floor(globalTime * 6) % 2 === 0) ? PAL.neonCyan : PAL.screenGrid);

    // 4. Cámara de Electroforesis en Gel de Agarosa / Transiluminador UV (x = 66)
    const gelX = 64;
    const gelY = deskY - 22;
    PixelGFX.rect(ctx, gelX, gelY, 48, 22, PAL.metalDark);
    PixelGFX.rect(ctx, gelX + 2, gelY + 2, 44, 15, '#120b29'); // ventana UV oscura
    PixelGFX.rectOutline(ctx, gelX + 2, gelY + 2, 44, 15, PAL.nebulaMagenta);

    // Carriles de ADN fluorescente migrando en el gel con bandas nítidas de 2px nativos
    const migrationShift = (localTime % 3.2) * 1.8;
    for (let lane = 0; lane < 6; lane++) {
      const flx = (gelX + 6 + lane * 6) * S;
      // Pocillo superior
      PixelGFX.fineRect(ctx, flx, (gelY + 4) * S, 12, 2, PAL.neonCyanDark);
      // Bandas de ADN (escalera molecular en carril 0 y muestras en 1..5)
      const fb1Y = Math.round((gelY + 6 + ((lane + migrationShift) % 4)) * S);
      const fb2Y = Math.round((gelY + 10 + ((lane * 2 + migrationShift) % 4)) * S);
      const fb3Y = (gelY + 14) * S;
      PixelGFX.fineRect(ctx, flx, fb1Y, 12, 2, lane === 0 ? PAL.starGold : PAL.neonCyan);
      PixelGFX.fineRect(ctx, flx, fb2Y, 12, 2, PAL.chloroplast);
      if (lane % 2 === 0) {
        PixelGFX.fineRect(ctx, flx, fb3Y, 12, 2, PAL.neonPinkLight);
      }
    }
    // Cables rojo y negro de electroforesis
    PixelGFX.line(ctx, gelX + 4, gelY + 19, gelX - 4, deskY - 1, PAL.neonPink);
    PixelGFX.line(ctx, gelX + 44, gelY + 19, gelX + 50, deskY - 1, PAL.metalMid);

    // 5. Investigadora Biotecnóloga en Plano Medio (con Guantes de Nitrilo Cian y Micropipeta)
    const cycleDuration = 1.22;
    const rawWell = Math.floor(localTime / cycleDuration);
    const wellIndex = Math.min(4, rawWell);
    const prevWellIndex = Math.max(0, wellIndex - 1);
    const cyclePhase = (localTime % cycleDuration) / cycleDuration;

    let horizT = 1;
    if (wellIndex > 0 && rawWell <= 4 && cyclePhase < 0.22) {
      horizT = MathUtil.easeInOutCubic(cyclePhase / 0.22);
    }
    let dipProgress = 0;
    if (cyclePhase >= 0.22 && cyclePhase < 0.44) {
      dipProgress = MathUtil.easeInOutCubic((cyclePhase - 0.22) / 0.22);
    } else if (cyclePhase >= 0.44 && cyclePhase < 0.68) {
      dipProgress = 1;
    } else if (cyclePhase >= 0.68 && cyclePhase < 0.92) {
      dipProgress = 1 - MathUtil.easeInOutCubic((cyclePhase - 0.68) / 0.24);
    }
    const headNod = Math.round(dipProgress * 1.5);

    const headBaseX = 181;
    const headBaseY = 51 + headNod;
    const torsoX = 164;
    const torsoY = 71;

    // Coleta larga de alta precisión nativa 960x540
    Sprites.drawPonytail(ctx, headBaseX, headBaseY, globalTime);

    // Torso con bata blanca (recortado en deskY)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH * S, deskY * S);
    ctx.clip();
    PixelGFX.drawSprite(ctx, Sprites.scientistTorso || createFallbackTorso(), torsoX, torsoY);
    ctx.restore();

    // Rostro, cuello, ojos con doble reflejo, pestañas y gafas finas en 960x540 nativo
    const isBlink6 = ((localTime + 1.1) % 3.4) > 3.24;
    Sprites.drawScientistHeadAndFace(ctx, headBaseX, headBaseY, torsoX, torsoY, {
      time: globalTime,
      blink: isBlink6,
      amazed: 0,
      lookDown: true
    });

    // 6. Gradilla Térmica Iluminada de Microtubos PCR justo frente a la investigadora (x = 152..184)
    const rackX = 152;
    const rackY = deskY - 18; // 104

    const prevWellCenterX = rackX + 6 + prevWellIndex * 5;
    const targetWellX = rackX + 6 + wellIndex * 5;
    const targetWellY = rackY;
    const tipX = Math.round(MathUtil.lerp(prevWellCenterX, targetWellX, horizT));
    const tipY = Math.round(MathUtil.lerp(targetWellY - 6, targetWellY, dipProgress));

    // A) Brazo Derecho (en segundo plano, sujetando el borde derecho de la gradilla)
    const rShoulderX = torsoX + 9;
    const rShoulderY = torsoY + 13;
    const rElbowX = torsoX + 6;
    const rElbowY = torsoY + 23;
    const rWristX = rackX + 28;
    const rWristY = rackY + 1;

    drawArmSegment(ctx, rShoulderX, rShoulderY, 3.6, rElbowX, rElbowY, 3.0, false);
    drawArmSegment(ctx, rElbowX, rElbowY, 3.0, rWristX, rWristY, 2.5, true);

    // Base del bloque térmico + gradilla metálica y los 5 tubos PCR translúcidos
    PixelGFX.rect(ctx, rackX - 1, rackY + 11, 34, 7, PAL.benchEdge);
    PixelGFX.rect(ctx, rackX, rackY + 5, 32, 7, PAL.metalDark);
    PixelGFX.rect(ctx, rackX + 1, rackY + 6, 30, 5, PAL.metalMid);
    PixelGFX.rect(ctx, rackX + 2, rackY + 11, 28, 2, PAL.neonCyan);

    // Vapor frío / condensación sutil emanando de los costados del bloque térmico refrigerado
    for (let m = 0; m < 3; m++) {
      const mPhase = (globalTime * 1.6 + m * 0.33) % 1.0;
      const fmxL = Math.round((rackX - 2 - mPhase * 4) * S);
      const fmyL = Math.round((rackY + 9 + mPhase * 3) * S);
      PixelGFX.fineRect(ctx, fmxL, fmyL, 2, 2, mPhase < 0.5 ? PAL.neonCyanLight : PAL.windowFrameWhite);
    }

    for (let w = 0; w < 5; w++) {
      const wx = rackX + 4 + w * 5;
      const isFilled = w < wellIndex || (w === wellIndex && cyclePhase >= 0.54);
      const isCurrentTarget = (w === wellIndex);
      PixelGFX.rect(ctx, wx, rackY, 5, 1, isCurrentTarget ? PAL.neonCyanLight : PAL.windowFrameWhite);
      PixelGFX.rect(ctx, wx, rackY + 1, 5, 5, PAL.windowFrameWhite);
      PixelGFX.rect(ctx, wx + 1, rackY + 1, 3, 4, isFilled ? PAL.chloroplast : '#194d47');
      if (isFilled) {
        PixelGFX.fineRect(ctx, (wx + 1) * S + 1, (rackY + 1) * S, 7, 2, PAL.white);
        PixelGFX.ditherGlow(ctx, wx + 2, rackY + 3, 2, 5, PAL.chloroplast, 0.55);
      }
    }

    // Mano derecha enguantada estabilizando el lateral de la gradilla
    PixelGFX.drawSprite(ctx, glovedRackHandSprite, rWristX - 8, rWristY - 4);

    // B) Brazo Izquierdo en primer plano sosteniendo la micropipeta
    const spriteX = tipX - 8;
    const spriteY = tipY - 16;

    const lShoulderX = torsoX + 23;
    const lShoulderY = torsoY + 14;
    const lWristX = spriteX + 12;
    const lWristY = spriteY + 5;
    const lElbowX = Math.round(MathUtil.lerp(lShoulderX, lWristX, 0.45)) + 3;
    const lElbowY = torsoY + 24;

    drawArmSegment(ctx, lShoulderX, lShoulderY, 3.8, lElbowX, lElbowY, 3.2, false);
    drawArmSegment(ctx, lElbowX, lElbowY, 3.2, lWristX, lWristY, 2.6, true);

    // Émbolo superior de la micropipeta
    let plungerPress = 0;
    if (cyclePhase >= 0.40 && cyclePhase < 0.72) {
      plungerPress = 2;
    } else if (cyclePhase >= 0.32 && cyclePhase < 0.40) {
      plungerPress = 1;
    }
    PixelGFX.rect(ctx, tipX - 1, spriteY - 2 + plungerPress, 3, 3, PAL.neonPink);
    PixelGFX.pset(ctx, tipX, spriteY - 2 + plungerPress, PAL.neonPinkLight);

    // Mano enguantada + Micropipeta alineada al píxel con el centro del tubo (tipX, tipY)
    PixelGFX.drawSprite(ctx, glovedPipetteHandSprite, spriteX, spriteY);
    if (cyclePhase < 0.50) {
      PixelGFX.fineRect(ctx, tipX * S, (tipY - 1) * S, 3, 3, PAL.neonCyanLight);
      PixelGFX.fineRect(ctx, tipX * S + 1, tipY * S, 2, 2, PAL.white);
    }

    // Microgota fluorescente saliendo de la punta hacia el interior del tubo
    if (cyclePhase >= 0.44 && cyclePhase < 0.66) {
      const dropFrac = (cyclePhase - 0.44) / 0.22;
      const dropY = MathUtil.lerp(tipY, targetWellY + 2, dropFrac);
      PixelGFX.fineLine(ctx, targetWellX * S + 1, tipY * S, targetWellX * S + 1, dropY * S, PAL.neonCyan, 2);
      PixelGFX.fineCircleFill(ctx, targetWellX * S + 1, dropY * S, 2, PAL.white);
    }
    if (cyclePhase >= 0.52 && cyclePhase < 0.84) {
      const ringProgress = (cyclePhase - 0.52) / 0.32;
      const ringR = Math.max(1, Math.round(ringProgress * 5));
      PixelGFX.circleOutline(ctx, targetWellX, targetWellY + 1, ringR, PAL.neonCyanLight);
      PixelGFX.pset(ctx, targetWellX, targetWellY + 1, PAL.white);
    }
  }

  // ==========================================================================
  // ESCENA 7 (33.8s .. 40.4s): INVERNADERO Y RIEGO EN MUESTRAS DE CAMPO
  // Invernadero soleado, bancal con rizotrón, sensores de humedad y riego activo
  // ==========================================================================
  function drawGreenhouseIrrigationScene(ctx, localTime, globalTime) {
    const S = ns.SCALE || 3;
    const hydration = MathUtil.clamp(localTime / 5.2, 0, 1);

    // 1. Cielo luminoso con gradiente suave y Cordillera de los Andes vista a través del invernadero
    PixelGFX.ditherGradientV(ctx, 0, 0, WIDTH, 60, PAL.skyTop, PAL.skyMid);
    PixelGFX.ditherGradientV(ctx, 0, 60, WIDTH, 64, PAL.skyMid, PAL.skyHorizon);

    // Sol radiante y nubes altas desplazándose suavemente con el viento
    PixelGFX.circleFill(ctx, 56, 36, 14, PAL.sunbeamCore);
    PixelGFX.ditherGlow(ctx, 56, 36, 12, 34, PAL.sunbeamWarm, 0.7);
    const ghCloud1X = 128 + Math.round(localTime * 2.4);
    const ghCloud2X = 236 + Math.round(localTime * 1.8);
    PixelGFX.ellipseFill(ctx, ghCloud1X, 32, 16, 5, PAL.white);
    PixelGFX.ellipseFill(ctx, ghCloud1X + 10, 34, 12, 4, PAL.skyHorizon);
    PixelGFX.ellipseFill(ctx, ghCloud2X, 27, 14, 4, PAL.white);

    // Cordillera de los Andes en el horizonte exterior con pendiente suave por píxel nativo 960x540
    for (let fx = 0; fx < WIDTH * S; fx++) {
      const vx = fx / S;
      const farPeak = Math.round((74 + Math.sin(vx * 0.032 + 0.8) * 10 + Math.cos(vx * 0.085) * 5) * S);
      PixelGFX.fineRect(ctx, fx, farPeak, 1, 108 * S - farPeak, PAL.andesFar);
      if (farPeak < 71.5 * S) {
        PixelGFX.fineRect(ctx, fx, farPeak, 1, 9, PAL.andesSnow);
      }
    }

    // Colinas agrícolas verdes y cerezos exteriores con copas de racimos orgánicos
    PixelGFX.rect(ctx, 0, 124, WIDTH, 12, PAL.meadowDark);
    PixelGFX.ellipseFill(ctx, 70, 118, 95, 28, PAL.meadowDark);
    PixelGFX.ellipseFill(ctx, 220, 120, 110, 30, PAL.meadowMid);
    const sakuraPalette = [PAL.sakuraShadow, PAL.sakuraDeep, PAL.sakuraMid, PAL.sakuraLight, PAL.sakuraWhite];
    for (let c = 0; c < 4; c++) {
      const cx = 28 + c * 62;
      const cy = 92 + (c % 2) * 4;
      PixelGFX.rect(ctx, cx - 1, cy + 4, 3, 11, PAL.trunkDark);
      PixelGFX.line(ctx, cx, cy + 4, cx, cy + 14, PAL.trunkHighlight);
      PixelGFX.foliageCluster(ctx, cx, cy, 14, 9, sakuraPalette, 19 + c * 23);
    }
    // Pétalos de cerezo flotando en el exterior tras el cristal del invernadero
    for (let p = 0; p < 10; p++) {
      const pProg = (globalTime * 0.35 + p * 0.13) % 1.0;
      const fpx = Math.round(((p * 37 + pProg * 54) % (WIDTH - 20)) * S);
      const fpy = Math.round((54 + pProg * 46 + Math.sin(globalTime * 2.6 + p) * 2) * S);
      PixelGFX.fineRect(ctx, fpx, fpy, 2, 1, p % 2 === 0 ? PAL.sakuraWhite : PAL.sakuraLight);
      PixelGFX.finePset(ctx, fpx + 1, fpy + 1, PAL.sakuraWhite);
    }

    // 2. Estructura Metálica Acristalada del Invernadero Experimental
    for (let x = 0; x <= WIDTH; x += 54) {
      PixelGFX.line(ctx, x, 18, x, 124, PAL.windowFrameWhite);
      PixelGFX.line(ctx, x + 1, 18, x + 1, 124, PAL.white);
      PixelGFX.line(ctx, x, 18, x + 27, 0, PAL.windowFrameWhite);
      PixelGFX.line(ctx, x, 18, x - 27, 0, PAL.windowFrameWhite);
    }
    PixelGFX.rect(ctx, 0, 16, WIDTH, 3, PAL.windowFrameDark);
    PixelGFX.line(ctx, 0, 16, WIDTH - 1, 16, PAL.white);
    PixelGFX.line(ctx, 0, 68, WIDTH - 1, 68, PAL.windowFrameWhite);

    // Rayos de sol diagonales atravesando el techo del invernadero con dithering Bayer 4x4 nativo 960x540 (1x1px)
    ctx.fillStyle = PAL.sunbeamCore;
    for (let fpy = 19 * S; fpy < 126 * S; fpy++) {
      const shift = (fpy - 19 * S) * 0.5;
      for (let fpx = 12 * S; fpx < 260 * S; fpx++) {
        const relX = (fpx - shift) / S;
        if ((relX > 20 && relX < 64) || (relX > 95 && relX < 145)) {
          if (MathUtil.bayer(fpx, fpy) < 0.22) {
            ctx.fillRect(fpx, fpy, 1, 1);
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
      // Rocío fino de alta definición desde los microaspersores superiores
      for (let d = 0; d < 8; d++) {
        const dropAge = (localTime * 2.8 + d * 0.13 + n * 0.3) % 1.0;
        const spread = (d - 3.5) * 2.6 * dropAge;
        const fdx = Math.round((nx + spread) * S);
        const fdy = Math.round((28 + dropAge * 68) * S);
        if (fdy < 104 * S) {
          PixelGFX.fineRect(ctx, fdx, fdy, 2, 3, d % 2 === 0 ? PAL.waterDropLight : PAL.waterDropMid);
          PixelGFX.finePset(ctx, fdx, fdy, PAL.white);
        }
      }
    }

    // Piso del invernadero bajo/alrededor del bancal
    PixelGFX.rect(ctx, 0, 136, 214, HEIGHT - 136, '#cbd5e1');
    PixelGFX.rect(ctx, 0, 136, 214, 4, '#94a3b8');

    // 4. Bancal Elevado de Muestras de Campo con Ventana de Rizotrón (x = 10 .. 214, y = 108 .. 170)
    const bedX = 10;
    const bedY = 110;
    const bedW = 204;
    const bedH = 62;

    PixelGFX.rect(ctx, bedX - 2, bedY - 3, bedW + 4, bedH + 5, PAL.metalDark);
    PixelGFX.rect(ctx, bedX, bedY - 2, bedW, 4, PAL.terracottaLight);
    PixelGFX.line(ctx, bedX, bedY + 1, bedX + bedW - 1, bedY + 1, PAL.terracottaDark);

    // Sustrato estratificado
    const wetRows = Math.round(hydration * (bedH - 6));
    for (let sy = 0; sy < bedH - 4; sy++) {
      const py = bedY + 2 + sy;
      const isMoist = sy <= wetRows;
      let baseCol;
      if (sy > bedH - 13) {
        baseCol = isMoist ? '#4a2c20' : '#6b4230';
      } else {
        baseCol = isMoist
          ? (sy < wetRows - 6 ? PAL.soilWetDark : PAL.soilWetMid)
          : (sy < 12 ? PAL.soilDryLight : PAL.soilDryMid);
      }
      PixelGFX.rect(ctx, bedX, py, bedW, 1, baseCol);

      for (let sx = 6; sx < bedW - 6; sx += 8) {
        if (sy < 18 && (sx + sy * 5) % 11 === 0) {
          PixelGFX.fineRect(ctx, (bedX + sx) * S, py * S, 3, 2, '#e2e8f0');
        } else if (sy > bedH - 13 && (sx + sy * 3) % 5 === 0) {
          PixelGFX.fineRect(ctx, (bedX + sx) * S, py * S, 5, 3, PAL.terracottaDark);
        } else if ((sx + sy * 3) % 7 === 0) {
          PixelGFX.fineRect(ctx, (bedX + sx) * S, py * S, 3, 2, isMoist ? PAL.soilDryMid : PAL.soilDryLight);
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
      const plantVigor = MathUtil.clamp((hydration - p * 0.08) * 1.4, 0, 1);
      const lift = Math.round(plantVigor * 3);
      const sway = Math.round(Math.sin(globalTime * 2.5 + p) * 1);

      // A) Sistema radicular ramificado visible bajo tierra dentro del rizotrón en trazos finos
      const rootLen = 18 + Math.round(plantVigor * 14);
      PixelGFX.line(ctx, px, bedY + 4, px + sway, bedY + 4 + rootLen, PAL.rootWallLight);
      PixelGFX.line(ctx, px, bedY + 11, px - 7, bedY + 19 + Math.round(plantVigor * 5), PAL.rootWallMid);
      PixelGFX.line(ctx, px, bedY + 14, px + 8, bedY + 23 + Math.round(plantVigor * 5), PAL.rootWallMid);
      if (plantVigor > 0.35) {
        // Pelos radiculares finos y simbiosis micorrícica activándose con el agua
        PixelGFX.fineLine(ctx, (px - 4) * S, (bedY + 16) * S, (px - 9) * S, (bedY + 18) * S, PAL.neonCyan, 1);
        PixelGFX.fineLine(ctx, (px + 5) * S, (bedY + 19) * S, (px + 10) * S, (bedY + 21) * S, PAL.neonCyan, 1);
        PixelGFX.fineCircleFill(ctx, (px + sway) * S, (bedY + 4 + rootLen) * S, 3, PAL.chloroplast);
      }

      // B) Tallo aéreo leñoso/herbáceo, ramas laterales, hojas con nervadura central y floración
      const stemTopY = py - 19 - lift - (p % 2) * 3;
      PixelGFX.line(ctx, px, py, px + sway, stemTopY, PAL.epidermisWall);
      PixelGFX.line(ctx, px + 1, py, px + 1 + sway, stemTopY, PAL.chloroplast);

      const leafSpread = 6 + Math.round(plantVigor * 2);
      const lLeafX = px - leafSpread + sway;
      const lLeafY = stemTopY + 8;
      PixelGFX.ellipseFill(ctx, lLeafX, lLeafY + 1, 5, 3, PAL.epidermisWall);
      PixelGFX.ellipseFill(ctx, lLeafX, lLeafY, 4, 2, PAL.chloroplast);
      PixelGFX.fineLine(ctx, (px + sway - 1) * S, (lLeafY + 1) * S, (lLeafX - 2) * S, lLeafY * S, PAL.epidermisHighlight, 2);

      const rLeafX = px + leafSpread + sway;
      const rLeafY = stemTopY + 6;
      PixelGFX.ellipseFill(ctx, rLeafX, rLeafY + 1, 5, 3, PAL.epidermisWall);
      PixelGFX.ellipseFill(ctx, rLeafX, rLeafY, 4, 2, PAL.chloroplast);
      PixelGFX.fineLine(ctx, (px + sway + 1) * S, (rLeafY + 1) * S, (rLeafX + 2) * S, rLeafY * S, PAL.epidermisHighlight, 2);

      PixelGFX.ellipseFill(ctx, px + sway, stemTopY, 4, 3, PAL.chloroplast);
      PixelGFX.pset(ctx, px + sway, stemTopY - 1, PAL.epidermisHighlight);

      // Floración de cerezo (Sakura de 5 pétalos definidos en 960x540)
      if (plantVigor > 0.3) {
        const ffx = (px + sway) * S;
        const ffy = (stemTopY - 3) * S;
        PixelGFX.fineCircleFill(ctx, ffx, ffy - 4, 3, PAL.sakuraWhite);
        PixelGFX.fineCircleFill(ctx, ffx - 4, ffy - 1, 3, PAL.sakuraLight);
        PixelGFX.fineCircleFill(ctx, ffx + 4, ffy - 1, 3, PAL.sakuraLight);
        PixelGFX.fineCircleFill(ctx, ffx - 3, ffy + 3, 3, PAL.sakuraMid);
        PixelGFX.fineCircleFill(ctx, ffx + 3, ffy + 3, 3, PAL.sakuraMid);
        PixelGFX.fineCircleFill(ctx, ffx, ffy, 2, PAL.starGold);
      }

      // Frutos rojos/terracota (drupas/cerezos CEAF) colgando de las ramas hidratadas
      if (plantVigor > 0.46) {
        const fruitGrow = MathUtil.invLerp(0.46, 0.9, plantVigor);
        const fRadius = Math.round((1.2 + fruitGrow * 1.1) * S);

        const flX = (px - leafSpread + 2 + sway) * S;
        const flY = (stemTopY + 12) * S;
        PixelGFX.fineLine(ctx, (px - 2 + sway) * S, (stemTopY + 9) * S, flX, flY - 2, PAL.ceafGreen, 2);
        PixelGFX.fineCircleFill(ctx, flX, flY, fRadius, PAL.ceafFruit);
        PixelGFX.fineCircleFill(ctx, flX - 2, flY - 2, Math.max(1, Math.floor(fRadius * 0.45)), PAL.ceafFruitLight);

        if (plantVigor > 0.62) {
          const frX = (px + leafSpread - 2 + sway) * S;
          const frY = (stemTopY + 10) * S;
          PixelGFX.fineLine(ctx, (px + 2 + sway) * S, (stemTopY + 7) * S, frX, frY - 2, PAL.ceafGreen, 2);
          PixelGFX.fineCircleFill(ctx, frX, frY, fRadius, PAL.ceafFruit);
          PixelGFX.fineCircleFill(ctx, frX - 2, frY - 2, Math.max(1, Math.floor(fRadius * 0.45)), PAL.white);
        }
      }

      // C) Etiqueta de fenotipado de campo y sensor digital de humedad junto a cada planta
      const tagX = px + 11;
      const tagY = py - 9;
      PixelGFX.line(ctx, tagX + 2, tagY + 5, tagX + 2, py + 2, PAL.metalLight);
      PixelGFX.rect(ctx, tagX, tagY, 6, 5, PAL.white);
      PixelGFX.line(ctx, tagX + 1, tagY + 1, tagX + 4, tagY + 1, p % 2 === 0 ? PAL.neonCyanDark : PAL.neonPink);
      PixelGFX.pset(ctx, tagX + 2, tagY + 3, plantVigor > 0.4 ? PAL.chloroplast : PAL.starGold);
    }

    // 6. Investigadora de cuerpo completo en el Invernadero regando las muestras
    PixelGFX.rect(ctx, 214, 136, WIDTH - 214, HEIGHT - 136, '#cbd5e1');
    PixelGFX.rect(ctx, 214, 136, WIDTH - 214, 4, '#94a3b8');
    for (let tx = 220; tx < WIDTH; tx += 24) {
      PixelGFX.line(ctx, tx, 140, tx - 8, HEIGHT - 1, '#94a3b8');
    }

    const swayBody = Math.round(Math.sin(localTime * 2.2) * 1);
    const headBaseX = 246 + swayBody;
    const headBaseY = 46;
    const torsoX = 229 + swayBody;
    const torsoY = 66;

    // Sombra en el piso del invernadero y piernas/calzado de laboratorio (debajo de la bata)
    PixelGFX.ellipseFill(ctx, torsoX + 20, 165, 16, 4, '#94a3b8');
    PixelGFX.rect(ctx, torsoX + 11, torsoY + 56, 7, 38, '#1e293b');
    PixelGFX.rect(ctx, torsoX + 12, torsoY + 56, 3, 38, '#334155');
    PixelGFX.rect(ctx, torsoX + 21, torsoY + 56, 8, 39, '#1e293b');
    PixelGFX.rect(ctx, torsoX + 22, torsoY + 56, 4, 39, '#334155');
    PixelGFX.rect(ctx, torsoX + 8, 159, 10, 5, PAL.metalDark);
    PixelGFX.rect(ctx, torsoX + 9, 159, 8, 3, PAL.white);
    PixelGFX.rect(ctx, torsoX + 18, 160, 11, 5, PAL.metalDark);
    PixelGFX.rect(ctx, torsoX + 19, 160, 9, 3, PAL.white);

    // Maceta de terracota cilíndrica sombreada a la derecha con arbolito frutal CEAF en racimos
    PixelGFX.bevelRect(ctx, 288, 148, 18, 16, PAL.terracottaDark, PAL.terracottaLight, '#7f2d1d', '#451a03');
    PixelGFX.bevelRect(ctx, 286, 144, 22, 5, PAL.terracottaLight, '#fdba74', PAL.terracottaDark, '#451a03');
    PixelGFX.rect(ctx, 296, 138, 3, 7, PAL.trunkDark);
    PixelGFX.foliageCluster(ctx, 297, 135, 9, 6, [PAL.epidermisWall, PAL.epidermisMid, PAL.chloroplast, PAL.epidermisHighlight], 88);
    PixelGFX.circleFill(ctx, 301, 137, 2, PAL.ceafFruit);
    PixelGFX.pset(ctx, 300, 136, PAL.ceafFruitLight);
    PixelGFX.circleFill(ctx, 293, 134, 2, PAL.sakuraLight);
    PixelGFX.pset(ctx, 293, 134, PAL.starGold);

    // Coleta larga de alta precisión nativa 960x540
    Sprites.drawPonytail(ctx, headBaseX, headBaseY, globalTime);

    // Torso de la investigadora
    PixelGFX.drawSprite(ctx, Sprites.scientistTorso || createFallbackTorso(), torsoX, torsoY);

    // Rostro, cuello, ojos con doble reflejo, pestañas y gafas finas en 960x540 nativo
    const isBlink7 = ((localTime + 0.8) % 3.5) > 3.34;
    Sprites.drawScientistHeadAndFace(ctx, headBaseX, headBaseY, torsoX, torsoY, {
      time: globalTime,
      blink: isBlink7,
      amazed: 0,
      lookDown: false
    });

    // 7. Regadera Científica / Lanza de Riego y Ambos Brazos Articulados
    const canX = 216 + swayBody;
    const canY = 85 + Math.round(Math.sin(localTime * 3.0) * 1.5);

    const rShoulderX = torsoX + 10;
    const rShoulderY = torsoY + 13;
    const rElbowX = torsoX + 5;
    const rElbowY = torsoY + 25;
    const rWristX = canX + 12;
    const rWristY = canY + 11;
    drawArmSegment(ctx, rShoulderX, rShoulderY, 3.8, rElbowX, rElbowY, 3.2, false);
    drawArmSegment(ctx, rElbowX, rElbowY, 3.2, rWristX, rWristY, 2.6, true);

    // Cuerpo de la regadera de laboratorio
    PixelGFX.bevelRect(ctx, canX, canY + 2, 18, 14, PAL.gloveCyan, PAL.gloveHighlight, '#0077b6', PAL.metalDark);
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

    PixelGFX.drawSprite(ctx, handWateringSideSprite, rWristX - 8, rWristY - 4);

    // B) Brazo Izquierdo en primer plano sujetando el asa superior
    const lShoulderX = torsoX + 23;
    const lShoulderY = torsoY + 14;
    const lElbowX = torsoX + 15;
    const lElbowY = torsoY + 25;
    const lWristX = canX + 16;
    const lWristY = canY - 1;
    drawArmSegment(ctx, lShoulderX, lShoulderY, 4.0, lElbowX, lElbowY, 3.4, false);
    drawArmSegment(ctx, lElbowX, lElbowY, 3.4, lWristX, lWristY, 2.8, true);
    PixelGFX.drawSprite(ctx, handWateringTopSprite, lWristX - 9, lWristY - 4);

    // 8. Chorros Parabólicos de Gotas de Agua en forma de lágrima nativa 960x540
    const numStreams = 5;
    for (let s = 0; s < numStreams; s++) {
      for (let k = 0; k < 8; k++) {
        const phase = (localTime * 2.6 + k * 0.125 + s * 0.11) % 1.0;
        const startX = spoutTipX - 5;
        const startY = spoutTipY - 2 + s * 1.2;
        const rangeX = 42 + s * 28;
        const dropX = startX - phase * rangeX;
        const dropY = startY - Math.sin(phase * Math.PI) * 8 + phase * phase * 26;

        if (dropY <= bedY) {
          const fdx = Math.round(dropX * S);
          const fdy = Math.round(dropY * S);
          const col = (k + s) % 2 === 0 ? PAL.waterDropLight : PAL.waterDropMid;
          PixelGFX.fineCircleFill(ctx, fdx, fdy, 2, col);
          PixelGFX.finePset(ctx, fdx + 2, fdy - 1, col);
          PixelGFX.finePset(ctx, fdx - 1, fdy - 1, PAL.white);
        } else if (phase > 0.86) {
          const fdx = Math.round(dropX * S);
          PixelGFX.fineRect(ctx, fdx - 5, (bedY - 2) * S, 2, 2, PAL.waterDropLight);
          PixelGFX.fineRect(ctx, fdx + 4, (bedY - 2) * S, 2, 2, PAL.white);
        }
      }
    }
  }

  // ==========================================================================
  // ESCENA 8 (40.4s .. 46.8s): ESTACIÓN DE BIOINFORMÁTICA Y GENÓMICA
  // Investigadora revisando triple monitor con ADN, Heatmap RNA-seq y Proteína 3D
  // ==========================================================================
  function drawBioinformaticsScene(ctx, localTime, globalTime) {
    const S = ns.SCALE || 3;
    const deskY = 122;

    // 1. Ambiente del Centro de Bioinformática en el Laboratorio
    PixelGFX.rect(ctx, 0, 0, WIDTH, HEIGHT, '#0b1324');
    PixelGFX.rect(ctx, 0, 0, WIDTH, deskY, '#111c33');

    for (let x = 32; x < WIDTH; x += 48) {
      PixelGFX.line(ctx, x, 0, x, deskY, '#1a2a4a');
    }
    PixelGFX.line(ctx, 0, 28, WIDTH - 1, 28, '#1a2a4a');

    // 2. Torre Secuenciadora de Alto Rendimiento (NGS Sequencer)
    const seqX = 8;
    const seqY = 24;
    const seqH = deskY - seqY;
    PixelGFX.rect(ctx, seqX, seqY, 34, seqH, PAL.metalDark);
    PixelGFX.rect(ctx, seqX + 2, seqY + 2, 30, seqH - 4, '#162238');
    PixelGFX.rectOutline(ctx, seqX, seqY, 34, seqH, PAL.metalMid);
    PixelGFX.rect(ctx, seqX - 1, deskY - 3, 36, 3, PAL.metalLight);
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
    const m1Y = 36;
    const m1W = 62;
    const m1H = 54;
    PixelGFX.rect(ctx, m1X + 26, m1Y + m1H, 10, deskY - (m1Y + m1H), PAL.metalDark);
    PixelGFX.rect(ctx, m1X + 28, m1Y + m1H, 6, deskY - (m1Y + m1H), PAL.metalMid);
    PixelGFX.rect(ctx, m1X + 16, deskY - 3, 30, 3, PAL.metalLight);
    PixelGFX.line(ctx, m1X + 16, deskY - 3, m1X + 45, deskY - 3, PAL.metalShine);
    PixelGFX.rect(ctx, m1X - 2, m1Y - 2, m1W + 4, m1H + 4, PAL.metalLight);
    PixelGFX.rect(ctx, m1X, m1Y, m1W, m1H, PAL.screenBg);
    PixelGFX.rect(ctx, m1X, m1Y, m1W, 5, '#153252');

    // Cinta de hélice alfa y lámina beta 3D de alta resolución 960x540
    const protCX = (m1X + 19) * S;
    const protCY = (m1Y + 29) * S;
    let prevPX = null;
    let prevPY = null;
    for (let a = 0; a < 28; a++) {
      const ang = globalTime * 2.4 + a * 0.325;
      const fpx = protCX + Math.round(Math.cos(ang) * 11 * S);
      const fpy = Math.round(protCY - 15 * S + a * 1.15 * S + Math.sin(ang * 1.5) * 2 * S);
      const col = a % 6 < 2 ? PAL.neonPinkLight : (a % 4 < 2 ? PAL.neonCyan : PAL.chloroplast);
      const shadowCol = a % 6 < 2 ? PAL.neonPinkDark : PAL.neonCyanDark;
      if (prevPX !== null) {
        PixelGFX.fineLine(ctx, prevPX, prevPY + 2, fpx, fpy + 2, shadowCol, 3);
        PixelGFX.fineLine(ctx, prevPX, prevPY, fpx, fpy, col, 3);
      }
      if (a % 2 === 0) {
        PixelGFX.fineRect(ctx, fpx - 1, fpy - 1, 2, 2, PAL.white);
      }
      prevPX = fpx;
      prevPY = fpy;
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
    const m2Y = 28;
    const m2W = 108;
    const m2H = 64;
    PixelGFX.rect(ctx, m2X + 47, m2Y + m2H, 14, deskY - (m2Y + m2H), PAL.metalDark);
    PixelGFX.rect(ctx, m2X + 49, m2Y + m2H, 10, deskY - (m2Y + m2H), PAL.metalMid);
    PixelGFX.rect(ctx, m2X + 34, deskY - 3, 40, 3, PAL.metalLight);
    PixelGFX.line(ctx, m2X + 34, deskY - 3, m2X + 73, deskY - 3, PAL.metalShine);
    PixelGFX.rect(ctx, m2X - 2, m2Y - 2, m2W + 4, m2H + 4, PAL.equipWhite);
    PixelGFX.rect(ctx, m2X, m2Y, m2W, m2H, PAL.screenBg);
    PixelGFX.rect(ctx, m2X, m2Y, m2W, 5, '#0f3654');
    PixelGFX.pset(ctx, m2X + 3, m2Y + 2, PAL.neonPink);
    PixelGFX.pset(ctx, m2X + 6, m2Y + 2, PAL.starGold);
    PixelGFX.pset(ctx, m2X + 9, m2Y + 2, PAL.chloroplast);

    // Panel Superior: Alineamiento Múltiple de Secuencias con nucleótidos nítidos
    const seqStartX = m2X + 5;
    const seqStartY = m2Y + 9;
    const scrollOffset = Math.floor(localTime * 6);
    for (let row = 0; row < 4; row++) {
      PixelGFX.rect(ctx, seqStartX, seqStartY + row * 4, 8, 2, row === 0 ? PAL.neonCyan : PAL.metalLight);
      for (let col = 0; col < 27; col++) {
        const baseIdx = (row * 7 + col + scrollOffset) % 4;
        const bx = seqStartX + 12 + col * 3;
        const by = seqStartY + row * 4;
        PixelGFX.fineRect(ctx, bx * S, by * S, 6, 6, baseColors[baseIdx]);
        PixelGFX.finePset(ctx, bx * S + 1, by * S + 1, PAL.white);
      }
    }
    const locusBoxX = seqStartX + 30 + Math.round(Math.sin(localTime * 2.0) * 8);
    PixelGFX.rectOutline(ctx, locusBoxX, seqStartY - 1, 18, 17, PAL.white);

    PixelGFX.line(ctx, m2X + 3, m2Y + 27, m2X + m2W - 4, m2Y + 27, PAL.screenGrid);

    // Subpanel Inferior Izquierdo: RNA-seq Heatmap con bordes nítidos de 1px nativo
    const hmX = m2X + 5;
    const hmY = m2Y + 31;
    for (let hr = 0; hr < 6; hr++) {
      for (let hc = 0; hc < 8; hc++) {
        const val = Math.sin(hr * 1.3 + hc * 0.9 + localTime * 2.2);
        const cellCol = val > 0.35
          ? PAL.chloroplast
          : (val > -0.2 ? PAL.neonCyanDark : PAL.neonPink);
        PixelGFX.fineRect(ctx, (hmX + hc * 5) * S, (hmY + hr * 5) * S, 13, 13, cellCol);
      }
    }

    // Subpanel Inferior Derecho: Volcano Plot de alta densidad y Alerta de Descubrimiento Genómico
    const vpX = m2X + 50;
    const vpY = m2Y + 31;
    const vpW = 52;
    const vpH = 29;
    PixelGFX.rect(ctx, vpX, vpY, vpW, vpH, '#04101c');
    PixelGFX.rectOutline(ctx, vpX, vpY, vpW, vpH, PAL.screenGrid);
    PixelGFX.fineLine(ctx, (vpX + 26) * S, (vpY + 2) * S, (vpX + 26) * S, (vpY + vpH - 2) * S, PAL.screenGrid, 1);
    PixelGFX.fineLine(ctx, (vpX + 2) * S, (vpY + 12) * S, (vpX + vpW - 2) * S, (vpY + 12) * S, PAL.neonPinkDark, 1);
    for (let g = 0; g < 38; g++) {
      const side = g % 2 === 0 ? 1 : -1;
      const spread = 1.5 + (g % 19) * 1.1;
      const fgx = Math.round((vpX + 26 + side * spread) * S);
      const fgy = Math.round((vpY + 25 - (spread * 1.08) + ((g * 3) % 5) * 0.8) * S);
      const isSig = fgy < (vpY + 12) * S;
      const gCol = isSig ? (side > 0 ? PAL.chloroplast : PAL.neonCyan) : PAL.metalMid;
      PixelGFX.fineCircleFill(ctx, fgx, fgy, isSig ? 2 : 1, gCol);
    }

    const hitActive = localTime > 3.2;
    const hitTargetX = vpX + 34;
    const hitTargetY = vpY + 8;
    if (hitActive) {
      PixelGFX.circleOutline(ctx, hitTargetX, hitTargetY, 3 + (Math.floor(globalTime * 6) % 2), PAL.starGold);
      PixelGFX.pset(ctx, hitTargetX, hitTargetY, PAL.white);
      PixelGFX.rect(ctx, vpX + 3, vpY + 2, 24, 5, PAL.chloroplast);
      PixelGFX.line(ctx, vpX + 5, vpY + 4, vpX + 24, vpY + 4, PAL.screenBg);
    }

    // C) Monitor Derecho: Correlación Fenómica (curvas continuas en 960x540 nativo)
    const m3X = 248;
    const m3Y = 36;
    const m3W = 64;
    const m3H = 54;
    PixelGFX.rect(ctx, m3X + 27, m3Y + m3H, 10, deskY - (m3Y + m3H), PAL.metalDark);
    PixelGFX.rect(ctx, m3X + 29, m3Y + m3H, 6, deskY - (m3Y + m3H), PAL.metalMid);
    PixelGFX.rect(ctx, m3X + 17, deskY - 3, 30, 3, PAL.metalLight);
    PixelGFX.line(ctx, m3X + 17, deskY - 3, m3X + 46, deskY - 3, PAL.metalShine);
    PixelGFX.rect(ctx, m3X - 2, m3Y - 2, m3W + 4, m3H + 4, PAL.metalLight);
    PixelGFX.rect(ctx, m3X, m3Y, m3W, m3H, PAL.screenBg);
    PixelGFX.rect(ctx, m3X, m3Y, m3W, 5, '#153252');
    for (let fx = 0; fx < (m3W - 10) * S; fx++) {
      const vx = fx / S;
      const fy1 = Math.round((m3Y + 22 + Math.sin(vx * 0.18 - localTime * 3.5) * 7) * S);
      const fy2 = Math.round((m3Y + 38 + Math.cos(vx * 0.18 - localTime * 3.5) * 6) * S);
      PixelGFX.fineRect(ctx, (m3X + 5) * S + fx, fy1, 2, 2, PAL.neonCyan);
      PixelGFX.fineRect(ctx, (m3X + 5) * S + fx, fy2, 2, 2, PAL.chloroplast);
    }

    // 4. Silla Ergonómica de Laboratorio y Personaje Bioinformático
    const isPointing = localTime > 3.6;
    const headBaseX = 223;
    const headBaseY = 54;
    const torsoX = 206;
    const torsoY = 74;

    // Respaldo ergonómico con cabecera, soporte lumbar biselado y apoyabrazos
    PixelGFX.bevelRect(ctx, torsoX + 25, torsoY - 2, 10, 7, '#1e293b', PAL.metalLight, '#0f172a', PAL.metalDark);
    PixelGFX.bevelRect(ctx, torsoX + 26, torsoY + 6, 13, 42, '#1e293b', PAL.metalMid, '#0f172a', PAL.metalDark);
    PixelGFX.rect(ctx, torsoX + 28, torsoY + 12, 8, 28, '#334155');
    PixelGFX.rect(ctx, torsoX + 20, torsoY + 36, 16, 4, PAL.metalDark);

    // Coleta larga de alta precisión nativa 960x540
    Sprites.drawPonytail(ctx, headBaseX, headBaseY, globalTime);

    // Torso recortado limpiamente por el borde del escritorio (deskY = 122)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH * S, deskY * S);
    ctx.clip();
    PixelGFX.drawSprite(ctx, Sprites.scientistTorso || createFallbackTorso(), torsoX, torsoY);
    ctx.restore();

    // Rostro, cuello, ojos con doble reflejo, pestañas y gafas finas en 960x540 nativo
    const isBlink8 = ((localTime + 1.6) % 3.6) > 3.44 && !isPointing;
    const eyeScan = Math.floor(localTime * 4) % 2;
    Sprites.drawScientistHeadAndFace(ctx, headBaseX, headBaseY, torsoX, torsoY, {
      time: globalTime,
      blink: isBlink8,
      amazed: isPointing ? 1.0 : 0.0,
      lookDown: false,
      eyeShiftX: eyeScan * 2
    });

    // 5. Escritorio Técnico, Racks Inferiores de Cómputo, Mousepad y Teclado Mecánico Retroiluminado
    PixelGFX.rect(ctx, 0, deskY, WIDTH, HEIGHT - deskY, '#0f172a');
    PixelGFX.rect(ctx, 0, deskY, WIDTH, 4, '#475569');
    PixelGFX.line(ctx, 0, deskY, WIDTH - 1, deskY, PAL.neonCyan);
    for (let gx = 10; gx < WIDTH - 40; gx += 62) {
      PixelGFX.bevelRect(ctx, gx, deskY + 8, 54, HEIGHT - deskY - 12, '#162238', '#1e293b', '#090d16', '#0b1324');
      PixelGFX.rect(ctx, gx + 6, deskY + 13, 12, 2, PAL.metalMid);
      PixelGFX.pset(ctx, gx + 46, deskY + 14, (Math.floor(globalTime * 5 + gx) % 2 === 0) ? PAL.neonCyan : PAL.chloroplast);
    }

    // Mousepad técnico + Ratón óptico ergonómico junto al teclado
    PixelGFX.rect(ctx, 152, deskY - 2, 18, 2, '#153252');
    PixelGFX.rect(ctx, 156, deskY - 5, 9, 4, PAL.metalMid);
    PixelGFX.line(ctx, 157, deskY - 5, 163, deskY - 5, PAL.white);
    PixelGFX.pset(ctx, 159, deskY - 4, PAL.neonCyan);

    const kbX = 176;
    const kbY = deskY - 5;
    PixelGFX.rect(ctx, kbX, kbY, 42, 6, PAL.metalDark);
    PixelGFX.line(ctx, kbX + 1, kbY + 5, kbX + 40, kbY + 5, PAL.neonCyan);
    for (let k = 0; k < 11; k++) {
      const activeKey = (Math.floor(localTime * 12) + k * 3) % 11 === 0;
      PixelGFX.rect(ctx, kbX + 3 + k * 3, kbY + 1, 2, 2, activeKey ? PAL.chloroplast : PAL.metalLight);
    }

    // 6. AMBOS BRAZOS ARTICULADOS CON PROPORCIÓN ANATÓMICA
    const pointT = MathUtil.smoothstep(3.5, 4.1, localTime);
    const rShoulderX = torsoX + 10;
    const rShoulderY = torsoY + 13;
    const rElbowX = Math.round(MathUtil.lerp(torsoX - 1, torsoX - 4, pointT));
    const rElbowY = Math.round(MathUtil.lerp(torsoY + 28, torsoY + 22, pointT));
    const rWristX = Math.round(MathUtil.lerp(kbX + 14, hitTargetX - 2, pointT));
    const rWristY = Math.round(MathUtil.lerp(kbY - 1, hitTargetY + 9, pointT));

    drawArmSegment(ctx, rShoulderX, rShoulderY, 4.0, rElbowX, rElbowY, 3.4, false);
    drawArmSegment(ctx, rElbowX, rElbowY, 3.4, rWristX, rWristY, 2.8, true);

    if (pointT > 0.5) {
      PixelGFX.drawSprite(ctx, handPointScreenSprite, rWristX - 11, rWristY - 5);
    } else {
      const rightTypeFrame = (Math.floor(localTime * 9) % 2 === 0) ? handTypingSpriteA : handTypingSpriteB;
      PixelGFX.drawSprite(ctx, rightTypeFrame, rWristX - 10, rWristY - 4);
    }

    // B) Brazo Izquierdo en primer plano
    const lShoulderX = torsoX + 24;
    const lShoulderY = torsoY + 15;
    const lElbowX = torsoX + 18;
    const lElbowY = torsoY + 30;
    const typeBob = (Math.floor(localTime * 11) % 2);
    const lWristX = kbX + 32;
    const lWristY = kbY - 1 + typeBob;

    drawArmSegment(ctx, lShoulderX, lShoulderY, 4.2, lElbowX, lElbowY, 3.6, false);
    drawArmSegment(ctx, lElbowX, lElbowY, 3.6, lWristX, lWristY, 3.0, true);

    const leftTypeFrame = (Math.floor(localTime * 11) % 2 === 0) ? handTypingSpriteB : handTypingSpriteA;
    PixelGFX.drawSprite(ctx, leftTypeFrame, lWristX - 10, lWristY - 4);
  }

  /**
   * Fundido óptico por matriz de Bayer 4x4 entre dos escenas
   */
  function drawBayerTransition(ctx, canvasFrom, canvasTo, progress) {
    ctx.drawImage(canvasFrom, 0, 0);
    PixelGFX.ditherReveal(ctx, canvasTo, (x, y) => MathUtil.clamp((progress - (y / HEIGHT) * 0.18) / 0.82, 0, 1));
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
      drawGreenhouseIrrigationScene(ctxB, Math.max(0, time - 33.8), time);
      drawBayerTransition(ctx, sceneCanvasA, sceneCanvasB, p);
    } else if (time >= 34.3 && time < 39.9) {
      drawGreenhouseIrrigationScene(ctx, time - 33.8, time);
    } else if (time >= 39.9 && time < 40.9) {
      const p = MathUtil.easeInOutCubic(MathUtil.invLerp(39.9, 40.9, time));
      drawGreenhouseIrrigationScene(ctxA, time - 33.8, time);
      drawBioinformaticsScene(ctxB, Math.max(0, time - 40.4), time);
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
