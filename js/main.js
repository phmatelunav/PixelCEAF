/**
 * main.js
 * Bucle principal requestAnimationFrame, reloj maestro del cortometraje en loop (32s),
 * sincronización con el motor de audio (Web Audio API) y controles de proyección.
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  const { WIDTH, HEIGHT, LOOP_DURATION, Transition, MathUtil } = ns;

  const ACTS = [
    {
      start: 0.0,
      end: 6.5,
      badge: 'SEDE CEAF',
      title: 'Campo Experimental y Centro de Estudios Avanzados en Fruticultura',
      zoomLabel: 'Exterior · Rengo, O\'Higgins'
    },
    {
      start: 6.5,
      end: 12.1,
      badge: 'LABORATORIO',
      title: 'Biología Molecular de Plantas y Bioinformática',
      zoomLabel: '1.0x · Cultivo In Vitro'
    },
    {
      start: 12.1,
      end: 15.0,
      badge: 'LENTE ÓPTICO',
      title: 'Inmersión en Microscopio Confocal',
      zoomLabel: '100x · Epifluorescencia GFP'
    },
    {
      start: 15.0,
      end: 20.7,
      badge: 'RIZOSFERA',
      title: 'Raíces, Pelos Radiculares y Xilema/Floema',
      zoomLabel: '400x · Cilindro Vascular'
    },
    {
      start: 20.7,
      end: 27.5,
      badge: 'SIMBIOSIS',
      title: 'Hongos Micorrícicos (Arbúsculos) y Bacterias',
      zoomLabel: '800x · Red Micorrícica y PGPR'
    },
    {
      start: 27.5,
      end: 33.9,
      badge: 'EPIDERMIS FOLIAR',
      title: 'Estomas de Hojas, Cloroplastos e Intercambio Gaseoso',
      zoomLabel: '1000x · Células Oclusivas'
    },
    {
      start: 33.9,
      end: 40.3,
      badge: 'BIOTECNOLOGÍA',
      title: 'Micropipeteo de Precisión, PCR y Electroforesis de ADN',
      zoomLabel: 'Ensayo · Biología Molecular'
    },
    {
      start: 40.3,
      end: 46.9,
      badge: 'INVERNADERO Y CAMPO',
      title: 'Riego de Muestras Experimentales, Rizotrón y Sensores',
      zoomLabel: 'Campo · Fenotipado Vegetal'
    },
    {
      start: 46.9,
      end: 53.3,
      badge: 'BIOINFORMÁTICA',
      title: 'Alineamiento Genómico, Heatmap RNA-seq y Proteína 3D',
      zoomLabel: 'In Silico · Genómica Funcional'
    },
    {
      start: 53.3,
      end: 58.5,
      badge: 'DESCUBRIMIENTO',
      title: 'El Asombro de la Investigadora',
      zoomLabel: '1.0x · Hallazgo Integral'
    },
    {
      start: 58.5,
      end: 66.5,
      badge: 'CIERRE INSTITUCIONAL',
      title: 'CEAF · GORE · CORE · ANID — Región de O\'Higgins',
      zoomLabel: 'CEAF · Fruticultura Avanzada'
    }
  ];

  function getActInfo(t) {
    for (let i = 0; i < ACTS.length; i++) {
      if (t >= ACTS[i].start && t < ACTS[i].end) {
        return ACTS[i];
      }
    }
    return ACTS[0];
  }

  function formatSeconds(sec) {
    const s = Math.floor(sec);
    const tenths = Math.floor((sec - s) * 10);
    const padS = s < 10 ? '0' + s : '' + s;
    return `00:${padS}.${tenths}`;
  }

  function init() {
    const canvas = document.getElementById('stage');
    if (!canvas) return;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = false;

    const playBtn = document.getElementById('btn-play');
    const playIcon = document.getElementById('icon-play');
    const audioBtn = document.getElementById('btn-audio');
    const audioIcon = document.getElementById('icon-audio');
    const audioBanner = document.getElementById('audio-unlock-banner');
    const scrubber = document.getElementById('timeline-scrubber');
    const progressFill = document.getElementById('timeline-fill');
    const actBadge = document.getElementById('act-badge');
    const actTitle = document.getElementById('act-title');
    const zoomReadout = document.getElementById('zoom-readout');
    const timeReadout = document.getElementById('time-readout');
    const captionsBtn = document.getElementById('btn-captions');
    const fullscreenBtn = document.getElementById('btn-fullscreen');
    const actButtons = document.querySelectorAll('[data-jump-time]');
    const uiContainer = document.getElementById('cinema-ui');

    let isPlaying = true;
    let isScrubbing = false;
    let timelineTime = 0.0;
    let lastFrameTs = performance.now();
    let idleTimer = null;

    function syncAudioUI() {
      if (!ns.AudioEngine) return;
      const st = ns.AudioEngine.getStatus();
      if (audioIcon) {
        audioIcon.textContent = st.isActive ? '🔊' : '🔇';
      }
      if (audioBtn) {
        audioBtn.classList.toggle('audio-on', st.isActive);
      }
      if (audioBanner && st.isUnlocked) {
        audioBanner.classList.add('hidden');
      }
    }

    function ensureAudioUnlocked() {
      if (!ns.AudioEngine) return;
      const st = ns.AudioEngine.getStatus();
      if (!st.isMuted) {
        ns.AudioEngine.unlockAndStart();
        syncAudioUI();
      }
    }

    function updateUI(t) {
      const act = getActInfo(t);
      if (actBadge && actBadge.textContent !== act.badge) {
        actBadge.textContent = act.badge;
      }
      if (actTitle && actTitle.textContent !== act.title) {
        actTitle.textContent = act.title;
      }
      if (zoomReadout && zoomReadout.textContent !== act.zoomLabel) {
        zoomReadout.textContent = act.zoomLabel;
      }
      if (timeReadout) {
        timeReadout.textContent = `${formatSeconds(t)} / 00:${LOOP_DURATION.toFixed(1)}`;
      }
      const pct = (t / LOOP_DURATION) * 100;
      if (progressFill) {
        progressFill.style.width = `${pct}%`;
      }
      if (scrubber && !isScrubbing) {
        scrubber.value = t.toFixed(2);
      }

      for (let i = 0; i < actButtons.length; i++) {
        const btn = actButtons[i];
        const start = parseFloat(btn.getAttribute('data-jump-time') || '0');
        const end = parseFloat(btn.getAttribute('data-end-time') || '32');
        if (t >= start && t < end) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    }

    function togglePlay() {
      ensureAudioUnlocked();
      isPlaying = !isPlaying;
      if (playIcon) {
        playIcon.textContent = isPlaying ? '❚❚' : '▶';
      }
      if (playBtn) {
        playBtn.setAttribute('aria-label', isPlaying ? 'Pausar animación' : 'Reproducir animación');
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', togglePlay);
    }

    if (audioBtn) {
      audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        ns.AudioEngine?.toggleMute();
        syncAudioUI();
      });
    }

    if (audioBanner) {
      audioBanner.addEventListener('click', (e) => {
        e.stopPropagation();
        ns.AudioEngine?.unlockAndStart();
        syncAudioUI();
      });
    }

    // Desbloquear audio automáticamente al primer clic en el escenario
    if (canvas) {
      canvas.addEventListener('click', () => {
        ensureAudioUnlocked();
      });
    }

    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        ensureAudioUnlocked();
        isScrubbing = true;
        timelineTime = MathUtil.clamp(parseFloat(e.target.value), 0, LOOP_DURATION - 0.01);
        Transition.renderFrame(ctx, timelineTime);
        updateUI(timelineTime);
      });
      scrubber.addEventListener('change', () => {
        isScrubbing = false;
      });
    }

    actButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        ensureAudioUnlocked();
        const targetT = parseFloat(btn.getAttribute('data-jump-time') || '0');
        timelineTime = MathUtil.clamp(targetT, 0, LOOP_DURATION - 0.01);
        Transition.renderFrame(ctx, timelineTime);
        updateUI(timelineTime);
      });
    });

    function toggleCaptions() {
      if (!Transition.toggleHudCaptions) return;
      const enabled = Transition.toggleHudCaptions();
      if (captionsBtn) {
        captionsBtn.classList.toggle('audio-on', enabled);
      }
      Transition.renderFrame(ctx, timelineTime);
    }

    if (captionsBtn) {
      captionsBtn.addEventListener('click', toggleCaptions);
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        ensureAudioUnlocked();
        const wrapper = document.getElementById('viewport-wrapper') || document.documentElement;
        if (!document.fullscreenElement) {
          wrapper.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      });
    }

    function wakeUI() {
      if (!uiContainer) return;
      uiContainer.classList.remove('ui-idle');
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (isPlaying && !isScrubbing) {
          uiContainer.classList.add('ui-idle');
        }
      }, 3200);
    }

    window.addEventListener('mousemove', wakeUI);
    window.addEventListener('keydown', (e) => {
      wakeUI();
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        ns.AudioEngine?.toggleMute();
        syncAudioUI();
      } else if (e.code === 'KeyC') {
        toggleCaptions();
      } else if (e.code === 'ArrowRight') {
        ensureAudioUnlocked();
        timelineTime = (timelineTime + 1.5) % LOOP_DURATION;
      } else if (e.code === 'ArrowLeft') {
        ensureAudioUnlocked();
        timelineTime = (timelineTime - 1.5 + LOOP_DURATION) % LOOP_DURATION;
      } else if (e.code === 'KeyF') {
        fullscreenBtn?.click();
      }
    });

    // Iniciar con el audio encendido por defecto al cargar la animación
    ns.AudioEngine?.unlockAndStart();
    syncAudioUI();
    ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
      window.addEventListener(evt, ensureAudioUnlocked, { passive: true });
    });

    wakeUI();

    function tick(now) {
      const dt = Math.min(0.1, Math.max(0, (now - lastFrameTs) / 1000));
      lastFrameTs = now;

      if (isPlaying && !isScrubbing) {
        timelineTime = (timelineTime + dt) % LOOP_DURATION;
      }

      ctx.imageSmoothingEnabled = false;
      Transition.renderFrame(ctx, timelineTime);
      ns.AudioEngine?.update(timelineTime, isPlaying && !isScrubbing);
      updateUI(timelineTime);

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window.MicroCosmos);
