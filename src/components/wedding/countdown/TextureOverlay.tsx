import React from 'react';
import { cn } from '@/lib/utils';

interface TextureOverlayProps {
  texture: 'silk' | 'brocade' | 'velvet' | 'chiffon';
  className?: string;
}

export function TextureOverlay({ texture, className }: TextureOverlayProps) {
  // Traditional fabric textures as SVG patterns
  const textures = {
    silk: (
      // Silk texture - subtle diagonal lines with shimmer effect
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="silk-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="0.5" opacity="0.1" />
            <line x1="10" y1="0" x2="30" y2="20" stroke="white" strokeWidth="0.3" opacity="0.05" />
          </pattern>
          <linearGradient id="silk-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#silk-pattern)" />
        <rect width="100%" height="100%" fill="url(#silk-shimmer)" />
      </svg>
    ),
    brocade: (
      // Brocade texture - intricate woven pattern
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="brocade-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.06" />
            <circle cx="0" cy="0" r="10" fill="none" stroke="white" strokeWidth="0.3" opacity="0.05" />
            <circle cx="40" cy="0" r="10" fill="none" stroke="white" strokeWidth="0.3" opacity="0.05" />
            <circle cx="0" cy="40" r="10" fill="none" stroke="white" strokeWidth="0.3" opacity="0.05" />
            <circle cx="40" cy="40" r="10" fill="none" stroke="white" strokeWidth="0.3" opacity="0.05" />
            <path d="M10 20 Q20 10 30 20 Q20 30 10 20" fill="white" opacity="0.04" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brocade-pattern)" />
      </svg>
    ),
    velvet: (
      // Velvet texture - soft gradient with subtle noise
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="velvet-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.1" />
            </feComponentTransfer>
            <feBlend mode="overlay" in="SourceGraphic" />
          </filter>
          <radialGradient id="velvet-glow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#velvet-glow)" />
        <rect width="100%" height="100%" filter="url(#velvet-noise)" opacity="0.3" />
      </svg>
    ),
    chiffon: (
      // Chiffon texture - light, airy, flowing feel
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="chiffon-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 30 Q15 20 30 30 Q45 40 60 30" fill="none" stroke="white" strokeWidth="0.3" opacity="0.1" />
            <path d="M0 45 Q15 35 30 45 Q45 55 60 45" fill="none" stroke="white" strokeWidth="0.3" opacity="0.08" />
            <path d="M0 15 Q15 5 30 15 Q45 25 60 15" fill="none" stroke="white" strokeWidth="0.3" opacity="0.06" />
          </pattern>
          <linearGradient id="chiffon-flow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.05" />
            <stop offset="25%" stopColor="white" stopOpacity="0.1" />
            <stop offset="75%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="white" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#chiffon-pattern)" />
        <rect width="100%" height="100%" fill="url(#chiffon-flow)" />
      </svg>
    ),
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {textures[texture]}
    </div>
  );
}
