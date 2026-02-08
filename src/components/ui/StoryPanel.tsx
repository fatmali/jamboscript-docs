'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterData, Dialogue } from '@/lib/types';
import { useGameStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import KitoCharacter from '@/components/characters/KitoCharacter';
import MzeeByteCharacter from '@/components/characters/MzeeByteCharacter';

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
// Each scene visually represents the coding concept and reacts to solved state.

function GateScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[240px]">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <radialGradient id="magicGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FACC15" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="torchLight" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FF8F00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="doorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="200" height="180" fill="url(#sky)" />

      {/* Stars twinkling */}
      {[
        { x: 15, y: 12, d: 0 }, { x: 45, y: 8, d: 0.4 }, { x: 85, y: 15, d: 0.8 },
        { x: 130, y: 6, d: 1.2 }, { x: 170, y: 18, d: 0.6 }, { x: 55, y: 22, d: 1.5 },
      ].map((s, i) => (
        <motion.circle
          key={`star-${i}`}
          cx={s.x} cy={s.y} r="1"
          fill="white"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2 + i * 0.3, delay: s.d, repeat: Infinity }}
        />
      ))}

      {/* Ground */}
      <rect x="0" y="148" width="200" height="32" fill="#2D1F1F" rx="2" />
      <rect x="0" y="148" width="200" height="4" fill="#3E2A1E" rx="1" opacity="0.5" />

      {/* Grass tufts */}
      {[20, 50, 80, 120, 155, 180].map((gx, i) => (
        <motion.g key={`grass-${i}`} animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}>
          <line x1={gx} y1="150" x2={gx - 3} y2="142" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1={gx} y1="150" x2={gx + 2} y2="140" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </motion.g>
      ))}

      {/* Stone wall left */}
      <rect x="10" y="40" width="30" height="110" fill="#5C5C5C" rx="3" stroke="#4A4A4A" strokeWidth="1" />
      <rect x="12" y="42" width="26" height="20" fill="#6B6B6B" rx="2" opacity="0.7" />
      <rect x="12" y="65" width="26" height="20" fill="#555555" rx="2" opacity="0.5" />
      <rect x="12" y="88" width="26" height="20" fill="#6B6B6B" rx="2" opacity="0.6" />
      <rect x="12" y="111" width="26" height="20" fill="#555555" rx="2" opacity="0.5" />

      {/* Stone wall right */}
      <rect x="160" y="40" width="30" height="110" fill="#5C5C5C" rx="3" stroke="#4A4A4A" strokeWidth="1" />
      <rect x="162" y="42" width="26" height="20" fill="#6B6B6B" rx="2" opacity="0.7" />
      <rect x="162" y="65" width="26" height="20" fill="#555555" rx="2" opacity="0.5" />
      <rect x="162" y="88" width="26" height="20" fill="#6B6B6B" rx="2" opacity="0.6" />
      <rect x="162" y="111" width="26" height="20" fill="#555555" rx="2" opacity="0.5" />

      {/* Torch left */}
      <rect x="22" y="55" width="4" height="16" rx="1" fill="#5D4037" />
      <motion.ellipse cx="24" cy="53" rx="5" ry="7" fill="url(#torchLight)"
        animate={{ ry: [6, 8, 6], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.ellipse cx="24" cy="52" rx="3" ry="5" fill="#FF6F00"
        animate={{ ry: [4, 6, 4], rx: [2.5, 3.5, 2.5] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      <motion.ellipse cx="24" cy="51" rx="1.5" ry="3" fill="#FFCA28"
        animate={{ ry: [2, 3.5, 2] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />

      {/* Torch right */}
      <rect x="174" y="55" width="4" height="16" rx="1" fill="#5D4037" />
      <motion.ellipse cx="176" cy="53" rx="5" ry="7" fill="url(#torchLight)"
        animate={{ ry: [6, 8, 6], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
      />
      <motion.ellipse cx="176" cy="52" rx="3" ry="5" fill="#FF6F00"
        animate={{ ry: [4, 6, 4], rx: [2.5, 3.5, 2.5] }}
        transition={{ duration: 0.8, delay: 0.3, repeat: Infinity }}
      />
      <motion.ellipse cx="176" cy="51" rx="1.5" ry="3" fill="#FFCA28"
        animate={{ ry: [2, 3.5, 2] }}
        transition={{ duration: 0.6, delay: 0.3, repeat: Infinity }}
      />

      {/* Arch top */}
      <path d="M 40 60 Q 100 5 160 60" fill="#5C5C5C" stroke="#4A4A4A" strokeWidth="2" />
      <path d="M 45 60 Q 100 12 155 60" fill="#1E293B" />

      {/* Keystone */}
      <motion.polygon
        points="95,12 105,12 107,25 93,25"
        fill="#FACC15"
        animate={solved ? { fill: '#4ADE80' } : { opacity: [0.6, 1, 0.6] }}
        transition={solved ? { duration: 0.5 } : { duration: 2, repeat: Infinity }}
      />

      {/* Light behind gate when open */}
      {solved && (
        <motion.rect
          x="42" y="60" width="116" height="90"
          fill="#FACC15"
          rx="3"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0.12] }}
          transition={{ duration: 1.2 }}
        />
      )}

      {/* Door - left panel */}
      <motion.rect
        y="60" width="56" height="90" rx="3"
        fill="url(#doorGrad)" stroke="#3E2723" strokeWidth="2"
        animate={{ x: solved ? 20 : 42 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Door - right panel */}
      <motion.rect
        y="60" width="56" height="90" rx="3"
        fill="url(#doorGrad)" stroke="#3E2723" strokeWidth="2"
        animate={{ x: solved ? 136 : 102 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Door wood grain lines */}
      <motion.g animate={{ x: solved ? -22 : 0 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
        <line x1="55" y1="65" x2="55" y2="145" stroke="#3E2723" strokeWidth="0.5" opacity="0.4" />
        <line x1="70" y1="65" x2="70" y2="145" stroke="#3E2723" strokeWidth="0.5" opacity="0.3" />
        <line x1="85" y1="65" x2="85" y2="145" stroke="#3E2723" strokeWidth="0.5" opacity="0.4" />
      </motion.g>
      <motion.g animate={{ x: solved ? 34 : 0 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
        <line x1="115" y1="65" x2="115" y2="145" stroke="#3E2723" strokeWidth="0.5" opacity="0.4" />
        <line x1="130" y1="65" x2="130" y2="145" stroke="#3E2723" strokeWidth="0.5" opacity="0.3" />
        <line x1="145" y1="65" x2="145" y2="145" stroke="#3E2723" strokeWidth="0.5" opacity="0.4" />
      </motion.g>

      {/* Door handles (ring style) */}
      <motion.circle
        cy="108" r="5" fill="none" stroke="#FFC107" strokeWidth="2"
        animate={{ cx: solved ? 70 : 92 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cy="108" r="5" fill="none" stroke="#FFC107" strokeWidth="2"
        animate={{ cx: solved ? 146 : 108 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cy="102" r="2" fill="#FFC107"
        animate={{ cx: solved ? 70 : 92 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cy="102" r="2" fill="#FFC107"
        animate={{ cx: solved ? 146 : 108 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Magic glow when locked — pulsing runes */}
      {!solved && (
        <>
          <motion.ellipse
            cx="100" cy="95" rx="35" ry="45"
            fill="url(#magicGlow)"
            animate={{ opacity: [0.3, 0.7, 0.3], ry: [43, 48, 43] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          {/* Floating rune symbols */}
          {['✦', '⟡', '✧', '⟡', '✦'].map((rune, i) => (
            <motion.text
              key={`rune-${i}`}
              x={65 + i * 18}
              y={90}
              fontSize="8"
              fill="#FACC15"
              textAnchor="middle"
              animate={{
                y: [88 + (i % 2) * 4, 82 + (i % 2) * 4, 88 + (i % 2) * 4],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{ duration: 2, delay: i * 0.35, repeat: Infinity }}
            >
              {rune}
            </motion.text>
          ))}
        </>
      )}

      {/* Lock icon */}
      {!solved && (
        <motion.g
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <rect x="93" y="100" width="14" height="12" rx="2" fill="#FFC107" />
          <path d="M 96 100 L 96 94 Q 100 88 104 94 L 104 100" fill="none" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="107" r="2" fill="#5D4037" />
        </motion.g>
      )}

      {/* Sparkles burst when opened */}
      {solved && (
        <>
          {[
            { x: 100, y: 60, d: 0 }, { x: 80, y: 75, d: 0.1 }, { x: 120, y: 70, d: 0.15 },
            { x: 70, y: 95, d: 0.2 }, { x: 130, y: 90, d: 0.25 }, { x: 90, y: 55, d: 0.3 },
            { x: 110, y: 50, d: 0.35 }, { x: 75, y: 110, d: 0.4 }, { x: 125, y: 105, d: 0.45 },
            { x: 100, y: 80, d: 0.05 },
          ].map((s, i) => (
            <motion.circle
              key={`sparkle-${i}`}
              cx={s.x} cy={s.y} r="2"
              fill="#FACC15"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 2, 0],
                y: [s.y, s.y - 25 - (i % 3) * 10],
              }}
              transition={{ duration: 1.2, delay: s.d, repeat: 2 }}
            />
          ))}
          {/* Success glow ring */}
          <motion.circle
            cx="100" cy="100" r="20"
            fill="none" stroke="#4ADE80" strokeWidth="2"
            initial={{ r: 10, opacity: 0.8 }}
            animate={{ r: 60, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </>
      )}

      {/* Label */}
      <text x="100" y="174" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneGateOpened') : t('sceneGateLocked')}
      </text>
    </svg>
  );
}

function GuardScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[240px]">
      {/* Background hut */}
      <rect x="55" y="70" width="90" height="80" rx="3" fill="#8D6E63" />
      <polygon points="100,25 40,75 160,75" fill="#5D4037" />
      {/* Window */}
      <rect x="115" y="90" width="18" height="18" rx="2" fill="#3E2723" />
      <line x1="124" y1="90" x2="124" y2="108" stroke="#5D4037" strokeWidth="1.5" />
      <line x1="115" y1="99" x2="133" y2="99" stroke="#5D4037" strokeWidth="1.5" />
      {/* Guard */}
      <g transform="translate(80, 85)">
        {/* Body */}
        <rect x="5" y="25" width="30" height="40" rx="3" fill="#4527A0" />
        {/* Head */}
        <circle cx="20" cy="18" r="14" fill="#A07D1C" />
        <circle cx="20" cy="20" r="12" fill="#B8942A" />
        {/* Eyes */}
        <circle cx="15" cy="17" r="2" fill="white" />
        <circle cx="25" cy="17" r="2" fill="white" />
        <circle cx="15.5" cy="17" r="1.2" fill="#1E1B4B" />
        <circle cx="25.5" cy="17" r="1.2" fill="#1E1B4B" />
        {/* Helmet */}
        <path d="M 6 14 Q 8 2 20 0 Q 32 2 34 14" fill="#FFC107" />
        <ellipse cx="20" cy="14" rx="14" ry="3" fill="#FFC107" />
        {/* Spear */}
        <line x1="40" y1="5" x2="40" y2="65" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" />
        <polygon points="40,-2 35,8 45,8" fill="#78909C" />
      </g>
      {/* Question mark or name scroll */}
      <motion.g
        animate={solved ? { y: 0, opacity: 1 } : { y: [0, -3, 0], opacity: 1 }}
        transition={solved ? {} : { duration: 2, repeat: Infinity }}
      >
        {solved ? (
          <g transform="translate(60, 135)">
            {/* Scroll */}
            <rect x="0" y="0" width="80" height="24" rx="4" fill="#FFF8E1" stroke="#D7CCC8" strokeWidth="1" />
            <circle cx="0" cy="12" r="5" fill="#D7CCC8" />
            <circle cx="80" cy="12" r="5" fill="#D7CCC8" />
            <text x="40" y="16" textAnchor="middle" fontSize="9" fill="#3E2723" fontWeight="bold">{t('sceneGuardWelcome')}</text>
          </g>
        ) : (
          <g transform="translate(80, 135)">
            <motion.text
              x="20" y="16"
              textAnchor="middle"
              fontSize="22"
              fill="#FACC15"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ❓
            </motion.text>
          </g>
        )}
      </motion.g>
      {/* Label */}
      <text x="100" y="174" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneGuardSaved') : t('sceneGuardAsking')}
      </text>
    </svg>
  );
}

function ForkPathScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[240px]">
      {/* Sky */}
      <rect x="0" y="0" width="200" height="80" fill="#1A237E" rx="4" />
      {/* Stars */}
      {[0,1,2,3,4,5].map(i => (
        <motion.circle
          key={i}
          cx={20 + i * 32}
          cy={15 + (i % 3) * 20}
          r={1 + (i % 2)}
          fill="white"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2 + (i % 2), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {/* Ground */}
      <rect x="0" y="80" width="200" height="100" fill="#1B5E20" rx="2" />
      {/* Main path from bottom */}
      <rect x="85" y="140" width="30" height="40" fill="#8D6E63" rx="3" />
      {/* Fork — left path (pango / cave) */}
      <motion.path
        d="M 85 140 Q 50 120 20 100"
        fill="none"
        stroke={solved ? '#FACC15' : '#8D6E63'}
        strokeWidth="25"
        strokeLinecap="round"
        animate={solved ? { stroke: '#FACC15' } : {}}
        transition={{ duration: 0.5 }}
      />
      {/* Fork — right path (mto / river) */}
      <motion.path
        d="M 115 140 Q 150 120 180 100"
        fill="none"
        stroke={solved ? '#FACC15' : '#8D6E63'}
        strokeWidth="25"
        strokeLinecap="round"
        animate={solved ? { stroke: '#FACC15' } : {}}
        transition={{ duration: 0.5 }}
      />
      {/* Cave icon on left */}
      <g transform="translate(5, 78)">
        <path d="M 0 25 Q 15 0 30 25" fill="#3E2723" />
        <text x="15" y="20" textAnchor="middle" fontSize="12">🕳️</text>
      </g>
      {/* River icon on right */}
      <g transform="translate(165, 78)">
        <motion.text
          x="15" y="20"
          textAnchor="middle"
          fontSize="14"
          animate={{ y: [20, 18, 20] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏞️
        </motion.text>
      </g>
      {/* Weather indicator */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {!solved ? (
          <text x="100" y="30" textAnchor="middle" fontSize="22">🌧️</text>
        ) : (
          <text x="100" y="30" textAnchor="middle" fontSize="22">☀️</text>
        )}
      </motion.g>
      {/* Decision indicator */}
      <g transform="translate(85, 118)">
        <motion.text
          x="15" y="15"
          textAnchor="middle"
          fontSize="16"
          animate={!solved ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {solved ? '✅' : '🤔'}
        </motion.text>
      </g>
      {/* Label */}
      <text x="100" y="174" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('scenePathChosen') : t('scenePathChoose')}
      </text>
    </svg>
  );
}

function BridgeCrossingScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  const plankCount = 5;
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[240px]">
      {/* Sky */}
      <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF8A65" />
        <stop offset="100%" stopColor="#FFF3E0" />
      </linearGradient>
      <rect x="0" y="0" width="200" height="80" fill="url(#sunsetSky)" rx="4" />
      {/* Water */}
      <rect x="0" y="80" width="200" height="100" fill="#1565C0" rx="2" />
      {/* Water ripples */}
      {[0,1,2,3].map(i => (
        <motion.ellipse
          key={i}
          cx={30 + i * 50}
          cy={110 + (i % 2) * 25}
          rx={15}
          ry={2}
          fill="rgba(255,255,255,0.15)"
          animate={{ rx: [15, 20, 15], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
        />
      ))}
      {/* Left bank */}
      <rect x="0" y="85" width="30" height="95" fill="#5D4037" rx="2" />
      <rect x="0" y="82" width="35" height="10" fill="#558B2F" rx="3" />
      {/* Right bank */}
      <rect x="170" y="85" width="30" height="95" fill="#5D4037" rx="2" />
      <rect x="165" y="82" width="35" height="10" fill="#558B2F" rx="3" />
      {/* Posts */}
      <rect x="22" y="65" width="8" height="50" fill="#4E342E" rx="2" />
      <rect x="170" y="65" width="8" height="50" fill="#4E342E" rx="2" />
      {/* Top rope */}
      <path d="M 26 70 Q 100 55 174 70" fill="none" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round" />
      {/* Bottom rope */}
      <path d="M 26 100 Q 100 110 174 100" fill="none" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round" />
      {/* Planks */}
      {Array.from({ length: plankCount }, (_, i) => {
        const x = 35 + i * 26;
        const crossed = solved;
        return (
          <motion.rect
            key={i}
            x={x}
            y="92"
            width="22"
            height="6"
            rx="1"
            fill={crossed ? '#FFC107' : '#8D6E63'}
            animate={
              crossed
                ? { fill: '#FFC107', y: 92 }
                : { y: [92, 93, 92] }
            }
            transition={
              crossed
                ? { duration: 0.4, delay: i * 0.2 }
                : { duration: 2, repeat: Infinity, delay: i * 0.15 }
            }
          />
        );
      })}
      {/* Walker figure */}
      <motion.g
        animate={solved ? { x: 150 } : { x: 15 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <circle cx="20" cy="78" r="5" fill="#FACC15" />
        <line x1="20" y1="83" x2="20" y2="92" stroke="#FACC15" strokeWidth="2" />
        <line x1="20" y1="86" x2="15" y2="90" stroke="#FACC15" strokeWidth="1.5" />
        <line x1="20" y1="86" x2="25" y2="90" stroke="#FACC15" strokeWidth="1.5" />
      </motion.g>
      {/* Step counter */}
      <text x="100" y="128" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" opacity="0.8">
        {solved ? t('sceneBridgeStepsDone', { count: 5 }) : t('sceneBridgeSteps', { count: 0 })}
      </text>
      {/* Label */}
      <text x="100" y="174" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneBridgeCrossed') : t('sceneBridgeCross')}
      </text>
    </svg>
  );
}

function MountainSpellScene({ solved }: { solved: boolean }) {
  const t = useChapterText();
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[240px]">
      {/* Sky */}
      <rect x="0" y="0" width="200" height="100" fill="#1A1A2E" rx="4" />
      {/* Stars */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <motion.circle
          key={i}
          cx={15 + i * 24}
          cy={12 + (i % 4) * 18}
          r={1}
          fill="white"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
      {/* Mountain */}
      <polygon points="100,30 30,150 170,150" fill="#4E342E" />
      <polygon points="100,30 80,60 120,60" fill="#ECEFF1" opacity="0.5" />
      {/* Ground */}
      <rect x="0" y="145" width="200" height="35" fill="#2E7D32" rx="2" />
      {/* Spell scroll / function box */}
      <g transform="translate(65, 80)">
        <motion.rect
          x="0" y="0" width="70" height="50" rx="6"
          fill="#312E81"
          stroke={solved ? '#FACC15' : '#6366F1'}
          strokeWidth="2"
          animate={solved ? { stroke: '#FACC15' } : { stroke: ['#6366F1', '#818CF8', '#6366F1'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Function signature */}
        <text x="35" y="18" textAnchor="middle" fontSize="7" fill="#FACC15" fontWeight="bold">kazi maraMbili(n)</text>
        <text x="35" y="30" textAnchor="middle" fontSize="7" fill="#A5B4FC">rudisha n * 2</text>
        {/* Input arrow */}
        <motion.g
          animate={solved ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <text x="35" y="45" textAnchor="middle" fontSize="8" fill={solved ? '#4ADE80' : '#94A3B8'}>
            {solved ? '7 → 14 ✅' : '7 → ?'}
          </text>
        </motion.g>
      </g>
      {/* Magic sparkles when solved */}
      {solved && (
        <>
          {[0,1,2,3,4,5].map(i => (
            <motion.circle
              key={i}
              cx={70 + i * 12}
              cy={75}
              r="2"
              fill="#FACC15"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: [0, -25], scale: [0.5, 1.5, 0] }}
              transition={{ duration: 1.2, delay: i * 0.2, repeat: 3 }}
            />
          ))}
        </>
      )}
      {/* Label */}
      <text x="100" y="174" textAnchor="middle" fontSize="9" fill="#FACC15" fontWeight="bold" opacity="0.7">
        {solved ? t('sceneMountainSuccess') : t('sceneMountainCreate')}
      </text>
    </svg>
  );
}

/** Picks the correct scene illustration based on chapter scene + concept */
function SceneIllustration({ chapterNumber, solved }: { scene: string; chapterNumber: number; solved: boolean }) {
  switch (chapterNumber) {
    case 1: return <GateScene solved={solved} />;
    case 2: return <GuardScene solved={solved} />;
    case 3: return <ForkPathScene solved={solved} />;
    case 4: return <BridgeCrossingScene solved={solved} />;
    case 5: return <MountainSpellScene solved={solved} />;
    default: return <GateScene solved={solved} />;
  }
}

export default function StoryPanel({ chapter, onDialogueComplete, solved = false }: StoryPanelProps) {
  const tc = useChapterText();
  const { getDialogueIndex, advanceDialogue } = useGameStore();
  const dialogueIdx = getDialogueIndex(chapter.slug);
  const typingDone = true;

  const currentDialogue = chapter.dialogues[Math.min(dialogueIdx, chapter.dialogues.length - 1)];
  const isLastDialogue = dialogueIdx >= chapter.dialogues.length - 1;

  const handleAdvance = () => {
    if (!isLastDialogue) {
      advanceDialogue(chapter.slug);
    } else {
      onDialogueComplete?.();
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

      {/* Scene Illustration + Character Display */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-0 gap-2 px-4">
        {/* Chapter-specific scene illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full flex items-center justify-center"
        >
          <SceneIllustration scene={chapter.scene} chapterNumber={chapter.number} solved={solved} />
        </motion.div>

        {/* Character — smaller, anchored below the scene */}
        <motion.div
          key={chapter.character}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-16 h-16 sm:w-20 sm:h-20 shrink-0"
        >
          {chapter.character === 'kito' ? (
            <KitoCharacter speaking={false} celebrating={solved} />
          ) : (
            <MzeeByteCharacter speaking={false} celebrating={solved} />
          )}
        </motion.div>
      </div>

      {/* Dialogue Area */}
      <div className="relative px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={dialogueIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="dialogue-bubble cursor-pointer"
            onClick={handleAdvance}
          >
            <p className="text-sm sm:text-base text-text-primary leading-relaxed">
              {tc(currentDialogue.text)}
            </p>

            {/* Code hint */}
            {currentDialogue.showCodeHint && typingDone && currentDialogue.codeExample && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 rounded-lg bg-bg-deep/80 border border-secondary/20"
              >
                <span className="text-xs text-secondary font-bold block mb-2">{tc('exampleLabel')}</span>
                <pre className="text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto">
                  <code>
                    {currentDialogue.codeExample.split('\n').map((line, i) => (
                      <div key={i}>
                        {highlightJamboLine(line)}
                      </div>
                    ))}
                  </code>
                </pre>
              </motion.div>
            )}

            {/* Advance indicator */}
            {typingDone && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-3 flex justify-end"
              >
                <button
                  onClick={handleAdvance}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isLastDialogue
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/25'
                      : 'bg-surface-card hover:bg-surface-card/80 text-text-secondary border border-white/10'
                  }`}
                >
                  {isLastDialogue ? tc('startCoding') : tc('clickToContinue')}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
