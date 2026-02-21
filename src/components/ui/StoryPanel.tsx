'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterData, Dialogue } from '@/lib/types';
import { useGameStore, useStoreHydrated } from '@/lib/store';
import { useTranslations } from 'next-intl';
import KitoCharacter from '@/components/characters/KitoCharacter';
import MzeeByteCharacter from '@/components/characters/MzeeByteCharacter';
import ShidaCharacter from '@/components/characters/ShidaCharacter';
import NarrationButton from '@/components/ui/NarrationButton';
import { speak, stop, preloadVoices } from '@/lib/narration';
import { ChevronRight, PlayIcon } from 'lucide-react';

/** Hook to get the chapter text translator */
function useChapterText() {
  return useTranslations('Chapters');
}

interface StoryPanelProps {
  chapter: ChapterData;
  onDialogueComplete?: () => void;
  solved?: boolean;
}

function SpeakerBadge({ speaker }: { speaker: Dialogue['speaker'] }) {
  const t = useTranslations('Speakers');
  const config = {
    kito: { color: 'bg-secondary/20 text-secondary', emoji: '🐢' },
    mzee_byte: { color: 'bg-accent/20 text-accent', emoji: '🧙' },
    shida: { color: 'bg-error/20 text-error', emoji: '👾' },
    narrator: { color: 'bg-text-muted/20 text-text-secondary', emoji: '📖' },
  };
  const c = config[speaker];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${c.color}`}>
      <span>{c.emoji}</span>
      {t(speaker)}
    </span>
  );
}

/** Simple inline syntax highlighter for JamboScript code examples */
function highlightJamboLine(line: string): React.ReactNode {
  const keywords = [
    'acha', 'thabiti', 'kweli', 'sivyo', 'tupu',
    'kama', 'la sivyo', 'chagua', 'hali', 'kawaida',
    'wakati', 'rudia', 'vunja', 'endelea',
    'kazi', 'rudisha', 'andika',
  ];
  const operators = ['ni', 'chini', 'zaidi', 'mpaka', 'angalau', 'na', 'au', 'si'];

  // Build a regex that matches strings, keywords, operators, numbers, and comments
  const parts: React.ReactNode[] = [];
  // Split by strings first
  const stringRegex = /("(?:[^"\\]|\\.)*")/g;
  const segments = line.split(stringRegex);

  segments.forEach((segment, segIdx) => {
    // String literal
    if (segment.startsWith('"') && segment.endsWith('"')) {
      parts.push(
        <span key={segIdx} className="text-emerald-400">{segment}</span>
      );
      return;
    }

    // Comment
    if (segment.trimStart().startsWith('#')) {
      parts.push(
        <span key={segIdx} className="text-text-muted italic">{segment}</span>
      );
      return;
    }

    // Tokenize the non-string segment for keywords, operators, numbers
    const allTokens = [...keywords, ...operators].sort((a, b) => b.length - a.length);
    const tokenPattern = allTokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(\\b(?:${tokenPattern})\\b|\\d+(?:\\.\\d+)?)`, 'g');
    const subParts = segment.split(regex);

    subParts.forEach((part, partIdx) => {
      if (keywords.includes(part)) {
        parts.push(
          <span key={`${segIdx}-${partIdx}`} className="text-secondary font-bold">{part}</span>
        );
      } else if (operators.includes(part)) {
        parts.push(
          <span key={`${segIdx}-${partIdx}`} className="text-accent font-semibold">{part}</span>
        );
      } else if (/^\d+(\.\d+)?$/.test(part)) {
        parts.push(
          <span key={`${segIdx}-${partIdx}`} className="text-sky-400">{part}</span>
        );
      } else {
        parts.push(
          <span key={`${segIdx}-${partIdx}`} className="text-text-primary">{part}</span>
        );
      }
    });
  });

  return <>{parts}</>;
}

// ─── Chapter-Specific Scene Illustrations ─────────────────────────
// Each scene is simplified to ~3-5 animated elements for performance.
// Bold flat shapes, rounded forms, warm palettes — Blush/Kurzgesagt inspired.

const sceneTransition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const };

function GateScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="doorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="280" height="160" fill="url(#sky)" rx="8" />

      {/* Stars — static, clean */}
      {[20, 55, 100, 165, 210, 250].map((x, i) => (
        <circle key={i} cx={x} cy={10 + (i % 3) * 8} r="1" fill="white" opacity={0.3 + (i % 3) * 0.2} />
      ))}

      {/* Ground */}
      <rect x="0" y="130" width="280" height="30" fill="#2D1F1F" rx="4" />

      {/* Stone walls */}
      <rect x="30" y="35" width="35" height="100" fill="#5C5C5C" rx="4" />
      <rect x="215" y="35" width="35" height="100" fill="#5C5C5C" rx="4" />

      {/* Stone brick lines */}
      {[50, 70, 90, 110].map((y, i) => (
        <g key={i}>
          <line x1="32" y1={y} x2="63" y2={y} stroke="#4A4A4A" strokeWidth="1" opacity="0.4" />
          <line x1="217" y1={y} x2="248" y2={y} stroke="#4A4A4A" strokeWidth="1" opacity="0.4" />
        </g>
      ))}

      {/* Torches — simplified: just a warm glow circle + flame */}
      {[47, 233].map((cx, i) => (
        <g key={`torch-${i}`}>
          <rect x={cx - 2} y="55" width="4" height="14" rx="1" fill="#5D4037" />
          <motion.circle cx={cx} cy="52" r="6" fill="#FF8F00" opacity="0.3"
            animate={{ r: [5, 7, 5], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
          <ellipse cx={cx} cy="52" rx="2" ry="4" fill="#FFCA28" />
        </g>
      ))}

      {/* Arch */}
      <path d="M65 55 Q140 5 215 55" fill="#5C5C5C" stroke="#4A4A4A" strokeWidth="2" />
      <path d="M70 55 Q140 12 210 55" fill="url(#sky)" />

      {/* Keystone */}
      <polygon points="135,12 145,12 147,22 133,22" fill={solved ? '#4ADE80' : '#FACC15'} />

      {/* Light behind gate */}
      {solved && (
        <motion.rect x="68" y="55" width="144" height="78" rx="4" fill="#FACC15"
          initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 0.8 }}
        />
      )}

      {/* Doors — the main interactive element */}
      <motion.rect y="55" width="70" height="78" rx="4"
        fill="url(#doorGrad)" stroke="#3E2723" strokeWidth="2"
        animate={{ x: solved ? 30 : 68 }}
        transition={sceneTransition}
      />
      <motion.rect y="55" width="70" height="78" rx="4"
        fill="url(#doorGrad)" stroke="#3E2723" strokeWidth="2"
        animate={{ x: solved ? 190 : 142 }}
        transition={sceneTransition}
      />

      {/* Door handles */}
      <motion.circle cy="96" r="4" fill="none" stroke="#FFC107" strokeWidth="2"
        animate={{ cx: solved ? 92 : 128 }} transition={sceneTransition}
      />
      <motion.circle cy="96" r="4" fill="none" stroke="#FFC107" strokeWidth="2"
        animate={{ cx: solved ? 200 : 152 }} transition={sceneTransition}
      />

      {/* Lock / success indicator */}
      {!solved ? (
        <motion.g animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '140px 95px' }}>
          <rect x="133" y="90" width="14" height="11" rx="2" fill="#FFC107" />
          <path d="M136 90 L136 85 Q140 79 144 85 L144 90" fill="none" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      ) : (
        [0, 1, 2, 3].map(i => (
          <motion.circle key={i} cx={120 + i * 15} cy={80} r="2" fill="#FACC15"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -15] }}
            transition={{ duration: 1, delay: i * 0.15, repeat: 2 }}
          />
        ))
      )}

      {/* Label */}
      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneGateOpened') : t('sceneGateLocked')}
      </text>
    </svg>
  );
}

function GuardScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      {/* Background hut */}
      <rect x="70" y="55" width="140" height="80" rx="6" fill="#8D6E63" />
      <polygon points="140,18 50,60 230,60" fill="#5D4037" />
      {/* Window */}
      <rect x="165" y="75" width="22" height="22" rx="3" fill="#3E2723" />
      <line x1="176" y1="75" x2="176" y2="97" stroke="#5D4037" strokeWidth="1.5" />
      <line x1="165" y1="86" x2="187" y2="86" stroke="#5D4037" strokeWidth="1.5" />

      {/* Guard — simplified chibi style */}
      <g transform="translate(110, 70)">
        <rect x="8" y="25" width="34" height="42" rx="6" fill="#4527A0" />
        {/* Gold trim */}
        <rect x="10" y="60" width="30" height="3" rx="1.5" fill="#FFC107" opacity="0.5" />
        {/* Head */}
        <circle cx="25" cy="18" r="15" fill="#B8942A" stroke="#8B6914" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="19" cy="16" r="2.5" fill="white" />
        <circle cx="31" cy="16" r="2.5" fill="white" />
        <circle cx="19.5" cy="16" r="1.3" fill="#1E1B4B" />
        <circle cx="31.5" cy="16" r="1.3" fill="#1E1B4B" />
        {/* Friendly smile */}
        <path d="M20,24 Q25,28 30,24" fill="none" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
        {/* Helmet */}
        <path d="M10 14 Q12 2 25 0 Q38 2 40 14" fill="#FFC107" stroke="#E6A800" strokeWidth="1" />
        <ellipse cx="25" cy="14" rx="15.5" ry="3.5" fill="#FFC107" />
        {/* Spear */}
        <line x1="48" y1="5" x2="48" y2="65" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" />
        <polygon points="48,-2 43,8 53,8" fill="#78909C" />
      </g>

      {/* Question mark or welcome scroll */}
      <motion.g
        animate={solved ? { y: 0 } : { y: [0, -2, 0] }}
        transition={solved ? {} : { duration: 2.5, repeat: Infinity, ease: [0.37, 0, 0.63, 1] }}
      >
        {solved ? (
          <g transform="translate(80, 125)">
            <rect x="0" y="0" width="120" height="24" rx="6" fill="#FFF8E1" stroke="#D7CCC8" strokeWidth="1" />
            <circle cx="0" cy="12" r="5" fill="#D7CCC8" />
            <circle cx="120" cy="12" r="5" fill="#D7CCC8" />
            <text x="60" y="16" textAnchor="middle" fontSize="10" fill="#3E2723" fontWeight="bold">{t('sceneGuardWelcome')}</text>
          </g>
        ) : (
          <text x="140" y="132" textAnchor="middle" fontSize="24" fill="#FACC15">❓</text>
        )}
      </motion.g>

      {/* Ground */}
      <rect x="0" y="135" width="280" height="25" fill="#33691E" rx="4" />

      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneGuardSaved') : t('sceneGuardAsking')}
      </text>
    </svg>
  );
}

function ForkPathScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      {/* Sky */}
      <rect width="280" height="70" fill="#1A237E" rx="8" />
      {/* Stars */}
      {[30, 80, 140, 200, 250].map((x, i) => (
        <circle key={i} cx={x} cy={10 + (i % 3) * 15} r={1 + (i % 2) * 0.5} fill="white" opacity={0.3 + (i % 3) * 0.2} />
      ))}
      {/* Ground */}
      <rect x="0" y="70" width="280" height="90" fill="#1B5E20" rx="4" />
      {/* Main path */}
      <rect x="120" y="120" width="40" height="40" rx="6" fill="#8D6E63" />
      {/* Fork left */}
      <motion.path d="M120 120 Q70 100 30 85"
        fill="none" stroke={solved ? '#FACC15' : '#8D6E63'} strokeWidth="28" strokeLinecap="round"
        transition={{ duration: 0.6 }}
      />
      {/* Fork right */}
      <motion.path d="M160 120 Q210 100 250 85"
        fill="none" stroke={solved ? '#FACC15' : '#8D6E63'} strokeWidth="28" strokeLinecap="round"
        transition={{ duration: 0.6 }}
      />
      {/* Cave */}
      <path d="M10 88 Q25 65 40 88" fill="#3E2723" />
      <text x="25" y="84" textAnchor="middle" fontSize="14">🕳️</text>
      {/* River */}
      <text x="255" y="84" textAnchor="middle" fontSize="16">🏞️</text>
      {/* Weather */}
      <motion.text x="140" y="28" textAnchor="middle" fontSize="24"
        animate={{ y: [28, 25, 28] }} transition={{ duration: 3.5, repeat: Infinity, ease: [0.37, 0, 0.63, 1] }}
      >
        {solved ? '☀️' : '🌧️'}
      </motion.text>
      {/* Decision */}
      <text x="140" y="115" textAnchor="middle" fontSize="18">{solved ? '✅' : '🤔'}</text>

      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('scenePathChosen') : t('scenePathChoose')}
      </text>
    </svg>
  );
}

function BridgeCrossingScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      {/* Sky */}
      <defs>
        <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF8A65" />
          <stop offset="100%" stopColor="#FFF3E0" />
        </linearGradient>
      </defs>
      <rect width="280" height="70" fill="url(#sunsetSky)" rx="8" />
      {/* Water */}
      <rect x="0" y="70" width="280" height="90" fill="#1565C0" rx="4" />
      {/* Ripples — just 2 */}
      {[80, 200].map((cx, i) => (
        <motion.ellipse key={i} cx={cx} cy={105 + i * 15} rx={18} ry={2}
          fill="white" opacity="0.1"
          animate={{ rx: [16, 22, 16], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      {/* Banks */}
      <rect x="0" y="72" width="40" height="88" fill="#5D4037" rx="4" />
      <rect x="0" y="70" width="48" height="10" fill="#558B2F" rx="4" />
      <rect x="240" y="72" width="40" height="88" fill="#5D4037" rx="4" />
      <rect x="232" y="70" width="48" height="10" fill="#558B2F" rx="4" />
      {/* Posts */}
      <rect x="30" y="52" width="8" height="45" rx="2" fill="#4E342E" />
      <rect x="242" y="52" width="8" height="45" rx="2" fill="#4E342E" />
      {/* Ropes */}
      <path d="M34 56 Q140 42 246 56" fill="none" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round" />
      <path d="M34 88 Q140 98 246 88" fill="none" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round" />
      {/* Planks */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.rect key={i} x={48 + i * 33} y="80" width="26" height="6" rx="2"
          fill={solved ? '#FFC107' : '#8D6E63'}
          animate={solved ? {} : { y: [80, 81, 80] }}
          transition={solved ? { duration: 0.4, delay: i * 0.15 } : { duration: 2.5, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
      {/* Walker */}
      <motion.g animate={{ x: solved ? 210 : 20 }} transition={{ duration: 2, ease: 'easeInOut' }}>
        <circle cx="25" cy="66" r="5" fill="#FACC15" />
        <line x1="25" y1="71" x2="25" y2="80" stroke="#FACC15" strokeWidth="2" />
        <line x1="25" y1="74" x2="20" y2="78" stroke="#FACC15" strokeWidth="1.5" />
        <line x1="25" y1="74" x2="30" y2="78" stroke="#FACC15" strokeWidth="1.5" />
      </motion.g>

      <text x="140" y="120" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" opacity="0.8">
        {solved ? t('sceneBridgeStepsDone', { count: 5 }) : t('sceneBridgeSteps', { count: 0 })}
      </text>
      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneBridgeCrossed') : t('sceneBridgeCross')}
      </text>
    </svg>
  );
}

function MountainSpellScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="90" fill="#1A1A2E" rx="8" />
      {/* Stars — static */}
      {[20, 60, 105, 155, 200, 240, 265].map((x, i) => (
        <circle key={i} cx={x} cy={10 + (i % 3) * 18} r="1" fill="white" opacity={0.3 + (i % 2) * 0.3} />
      ))}
      {/* Mountain */}
      <polygon points="140,25 45,130 235,130" fill="#4E342E" />
      <polygon points="140,25 115,50 165,50" fill="#ECEFF1" opacity="0.5" />
      {/* Ground */}
      <rect x="0" y="125" width="280" height="35" fill="#2E7D32" rx="4" />

      {/* Function box */}
      <g transform="translate(80, 68)">
        <motion.rect x="0" y="0" width="120" height="50" rx="8"
          fill="#312E81" stroke={solved ? '#FACC15' : '#6366F1'} strokeWidth="2"
          animate={solved ? {} : { stroke: ['#6366F1', '#818CF8', '#6366F1'] }}
          transition={solved ? {} : { duration: 2.5, repeat: Infinity }}
        />
        <text x="60" y="18" textAnchor="middle" fontSize="8" fill="#FACC15" fontWeight="bold">kazi ponyaMti()</text>
        <text x="60" y="30" textAnchor="middle" fontSize="7" fill="#A5B4FC">andika(&quot;...&quot;)</text>
        <text x="60" y="44" textAnchor="middle" fontSize="9" fill={solved ? '#4ADE80' : '#94A3B8'}>
          {solved ? '🌳 ✨ ✅' : '🌳 → ?'}
        </text>
      </g>

      {/* Sparkles when solved */}
      {solved && [0, 1, 2, 3].map(i => (
        <motion.circle key={i} cx={100 + i * 22} cy={65} r="2" fill="#FACC15"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], y: [0, -18] }}
          transition={{ duration: 1, delay: i * 0.2, repeat: 2 }}
        />
      ))}

      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneMountainSuccess') : t('sceneMountainCreate')}
      </text>
    </svg>
  );
}

// ─── Chapter 6: Waterfall Scene (Lists) ─────────────────────────
function WaterfallScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  const fruits = ['🍎', '🍌', '🍍', '🥭', '🍊'];
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      {/* Sky */}
      <rect width="280" height="70" fill="#0D47A1" rx="8" />
      {/* Cliff left */}
      <rect x="0" y="35" width="80" height="125" fill="#5D4037" rx="4" />
      {/* Cliff right */}
      <rect x="200" y="50" width="80" height="110" fill="#5D4037" rx="4" />
      {/* Waterfall */}
      <motion.rect
        x="72" y="35" width="36" height="90" fill="#42A5F5" rx="4" opacity={0.5}
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Pool */}
      <ellipse cx="140" cy="130" rx="80" ry="14" fill="#1565C0" opacity={0.5} />
      {/* Ground */}
      <rect x="0" y="132" width="280" height="28" fill="#2E7D32" rx="4" />

      {/* Fruits — scattered or collected */}
      {fruits.map((fruit, i) => (
        <motion.text key={i}
          x={solved ? 125 + (i % 3) * 18 : 50 + i * 42} y={solved ? 110 : 118 + (i % 2) * 8}
          fontSize="13" textAnchor="middle"
          animate={solved ? { scale: [1, 1.08, 1] } : {}}
          transition={solved ? { duration: 1.2, delay: i * 0.15, ease: "easeInOut" } : {}}
        >
          {fruit}
        </motion.text>
      ))}

      {/* Basket when solved */}
      {solved && (
        <motion.text x="140" y="126" fontSize="18" textAnchor="middle"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >🧺</motion.text>
      )}

      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneWaterfallDone') : t('sceneWaterfallCollect')}
      </text>
    </svg>
  );
}

