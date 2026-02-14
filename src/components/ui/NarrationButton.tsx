'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak, stop, isSpeaking, isTTSSupported } from '@/lib/narration';
import type { Dialogue } from '@/lib/types';

interface NarrationButtonProps {
  /** The text to read aloud */
  text: string;
  /** Which character is speaking (affects voice pitch/rate) */
  speaker: Dialogue['speaker'];
  /** Current locale for voice selection */
  lang?: string;
  /** Compact mode — icon only, no label */
  compact?: boolean;
}

/**
 * A small button that reads a dialogue line aloud using TTS.
 * Shows a speaker icon that animates while narrating.
 */
export default function NarrationButton({
  text,
  speaker,
  lang = 'sw',
  compact = true,
}: NarrationButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  // Poll speaking state (Web Speech API has no reliable "speaking" event
  // across browsers, so a short poll is the most robust approach)
  useEffect(() => {
    if (!speaking) return;

    const interval = setInterval(() => {
      if (!isSpeaking()) {
        setSpeaking(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [speaking]);

  // Stop on unmount
  useEffect(() => {
    return () => {
      if (speaking) stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Don't trigger dialogue advance

      if (speaking) {
        stop();
        setSpeaking(false);
        return;
      }

      setSpeaking(true);
      speak(text, speaker, lang, () => setSpeaking(false)).catch(() => {
        setSpeaking(false);
      });
    },
    [speaking, text, speaker, lang]
  );

  if (!isTTSSupported()) return null;

  return (
    <button
      onClick={handleClick}
      className={`
        group relative inline-flex items-center gap-1.5 rounded-full transition-all
        ${compact
          ? 'w-8 h-8 justify-center bg-white/5 hover:bg-white/10'
          : 'px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-text-secondary hover:text-text-primary'
        }
      `}
      aria-label={speaking ? 'Stop narration' : 'Read aloud'}
      title={speaking ? 'Stop narration' : 'Read aloud'}
    >
      <AnimatePresence mode="wait">
        {speaking ? (
          <motion.span
            key="stop"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            {/* Sound wave animation */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-secondary">
              <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" opacity="0.4" />
              <motion.path
                d="M15.54 8.46a5 5 0 010 7.07"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.path
                d="M19.07 4.93a10 10 0 010 14.14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </svg>
          </motion.span>
        ) : (
          <motion.span
            key="play"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {/* Speaker icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-text-muted group-hover:text-secondary transition-colors">
              <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" opacity="0.3" />
              <path
                d="M11 5L6 9H2v6h4l5 4V5z M15.54 8.46a5 5 0 010 7.07"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
