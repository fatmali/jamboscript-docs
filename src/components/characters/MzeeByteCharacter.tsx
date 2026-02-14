'use client';

import { motion } from 'framer-motion';
import {
  mzeePalette as C,
  idleLoop,
  loopSmooth,
  springBouncy,
  blinkTiming,
  SVG_DEFAULTS,
} from '@/lib/animation';

interface MzeeByteCharacterProps {
  speaking?: boolean;
  celebrating?: boolean;
}

/**
 * Mzee Byte — The wise digital elder 🧙‍♂️
 *
 * Dignified, floating sage with indigo robes, teal kofia cap,
 * flowing white beard, and glowing teal staff orb. Warm amber skin
 * with kind expressive eyes. Gold geometric trim on robe hem.
 *
 * Design follows East African elder aesthetic — kofia (rounded dome cap)
 * replaces generic wizard hat. No glasses (per spec).
 */
export default function MzeeByteCharacter({ speaking = false, celebrating = false }: MzeeByteCharacterProps) {
  return (
    <motion.div
      className="relative w-full h-full"
      animate={celebrating ? { rotate: [0, 1.5, -1.5, 0] } : {}}
      transition={celebrating ? { duration: 1.5, ease: 'easeOut' } : {}}
    >
      <svg
        viewBox="0 0 120 130"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
      >
        <defs>
          <linearGradient id="m-robe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.robeLight} />
            <stop offset="100%" stopColor={C.robeDark} />
          </linearGradient>
          <radialGradient id="m-orb" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={C.staffOrbGlow} />
            <stop offset="100%" stopColor={C.staffOrb} />
          </radialGradient>
          <radialGradient id="m-orb-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.staffOrbGlow} stopOpacity="0.4" />
            <stop offset="100%" stopColor={C.staffOrb} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Shadow puddle */}
        <motion.ellipse cx="55" cy="122" rx="24" ry="4" fill="black" opacity="0.08"
          animate={{ rx: [24, 21, 24], opacity: [0.06, 0.1, 0.06] }}
          transition={idleLoop(4)}
        />

        {/* ── MAIN BODY — gentle float ── */}
        <motion.g
          animate={{ y: celebrating ? [0, -7, 1, -4, 0] : speaking ? [0, -2, 0] : [0, -3.5, 0] }}
          transition={celebrating ? { duration: 0.9, ease: 'easeOut' } : idleLoop(speaking ? 2.5 : 4)}
        >

          {/* Staff — left side */}
          <motion.g
            animate={{ rotate: celebrating ? [-3, 5, -3] : speaking ? [-1, 3, -1] : [-1, 1, -1] }}
            transition={celebrating ? loopSmooth(0.7) : idleLoop(speaking ? 2.5 : 5)}
            style={{ transformOrigin: '88px 75px' }}
          >
            {/* Staff shaft */}
            <rect x="86" y="35" width="4" height="80" rx="2" fill={C.staff} />

            {/* Orb glow */}
            <motion.circle cx="88" cy="30" r="12" fill="url(#m-orb-glow)"
              animate={{ r: celebrating ? [12, 16, 12] : speaking ? [11, 14, 11] : [11, 13, 11], opacity: [0.3, 0.6, 0.3] }}
              transition={celebrating ? loopSmooth(0.6) : idleLoop(speaking ? 1.8 : 3)}
            />
            {/* Orb */}
            <circle cx="88" cy="30" r="6" fill="url(#m-orb)" stroke={C.staffOrb} strokeWidth={1} />
            {/* Orb sparkle */}
            <circle cx="86" cy="28" r="1.5" fill="white" opacity="0.6" />
          </motion.g>

          {/* Robe body */}
          <path
            d="M30,115 L38,58 Q55,48 72,58 L80,115 Q55,120 30,115 Z"
            fill="url(#m-robe)" stroke={C.stroke} {...SVG_DEFAULTS}
          />

          {/* Robe gold trim line near hem */}
          <path d="M33,110 Q55,115 77,110" fill="none" stroke={C.trimGold} strokeWidth={2} strokeLinecap="round" opacity="0.6" />
          <path d="M35,106 Q55,110 75,106" fill="none" stroke={C.trimGold} strokeWidth={1} strokeLinecap="round" opacity="0.3" />

          {/* Gold geometric diamond accents on robe */}
          <polygon points="55,75 52,80 55,85 58,80" fill={C.trimGold} opacity="0.25" />
          <polygon points="55,90 53,94 55,98 57,94" fill={C.trimGold} opacity="0.2" />

          {/* Left arm (gesturing when speaking) */}
          <motion.g
            animate={speaking ? { rotate: [0, -8, 0, -5, 0] } : celebrating ? { rotate: [0, -12, 5, -8, 0] } : {}}
            transition={speaking ? loopSmooth(2) : celebrating ? { duration: 0.8, ease: 'easeOut' } : {}}
            style={{ transformOrigin: '38px 65px' }}
          >
            <path d="M38,65 Q28,72 25,80" fill="none" stroke="url(#m-robe)" strokeWidth={8} strokeLinecap="round" />
            <circle cx="25" cy="80" r="5" fill={C.skin} stroke={C.stroke} strokeWidth={1} />
          </motion.g>

          {/* Right arm (holds staff) */}
          <path d="M72,65 Q82,70 85,78" fill="none" stroke="url(#m-robe)" strokeWidth={8} strokeLinecap="round" />
          <circle cx="85" cy="78" r="5" fill={C.skin} stroke={C.stroke} strokeWidth={1} />

          {/* ── HEAD GROUP — overlapping delay ── */}
          <motion.g
            animate={{
              y: celebrating ? [0, -2, 0.5, -1, 0] : speaking ? [0, -0.5, 0] : [0, -0.5, 0],
              rotate: celebrating ? [0, 3, -3, 1, 0] : speaking ? [0, 1, 0, -1, 0] : [0, 0.5, 0, -0.5, 0],
            }}
            transition={celebrating ? { duration: 0.8, delay: 0.06 } : idleLoop(speaking ? 2.5 : 5.5, 0.1)}
            style={{ transformOrigin: '55px 48px' }}
          >
            {/* Face */}
            <circle cx="55" cy="42" r="16" fill={C.skin} stroke={C.stroke} {...SVG_DEFAULTS} />

            {/* Cheek warmth */}
            <circle cx="42" cy="46" r="3.5" fill="#E8A87C" opacity="0.25" />
            <circle cx="68" cy="46" r="3.5" fill="#E8A87C" opacity="0.25" />

            {/* Eyebrows */}
            <motion.g
              animate={speaking ? { y: [0, -1, 0] } : celebrating ? { y: [0, -1.5, 0] } : {}}
              transition={speaking ? loopSmooth(1.5) : celebrating ? loopSmooth(0.6) : {}}
            >
              <line x1="44" y1="34" x2="50" y2="33" stroke={C.stroke} strokeWidth={1.5} strokeLinecap="round" opacity="0.6" />
              <line x1="60" y1="33" x2="66" y2="34" stroke={C.stroke} strokeWidth={1.5} strokeLinecap="round" opacity="0.6" />
            </motion.g>

            {/* Eyes — wise, kind */}
            <g>
              {/* Left eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 1, 0.08, 1] }}
                transition={blinkTiming}
                style={{ transformOrigin: '48px 39px' }}
              >
                <circle cx="48" cy="39" r="3.5" fill="white" stroke={C.stroke} strokeWidth={0.8} />
                <motion.circle cx="49" cy="38.5" r="2" fill={C.eyes}
                  animate={speaking ? { cx: [49, 49.5, 48.5, 49] } : { cx: [49, 49.2, 49] }}
                  transition={speaking ? loopSmooth(2) : idleLoop(3.5)}
                />
                <circle cx="49.5" cy="37.5" r="0.8" fill="white" />
              </motion.g>

              {/* Right eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 1, 0.08, 1] }}
                transition={blinkTiming}
                style={{ transformOrigin: '62px 39px' }}
              >
                <circle cx="62" cy="39" r="3.5" fill="white" stroke={C.stroke} strokeWidth={0.8} />
                <motion.circle cx="61" cy="38.5" r="2" fill={C.eyes}
                  animate={speaking ? { cx: [61, 61.5, 60.5, 61] } : { cx: [61, 61.2, 61] }}
                  transition={speaking ? loopSmooth(2, 0.1) : idleLoop(3.5, 0.1)}
                />
                <circle cx="61.5" cy="37.5" r="0.8" fill="white" />
              </motion.g>
            </g>

            {/* Nose */}
            <ellipse cx="55" cy="44" rx="2" ry="1.5" fill={C.skinLight} opacity="0.6" />

            {/* Beard — soft flowing curves */}
            <motion.g
              animate={speaking ? { y: [0, 0.5, -0.3, 0] } : celebrating ? { y: [0, -0.5, 0.5, 0] } : { y: [0, 0.3, 0] }}
              transition={speaking ? loopSmooth(0.6) : idleLoop(4.5, 0.2)}
            >
              <path
                d="M43,48 Q48,50 55,50 Q62,50 67,48 Q65,62 55,66 Q45,62 43,48 Z"
                fill={C.beard} stroke={C.beardStroke} strokeWidth={1}
              />
              {/* Beard texture lines */}
              <path d="M48,52 Q52,58 50,63" fill="none" stroke={C.beardStroke} strokeWidth={0.6} opacity="0.4" />
              <path d="M55,52 Q55,60 55,65" fill="none" stroke={C.beardStroke} strokeWidth={0.6} opacity="0.4" />
              <path d="M62,52 Q58,58 60,63" fill="none" stroke={C.beardStroke} strokeWidth={0.6} opacity="0.4" />
            </motion.g>

            {/* Mouth (behind beard, shows when speaking) */}
            <motion.ellipse cx="55" cy="48" rx="2.5" ry="1.5" fill="#5D4037"
              animate={speaking ? { ry: [1.5, 3, 1.5] } : { ry: 1.5 }}
              transition={speaking ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' } : {}}
            />

            {/* Kofia cap — teal dome with gold band */}
            <motion.g
              animate={celebrating ? { y: [-0.5, -3, -0.5], rotate: [-1, 2, -1] } : {}}
              transition={celebrating ? loopSmooth(0.9, 0.12) : {}}
              style={{ transformOrigin: '55px 30px' }}
            >
              {/* Cap dome */}
              <path d="M40,30 Q42,18 55,16 Q68,18 70,30 Z" fill={C.kofia} stroke={C.stroke} strokeWidth={1.5} />
              {/* Gold band */}
              <rect x="40" y="28" width="30" height="4" rx="2" fill={C.kofiaBand} />
              {/* Rim */}
              <ellipse cx="55" cy="31" rx="16" ry="3" fill={C.kofia} stroke={C.stroke} strokeWidth={1} />
              {/* Cap highlight */}
              <path d="M48,22 Q55,19 62,22" fill="none" stroke="white" strokeWidth={0.8} opacity="0.3" strokeLinecap="round" />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* Staff sparkles when speaking/celebrating */}
        {(speaking || celebrating) && [0, 1, 2].map(i => (
          <motion.path
            key={i}
            d={`M${86 + (i % 2 ? 3 : -3)},${25 - i * 3} l1.5,-3 l1.5,3 l-1.5,3 z`}
            fill={C.trimGold}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5], y: [0, -8 - i * 4] }}
            transition={{ duration: 1.4, delay: i * 0.35, repeat: celebrating ? 2 : Infinity, repeatDelay: 0.3 }}
          />
        ))}

        {/* Celebration sparkles around body */}
        {celebrating && [
          { x: 25, y: 50, d: 0 }, { x: 75, y: 35, d: 0.1 }, { x: 15, y: 80, d: 0.2 },
          { x: 80, y: 90, d: 0.15 },
        ].map((s, i) => (
          <motion.circle
            key={`cel-${i}`}
            cx={s.x} cy={s.y} r="2.5"
            fill={i % 2 === 0 ? C.trimGold : C.staffOrbGlow}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, delay: s.d, repeat: 2, repeatDelay: 1 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
