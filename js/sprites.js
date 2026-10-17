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

  function compileSprite(rows, paletteMap, scale = (ns.SCALE || 3)) {
    const s = scale;
    const gridH = rows.length;
    const gridW = rows.reduce((max, r) => Math.max(max, r.length), 0);
    const canvas = document.createElement('canvas');
    canvas.width = gridW * s;
    canvas.height = gridH * s;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const getCol = (x, y) => {
      if (y < 0 || y >= gridH || x < 0) return null;
      const row = rows[y];
      if (!row || x >= row.length) return null;
      const ch = row[x];
      if (ch === '.' || ch === ' ') return null;
      return paletteMap[ch] || null;
    };

    if (s === 3) {
      // Algoritmo AdvMAME Scale3x (EPX): suaviza bordes diagonales a precisión 1px en 960x540 sin difuminar ni inventar colores
      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          const P = getCol(x, y);
          const A = getCol(x - 1, y - 1);
          const B = getCol(x,     y - 1);
          const C = getCol(x + 1, y - 1);
          const D = getCol(x - 1, y);
          const F = getCol(x + 1, y);
          const G = getCol(x - 1, y + 1);
          const H = getCol(x,     y + 1);
          const I = getCol(x + 1, y + 1);

          let E0 = P, E1 = P, E2 = P;
          let E3 = P, E4 = P, E5 = P;
          let E6 = P, E7 = P, E8 = P;

          if (D !== F && B !== H) {
            if (D === B) E0 = D;
            if ((D === B && P !== C) || (B === F && P !== A)) E1 = B;
            if (B === F) E2 = F;
            if ((D === B && P !== G) || (D === H && P !== A)) E3 = D;
            if ((B === F && P !== I) || (H === F && P !== C)) E5 = F;
            if (D === H) E6 = D;
            if ((D === H && P !== I) || (H === F && P !== G)) E7 = H;
            if (H === F) E8 = F;
          }

          const bx = x * 3;
          const by = y * 3;
          if (E0 && E0 === E1 && E1 === E2 && E2 === E3 && E3 === E4 && E4 === E5 && E5 === E6 && E6 === E7 && E7 === E8) {
            ctx.fillStyle = E0;
            ctx.fillRect(bx, by, 3, 3);
          } else {
            const sub = [E0, E1, E2, E3, E4, E5, E6, E7, E8];
            for (let k = 0; k < 9; k++) {
              const col = sub[k];
              if (col) {
                ctx.fillStyle = col;
                ctx.fillRect(bx + (k % 3), by + ((k / 3) | 0), 1, 1);
              }
            }
          }
        }
      }
      return canvas;
    }

    for (let y = 0; y < gridH; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const col = getCol(x, y);
        if (col) {
          ctx.fillStyle = col;
          ctx.fillRect(x * s, y * s, s, s);
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

  // Cabeza y Rostro esculpido en Pixel-Art (28x23):
  // Proporción esbelta y ovalada, perfil 3/4 delicado, nariz estilizada y mentón definido (sin efecto esférico)
  const scientistHeadSprite = compileSprite([
    '.........HHHHHHHHHH.........',
    '.......HHHhhhhhhhhhHH.......',
    '......HHHhhllvvvvllhhHH.....',
    '.....HHHhhllvvssssvvllhH....',
    '.....HHhhlvvvvhhhhvvllhHH...',
    '....HHHhhlhhHHHHHHHHhhllhH..',
    '...HHHhhlhHHHHkkffkkHHHHlhH.',
    '..HHHhlhHHHkkffffffkkHHHlhH.',
    '..HHhhHHkkffffffffffkkHHlhH.',
    '..HHhHHkffffffffffffffkHlhH.',
    '...HqkfffffffffffffffffkHH..',
    '....qkfffffffffffffffffkHH..',
    '...oqkfffffffffffffffffkHH..',
    '..oqfffffffffffffffffffkH...',
    '..oqfffffffffffffffffHkCo...',
    '...oqkffffffffffffffkHkdo...',
    '....qkffffbbbfffffffkHoo....',
    '.....qkffbbbffffffkkdo.....',
    '.....oqkfffffffffkkdo.......',
    '......oqkfffffffkkdo........',
    '.......oqqkfffkkdoo.........',
    '.........oqqkdoo............',
    '...........ooo..............'
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
   * Dibuja un brazo de bata de laboratorio en alta precisión nativa (960x540)
   * con bordes limpios de 1-2px, sombreado cilíndrico de 4 tonos y pliegues en el codo.
   */
  function drawTailoredArmSegment(ctx, x0, y0, w0, x1, y1, w1, isForearm, sleeveColors) {
    const S = ns.SCALE || 3;
    const fx0 = x0 * S;
    const fy0 = y0 * S;
    const fw0 = w0 * S;
    const fx1 = x1 * S;
    const fy1 = y1 * S;
    const fw1 = w1 * S;

    const outlineTop = sleeveColors ? sleeveColors.outline : '#758bad';
    const outlineBot = sleeveColors ? sleeveColors.outline : PAL.coatOutline;
    const lightCol   = sleeveColors ? sleeveColors.light   : PAL.white;
    const midCol     = sleeveColors ? sleeveColors.mid     : PAL.coatMid;
    const semiCol    = sleeveColors ? sleeveColors.shadow  : '#c5d6ed';
    const shadowCol  = sleeveColors ? sleeveColors.shadow  : PAL.coatShadow;

    const dx = fx1 - fx0;
    const dy = fy1 - fy0;
    const len = Math.max(1, Math.hypot(dx, dy));
    const steps = Math.max(1, Math.ceil(len * 1.5));
    const nx = -dy / len;
    const ny = dx / len;

    // 1. Relleno interior de la manga en 4 tonos en resolución nativa 960x540
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = MathUtil.lerp(fx0, fx1, t);
      const cy = MathUtil.lerp(fy0, fy1, t);
      const halfW = MathUtil.lerp(fw0, fw1, t);

      for (let d = -halfW; d <= halfW; d += 0.5) {
        const px = Math.round(cx + nx * d);
        const py = Math.round(cy + ny * d);
        let col = midCol;
        if (d < -halfW + 3.2) {
          col = lightCol;
        } else if (d > halfW - 3.0) {
          col = shadowCol;
        } else if (d > 1.0) {
          col = semiCol;
        }
        PixelGFX.fineRect(ctx, px, py, 2, 2, col);
      }
    }

    // 2. Bordes exteriores limpios de alta precisión (Sel-Out)
    const topX0 = Math.round(fx0 - nx * fw0);
    const topY0 = Math.round(fy0 - ny * fw0);
    const topX1 = Math.round(fx1 - nx * fw1);
    const topY1 = Math.round(fy1 - ny * fw1);

    const botX0 = Math.round(fx0 + nx * fw0);
    const botY0 = Math.round(fy0 + ny * fw0);
    const botX1 = Math.round(fx1 + nx * fw1);
    const botY1 = Math.round(fy1 + ny * fw1);

    PixelGFX.fineLine(ctx, topX0, topY0, topX1, topY1, outlineTop);
    PixelGFX.fineLine(ctx, topX0, topY0 + 1, topX1, topY1 + 1, outlineTop);
    PixelGFX.fineLine(ctx, botX0, botY0, botX1, botY1, outlineBot);
    PixelGFX.fineLine(ctx, botX0, botY0 - 1, botX1, botY1 - 1, outlineBot);

    if (isForearm) {
      PixelGFX.fineLine(ctx, topX1, topY1, botX1, botY1, outlineBot);
      PixelGFX.fineLine(ctx, topX1 - Math.round(dx / len), topY1 - Math.round(dy / len), botX1 - Math.round(dx / len), botY1 - Math.round(dy / len), PAL.white);
    }
  }

  /**
   * Dibuja la coleta larga ondulante en resolución nativa 960x540 con hebras finas y brillo
   */
  function drawPonytail(ctx, headBaseX, headBaseY, time) {
    const S = ns.SCALE || 3;
    const ponyTieX = headBaseX + 15;
    const ponyTieY = headBaseY + 4;
    const fTieX = ponyTieX * S;
    const fTieY = ponyTieY * S;
    const sway = Math.sin(time * 2.6) * 5.2;

    // Coletero magenta redondeado con volumen 3D y reflejo especular
    PixelGFX.fineCircleFill(ctx, fTieX + 2, fTieY + 2, 7, '#a31253');
    PixelGFX.fineCircleFill(ctx, fTieX + 1, fTieY + 1, 6, PAL.scrunchie);
    PixelGFX.fineRect(ctx, fTieX - 2, fTieY - 2, 5, 3, PAL.neonPinkLight);
    PixelGFX.finePset(ctx, fTieX - 1, fTieY - 1, PAL.white);

    // Mechones de la coleta larga trazados línea por línea en resolución 960x540 (80 líneas nativas)
    const totalLen = 81;
    for (let fs = 0; fs < totalLen; fs++) {
      const frac = fs / totalLen;
      const wave = Math.sin(frac * 2.8 + time * 2.2) * 7.5 + frac * 15 + sway * frac;
      const fpx = Math.round(fTieX + 6 + wave);
      const fpy = fTieY + fs;
      const halfW = Math.max(3, Math.round(16.5 * (1 - frac * 0.52) * Math.sin(Math.min(1, frac * 6) * Math.PI * 0.5)));

      // Contorno exterior oscuro y volumen del cabello
      PixelGFX.fineRect(ctx, fpx - halfW, fpy, halfW * 2, 1, PAL.hairDark);
      if (halfW > 4) {
        PixelGFX.fineRect(ctx, fpx - halfW + 3, fpy, Math.max(2, halfW + 2), 1, PAL.hairMid);
      }
      // Hebras iluminadas violetas y reflejo azulado fino
      if (fs > 9 && fs < 58) {
        PixelGFX.fineRect(ctx, fpx - halfW + 5, fpy, 3, 1, PAL.hairLight);
        if (fs > 16 && fs < 38 && (fs % 2 === 0)) {
          PixelGFX.finePset(ctx, fpx - halfW + 6, fpy, '#4895ef');
        }
      }
    }
  }

  /**
   * Dibuja el cuello anatómico, la cabeza esculpida, cabello fino, ojos expresivos HD,
   * gafas finas de 1-2px nativos y sonrisa de la Investigadora en todas las escenas.
   */
  function drawScientistHeadAndFace(ctx, headBaseX, headBaseY, torsoX, torsoY, opts = {}) {
    const S = ns.SCALE || 3;
    const {
      time = 0,
      leanProgress = 0,
      amazed = 0,
      blink = false,
      lookDown = false,
      eyeScan = 0,
      isPointing = false,
      warmSmile = false,
      dataGlint = false
    } = opts;

    // 1. CUELLO ANATÓMICO SUAVE EN RESOLUCIÓN NATIVA 960x540
    const fNeckTopX = (headBaseX + 2) * S;
    const fNeckTopY = (headBaseY + 14) * S;
    const fNeckBotX = (torsoX + 17) * S;
    const fNeckBotY = (torsoY + 2) * S;

    for (let fny = fNeckTopY; fny <= fNeckBotY; fny++) {
      const t = (fny - fNeckTopY) / Math.max(1, fNeckBotY - fNeckTopY);
      const fnx = Math.round(MathUtil.lerp(fNeckTopX, fNeckBotX, t));
      const isUnderChin = fny <= (headBaseY + 19) * S;

      // Contorno fino de 2px nativos a cada lado
      PixelGFX.fineRect(ctx, fnx - 9, fny, 2, 1, '#7d4038');
      PixelGFX.fineRect(ctx, fnx + 11, fny, 2, 1, '#7d4038');
      // Sombra lateral e inferior bajo el mentón + piel iluminada frontal
      PixelGFX.fineRect(ctx, fnx - 7, fny, 4, 1, PAL.skinShadow);
      PixelGFX.fineRect(ctx, fnx - 3, fny, 7, 1, isUnderChin ? PAL.skinShadow : '#ffcab5');
      PixelGFX.fineRect(ctx, fnx + 4, fny, 7, 1, PAL.skinShadow);
    }

    // 2. CABEZA ESCULPIDA (con suavizado diagonal Scale3x)
    PixelGFX.drawSprite(ctx, scientistHeadSprite, headBaseX - 11, headBaseY - 4);

    // Detalles finos nativos en el cabello (mechones suaves sobre la frente y patilla) y arete cian brillante
    const fhX = (headBaseX - 11) * S;
    const fhY = (headBaseY - 4) * S;
    PixelGFX.fineLine(ctx, fhX + 24, fhY + 10, fhX + 52, fhY + 10, '#64448f');
    PixelGFX.fineLine(ctx, fhX + 30, fhY + 11, fhX + 46, fhY + 11, '#4895ef');
    // Arete perlado cian con destello de 1px
    const earX = (headBaseX + 12) * S;
    const earY = (headBaseY + 10) * S;
    PixelGFX.fineCircleFill(ctx, earX, earY, 2, PAL.neonCyan);
    PixelGFX.finePset(ctx, earX - 1, earY - 1, PAL.white);

    // Nariz delicada en perfil 3/4 y rubor suave en las mejillas
    const noseX = (headBaseX - 8) * S;
    const noseY = (headBaseY + 10) * S;
    PixelGFX.fineLine(ctx, noseX + 1, noseY - 2, noseX - 1, noseY + 2, '#9e5448');
    PixelGFX.fineLine(ctx, noseX - 1, noseY + 2, noseX + 2, noseY + 3, '#b86958');
    PixelGFX.finePset(ctx, noseX, noseY + 1, '#ffe5d9');

    // Rubor rosado suave en la mejilla derecha
    const blushX = (headBaseX + 1) * S;
    const blushY = (headBaseY + 12) * S;
    PixelGFX.fineEllipseFill(ctx, blushX, blushY, 6, 3, '#f48498');
    PixelGFX.finePset(ctx, blushX - 2, blushY - 1, '#ffb3c1');

    // 3. LABIOS Y EXPRESIÓN FACIAL EN ALTA PRECISIÓN 960x540
    const fmX = (headBaseX - 5) * S;
    const fmY = (headBaseY + 15) * S;
    if (amazed > 0.35 || isPointing) {
      // Sonrisa radiante de hallazgo científico con dientes blancos definidos y labio inferior curvado
      PixelGFX.fineRect(ctx, fmX + 1, fmY, 13, 2, PAL.lips);
      PixelGFX.fineRect(ctx, fmX + 2, fmY + 2, 11, 3, PAL.white);
      PixelGFX.fineRect(ctx, fmX + 2, fmY + 5, 11, 2, PAL.lips);
      PixelGFX.fineRect(ctx, fmX + 4, fmY + 7, 7, 1, '#9e5448');
      PixelGFX.finePset(ctx, fmX + 14, fmY - 1, PAL.lips);
      PixelGFX.finePset(ctx, fmX, fmY + 1, PAL.lips);
    } else if (leanProgress > 0.65) {
      // Labios concentrados al enfocar el microscopio
      PixelGFX.fineRect(ctx, fmX + 3, fmY + 2, 8, 2, PAL.lips);
      PixelGFX.fineRect(ctx, fmX + 4, fmY + 4, 6, 2, '#e05770');
      PixelGFX.finePset(ctx, fmX + 11, fmY + 1, PAL.lips);
    } else {
      // Sonrisa cálida y serena con comisura elevada
      const smileW = warmSmile ? 13 : 11;
      PixelGFX.fineRect(ctx, fmX + 1, fmY + 3, smileW, 2, PAL.lips);
      PixelGFX.fineRect(ctx, fmX + 3, fmY + 5, smileW - 4, 1, '#e05770');
      PixelGFX.fineRect(ctx, fmX + smileW + 1, fmY + 1, 2, 2, PAL.lips);
      PixelGFX.finePset(ctx, fmX + smileW + 2, fmY, '#9e5448');
    }

    // 4. OJOS EXPRESIVOS EN ALTA DEFINICIÓN (960x540)
    const leftEyeX = headBaseX - 6;
    const leftEyeY = headBaseY + 8;
    const rightEyeX = headBaseX + 2;
    const rightEyeY = headBaseY + 8;

    const flx = (leftEyeX - 2) * S;
    const fly = (leftEyeY - 1) * S;
    const frx = (rightEyeX - 2) * S;
    const fry = (rightEyeY - 1) * S;

    if (blink) {
      // Párpado cerrado con pestañas curvadas finas
      PixelGFX.fineRect(ctx, flx, fly + 6, 11, 2, PAL.hairDark);
      PixelGFX.finePset(ctx, flx - 1, fly + 5, PAL.hairDark);
      PixelGFX.fineRect(ctx, frx, fry + 6, 16, 2, PAL.hairDark);
      PixelGFX.fineLine(ctx, frx + 16, fry + 6, frx + 19, fry + 3, PAL.hairDark);
    } else {
      // Esclerótica blanca con esquinas suavizadas
      PixelGFX.fineRect(ctx, flx + 1, fly + 1, 10, 10, PAL.white);
      PixelGFX.fineRect(ctx, flx, fly + 2, 12, 8, PAL.white);

      PixelGFX.fineRect(ctx, frx + 1, fry + 1, 15, 10, PAL.white);
      PixelGFX.fineRect(ctx, frx, fry + 2, 17, 8, PAL.white);

      // Posición de iris y pupila según hacia dónde mira la investigadora
      const shiftX = (leanProgress > 0.35 ? 0 : 2) + eyeScan * 2;
      const shiftY = lookDown ? 2 : 0;

      // Iris izquierdo (3 tonos de turquesa/cerceta + pupila + doble brillo especular)
      const ilx = flx + 2 + shiftX;
      const ily = fly + 2 + shiftY;
      PixelGFX.fineRect(ctx, ilx, ily, 6, 8, '#0e6ba8');
      PixelGFX.fineRect(ctx, ilx + 1, ily + 1, 5, 6, '#1ca3b8');
      PixelGFX.fineRect(ctx, ilx + 1, ily + 5, 4, 2, '#64dfdf');
      PixelGFX.fineRect(ctx, ilx + 1, ily + 2, 3, 4, PAL.hairDark);
      // Brillo principal 2x2 y brillo secundario 1x1
      PixelGFX.fineRect(ctx, ilx + 3, ily + 1, 2, 2, PAL.white);
      PixelGFX.finePset(ctx, ilx + 1, ily + 5, dataGlint ? PAL.chloroplast : PAL.white);

      // Iris derecho (más amplio por perspectiva 3/4: 9x8 px nativos)
      const irx = frx + 2 + shiftX;
      const iry = fry + 2 + shiftY;
      PixelGFX.fineRect(ctx, irx + 1, iry, 7, 8, '#0e6ba8');
      PixelGFX.fineRect(ctx, irx, iry + 1, 9, 6, '#1ca3b8');
      PixelGFX.fineRect(ctx, irx + 1, iry + 5, 7, 2, '#64dfdf');
      PixelGFX.fineRect(ctx, irx + 2, iry + 2, 5, 4, PAL.hairDark);
      // Brillo de vida principal 3x2 y reflejo secundario
      PixelGFX.fineRect(ctx, irx + 5, iry + 1, 3, 2, PAL.white);
      PixelGFX.fineRect(ctx, irx + 1, iry + 5, 2, 1, dataGlint ? PAL.neonCyan : PAL.white);

      // Pestañas superiores definidas con rabillo femenino elegante de 1px
      PixelGFX.fineRect(ctx, flx, fly - 1, 11, 2, PAL.hairDark);
      PixelGFX.finePset(ctx, flx - 1, fly, PAL.hairDark);

      PixelGFX.fineRect(ctx, frx, fry - 1, 16, 2, PAL.hairDark);
      PixelGFX.fineLine(ctx, frx + 15, fry - 1, frx + 19, fry - 4, PAL.hairDark);
      PixelGFX.fineLine(ctx, frx + 16, fry, frx + 19, fry - 3, PAL.hairDark);
    }

    // 5. MONTURA DE GAFAS FINA DE 2PX NATIVOS Y CRISTALES TRANSPARENTES
    const frameLight = '#8ecae6';
    const frameMid = '#5fa8d3';
    const frameDark = '#3b7ea1';

    // Lente izquierdo (con esquinas biseladas de 1px)
    PixelGFX.fineRect(ctx, flx - 1, fly - 4, 13, 2, frameLight);
    PixelGFX.fineRect(ctx, flx - 1, fly + 12, 13, 2, frameMid);
    PixelGFX.fineRect(ctx, flx - 3, fly - 2, 2, 14, frameLight);
    PixelGFX.fineRect(ctx, flx + 12, fly - 2, 2, 14, frameMid);

    // Lente derecho (con esquinas biseladas de 1px)
    PixelGFX.fineRect(ctx, frx - 1, fry - 4, 19, 2, frameLight);
    PixelGFX.fineRect(ctx, frx - 1, fry + 12, 19, 2, frameMid);
    PixelGFX.fineRect(ctx, frx - 3, fry - 2, 2, 14, frameMid);
    PixelGFX.fineRect(ctx, frx + 18, fry - 2, 2, 14, frameDark);

    // Puente nasal y patilla hacia la oreja
    PixelGFX.fineRect(ctx, flx + 13, fly, frx - 3 - (flx + 13), 2, frameLight);
    PixelGFX.fineLine(ctx, frx + 20, fry + 1, (headBaseX + 12) * S, (headBaseY + 9) * S, frameMid);
    PixelGFX.fineLine(ctx, frx + 20, fry + 2, (headBaseX + 12) * S, (headBaseY + 9) * S + 1, frameDark);

    // Destello especular diagonal deslizándose suavemente sobre los cristales
    const glintOffset = Math.floor(time * 2.5) % 9;
    if (glintOffset < 5) {
      const gx = glintOffset * 3;
      PixelGFX.fineRect(ctx, flx + gx, fly - 4, 3, 2, PAL.white);
      PixelGFX.fineRect(ctx, frx + 2 + gx, fry - 4, 4, 2, PAL.white);
      if (!blink) {
        PixelGFX.fineLine(ctx, frx + 1 + gx, fry + 1, frx + 4 + gx, fry + 4, '#e0f7fa');
      }
    } else {
      PixelGFX.fineRect(ctx, flx, fly - 3, 2, 2, PAL.white);
      PixelGFX.fineRect(ctx, frx + 13, fry - 3, 3, 2, PAL.white);
    }

    // 6. CEJAS EXPRESIVAS FINAS
    const browRaise = (amazed > 0.3 || isPointing) ? -3 : 0;
    PixelGFX.fineRect(ctx, flx, fly - 9 + browRaise, 10, 2, PAL.hairMid);
    PixelGFX.finePset(ctx, flx - 1, fly - 8 + browRaise, PAL.hairMid);
    PixelGFX.fineRect(ctx, frx + 2, fry - 9 + browRaise, 14, 2, PAL.hairMid);
    PixelGFX.fineLine(ctx, frx + 15, fry - 9 + browRaise, frx + 18, fry - 7 + browRaise, PAL.hairMid);
  }

  /**
   * Dibuja el microscopio óptico de fluorescencia / confocal sobre la mesada con detalles de alta precisión 960x540
   */
  function drawMicroscope(ctx, state) {
    const {
      time,
      knobTurn = 0,
      slideGlow = 1.0
    } = state;

    const S = ns.SCALE || 3;
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

    // 2. Base moderna del microscopio de investigación con biselado fino
    PixelGFX.rect(ctx, baseX - 3, baseY - 4, 36, 4, PAL.metalDark);
    PixelGFX.rect(ctx, baseX - 1, baseY - 6, 32, 3, PAL.metalMid);
    PixelGFX.rect(ctx, baseX + 1, baseY - 7, 28, 1, PAL.metalLight);
    PixelGFX.fineRect(ctx, (baseX + 1) * S, (baseY - 7) * S, 28 * S, 1, PAL.metalShine);
    // Indicador LED de encendido y regulador de intensidad láser en la base
    PixelGFX.rect(ctx, baseX + 3, baseY - 3, 4, 1, PAL.chloroplast);
    PixelGFX.fineRect(ctx, (baseX + 3) * S + 1, (baseY - 3) * S + 1, 10, 1, PAL.white);

    // 3. Iluminador láser/fluorescencia inferior y lente colectora
    PixelGFX.rect(ctx, baseX + 10, baseY - 14, 6, 8, PAL.metalDark);
    PixelGFX.rect(ctx, baseX + 11, baseY - 13, 4, 6, PAL.metalMid);
    PixelGFX.rect(ctx, baseX + 11, baseY - 15, 4, 1, PAL.neonCyan);
    // Haz láser vertical fino de excitación (488 nm)
    PixelGFX.fineRect(ctx, sampleX * S, (baseY - 17) * S, 2, (19) * S, PAL.neonEmerald);
    PixelGFX.fineRect(ctx, sampleX * S - 2, (baseY - 16) * S, 2, (18) * S, PAL.neonCyan);
    PixelGFX.fineRect(ctx, sampleX * S - 1, (baseY - 16) * S, 1, (18) * S, PAL.white);

    // 4. Columna / Brazo ergonómico con nervadura metálica fina
    PixelGFX.rect(ctx, baseX + 21, baseY - 47, 8, 41, PAL.metalDark);
    PixelGFX.rect(ctx, baseX + 22, baseY - 46, 6, 39, PAL.metalMid);
    PixelGFX.rect(ctx, baseX + 22, baseY - 45, 2, 37, PAL.metalLight);
    PixelGFX.fineRect(ctx, (baseX + 22) * S, (baseY - 45) * S, 2, 37 * S, PAL.metalShine);
    PixelGFX.fineLine(ctx, (baseX + 26) * S, (baseY - 44) * S, (baseX + 26) * S, (baseY - 10) * S, PAL.metalDark);

    // Cabezal superior con módulo de epifluorescencia y rueda de filtros dicroicos
    PixelGFX.rect(ctx, baseX + 14, baseY - 55, 14, 9, PAL.metalMid);
    PixelGFX.rect(ctx, baseX + 13, baseY - 54, 2, 7, PAL.metalLight);
    PixelGFX.rect(ctx, baseX + 18, baseY - 52, 5, 2, PAL.neonCyan);
    PixelGFX.fineRect(ctx, (baseX + 18) * S + 1, (baseY - 52) * S + 1, 13, 2, PAL.white);

    // 5. Platina mecánica XY, condensador Abbe y portaobjetos con muestra botánica
    PixelGFX.rect(ctx, baseX + 11, baseY - 29, 4, 4, PAL.metalMid); // condensador bajo platina
    PixelGFX.rect(ctx, baseX + 2, baseY - 32, 22, 3, PAL.metalDark);
    PixelGFX.rect(ctx, baseX + 3, baseY - 33, 20, 1, PAL.metalLight);
    // Portaobjetos de vidrio con cubreobjetos y tejido foliar GFP brillante
    PixelGFX.fineRect(ctx, (baseX + 6) * S, sampleY * S, 14 * S, 2, PAL.glassEdge);
    PixelGFX.fineRect(ctx, (baseX + 6) * S, sampleY * S, 14 * S, 1, PAL.white);
    PixelGFX.rect(ctx, sampleX - 3, sampleY - 2, 6, 2, PAL.neonEmerald);
    PixelGFX.rect(ctx, sampleX - 2, sampleY - 2, 4, 1, PAL.chloroplast);
    PixelGFX.fineRect(ctx, sampleX * S - 1, (sampleY - 3) * S + 1, 3, 3, PAL.starGoldLight);

    // 6. Revólver portaobjetivos y objetivos con anillos de código de color (4x, 40x, 100x)
    const focusOffset = Math.round(Math.sin(knobTurn) * 1);
    const headX = baseX + 10;
    const headY = baseY - 58 + focusOffset;

    // Revólver giratorio
    PixelGFX.rect(ctx, headX + 1, headY + 11, 9, 4, PAL.metalDark);
    PixelGFX.rect(ctx, headX + 2, headY + 11, 7, 3, PAL.metalLight);

    // Objetivo lateral secundario (10x anillo amarillo, en ángulo)
    PixelGFX.fineLine(ctx, (sampleX - 4) * S, (headY + 14) * S, (sampleX - 6) * S, (headY + 19) * S, PAL.metalMid);
    PixelGFX.fineLine(ctx, (sampleX - 3) * S, (headY + 14) * S, (sampleX - 5) * S, (headY + 19) * S, PAL.metalLight);
    PixelGFX.fineRect(ctx, (sampleX - 6) * S, (headY + 17) * S, 3, 2, PAL.starGold);

    // Objetivo principal activo (40x/100x inmersión confocal sobre la muestra)
    PixelGFX.rect(ctx, sampleX - 2, headY + 15, 4, 6, PAL.metalMid);
    PixelGFX.rect(ctx, sampleX - 1, headY + 15, 2, 5, PAL.metalShine);
    PixelGFX.fineRect(ctx, (sampleX - 2) * S, (headY + 18) * S, 4 * S, 2, PAL.neonEmerald);
    PixelGFX.fineRect(ctx, (sampleX - 1) * S, (headY + 20) * S, 2 * S, 2, PAL.neonCyan);

    // Cuerpo óptico prismático
    PixelGFX.rect(ctx, headX, headY, 13, 11, PAL.metalMid);
    PixelGFX.rect(ctx, headX + 1, headY + 1, 4, 9, PAL.metalLight);
    PixelGFX.fineRect(ctx, (headX + 2) * S, (headY + 2) * S, 2, 7 * S, PAL.metalShine);

    // Tubo binocular inclinado hacia la investigadora (suavizado en resolución nativa)
    const fHeadX = (headX + 10) * S;
    const fHeadY = (headY + 2) * S;
    for (let fStep = 0; fStep < 33; fStep++) {
      const ftx = fHeadX + fStep;
      const fty = fHeadY - Math.round(fStep * 0.75);
      PixelGFX.fineRect(ctx, ftx, fty - 6, 9, 15, PAL.metalDark);
      PixelGFX.fineRect(ctx, ftx, fty - 3, 6, 9, PAL.metalLight);
      PixelGFX.fineRect(ctx, ftx, fty - 2, 4, 3, PAL.metalShine);
    }

    const ocularX = headX + 21;
    const ocularY = headY - 6;
    PixelGFX.rect(ctx, ocularX - 1, ocularY - 3, 4, 7, PAL.metalDark);
    PixelGFX.rect(ctx, ocularX, ocularY - 2, 3, 5, PAL.metalMid);
    PixelGFX.rect(ctx, ocularX + 1, ocularY - 2, 2, 4, PAL.metalShine);
    PixelGFX.rect(ctx, ocularX + 2, ocularY - 1, 2, 3, pulse > 0.85 ? PAL.chloroplast : PAL.neonCyan);
    PixelGFX.fineRect(ctx, (ocularX + 2) * S + 1, ocularY * S, 3, 3, PAL.white);

    // 7. Perilla micrométrica coaxial de latón con estriado fino (knurling) en 960x540
    const knobX = baseX + 25;
    const knobY = baseY - 28;
    const fKnobX = knobX * S;
    const fKnobY = knobY * S;
    PixelGFX.fineCircleFill(ctx, fKnobX, fKnobY, 15, PAL.metalDark);
    PixelGFX.fineCircleFill(ctx, fKnobX, fKnobY, 12, PAL.brassDark);
    PixelGFX.fineCircleFill(ctx, fKnobX, fKnobY, 10, PAL.brassMid);
    PixelGFX.fineCircleOutline(ctx, fKnobX, fKnobY, 6, PAL.metalDark);
    PixelGFX.fineCircleFill(ctx, fKnobX, fKnobY, 5, PAL.brassLight);
    const kAngle = knobTurn * 3.0;
    for (let k = 0; k < 8; k++) {
      const a = kAngle + (k * Math.PI) / 4;
      const kx = fKnobX + Math.round(Math.cos(a) * 10);
      const ky = fKnobY + Math.round(Math.sin(a) * 10);
      PixelGFX.fineRect(ctx, kx - 1, ky - 1, 2, 2, k % 2 === 0 ? PAL.brassLight : PAL.metalDark);
    }
    PixelGFX.fineCircleFill(ctx, fKnobX, fKnobY, 2, PAL.metalDark);

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
   * Dibuja el cuerpo y cabeza de la Investigadora en el Laboratorio Principal (Escenas 1, 2 y 9)
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

    // 1. Coleta larga en alta resolución nativa
    drawPonytail(ctx, headBaseX, headBaseY, time);

    // 2. Torso con bata blanca entallada, blusa esmeralda y gafete CEAF
    PixelGFX.drawSprite(ctx, scientistTorsoSprite, torsoX, torsoY);

    // 3. Cuello anatómico, cabeza, rostro, ojos HD y gafas finas
    drawScientistHeadAndFace(ctx, headBaseX, headBaseY, torsoX, torsoY, {
      time,
      leanProgress,
      amazed,
      blink
    });

    const leftEyeX = headBaseX - 6;
    const leftEyeY = headBaseY + 8;
    const rightEyeX = headBaseX + 2;
    const rightEyeY = headBaseY + 8;

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
   * con proporciones anatómicas compactas y manos Pixel-Art suavizadas con Scale3x.
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

    // A. BRAZO DERECHO COMPLETO
    const rWristX = Math.round(MathUtil.lerp(knobPos.x + 6, headBaseX - 15, amazed));
    const rWristY = Math.round(MathUtil.lerp(knobPos.y + 19, headBaseY + 26, amazed));

    const rElbowX = Math.round(MathUtil.lerp((rightShoulderX + rWristX) * 0.5 - 2, rightShoulderX - 7, amazed));
    const rElbowY = Math.round(MathUtil.lerp(rightShoulderY + 15, rightShoulderY + 15, amazed));

    drawTailoredArmSegment(ctx, rightShoulderX, rightShoulderY, 3.8, rElbowX, rElbowY, 3.2, false);
    drawTailoredArmSegment(ctx, rElbowX, rElbowY, 3.2, rWristX, rWristY, 2.6, true);

    PixelGFX.line(ctx, rElbowX - 1, rElbowY - 1, rElbowX + 2, rElbowY - 2, PAL.coatShadow, 2);

    if (amazed > 0.45) {
      PixelGFX.drawSprite(ctx, handRightAmazedSprite, rWristX - 7, rWristY - 8);
    } else {
      PixelGFX.drawSprite(ctx, handRightBenchSprite, rWristX - 11, rWristY - 4);
    }

    // B. BRAZO IZQUIERDO COMPLETO EN PRIMER PLANO
    const wristX = Math.round(MathUtil.lerp(knobPos.x + 9, headBaseX - 5, amazed));
    const wristY = Math.round(MathUtil.lerp(knobPos.y + 1, headBaseY + 24, amazed));

    const elbowX = Math.round(MathUtil.lerp((shoulderX + wristX) * 0.5 + 3, shoulderX - 3, amazed));
    const elbowY = Math.round(MathUtil.lerp(shoulderY + 14, shoulderY + 15, amazed));

    drawTailoredArmSegment(ctx, shoulderX, shoulderY, 4.0, elbowX, elbowY, 3.4, false);
    drawTailoredArmSegment(ctx, elbowX, elbowY, 3.4, wristX, wristY, 2.8, true);

    PixelGFX.line(ctx, elbowX - 2, elbowY - 1, elbowX + 1, elbowY - 2, PAL.coatShadow, 2);

    if (amazed > 0.45) {
      PixelGFX.drawSprite(ctx, handAmazedSprite, wristX - 8, wristY - 9);
    } else {
      const fingerFrame = (Math.floor(time * 5) % 2 === 0) ? handKnobSpriteA : handKnobSpriteB;
      PixelGFX.drawSprite(ctx, fingerFrame, wristX - 11, wristY - 5);
    }
  }

  ns.Sprites = {
    compileSprite,
    inVitroPlant: inVitroPlantSprite,
    eppendorfRack: eppendorfRackSprite,
    chamberPlant: chamberPlantSprite,
    scientistTorso: scientistTorsoSprite,
    scientistHead: scientistHeadSprite,
    drawPonytail,
    drawScientistHeadAndFace,
    drawTailoredArmSegment,
    drawMicroscope,
    drawScientistBoyBodyAndHead,
    drawScientistBoyArm
  };
})(window.MicroCosmos);
