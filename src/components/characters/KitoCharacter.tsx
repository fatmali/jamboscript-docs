'use client';

import { motion } from 'framer-motion';
import {
  kitoPalette as C,
  idleLoop,
  loopSmooth,
  springBouncy,
  blinkTiming,
  SVG_DEFAULTS,
} from '@/lib/animation';

interface KitoCharacterProps {
  speaking?: boolean;
  celebrating?: boolean;
}

/**
 * Kito — The friendly guide tortoise 🐢
 *
 * Chibi proportions: oversized round head (~35%), compact body,
 * stubby limbs. Warm greens with kanga-inspired gold diamond shell accents.
 * Adventure cap. Big expressive eyes with catchlights.
 *
 * All shapes use basic SVG primitives for clarity and small file size.
 * Spring-based animation throughout with overlapping action.
 */
export default function KitoCharacter({ speaking = false, celebrating = false }: KitoCharacterProps) {
  return (
    <motion.div
      className="relative w-full h-full"
      animate={celebrating ? { scale: [1, 1.04, 1] } : {}}
      transition={celebrating ? { ...springBouncy, stiffness: 120 } : {}}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
      >
        <defs>
          <radialGradient id="k-shell" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor={C.shellLight} />
            <stop offset="100%" stopColor={C.shellDark} />
          </radialGradient>
          <linearGradient id="k-skin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.skinLight} />
            <stop offset="100%" stopColor={C.skin} />
          </linearGradient>
          <linearGradient id="k-belly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={C.belly} />
            <stop offset="100%" stopColor={C.bellyDark} />
          </linearGradient>
        </defs>

        {/* ── BODY GROUP — gentle breathing bob ── */}
        <motion.g
          animate={{ y: celebrating ? [0, -6, 1, -3, 0] : speaking ? [0, -1.5, 0] : [0, -2, 0] }}
          transition={celebrating ? { duration: 0.8, ease: 'easeOut' } : idleLoop(speaking ? 2 : 4.5)}
          style={{ transformOrigin: '60px 85px' }}
        >

          {/* Tail — wags with overlapping action */}
          <motion.g
            animate={{
              rotate: celebrating ? [8, 30, 5, 25, 8] : speaking ? [8, 18, 8] : [8, 14, 8],
            }}
            transition={celebrating ? loopSmooth(0.5) : idleLoop(speaking ? 1.2 : 3.5, 0.15)}
            style={{ transformOrigin: '38px 82px' }}
          >
            <ellipse cx="28" cy="82" rx="8" ry="5" fill="url(#k-skin)" stroke={C.stroke} {...SVG_DEFAULTS} strokeWidth={1.5} />
          </motion.g>

          {/* Back legs — subtle alternating shift */}
          <motion.ellipse cx="42" cy="92" rx="9" ry="6"
            fill={C.skinDark} stroke={C.stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
            animate={{ x: [0, -0.5, 0] }}
            transition={idleLoop(4, 0.3)}
          />
          <motion.ellipse cx="78" cy="92" rx="9" ry="6"
            fill={C.skinDark} stroke={C.stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
            animate={{ x: [0, 0.5, 0] }}
            transition={idleLoop(4, 0.6)}
          />

          {/* Front legs */}
          <motion.g
            animate={{ rotate: celebrating ? [-6, 6, -6] : [0, 1.5, 0, -1.5, 0] }}
            transition={celebrating ? loopSmooth(0.6) : idleLoop(5)}
            style={{ transformOrigin: '60px 90px' }}
          >
            <ellipse cx="34" cy="95" rx="10" ry="7" fill="url(#k-skin)" stroke={C.stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="86" cy="95" rx="10" ry="7" fill="url(#k-skin)" stroke={C.stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>

          {/* Shell — main body */}
          <ellipse cx="60" cy="72" rx="32" ry="24" fill="url(#k-shell)" stroke={C.stroke} {...SVG_DEFAULTS} />

          {/* Kanga diamond pattern on shell — gold accents */}
          <g opacity="0.7">
            <polygon points="60,52 54,60 60,68 66,60" fill={C.accent} opacity="0.5" />
            <polygon points="44,60 39,66 44,72 49,66" fill={C.accent} opacity="0.35" />
            <polygon points="76,60 71,66 76,72 81,66" fill={C.accent} opacity="0.35" />
            <polygon points="60,70 56,76 60,82 64,76" fill={C.accent} opacity="0.3" />
          </g>

          {/* Shell highlight arc */}
          <path d="M38,58 Q60,48 82,58" fill="none" stroke="white" strokeWidth={1} opacity="0.2" strokeLinecap="round" />

          {/* Belly plate */}
          <ellipse cx="60" cy="78" rx="16" ry="12" fill="url(#k-belly)" opacity="0.5" />

          {/* ── HEAD — overlapping delay from body ── */}
          <motion.g
            animate={{
              y: celebrating ? [0, -3, 0.5, -1.5, 0] : speaking ? [0, -1, 0] : [0, -0.8, 0],
              rotate: celebrating ? [0, 4, -4, 2, 0] : speaking ? [0, 1.5, 0, -1.5, 0] : [0, 0.8, 0, -0.8, 0],
            }}
            transition={celebrating ? { duration: 0.7, ease: 'easeOut', delay: 0.08 } : idleLoop(speaking ? 2 : 5, 0.12)}
            style={{ transformOrigin: '60px 55px' }}
          >
            {/* Neck */}
            <rect x="52" y="48" width="16" height="14" rx="6" fill="url(#k-skin)" />

            {/* Head shape — large, round, chibi */}
            <ellipse cx="60" cy="38" rx="18" ry="16" fill="url(#k-skin)" stroke={C.stroke} {...SVG_DEFAULTS} />

            {/* Cheek blush */}
            <circle cx="46" cy="42" r="4" fill="#F9A8D4" opacity="0.25" />
            <circle cx="74" cy="42" r="4" fill="#F9A8D4" opacity="0.25" />

            {/* Eyes — big, expressive, with catchlights */}
            <g>
              {/* Left eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 1, 0.08, 1] }}
                transition={blinkTiming}
                style={{ transformOrigin: '52px 36px' }}
              >
                <ellipse cx="52" cy="36" rx="6" ry="7" fill="white" stroke={C.stroke} strokeWidth={1} />
                <motion.circle cx="53" cy="35" r="3.5" fill={C.eyes}
                  animate={speaking ? { cx: [53, 54, 52.5, 53] } : { cx: [53, 53.3, 53] }}
                  transition={speaking ? loopSmooth(1.8) : idleLoop(3)}
                />
                <circle cx="54.5" cy="33.5" r="1.5" fill="white" />
                <circle cx="52" cy="36.5" r="0.7" fill="white" opacity="0.5" />
              </motion.g>

              {/* Right eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 1, 0.08, 1] }}
                transition={blinkTiming}
                style={{ transformOrigin: '68px 36px' }}
              >
                <ellipse cx="68" cy="36" rx="6" ry="7" fill="white" stroke={C.stroke} strokeWidth={1} />
                <motion.circle cx="67" cy="35" r="3.5" fill={C.eyes}
                  animate={speaking ? { cx: [67, 68, 66.5, 67] } : { cx: [67, 67.3, 67] }}
                  transition={speaking ? loopSmooth(1.8) : idleLoop(3, 0.1)}
                />
                <circle cx="68.5" cy="33.5" r="1.5" fill="white" />
                <circle cx="66" cy="36.5" r="0.7" fill="white" opacity="0.5" />
              </motion.g>
            </g>

            {/* Nostrils */}
            <circle cx="57" cy="42" r="1" fill={C.stroke} opacity="0.4" />
            <circle cx="63" cy="42" r="1" fill={C.stroke} opacity="0.4" />

            {/* Mouth */}
            <motion.path
              d={celebrating ? 'M52,46 Q60,52 68,46' : 'M53,46 Q60,49 67,46'}
              fill="none" stroke={C.stroke} strokeWidth={1.8} strokeLinecap="round"
              animate={speaking ? { d: ['M53,46 Q60,49 67,46', 'M54,46 Q60,44 66,46', 'M53,46 Q60,50 67,46', 'M53,46 Q60,49 67,46'] } : {}}
              transition={speaking ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' } : {}}
            />

            {/* Adventure cap — follows head with extra delay */}
            <motion.g
              animate={celebrating ? { y: [-1, -4, -1], rotate: [-2, 3, -2] } : {}}
              transition={celebrating ? loopSmooth(0.8, 0.1) : {}}
              style={{ transformOrigin: '60px 28px' }}
            >
              <path d="M44,28 Q60,16 76,28" fill={C.hat} stroke={C.hatBand} strokeWidth={1.5} strokeLinejoin="round" />
              <rect x="44" y="26" width="32" height="4" rx="2" fill={C.hat} />
              <rect x="44" y="27" width="32" height="3" rx="1.5" fill={C.hatBand} />
              <path d="M42,30 Q60,34 78,30" fill={C.hat} stroke={C.hatBand} strokeWidth={1} />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* Celebration sparkles — burst then fade, NOT infinite */}
        {celebrating && [
          { x: 30, y: 30, d: 0 }, { x: 90, y: 25, d: 0.1 }, { x: 20, y: 60, d: 0.2 },
          { x: 100, y: 55, d: 0.15 }, { x: 60, y: 15, d: 0.05 },
        ].map((s, i) => (
          <motion.path
            key={i}
            d={`M${s.x},${s.y - 4} L${s.x + 1.5},${s.y - 1} L${s.x + 4},${s.y} L${s.x + 1.5},${s.y + 1} L${s.x},${s.y + 4} L${s.x - 1.5},${s.y + 1} L${s.x - 4},${s.y} L${s.x - 1.5},${s.y - 1} Z`}
            fill={C.accent}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0.8], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, delay: s.d, repeat: 2, repeatDelay: 0.8 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
