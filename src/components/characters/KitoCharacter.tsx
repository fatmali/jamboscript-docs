'use client';

import { motion } from 'framer-motion';

interface KitoCharacterProps {
  speaking?: boolean;
  celebrating?: boolean;
}

/**
 * Kito — The friendly guide tortoise
 * SVG character with idle and speaking animations
 */
export default function KitoCharacter({ speaking = false, celebrating = false }: KitoCharacterProps) {
  return (
    <motion.div
      animate={
        celebrating
          ? { y: [0, -15, 0], rotate: [0, 5, -5, 0] }
          : speaking
          ? { y: [0, -3, 0] }
          : { y: [0, -5, 0] }
      }
      transition={{
        duration: celebrating ? 0.6 : speaking ? 1.2 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative w-full h-full"
    >
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
        {/* Shell */}
        <ellipse cx="60" cy="70" rx="38" ry="30" fill="#2D8B47" />
        <ellipse cx="60" cy="68" rx="34" ry="26" fill="#3DA85C" />

        {/* Shell pattern */}
        <path d="M 40 58 Q 60 48 80 58" stroke="#2D8B47" strokeWidth="2" fill="none" />
        <path d="M 35 68 Q 60 55 85 68" stroke="#2D8B47" strokeWidth="2" fill="none" />
        <path d="M 38 78 Q 60 65 82 78" stroke="#2D8B47" strokeWidth="2" fill="none" />
        <line x1="60" y1="45" x2="60" y2="85" stroke="#2D8B47" strokeWidth="1.5" />

        {/* Head */}
        <ellipse cx="60" cy="40" rx="16" ry="18" fill="#7CB342" />
        <ellipse cx="60" cy="42" rx="14" ry="15" fill="#8BC34A" />

        {/* Eyes */}
        <motion.g
          animate={speaking ? { scaleY: [1, 0.3, 1] } : {}}
          transition={{ duration: 0.3, repeat: speaking ? Infinity : 0, repeatDelay: 2 }}
        >
          <circle cx="53" cy="36" r="4" fill="white" />
          <circle cx="67" cy="36" r="4" fill="white" />
          <circle cx="54" cy="36" r="2.5" fill="#1E1B4B" />
          <circle cx="68" cy="36" r="2.5" fill="#1E1B4B" />
          {/* Sparkle in eyes */}
          <circle cx="55" cy="34.5" r="1" fill="white" />
          <circle cx="69" cy="34.5" r="1" fill="white" />
        </motion.g>

        {/* Smile */}
        <motion.path
          d={celebrating ? "M 53 46 Q 60 54 67 46" : "M 54 45 Q 60 50 66 45"}
          stroke="#2D8B47"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Front legs */}
        <ellipse cx="35" cy="85" rx="8" ry="5" fill="#7CB342" />
        <ellipse cx="85" cy="85" rx="8" ry="5" fill="#7CB342" />

        {/* Back legs */}
        <ellipse cx="30" cy="75" rx="6" ry="4" fill="#7CB342" />
        <ellipse cx="90" cy="75" rx="6" ry="4" fill="#7CB342" />

        {/* Tail */}
        <ellipse cx="97" cy="72" rx="5" ry="3" fill="#7CB342" transform="rotate(20, 97, 72)" />

        {/* Hat / cap (explorer) */}
        <ellipse cx="60" cy="26" rx="18" ry="4" fill="#FACC15" />
        <path d="M 45 26 Q 48 14 60 12 Q 72 14 75 26" fill="#FACC15" />
        <rect x="55" y="10" width="10" height="3" rx="1.5" fill="#EAB308" />
      </svg>

      {/* Speaking indicator */}
      {speaking && (
        <motion.div
          className="absolute -right-2 top-1/4"
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-lg">💬</span>
        </motion.div>
      )}
    </motion.div>
  );
}
