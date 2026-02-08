'use client';

import React from 'react';
import { useGameState } from '@/lib/gameState';

interface ForestSceneProps {
  className?: string;
}

export default function ForestScene({ className = '' }: ForestSceneProps) {
  const { storyVariables, puzzles } = useGameState();
  const { jina, wakati, njia } = storyVariables;
  const pathComplete = puzzles.path.completed;
  
  const isDay = wakati === 'mchana';
  const isNight = wakati === 'usiku';
  
  return (
    <svg
      viewBox="0 0 400 320"
      className={`w-full h-auto ${className}`}
      style={{ maxHeight: '55vh' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Day sky */}
        <linearGradient id="fDaySky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4FC3F7" />
          <stop offset="100%" stopColor="#81D4FA" />
        </linearGradient>
        
        {/* Night sky */}
        <linearGradient id="fNightSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A237E" />
          <stop offset="50%" stopColor="#283593" />
          <stop offset="100%" stopColor="#3949AB" />
        </linearGradient>
        
        {/* Fog/mystery sky */}
        <linearGradient id="fFogSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78909C" />
          <stop offset="100%" stopColor="#90A4AE" />
        </linearGradient>
        
        {/* Forest ground */}
        <linearGradient id="fGround" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isNight ? '#1B5E20' : '#2E7D32'} />
          <stop offset="100%" stopColor={isNight ? '#0D3311' : '#1B5E20'} />
        </linearGradient>
        
        {/* Path glow for correct choice */}
        <filter id="fPathGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Moon glow */}
        <radialGradient id="fMoonGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFF9C4" stopOpacity="1"/>
          <stop offset="40%" stopColor="#FFF59D" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#FFEE58" stopOpacity="0"/>
        </radialGradient>
        
        {/* Sun glow */}
        <radialGradient id="fSunGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFEE58" stopOpacity="1"/>
          <stop offset="50%" stopColor="#FFD54F" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FFB300" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      {/* === SKY === */}
      <rect 
        x="0" y="0" width="400" height="165" 
        fill={isNight ? 'url(#fNightSky)' : (isDay ? 'url(#fDaySky)' : 'url(#fFogSky)')} 
      />
      
      {/* === SUN (Day) === */}
      {isDay && (
        <g transform="translate(320, 45)">
          <circle r="40" fill="url(#fSunGlow)">
            <animate attributeName="r" values="40;45;40" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle r="18" fill="#FDD835">
            <animate attributeName="opacity" values="1;0.9;1" dur="3s" repeatCount="indefinite"/>
          </circle>
        </g>
      )}
      
      {/* === MOON & STARS (Night) === */}
      {isNight && (
        <>
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={20 + (i * 37) % 350}
              cy={15 + (i * 23) % 120}
              r={1 + (i % 2)}
              fill="white"
            >
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" begin={`${i * 0.2}s`}/>
            </circle>
          ))}
          
          {/* Moon */}
          <g transform="translate(320, 50)">
            <circle r="35" fill="url(#fMoonGlow)">
              <animate attributeName="r" values="35;38;35" dur="5s" repeatCount="indefinite"/>
            </circle>
            <circle r="22" fill="#FFF9C4"/>
            <circle cx="-5" cy="-5" r="18" fill="#FFF8E1"/>
            {/* Moon craters */}
            <circle cx="5" cy="-3" r="4" fill="#ECEFF1" opacity="0.4"/>
            <circle cx="-8" cy="6" r="3" fill="#ECEFF1" opacity="0.3"/>
            <circle cx="10" cy="8" r="2" fill="#ECEFF1" opacity="0.3"/>
          </g>
        </>
      )}
      
      {/* === FOG EFFECT (No time set) === */}
      {!wakati && (
        <>
          <rect x="0" y="0" width="400" height="280" fill="rgba(120,144,156,0.3)">
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite"/>
          </rect>
          <text x="200" y="50" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.7)" fontWeight="bold">
            ❓ Wakati gani?
          </text>
        </>
      )}
      
      {/* === BACKGROUND TREES === */}
      <g opacity={isNight ? 0.6 : 0.8}>
        {[...Array(8)].map((_, i) => {
          const x = 15 + i * 52;
          const h = 60 + (i % 3) * 15;
          const treeColor = isNight ? '#1B5E20' : '#2E7D32';
          const treeColorLight = isNight ? '#2E7D32' : '#43A047';
          return (
            <g key={i} transform={`translate(${x}, ${165 - h})`}>
              {/* Trunk */}
              <rect x="12" y={h - 20} width="8" height="25" fill="#4E342E"/>
              {/* Foliage layers */}
              <polygon points={`16,0 0,${h - 15} 32,${h - 15}`} fill={treeColor}/>
              <polygon points={`16,15 3,${h - 25} 29,${h - 25}`} fill={treeColorLight}/>
            </g>
          );
        })}
      </g>
      
      {/* === GROUND === */}
      <rect x="0" y="160" width="400" height="160" fill="url(#fGround)" />
      
      {/* Ground texture */}
      <g opacity="0.4">
        {[...Array(15)].map((_, i) => (
          <ellipse
            key={i}
            cx={20 + i * 28}
            cy={180 + (i % 3) * 25}
            rx={8 + (i % 4) * 2}
            ry={3}
            fill={isNight ? '#0D3311' : '#1B5E20'}
          />
        ))}
      </g>
      
      {/* === FORK PATHS === */}
      <g transform="translate(0, 0)">
        {/* Main path coming from bottom */}
        <rect x="170" y="230" width="60" height="60" fill="#8D6E63" rx="5"/>
        <rect x="175" y="235" width="50" height="50" fill="#795548" rx="4" opacity="0.3"/>
        
        {/* LEFT PATH */}
        <g>
          {/* Path base */}
          <path
            d="M 170 230 Q 100 200, 30 210"
            fill="none"
            stroke={pathComplete && njia === 'kushoto' ? '#FFD54F' : '#8D6E63'}
            strokeWidth="45"
            strokeLinecap="round"
            filter={isDay && !pathComplete ? 'url(#fPathGlow)' : ''}
          />
          {/* Path highlight if it's the correct choice */}
          {isDay && !pathComplete && (
            <path
              d="M 170 230 Q 100 200, 30 210"
              fill="none"
              stroke="#FFEB3B"
              strokeWidth="50"
              strokeLinecap="round"
              opacity="0.3"
            >
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite"/>
            </path>
          )}
          {/* Checkmark if completed */}
          {pathComplete && njia === 'kushoto' && (
            <g transform="translate(70, 205)">
              <circle r="15" fill="#4CAF50"/>
              <path d="M-6,0 L-2,5 L7,-5" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          )}
        </g>
        
        {/* RIGHT PATH */}
        <g>
          {/* Path base */}
          <path
            d="M 230 230 Q 300 200, 370 210"
            fill="none"
            stroke={pathComplete && njia === 'kulia' ? '#FFD54F' : '#8D6E63'}
            strokeWidth="45"
            strokeLinecap="round"
            filter={isNight && !pathComplete ? 'url(#fPathGlow)' : ''}
          />
          {/* Path highlight if it's the correct choice */}
          {isNight && !pathComplete && (
            <path
              d="M 230 230 Q 300 200, 370 210"
              fill="none"
              stroke="#B388FF"
              strokeWidth="50"
              strokeLinecap="round"
              opacity="0.3"
            >
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite"/>
            </path>
          )}
          {/* Checkmark if completed */}
          {pathComplete && njia === 'kulia' && (
            <g transform="translate(330, 205)">
              <circle r="15" fill="#4CAF50"/>
              <path d="M-6,0 L-2,5 L7,-5" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          )}
        </g>
        
        {/* === SIGNPOSTS === */}
        {/* Left sign */}
        <g transform="translate(80, 160)">
          <rect x="-3" y="0" width="6" height="45" fill="#5D4037" rx="2"/>
          <rect x="-35" y="5" width="70" height="25" rx="5" fill="#8D6E63"/>
          <rect x="-33" y="7" width="66" height="21" rx="4" fill="#A1887F"/>
          <text x="0" y="22" textAnchor="middle" fontSize="11" fill="#3E2723" fontWeight="bold">← KUSHOTO</text>
          {isDay && !pathComplete && (
            <circle cx="-40" cy="17" r="6" fill="#FFEB3B">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          )}
        </g>
        
        {/* Right sign */}
        <g transform="translate(320, 160)">
          <rect x="-3" y="0" width="6" height="45" fill="#5D4037" rx="2"/>
          <rect x="-35" y="5" width="70" height="25" rx="5" fill="#8D6E63"/>
          <rect x="-33" y="7" width="66" height="21" rx="4" fill="#A1887F"/>
          <text x="0" y="22" textAnchor="middle" fontSize="11" fill="#3E2723" fontWeight="bold">KULIA →</text>
          {isNight && !pathComplete && (
            <circle cx="40" cy="17" r="6" fill="#B388FF">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          )}
        </g>
      </g>
      
      {/* === TIME INDICATOR === */}
      {(isDay || isNight) && (
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="100" height="32" rx="16" fill="rgba(0,0,0,0.5)"/>
          <text x="50" y="21" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">
            {isDay ? '☀️ MCHANA' : '🌙 USIKU'}
          </text>
        </g>
      )}
      
      {/* === KOBE === */}
      <g transform="translate(170, 235)">
        {/* Shadow */}
        <ellipse cx="28" cy="32" rx="25" ry="6" fill="#000" opacity="0.15"/>
        
        {/* Shell */}
        <ellipse cx="28" cy="15" rx="26" ry="18" fill={isNight ? '#4E342E' : '#5D4037'}/>
        <ellipse cx="28" cy="12" rx="22" ry="15" fill={isNight ? '#6D4C41' : '#795548'}/>
        <ellipse cx="22" cy="8" rx="8" ry="5" fill={isNight ? '#795548' : '#8D6E63'} opacity="0.5"/>
        
        {/* Head */}
        <ellipse cx="58" cy="18" rx="10" ry="8" fill={isNight ? '#558B2F' : '#7CB342'}>
          <animate attributeName="cx" values="58;60;58" dur="4s" repeatCount="indefinite"/>
        </ellipse>
        <circle cx="64" cy="15" r="2.5" fill="#1B5E20"/>
        <circle cx="65" cy="14" r="1" fill="white" opacity="0.6"/>
        
        {/* Legs */}
        <ellipse cx="8" cy="28" rx="9" ry="5" fill={isNight ? '#558B2F' : '#7CB342'}/>
        <ellipse cx="48" cy="28" rx="9" ry="5" fill={isNight ? '#558B2F' : '#7CB342'}/>
      </g>
      
      {/* === PLAYER === */}
      {jina && (
        <g transform="translate(185, 255)">
          <ellipse cx="15" cy="40" rx="14" ry="4" fill="#000" opacity="0.12"/>
          
          {/* Body */}
          <rect x="4" y="18" width="22" height="22" rx="8" fill="#EF5350"/>
          
          {/* Head */}
          <circle cx="15" cy="8" r="12" fill="#FFCC80"/>
          <ellipse cx="15" cy="0" rx="10" ry="6" fill="#3E2723"/>
          <circle cx="10" cy="7" r="2" fill="#3E2723"/>
          <circle cx="20" cy="7" r="2" fill="#3E2723"/>
          
          {/* Name */}
          <g transform="translate(15, -15)">
            <rect x="-25" y="-10" width="50" height="18" rx="9" fill="rgba(0,0,0,0.6)"/>
            <text x="0" y="3" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" fontFamily="system-ui">
              {jina}
            </text>
          </g>
        </g>
      )}
      
      {/* === FIREFLIES (Night only) === */}
      {isNight && [...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={30 + i * 50}
          cy={140 + (i % 4) * 30}
          r="2"
          fill="#FFEB3B"
        >
          <animate attributeName="opacity" values="0;1;0" dur={`${1.5 + (i % 3) * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.3}s`}/>
          <animate attributeName="cy" values={`${140 + (i % 4) * 30};${130 + (i % 4) * 30};${140 + (i % 4) * 30}`} dur={`${3 + i}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}
