/**
 * audio.js
 * Sintetizador Procedural y Motor de Paisaje Sonoro (Web Audio API estilo Tone.js)
 * sincronizado fotograma a fotograma con los 32.0 segundos de la animación:
 *   1. Laboratorio de Biotecnología (Arpegio cristalino + beeps de telemetría + clics de micrómetro)
 *   2. Inmersión Óptica Confocal (Barrido de filtro y shimmer ascendente)
 *   3. Raíces y Xilema/Floema (Bajo orgánico profundo + pulsos hidráulicos de savia)
 *   4. Simbiosis Micorrizas y Bacterias (Acordes en modo Lidio + campanas FM de arbúsculos + chirps bacterianos)
 *   5. Estomas y Cloroplastos (Respiración armónica sincronizada con la apertura del ostíolo + destellos de O2)
 *   6. Descubrimiento de la Investigadora (Zoom-out óptico + cadencia cálida de asombro)
 */

window.MicroCosmos = window.MicroCosmos || {};

(function (ns) {
  'use strict';

  const { MathUtil } = ns;

  let audioCtx = null;
  let masterGain = null;
  let delayNode = null;
  let delayFeedback = null;
  let wetGain = null;
  let ambientPadOsc1 = null;
  let ambientPadOsc2 = null;
  let ambientPadFilter = null;
  let ambientPadGain = null;

  let isMuted = false;
  let isUnlocked = false;
  let lastStepIndex = -1;
  let lastTime = 0;

  // Conversión de nota MIDI a frecuencia en Hz
  function mtof(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /**
   * Inicializa el grafo de Web Audio API (Master, Compresor suave, Delay Estéreo y Pad Continuo)
   */
  function initAudioGraph() {
    if (audioCtx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();

    // Nodo de ganancia maestra
    masterGain = audioCtx.createGain();
    masterGain.gain.value = isMuted ? 0.0 : 0.38;

    // Delay con retroalimentación (estilo Tone.FeedbackDelay) para atmósfera espacial/microscópica
    delayNode = audioCtx.createDelay(1.0);
    delayNode.delayTime.value = 0.28;

    delayFeedback = audioCtx.createGain();
    delayFeedback.gain.value = 0.36;

    const delayFilter = audioCtx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 2400;

    wetGain = audioCtx.createGain();
    wetGain.gain.value = 0.28;

    delayNode.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    delayFilter.connect(wetGain);

    wetGain.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Pad Ambiental Continuo (cambia su filtro y acordes según la escena actual)
    ambientPadOsc1 = audioCtx.createOscillator();
    ambientPadOsc2 = audioCtx.createOscillator();
    ambientPadFilter = audioCtx.createBiquadFilter();
    ambientPadGain = audioCtx.createGain();

    ambientPadOsc1.type = 'sawtooth';
    ambientPadOsc2.type = 'triangle';
    ambientPadOsc1.frequency.value = mtof(48); // C3
    ambientPadOsc2.frequency.value = mtof(55) + 0.8; // G3 ligeramente desafinado para chorus

    ambientPadFilter.type = 'lowpass';
    ambientPadFilter.frequency.value = 320;
    ambientPadFilter.Q.value = 2.0;

    ambientPadGain.gain.value = 0.0;

    ambientPadOsc1.connect(ambientPadFilter);
    ambientPadOsc2.connect(ambientPadFilter);
    ambientPadFilter.connect(ambientPadGain);
    ambientPadGain.connect(masterGain);
    ambientPadGain.connect(delayNode);

    ambientPadOsc1.start();
    ambientPadOsc2.start();
  }

  /**
   * Sintetizador de notas melódicas / arpegios (estilo Tone.Synth / PolySynth)
   */
  function playNote({
    midi = 60,
    duration = 0.22,
    type = 'triangle',
    volume = 0.14,
    attack = 0.015,
    release = 0.18,
    filterFreq = 2600,
    sendDelay = true,
    detune = 0
  }) {
    if (!audioCtx || isMuted || audioCtx.state !== 'running') return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(mtof(midi), now);
    if (detune !== 0) {
      osc.detune.setValueAtTime(detune, now);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + duration + release);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    if (sendDelay && delayNode) {
      gain.connect(delayNode);
    }

    osc.start(now);
    osc.stop(now + attack + duration + release + 0.03);
  }

  /**
   * Sintetizador FM cristalino para campanas biológicas, arbúsculos, cloroplastos y destellos
   */
  function playFMChime({
    midi = 72,
    duration = 0.35,
    modRatio = 2.0,
    modIndex = 120,
    volume = 0.1
  }) {
    if (!audioCtx || isMuted || audioCtx.state !== 'running') return;

    const now = audioCtx.currentTime;
    const carrierFreq = mtof(midi);

    const carrier = audioCtx.createOscillator();
    const modulator = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();
    const envGain = audioCtx.createGain();

    carrier.type = 'sine';
    modulator.type = 'sine';

    carrier.frequency.setValueAtTime(carrierFreq, now);
    modulator.frequency.setValueAtTime(carrierFreq * modRatio, now);

    modGain.gain.setValueAtTime(modIndex, now);
    modGain.gain.exponentialRampToValueAtTime(1.0, now + duration);

    envGain.gain.setValueAtTime(0.0001, now);
    envGain.gain.linearRampToValueAtTime(volume, now + 0.01);
    envGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(envGain);

    envGain.connect(masterGain);
    if (delayNode) envGain.connect(delayNode);

    carrier.start(now);
    modulator.start(now);
    carrier.stop(now + duration + 0.04);
    modulator.stop(now + duration + 0.04);
  }

  /**
   * Efecto de barrido óptico / chirp bacteriano / clic de micrómetro
   */
  function playSweepFX({
    startFreq = 300,
    endFreq = 1200,
    duration = 0.25,
    type = 'sine',
    volume = 0.09,
    sendDelay = true
  }) {
    if (!audioCtx || isMuted || audioCtx.state !== 'running') return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + duration * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(masterGain);
    if (sendDelay && delayNode) gain.connect(delayNode);

    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  // ============================================================================
  // PARTITURA Y EVENTOS SONOROS SINCRONIZADOS AL BUCLE DE 32.0 SEGUNDOS
  // ============================================================================
  // Dividimos los 32.0s en pasos rítmicos de 0.20s (160 pasos por bucle = 150 BPM subdivisión corchea)
  const STEP_DURATION = 0.20;

  // Escalas y progresiones por escena (notas MIDI):
  // 1. Lab Biotech (0.0s .. 5.6s): Cmaj9 / Am9 limpio, científico y luminoso
  const LAB_ARP = [60, 64, 67, 71, 74, 71, 67, 64, 57, 60, 64, 69, 72, 69, 64, 60];
  // 3. Raíces y Xilema (8.5s .. 14.2s): Em9 / G6 orgánico y profundo (flujo de savia)
  const ROOTS_ARP = [52, 59, 62, 64, 67, 71, 67, 64, 55, 59, 62, 67, 69, 71, 67, 62];
  // 4. Micorrizas y Bacterias (14.2s .. 21.0s): Fmaj7#11 Lidio (maravilla simbiótica)
  const MYCO_ARP = [53, 60, 64, 65, 69, 71, 72, 76, 55, 62, 67, 71, 74, 76, 79, 74];
  // 5. Estomas y Cloroplastos (21.0s .. 27.4s): Cmaj9#11 / Gmaj9 aéreo, fotosintético y radiante
  const STOMATA_ARP = [64, 67, 71, 74, 76, 79, 83, 79, 62, 67, 71, 74, 78, 81, 83, 78];
  // 6. Trabajo Biotecnológico Pipeteo/PCR (27.4s .. 33.8s): Dmaj9 / Bm9 preciso y cristalino
  const BIOTECH_ARP = [62, 66, 69, 73, 76, 73, 69, 66, 59, 62, 66, 69, 74, 69, 66, 62];
  // 7. Invernadero y Riego en Campo (33.8s .. 40.4s): Gmaj9 / Cmaj9 cálido, pastoral y soleado
  const GREENHOUSE_ARP = [55, 59, 62, 66, 69, 71, 74, 71, 60, 64, 67, 71, 74, 76, 79, 74];
  // 8. Computadora Bioinformática (40.4s .. 46.8s): Am11 / Fmaj9#11 algorítmico y analítico
  const BIOINFO_ARP = [57, 64, 67, 69, 72, 74, 76, 79, 53, 60, 64, 67, 69, 71, 72, 76];
  // 9. Descubrimiento Investigadora (46.8s .. 52.0s): Cadencia cálida Fmaj7 -> G6 -> Cmaj9
  const OUTRO_ARP = [65, 69, 72, 76, 67, 71, 74, 79, 60, 64, 67, 71, 72, 76, 79, 84];

  function triggerStepEvents(step, time) {
    // ------------------------------------------------------------------
    // CAPÍTULO 1: LABORATORIO BLANCO DE BIOTECNOLOGÍA (0.0s .. 5.6s)
    // ------------------------------------------------------------------
    if (time < 5.6) {
      const note = LAB_ARP[step % LAB_ARP.length];
      playNote({
        midi: note,
        duration: 0.14,
        type: 'triangle',
        volume: 0.11,
        filterFreq: 2100
      });

      // Bajo suave cada 4 pasos
      if (step % 4 === 0) {
        playNote({
          midi: (step % 16 < 8) ? 48 : 45,
          duration: 0.45,
          type: 'sine',
          volume: 0.15,
          sendDelay: false
        });
      }

      // Clics sutiles del micrómetro cuando la investigadora gira la perilla (1.4s .. 4.1s)
      if (time >= 1.4 && time <= 4.1 && step % 2 === 1) {
        playSweepFX({
          startFreq: 950,
          endFreq: 420,
          duration: 0.035,
          type: 'triangle',
          volume: 0.06,
          sendDelay: false
        });
      }

      // Beeps de telemetría bioinformática de las computadoras
      if (step % 6 === 2) {
        playFMChime({
          midi: 84 + ((step % 3) * 2),
          duration: 0.09,
          modRatio: 1.5,
          modIndex: 40,
          volume: 0.045
        });
      }
      return;
    }

    // ------------------------------------------------------------------
    // CAPÍTULO 2: INMERSIÓN ÓPTICA EN EL OCULAR (5.6s .. 8.5s)
    // ------------------------------------------------------------------
    if (time >= 5.6 && time < 8.5) {
      const zoomProgress = MathUtil.invLerp(5.6, 8.5, time);
      const scaleAsc = [60, 62, 64, 67, 69, 71, 72, 74, 76, 79, 81, 83, 84, 86, 88];
      const idx = Math.min(scaleAsc.length - 1, Math.floor(zoomProgress * scaleAsc.length));
      playFMChime({
        midi: scaleAsc[idx],
        duration: 0.26,
        modRatio: 2.0,
        modIndex: 90 + zoomProgress * 110,
        volume: 0.11
      });

      if (step === 30) {
        playSweepFX({
          startFreq: 180,
          endFreq: 1450,
          duration: 1.8,
          type: 'sine',
          volume: 0.1,
          sendDelay: true
        });
      }
      return;
    }

    // ------------------------------------------------------------------
    // CAPÍTULO 3: RAÍCES DE PLANTAS Y XILEMA/FLOEMA (8.5s .. 14.2s)
    // ------------------------------------------------------------------
    if (time >= 8.5 && time < 14.2) {
      const note = ROOTS_ARP[step % ROOTS_ARP.length];
      playNote({
        midi: note,
        duration: 0.18,
        type: 'triangle',
        volume: 0.12,
        filterFreq: 1800
      });

      if (step % 4 === 0) {
        playNote({
          midi: (step % 8 === 0) ? 40 : 43,
          duration: 0.55,
          type: 'sine',
          volume: 0.18,
          sendDelay: false
        });
      }

      if (step % 3 === 0) {
        playFMChime({
          midi: 76 + ((step % 4) * 3),
          duration: 0.2,
          modRatio: 3.0,
          modIndex: 75,
          volume: 0.065
        });
      }

      if (step === 68) {
        playSweepFX({
          startFreq: 320,
          endFreq: 1180,
          duration: 0.9,
          type: 'triangle',
          volume: 0.1,
          sendDelay: true
        });
      }
      return;
    }

    // ------------------------------------------------------------------
    // CAPÍTULO 4: HONGOS MICORRÍCICOS (ARBÚSCULOS) Y BACTERIAS (14.2s .. 21.0s)
    // ------------------------------------------------------------------
    if (time >= 14.2 && time < 21.0) {
      const note = MYCO_ARP[step % MYCO_ARP.length];
      playNote({
        midi: note,
        duration: 0.16,
        type: 'sine',
        volume: 0.12,
        filterFreq: 2800
      });

      if (step % 4 === 0) {
        playNote({
          midi: (step % 8 === 0) ? 41 : 43,
          duration: 0.5,
          type: 'triangle',
          volume: 0.14,
          filterFreq: 600,
          sendDelay: false
        });
      }

      if (step % 2 === 0) {
        const chimeNotes = [77, 81, 83, 84, 88];
        playFMChime({
          midi: chimeNotes[step % chimeNotes.length],
          duration: 0.32,
          modRatio: 2.0,
          modIndex: 110,
          volume: 0.08
        });
      }

      if (step % 5 === 1) {
        playSweepFX({
          startFreq: 680 + (step % 4) * 120,
          endFreq: 1350 + (step % 3) * 180,
          duration: 0.09,
          type: 'sine',
          volume: 0.055,
          sendDelay: true
        });
      }

      if (step === 102) {
        playSweepFX({
          startFreq: 400,
          endFreq: 1600,
          duration: 0.95,
          type: 'sine',
          volume: 0.11,
          sendDelay: true
        });
      }
      return;
    }

    // ------------------------------------------------------------------
    // CAPÍTULO 5: ESTOMAS DE LAS HOJAS Y CLOROPLASTOS (21.0s .. 27.4s)
    // ------------------------------------------------------------------
    if (time >= 21.0 && time < 27.4) {
      const note = STOMATA_ARP[step % STOMATA_ARP.length];
      playNote({
        midi: note,
        duration: 0.18,
        type: 'triangle',
        volume: 0.12,
        filterFreq: 3200
      });

      const stomaOpen = MathUtil.clamp(0.25 + 0.75 * (0.5 + 0.5 * Math.sin((time - 21.0) * 1.6)), 0.15, 1.0);
      if (stomaOpen > 0.55 && step % 2 === 1) {
        playFMChime({
          midi: 83 + ((step % 4) * 2),
          duration: 0.25,
          modRatio: 2.5,
          modIndex: 85,
          volume: 0.075 * stomaOpen
        });
      }

      if (step % 4 === 0) {
        playNote({
          midi: (step % 8 === 0) ? 48 : 43,
          duration: 0.5,
          type: 'sine',
          volume: 0.16,
          sendDelay: false
        });
      }

      if (step === 131) {
        [72, 76, 79, 83, 86].forEach((m, i) => {
          setTimeout(() => {
            playFMChime({
              midi: m,
              duration: 0.65,
              modRatio: 2.0,
              modIndex: 140,
              volume: 0.09
            });
          }, i * 55);
        });
      }
      return;
    }

    // ------------------------------------------------------------------
    // CAPÍTULO 6: TRABAJO BIOTECNOLÓGICO EN LABORATORIO (27.4s .. 33.8s)
    // Micropipeteo, PCR y Electroforesis en Gel
    // ------------------------------------------------------------------
    if (time >= 27.4 && time < 33.8) {
      if (step === 137) {
        playSweepFX({
          startFreq: 1350,
          endFreq: 440,
          duration: 0.75,
          type: 'sine',
          volume: 0.09,
          sendDelay: true
        });
      }

      const note = BIOTECH_ARP[step % BIOTECH_ARP.length];
      playNote({
        midi: note,
        duration: 0.15,
        type: 'triangle',
        volume: 0.11,
        filterFreq: 2400
      });

      if (step % 4 === 0) {
        playNote({
          midi: (step % 8 === 0) ? 50 : 47, // D3 / B2
          duration: 0.45,
          type: 'sine',
          volume: 0.15,
          sendDelay: false
        });
      }

      // Clic neumático de la micropipeta y gota dispensada en cada pocillo (cada ~6 pasos)
      if (step % 6 === 3) {
        playSweepFX({
          startFreq: 520,
          endFreq: 1180,
          duration: 0.08,
          type: 'sine',
          volume: 0.075,
          sendDelay: true
        });
        playFMChime({
          midi: 86 + (step % 3) * 2,
          duration: 0.18,
          modRatio: 2.0,
          modIndex: 65,
          volume: 0.06
        });
      }
      return;
    }

    // ------------------------------------------------------------------
    // CAPÍTULO 7: INVERNADERO Y RIEGO EN MUESTRAS DE CAMPO (33.8s .. 40.4s)
    // ------------------------------------------------------------------
    if (time >= 33.8 && time < 40.4) {
      const note = GREENHOUSE_ARP[step % GREENHOUSE_ARP.length];
      playNote({
        midi: note,
        duration: 0.2,
        type: 'triangle',
        volume: 0.12,
        filterFreq: 2700
      });

      if (step % 4 === 0) {
        playNote({
          midi: (step % 8 === 0) ? 43 : 48, // G2 / C3
          duration: 0.52,
          type: 'sine',
          volume: 0.16,
          sendDelay: false
        });
      }

      // Gotas cristalinas de agua cayendo sobre las hojas y el sustrato
      const waterDropNotes = [79, 83, 86, 88, 91, 84];
      playFMChime({
        midi: waterDropNotes[step % waterDropNotes.length],
        duration: 0.14,
        modRatio: 2.5,
        modIndex: 55,
        volume: 0.055
      });

      if (step % 3 === 1) {
        playSweepFX({
          startFreq: 640 + (step % 4) * 90,
          endFreq: 980 + (step % 3) * 110,
          duration: 0.06,
          type: 'sine',
          volume: 0.045,
          sendDelay: true
        });
      }
      return;
    }

    // ------------------------------------------------------------------
    // CAPÍTULO 8: ESTACIÓN DE BIOINFORMÁTICA Y GENÓMICA (40.4s .. 46.8s)
    // ------------------------------------------------------------------
    if (time >= 40.4 && time < 46.8) {
      const note = BIOINFO_ARP[step % BIOINFO_ARP.length];
      playNote({
        midi: note,
        duration: 0.12,
        type: 'sawtooth',
        volume: 0.085,
        filterFreq: 2200
      });

      if (step % 4 === 0) {
        playNote({
          midi: (step % 8 === 0) ? 45 : 41, // A2 / F2
          duration: 0.45,
          type: 'triangle',
          volume: 0.15,
          filterFreq: 700,
          sendDelay: false
        });
      }

      // Clics rápidos de teclado mecánico mientras el bioinformático escribe
      if (time < 44.0) {
        playSweepFX({
          startFreq: 1400 + (step % 3) * 200,
          endFreq: 380,
          duration: 0.025,
          type: 'triangle',
          volume: 0.05,
          sendDelay: false
        });
      }

      // En 43.6s (step 218): Fanfarria cristalina "¡Eureka!" al detectar el gen significativo en el Volcano Plot
      if (step === 218) {
        [69, 72, 76, 81, 84].forEach((m, i) => {
          setTimeout(() => {
            playFMChime({
              midi: m,
              duration: 0.55,
              modRatio: 2.0,
              modIndex: 120,
              volume: 0.09
            });
          }, i * 50);
        });
      }
      return;
    }

    // ------------------------------------------------------------------
    // CAPÍTULO 9: RETORNO Y ASOMBRO DE LA INVESTIGADORA (46.8s .. 52.0s)
    // ------------------------------------------------------------------
    if (time >= 46.8 && time < 52.0) {
      if (step === 234) {
        playSweepFX({
          startFreq: 1150,
          endFreq: 320,
          duration: 1.0,
          type: 'sine',
          volume: 0.09,
          sendDelay: true
        });
      }

      const note = OUTRO_ARP[step % OUTRO_ARP.length];
      playNote({
        midi: note,
        duration: 0.2,
        type: 'triangle',
        volume: 0.11,
        filterFreq: 2400
      });

      if (step % 4 === 0) {
        playNote({
          midi: 48, // C3
          duration: 0.55,
          type: 'sine',
          volume: 0.15,
          sendDelay: false
        });
      }
      return;
    }

    // ------------------------------------------------------------------
    // CAPÍTULO 10: CIERRE INSTITUCIONAL CEAF + GORE, CORE, ANID (52.0s .. 60.0s)
    // ------------------------------------------------------------------
    if (time >= 52.0) {
      // En 52.2s (step 261): Acorde cristalino cuando aparece el logo principal de CEAF y su hoja/fruto
      if (step === 261) {
        [60, 64, 67, 71, 74, 79].forEach((m, i) => {
          setTimeout(() => {
            playFMChime({
              midi: m,
              duration: 0.75,
              modRatio: 2.0,
              modIndex: 95,
              volume: 0.085
            });
          }, i * 55);
        });
      }

      // En 53.4s, 53.8s, 54.2s (steps 267, 269, 271): Destellos suaves cuando emergen GORE, CORE y ANID
      if (step === 267 || step === 269 || step === 271) {
        const logoChime = step === 267 ? 76 : step === 269 ? 79 : 84;
        playFMChime({
          midi: logoChime,
          duration: 0.45,
          modRatio: 2.0,
          modIndex: 80,
          volume: 0.075
        });
      }

      // Efectos sonoros de rebote ("bouncing") cuando la esfera naranja de CEAF cae y rebota hacia la derecha
      // Impactos en t = 55.58s (step 278), 56.28s (step 281), 56.84s (step 284), 57.28s (step 286), 57.62s (step 288)
      const bounceSteps = {
        278: { freq: 340, midi: 79, vol: 0.095 },
        281: { freq: 420, midi: 83, vol: 0.08 },
        284: { freq: 500, midi: 86, vol: 0.065 },
        286: { freq: 580, midi: 88, vol: 0.05 },
        288: { freq: 660, midi: 91, vol: 0.038 }
      };
      if (bounceSteps[step]) {
        const b = bounceSteps[step];
        playSweepFX({
          startFreq: b.freq * 0.65,
          endFreq: b.freq * 1.45,
          duration: 0.085,
          type: 'sine',
          volume: b.vol,
          sendDelay: true
        });
        playFMChime({
          midi: b.midi,
          duration: 0.22,
          modRatio: 2.0,
          modIndex: 60,
          volume: b.vol * 0.75
        });
      }

      const logoArp = [60, 67, 71, 74, 76, 79, 84, 79];
      if (step % 2 === 0) {
        playNote({
          midi: logoArp[(step >> 1) % logoArp.length],
          duration: 0.28,
          type: 'sine',
          volume: 0.09,
          filterFreq: 2000
        });
      }

      if (step % 8 === 0) {
        playNote({
          midi: 48, // C3
          duration: 0.9,
          type: 'sine',
          volume: 0.14,
          sendDelay: false
        });
      }
    }
  }

  /**
   * Actualiza de forma continua el Pad Ambiental y dispara los pasos de la partitura según `time`.
   */
  function update(time, isPlaying) {
    if (!audioCtx || !isUnlocked) return;

    if (!isPlaying || isMuted || audioCtx.state !== 'running') {
      if (ambientPadGain && audioCtx) {
        ambientPadGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.08);
      }
      return;
    }

    const now = audioCtx.currentTime;

    // 1. Modular el Pad Continuo según la escena actual
    if (ambientPadFilter && ambientPadGain && ambientPadOsc1 && ambientPadOsc2) {
      let targetFilter = 350;
      let targetGain = 0.035;
      let rootMidi = 48; // C3
      let fifthMidi = 55; // G3

      if (time < 5.6 || (time >= 46.8 && time < 52.0)) {
        targetFilter = 320;
        targetGain = 0.025;
        rootMidi = 48;
        fifthMidi = 55;
      } else if (time >= 52.0) {
        // Cierre Institucional: Pad cálido y luminoso en Do Mayor 9
        targetFilter = 480;
        targetGain = 0.032;
        rootMidi = 48; // C3
        fifthMidi = 55; // G3
      } else if (time >= 5.6 && time < 8.5) {
        const z = MathUtil.invLerp(5.6, 8.5, time);
        targetFilter = 320 + z * 950;
        targetGain = 0.045;
        rootMidi = 48;
        fifthMidi = 57;
      } else if (time >= 8.5 && time < 14.2) {
        targetFilter = 420 + Math.sin(time * 2.5) * 110;
        targetGain = 0.045;
        rootMidi = 40; // E2
        fifthMidi = 47; // B2
      } else if (time >= 14.2 && time < 21.0) {
        targetFilter = 680 + Math.sin(time * 3.0) * 180;
        targetGain = 0.048;
        rootMidi = 41; // F2
        fifthMidi = 48; // C3
      } else if (time >= 21.0 && time < 27.4) {
        const stomaOpen = MathUtil.clamp(0.25 + 0.75 * (0.5 + 0.5 * Math.sin((time - 21.0) * 1.6)), 0.15, 1.0);
        targetFilter = 380 + stomaOpen * 1100;
        targetGain = 0.035 + stomaOpen * 0.03;
        rootMidi = 48; // C3
        fifthMidi = 55; // G3
      } else if (time >= 27.4 && time < 33.8) {
        // Escena 6: Biotecnología en Laboratorio (Re mayor / Si menor)
        targetFilter = 520;
        targetGain = 0.035;
        rootMidi = 50; // D3
        fifthMidi = 57; // A3
      } else if (time >= 33.8 && time < 40.4) {
        // Escena 7: Invernadero y Riego (Sol mayor luminoso)
        targetFilter = 750;
        targetGain = 0.042;
        rootMidi = 43; // G2
        fifthMidi = 50; // D3
      } else if (time >= 40.4 && time < 46.8) {
        // Escena 8: Bioinformática (La menor 11)
        targetFilter = 620;
        targetGain = 0.038;
        rootMidi = 45; // A2
        fifthMidi = 52; // E3
      }

      ambientPadOsc1.frequency.setTargetAtTime(mtof(rootMidi), now, 0.12);
      ambientPadOsc2.frequency.setTargetAtTime(mtof(fifthMidi) + 0.8, now, 0.12);
      ambientPadFilter.frequency.setTargetAtTime(targetFilter, now, 0.1);
      ambientPadGain.gain.setTargetAtTime(targetGain, now, 0.1);
    }

    // 2. Disparar eventos melódicos y efectos sincronizados al paso actual de la línea de tiempo
    const currentStep = Math.floor(time / STEP_DURATION);
    if (currentStep !== lastStepIndex) {
      // Evitar ráfagas si el usuario arrastró la barra de tiempo manualmente
      if (Math.abs(time - lastTime) < 0.5 || currentStep === 0) {
        triggerStepEvents(currentStep, time);
      }
      lastStepIndex = currentStep;
    }
    lastTime = time;
  }

  /**
   * Desbloquea e inicia el AudioContext tras la primera interacción del usuario
   */
  function unlockAndStart() {
    initAudioGraph();
    if (!audioCtx) return false;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    isUnlocked = true;
    return !isMuted;
  }

  function toggleMute() {
    if (!isUnlocked) {
      unlockAndStart();
      isMuted = false;
    } else {
      isMuted = !isMuted;
    }

    if (masterGain && audioCtx) {
      masterGain.gain.setTargetAtTime(isMuted ? 0.0 : 0.38, audioCtx.currentTime, 0.04);
    }
    return !isMuted;
  }

  function getStatus() {
    return {
      isUnlocked,
      isMuted,
      isActive: isUnlocked && !isMuted
    };
  }

  ns.AudioEngine = {
    update,
    unlockAndStart,
    toggleMute,
    getStatus
  };
})(window.MicroCosmos);
