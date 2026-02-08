'use client';

import React from 'react';
import { useGameState } from '@/lib/gameState';

interface VillageSceneProps {
  className?: string;
}

export default function VillageScene({ className = '' }: VillageSceneProps) {
  const { storyVariables, puzzles } = useGameState();
  const { jina } = storyVariables;
  const namingComplete = puzzles.naming.completed;
  
  return (
    <svg
      viewBox="0 0 400 280"
      className={`w-full h-auto ${className}`}
      style={{ maxHeight: '50vh' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Sky gradient - warm morning */}
        <linearGradient id="vSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64B5F6" />
          <stop offset="50%" stopColor="#90CAF9" />
          <stop offset="100%" stopColor="#FFF8E1" />
        </linearGradient>
        
        {/* Ground */}
        <linearGradient id="vGrass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#43A047" />
        </linearGradient>
        
        {/* Path */}
        <linearGradient id="vPath" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BCAAA4" />
          <stop offset="100%" stopColor="#A1887F" />
        </linearGradient>
        
        {/* Sun glow */}
        <radialGradient id="vSunGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFEE58" stopOpacity="1"/>
          <stop offset="50%" stopColor="#FFD54F" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FFB300" stopOpacity="0"/>
        </radialGradient>
        
        {/* Soft shadow */}
        <filter id="vShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.2"/>
        </filter>
      </defs>
      
      {/* === SKY === */}
      <rect x="0" y="0" width="400" height="175" fill="url(#vSky)" />
      
      {/* Sun */}
      <g transform="translate(330, 50)">
        <circle r="50" fill="url(#vSunGlow)">
          <animate attributeName="r" values="50;55;50" dur="4s" repeatCount="indefinite"/>
        </circle>
        <circle r="20" fill="#FDD835">
          <animate attributeName="opacity" values="1;0.9;1" dur="3s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* Clouds */}
      <g fill="white" opacity="0.95">
        <g>
          <ellipse cx="70" cy="45" rx="28" ry="14"/>
          <ellipse cx="95" cy="40" rx="22" ry="12"/>
          <ellipse cx="55" cy="50" rx="18" ry="10"/>
          <animateTransform attributeName="transform" type="translate" values="0,0;15,0;0,0" dur="30s" repeatCount="indefinite"/>
        </g>
        <g>
          <ellipse cx="220" cy="35" rx="35" ry="16"/>
          <ellipse cx="250" cy="30" rx="25" ry="13"/>
          <ellipse cx="200" cy="42" rx="20" ry="11"/>
          <animateTransform attributeName="transform" type="translate" values="0,0;-10,0;0,0" dur="25s" repeatCount="indefinite"/>
        </g>
      </g>
      
      {/* === HILLS === */}
      <ellipse cx="100" cy="175" rx="130" ry="40" fill="#81C784" opacity="0.6"/>
      <ellipse cx="320" cy="180" rx="150" ry="45" fill="#A5D6A7" opacity="0.5"/>
      
      {/* === GROUND === */}
      <rect x="0" y="170" width="400" height="110" fill="url(#vGrass)" />
      
      {/* Grass texture */}
      <g stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        {[...Array(25)].map((_, i) => (
          <path 
            key={i} 
            d={`M${10 + i * 16},${185 + (i % 4) * 20} q2,-10 0,-18`}
          >
            <animate attributeName="d" values={`M${10 + i * 16},${185 + (i % 4) * 20} q2,-10 0,-18;M${10 + i * 16},${185 + (i % 4) * 20} q4,-8 1,-16;M${10 + i * 16},${185 + (i % 4) * 20} q2,-10 0,-18`} dur={`${2 + (i % 3)}s`} repeatCount="indefinite"/>
          </path>
        ))}
      </g>
      
      {/* === PATH === */}
      <path
        d="M -20 255 C 60 245, 140 260, 200 252 C 260 244, 320 258, 420 250"
        fill="none"
        stroke="url(#vPath)"
        strokeWidth="35"
        strokeLinecap="round"
      />
      {/* Path texture */}
      <path
        d="M -20 255 C 60 245, 140 260, 200 252 C 260 244, 320 258, 420 250"
        fill="none"
        stroke="#8D6E63"
        strokeWidth="30"
        strokeLinecap="round"
        strokeDasharray="2 10"
        opacity="0.2"
      />
      
      {/* === HUT === */}
      <g transform="translate(35, 135)" filter="url(#vShadow)">
        {/* Base/walls */}
        <rect x="5" y="35" width="65" height="50" rx="3" fill="#D7CCC8"/>
        <rect x="5" y="35" width="65" height="50" rx="3" fill="#A1887F" opacity="0.3"/>
        
        {/* Roof */}
        <polygon points="37,-5 -10,40 85,40" fill="#8D6E63"/>
        <polygon points="37,0 0,35 75,35" fill="#A1887F" opacity="0.4"/>
        
        {/* Door */}
        <rect x="25" y="50" width="25" height="35" rx="12" fill="#5D4037"/>
        <circle cx="45" cy="70" r="2.5" fill="#FFC107"/>
        
        {/* Window */}
        <rect x="55" y="50" width="12" height="12" rx="2" fill="#3E2723"/>
        <line x1="61" y1="50" x2="61" y2="62" stroke="#5D4037" strokeWidth="2"/>
        <line x1="55" y1="56" x2="67" y2="56" stroke="#5D4037" strokeWidth="2"/>
      </g>
      
      {/* === TREE === */}
      <g transform="translate(300, 115)" filter="url(#vShadow)">
        {/* Trunk */}
        <rect x="12" y="55" width="16" height="55" rx="3" fill="#6D4C41"/>
        <rect x="15" y="60" width="4" height="45" rx="2" fill="#5D4037" opacity="0.4"/>
        
        {/* Foliage */}
        <ellipse cx="20" cy="30" rx="38" ry="32" fill="#388E3C"/>
        <ellipse cx="8" cy="42" rx="25" ry="20" fill="#43A047"/>
        <ellipse cx="35" cy="38" rx="28" ry="22" fill="#4CAF50"/>
        <ellipse cx="20" cy="18" rx="28" ry="22" fill="#66BB6A"/>
        
        {/* Highlights */}
        <ellipse cx="12" cy="12" rx="12" ry="8" fill="#81C784" opacity="0.6"/>
      </g>
      
      {/* === KOBE THE TORTOISE === */}
      <g transform="translate(170, 210)">
        {/* Shadow */}
        <ellipse cx="28" cy="38" rx="32" ry="8" fill="#000" opacity="0.12"/>
        
        {/* Shell */}
        <ellipse cx="28" cy="18" rx="30" ry="22" fill="#5D4037">
          <animate attributeName="ry" values="22;21;22" dur="4s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="28" cy="15" rx="26" ry="18" fill="#795548"/>
        
        {/* Shell pattern */}
        <path d="M28,3 L38,12 L38,24 L28,32 L18,24 L18,12 Z" fill="#6D4C41" opacity="0.5"/>
        <path d="M18,12 L8,18" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M38,12 L48,18" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round"/>
        <ellipse cx="22" cy="10" rx="8" ry="5" fill="#8D6E63" opacity="0.4"/>
        
        {/* Head */}
        <ellipse cx="62" cy="22" rx="12" ry="10" fill="#8BC34A">
          <animate attributeName="cx" values="62;64;62" dur="5s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="66" cy="20" rx="7" ry="6" fill="#9CCC65"/>
        
        {/* Eye */}
        <ellipse cx="69" cy="18" rx="3.5" ry="3" fill="#1B5E20"/>
        <circle cx="70" cy="17" r="1.2" fill="white" opacity="0.7"/>
        
        {/* Smile */}
        <path d="M62,25 Q66,28 70,25" stroke="#558B2F" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        
        {/* Legs */}
        <ellipse cx="8" cy="32" rx="10" ry="6" fill="#8BC34A">
          <animate attributeName="cx" values="8;6;8" dur="3s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="48" cy="32" rx="10" ry="6" fill="#8BC34A">
          <animate attributeName="cx" values="48;50;48" dur="3s" repeatCount="indefinite" begin="0.5s"/>
        </ellipse>
        
        {/* Tail */}
        <ellipse cx="-2" cy="22" rx="7" ry="5" fill="#8BC34A"/>
      </g>
      
      {/* === PLAYER CHARACTER === */}
      {namingComplete && jina && (
        <g transform="translate(100, 188)">
          {/* Shadow */}
          <ellipse cx="18" cy="58" rx="16" ry="5" fill="#000" opacity="0.12"/>
          
          {/* Legs */}
          <rect x="8" y="42" width="8" height="16" rx="4" fill="#1565C0">
            <animate attributeName="height" values="16;14;16" dur="0.8s" repeatCount="indefinite"/>
          </rect>
          <rect x="20" y="42" width="8" height="16" rx="4" fill="#1565C0">
            <animate attributeName="height" values="16;14;16" dur="0.8s" repeatCount="indefinite" begin="0.4s"/>
          </rect>
          
          {/* Body */}
          <rect x="4" y="22" width="28" height="24" rx="10" fill="#EF5350">
            <animate attributeName="y" values="22;20;22" dur="2s" repeatCount="indefinite"/>
          </rect>
          <rect x="8" y="26" width="20" height="8" rx="4" fill="#E53935" opacity="0.3"/>
          
          {/* Arms */}
          <ellipse cx="0" cy="32" rx="6" ry="10" fill="#FFCC80">
            <animate attributeName="cy" values="32;30;32" dur="2s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="36" cy="32" rx="6" ry="10" fill="#FFCC80">
            <animate attributeName="cy" values="32;30;32" dur="2s" repeatCount="indefinite" begin="0.3s"/>
          </ellipse>
          
          {/* Head */}
          <circle cx="18" cy="10" r="16" fill="#FFCC80">
            <animate attributeName="cy" values="10;8;10" dur="2s" repeatCount="indefinite"/>
          </circle>
          
          {/* Hair */}
          <ellipse cx="18" cy="0" rx="14" ry="8" fill="#3E2723"/>
          
          {/* Face */}
          <circle cx="12" cy="9" r="2.5" fill="#3E2723"/>
          <circle cx="24" cy="9" r="2.5" fill="#3E2723"/>
          <circle cx="13" cy="8" r="1" fill="white" opacity="0.6"/>
          <circle cx="25" cy="8" r="1" fill="white" opacity="0.6"/>
          <path d="M14,16 Q18,19 22,16" stroke="#6D4C41" strokeWidth="2" fill="none" strokeLinecap="round"/>
          
          {/* Name tag */}
          <g transform="translate(18, -18)">
            <rect x="-30" y="-12" width="60" height="22" rx="11" fill="#1B5E20"/>
            <rect x="-28" y="-10" width="56" height="18" rx="9" fill="#2E7D32"/>
            <text x="0" y="4" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold" fontFamily="system-ui">
              {jina}
            </text>
          </g>
        </g>
      )}
      
      {/* === MYSTERY SILHOUETTE === */}
      {!namingComplete && (
        <g transform="translate(100, 188)">
          <ellipse cx="18" cy="58" rx="16" ry="5" fill="#000" opacity="0.08"/>
          
          <rect x="4" y="22" width="28" height="24" rx="10" fill="#9E9E9E" opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite"/>
          </rect>
          <circle cx="18" cy="10" r="16" fill="#BDBDBD" opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
          
          <text x="18" y="5" textAnchor="middle" fontSize="20" fill="#616161" fontWeight="bold">?</text>
        </g>
      )}
      
      {/* === AMBIENT PARTICLES === */}
      {[...Array(5)].map((_, i) => (
        <circle
          key={i}
          cx={60 + i * 75}
          cy={120}
          r="2"
          fill="#FFF59D"
          opacity="0.5"
        >
          <animate attributeName="cy" values={`${120 + i * 10};${90 + i * 10};${120 + i * 10}`} dur={`${5 + i}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${4 + i}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}
