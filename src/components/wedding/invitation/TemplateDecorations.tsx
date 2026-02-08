import React from 'react';
import { TemplateStyle } from './templateConfig';
import { cn } from '@/lib/utils';

interface DecorationsProps {
  template: TemplateStyle;
}

// Rajasthani style - Maroon arch with gold accents
export function RajasthaniDecorations() {
  return (
    <>
      {/* Top maroon arch */}
      <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900 to-red-800" />
        <svg className="absolute bottom-0 w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="none">
          <path d="M0,50 Q200,0 400,50 L400,50 L0,50 Z" fill="#fef3c7" />
        </svg>
        {/* Mandala pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='30' fill='none' stroke='%23d4af37' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='20' fill='none' stroke='%23d4af37' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }} />
        </div>
      </div>

      {/* Ganesha icon placeholder */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-amber-200 border-2 border-amber-500 flex items-center justify-center">
        <span className="text-xl">🙏</span>
      </div>

      {/* Side decorative pillars */}
      <div className="absolute left-2 top-28 bottom-8 w-2 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-600 rounded-full opacity-60" />
      <div className="absolute right-2 top-28 bottom-8 w-2 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-600 rounded-full opacity-60" />

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-200 to-transparent" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-amber-500" />
        ))}
      </div>
    </>
  );
}

// Royal Blue style - Dark elegant with floral corners
export function RoyalBlueDecorations() {
  return (
    <>
      {/* Corner floral decorations */}
      <div className="absolute top-4 left-4 w-20 h-20 opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-300">
          <circle cx="20" cy="20" r="15" fill="currentColor" opacity="0.5" />
          <circle cx="35" cy="30" r="12" fill="currentColor" opacity="0.6" />
          <circle cx="25" cy="45" r="10" fill="currentColor" opacity="0.4" />
          <path d="M15,50 Q30,35 45,55" stroke="currentColor" fill="none" strokeWidth="2" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 w-20 h-20 opacity-40 scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-300">
          <circle cx="20" cy="20" r="15" fill="currentColor" opacity="0.5" />
          <circle cx="35" cy="30" r="12" fill="currentColor" opacity="0.6" />
          <circle cx="25" cy="45" r="10" fill="currentColor" opacity="0.4" />
          <path d="M15,50 Q30,35 45,55" stroke="currentColor" fill="none" strokeWidth="2" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 w-20 h-20 opacity-40 scale-y-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-300">
          <circle cx="20" cy="20" r="15" fill="currentColor" opacity="0.5" />
          <circle cx="35" cy="30" r="12" fill="currentColor" opacity="0.6" />
          <circle cx="25" cy="45" r="10" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 w-20 h-20 opacity-40 scale-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-300">
          <circle cx="20" cy="20" r="15" fill="currentColor" opacity="0.5" />
          <circle cx="35" cy="30" r="12" fill="currentColor" opacity="0.6" />
          <circle cx="25" cy="45" r="10" fill="currentColor" opacity="0.4" />
        </svg>
      </div>

      {/* Decorative frame */}
      <div className="absolute inset-6 border border-blue-400/20 rounded-lg pointer-events-none" />
      <div className="absolute inset-8 border border-blue-400/10 rounded-lg pointer-events-none" />

      {/* Sparkle effects */}
      <div className="absolute top-12 left-12 w-1 h-1 bg-blue-300 rounded-full animate-pulse" />
      <div className="absolute top-20 right-16 w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse delay-300" />
      <div className="absolute bottom-24 left-10 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-500" />
    </>
  );
}

