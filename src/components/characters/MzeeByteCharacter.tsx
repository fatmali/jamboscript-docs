'use client';

import { motion } from 'framer-motion';

interface MzeeByteCharacterProps {
  speaking?: boolean;
  celebrating?: boolean;
}

/**
 * Mzee Byte — The wise elder
 * SVG character with staff and flowing robes
 */
export default function MzeeByteCharacter({ speaking = false, celebrating = false }: MzeeByteCharacterProps) {
  return (
    <motion.div
      animate={
        celebrating
          ? { y: [0, -10, 0], rotate: [0, 3, -3, 0] }
          : speaking
          ? { y: [0, -2, 0] }
          : { y: [0, -4, 0] }
      }
      transition={{
        duration: celebrating ? 0.5 : speaking ? 1.5 : 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative w-full h-full"
    >
      <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-2xl">
        {/* Staff */}
        <line x1="95" y1="15" x2="95" y2="120" stroke="#8B6914" strokeWidth="4" strokeLinecap="round" />
        <circle cx="95" cy="12" r="6" fill="#14B8A6" opacity="0.8" />
        <motion.circle
          cx="95"
          cy="12"
          r="8"
          fill="none"
          stroke="#14B8A6"
          strokeWidth="1"
          opacity="0.4"
          animate={{ r: [8, 12, 8], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Body / Robes */}
        <path
          d="M 35 55 Q 30 80 30 110 L 75 115 Q 80 80 75 55 Z"
          fill="#312E81"
        />
        <path
          d="M 37 55 Q 33 78 33 108 L 72 112 Q 76 78 72 55 Z"
          fill="#3B3875"
        />

        {/* Robe pattern */}
        <path
          d="M 40 70 Q 55 65 68 70"
          stroke="#FACC15"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M 38 85 Q 55 80 70 85"
          stroke="#FACC15"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />

        {/* Arms */}
        <path
          d="M 35 65 Q 25 70 28 80"
          stroke="#3B3875"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 75 65 Q 85 68 90 75"
          stroke="#3B3875"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Head */}
        <circle cx="55" cy="38" r="18" fill="#8B6914" />
        <circle cx="55" cy="40" r="16" fill="#A07D1C" />

        {/* Eyes — wise, slightly narrowed */}
        <motion.g
          animate={speaking ? { scaleY: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.4, repeat: speaking ? Infinity : 0, repeatDelay: 2.5 }}
        >
          <ellipse cx="48" cy="36" rx="3.5" ry="3" fill="white" />
          <ellipse cx="62" cy="36" rx="3.5" ry="3" fill="white" />
          <circle cx="49" cy="36" r="2" fill="#1E1B4B" />
          <circle cx="63" cy="36" r="2" fill="#1E1B4B" />
          <circle cx="49.5" cy="35" r="0.8" fill="white" />
          <circle cx="63.5" cy="35" r="0.8" fill="white" />
        </motion.g>

        {/* Eyebrows */}
        <path d="M 43 31 Q 48 28 53 31" stroke="#6B5311" strokeWidth="1.5" fill="none" />
        <path d="M 57 31 Q 62 28 67 31" stroke="#6B5311" strokeWidth="1.5" fill="none" />

        {/* Beard */}
        <path
          d="M 42 46 Q 48 60 55 62 Q 62 60 68 46"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M 44 46 Q 50 58 55 60 Q 60 58 66 46"
          fill="#F5F5F5"
        />

        {/* Hat / Kofia */}
        <path
          d="M 37 30 Q 38 15 55 10 Q 72 15 73 30"
          fill="#14B8A6"
        />
        <ellipse cx="55" cy="30" rx="18" ry="4" fill="#14B8A6" />
        <path
          d="M 42 24 Q 55 18 68 24"
          stroke="#FACC15"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Feet */}
        <ellipse cx="40" cy="116" rx="10" ry="4" fill="#2D2A5E" />
        <ellipse cx="65" cy="116" rx="10" ry="4" fill="#2D2A5E" />
      </svg>

      {/* Speaking indicator */}
      {speaking && (
        <motion.div
          className="absolute -left-2 top-1/4"
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <span className="text-lg">🔮</span>
        </motion.div>
      )}
    </motion.div>
  );
}
