/**
 * transition.js
 * Orquestador de la lente óptica del microscopio confocal, retícula científica pixel-art
 * y transición circular (Match-Cut) entre el Laboratorio de Biotecnología y las
 * escenas microscópicas (Raíces -> Micorrizas/Bacterias -> Estomas).
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  const { WIDTH, HEIGHT, PAL, PixelGFX, MathUtil, LabScene, MicroWorldScene } = ns;

  const microCanvas = document.createElement('canvas');
  microCanvas.width = WIDTH;
  microCanvas.height = HEIGHT;
  const mctx = microCanvas.getContext('2d');
  mctx.imageSmoothingEnabled = false;

  function drawMicroscopeHUD(ctx, time, lensRadius) {
    const cx = WIDTH * 0.5;
    const cy = HEIGHT * 0.5;

    if (lensRadius < 185) {
      const r = Math.round(lensRadius);
      if (r > 5) {
        PixelGFX.circleOutline(ctx, cx, cy, r - 2, PAL.chloroplast);
        PixelGFX.circleOutline(ctx, cx, cy, r - 1, PAL.neonCyan);
      }
      PixelGFX.circleOutline(ctx, cx, cy, r, PAL.metalShine);
      PixelGFX.circleOutline(ctx, cx, cy, r + 1, PAL.metalLight);
      PixelGFX.circleOutline(ctx, cx, cy, r + 2, PAL.metalMid);
      PixelGFX.circleOutline(ctx, cx, cy, r + 3, PAL.metalDark);

      const numTicks = 16;
      const rot = time * 1.2;
      for (let i = 0; i < numTicks; i++) {
        const ang = rot + (i * Math.PI * 2) / numTicks;
        const x0 = cx + Math.round(Math.cos(ang) * Math.max(2, r - 6));
        const y0 = cy + Math.round(Math.sin(ang) * Math.max(2, r - 6));
        const x1 = cx + Math.round(Math.cos(ang) * Math.max(3, r - 3));
        const y1 = cy + Math.round(Math.sin(ang) * Math.max(3, r - 3));
        PixelGFX.line(ctx, x0, y0, x1, y1, i % 2 === 0 ? PAL.chloroplast : PAL.neonCyan);
      }
    }

    if (lensRadius >= 95) {
      const hudAlpha = MathUtil.smoothstep(95, 165, lensRadius);
      if (hudAlpha > 0.1) {
        const maxDiag = 184;
        const innerSafeR = 146;
        ctx.fillStyle = PAL.void;
        for (let py = 0; py < HEIGHT; py++) {
          const dy = (py - cy) * 1.12;
          for (let px = 0; px < WIDTH; px++) {
            if (px > 36 && px < WIDTH - 36 && py > 22 && py < HEIGHT - 22) continue;
            const dx = px - cx;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > innerSafeR) {
              const factor = ((dist - innerSafeR) / (maxDiag - innerSafeR)) * hudAlpha;
              if (factor > MathUtil.bayer(px, py)) {
                ctx.fillRect(px, py, 1, 1);
              }
            }
          }
        }

        const tickCol = PAL.neonCyanDark;
        const brightTick = PAL.chloroplast;
        for (let x = 136; x <= 184; x += 4) {
          const isMajor = (x - 160) % 12 === 0;
          const len = isMajor ? 4 : 2;
          PixelGFX.line(ctx, x, 5, x, 5 + len, isMajor ? brightTick : tickCol);
          PixelGFX.line(ctx, x, HEIGHT - 6, x, HEIGHT - 6 - len, isMajor ? brightTick : tickCol);
        }
        for (let y = 70; y <= 110; y += 4) {
          const isMajor = (y - 90) % 12 === 0;
          const len = isMajor ? 4 : 2;
          PixelGFX.line(ctx, 6, y, 6 + len, y, isMajor ? brightTick : tickCol);
          PixelGFX.line(ctx, WIDTH - 7, y, WIDTH - 7 - len, y, isMajor ? brightTick : tickCol);
        }

        PixelGFX.circleOutline(ctx, cx, cy, 154, PAL.neonCyanDark);
      }
    }
  }

  function drawCircularMaskedMicroWorld(ctx, cx, cy, r) {
    const icx = Math.round(cx);
    const icy = Math.round(cy);
    const ir = Math.round(r);
    if (ir <= 0) return;

    if (ir >= 186) {
      ctx.drawImage(microCanvas, 0, 0);
      return;
    }

    const r2 = ir * ir;
    const yMin = Math.max(0, icy - ir);
    const yMax = Math.min(HEIGHT - 1, icy + ir);

    for (let py = yMin; py <= yMax; py++) {
      const dy = py - icy;
      const span = Math.floor(Math.sqrt(Math.max(0, r2 - dy * dy)));
      const xStart = Math.max(0, icx - span);
      const xEnd = Math.min(WIDTH - 1, icx + span);
      const rowWidth = xEnd - xStart + 1;
      if (rowWidth > 0) {
        ctx.drawImage(microCanvas, xStart, py, rowWidth, 1, xStart, py, rowWidth, 1);
      }
    }
  }

  function renderFrame(ctx, time) {
    const BiotechFieldScenes = ns.BiotechFieldScenes;
    const LogoScene = ns.LogoScene;

    // 1. Fase inicial en el Laboratorio de Biotecnología (0..5.7s) y desenlace de asombro (47.8..51.6s)
    if (time < 5.7 || (time >= 47.8 && time < 51.6)) {
      LabScene.render(ctx, time);
      return;
    }

    // 2. Transición de entrada al ocular del microscopio (5.7s .. 8.6s)
    if (time >= 5.7 && time < 8.6) {
      LabScene.render(ctx, time);

      mctx.clearRect(0, 0, WIDTH, HEIGHT);
      MicroWorldScene.render(mctx, time);

      const tNorm = MathUtil.easeInOutCubic(MathUtil.invLerp(5.75, 8.5, time));
      const apertureR = MathUtil.lerp(2, 188, tNorm);

      PixelGFX.ditherGlow(ctx, WIDTH * 0.5, HEIGHT * 0.5, apertureR * 0.8, apertureR + 18, PAL.chloroplast, 0.75);
      drawCircularMaskedMicroWorld(ctx, WIDTH * 0.5, HEIGHT * 0.5, apertureR);

      if (time > 6.0 && time < 7.8) {
        const ringR = Math.round(apertureR * 0.65);
        PixelGFX.circleOutline(ctx, WIDTH * 0.5, HEIGHT * 0.5, ringR, PAL.chloroplast);
      }

      drawMicroscopeHUD(ctx, time, apertureR);
      return;
    }

    // 3. Fase dentro del Microscopio: Raíces -> Micorrizas/Bacterias -> Estomas (8.6s .. 27.4s)
    if (time >= 8.6 && time < 27.4) {
      MicroWorldScene.render(ctx, time);
      drawMicroscopeHUD(ctx, time, 190);
      return;
    }

    // 4. Transición desde Estomas hacia Trabajo Biotecnológico en Laboratorio (27.4s .. 28.4s)
    if (time >= 27.4 && time < 28.4 && BiotechFieldScenes) {
      BiotechFieldScenes.render(ctx, time);

      mctx.clearRect(0, 0, WIDTH, HEIGHT);
      MicroWorldScene.render(mctx, time);

      const outNorm = MathUtil.easeInOutCubic(MathUtil.invLerp(27.4, 28.4, time));
      const apertureR = MathUtil.lerp(188, 0, outNorm);

      if (apertureR > 1) {
        PixelGFX.ditherGlow(ctx, WIDTH * 0.5, HEIGHT * 0.5, apertureR * 0.5, apertureR + 14, PAL.chloroplast, 0.8);
        drawCircularMaskedMicroWorld(ctx, WIDTH * 0.5, HEIGHT * 0.5, apertureR);
        drawMicroscopeHUD(ctx, time, apertureR);
      }
      return;
    }

    // 5. Secuencia de Investigación Aplicada:
    //    Escena 6 (Pipeteo/PCR) -> Escena 7 (Invernadero/Riego) -> Escena 8 (Bioinformática) (28.4s .. 46.6s)
    if (time >= 28.4 && time < 46.6 && BiotechFieldScenes) {
      BiotechFieldScenes.render(ctx, time);
      return;
    }

    // 6. Transición desde la Estación de Bioinformática de regreso al Descubrimiento de la Investigadora (46.6s .. 47.8s)
    if (time >= 46.6 && time < 47.8) {
      LabScene.render(ctx, time);
      if (BiotechFieldScenes) {
        mctx.clearRect(0, 0, WIDTH, HEIGHT);
        BiotechFieldScenes.render(mctx, time);

        const p = MathUtil.easeInOutCubic(MathUtil.invLerp(46.6, 47.8, time));
        for (let y = 0; y < HEIGHT; y++) {
          for (let x = 0; x < WIDTH; x++) {
            if (1.0 - p > MathUtil.bayer(x, y)) {
              ctx.drawImage(microCanvas, x, y, 1, 1, x, y, 1, 1);
            }
          }
        }
      }
      return;
    }

    // 7. Transición Bayer-dither desde el Laboratorio hacia el Cierre Institucional de Logos (51.6s .. 52.4s)
    if (time >= 51.6 && time < 52.4 && LogoScene) {
      LogoScene.render(ctx, time);
      mctx.clearRect(0, 0, WIDTH, HEIGHT);
      LabScene.render(mctx, time);

      const p = MathUtil.easeInOutCubic(MathUtil.invLerp(51.6, 52.4, time));
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          if (1.0 - p > MathUtil.bayer(x, y)) {
            ctx.drawImage(microCanvas, x, y, 1, 1, x, y, 1, 1);
          }
        }
      }
      return;
    }

    // 8. Escena 10: Cierre Institucional Pixel-Art (CEAF arriba + GORE, CORE y ANID abajo) (52.4s .. 59.3s)
    if (time >= 52.4 && time < 59.3 && LogoScene) {
      LogoScene.render(ctx, time);
      return;
    }

    // 9. Transición de cierre en bucle hacia la Escena 1 (59.3s .. 60.0s)
    if (time >= 59.3 && LogoScene) {
      LabScene.render(ctx, 0.0);
      mctx.clearRect(0, 0, WIDTH, HEIGHT);
      LogoScene.render(mctx, time);

      const p = MathUtil.easeInOutCubic(MathUtil.invLerp(59.3, 60.0, time));
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          if (1.0 - p > MathUtil.bayer(x, y)) {
            ctx.drawImage(microCanvas, x, y, 1, 1, x, y, 1, 1);
          }
        }
      }
      return;
    }

    LabScene.render(ctx, time);
  }

  ns.Transition = {
    renderFrame
  };
})(window.MicroCosmos);
