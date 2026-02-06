import React from 'react';
import { cn } from '@/lib/utils';

interface FloralBorderProps {
  variant: 'gold' | 'cream' | 'maroon';
  className?: string;
}

export function FloralBorder({ variant, className }: FloralBorderProps) {
  const colors = {
    gold: {
      primary: '#d4af37',
      secondary: '#c9a227',
      accent: '#f4e4bc',
    },
    cream: {
      primary: '#f5f0e8',
      secondary: '#e8dcc8',
      accent: '#d4af37',
    },
    maroon: {
      primary: '#8b1a1a',
      secondary: '#6d1515',
      accent: '#d4af37',
    },
  };

  const c = colors[variant];

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {/* Top Border */}
      <svg
        className="absolute top-0 left-0 right-0 w-full h-12"
        viewBox="0 0 360 48"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 48 Q30 24 60 36 Q90 48 120 36 Q150 24 180 36 Q210 48 240 36 Q270 24 300 36 Q330 48 360 36 V0 H0 Z"
          fill={c.primary}
          opacity="0.15"
        />
        <path
          d="M0 36 Q45 18 90 30 Q135 42 180 30 Q225 18 270 30 Q315 42 360 30"
          stroke={c.primary}
          strokeWidth="2"
          opacity="0.4"
        />
        {/* Floral ornaments */}
        <circle cx="90" cy="24" r="6" fill={c.accent} opacity="0.6" />
        <circle cx="180" cy="20" r="8" fill={c.primary} opacity="0.5" />
        <circle cx="270" cy="24" r="6" fill={c.accent} opacity="0.6" />
        {/* Petals */}
        <ellipse cx="180" cy="20" rx="12" ry="4" fill={c.secondary} opacity="0.4" transform="rotate(45 180 20)" />
        <ellipse cx="180" cy="20" rx="12" ry="4" fill={c.secondary} opacity="0.4" transform="rotate(-45 180 20)" />
        <ellipse cx="180" cy="20" rx="12" ry="4" fill={c.secondary} opacity="0.4" transform="rotate(90 180 20)" />
        <ellipse cx="180" cy="20" rx="12" ry="4" fill={c.secondary} opacity="0.4" />
      </svg>

      {/* Bottom Border */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-12"
        viewBox="0 0 360 48"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 0 Q30 24 60 12 Q90 0 120 12 Q150 24 180 12 Q210 0 240 12 Q270 24 300 12 Q330 0 360 12 V48 H0 Z"
          fill={c.primary}
          opacity="0.15"
        />
        <path
          d="M0 12 Q45 30 90 18 Q135 6 180 18 Q225 30 270 18 Q315 6 360 18"
          stroke={c.primary}
          strokeWidth="2"
          opacity="0.4"
        />
        {/* Floral ornaments */}
        <circle cx="90" cy="24" r="6" fill={c.accent} opacity="0.6" />
        <circle cx="180" cy="28" r="8" fill={c.primary} opacity="0.5" />
        <circle cx="270" cy="24" r="6" fill={c.accent} opacity="0.6" />
        {/* Petals */}
        <ellipse cx="180" cy="28" rx="12" ry="4" fill={c.secondary} opacity="0.4" transform="rotate(45 180 28)" />
        <ellipse cx="180" cy="28" rx="12" ry="4" fill={c.secondary} opacity="0.4" transform="rotate(-45 180 28)" />
        <ellipse cx="180" cy="28" rx="12" ry="4" fill={c.secondary} opacity="0.4" transform="rotate(90 180 28)" />
        <ellipse cx="180" cy="28" rx="12" ry="4" fill={c.secondary} opacity="0.4" />
      </svg>

      {/* Left Border */}
      <svg
        className="absolute top-12 bottom-12 left-0 w-8 h-[calc(100%-6rem)]"
        viewBox="0 0 32 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M32 0 Q8 50 20 100 Q32 150 20 200 Q8 250 20 300 Q32 350 20 400 H0 V0 Z"
          fill={c.primary}
          opacity="0.1"
        />
        <path
          d="M20 0 Q4 50 16 100 Q28 150 16 200 Q4 250 16 300 Q28 350 16 400"
          stroke={c.primary}
          strokeWidth="1.5"
          opacity="0.3"
        />
        {/* Decorative dots along the border */}
        <circle cx="16" cy="80" r="4" fill={c.accent} opacity="0.5" />
        <circle cx="12" cy="160" r="3" fill={c.primary} opacity="0.4" />
        <circle cx="16" cy="240" r="4" fill={c.accent} opacity="0.5" />
        <circle cx="12" cy="320" r="3" fill={c.primary} opacity="0.4" />
      </svg>

      {/* Right Border */}
      <svg
        className="absolute top-12 bottom-12 right-0 w-8 h-[calc(100%-6rem)]"
        viewBox="0 0 32 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 0 Q24 50 12 100 Q0 150 12 200 Q24 250 12 300 Q0 350 12 400 H32 V0 Z"
          fill={c.primary}
          opacity="0.1"
        />
        <path
          d="M12 0 Q28 50 16 100 Q4 150 16 200 Q28 250 16 300 Q4 350 16 400"
          stroke={c.primary}
          strokeWidth="1.5"
          opacity="0.3"
        />
        {/* Decorative dots along the border */}
        <circle cx="16" cy="80" r="4" fill={c.accent} opacity="0.5" />
        <circle cx="20" cy="160" r="3" fill={c.primary} opacity="0.4" />
        <circle cx="16" cy="240" r="4" fill={c.accent} opacity="0.5" />
        <circle cx="20" cy="320" r="3" fill={c.primary} opacity="0.4" />
      </svg>

      {/* Corner Ornaments */}
      <svg className="absolute top-0 left-0 w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="16" cy="16" r="10" fill={c.primary} opacity="0.2" />
        <circle cx="16" cy="16" r="6" fill={c.accent} opacity="0.4" />
        <path d="M16 6 Q24 16 16 26 Q8 16 16 6" fill={c.secondary} opacity="0.3" />
      </svg>
      <svg className="absolute top-0 right-0 w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="48" cy="16" r="10" fill={c.primary} opacity="0.2" />
        <circle cx="48" cy="16" r="6" fill={c.accent} opacity="0.4" />
        <path d="M48 6 Q56 16 48 26 Q40 16 48 6" fill={c.secondary} opacity="0.3" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="16" cy="48" r="10" fill={c.primary} opacity="0.2" />
        <circle cx="16" cy="48" r="6" fill={c.accent} opacity="0.4" />
        <path d="M16 38 Q24 48 16 58 Q8 48 16 38" fill={c.secondary} opacity="0.3" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="48" cy="48" r="10" fill={c.primary} opacity="0.2" />
        <circle cx="48" cy="48" r="6" fill={c.accent} opacity="0.4" />
        <path d="M48 38 Q56 48 48 58 Q40 48 48 38" fill={c.secondary} opacity="0.3" />
      </svg>
    </div>
  );
}
