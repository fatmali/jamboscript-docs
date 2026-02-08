'use client';

import React, { useState, useEffect } from 'react';

interface StoryTextProps {
  children: React.ReactNode;
  speaker?: 'kobe' | 'narrator' | 'villager';
  typewriter?: boolean;
  delay?: number;
  onComplete?: () => void;
}

export default function StoryText({
  children,
  speaker,
  typewriter = false,
  delay = 30,
  onComplete,
}: StoryTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(!typewriter);
  
  const text = typeof children === 'string' ? children : '';
  
  useEffect(() => {
    if (!typewriter) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }
    
    setDisplayedText('');
    setIsComplete(false);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, delay);
    
    return () => clearInterval(timer);
  }, [text, typewriter, delay, onComplete]);
  
  const getSpeakerStyle = () => {
    switch (speaker) {
      case 'kobe':
        return 'border-l-4 border-amber-500 pl-4 italic text-amber-100';
      case 'villager':
        return 'border-l-4 border-blue-400 pl-4 text-blue-100';
      default:
        return 'text-stone-200';
    }
  };
  
  const getSpeakerLabel = () => {
    switch (speaker) {
      case 'kobe':
        return '🐢 Kobe:';
      case 'villager':
        return '👤 Mkazi:';
      default:
        return null;
    }
  };
  
  return (
    <div className={`mb-4 ${getSpeakerStyle()}`}>
      {getSpeakerLabel() && (
        <span className="block text-xs uppercase tracking-wide opacity-70 mb-1">
          {getSpeakerLabel()}
        </span>
      )}
      <p className="leading-relaxed text-lg">
        {typewriter ? displayedText : children}
        {typewriter && !isComplete && (
          <span className="animate-pulse ml-0.5">▊</span>
        )}
      </p>
    </div>
  );
}

// Component for the completion celebration
export function ChapterComplete({ playerName }: { playerName: string }) {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-amber-400 mb-2">
        Hongera, {playerName}!
      </h2>
      <p className="text-stone-300 text-lg">
        Umefanya vizuri sana. Safari yako imeanza.
      </p>
      <div className="mt-6 text-stone-500 text-sm">
        Sura ya Kwanza - Imekamilika ✓
      </div>
    </div>
  );
}
