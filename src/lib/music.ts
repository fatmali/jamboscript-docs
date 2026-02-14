/**
 * Background Music System — Procedural African Music
 *
 * Generates lively, rhythmic background music using the Web Audio API.
 * No audio files needed — everything is synthesised in real-time.
 *
 * Musical approach:
 *   - East African / Afro-beat rhythmic patterns (6/8 polyrhythm)
 *   - Nyatiti / kalimba-like plucked tones with bright harmonics
 *   - Djembe-style bass, slap & tone drum patterns
 *   - Call-and-response melodic phrasing
 *   - Pentatonic scales common in Swahili-coast music
 *   - Syncopated shekere / shaker patterns
 *   - Warm thumb-piano bass line
 *
 * Scene-specific moods keep it contextual for the adventure.
 * Volume kept child-friendly but rhythmically engaging.
 */

// ─── Types ───────────────────────────────────────────────────────

type SceneType =
  | 'village'
  | 'forest'
  | 'bridge'
  | 'mountain'
  | 'cave'
  | 'waterfall'
  | 'garden'
  | 'market'
  | 'library'
  | 'celebration';

interface SceneMood {
  bpm: number;
  root: number;
  scale: number[];
  volume: number;
  swing: number;
  drumPattern: number[];
  shakerPattern: number[];
  bassLine: boolean;
  melodyDensity: number;
  melodyCall: boolean;
  padDrone: boolean;
}

// ─── Scene Moods ─────────────────────────────────────────────────

