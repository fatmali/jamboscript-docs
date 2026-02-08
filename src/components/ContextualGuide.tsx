'use client';

import React from 'react';
import { PuzzleId, useGameState } from '@/lib/gameState';
import { useTranslations } from 'next-intl';

interface ContextualGuideProps {
  currentPuzzle: PuzzleId;
}

export default function ContextualGuide({ currentPuzzle }: ContextualGuideProps) {
  const { puzzles, storyVariables } = useGameState();
  const t = useTranslations('ContextualGuide');
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-stone-800/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐢</span>
          <div>
            <h1 className="text-lg font-bold text-amber-400">{t('headerTitle')}</h1>
            <p className="text-xs text-stone-500">{t('headerSubtitle')}</p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {currentPuzzle === 'naming' && <NamingGuide completed={puzzles.naming.completed} jina={storyVariables.jina} t={t} />}
        {currentPuzzle === 'path' && <PathGuide completed={puzzles.path.completed} wakati={storyVariables.wakati} jina={storyVariables.jina} t={t} />}
        {currentPuzzle === 'bridge' && <BridgeGuide completed={puzzles.bridge.completed} jina={storyVariables.jina} t={t} />}
      </div>
      
      {/* Footer */}
      <div className="flex-shrink-0 px-6 py-3 border-t border-stone-800/50">
        <a 
          href="https://jamboscript.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-stone-500 hover:text-amber-400 transition-colors"
        >
          Powered by JamboScript →
        </a>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = any;

// ============ NAMING PUZZLE GUIDE ============
function NamingGuide({ completed, jina, t }: { completed: boolean; jina?: string; t: T }) {
  if (completed && jina) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-5xl mb-4">✨</div>
        <p className="text-xl text-stone-200 mb-2">
          <span className="text-emerald-400 font-bold">&quot;{jina}&quot;</span>
        </p>
        <p className="text-stone-400 italic">&quot;{t('namingRemember')}&quot;</p>
        <p className="text-stone-500 text-sm mt-6 animate-pulse">{t('adventureContinues')}</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-8">
      {/* Story - simple and centered */}
      <div className="text-center py-4">
        <p className="text-stone-500 text-sm mb-3">{t('namingMorning')}</p>
        <p className="text-xl text-stone-200 italic leading-relaxed">
          &quot;{t('namingQuestion')}&quot;
        </p>
      </div>
      
      {/* Code instruction - clean card */}
      <div className="bg-stone-800/40 rounded-2xl p-5">
        <p className="text-amber-400 text-sm font-medium mb-3">{t('writeThis')}:</p>
        
        <div className="bg-stone-950 rounded-xl p-4 font-mono">
          <span className="text-amber-400">acha</span>{' '}
          <span className="text-white">jina</span>{' '}
          <span className="text-stone-500">=</span>{' '}
          <span className="text-emerald-400">&quot;{t('namingPlaceholder')}&quot;</span>
        </div>
        
        <p className="text-stone-500 text-sm mt-3">
          ↑ {t('namingReplace')}
        </p>
      </div>
      
      {/* Keyword hint - minimal */}
      <div className="text-center text-sm text-stone-600">
        <span className="text-amber-500/70 font-mono">acha</span> = {t('kwAcha')}
      </div>
    </div>
  );
}