// ─── Chapter 7: Garden Scene (While Loops) ──────────────────────
function GardenScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <defs>
        <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4FC3F7" />
          <stop offset="100%" stopColor="#81D4FA" />
        </linearGradient>
      </defs>
      <rect width="280" height="70" fill="url(#gardenSky)" rx="8" />
      {/* Sun */}
      <circle cx="240" cy="28" r="18" fill="#FFD54F" />
      {/* Ground */}
      <rect x="0" y="68" width="280" height="92" fill="#4E342E" rx="4" />
      <rect x="0" y="68" width="280" height="12" fill="#33691E" rx="4" />
      {/* Garden bed */}
      <rect x="30" y="85" width="220" height="48" rx="6" fill="#3E2723" stroke="#5D4037" strokeWidth="2" />

      {/* Flowers */}
      {[55, 95, 140, 185, 225].map((x, i) => (
        <g key={i}>
          <motion.line
            x1={x} y1={solved ? 62 : 85} x2={x} y2="118"
            stroke={solved ? '#43A047' : '#8D6E63'} strokeWidth="2"
            animate={solved ? { y1: 58 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          />
          <motion.text
            x={x} y={solved ? 58 : 85} fontSize={solved ? '14' : '10'} textAnchor="middle"
            animate={solved ? { opacity: 1 } : { opacity: [0.4, 0.6, 0.4] }}
            transition={solved ? { duration: 0.5, delay: i * 0.15 } : { duration: 2.5, repeat: Infinity }}
          >
            {solved ? ['🌸', '🌺', '🌻', '🌷', '🌼'][i] : '🥀'}
          </motion.text>
        </g>
      ))}

      {/* Watering can */}
      <motion.text
        x={solved ? 250 : 55} y="66" fontSize="14" textAnchor="middle"
        animate={solved ? {} : { x: [50, 230, 50] }}
        transition={solved ? {} : { duration: 5, repeat: Infinity }}
      >🪣</motion.text>

      {/* Butterflies when solved */}
      {solved && [0, 1].map(i => (
        <motion.text key={i} x={90 + i * 80} y={48} fontSize="11" textAnchor="middle"
          animate={{ y: [48, 40, 48] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
        >🦋</motion.text>
      ))}

      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneGardenDone') : t('sceneGardenWater')}
      </text>
    </svg>
  );
}

// ─── Chapter 8: Market Scene (String Joining) ───────────────────
function MarketScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      {/* Sky */}
      <rect width="280" height="55" fill="#FF8A65" rx="8" />
      {/* Market stall */}
      <rect x="40" y="45" width="200" height="85" rx="5" fill="#8D6E63" />
      <rect x="35" y="36" width="210" height="14" rx="4" fill="#D32F2F" />
      {/* Stall poles */}
      <rect x="40" y="36" width="5" height="94" fill="#5D4037" />
      <rect x="235" y="36" width="5" height="94" fill="#5D4037" />
      {/* Market goods */}
      <text x="75" y="82" fontSize="14">🍎</text>
      <text x="115" y="82" fontSize="14">🥭</text>
      <text x="155" y="82" fontSize="14">🍌</text>
      <text x="195" y="82" fontSize="14">🥥</text>

      {/* Sign — broken or fixed */}
      {solved ? (
        <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}>
          <rect x="65" y="96" width="150" height="28" rx="6" fill="#FFF8E1" stroke="#FACC15" strokeWidth="2" />
          <text x="140" y="115" textAnchor="middle" fontSize="12" fill="#E65100" fontWeight="bold">Karibu Sokoni!</text>
          {[0, 1, 2].map(i => (
            <motion.circle key={i} cx={80 + i * 40} cy="96" r="2.5" fill="#FACC15"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: 2, delay: i * 0.25 }}
            />
          ))}
        </motion.g>
      ) : (
        <g>
          <motion.rect x="70" y="100" width="50" height="18" rx="4" fill="#FFF8E1" stroke="#D7CCC8" strokeWidth="1"
            animate={{ rotate: [-4, -2, -4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ transformOrigin: '95px 109px' }}
          />
          <motion.rect x="140" y="103" width="65" height="16" rx="4" fill="#FFF8E1" stroke="#D7CCC8" strokeWidth="1"
            animate={{ rotate: [2, 4, 2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ transformOrigin: '172px 111px' }}
          />
          <text x="95" y="113" textAnchor="middle" fontSize="7" fill="#8D6E63">Kari...</text>
          <text x="172" y="113" textAnchor="middle" fontSize="7" fill="#8D6E63">...bu</text>
        </g>
      )}

      {/* Ground */}
      <rect x="0" y="130" width="280" height="30" fill="#8D6E63" rx="4" />
      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneMarketDone') : t('sceneMarketFix')}
      </text>
    </svg>
  );
}

