'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import BridgeScene from '@/components/scenes/BridgeScene';
import { execute, transpile } from '@/lib/jamboscript';
import { useGameState } from '@/lib/gameState';
import { playSound, initAudio } from '@/lib/sound';

interface BridgePuzzleProps {
  onComplete: () => void;
}

export default function BridgePuzzle({ onComplete }: BridgePuzzleProps) {
  const { 
    storyVariables, 
    puzzles, 
    bridgeState,
    updatePuzzleState,
    updateBridgeState,
    lastCode,
    setLastCode,
  } = useGameState();
  
  const [code, setCode] = useState(lastCode.bridge || '');
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { jina } = storyVariables;
  const { currentStep, maxSteps, collapsed } = bridgeState;
  const isComplete = puzzles.bridge.completed;
  
  // Reset bridge state when component mounts
  useEffect(() => {
    updateBridgeState({ currentStep: 0, collapsed: false });
  }, []);
  
  // Animate steps with sounds
  const animateSteps = useCallback(async (steps: number) => {
    setIsAnimating(true);
    
    for (let i = 1; i <= steps && i <= maxSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      playSound('step');
      updateBridgeState({ currentStep: i });
      
      if (i === maxSteps) {
        await new Promise(resolve => setTimeout(resolve, 300));
        playSound('loopComplete');
      }
    }
    
    setIsAnimating(false);
  }, [maxSteps, updateBridgeState]);
  
  const handleRun = useCallback(async () => {
    if (isAnimating) return;
    
    initAudio();
    playSound('run');
    setLastCode('bridge', code);
    setError(null);
    
    updateBridgeState({ currentStep: 0, collapsed: false });
    
    const transpiled = transpile(code);
    if (!transpiled.success) {
      setError(transpiled.error || 'Kosa la uandishi');
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    const result = execute(code);
    
    if (!result.success) {
      setError(result.error || 'Kosa lisilojulikana');
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    const steps = result.variables['hatua'];
    const hasLoop = code.includes('wakati') || code.includes('rudia');
    
    const stepCount = result.output.filter(line => 
      line.toLowerCase().includes('hatua') || 
      line.toLowerCase().includes('pita') ||
      line.toLowerCase().includes('step')
    ).length;
    
    let actualSteps = 0;
    
    if (typeof steps === 'number') {
      actualSteps = steps;
    } else if (stepCount > 0) {
      actualSteps = stepCount;
    } else {
      const loopMatch = code.match(/wakati\s*\([^)]*mpaka\s*(\d+)/);
      if (loopMatch) {
        actualSteps = parseInt(loopMatch[1]);
      } else {
        const andikaCount = (code.match(/andika/g) || []).length;
        if (hasLoop && andikaCount > 0) {
          actualSteps = Math.min(result.output.length, maxSteps);
        }
      }
    }
    
    if (actualSteps === 0 && hasLoop) {
      actualSteps = Math.min(result.output.length || 1, maxSteps);
    }
    
    if (!hasLoop) {
      setError('Tumia "wakati" kurudia hatua!');
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    if (actualSteps === 0) {
      setError('Hatua hazikupatikana. Tumia "andika" kuonyesha kila hatua.');
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    if (actualSteps > maxSteps + 2) {
      updateBridgeState({ collapsed: true });
      setError('Hatua nyingi sana! Daraja limeanguka.');
      playSound('error');
      setAttempts(a => a + 1);
      return;
    }
    
    await animateSteps(actualSteps);
    
    if (actualSteps >= maxSteps) {
      updatePuzzleState('bridge', { 
        completed: true, 
        attempts: attempts + 1,
        lastResult: result,
      });
      
      playSound('success');
      
      setTimeout(() => {
        playSound('complete');
        onComplete();
      }, 1000);
    } else {
      setError(`Umefanya hatua ${actualSteps} tu. Unahitaji ${maxSteps}.`);
      playSound('error');
      setAttempts(a => a + 1);
    }
    
  }, [code, isAnimating, attempts, maxSteps, setLastCode, updateBridgeState, animateSteps, updatePuzzleState, onComplete]);
  
  const resetBridge = () => {
    updateBridgeState({ currentStep: 0, collapsed: false });
    setError(null);
  };
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Visual Scene - takes most of the space */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-orange-900 to-stone-900 p-4">
        <BridgeScene className="max-h-full" />
      </div>
      
      {/* Collapsed bridge overlay */}
      {collapsed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="bg-stone-800 rounded-xl p-6 text-center shadow-2xl border border-red-500/30 max-w-sm">
            <div className="text-4xl mb-3">💥</div>
            <p className="text-xl text-white font-bold mb-2">Daraja limeanguka!</p>
            <p className="text-stone-400 text-sm mb-4">Hatua nyingi sana. Jaribu tena polepole.</p>
            <button
              onClick={resetBridge}
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
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-xl text-white font-bold">Umevuka, {jina}!</p>
            <p className="text-stone-400 text-sm mt-2">Hongera!</p>
          </div>
        </div>
      )}
      
      {/* Animating indicator */}
      {isAnimating && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-stone-800/90 rounded-full px-4 py-2 z-10">
          <p className="text-amber-400 font-medium">🚶 Hatua {currentStep}...</p>
        </div>
      )}
      
      {/* Code Editor - fixed at bottom */}
      {!isComplete && !collapsed && (
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
              disabled={isAnimating}
              placeholder="acha hatua = 0&#10;wakati (hatua chini 5) {&#10;  ...&#10;}"
            />
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={handleRun}
              disabled={isAnimating}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isAnimating 
                  ? 'bg-stone-600 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isAnimating ? '⏳ Inapita...' : <><span>▶</span> Endesha</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
