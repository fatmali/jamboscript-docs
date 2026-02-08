'use client';

import React, { useMemo } from 'react';
import { useGameState } from '@/lib/gameState';

interface BridgeSceneProps {
  className?: string;
}

export default function BridgeScene({ className = '' }: BridgeSceneProps) {
  const { storyVariables, bridgeState, puzzles } = useGameState();
  const { jina } = storyVariables;
  const { currentStep, maxSteps, collapsed } = bridgeState;
  const bridgeComplete = puzzles.bridge.completed;
  
  // Stable random values for collapsed planks
  const collapsedPlanks = useMemo(() => 
    Array.from({ length: maxSteps }, (_, i) => ({
      fallY: 220 + ((i * 17) % 40),
      rotation: ((i * 31) % 50) - 25,
    })), [maxSteps]);
  
  const plankWidth = 42;
  const plankGap = 8;
  const bridgeStartX = 65;
  
  return (
    <svg
      viewBox="0 0 400 280"
      className={`w-full h-auto ${className}`}
      style={{ maxHeight: '50vh' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Sunset sky */}
        <linearGradient id="bSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF8A65" />
          <stop offset="30%" stopColor="#FFAB91" />
          <stop offset="60%" stopColor="#FFCCBC" />
          <stop offset="100%" stopColor="#FFF3E0" />
        </linearGradient>
        
        {/* Water */}
        <linearGradient id="bWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1976D2" />
          <stop offset="50%" stopColor="#1565C0" />
          <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
        
        {/* Bank grass */}
        <linearGradient id="bGrass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#558B2F" />
          <stop offset="100%" stopColor="#33691E" />
        </linearGradient>
        
        {/* Plank crossed */}
        <linearGradient id="bPlankCrossed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
        
        {/* Plank default */}
        <linearGradient id="bPlank" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A1887F" />
          <stop offset="100%" stopColor="#8D6E63" />
        </linearGradient>
        
        {/* Active plank glow */}
        <filter id="bPlankGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Water reflection */}
        <filter id="bReflection" x="0%" y="0%" width="100%" height="100%">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0"/>
        </filter>
      </defs>
      
      {/* === SKY === */}
      <rect x="0" y="0" width="400" height="145" fill="url(#bSky)" />
      
      {/* Setting sun */}
      <g transform="translate(200, 125)">
        <circle r="50" fill="#FF7043" opacity="0.3">
          <animate attributeName="r" values="50;55;50" dur="5s" repeatCount="indefinite"/>
        </circle>
        <circle r="35" fill="#FF5722" opacity="0.5"/>
        <circle r="25" fill="#FF8A65" opacity="0.8"/>
      </g>
      
      {/* Clouds */}
      <g fill="#FFCCBC" opacity="0.6">
        <ellipse cx="60" cy="35" rx="30" ry="12"/>
        <ellipse cx="85" cy="30" rx="20" ry="10"/>
        <ellipse cx="320" cy="40" rx="35" ry="14"/>
        <ellipse cx="350" cy="35" rx="22" ry="10"/>
      </g>
      
      {/* Mountains */}
      <g>
        <polygon points="0,145 70,70 140,145" fill="#8D6E63" opacity="0.4"/>
        <polygon points="80,145 180,50 280,145" fill="#A1887F" opacity="0.35"/>
        <polygon points="220,145 320,80 400,145" fill="#8D6E63" opacity="0.4"/>
      </g>
      
      {/* === WATER === */}
      <rect x="0" y="140" width="400" height="140" fill="url(#bWater)" />
      
      {/* Water ripples */}
      {[...Array(6)].map((_, i) => (
        <ellipse
          key={i}
          cx={40 + i * 65}
          cy={180 + (i % 3) * 25}
          rx={20 + (i % 2) * 10}
          ry={3}
          fill="rgba(255,255,255,0.15)"
        >
          <animate attributeName="rx" values={`${20 + (i % 2) * 10};${25 + (i % 2) * 10};${20 + (i % 2) * 10}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.15;0.05;0.15" dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
        </ellipse>
      ))}
      
      {/* Water shimmer */}
      {[...Array(8)].map((_, i) => (
        <line
          key={i}
          x1={30 + i * 50}
          y1={160 + (i % 4) * 20}
          x2={45 + i * 50}
          y2={160 + (i % 4) * 20}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.2}s`}/>
        </line>
      ))}
      
      {/* === LEFT BANK === */}
      <g>
        <rect x="0" y="165" width="70" height="115" fill="#5D4037" rx="3"/>
        <rect x="0" y="160" width="75" height="18" fill="url(#bGrass)" rx="4"/>
        {/* Grass tufts */}
        {[...Array(5)].map((_, i) => (
          <path key={i} d={`M${10 + i * 12},160 q2,-8 0,-12`} stroke="#7CB342" strokeWidth="2" fill="none">
            <animate attributeName="d" values={`M${10 + i * 12},160 q2,-8 0,-12;M${10 + i * 12},160 q3,-7 1,-11;M${10 + i * 12},160 q2,-8 0,-12`} dur={`${2 + (i % 2)}s`} repeatCount="indefinite"/>
          </path>
        ))}
      </g>
      
      {/* === RIGHT BANK === */}
      <g>
        <rect x="335" y="165" width="65" height="115" fill="#5D4037" rx="3"/>
        <rect x="330" y="160" width="70" height="18" fill="url(#bGrass)" rx="4"/>
        {/* Grass tufts */}
        {[...Array(5)].map((_, i) => (
          <path key={i} d={`M${340 + i * 12},160 q2,-8 0,-12`} stroke="#7CB342" strokeWidth="2" fill="none">
            <animate attributeName="d" values={`M${340 + i * 12},160 q2,-8 0,-12;M${340 + i * 12},160 q3,-7 1,-11;M${340 + i * 12},160 q2,-8 0,-12`} dur={`${2 + (i % 2)}s`} repeatCount="indefinite"/>
          </path>
        ))}
      </g>
      
      {/* === BRIDGE STRUCTURE === */}
      {/* Support posts */}
      <rect x="55" y="155" width="12" height="90" fill="#4E342E" rx="2"/>
      <rect x="335" y="155" width="12" height="90" fill="#4E342E" rx="2"/>
      
      {/* Top ropes */}
      <path
        d="M 61 160 Q 200 140, 341 160"
        fill="none"
        stroke="#6D4C41"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 61 160 Q 200 142, 341 160"
        fill="none"
        stroke="#8D6E63"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Bottom ropes */}
      <path
        d="M 61 195 Q 200 210, 341 195"
        fill="none"
        stroke="#6D4C41"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* === BRIDGE PLANKS === */}
      {!collapsed && Array.from({ length: maxSteps }, (_, i) => {
        const x = bridgeStartX + i * (plankWidth + plankGap);
        const isCrossed = i < currentStep;
        const isActive = i === currentStep && currentStep < maxSteps;
        
        return (
          <g key={i}>
            {/* Vertical ropes */}
            <line x1={x + 5} y1={162} x2={x + 5} y2={175} stroke="#8D6E63" strokeWidth="2"/>
            <line x1={x + plankWidth - 5} y1={162} x2={x + plankWidth - 5} y2={175} stroke="#8D6E63" strokeWidth="2"/>
            
            {/* Plank */}
            <rect
              x={x}
              y={175}
              width={plankWidth}
              height={14}
              rx="3"
              fill={isCrossed ? 'url(#bPlankCrossed)' : 'url(#bPlank)'}
              filter={isActive ? 'url(#bPlankGlow)' : ''}
              opacity={isCrossed ? 1 : 0.85}
            >
              {isActive && (
                <animate attributeName="y" values="175;177;175" dur="0.5s" repeatCount="indefinite"/>
              )}
            </rect>
            
            {/* Plank wood grain */}
            <line x1={x + 5} y1={180} x2={x + plankWidth - 5} y2={180} stroke={isCrossed ? '#FF6F00' : '#6D4C41'} strokeWidth="1" opacity="0.3"/>
            <line x1={x + 5} y1={185} x2={x + plankWidth - 5} y2={185} stroke={isCrossed ? '#FF6F00' : '#6D4C41'} strokeWidth="1" opacity="0.3"/>
            
            {/* Step number */}
            {isCrossed && (
              <text x={x + plankWidth / 2} y={186} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
                {i + 1}
              </text>
            )}
          </g>
        );
      })}
      
      {/* === COLLAPSED BRIDGE === */}
      {collapsed && Array.from({ length: maxSteps }, (_, i) => {
        const x = bridgeStartX + i * (plankWidth + plankGap);
        const { fallY, rotation } = collapsedPlanks[i];
        
        return (
          <g key={i}>
            {/* Broken rope */}
            <line x1={x + 20} y1={165} x2={x + 20} y2={200} stroke="#8D6E63" strokeWidth="2" opacity="0.5" strokeDasharray="4 4"/>
            
            {/* Fallen plank */}
            <rect
              x={x}
              y={fallY}
              width={plankWidth}
              height={14}
              rx="3"
              fill="#8D6E63"
              transform={`rotate(${rotation}, ${x + plankWidth / 2}, ${fallY + 7})`}
              opacity="0.7"
            >
              <animate attributeName="y" from="175" to={fallY} dur="0.4s" fill="freeze"/>
              <animate attributeName="opacity" from="1" to="0.7" dur="0.4s" fill="freeze"/>
            </rect>
          </g>
        );
      })}
      
      {/* Splash effect when collapsed */}
      {collapsed && (
        <g transform="translate(200, 220)">
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={(i - 2) * 30}
              cy={0}
              r={8}
              fill="rgba(255,255,255,0.5)"
            >
              <animate attributeName="r" from="5" to="20" dur="0.6s" fill="freeze"/>
              <animate attributeName="opacity" from="0.6" to="0" dur="0.6s" fill="freeze"/>
            </circle>
          ))}
        </g>
      )}
      
      {/* === PLAYER ON LEFT BANK (not started) === */}
      {jina && currentStep === 0 && !collapsed && !bridgeComplete && (
        <g transform="translate(20, 135)">
          <ellipse cx="18" cy="45" rx="12" ry="4" fill="#000" opacity="0.15"/>
          <rect x="6" y="18" width="24" height="26" rx="10" fill="#EF5350"/>
          <circle cx="18" cy="6" r="14" fill="#FFCC80"/>
          <ellipse cx="18" cy="-4" rx="12" ry="7" fill="#3E2723"/>
          <circle cx="12" cy="5" r="2.5" fill="#3E2723"/>
          <circle cx="24" cy="5" r="2.5" fill="#3E2723"/>
          
          <g transform="translate(18, -20)">
            <rect x="-28" y="-10" width="56" height="18" rx="9" fill="#1B5E20"/>
            <text x="0" y="3" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">{jina}</text>
          </g>
        </g>
      )}
      
      {/* === PLAYER CROSSING === */}
      {jina && currentStep > 0 && currentStep < maxSteps && !collapsed && !bridgeComplete && (
        <g transform={`translate(${bridgeStartX + (currentStep - 1) * (plankWidth + plankGap) + plankWidth / 2 - 18}, 145)`}>
          <ellipse cx="18" cy="45" rx="12" ry="4" fill="#000" opacity="0.1"/>
          <rect x="6" y="18" width="24" height="26" rx="10" fill="#EF5350">
            <animate attributeName="y" values="18;16;18" dur="0.4s" repeatCount="indefinite"/>
          </rect>
          <circle cx="18" cy="6" r="14" fill="#FFCC80">
            <animate attributeName="cy" values="6;4;6" dur="0.4s" repeatCount="indefinite"/>
          </circle>
          <ellipse cx="18" cy="-4" rx="12" ry="7" fill="#3E2723"/>
          <circle cx="12" cy="5" r="2.5" fill="#3E2723"/>
          <circle cx="24" cy="5" r="2.5" fill="#3E2723"/>
        </g>
      )}
      
      {/* === PLAYER ON RIGHT BANK (completed) === */}
      {bridgeComplete && jina && (
        <g transform="translate(355, 135)">
          <ellipse cx="18" cy="45" rx="12" ry="4" fill="#000" opacity="0.15"/>
          <rect x="6" y="18" width="24" height="26" rx="10" fill="#EF5350"/>
          <circle cx="18" cy="6" r="14" fill="#FFCC80"/>
          <ellipse cx="18" cy="-4" rx="12" ry="7" fill="#3E2723"/>
          <circle cx="12" cy="5" r="2.5" fill="#3E2723"/>
          <circle cx="24" cy="5" r="2.5" fill="#3E2723"/>
          <path d="M12,12 Q18,16 24,12" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round"/>
          
          {/* Celebration */}
          <text x="18" y="-25" textAnchor="middle" fontSize="20">🎉</text>
          
          <g transform="translate(18, -45)">
            <rect x="-28" y="-10" width="56" height="18" rx="9" fill="#1B5E20"/>
            <text x="0" y="3" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">{jina}</text>
          </g>
        </g>
      )}
      
      {/* === KOBE ON RIGHT BANK === */}
      <g transform="translate(345, 195)">
        <ellipse cx="20" cy="28" rx="22" ry="6" fill="#000" opacity="0.1"/>
        
        <ellipse cx="20" cy="12" rx="22" ry="16" fill="#5D4037"/>
        <ellipse cx="20" cy="10" rx="18" ry="13" fill="#6D4C41"/>
        <ellipse cx="15" cy="6" rx="6" ry="4" fill="#795548" opacity="0.4"/>
        
        {/* Head facing left (towards bridge) */}
        <ellipse cx="-5" cy="14" rx="9" ry="7" fill="#7CB342">
          <animate attributeName="cx" values="-5;-7;-5" dur="4s" repeatCount="indefinite"/>
        </ellipse>
        <circle cx="-10" cy="12" r="2" fill="#1B5E20"/>
        <circle cx="-9" cy="11" r="0.8" fill="white" opacity="0.6"/>
        
        <ellipse cx="5" cy="24" rx="8" ry="4" fill="#7CB342"/>
        <ellipse cx="35" cy="24" rx="8" ry="4" fill="#7CB342"/>
      </g>
      
      {/* === STEP COUNTER === */}
      <g transform="translate(155, 240)">
        <rect x="0" y="0" width="90" height="32" rx="16" fill="rgba(0,0,0,0.6)"/>
        <text x="45" y="21" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">
          Hatua: {currentStep}/{maxSteps}
        </text>
      </g>
      
      {/* Progress bar */}
      <g transform="translate(140, 265)">
        <rect x="0" y="0" width="120" height="8" rx="4" fill="rgba(0,0,0,0.3)"/>
        <rect x="0" y="0" width={120 * (currentStep / maxSteps)} height="8" rx="4" fill="#4CAF50">
          <animate attributeName="width" to={120 * (currentStep / maxSteps)} dur="0.3s" fill="freeze"/>
        </rect>
      </g>
    </svg>
  );
}
