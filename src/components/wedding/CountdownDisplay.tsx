import React, { useState, useEffect } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Heart, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeUnit {
  value: number;
  label: string;
  hindiLabel: string;
}

export function CountdownDisplay() {
  const { wedding } = useWedding();
  const [countdown, setCountdown] = useState<TimeUnit[]>([]);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    if (!wedding?.weddingDate) return;

    const calculateCountdown = () => {
      const now = new Date();
      const weddingDate = new Date(wedding.weddingDate);
      
      if (weddingDate <= now) {
        setIsPast(true);
        return;
      }

      const days = differenceInDays(weddingDate, now);
      const hours = differenceInHours(weddingDate, now) % 24;
      const minutes = differenceInMinutes(weddingDate, now) % 60;
      const seconds = differenceInSeconds(weddingDate, now) % 60;

      setCountdown([
        { value: days, label: 'Days', hindiLabel: 'दिन' },
        { value: hours, label: 'Hours', hindiLabel: 'घंटे' },
        { value: minutes, label: 'Minutes', hindiLabel: 'मिनट' },
        { value: seconds, label: 'Seconds', hindiLabel: 'सेकंड' },
      ]);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [wedding?.weddingDate]);

  if (!wedding) return null;

  const daysRemaining = countdown[0]?.value || 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-royal p-6 sm:p-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pattern-mandala opacity-20" />
      <div className="absolute top-4 right-4 animate-float">
        <Sparkles className="w-6 h-6 text-secondary opacity-60" />
      </div>
      <div className="absolute bottom-4 left-4 animate-float" style={{ animationDelay: '-2s' }}>
        <Heart className="w-5 h-5 text-primary-foreground opacity-40" fill="currentColor" />
      </div>

      <div className="relative z-10">
        {/* Couple Names */}
        <div className="text-center mb-6">
          <p className="text-primary-foreground/80 text-sm uppercase tracking-wider mb-2">
            Celebrating the union of
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-primary-foreground">
            {wedding.brideName}
            <span className="mx-3 text-secondary">&</span>
            {wedding.groomName}
          </h2>
        </div>

        {isPast ? (
          /* Post Wedding Message */
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/10 mb-4">
              <Heart className="w-10 h-10 text-secondary" fill="currentColor" />
            </div>
            <h3 className="font-display text-2xl text-primary-foreground mb-2">
              Happily Married! 💕
            </h3>
            <p className="text-primary-foreground/80 font-hindi">
              शुभ विवाह संपन्न
            </p>
          </div>
        ) : (
          /* Countdown Timer */
          <>
            {/* Days Highlight */}
            <div className="text-center mb-6">
              <div className="inline-block bg-primary-foreground/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-primary-foreground/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-primary-foreground/80 uppercase tracking-wider">
                    {daysRemaining === 1 ? 'Tomorrow!' : 'Days to go'}
                  </span>
                  <Sparkles className="w-4 h-4 text-secondary" />
                </div>
                <div className="font-display text-6xl sm:text-7xl text-primary-foreground">
                  {daysRemaining}
                </div>
                <div className="text-primary-foreground/60 font-hindi text-lg">
                  {daysRemaining === 1 ? 'कल है शुभ दिन!' : `${daysRemaining} दिन बाकी`}
                </div>
              </div>
            </div>

            {/* Detailed Countdown */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {countdown.map((unit, index) => (
                <div
                  key={unit.label}
                  className={cn(
                    "text-center p-3 sm:p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10",
                    "transition-all duration-300 hover:bg-primary-foreground/10"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="font-display text-2xl sm:text-3xl text-primary-foreground">
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-primary-foreground/70 uppercase tracking-wide">
                    {unit.label}
                  </div>
                  <div className="text-xs text-primary-foreground/50 font-hindi hidden sm:block">
                    {unit.hindiLabel}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Download Status Image Button */}
        <div className="mt-6 text-center">
          <Button 
            variant="secondary" 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Status Image
          </Button>
          <p className="text-xs text-primary-foreground/50 mt-2">
            WhatsApp Status ready • 1080 × 1920
          </p>
        </div>
      </div>
    </div>
  );
}
