/**
 * sprites.js
 * Sprites Pixel-Art diseñados píxel a píxel para la Investigadora de Biología Molecular de Plantas,
 * con manos detalladas (dedos articulados), pliegues de bata de laboratorio, rostro esculpido,
 * Microscopio de Fluorescencia/Confocal y Equipos de Biotecnología Vegetal.
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  const { PAL, PixelGFX, MathUtil } = ns;

  function compileSprite(rows, paletteMap) {
    const h = rows.length;
    const w = rows.reduce((max, r) => Math.max(max, r.length), 0);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < h; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === '.' || ch === ' ') continue;
        const color = paletteMap[ch];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    return canvas;
  }

  const PROP_MAP = {
    'M': PAL.metalDark,
    'm': PAL.metalMid,
    'L': PAL.metalLight,
    'S': PAL.metalShine,
    'G': PAL.glassEdge,
    'w': PAL.white,
    'E': PAL.neonEmerald,
    'e': PAL.neonEmeraldDark,
    'g': PAL.chloroplast,
    'd': PAL.rootWallMid,
    'C': PAL.neonCyan,
    'c': PAL.neonCyanMid,
    'P': PAL.neonPink,
    'p': PAL.neonPinkDark,
    'k': PAL.neonPinkLight,
    'B': PAL.brassMid,
    'b': PAL.brassDark,
    'Y': PAL.starGold,
    'y': PAL.starGoldLight,
    'A': PAL.agarGel,
    'a': PAL.agarLight
  };

  // Frasco de cultivo in vitro (Magenta box) con plántula y raíces visibles en agar (16x21)
  const inVitroPlantSprite = compileSprite([
    '..mmmmmmmmmmmm..',
    '.mLLLLLLLLLLLLm.',
    '.GGGGGGGGGGGGGG.',
    '.G............G.',
    '.G.....gg.....G.',
    '.G...ggEEgg...G.',
    '.G..gEEddEEg..G.',
    '.G....dggd....G.',
    '.G...ggEEgg...G.',
    '.G..gEEddEEg..G.',
    '.G.....EE.....G.',
    '.G.....EE.....G.',
    '.GaaaaaaaaaaaaG.',
    '.GAaAAAyYAAAaAG.',
    '.GAAAAy..yAAAAG.',
    '.GAAAy.YY.yAAAG.',
    '.GAAy.y..y.yAAG.',
    '.GAACy....yCAAG.',
    '.GAAy..CC..yAAG.',
    '.GAAAAAAAAAAAA..',
    '..GGGGGGGGGGGG..'
  ], PROP_MAP);

  // Gradilla de microtubos Eppendorf con muestras fluorescentes GFP/RFP (18x9)
  const eppendorfRackSprite = compileSprite([
    '..GG..GG..GG..GG..',
    '..EE..CC..PP..YY..',
    '..EE..CC..PP..YY..',
    '.mLLLLLLLLLLLLLLm.',
    '.mMMMMMMMMMMMMMMm.',
    '.m..EE..CC..PP..m.',
    '.m...e...c...p..m.',
    '.mLLLLLLLLLLLLLLm.',
    '.MMMMMMMMMMMMMMMM.'
  ], PROP_MAP);

  // Plántula pequeña para la cámara de cultivo (Fitotrón) (10x12)
  const chamberPlantSprite = compileSprite([
    '....gg....',
    '..ggEEgg..',
    '.gEEddEEg.',
    '....EE....',
    '..ggEEgg..',
    '....EE....',
    '.GGGGGGGG.',
    '.GaaYYaaG.',
    '.GAy..yAG.',
    '.GA.yy.AG.',
    '.GAAAAAAG.',
    '..GGGGGG..'
  ], PROP_MAP);

  // ============================================================================
  // SPRITES PIXEL-ART DE LA INVESTIGADORA (CABEZA, TORSO Y MANOS ARTICULADAS)
  // ============================================================================
  const SCIENTIST_MAP = {
    // Cabello con 5 niveles de profundidad y brillo por racimos
    'H': '#150d21', // sombra profunda del cabello
    'h': '#27183b', // tono medio del cabello
    'l': '#432b63', // reflejo violeta del cabello
    'v': '#64448f', // luz secundaria de mechones
    's': '#4895ef', // brillo azulado sutil
    'M': '#f72585', // coletero magenta
    'm': '#ff75b8', // luz del coletero

    // Piel y rostro con Selective Outlining (Sel-Out)
    'o': '#7d4038', // contorno oscuro de piel (mandíbula/dedos/nariz)
    'q': '#9e5448', // contorno suave Sel-Out para mejilla iluminada
    'd': '#b86958', // sombra de piel
    'k': '#eba087', // tono medio de piel
    'f': '#ffcab5', // luz de piel
    'b': '#f26d7d', // rubor de mejilla
    'r': '#c9425a', // labios
    'w': '#ffffff', // blanco (esclerótica / dientes / bata luz)
    'i': '#1ca3b8', // iris turquesa
    'p': '#120d1c', // pupila / pestañas

    // Gafas finas y accesorios
    'g': '#72b5d8', // montura fina de gafas
    'G': '#bae6fd', // brillo de gafas
    'Y': '#ffbe0b', // collar dorado / detalles
    'C': '#00f5d4', // arete cian / reflejo

    // Bata de laboratorio y blusa
    'O': '#54688a', // contorno exterior de bata
    'S': '#93a8c9', // sombra de pliegues de bata
    'c': '#b8cbe6', // semisombra suave de tela
    'B': '#dce7f7', // tono medio de bata
    'W': '#ffffff', // luz principal de bata
    'T': '#0d4740', // blusa esmeralda oscura
    't': '#177366', // blusa esmeralda media
    'E': '#1e8238', // verde de gafete / hoja CEAF
    'F': '#d45132', // esfera naranja CEAF
    'P': '#f72585'  // bolígrafo rosa
  };

  // Torso esculpido en Pixel-Art (36x58):
  // Silueta limpia de torso femenino (los dos brazos articulados se dibujan por separado).
  const scientistTorsoSprite = compileSprite([
    '..............odkffkdo..............',
    '..............odkkkkdo..............',
    '.............oodYYYYdoo.............',
    '..........OOOWWWttttWWWOOO..........',
    '........OOWWWWWWttttWWWWWWOO........',
    '.......OWWWWWWWWtTTtWWWWWWWWOO......',
    '......OWWWWWWWWWtTTtWWWWWWWWBSO.....',
    '......OWWWOWWWWWtTTtWWWWWWOWBBSO....',
    '......OWWWOOWWWWtTTtWWWWWOOWBBBSO...',
    '......OWWWBBOWWWtTTtWWWWOOWWBBBSO...',
    '......OWWWBBBOWWtTTtWWWOOWWWBBBBSO..',
    '......OWWWBBBBOWtTTtWWOOWWWWBBBBSO..',
    '......OWWWBBBBBOWTTtWOOWWWWWBBBBBSO.',
    '......OWWBBOOBBBOWTTWOOWWWWWWBBBBBSO.',
    '......OWBBBBOOBBBOWWOOWWWWWWWBBBBBSO.',
    '......OWBBBBBOOBBBOOOOWWWWWWWBBBBBSO.',
    '......OWBBBBBBOOBBOWWOWWWWWWWBBBBBBSO',
    '......OWBBBBBBBOOBOWWOWWOOOOOBBBBBSO',
    '......OWBBBBBBBBOOBWWOWOPwEEOBBBBBSO',
    '......OWBBBBBSBBBOOWWOWOwwwwOBBBBBSO',
    '......OWBBBBBSBBBBOOOOWOwEFwOBBBBBSO',
    '......OWBBBBBSBBBBOWWWOWOwwwwOBBBBBSO',
    '......OWBBBBBSBBBBOWYWOWOOOOOOBBBBBSO',
    '......OWBBBBBSBBBBOWWWOWWWWWWWBBBBBSO',
    '.......OWBBBBSBBBBOWWWOWWWWWWWBBBBBSO',
    '.......OWBBBBSBBBBOWWWOWWWWWWWBBBBBSO',
    '.......OWBBBBSBBBBOWWWOWWWWWWSBBBBBSO',
    '.......OWBBBBSBBBBOWYWOWWWWWWSBBBBBSO',
    '.......OWBBBBSBBBBOWWWOWWWWWWSBBBBBSO',
    '.......OWBBBBSBBBBOWWWOWWWWWSWBBBBBSO',
    '.......OWBBBBSBBBBOWWWOWWWWWSWBBBBBSO',
    '.......OWBBBBSBBBBOWWWOWWWWWSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWWWSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWWSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWWSSWBBBBBSO',
    '.......OWBSBBBBBBBOWYWOWWWWSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWWSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OWBSBBBBBBBOWWWOWWWSSSWBBBBBSO',
    '.......OOOOOOOOOOOOOOOOOOOOOOOOOOOOO'
  ], SCIENTIST_MAP);

  // Cabeza y Rostro esculpido en Pixel-Art (28x23) con mechones volumétricos y Sel-Out en mejilla/mandíbula
  const scientistHeadSprite = compileSprite([
    '.......HHHHHHHHHHHHHH.......',
    '.....HHHHhhhhhhhhhhHHHH.....',
    '....HHHhhhllvvvvllhhhHHH....',
    '...HHHhhllvvssssvvllhhHHH...',
    '..HHHhhllvvhhhhhhvvllhhHHH..',
    '..HHhhlhhHHHHHHHHhhhlhhhHH..',
    '.HHhhlhHHHHkkffkkHHHHlhhhHH.',
    '.HHhlhHHHkkffffffkkHHHlhhHH.',
    '.HHhhHHkkffffffffffkkHHhhHH.',
    '.HHhHHkffffffffffffffkHHhHH.',
    '..H.qkffffffffffffffffkHHH..',
    '....qkffffffffffffffffkHHH..',
    '...oqkffffffffffffffffkHHH..',
    '..qffffffffffffffffHkdoHH...',
    '..qkffffffffffffffffHkkdoH..',
    '...oqkffffffffffffffHkkCo...',
    '....qkfffffffffffffkHkkdo...',
    '....qkfffbbbfffffffkHooo....',
    '.....qkffbbbffffffkkdo......',
    '.....oqkfffffffffkkdo.......',
    '......oqkfffffffkkdo........',
    '........oqqkkkkkdoo.........',
    '..........ooooooo...........'
  ], SCIENTIST_MAP);

  // Mano Izquierda Pixel-Art 1: Sujetando y girando la perilla del microscopio (14x10)
  // Muestra el pulgar arriba y 4 dedos definidos curvados sobre el micrómetro
  const handKnobSpriteA = compileSprite([
    '....oooo......',
    '...offffo.....',
    '..okffffkoOOO.',
    '.ookkkkkkOWWWO',
    '.offffkkkOWBBO',
    '.okkkodddOWBBO',
    '..oookkkdoSSSO',
    '...ookkdo.OOO.',
    '....oooo......',
    '..............'
  ], SCIENTIST_MAP);

  // Mano Izquierda Pixel-Art 2: Ligera articulación de dedos al girar la perilla (14x10)
  const handKnobSpriteB = compileSprite([
    '.....oooo.....',
    '....offffo....',
    '..ookffffkoOO.',
    '.offkkkkkkOWWO',
    '.okkkkdddkOWBO',
    '..oookkkddOWBO',
    '...ookkkdoOSSO',
    '....ooooo..OO.',
    '..............',
    '..............'
  ], SCIENTIST_MAP);

  // Mano Izquierda Pixel-Art 3: Mano abierta/expresiva con dedos definidos en gesto de asombro (13x12)
  const handAmazedSprite = compileSprite([
    '...oo.oo.....',
    '..ofkokfo.oo.',
    '..ofkokfookfo',
    '.oofkokfokfko',
    'ookfffffffkdo',
    'offfffffffkdo',
    '.okkkkkkkkdo.',
    '..odkkkkkdo..',
    '...ookkkdo...',
    '....OWWWWO...',
    '....OWBBBO...',
    '....OOOOOO...'
  ], SCIENTIST_MAP);

  // Mano Derecha Pixel-Art 1: Estabilizando la base del microscopio / apoyada en la mesada (14x9)
  // Muestra el puño de la bata, el pulgar y 4 dedos articulados apoyados con naturalidad
  const handRightBenchSprite = compileSprite([
    '.......oooo...',
    '.....ooffffo..',
    '...ookffffkko.',
    '.ookfffkkkkBWO',
    'offkoddkkkBWWO',
    'ooookdddooBBBO',
    '..ooooooo.OSSO',
    '...........OOO',
    '..............'
  ], SCIENTIST_MAP);

  // Mano Derecha Pixel-Art 2: Mano derecha levantada en gesto de asombro con dedos definidos (12x11)
  const handRightAmazedSprite = compileSprite([
    '..oo.oo.....',
    '.ofkokfo.oo.',
    '.ofkokfookfo',
    'ookfffffffko',
    'offffffffkdo',
    '.okkkkkkkdo.',
    '..odkkkkdo..',
    '...ookkdo...',
    '....OWWWO...',
    '....OWBBO...',
    '....OOOOO...'
  ], SCIENTIST_MAP);

  /**
   * Dibuja un brazo de bata de laboratorio mediante un polígono trapezoidal pixel-perfect
   * con bordes de 1px limpios, sombreado cel-shaded y pliegues en el codo (sin esferas).
   */
  function drawTailoredArmSegment(ctx, x0, y0, w0, x1, y1, w1, isForearm) {
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;

    // 1. Relleno interior de la manga en 4 tonos (luz superior -> medio claro -> semisombra -> sombra inferior)
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = MathUtil.lerp(x0, x1, t);
      const cy = MathUtil.lerp(y0, y1, t);
      const halfW = MathUtil.lerp(w0, w1, t);

      for (let d = -halfW; d <= halfW; d += 0.45) {
        const px = Math.round(cx + nx * d);
        const py = Math.round(cy + ny * d);
        let col = PAL.coatMid;
        if (d < -halfW + 1.1) {
          col = PAL.white;
        } else if (d > halfW - 1.1) {
          col = PAL.coatShadow;
        } else if (d > 0.35) {
          col = '#c5d6ed';
        }
        PixelGFX.pset(ctx, px, py, col);
      }
    }

    // 2. Bordes exteriores limpios de 1px (Sel-Out: borde superior suave, borde inferior oscuro)
    const topX0 = Math.round(x0 - nx * w0);
    const topY0 = Math.round(y0 - ny * w0);
    const topX1 = Math.round(x1 - nx * w1);
    const topY1 = Math.round(y1 - ny * w1);

    const botX0 = Math.round(x0 + nx * w0);
    const botY0 = Math.round(y0 + ny * w0);
    const botX1 = Math.round(x1 + nx * w1);
    const botY1 = Math.round(y1 + ny * w1);

    PixelGFX.line(ctx, topX0, topY0, topX1, topY1, '#758bad');
    PixelGFX.line(ctx, botX0, botY0, botX1, botY1, PAL.coatOutline);

    if (isForearm) {
      PixelGFX.line(ctx, topX1, topY1, botX1, botY1, PAL.coatOutline);
    }
  }

  /**
   * Dibuja el microscopio óptico de fluorescencia / confocal sobre la mesada
   */
  function drawMicroscope(ctx, state) {
    const {
      time,
      knobTurn = 0,
      slideGlow = 1.0
    } = state;

    const baseX = 136;
    const baseY = 131;

    // 1. Halo de fluorescencia clorofílica/GFP sobre el portaobjetos con muestra vegetal
    const sampleX = baseX + 13;
    const sampleY = baseY - 33;
    const pulse = 0.75 + 0.25 * Math.sin(time * 4.5);
    const glowRadius = (19 + 5 * Math.sin(time * 3.2)) * slideGlow;

    PixelGFX.ditherGlow(ctx, sampleX, sampleY, 3, glowRadius, PAL.rootWallMid, 0.8 * slideGlow);
    PixelGFX.ditherGlow(ctx, sampleX, sampleY, 2, glowRadius * 0.6, PAL.neonCyanDark, 0.7 * slideGlow);
    PixelGFX.ditherGlow(ctx, sampleX, sampleY, 1, glowRadius * 0.35, PAL.chloroplast, 0.9 * slideGlow);

    // 2. Base moderna del microscopio de investigación
    PixelGFX.rect(ctx, baseX - 3, baseY - 4, 36, 4, PAL.metalDark);
    PixelGFX.rect(ctx, baseX - 1, baseY - 6, 32, 3, PAL.metalMid);
    PixelGFX.rect(ctx, baseX + 1, baseY - 7, 28, 1, PAL.metalLight);
    PixelGFX.rect(ctx, baseX + 3, baseY - 3, 4, 1, PAL.chloroplast);

    // 3. Iluminador láser/fluorescencia inferior
    PixelGFX.rect(ctx, baseX + 10, baseY - 14, 6, 8, PAL.metalDark);
    PixelGFX.line(ctx, sampleX, baseY - 17, sampleX, sampleY + 2, PAL.neonEmerald);
    PixelGFX.line(ctx, sampleX - 1, baseY - 16, sampleX - 1, sampleY + 2, PAL.neonCyan);

    // 4. Columna / Brazo ergonómico
    PixelGFX.rect(ctx, baseX + 21, baseY - 47, 8, 41, PAL.metalDark);
    PixelGFX.rect(ctx, baseX + 22, baseY - 46, 6, 39, PAL.metalMid);
    PixelGFX.rect(ctx, baseX + 22, baseY - 45, 2, 37, PAL.metalLight);

    // Cabezal superior con módulo de epifluorescencia
    PixelGFX.rect(ctx, baseX + 14, baseY - 55, 14, 9, PAL.metalMid);
    PixelGFX.rect(ctx, baseX + 13, baseY - 54, 2, 7, PAL.metalLight);
    PixelGFX.rect(ctx, baseX + 18, baseY - 52, 5, 2, PAL.neonCyan);

    // 5. Platina mecánica y muestra botánica
    PixelGFX.rect(ctx, baseX + 2, baseY - 32, 22, 3, PAL.metalDark);
    PixelGFX.rect(ctx, baseX + 3, baseY - 33, 20, 1, PAL.metalLight);
    PixelGFX.rect(ctx, baseX + 6, sampleY, 14, 1, PAL.glassEdge);
    PixelGFX.rect(ctx, sampleX - 3, sampleY - 2, 6, 2, PAL.neonEmerald);
    PixelGFX.rect(ctx, sampleX - 2, sampleY - 2, 4, 1, PAL.chloroplast);
    PixelGFX.pset(ctx, sampleX, sampleY - 3, PAL.starGoldLight);

    // 6. Cabezal óptico y objetivos
    const focusOffset = Math.round(Math.sin(knobTurn) * 1);
    const headX = baseX + 10;
    const headY = baseY - 58 + focusOffset;

    PixelGFX.rect(ctx, headX + 1, headY + 11, 9, 4, PAL.metalDark);
    PixelGFX.rect(ctx, headX + 2, headY + 11, 7, 3, PAL.metalLight);
    PixelGFX.rect(ctx, sampleX - 2, headY + 15, 4, 6, PAL.metalMid);
    PixelGFX.rect(ctx, sampleX - 1, headY + 15, 2, 5, PAL.metalShine);
    PixelGFX.rect(ctx, sampleX - 2, headY + 18, 4, 1, PAL.neonEmerald);
    PixelGFX.rect(ctx, sampleX - 1, headY + 20, 2, 1, PAL.neonCyan);

    PixelGFX.rect(ctx, headX, headY, 13, 11, PAL.metalMid);
    PixelGFX.rect(ctx, headX + 1, headY + 1, 4, 9, PAL.metalLight);
    PixelGFX.rect(ctx, headX + 2, headY + 2, 1, 7, PAL.metalShine);

    // Tubo binocular inclinado hacia la investigadora
    for (let step = 0; step < 11; step++) {
      const tx = headX + 10 + step;
      const ty = headY + 2 - Math.floor(step * 0.75);
      PixelGFX.rect(ctx, tx, ty - 2, 3, 5, PAL.metalDark);
      PixelGFX.rect(ctx, tx, ty - 1, 2, 3, PAL.metalLight);
      if (step % 3 === 0) {
        PixelGFX.pset(ctx, tx, ty - 1, PAL.metalShine);
      }
    }

    const ocularX = headX + 21;
    const ocularY = headY - 6;
    PixelGFX.rect(ctx, ocularX - 1, ocularY - 3, 4, 7, PAL.metalDark);
    PixelGFX.rect(ctx, ocularX, ocularY - 2, 3, 5, PAL.metalMid);
    PixelGFX.rect(ctx, ocularX + 1, ocularY - 2, 2, 4, PAL.metalShine);
    PixelGFX.rect(ctx, ocularX + 2, ocularY - 1, 2, 3, pulse > 0.85 ? PAL.chloroplast : PAL.neonCyan);
    PixelGFX.pset(ctx, ocularX + 2, ocularY, PAL.white);

    // 7. Perilla micrométrica coaxial
    const knobX = baseX + 25;
    const knobY = baseY - 28;
    PixelGFX.circleFill(ctx, knobX, knobY, 5, PAL.metalDark);
    PixelGFX.circleFill(ctx, knobX, knobY, 4, PAL.brassMid);
    const kAngle = knobTurn * 3.0;
    PixelGFX.pset(ctx, knobX + Math.round(Math.cos(kAngle) * 3), knobY + Math.round(Math.sin(kAngle) * 3), PAL.brassLight);
    PixelGFX.pset(ctx, knobX - Math.round(Math.cos(kAngle) * 3), knobY - Math.round(Math.sin(kAngle) * 3), PAL.brassLight);
    PixelGFX.pset(ctx, knobX, knobY, PAL.metalDark);

    return {
      ocularX: ocularX + 2,
      ocularY: ocularY,
      sampleX,
      sampleY,
      knobX,
      knobY
    };
  }

  /**
   * Dibuja el cuerpo y cabeza de la Investigadora usando sprites Pixel-Art detallados.
   */
  function drawScientistBoyBodyAndHead(ctx, state) {
    const {
      time,
      leanProgress = 0,
      amazed = 0,
      blink = false
    } = state;

    const breath = Math.round(Math.sin(time * 2.4) * 1);

    const headBaseX = Math.round(MathUtil.lerp(187, 178, leanProgress) + amazed * 4);
    const headBaseY = Math.round(MathUtil.lerp(55, 58, leanProgress) + breath * (1 - leanProgress * 0.7));

    const torsoX = Math.round(MathUtil.lerp(170, 164, leanProgress) + amazed * 3);
    const torsoY = 75 + breath;

    // ==========================================
    // 1. COLETA LARGA PIXEL-ART (DETRÁS DE LOS HOMBROS)
    // ==========================================
    const ponyTieX = headBaseX + 15;
    const ponyTieY = headBaseY + 4;
    const sway = Math.sin(time * 2.6) * 1.8;

    // Coletero magenta con volumen pixel-art
    PixelGFX.rect(ctx, ponyTieX - 2, ponyTieY - 2, 5, 5, PAL.scrunchie);
    PixelGFX.rect(ctx, ponyTieX - 1, ponyTieY - 1, 3, 2, PAL.neonPinkLight);

    // Mechones de la coleta larga con contorno oscuro e iluminación por capas
    for (let s = 0; s < 27; s++) {
      const frac = s / 27;
      const px = Math.round(ponyTieX + 2 + Math.sin(frac * 2.7 + time * 2.2) * 2.5 + frac * 5 + sway * frac);
      const py = ponyTieY + s;
      const w = Math.max(2, Math.round(5.5 * (1 - frac * 0.45)));
      PixelGFX.rect(ctx, px - w, py, w * 2, 1, PAL.hairDark);
      PixelGFX.rect(ctx, px - w + 1, py, Math.max(1, w + 1), 1, PAL.hairMid);
      if (s > 3 && s < 19) {
        PixelGFX.pset(ctx, px - w + 2, py, PAL.hairLight);
      }
    }

    // ==========================================
    // 2. TORSO PIXEL-ART CON BATA ENTALLADA, BLUSA Y GAFETE
    // ==========================================
    ctx.drawImage(scientistTorsoSprite, torsoX, torsoY);

    // ==========================================
    // 2B. CUELLO ANATÓMICO PIXEL-ART (CONEXIÓN CONTINUA MENTÓN-COLLAR)
    // ==========================================
    const neckTopX = headBaseX + 2;
    const neckTopY = headBaseY + 14;
    const neckBotX = torsoX + 17;
    const neckBotY = torsoY + 2;

    for (let ny = neckTopY; ny <= neckBotY; ny++) {
      const t = (ny - neckTopY) / Math.max(1, neckBotY - neckTopY);
      const nx = Math.round(MathUtil.lerp(neckTopX, neckBotX, t));
      const isUnderChin = (ny <= headBaseY + 19);

      // Contorno exterior de piel (1px a cada lado)
      PixelGFX.pset(ctx, nx - 3, ny, PAL.skinDeep);
      PixelGFX.pset(ctx, nx + 4, ny, PAL.skinDeep);

      // Sombreado anatómico del cuello (sombra proyectada bajo la mandíbula y luz frontal)
      PixelGFX.pset(ctx, nx - 2, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx - 1, ny, isUnderChin ? PAL.skinShadow : PAL.skinLight);
      PixelGFX.pset(ctx, nx,     ny, isUnderChin ? PAL.skinShadow : PAL.skinLight);
      PixelGFX.pset(ctx, nx + 1, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx + 2, ny, PAL.skinShadow);
      PixelGFX.pset(ctx, nx + 3, ny, PAL.skinDeep);
    }

    // ==========================================
    // 3. CABEZA Y ROSTRO FEMENINO ESCULPIDO PÍXEL A PÍXEL
    // ==========================================
    ctx.drawImage(scientistHeadSprite, headBaseX - 11, headBaseY - 4);

    // Labios femeninos y sonrisa expresiva según el estado de la animación
    const mouthX = headBaseX - 5;
    const mouthY = headBaseY + 15;
    if (amazed > 0.35) {
      // Sonrisa radiante de descubrimiento científico
      PixelGFX.rect(ctx, mouthX, mouthY, 5, 3, PAL.lips);
      PixelGFX.rect(ctx, mouthX + 1, mouthY, 3, 1, PAL.white);
      PixelGFX.pset(ctx, mouthX + 5, mouthY - 1, PAL.lips);
    } else if (leanProgress > 0.65) {
      // Labios concentrados al enfocar el microscopio
      PixelGFX.rect(ctx, mouthX + 1, mouthY, 3, 2, PAL.lips);
    } else {
      // Sonrisa serena y cálida
      PixelGFX.line(ctx, mouthX, mouthY + 1, mouthX + 3, mouthY + 1, PAL.lips);
      PixelGFX.pset(ctx, mouthX + 4, mouthY, PAL.lips);
    }

    // ==========================================
    // 4. OJOS EXPRESIVOS Y GAFAS FINAS TRANSPARENTES (1PX)
    // ==========================================
    const leftEyeX = headBaseX - 6;
    const leftEyeY = headBaseY + 8;
    const rightEyeX = headBaseX + 2;
    const rightEyeY = headBaseY + 8;

    const lx = leftEyeX - 2;
    const ly = leftEyeY - 1;
    const rx = rightEyeX - 2;
    const ry = rightEyeY - 1;

    if (blink) {
      PixelGFX.line(ctx, lx, ly + 2, lx + 3, ly + 2, PAL.hairDark);
      PixelGFX.line(ctx, rx, ry + 2, rx + 5, ry + 2, PAL.hairDark);
      PixelGFX.pset(ctx, rx + 6, ry + 1, PAL.hairDark);
    } else {
      PixelGFX.rect(ctx, lx, ly, 4, 4, PAL.white);
      PixelGFX.rect(ctx, rx, ry, 6, 4, PAL.white);

      const pupilShift = leanProgress > 0.35 ? 0 : 1;
      const irisColor = '#1ca3b8';

      PixelGFX.rect(ctx, lx + pupilShift, ly + 1, 2, 3, irisColor);
      PixelGFX.pset(ctx, lx + pupilShift, ly + 2, PAL.hairDark);

      PixelGFX.rect(ctx, rx + pupilShift, ry + 1, 3, 3, irisColor);
      PixelGFX.rect(ctx, rx + pupilShift, ry + 1, 2, 2, PAL.hairDark);

      // Brillo de vida blanco en ambos ojos
      PixelGFX.pset(ctx, lx + pupilShift + 1, ly + 1, PAL.white);
      PixelGFX.pset(ctx, rx + pupilShift + 2, ry + 1, PAL.white);

      // Pestañas superiores finas con rabillo femenino
      PixelGFX.line(ctx, lx, ly - 1, lx + 3, ly - 1, PAL.hairDark);
      PixelGFX.line(ctx, rx, ry - 1, rx + 5, ry - 1, PAL.hairDark);
      PixelGFX.pset(ctx, rx + 6, ry - 2, PAL.hairDark);
    }

    // Montura fina de 1px con cristales transparentes
    const frameLight = '#8ecae6';
    const frameMid = '#5fa8d3';

    PixelGFX.line(ctx, lx, ly - 2, lx + 3, ly - 2, frameLight);
    PixelGFX.line(ctx, lx, ly + 4, lx + 3, ly + 4, frameMid);
    PixelGFX.line(ctx, lx - 1, ly - 1, lx - 1, ly + 3, frameLight);

    PixelGFX.line(ctx, rx, ry - 2, rx + 5, ry - 2, frameLight);
    PixelGFX.line(ctx, rx, ry + 4, rx + 5, ry + 4, frameMid);
    PixelGFX.line(ctx, rx - 1, ry - 1, rx - 1, ry + 3, frameMid);
    PixelGFX.line(ctx, rx + 6, ry - 1, rx + 6, ry + 3, frameMid);

    PixelGFX.line(ctx, lx + 4, ly, rx - 1, ly, frameLight);
    PixelGFX.line(ctx, rx + 7, ry, headBaseX + 12, headBaseY + 9, frameMid);

    // Destello especular deslizándose suavemente sobre los cristales de las gafas
    const glintOffset = Math.floor(time * 2.5) % 9;
    if (glintOffset < 4) {
      PixelGFX.pset(ctx, lx + glintOffset, ly - 2, PAL.white);
      PixelGFX.pset(ctx, rx + 1 + glintOffset, ry - 2, PAL.white);
      if (!blink) {
        PixelGFX.pset(ctx, rx + glintOffset, ry, '#e0f7fa');
      }
    } else {
      PixelGFX.pset(ctx, lx, ly - 1, PAL.white);
      PixelGFX.pset(ctx, rx + 4, ry - 1, PAL.white);
    }

    // Cejas finas
    const browRaise = amazed > 0.3 ? -1 : 0;
    PixelGFX.line(ctx, lx, ly - 4 + browRaise, lx + 3, ly - 4 + browRaise, PAL.hairMid);
    PixelGFX.line(ctx, rx + 1, ry - 4 + browRaise, rx + 5, ry - 4 + browRaise, PAL.hairMid);

    return {
      leftLensX: leftEyeX,
      leftLensY: leftEyeY,
      rightLensX: rightEyeX,
      rightLensY: rightEyeY,
      rightShoulderX: torsoX + 10,
      rightShoulderY: torsoY + 13,
      shoulderX: torsoX + 23,
      shoulderY: torsoY + 14,
      headBaseX,
      headBaseY,
      amazed,
      time
    };
  }

  /**
   * Dibuja AMBOS brazos articulados de la investigadora (brazo derecho y brazo izquierdo)
   * con proporciones anatómicas compactas (~13-14px por segmento) y manos Pixel-Art.
   */
  function drawScientistBoyArm(ctx, scientistPose, knobPos) {
    const {
      rightShoulderX,
      rightShoulderY,
      shoulderX,
      shoulderY,
      headBaseX,
      headBaseY,
      amazed,
      time
    } = scientistPose;

    // ==========================================
    // A. BRAZO DERECHO COMPLETO (proporciones cortas y ergonómicas ~13-14px)
    // ==========================================
    const rWristX = Math.round(MathUtil.lerp(knobPos.x + 6, headBaseX - 15, amazed));
    const rWristY = Math.round(MathUtil.lerp(knobPos.y + 19, headBaseY + 26, amazed));

    const rElbowX = Math.round(MathUtil.lerp((rightShoulderX + rWristX) * 0.5 - 2, rightShoulderX - 7, amazed));
    const rElbowY = Math.round(MathUtil.lerp(rightShoulderY + 15, rightShoulderY + 15, amazed));

    drawTailoredArmSegment(ctx, rightShoulderX, rightShoulderY, 3.8, rElbowX, rElbowY, 3.2, false);
    drawTailoredArmSegment(ctx, rElbowX, rElbowY, 3.2, rWristX, rWristY, 2.6, true);

    PixelGFX.line(ctx, rElbowX - 1, rElbowY - 1, rElbowX + 2, rElbowY - 2, PAL.coatShadow);
    PixelGFX.pset(ctx, rElbowX, rElbowY, PAL.coatOutline);

    if (amazed > 0.45) {
      ctx.drawImage(handRightAmazedSprite, rWristX - 7, rWristY - 8);
    } else {
      ctx.drawImage(handRightBenchSprite, rWristX - 11, rWristY - 4);
    }

    // ==========================================
    // B. BRAZO IZQUIERDO COMPLETO EN PRIMER PLANO (~13-14px por segmento)
    // ==========================================
    const wristX = Math.round(MathUtil.lerp(knobPos.x + 9, headBaseX - 5, amazed));
    const wristY = Math.round(MathUtil.lerp(knobPos.y + 1, headBaseY + 24, amazed));

    const elbowX = Math.round(MathUtil.lerp((shoulderX + wristX) * 0.5 + 3, shoulderX - 3, amazed));
    const elbowY = Math.round(MathUtil.lerp(shoulderY + 14, shoulderY + 15, amazed));

    drawTailoredArmSegment(ctx, shoulderX, shoulderY, 4.0, elbowX, elbowY, 3.4, false);
    drawTailoredArmSegment(ctx, elbowX, elbowY, 3.4, wristX, wristY, 2.8, true);

    PixelGFX.line(ctx, elbowX - 2, elbowY - 1, elbowX + 1, elbowY - 2, PAL.coatShadow);
    PixelGFX.pset(ctx, elbowX - 1, elbowY, PAL.coatOutline);

    if (amazed > 0.45) {
      ctx.drawImage(handAmazedSprite, wristX - 8, wristY - 9);
    } else {
      const fingerFrame = (Math.floor(time * 5) % 2 === 0) ? handKnobSpriteA : handKnobSpriteB;
      ctx.drawImage(fingerFrame, wristX - 11, wristY - 5);
    }
  }

  ns.Sprites = {
    compileSprite,
    inVitroPlant: inVitroPlantSprite,
    eppendorfRack: eppendorfRackSprite,
    chamberPlant: chamberPlantSprite,
    scientistTorso: scientistTorsoSprite,
    scientistHead: scientistHeadSprite,
    drawMicroscope,
    drawScientistBoyBodyAndHead,
    drawScientistBoyArm
  };
})(window.MicroCosmos);
