/**
 * Text-to-Speech Narration System — Azure Cognitive Services
 *
 * Uses Azure Speech Service Neural voices to read story dialogue
 * and instructions aloud with natural, expressive voices.
 *
 * Swahili voices: sw-KE-ZuriNeural (female), sw-KE-RafikiNeural (male)
 * English voices: en-US-AnaNeural (child), en-US-GuyNeural (male)
 *
 * Falls back to the browser's built-in Web Speech API when Azure
 * credentials are not configured.
 *
 * Environment variables (set in .env.local):
 *   NEXT_PUBLIC_AZURE_SPEECH_KEY    — Azure Speech resource key
 *   NEXT_PUBLIC_AZURE_SPEECH_REGION — e.g. "eastus"
 */

import { Dialogue } from './types';

// ─── Azure voice mapping per speaker + locale ────────────────────

interface AzureVoiceProfile {
  /** Full Azure voice name */
  voice: string;
  /** SSML prosody rate (e.g. "-5%", "+10%") */
  rate: string;
  /** SSML prosody pitch (e.g. "+15%", "-10%") */
  pitch: string;
  /** Speaking style — only some voices support this (e.g. en-US-AriaNeural) */
  style?: string;
}

/**
 * Maps each speaker + locale to a specific Azure Neural voice.
 *
 * Swahili (sw):
 *   narrator  → sw-KE-ZuriNeural   (female, warm)
 *   kito      → sw-KE-RafikiNeural  (male, friendly — pitched up for young voice)
 *   mzee_byte → sw-KE-RafikiNeural  (male, slowed down for the wise elder)
 *   shida     → sw-KE-ZuriNeural    (female, deep pitch for menacing villain)
 *
 * English (en):
 *   narrator  → en-US-JennyNeural   (female, warm narrator)
 *   kito      → en-US-AnaNeural     (child voice!)
 *   mzee_byte → en-US-GuyNeural     (male, deep elder)
 *   shida     → en-US-AriaNeural    (expressive, whispering style — evil & menacing)
 */
const AZURE_VOICES: Record<string, Record<Dialogue['speaker'], AzureVoiceProfile>> = {
  sw: {
    narrator:  { voice: 'sw-KE-ZuriNeural',   rate: '-5%',  pitch: '+0%'  },
    kito:      { voice: 'sw-KE-RafikiNeural',  rate: '+0%',  pitch: '+15%' },
    mzee_byte: { voice: 'sw-KE-RafikiNeural',  rate: '-15%', pitch: '-10%' },
    shida:     { voice: 'sw-KE-ZuriNeural',    rate: '+5%',  pitch: '-20%' },
  },
  en: {
    narrator:  { voice: 'en-US-JennyNeural',   rate: '-5%',  pitch: '+0%'  },
    kito:      { voice: 'en-US-AnaNeural',      rate: '+0%',  pitch: '+0%'  },
    mzee_byte: { voice: 'en-US-GuyNeural',      rate: '-15%', pitch: '-10%' },
    shida:     { voice: 'en-US-AriaNeural',      rate: '+5%',  pitch: '-15%', style: 'whispering' },
  },
};

// ─── Browser fallback voice profiles ─────────────────────────────

interface BrowserVoiceProfile {
  pitch: number;
  rate: number;
  volume: number;
}

const BROWSER_VOICE_PROFILES: Record<Dialogue['speaker'], BrowserVoiceProfile> = {
  narrator:  { pitch: 1.0, rate: 0.95, volume: 1.0 },
  kito:      { pitch: 1.25, rate: 1.0, volume: 1.0 },
  mzee_byte: { pitch: 0.8, rate: 0.85, volume: 1.0 },
  shida:     { pitch: 0.55, rate: 0.95, volume: 0.9 },
};

// ─── State ───────────────────────────────────────────────────────

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentAudioBuffer: AudioBuffer | null = null;
let pauseOffset = 0;
let startTime = 0;
let isCurrentlyPlaying = false;
let onEndCallback: (() => void) | null = null;