// ============ PATH PUZZLE GUIDE ============
function PathGuide({ completed, wakati, jina, t }: { completed: boolean; wakati?: string; jina?: string; t: T }) {
  if (completed) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-5xl mb-4">✨</div>
        <p className="text-xl text-stone-200 mb-2">{t('pathFound')}</p>
        <p className="text-stone-400 italic">&quot;{t('pathSmartChoice', { jina })}&quot;</p>
        <p className="text-stone-500 text-sm mt-6 animate-pulse">{t('adventureContinues')}</p>
      </div>
    );
  }
  
  const isDay = wakati === 'mchana';
  
  return (
    <div className="p-6 space-y-8">
      {/* Current time - big and clear */}
      <div className="text-center py-2">
        <div className="text-5xl mb-2">{isDay ? '☀️' : '🌙'}</div>
        <p className="text-2xl font-bold text-white">{isDay ? t('daytime') : t('nighttime')}</p>
      </div>
      
      {/* Story hint */}
      <div className="text-center px-4">
        <p className="text-stone-300 italic leading-relaxed">
          {isDay 
            ? `"${t('pathDayHint')}"` 
            : `"${t('pathNightHint')}"` 
          }
        </p>
      </div>
      
      {/* The choice visual */}
      <div className="flex justify-center gap-4">
        <div className={`text-center px-5 py-3 rounded-xl transition-all ${isDay ? 'bg-amber-500/20 ring-2 ring-amber-500/50' : 'opacity-30'}`}>
          <div className="text-2xl">← ☀️</div>
          <p className="text-xs text-stone-400 mt-1">kushoto</p>
        </div>
        <div className={`text-center px-5 py-3 rounded-xl transition-all ${!isDay ? 'bg-blue-500/20 ring-2 ring-blue-500/50' : 'opacity-30'}`}>
          <div className="text-2xl">🌙 →</div>
          <p className="text-xs text-stone-400 mt-1">kulia</p>
        </div>
      </div>
      
      {/* Code instruction */}
      <div className="bg-stone-800/40 rounded-2xl p-5">
        <p className="text-amber-400 text-sm font-medium mb-3">{t('writeThis')}:</p>
        
        <div className="bg-stone-950 rounded-xl p-4 font-mono text-sm leading-relaxed">
          <div><span className="text-amber-400">kama</span> (saa <span className="text-sky-400">ni</span> <span className="text-emerald-400">&quot;mchana&quot;</span>) {'{'}</div>
          <div className="pl-4"><span className="text-amber-400">acha</span> njia = <span className="text-emerald-400">&quot;kushoto&quot;</span></div>
          <div>{'}'} <span className="text-amber-400">la sivyo</span> {'{'}</div>
          <div className="pl-4"><span className="text-amber-400">acha</span> njia = <span className="text-emerald-400">&quot;kulia&quot;</span></div>
          <div>{'}'}</div>
        </div>
      </div>
      
      {/* Keyword hints - minimal */}
      <div className="text-center text-sm text-stone-600 space-y-1">
        <div><span className="text-amber-500/70 font-mono">kama</span> = {t('kwKama')}</div>
        <div><span className="text-amber-500/70 font-mono">la sivyo</span> = {t('kwLaSivyo')}</div>
      </div>
    </div>
  );
}

// ============ BRIDGE PUZZLE GUIDE ============
function BridgeGuide({ completed, jina, t }: { completed: boolean; jina?: string; t: T }) {
  if (completed) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-xl font-bold text-emerald-400 mb-2">{t('bridgeCongrats')}</p>
        <p className="text-stone-300">{t('bridgeCrossedSafe', { jina })}</p>
        <p className="text-stone-500 italic mt-4 text-sm">&quot;{t('bridgeProverb')}&quot;</p>
        <div className="mt-8 px-4 py-2 bg-emerald-500/20 rounded-full">
          <p className="text-emerald-400 text-sm font-medium">{t('bridgeChapterDone')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-8">
      {/* Story */}
      <div className="text-center py-2">
        <p className="text-xl text-stone-200 italic leading-relaxed">
          &quot;{t('bridgeQuote')}&quot;
        </p>
      </div>
      
      {/* Bridge visual - simple */}
      <div className="flex justify-center gap-2">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-10 h-3 bg-amber-700 rounded-sm shadow-lg" />
            <span className="text-xs text-stone-600 mt-1">{i}</span>
          </div>
        ))}
      </div>
      
      {/* Code instruction */}
      <div className="bg-stone-800/40 rounded-2xl p-5">
        <p className="text-amber-400 text-sm font-medium mb-3">{t('writeThis')}:</p>
        
        <div className="bg-stone-950 rounded-xl p-4 font-mono text-sm leading-relaxed">
          <div><span className="text-amber-400">acha</span> hatua = <span className="text-sky-400">0</span></div>
          <div className="mt-1"><span className="text-amber-400">wakati</span> (hatua <span className="text-sky-400">chini</span> <span className="text-sky-400">5</span>) {'{'}</div>
          <div className="pl-4">hatua<span className="text-sky-400">++</span></div>
          <div>{'}'}</div>
        </div>
      </div>
      
      {/* Keyword hints - minimal */}
      <div className="text-center text-sm text-stone-600 space-y-1">
        <div><span className="text-amber-500/70 font-mono">wakati</span> = {t('kwWakati')}</div>
        <div><span className="text-amber-500/70 font-mono">hatua++</span> = {t('kwIncrement')}</div>
      </div>
    </div>
  );
}