// ─── Chapter 9: Library Scene (Nested Loops) ────────────────────
function LibraryScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      {/* Night sky */}
      <rect width="280" height="45" fill="#1A237E" rx="8" />
      {/* Stars — static */}
      {[30, 80, 130, 190, 250].map((x, i) => (
        <circle key={i} cx={x} cy={12 + (i % 2) * 14} r="1" fill="white" opacity={0.5} />
      ))}
      {/* Library building */}
      <rect x="45" y="40" width="190" height="95" rx="5" fill="#4E342E" />
      {/* Columns */}
      <rect x="55" y="44" width="10" height="86" fill="#6D4C41" rx="2" />
      <rect x="215" y="44" width="10" height="86" fill="#6D4C41" rx="2" />
      {/* Pediment */}
      <polygon points="140,22 38,44 242,44" fill="#5D4037" />
      {/* Door */}
      <rect x="115" y="96" width="50" height="39" rx="4" fill="#3E2723" />
      {/* Book icon */}
      <text x="140" y="54" textAnchor="middle" fontSize="13">📚</text>

      {/* Star pattern — left window */}
      <g transform="translate(72, 60)">
        {solved ? (
          [0, 1, 2].map(row => (
            <g key={row}>
              {[0, 1, 2].map(col => (
                <motion.text key={`${row}-${col}`} x={col * 14} y={row * 11 + 8} fontSize="8"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: row * 0.15 + col * 0.08 }}
                >⭐</motion.text>
              ))}
            </g>
          ))
        ) : (
          <rect width="38" height="28" rx="3" fill="#1A237E" opacity="0.5" />
        )}
      </g>

      {/* Star pattern — right window */}
      <g transform="translate(168, 60)">
        {solved ? (
          [0, 1, 2].map(row => (
            <g key={row}>
              {[0, 1, 2].map(col => (
                <motion.text key={`${row}-${col}`} x={col * 14} y={row * 11 + 8} fontSize="8"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + row * 0.15 + col * 0.08 }}
                >⭐</motion.text>
              ))}
            </g>
          ))
        ) : (
          <rect width="38" height="28" rx="3" fill="#1A237E" opacity="0.5" />
        )}
      </g>

      {/* Ground */}
      <rect x="0" y="132" width="280" height="28" fill="#2E7D32" rx="4" />
      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneLibraryDone') : t('sceneLibraryDecorate')}
      </text>
    </svg>
  );
}

// ─── Chapter 10: Celebration Scene (Grand Finale) ───────────────
function CelebrationScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      {/* Night sky */}
      <rect width="280" height="85" fill="#1A1A2E" rx="8" />
      {/* Stars — static */}
      {[18, 52, 90, 130, 170, 210, 248].map((x, i) => (
        <circle key={i} cx={x} cy={10 + (i % 3) * 16} r="1.5" fill="white" opacity={0.3 + (i % 2) * 0.3} />
      ))}
      {/* Village houses */}
      <rect x="15" y="72" width="40" height="38" rx="3" fill="#8D6E63" />
      <polygon points="35,55 10,72 60,72" fill="#5D4037" />
      <rect x="225" y="68" width="45" height="42" rx="3" fill="#8D6E63" />
      <polygon points="247,50 220,68 275,68" fill="#5D4037" />
      {/* Lit windows */}
      <rect x="25" y="82" width="8" height="8" rx="1" fill="#FFCA28" opacity="0.8" />
      <rect x="38" y="82" width="8" height="8" rx="1" fill="#FFCA28" opacity="0.8" />
      <rect x="235" y="78" width="8" height="8" rx="1" fill="#FFCA28" opacity="0.8" />
      <rect x="252" y="78" width="8" height="8" rx="1" fill="#FFCA28" opacity="0.8" />

      {/* Ground / village square */}
      <rect x="0" y="108" width="280" height="52" fill="#33691E" rx="4" />
      <ellipse cx="140" cy="124" rx="70" ry="16" fill="#4E342E" opacity="0.5" />

      {/* Party banner */}
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <line x1="50" y1="50" x2="230" y2="50" stroke="#FACC15" strokeWidth="2" />
        {['🎊', '🎉', '🎈', '🎊', '🎉', '🎈'].map((e, i) => (
          <text key={i} x={60 + i * 30} y="47" fontSize="10" textAnchor="middle">{e}</text>
        ))}
      </motion.g>

      {/* Characters */}
      {solved ? (
        <>
          {['🐢', '👾', '🧙'].map((ch, i) => (
            <motion.text key={i} x={100 + i * 40} y="122" fontSize="16" textAnchor="middle"
              animate={{ y: [122, 116, 122] }}
              transition={{ duration: 0.8, repeat: 3, delay: i * 0.15 }}
            >{ch}</motion.text>
          ))}
          {/* Fireworks — limited bursts */}
          {[0, 1, 2].map(i => (
            <motion.circle key={`fw-${i}`} cx={60 + i * 80} cy={35} r="3"
              fill={['#FF5252', '#FACC15', '#4FC3F7'][i]}
              animate={{ opacity: [0, 1, 0], scale: [0, 2.5, 0] }}
              transition={{ duration: 1.5, repeat: 2, delay: i * 0.4 }}
            />
          ))}
        </>
      ) : (
        <>
          <text x="110" y="124" fontSize="13" textAnchor="middle">🐢</text>
          <text x="140" y="124" fontSize="13" textAnchor="middle">👾</text>
          <text x="170" y="124" fontSize="13" textAnchor="middle">🧙</text>
          <motion.text x="140" y="110" fontSize="8" textAnchor="middle" fill="#FACC15"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >?</motion.text>
        </>
      )}

      <text x="140" y="153" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneCelebrationDone') : t('sceneCelebrationWelcome')}
      </text>
    </svg>
  );
}