// Mughal style - Cream with arch and floral borders
export function MughalDecorations() {
  return (
    <>
      {/* Top Mughal arch */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="archGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="100%" stopColor="#c9a066" />
            </linearGradient>
          </defs>
          <path d="M0,0 L0,40 Q200,70 400,40 L400,0 Z" fill="url(#archGradient)" />
          <path d="M0,35 Q200,65 400,35" stroke="#8b6914" fill="none" strokeWidth="2" />
        </svg>
      </div>

      {/* Geometric pattern overlay */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-24 opacity-20">
        <div className="w-full h-full rounded-full border-2 border-amber-600" />
        <div className="absolute inset-2 rounded-full border border-amber-500" />
        <div className="absolute inset-4 rounded-full border border-amber-400" />
      </div>

      {/* Side floral vines */}
      <div className="absolute left-2 top-20 bottom-20 w-8 opacity-30">
        <svg viewBox="0 0 30 200" className="w-full h-full text-green-600">
          <path d="M15,0 Q5,50 15,100 Q25,150 15,200" stroke="currentColor" fill="none" strokeWidth="2" />
          <circle cx="8" cy="40" r="5" fill="#f472b6" opacity="0.6" />
          <circle cx="22" cy="80" r="4" fill="#f472b6" opacity="0.5" />
          <circle cx="10" cy="120" r="5" fill="#f472b6" opacity="0.6" />
          <circle cx="20" cy="160" r="4" fill="#f472b6" opacity="0.5" />
        </svg>
      </div>
      <div className="absolute right-2 top-20 bottom-20 w-8 opacity-30 scale-x-[-1]">
        <svg viewBox="0 0 30 200" className="w-full h-full text-green-600">
          <path d="M15,0 Q5,50 15,100 Q25,150 15,200" stroke="currentColor" fill="none" strokeWidth="2" />
          <circle cx="8" cy="40" r="5" fill="#f472b6" opacity="0.6" />
          <circle cx="22" cy="80" r="4" fill="#f472b6" opacity="0.5" />
          <circle cx="10" cy="120" r="5" fill="#f472b6" opacity="0.6" />
          <circle cx="20" cy="160" r="4" fill="#f472b6" opacity="0.5" />
        </svg>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-8 h-px bg-amber-500" />
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <div className="w-8 h-px bg-amber-500" />
      </div>
    </>
  );
}

// Garden style - Light with hanging flowers
export function GardenDecorations() {
  return (
    <>
      {/* Hanging flowers from top */}
      <div className="absolute top-0 left-0 right-0 h-28 overflow-hidden">
        <div className="flex justify-around">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center" style={{ animationDelay: `${i * 0.1}s` }}>
              {/* Deterministic height based on index instead of random to prevent hydration mismatch and flickering */}
              <div className="w-px h-8 bg-gradient-to-b from-green-400 to-green-500" style={{ height: `${20 + (i % 3) * 10 + (i % 2) * 5}px` }} />
              <div className={cn(
                "w-3 h-3 rounded-full",
                i % 3 === 0 ? "bg-white" : i % 3 === 1 ? "bg-rose-200" : "bg-pink-100"
              )} />
              <div className="w-px h-4 bg-green-400" />
              <div className={cn(
                "w-2 h-2 rounded-full",
                i % 2 === 0 ? "bg-white" : "bg-rose-100"
              )} />
            </div>
          ))}
        </div>
        {/* Leaf garland */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-green-200/60 to-transparent" />
      </div>

      {/* Floral arch in middle (for couple photos) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <ellipse cx="100" cy="100" rx="90" ry="80" fill="none" stroke="#22c55e" strokeWidth="8" />
          {/* Flower decorations on arch */}
          <circle cx="20" cy="100" r="8" fill="#fda4af" />
          <circle cx="180" cy="100" r="8" fill="#fda4af" />
          <circle cx="50" cy="40" r="6" fill="#fecdd3" />
          <circle cx="150" cy="40" r="6" fill="#fecdd3" />
          <circle cx="100" cy="25" r="7" fill="#fda4af" />
        </svg>
      </div>

      {/* Bottom floral border */}
      <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
        <div className="flex justify-around items-end h-full">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={cn(
                "rounded-full",
                i % 4 === 0 ? "w-4 h-4 bg-rose-300" :
                  i % 4 === 1 ? "w-3 h-3 bg-pink-200" :
                    i % 4 === 2 ? "w-5 h-5 bg-rose-400" : "w-3 h-3 bg-white"
              )} />
              <div className="w-px h-3 bg-green-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Full Border Frame */}
      <div className="absolute inset-2 border-4 border-green-200/50 rounded-xl pointer-events-none z-0" />
      <div className="absolute inset-3 border border-green-300 rounded-lg pointer-events-none z-0" />

      {/* Leaf accents - adjusted position */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-16 opacity-40">
        <svg viewBox="0 0 100 200" className="w-full h-full text-green-300 fill-current">
          <path d="M50,0 Q100,50 50,100 Q0,150 50,200" />
        </svg>
      </div>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-16 opacity-40 scale-x-[-1]">
        <svg viewBox="0 0 100 200" className="w-full h-full text-green-300 fill-current">
          <path d="M50,0 Q100,50 50,100 Q0,150 50,200" />
        </svg>
      </div>
    </>
  );
}

export function TemplateDecorations({ template }: DecorationsProps) {
  switch (template) {
    case 'rajasthani':
      return <RajasthaniDecorations />;
    case 'royalBlue':
      return <RoyalBlueDecorations />;
    case 'mughal':
      return <MughalDecorations />;
    case 'garden':
      return <GardenDecorations />;
    default:
      return null;
  }
}
