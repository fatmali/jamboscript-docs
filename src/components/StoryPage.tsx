'use client';

import React, { useState, useCallback } from 'react';
import { useGameState, PuzzleId } from '@/lib/gameState';
import NamingPuzzle from '@/components/puzzles/NamingPuzzle';
import PathPuzzle from '@/components/puzzles/PathPuzzle';
import BridgePuzzle from '@/components/puzzles/BridgePuzzle';
import ContextualGuide from '@/components/ContextualGuide';
import { ChapterComplete } from '@/components/StoryText';
import { initAudio } from '@/lib/sound';

export default function StoryPage() {
  const { 
    currentPuzzle, 
    setCurrentPuzzle, 
    chapterComplete,
    completeChapter,
    storyVariables,
    resetGame,
  } = useGameState();
  
  const [started, setStarted] = useState(false);
  
  const handleStart = () => {
    initAudio();
    setStarted(true);
  };
  
  const handlePuzzleComplete = useCallback((nextPuzzle?: PuzzleId) => {
    if (nextPuzzle) {
      setTimeout(() => setCurrentPuzzle(nextPuzzle), 500);
    }
  }, [setCurrentPuzzle]);
  
  const handleChapterComplete = useCallback(() => {
    completeChapter();
  }, [completeChapter]);
  
  // Intro screen
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-6">🐢</div>
          <h1 className="text-4xl font-bold text-amber-400 mb-4">
            Safari ya Kobe
          </h1>
          <p className="text-stone-300 text-lg mb-2">
            Sura ya Kwanza
          </p>
          <p className="text-stone-400 mb-8">
            Hadithi ya kushangaza kuhusu msafiri asiyejulikana na kobe mwenye busara.
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white text-xl rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            Anza Safari
          </button>
          <p className="text-stone-500 text-sm mt-6">
            Lugha ya JamboScript • Kwa watoto wa miaka 9-12
          </p>
        </div>
      </div>
    );
  }
  
  // Chapter complete screen
  if (chapterComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
        <div className="max-w-lg">
          <ChapterComplete playerName={storyVariables.jina || 'Msafiri'} />
          <div className="text-center mt-8">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg transition-colors"
            >
              Anza Tena
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Main game view - split screen
  return (
    <div className="min-h-screen bg-stone-900 flex flex-col lg:flex-row">
      {/* Left Panel: Contextual Guide */}
      <div className="hidden lg:flex lg:w-1/2 h-screen flex-col bg-stone-900 border-r border-stone-700">
        <ContextualGuide currentPuzzle={currentPuzzle} />
      </div>
      
      {/* Right Panel: Interactive Game (Story & World) */}
      <div className="lg:w-1/2 h-screen flex flex-col bg-gradient-to-b from-stone-800 to-stone-900">
        {/* Progress indicator */}
        <div className="flex-shrink-0 px-4 py-3 bg-stone-800/50 border-b border-stone-700">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['naming', 'path', 'bridge'] as PuzzleId[]).map((puzzle, index) => (
                <div
                  key={puzzle}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentPuzzle === puzzle 
                      ? 'bg-amber-500' 
                      : index < ['naming', 'path', 'bridge'].indexOf(currentPuzzle)
                        ? 'bg-emerald-500'
                        : 'bg-stone-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-stone-500">Sura ya 1</span>
          </div>
        </div>
        
        {/* Puzzle content */}
        <div className="flex-1 overflow-hidden">
          {currentPuzzle === 'naming' && (
            <NamingPuzzle onComplete={() => handlePuzzleComplete('path')} />
          )}
          {currentPuzzle === 'path' && (
            <PathPuzzle onComplete={() => handlePuzzleComplete('bridge')} />
          )}
          {currentPuzzle === 'bridge' && (
            <BridgePuzzle onComplete={handleChapterComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