const SCENE_MOODS: Record<SceneType, SceneMood> = {
  village: {
    bpm: 105,
    root: 262,
    scale: [0, 2, 4, 7, 9],
    volume: 0.14,
    swing: 0.15,
    drumPattern: [1, 0, 0, 2, 0, 0, 3, 0, 1, 0, 2, 0],
    shakerPattern: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    bassLine: true,
    melodyDensity: 0.5,
    melodyCall: true,
    padDrone: false,
  },
  forest: {
    bpm: 82,
    root: 220,
    scale: [0, 3, 5, 7, 10],
    volume: 0.11,
    swing: 0.2,
    drumPattern: [1, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 2],
    shakerPattern: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    bassLine: true,
    melodyDensity: 0.3,
    melodyCall: false,
    padDrone: true,
  },
  bridge: {
    bpm: 96,
    root: 247,
    scale: [0, 2, 4, 7, 9],
    volume: 0.12,
    swing: 0.1,
    drumPattern: [1, 0, 0, 2, 0, 3, 0, 0, 1, 0, 2, 0],
    shakerPattern: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    bassLine: true,
    melodyDensity: 0.4,
    melodyCall: true,
    padDrone: false,
  },
  mountain: {
    bpm: 72,
    root: 196,
    scale: [0, 2, 5, 7, 9],
    volume: 0.1,
    swing: 0.2,
    drumPattern: [1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2],
    shakerPattern: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
    bassLine: false,
    melodyDensity: 0.2,
    melodyCall: false,
    padDrone: true,
  },
  cave: {
    bpm: 66,
    root: 175,
    scale: [0, 3, 5, 7, 10],
    volume: 0.09,
    swing: 0.25,
    drumPattern: [1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
    shakerPattern: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    bassLine: false,
    melodyDensity: 0.15,
    melodyCall: false,
    padDrone: true,
  },
  waterfall: {
    bpm: 90,
    root: 294,
    scale: [0, 2, 4, 7, 9],
    volume: 0.11,
    swing: 0.15,
    drumPattern: [1, 0, 3, 0, 2, 0, 3, 0, 1, 0, 2, 3],
    shakerPattern: [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    bassLine: true,
    melodyDensity: 0.35,
    melodyCall: true,
    padDrone: false,
  },
  garden: {
    bpm: 100,
    root: 330,
    scale: [0, 2, 4, 7, 9],
    volume: 0.12,
    swing: 0.1,
    drumPattern: [1, 0, 0, 2, 0, 3, 1, 0, 0, 2, 0, 3],
    shakerPattern: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    bassLine: true,
    melodyDensity: 0.45,
    melodyCall: true,
    padDrone: false,
  },
  market: {
    bpm: 118,
    root: 262,
    scale: [0, 2, 4, 7, 9],
    volume: 0.14,
    swing: 0.1,
    drumPattern: [1, 0, 2, 0, 3, 0, 1, 2, 0, 3, 0, 2],
    shakerPattern: [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    bassLine: true,
    melodyDensity: 0.55,
    melodyCall: true,
    padDrone: false,
  },
  library: {
    bpm: 70,
    root: 247,
    scale: [0, 4, 7, 9, 12],
    volume: 0.08,
    swing: 0.2,
    drumPattern: [1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
    shakerPattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    bassLine: false,
    melodyDensity: 0.2,
    melodyCall: false,
    padDrone: true,
  },
  celebration: {
    bpm: 128,
    root: 294,
    scale: [0, 2, 4, 7, 9],
    volume: 0.16,
    swing: 0.08,
    drumPattern: [1, 3, 2, 3, 1, 2, 1, 3, 2, 3, 1, 2],
    shakerPattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    bassLine: true,
    melodyDensity: 0.65,
    melodyCall: true,
    padDrone: false,
  },
};

// ─── State ───────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let drumInterval: ReturnType<typeof setInterval> | null = null;
let melodyInterval: ReturnType<typeof setInterval> | null = null;
let bassInterval: ReturnType<typeof setInterval> | null = null;
let padOsc1: OscillatorNode | null = null;
let padOsc2: OscillatorNode | null = null;
let padGain: GainNode | null = null;
let currentScene: SceneType | null = null;
let isPlaying = false;

// ─── Helpers ─────────────────────────────────────────────────────

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function semitonesToFreq(root: number, semitones: number): number {
  return root * Math.pow(2, semitones / 12);
}

function rand(): number {
  return Math.random();
}

// ─── Djembe-style drum synthesis ─────────────────────────────────

/**
 * Synthesise a djembe hit.
 *  type 1 = bass (low, boomy)
 *  type 2 = slap (mid, sharp attack)
 *  type 3 = tone (mid-high, clear ring)
 */
function playDrum(type: number, volume: number) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.connect(masterGain!);

    if (type === 1) {
      // Bass — low pitch sweep down, boomy
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
      gain.gain.setValueAtTime(volume * 1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.4);

      // Click transient for body
      const click = ctx.createOscillator();
      click.type = 'square';
      click.frequency.setValueAtTime(80, now);
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(volume * 0.3, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      click.connect(clickGain);
      clickGain.connect(masterGain!);
      click.start(now);
      click.stop(now + 0.04);
    } else if (type === 2) {
      // Slap — mid pitch, very sharp, short
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350 + rand() * 50, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);
      gain.gain.setValueAtTime(volume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.1);

      // Noise burst for slap character
      const bufSize = Math.floor(ctx.sampleRate * 0.02);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (rand() * 2 - 1) * (1 - i / bufSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(volume * 0.5, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      filter.Q.value = 2;
      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(masterGain!);
      noise.start(now);
      noise.stop(now + 0.04);
    } else {
      // Tone — mid ring, the "singing" hit
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220 + rand() * 30, now);
      gain.gain.setValueAtTime(volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.3);

      // Overtone for wood character
      const over = ctx.createOscillator();
      over.type = 'sine';
      over.frequency.setValueAtTime(440 + rand() * 50, now);
      const overGain = ctx.createGain();
      overGain.gain.setValueAtTime(volume * 0.15, now);
      overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      over.connect(overGain);
      overGain.connect(masterGain!);
      over.start(now);
      over.stop(now + 0.15);
    }
  } catch {
    // Audio not available
  }
}

// ─── Shekere / shaker with African rhythm ────────────────────────

function playShaker(volume: number, accent: boolean) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const duration = accent ? 0.06 : 0.035;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (rand() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.7);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 7000 + rand() * 3000;
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    const hitVol = accent ? volume * 0.5 : volume * 0.25;
    gain.gain.setValueAtTime(hitVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain!);

    noise.start(now);
    noise.stop(now + duration + 0.01);
  } catch {
    // Audio not available
  }
}

// ─── Nyatiti / Kalimba plucked melody tone ───────────────────────

function playKalimba(freq: number, volume: number) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Fundamental
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Strong 2nd harmonic — bright tine character
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(volume * 0.25, now);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    // 3rd harmonic — metallic ring
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);
    const g3 = ctx.createGain();
    g3.gain.setValueAtTime(volume * 0.1, now);
    g3.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    // Envelope — sharp pluck attack, ringing sustain
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(volume, now + 0.003);
    envelope.gain.setValueAtTime(volume * 0.85, now + 0.01);
    envelope.gain.exponentialRampToValueAtTime(volume * 0.3, now + 0.3);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(envelope);
    osc2.connect(g2);
    g2.connect(envelope);
    osc3.connect(g3);
    g3.connect(envelope);
    envelope.connect(masterGain!);

    osc.start(now);
    osc2.start(now);
    osc3.start(now);
    osc.stop(now + 1.3);
    osc2.stop(now + 0.5);
    osc3.stop(now + 0.25);
  } catch {
    // Audio not available
  }
}

