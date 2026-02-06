import React from 'react';
import { COUNTDOWN_THEMES, CountdownTheme } from './countdownThemes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ThemeSelectorProps {
  selectedTheme: CountdownTheme;
  onThemeSelect: (theme: CountdownTheme) => void;
}

export function ThemeSelector({ selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  return (
    <div className="w-full space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Choose Theme
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {COUNTDOWN_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme)}
            className={cn(
              'relative h-20 rounded-lg border-2 transition-all duration-200 overflow-hidden group',
              selectedTheme.id === theme.id
                ? 'border-primary ring-2 ring-primary/50'
                : 'border-muted-foreground/20 hover:border-muted-foreground/40'
            )}
            title={theme.name}
          >
            {/* Theme Preview */}
            <div className={cn('absolute inset-0', theme.gradient)} />
            
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Theme Name */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-2">
              <span className="text-xs font-medium text-white text-center line-clamp-2">
                {theme.name}
              </span>
            </div>

            {/* Selected Checkmark */}
            {selectedTheme.id === theme.id && (
              <div className="absolute top-1 right-1 z-20 bg-primary text-primary-foreground rounded-full p-1 flex items-center justify-center">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
