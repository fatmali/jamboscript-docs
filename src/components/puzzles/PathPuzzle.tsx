'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import ForestScene from '@/components/scenes/ForestScene';
import { execute } from '@/lib/jamboscript';
import { useGameState } from '@/lib/gameState';
import { playSound, initAudio } from '@/lib/sound';

interface PathPuzzleProps {
  onComplete: () => void;
}

export default function PathPuzzle({ onComplete }: PathPuzzleProps) {
  const { 
    storyVariables, 
    puzzles, 
    setStoryVariable, 
    updatePuzzleState,
    lastCode,
    setLastCode,
  } = useGameState();
  
  const [code, setCode] = useState(lastCode.path || '');
  const [error, setError] = useState<string | null>(null);
  const [wrongPath, setWrongPath] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const { jina, wakati, njia } = storyVariables;
  const isComplete = puzzles.path.completed;
  
  // Set up initial wakati variable (randomly choose day or night)
  useEffect(() => {
    if (!wakati) {
      const time = Math.random() > 0.5 ? 'mchana' : 'usiku';
      setStoryVariable('wakati', time);
    }
  }, [wakati, setStoryVariable]);
  
  const handleRun = useCallback(() => {
    initAudio();
    playSound('run');
    setLastCode('path', code);
    setWrongPath(false);
    
    // Inject the saa (time) variable before execution
    // Note: We use 'saa' instead of 'wakati' because 'wakati' is the JamboScript keyword for 'while'
    const codeWithContext = `acha saa = "${wakati}"\n${code}`;
    const result = execute(codeWithContext);
    
    if (!result.success) {
      setError(result.error || 'Kosa lisilojulikana');
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    // Check if 'njia' variable was defined
    const chosenPath = result.variables['njia'];
    
    if (!chosenPath || typeof chosenPath !== 'string') {
      setError('Chagua njia! Weka "njia" kuwa "kushoto" au "kulia".');
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    // Update story variable
    setStoryVariable('njia', chosenPath);
    
    // Check if correct path was chosen
    const correctPath = wakati === 'mchana' ? 'kushoto' : 'kulia';
    
    if (chosenPath !== correctPath) {
      setError(null);
      setWrongPath(true);
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    // Success!
    setError(null);
    updatePuzzleState('path', { 
      completed: true, 
      attempts: attempts + 1,
      lastResult: result,
    });
    
    playSound('success');
    
    setTimeout(() => {
      onComplete();
    }, 2000);
    
  }, [code, wakati, attempts, setLastCode, setStoryVariable, updatePuzzleState, onComplete]);
  
  const resetPath = () => {
    setWrongPath(false);
    setStoryVariable('njia', undefined);
  };
  
  const isDay = wakati === 'mchana';
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Story Context Panel - visible on mobile, hidden on large screens where ContextualGuide shows */}
      <div className="lg:hidden flex-shrink-0 bg-gradient-to-b from-stone-900 to-stone-800 p-4 border-b border-stone-700">
        <div className="text-center space-y-3">
          {/* Current time indicator */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">{isDay ? '☀️' : '🌙'}</span>
            <span className="text-xl font-bold text-white">saa = &quot;{isDay ? 'mchana' : 'usiku'}&quot;</span>
          </div>
          
          {/* Story hint */}
          <p className="text-stone-300 italic text-sm">
            {isDay 
              ? 'Kobe alisema: "Mchana, chagua kushoto."' 
              : 'Kobe alisema: "Usiku, chagua kulia."'
            }
          </p>
          
          {/* Path choices */}
          <div className="flex justify-center gap-3">
            <div className={`px-3 py-2 rounded-lg transition-all text-sm ${isDay ? 'bg-amber-500/20 ring-1 ring-amber-500/50' : 'opacity-40'}`}>
              ← kushoto
            </div>
            <div className={`px-3 py-2 rounded-lg transition-all text-sm ${!isDay ? 'bg-blue-500/20 ring-1 ring-blue-500/50' : 'opacity-40'}`}>
              kulia →
            </div>
          </div>
          
          {/* Code hint */}
          <p className="text-stone-500 text-xs">
            Tumia: <code className="text-amber-400">kama (saa ni &quot;...&quot;) {'{'} acha njia = &quot;...&quot; {'}'}</code>
          </p>
        </div>
      </div>
      
      {/* Visual Scene - takes most of the space */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-emerald-900 to-stone-900 p-4">
        <ForestScene className="max-h-full" />
      </div>
      
      {/* Wrong path overlay */}
      {wrongPath && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="bg-stone-800 rounded-xl p-6 text-center shadow-2xl border border-red-500/30 max-w-sm">
            <div className="text-4xl mb-3">🌑</div>
            <p className="text-xl text-white font-bold mb-2">Njia imezuiwa!</p>
            <p className="text-stone-400 text-sm mb-4">Giza sana. Fikiria tena kuhusu saa.</p>
            <button
              onClick={resetPath}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
            >
              ← Jaribu tena
            </button>
          </div>
        </div>
      )}
      
      {/* Success overlay */}
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="bg-stone-800 rounded-xl p-6 text-center shadow-2xl border border-amber-500/30">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-xl text-white font-bold">Njia sahihi, {jina}!</p>
            <p className="text-stone-400 text-sm mt-2">Inaendelea...</p>
          </div>
        </div>
      )}
      
      {/* Code Editor - fixed at bottom */}
      {!isComplete && !wrongPath && (
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
              placeholder={`# saa = "${wakati}"\nacha njia = "..."`}
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
