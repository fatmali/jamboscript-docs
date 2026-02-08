/**
 * Sound System
 * Minimal, event-based sounds that confirm thinking
 */

type SoundType = 
  | 'run'           // Code run: soft tap
  | 'success'       // Correct logic: gentle chime
  | 'error'         // Incorrect logic: low drum thud
  | 'step'          // Bridge step: wooden footstep
  | 'loopComplete'  // Loop exit condition met: deep ngoma drum
  | 'complete';     // Chapter completion: short melodic phrase

// Web Audio API context (created on first interaction)
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * Creates a simple oscillator-based sound
 */
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Fade in and out for smoothness
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    // Silently fail if audio isn't available
    console.warn('Audio not available:', error);
  }
}

/**
 * Creates a noise-based percussion sound
 */
function playNoise(duration: number, lowpass: number, volume: number = 0.2) {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = lowpass;
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Audio not available:', error);
  }
}

/**
 * Play a sound effect
 */
export function playSound(sound: SoundType) {
  switch (sound) {
    case 'run':
      // Soft tap - high, quick
      playTone(800, 0.08, 'sine', 0.15);
      break;
      
    case 'success':
      // Gentle chime - ascending notes
      playTone(523, 0.15, 'sine', 0.2); // C5
      setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 100); // E5
      setTimeout(() => playTone(784, 0.2, 'sine', 0.25), 200); // G5
      break;
      
    case 'error':
      // Low drum thud - non-threatening
      playNoise(0.15, 200, 0.3);
      playTone(80, 0.2, 'triangle', 0.25);
      break;
      
    case 'step':
      // Wooden footstep
      playNoise(0.05, 400, 0.15);
      playTone(150, 0.05, 'triangle', 0.1);
      break;
      
    case 'loopComplete':
      // Deep ngoma drum
      playTone(60, 0.4, 'triangle', 0.35);
      playNoise(0.1, 150, 0.25);
      setTimeout(() => {
        playTone(55, 0.3, 'triangle', 0.3);
      }, 150);
      break;
      
    case 'complete':
      // Short melodic phrase - pentatonic
      const notes = [523, 587, 659, 784, 880]; // C5, D5, E5, G5, A5
      notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'sine', 0.25), i * 120);
      });
      // Final chord
      setTimeout(() => {
        playTone(523, 0.5, 'sine', 0.2);
        playTone(659, 0.5, 'sine', 0.15);
        playTone(784, 0.5, 'sine', 0.15);
      }, 600);
      break;
  }
}

/**
 * Initialize audio context (must be called from user interaction)
 */
export function initAudio() {
  getAudioContext();
}
