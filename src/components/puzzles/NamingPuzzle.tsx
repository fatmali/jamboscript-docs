'use client';

import React, { useState, useCallback } from 'react';
import CodeEditor from '@/components/CodeEditor';
import VillageScene from '@/components/scenes/VillageScene';
import { execute } from '@/lib/jamboscript';
import { useGameState } from '@/lib/gameState';
import { playSound, initAudio } from '@/lib/sound';

interface NamingPuzzleProps {
  onComplete: () => void;
}

export default function NamingPuzzle({ onComplete }: NamingPuzzleProps) {
  const { 
    storyVariables, 
    puzzles, 
    setStoryVariable, 
    updatePuzzleState,
    lastCode,
    setLastCode,
  } = useGameState();
  
  const [code, setCode] = useState(lastCode.naming || '');
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  
  const { jina } = storyVariables;
  const isComplete = puzzles.naming.completed;
  
  const handleRun = useCallback(() => {
    initAudio();
    playSound('run');
    setLastCode('naming', code);
    
    const result = execute(code);
    
    if (!result.success) {
      setError(result.error || 'Kosa lisilojulikana');
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    // Check if 'jina' variable was defined
    const extractedName = result.variables['jina'];
    
    if (!extractedName || typeof extractedName !== 'string') {
      setError('Jina halikupatikana. Jaribu kutumia "jina".');
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    // Success!
    setError(null);
    setStoryVariable('jina', extractedName);
    updatePuzzleState('naming', { 
      completed: true, 
      attempts: attempts + 1,
      lastResult: result,
    });
    
    playSound('success');
    
    // Delay before moving to next puzzle
    setTimeout(() => {
      onComplete();
    }, 2000);
    
  }, [code, attempts, setLastCode, setStoryVariable, updatePuzzleState, onComplete]);
  
  return (
    <div className="h-full flex flex-col">
      {/* Visual Scene - takes most of the space */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-sky-100 to-emerald-100 p-4">
        <VillageScene className="max-h-full" />
      </div>
      
      {/* Success message overlay */}
      {isComplete && jina && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="bg-stone-800 rounded-xl p-6 text-center shadow-2xl border border-amber-500/30">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-xl text-white font-bold">Karibu, {jina}!</p>
            <p className="text-stone-400 text-sm mt-2">Inaendelea...</p>
          </div>
        </div>
      )}
      
      {/* Code Editor - fixed at bottom */}
      {!isComplete && (
        <div className="flex-shrink-0 border-t border-stone-700 bg-stone-900 p-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-red-200 text-sm mb-3">
              ⚠️ {error}
            </div>
          )}
          <div className="bg-stone-800 rounded-lg border border-stone-600">
            <CodeEditor
              value={code}
              onChange={setCode}
              onRun={handleRun}
              placeholder='acha jina = "..."'
            />
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={handleRun}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>▶</span> Endesha
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
