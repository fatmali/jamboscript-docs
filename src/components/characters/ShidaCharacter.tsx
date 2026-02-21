'use client';

import { motion } from 'framer-motion';
import {
  shidaPalette as C,
  idleLoop,
  loopSmooth,
  blinkTiming,
  SVG_DEFAULTS,
} from '@/lib/animation';

interface ShidaCharacterProps {
  speaking?: boolean;
  celebrating?: boolean;
}

/**
 * Shida — The mischievous glitch-bug antagonist 👾
 *
 * Rounded rectangular body with jittery, erratic movement.
 * Asymmetric golden eyes on dark sclera, zigzag grin, bouncing
 * antennae, 6 scuttling legs, and subtle glitch RGB strips.
 *
 * Intentionally more chaotic than Kito/Mzee but still within
 * the same design language: rounded shapes, consistent strokes,
 * warm saturated palette.
 */
export default function ShidaCharacter({ speaking = false, celebrating = false }: ShidaCharacterProps) {
  const legSpeed = celebrating ? 0.5 : speaking ? 1 : 2;

  return (
    <motion.div
      className="relative w-full h-full"
      animate={celebrating ? { rotate: [0, 5, -5, 3, -3, 0], scale: [1, 1.06, 0.96, 1.03, 1] } : {}}
      transition={celebrating ? { duration: 1, ease: 'easeInOut' } : {}}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
      >
        <defs>
          <radialGradient id="s-body" cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor={C.bodyLight} />
            <stop offset="100%" stopColor={C.bodyDark} />
          </radialGradient>
          <linearGradient id="s-leg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={C.legs} />
            <stop offset="100%" stopColor={C.legsDark} />
          </linearGradient>
        </defs>

        {/* Subtle aura ring — single, clean, not chaotic */}
        <motion.ellipse cx="60" cy="60" rx="52" ry="50"
          fill="none" stroke={C.bodyLight} strokeWidth="0.8" strokeDasharray="6 4" opacity="0.15"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '60px 60px' }}
        />

        {/* ── BODY GROUP — jittery erratic movement ── */}
        <motion.g
          animate={{
            y: celebrating ? [0, -6, 2, -4, 1, -2, 0] : speaking ? [0, 1.5, -1.5, 1, -0.5, 0] : [0, -2, 0.5, -1, 0],
            x: celebrating ? [0, 2, -2, 1, -1, 0] : speaking ? [0, 1, -1, 0.5, 0] : [0, 0.3, -0.3, 0],
            rotate: celebrating ? [0, 3, -5, 8, -3, 0] : speaking ? [0, 0.5, -0.5, 0] : [0, 0.3, -0.3, 0],
          }}
          transition={celebrating ? { duration: 0.8, ease: 'easeInOut' } : idleLoop(speaking ? 1.2 : 3)}
          style={{ transformOrigin: '60px 60px' }}
        >

          {/* ── Legs — 3 pairs, staggered scuttle ── */}
          {[0, 1, 2].map(i => (
            <motion.g key={`legs-${i}`}>
              {/* Left leg */}
              <motion.g
                animate={{ rotate: [-8, 8, -8] }}
                transition={loopSmooth(legSpeed, i * 0.15)}
                style={{ transformOrigin: `38px ${50 + i * 12}px` }}
              >
                <line x1="38" y1={50 + i * 12} x2="22" y2={52 + i * 12}
                  stroke="url(#s-leg)" strokeWidth={3} strokeLinecap="round" />
                <circle cx="22" cy={52 + i * 12} r="2.5" fill={C.legsDark} />
              </motion.g>
              {/* Right leg */}
              <motion.g
                animate={{ rotate: [8, -8, 8] }}
                transition={loopSmooth(legSpeed, i * 0.15 + 0.08)}
                style={{ transformOrigin: `82px ${50 + i * 12}px` }}
              >
                <line x1="82" y1={50 + i * 12} x2="98" y2={52 + i * 12}
                  stroke="url(#s-leg)" strokeWidth={3} strokeLinecap="round" />
                <circle cx="98" cy={52 + i * 12} r="2.5" fill={C.legsDark} />
              </motion.g>
            </motion.g>
          ))}

          {/* ── Body shell — rounded rectangle ── */}
          <motion.g
            animate={{
              scaleX: celebrating ? [1, 1.06, 0.95, 1.03, 1] : speaking ? [1, 1.03, 0.98, 1] : [1, 1.01, 0.99, 1],
              scaleY: celebrating ? [1, 0.95, 1.06, 0.98, 1] : speaking ? [1, 0.98, 1.02, 1] : [1, 0.99, 1.01, 1],
            }}
            transition={idleLoop(celebrating ? 0.5 : speaking ? 0.8 : 3.5)}
            style={{ transformOrigin: '60px 62px' }}
          >
            {/* Main body */}
            <rect x="36" y="40" width="48" height="44" rx="14" fill="url(#s-body)" stroke={C.stroke} {...SVG_DEFAULTS} />

            {/* Inner body highlight */}
            <rect x="40" y="44" width="40" height="36" rx="11" fill={C.body} opacity="0.5" />

            {/* Subtle glitch strips on edges */}
            <rect x="37" y="48" width="2" height="28" rx="1" fill={C.glitchBlue} opacity="0.2" />
            <rect x="81" y="48" width="2" height="28" rx="1" fill={C.glitchGreen} opacity="0.2" />

            {/* Scanline — single subtle sweep */}
            <motion.rect x="40" y="44" width="40" height="1.5" rx="0.75" fill="white" opacity="0.08"
              animate={{ y: [44, 76] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* ── Eyes — asymmetric, expressive ── */}
            <g>
              {/* Big left eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 1, 0.1, 1] }}
                transition={{ ...blinkTiming, duration: 4 }}
                style={{ transformOrigin: '50px 55px' }}
              >
                <circle cx="50" cy="55" r="9" fill={C.eyesSclera} stroke={C.stroke} strokeWidth={1.5} />
                <circle cx="50" cy="55" r="7" fill={C.eyes} />
                <motion.circle cx="51" cy="54" r="3" fill={C.eyesSclera}
                  animate={speaking ? { cx: [51, 53, 49, 51], cy: [54, 53, 55, 54] } : { cx: [51, 52, 50, 51] }}
                  transition={speaking ? loopSmooth(1.2) : idleLoop(3.5)}
                />
                <circle cx="52.5" cy="52" r="1.5" fill="white" opacity="0.8" />
              </motion.g>

              {/* Small right eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 1, 0.1, 1] }}
                transition={{ ...blinkTiming, duration: 4 }}
                style={{ transformOrigin: '72px 53px' }}
              >
                <circle cx="72" cy="53" r="7" fill={C.eyesSclera} stroke={C.stroke} strokeWidth={1.5} />
                <circle cx="72" cy="53" r="5" fill={C.eyes} />
                <motion.circle cx="73" cy="52" r="2.5" fill={C.eyesSclera}
                  animate={speaking ? { cx: [73, 71, 74, 73], cy: [52, 53, 51, 52] } : { cx: [73, 74, 72, 73] }}
                  transition={speaking ? loopSmooth(1.2, 0.1) : idleLoop(3.5, 0.15)}
                />
                <circle cx="74" cy="50.5" r="1.2" fill="white" opacity="0.8" />
              </motion.g>
            </g>

            {/* Mouth — zigzag grin */}
            <motion.path
              d={celebrating ? 'M44,72 Q50,80 56,72 Q62,80 68,72 Q74,78 76,72' : 'M46,72 Q52,77 58,72 Q64,77 70,72'}
              fill="none" stroke={C.mouth} strokeWidth={2.5} strokeLinecap="round"
              animate={speaking ? {
                d: ['M46,72 Q52,77 58,72 Q64,77 70,72', 'M46,73 Q52,74 58,73 Q64,74 70,73', 'M46,71 Q52,78 58,71 Q64,78 70,71', 'M46,72 Q52,77 58,72 Q64,77 70,72'],
              } : {}}
              transition={speaking ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' } : {}}
            />

            {/* Teeth visible when celebrating */}
            {celebrating && (
              <g>
                <rect x="52" y="73" width="3" height="3" rx="1" fill="white" opacity="0.8" />
                <rect x="58" y="74" width="3" height="2.5" rx="1" fill="white" opacity="0.8" />
                <rect x="64" y="73" width="3" height="3" rx="1" fill="white" opacity="0.8" />
              </g>
            )}
          </motion.g>

          {/* ── Left antenna ── */}
          <motion.g
            animate={celebrating
              ? { rotate: [-5, 10, -15, 8, -5] }
              : speaking ? { rotate: [-2, 4, -2] }
              : { rotate: [-1, 2, -1] }
            }
            transition={celebrating ? loopSmooth(0.5) : idleLoop(speaking ? 1.5 : 3, 0.1)}
            style={{ transformOrigin: '48px 42px' }}
          >
            <line x1="48" y1="42" x2="35" y2="22" stroke={C.legs} strokeWidth={2.5} strokeLinecap="round" />
            <motion.circle cx="35" cy="22" r="5" fill={C.antennae}
              animate={{ scale: [1, 1.1, 1] }}
              transition={idleLoop(2.5)}
            />
            <circle cx="35" cy="22" r="8" fill={C.antennaGlow} opacity="0.15" />
            <circle cx="34" cy="21" r="1.5" fill="white" opacity="0.4" />
          </motion.g>

          {/* ── Right antenna ── */}
          <motion.g
            animate={celebrating
              ? { rotate: [5, -10, 15, -8, 5] }
              : speaking ? { rotate: [2, -4, 2] }
              : { rotate: [1, -2, 1] }
            }
            transition={celebrating ? loopSmooth(0.55) : idleLoop(speaking ? 1.6 : 3.2, 0.15)}
            style={{ transformOrigin: '72px 42px' }}
          >
            <line x1="72" y1="42" x2="85" y2="24" stroke={C.legs} strokeWidth={2.5} strokeLinecap="round" />
            <motion.circle cx="85" cy="24" r="5" fill={C.antennae}
              animate={{ scale: [1, 1.1, 1] }}
              transition={idleLoop(2.8, 0.2)}
            />
            <circle cx="85" cy="24" r="8" fill={C.antennaGlow} opacity="0.15" />
            <circle cx="84" cy="23" r="1.5" fill="white" opacity="0.4" />
          </motion.g>
        </motion.g>

        {/* Glitch particles — fewer, cleaner */}
        {(speaking || celebrating) && [0, 1, 2].map(i => (
          <motion.rect
            key={`g-${i}`}
            x={42 + i * 14} y={38} width={3} height={3} rx={0.5}
            fill={i % 2 === 0 ? C.bodyLight : C.antennae}
            animate={{ y: [38, 25], opacity: [0.6, 0], rotate: [0, 45] }}
            transition={{ duration: celebrating ? 0.8 : 2, repeat: celebrating ? 3 : Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* Celebration pixel burst — contained, decays */}
        {celebrating && [0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.rect
            key={`b-${i}`}
            x="59" y="59" width="3" height="3" rx="0.5"
            fill={i % 2 === 0 ? C.bodyLight : C.antennae}
            initial={{ opacity: 0 }}
            animate={{
              x: [60, 60 + Math.cos((angle * Math.PI) / 180) * 28],
              y: [60, 60 + Math.sin((angle * Math.PI) / 180) * 28],
              opacity: [1, 0],
              rotate: [0, 120],
            }}
            transition={{ duration: 0.9, repeat: 2, delay: i * 0.06, repeatDelay: 0.5 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