// ─── Thumb-piano bass line ───────────────────────────────────────

function playBass(freq: number, volume: number) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Sub-bass warmth
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(freq / 2, now);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(volume * 0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(volume, now + 0.008);
    envelope.gain.exponentialRampToValueAtTime(volume * 0.5, now + 0.15);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(envelope);
    sub.connect(subGain);
    subGain.connect(envelope);
    envelope.connect(masterGain!);

    osc.start(now);
    sub.start(now);
    osc.stop(now + 0.7);
    sub.stop(now + 0.6);
  } catch {
    // Audio not available
  }
}

// ─── Low drone (for quiet scenes only) ───────────────────────────

function startDrone(mood: SceneMood) {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0, now);
    padGain.gain.linearRampToValueAtTime(mood.volume * 0.2, now + 4);
    padGain.connect(masterGain!);

    // Root + fifth — open African drone
    padOsc1 = ctx.createOscillator();
    padOsc1.type = 'sine';
    padOsc1.frequency.setValueAtTime(mood.root / 2, now);

    padOsc2 = ctx.createOscillator();
    padOsc2.type = 'sine';
    padOsc2.frequency.setValueAtTime(semitonesToFreq(mood.root / 2, 7), now);

    padOsc1.connect(padGain);
    padOsc2.connect(padGain);

    padOsc1.start(now);
    padOsc2.start(now);
  } catch {
    // Audio not available
  }
}

function stopDrone() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    if (padGain) {
      padGain.gain.linearRampToValueAtTime(0, now + 2);
    }
    setTimeout(() => {
      padOsc1?.stop();
      padOsc2?.stop();
      padOsc1 = null;
      padOsc2 = null;
      padGain = null;
    }, 2200);
  } catch {
    padOsc1 = null;
    padOsc2 = null;
    padGain = null;
  }
}

// ─── Drum + Shaker sequencer (6/8 feel) ──────────────────────────

function startDrumLoop(mood: SceneMood) {
  const subdivMs = (60 / mood.bpm / 3) * 1000; // 12 subdivisions per bar
  let step = 0;

  drumInterval = setInterval(() => {
    const swingDelay = step % 2 === 1 ? mood.swing * subdivMs * 0.5 : 0;

    setTimeout(() => {
      // Drums
      const drumHit = mood.drumPattern[step % 12];
      if (drumHit > 0) {
        playDrum(drumHit, mood.volume);
      }

      // Shaker
      const shakerHit = mood.shakerPattern[step % 12];
      if (shakerHit) {
        const accent = step % 3 === 0;
        playShaker(mood.volume, accent);
      }
    }, swingDelay);

    step = (step + 1) % 12;
  }, subdivMs);
}

function stopDrumLoop() {
  if (drumInterval) {
    clearInterval(drumInterval);
    drumInterval = null;
  }
}

// ─── Melody sequencer — African call-and-response ────────────────