// Browser fallback state
let browserUtterance: SpeechSynthesisUtterance | null = null;

// ─── Config ──────────────────────────────────────────────────────

function getAzureConfig() {
  const key = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
  const region = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '';
  return { key, region, isConfigured: key.length > 0 && region.length > 0 };
}

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// ─── Helpers ─────────────────────────────────────────────────────

/** Clean text for TTS — strip emojis and special characters */
function cleanTextForTTS(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[\u{200D}]/gu, '')
    .replace(/[\u{1FA00}-\u{1FAFF}]/gu, '')
    .replace(/[📖🐢🧙👾💡🔒🔓✅⭐🎉🚀➡️]/gu, '')
    .trim();
}

/** Build SSML for Azure TTS */
function buildSSML(text: string, speaker: Dialogue['speaker'], lang: string): string {
  const langKey = lang.startsWith('en') ? 'en' : 'sw';
  const voices = AZURE_VOICES[langKey] || AZURE_VOICES.sw;
  const profile = voices[speaker];

  const styleOpen = profile.style
    ? `<mstts:express-as style="${profile.style}">`
    : '';
  const styleClose = profile.style ? '</mstts:express-as>' : '';

  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
    xmlns:mstts="https://www.w3.org/2001/mstts"
    xml:lang="${langKey === 'sw' ? 'sw-KE' : 'en-US'}">
  <voice name="${profile.voice}">
    ${styleOpen}
    <prosody rate="${profile.rate}" pitch="${profile.pitch}">
      ${escapeXml(text)}
    </prosody>
    ${styleClose}
  </voice>
</speak>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── Azure TTS ───────────────────────────────────────────────────

/**
 * Synthesize speech using Azure Cognitive Services REST API.
 * Returns an AudioBuffer ready for playback.
 */
async function synthesizeAzure(
  text: string,
  speaker: Dialogue['speaker'],
  lang: string
): Promise<AudioBuffer> {
  const { key, region } = getAzureConfig();
  const ssml = buildSSML(text, speaker, lang);

  const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'JamboScript-Docs',
    },
    body: ssml,
  });

  if (!response.ok) {
    throw new Error(`Azure TTS failed: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const ctx = getAudioContext();
  return await ctx.decodeAudioData(arrayBuffer);
}

/** Play an AudioBuffer through Web Audio API */
function playAudioBuffer(buffer: AudioBuffer, onEnd?: () => void): void {
  const ctx = getAudioContext();

  // Resume context if suspended (autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);

  source.onended = () => {
    isCurrentlyPlaying = false;
    currentSource = null;
    currentAudioBuffer = null;
    pauseOffset = 0;
    onEnd?.();
    onEndCallback?.();
    onEndCallback = null;
  };

  currentSource = source;
  currentAudioBuffer = buffer;
  pauseOffset = 0;
  startTime = ctx.currentTime;
  isCurrentlyPlaying = true;

  source.start(0);
}

// ─── Browser Fallback (Web Speech API) ───────────────────────────

function speakBrowser(
  text: string,
  speaker: Dialogue['speaker'],
  lang: string,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const profile = BROWSER_VOICE_PROFILES[speaker];
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = lang === 'sw' ? 'sw-KE' : 'en-US';
  utterance.pitch = profile.pitch;
  utterance.rate = profile.rate;
  utterance.volume = profile.volume;

  // Try to pick a matching voice
  const voices = window.speechSynthesis.getVoices();
  const prefix = lang.slice(0, 2).toLowerCase();
  const match = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
  if (match) {
    utterance.voice = match;
    utterance.lang = match.lang;
  }

  utterance.onend = () => {
    browserUtterance = null;
    isCurrentlyPlaying = false;
    onEnd?.();
    onEndCallback?.();
    onEndCallback = null;
  };

  utterance.onerror = () => {
    browserUtterance = null;
    isCurrentlyPlaying = false;
    onEndCallback = null;
  };

  browserUtterance = utterance;
  isCurrentlyPlaying = true;
  window.speechSynthesis.speak(utterance);
}

function stopBrowser(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  browserUtterance = null;
  isCurrentlyPlaying = false;
  onEndCallback = null;
}

// ─── Public API ──────────────────────────────────────────────────

/** Check if any form of TTS is available */
export function isTTSSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const { isConfigured } = getAzureConfig();
  return isConfigured || 'speechSynthesis' in window;
}

/** Whether Azure TTS is the active backend */
export function isAzureTTS(): boolean {
  return getAzureConfig().isConfigured;
}

/**
 * Pre-load voices (browser fallback only). For Azure, this is a no-op.
 */
export function preloadVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (getAzureConfig().isConfigured) {
      resolve();
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
      return;
    }
    window.speechSynthesis.addEventListener('voiceschanged', () => resolve(), { once: true });
  });
}

/**
 * Speak a piece of text.
 *
 * Uses Azure TTS Neural voices when configured, otherwise falls
 * back to the browser's built-in Web Speech API.
 *
 * @param text     The text to read aloud
 * @param speaker  Which character is talking (affects voice selection)
 * @param lang     Locale for voice selection ('sw' | 'en')
 * @param onEnd    Optional callback when speech finishes
 */
export async function speak(
  text: string,
  speaker: Dialogue['speaker'] = 'narrator',
  lang: string = 'sw',
  onEnd?: () => void
): Promise<void> {
  // Stop anything currently playing
  stop();

  const cleanText = cleanTextForTTS(text);
  if (!cleanText) return;

  onEndCallback = onEnd || null;

  const { isConfigured } = getAzureConfig();

  if (isConfigured) {
    try {
      const buffer = await synthesizeAzure(cleanText, speaker, lang);
      // Check we haven't been stopped while waiting for the network
      playAudioBuffer(buffer, onEnd);
    } catch (error) {
      console.warn('Azure TTS failed, falling back to browser:', error);
      speakBrowser(cleanText, speaker, lang, onEnd);
    }
  } else {
    speakBrowser(cleanText, speaker, lang, onEnd);
  }
}

/** Stop current narration immediately */
export function stop(): void {
  // Stop Azure audio playback
  if (currentSource) {
    try {
      currentSource.stop();
    } catch {
      // Already stopped
    }
    currentSource = null;
    currentAudioBuffer = null;
    pauseOffset = 0;
    isCurrentlyPlaying = false;
  }

  // Stop browser TTS
  stopBrowser();
}

/** Pause narration */
export function pause(): void {
  if (currentSource && isCurrentlyPlaying) {
    const ctx = getAudioContext();
    pauseOffset += ctx.currentTime - startTime;
    currentSource.stop();
    currentSource = null;
    isCurrentlyPlaying = false;
  } else if (browserUtterance) {
    window.speechSynthesis.pause();
  }
}

/** Resume narration after pause */
export function resume(): void {
  if (currentAudioBuffer && !isCurrentlyPlaying && pauseOffset > 0) {
    const ctx = getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = currentAudioBuffer;
    source.connect(ctx.destination);

    source.onended = () => {
      isCurrentlyPlaying = false;
      currentSource = null;
      currentAudioBuffer = null;
      pauseOffset = 0;
      onEndCallback?.();
      onEndCallback = null;
    };

    currentSource = source;
    startTime = ctx.currentTime;
    isCurrentlyPlaying = true;
    source.start(0, pauseOffset);
  } else if (browserUtterance) {
    window.speechSynthesis.resume();
  }
}

/** Is the system currently speaking? */
export function isSpeaking(): boolean {
  if (isCurrentlyPlaying) return true;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

/** Is the system paused? */
export function isPaused(): boolean {
  if (currentAudioBuffer && !isCurrentlyPlaying && pauseOffset > 0) return true;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.paused;
  }
  return false;
}