/** Picks the correct scene illustration based on chapter number */
function SceneIllustration({ chapterNumber, solved }: { scene: string; chapterNumber: number; solved: boolean }) {
  switch (chapterNumber) {
    case 1: return <GateScene solved={solved} />;
    case 2: return <GuardScene solved={solved} />;
    case 3: return <ForkPathScene solved={solved} />;
    case 4: return <BridgeCrossingScene solved={solved} />;
    case 5: return <MountainSpellScene solved={solved} />;
    case 6: return <CelebrationScene solved={solved} />;
    default: return <GateScene solved={solved} />;
  }
}

export default function StoryPanel({ chapter, onDialogueComplete, solved = false }: StoryPanelProps) {
  const tc = useChapterText();
  const store = useGameStore();
  const hydrated = useStoreHydrated();
  const { getDialogueIndex, advanceDialogue, isShowingOutro, setShowingOutro } = store;
  const narrationEnabled = hydrated ? store.narrationEnabled : false;
  const dialogueIdx = hydrated ? getDialogueIndex(chapter.slug) : 0;
  const typingDone = true;

  const showingOutro = hydrated ? isShowingOutro(chapter.slug) : false;
  const outroDialogues = chapter.outroDialogues || [];

  // Determine which dialogue set we're in
  const outroIndex = showingOutro ? dialogueIdx - chapter.dialogues.length : -1;

  const currentDialogue = showingOutro
    ? outroDialogues[Math.min(Math.max(outroIndex, 0), outroDialogues.length - 1)]
    : chapter.dialogues[Math.min(dialogueIdx, chapter.dialogues.length - 1)];

  const isLastDialogue = showingOutro
    ? outroIndex >= outroDialogues.length - 1
    : dialogueIdx >= chapter.dialogues.length - 1;

  // Detect locale from tc's resolved messages
  const locale = tc('locale') !== 'locale' ? tc('locale') : 'sw';

  // Pre-load TTS voices on first mount
  React.useEffect(() => {
    preloadVoices();
  }, []);

  // Auto-narrate when narration is enabled and dialogue changes
  React.useEffect(() => {
    if (!narrationEnabled || !currentDialogue) return;
    const resolvedText = tc(currentDialogue.text);
    speak(resolvedText, currentDialogue.speaker, locale).catch(() => {
      // Silently ignore — Azure may fail, browser fallback may not be available
    });
    return () => { stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narrationEnabled, dialogueIdx, showingOutro]);

  // Trigger outro when puzzle is solved and we have outro dialogues
  React.useEffect(() => {
    if (solved && outroDialogues.length > 0 && !showingOutro) {
      setShowingOutro(chapter.slug, true);
    }
  }, [solved, outroDialogues.length, showingOutro, chapter.slug, setShowingOutro]);

  const handleAdvance = () => {
    if (!isLastDialogue) {
      advanceDialogue(chapter.slug);
    } else if (!showingOutro) {
      onDialogueComplete?.();
    }
    // If showing outro and at last dialogue, do nothing (let completion overlay handle it)
  };

  // Determine which character to show based on current speaker
  const currentSpeaker = currentDialogue?.speaker || chapter.character;
  const renderCharacter = () => {
    switch (currentSpeaker) {
      case 'shida':
        return <ShidaCharacter speaking={!solved} celebrating={false} />;
      case 'mzee_byte':
        return <MzeeByteCharacter speaking={false} celebrating={solved} />;
      case 'kito':
        return <KitoCharacter speaking={false} celebrating={solved} />;
      default:
        return chapter.character === 'kito'
          ? <KitoCharacter speaking={false} celebrating={solved} />
          : <MzeeByteCharacter speaking={false} celebrating={solved} />;
    }
  };

  // Pre-compute particle positions
  function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        x1: seededRandom(i * 6 + 1) * 100,
        y1: seededRandom(i * 6 + 2) * 100,
        y2: seededRandom(i * 6 + 3) * 100,
        dur: 4 + seededRandom(i * 6 + 4) * 4,
        del: seededRandom(i * 6 + 5) * 3,
      })),
    []
  );

  // Scene background gradient based on chapter scene
  const sceneGradients: Record<string, string> = {
    village: 'from-indigo-950 via-indigo-900 to-amber-950/30',
    forest: 'from-emerald-950 via-indigo-950 to-indigo-900',
    bridge: 'from-orange-950 via-indigo-950 to-indigo-900',
    mountain: 'from-slate-950 via-indigo-950 to-purple-950',
    cave: 'from-gray-950 via-indigo-950 to-indigo-900',
    waterfall: 'from-blue-950 via-cyan-950 to-indigo-900',
    garden: 'from-emerald-950 via-green-900 to-lime-950',
    market: 'from-orange-950 via-amber-950 to-indigo-900',
    library: 'from-indigo-950 via-violet-950 to-purple-900',
    celebration: 'from-purple-950 via-indigo-950 to-pink-950',
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Scene Background */}
      <div className={`absolute inset-0 bg-linear-to-b ${sceneGradients[chapter.scene] || sceneGradients.village}`}>
        {/* Ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-secondary/30"
              initial={{
                x: `${p.x1}%`,
                y: `${p.y1}%`,
                opacity: 0,
              }}
              animate={{
                y: [`${p.y1}%`, `${p.y2}%`],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: p.dur,
                repeat: Infinity,
                delay: p.del,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* Scene Illustration with Character inside */}
      <div className="relative w-full aspect-[16/9] max-h-[220px] shrink-0">
        {/* Scene SVG — fills the entire area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <SceneIllustration scene={chapter.scene} chapterNumber={chapter.number} solved={solved} />
        </motion.div>

        {/* Character — positioned inside the scene, bottom-center */}
        <motion.div
          key={currentSpeaker}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 z-10 drop-shadow-lg"
        >
          {renderCharacter()}
        </motion.div>
      </div>

      {/* Dialogue Area */}
      <div className="relative px-4 py-3 sm:py-4 lg:py-6 pb-6 w-full max-w-2xl lg:max-w-3xl mx-auto z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={dialogueIdx}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`dialogue-bubble relative ${
              currentSpeaker === 'narrator'
                ? 'bg-stone-800 backdrop-blur-xl border border-stone-700 p-5 rounded-2xl shadow-lg italic'
                : 'bg-bg-surface/95 backdrop-blur-xl border-2 border-primary/30 p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow'
            }`}
            onClick={handleAdvance}
          >
            {/* Speaker Badge — only for characters, not narrator */}
            {currentSpeaker !== 'narrator' && (
              <div className="absolute -top-3.5 left-4 z-20 bg-bg-deep rounded-full">
                <SpeakerBadge speaker={currentSpeaker} />
              </div>
            )}

            {/* Narration (TTS) — read this line aloud */}
            <div className="absolute -top-3.5 right-4 z-20 bg-bg-deep rounded-full">
              <NarrationButton
                text={tc(currentDialogue.text)}
                speaker={currentSpeaker}
                lang={locale}
                compact
              />
            </div>

            {/* Dialogue Text */}
            <p className={`text-base sm:text-lg leading-relaxed font-medium ${
              currentSpeaker === 'narrator'
                ? 'text-text-secondary'
                : 'text-text-primary'
            }`}>
              {tc(currentDialogue.text)}
            </p>

            {/* Code hint */}
            {currentDialogue.showCodeHint && typingDone && currentDialogue.codeExample && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-bg-deep/50 border border-secondary/20 shadow-inner">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💡</span>
                    <span className="text-xs text-secondary font-bold uppercase tracking-wider">{tc('exampleLabel')}</span>
                  </div>
                  <pre className="text-sm font-mono leading-relaxed overflow-x-auto text-emerald-300">
                    <code>
                      {currentDialogue.codeExample.split('\n').map((line, i) => (
                        <div key={i} className="whitespace-pre">
                          {highlightJamboLine(line)}
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </motion.div>
            )}

            {/* Advance indicator */}
            {typingDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 flex justify-center"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdvance();
                  }}
                  className={`group flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 ${
                    isLastDialogue
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/30'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  {isLastDialogue && <PlayIcon />}
                  <span>{isLastDialogue ? tc('startCoding') : tc('clickToContinue')}</span>
                  {!isLastDialogue && <ChevronRight />}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