function startMelody(mood: SceneMood) {
  const beatMs = (60 / mood.bpm) * 1000;
  let phraseStep = 0;
  const phraseLength = 8;
  let lastNote = 0;

  melodyInterval = setInterval(() => {
    phraseStep = (phraseStep + 1) % phraseLength;

    // Call in first 4 beats, response in last 4
    const isCall = phraseStep < 4;
    const density = mood.melodyCall
      ? isCall
        ? mood.melodyDensity * 1.2
        : mood.melodyDensity * 0.6
      : mood.melodyDensity;

    if (rand() < density) {
      // Prefer stepwise motion — more melodic / African
      const direction = rand() > 0.5 ? 1 : -1;
      const leap = rand() > 0.7 ? 2 : 1;
      lastNote = Math.max(0, Math.min(mood.scale.length - 1, lastNote + direction * leap));
      const semitone = mood.scale[lastNote];

      const octaveShift = rand() > 0.8 ? 12 : 0;
      const responseShift = !isCall && mood.melodyCall && rand() > 0.5 ? -12 : 0;

      const freq = semitonesToFreq(mood.root, semitone + octaveShift + responseShift);
      const vel = mood.volume * (0.5 + rand() * 0.5) * (isCall ? 1.0 : 0.75);
      playKalimba(freq, vel);
    }
  }, beatMs);
}

function stopMelody() {
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
}

// ─── Bass line sequencer ─────────────────────────────────────────

function startBassLine(mood: SceneMood) {
  if (!mood.bassLine) return;

  const beatMs = (60 / mood.bpm) * 1000;
  const bassMs = beatMs * 2; // half-note feel
  let bassStep = 0;
  const bassPattern = [0, 3, 4, 2]; // I–IV–V–II walking pattern

  bassInterval = setInterval(() => {
    const scaleIdx = bassPattern[bassStep % bassPattern.length];
    const semitone = mood.scale[scaleIdx % mood.scale.length];
    const freq = semitonesToFreq(mood.root / 2, semitone);
    playBass(freq, mood.volume * 0.7);
    bassStep++;
  }, bassMs);
}

function stopBassLine() {
  if (bassInterval) {
    clearInterval(bassInterval);
    bassInterval = null;
  }
}

// ─── Public API ──────────────────────────────────────────────────

/**
 * Start background music for the given scene.
 * If music is already playing for a different scene, crossfades.
 */
export function startMusic(scene: SceneType = 'village'): void {
  if (typeof window === 'undefined') return;

  const mood = SCENE_MOODS[scene] || SCENE_MOODS.village;

  if (isPlaying && currentScene === scene) return;

  if (isPlaying) {
    stopMusicInternal();
  }

  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
  masterGain.connect(ctx.destination);

  currentScene = scene;
  isPlaying = true;

  // Drums set the groove immediately
  startDrumLoop(mood);

  // Drone for quiet scenes
  if (mood.padDrone) {
    startDrone(mood);
  }

  // Bass enters after 2 beats
  const beatMs = (60 / mood.bpm) * 1000;
  setTimeout(() => {
    if (isPlaying) startBassLine(mood);
  }, beatMs * 2);

  // Melody enters after 4 beats — lets the groove establish
  setTimeout(() => {
    if (isPlaying) startMelody(mood);
  }, beatMs * 4);
}

/** Internal stop without state reset (for scene transitions) */
function stopMusicInternal(): void {
  stopMelody();
  stopDrumLoop();
  stopBassLine();
  stopDrone();

  if (masterGain) {
    try {
      const ctx = getCtx();
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      const oldGain = masterGain;
      setTimeout(() => {
        oldGain.disconnect();
      }, 1800);
    } catch {
      // ignore
    }
    masterGain = null;
  }
}

/**
 * Stop background music with a gentle fade-out.
 */
export function stopMusic(): void {
  if (!isPlaying) return;
  stopMusicInternal();
  isPlaying = false;
  currentScene = null;
}

/**
 * Change the scene mood while music continues playing.
 * Does a crossfade by stopping and restarting.
 */
export function changeScene(scene: SceneType): void {
  if (!isPlaying) return;
  if (scene === currentScene) return;
  startMusic(scene);
}

/** Whether background music is currently playing */
export function isMusicPlaying(): boolean {
  return isPlaying;
}

/** Get the current scene */
export function getCurrentScene(): SceneType | null {
  return currentScene;
}
