import React, { useState, useEffect, useRef } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Heart, Sparkles, Download, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { getTodayTheme } from './countdown/countdownThemes';
import { FloralBorder } from './countdown/FloralBorder';
import { TextureOverlay } from './countdown/TextureOverlay';
import { ShareCountdown } from './ShareCountdown';

interface TimeUnit {
  value: number;
  label: string;
  hindiLabel: string;
}

export function CountdownDisplay() {
  const { wedding } = useWedding();
  const [countdown, setCountdown] = useState<TimeUnit[]>([]);
  const [isPast, setIsPast] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = getTodayTheme();

  // Determine floral border variant from theme
  const floralVariant = theme.floralBorder.includes('gold') 
    ? 'gold' 
    : theme.floralBorder.includes('cream') 
      ? 'cream' 
      : 'maroon';

  // Determine texture type from theme
  const textureType = theme.texture.replace('texture-', '') as 'silk' | 'brocade' | 'velvet' | 'chiffon';

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
  const hasBridePhoto = Boolean(wedding.bridePhoto);
  const hasGroomPhoto = Boolean(wedding.groomPhoto);
  const hasPhotos = hasBridePhoto || hasGroomPhoto;

  const handleDownload = async () => {
    if (!cardRef.current) {
      toast.error('Unable to capture countdown');
      return;
    }

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 360,
        height: 640,
      });

      const link = document.createElement('a');
      link.download = `${wedding.brideName}-${wedding.groomName}-countdown-${daysRemaining}days.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast.success('Status image downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Downloadable Card - 9:16 aspect ratio for WhatsApp Status */}
      <div
        ref={cardRef}
        className={cn(
          "relative overflow-hidden rounded-2xl p-6",
          "aspect-[9/16] max-w-[360px] mx-auto",
          theme.gradient
        )}
      >
        {/* Texture Overlay */}
        <TextureOverlay texture={textureType} />
        
        {/* Pattern Overlay */}
        <div className={cn("absolute inset-0 opacity-20", theme.pattern)} />
        
        {/* Floral Border */}
        <FloralBorder variant={floralVariant} />

        {/* Decorative Elements */}
        <div className="absolute top-16 right-10 animate-float">
          <Sparkles className={cn("w-6 h-6 opacity-60", theme.accentColor)} />
        </div>
        <div className="absolute bottom-16 left-10 animate-float" style={{ animationDelay: '-2s' }}>
          <Heart className={cn("w-5 h-5 opacity-40", theme.textColor)} fill="currentColor" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between py-8 px-2">
          {/* Couple Names */}
          <div className="text-center pt-4">
            <p className={cn("text-sm uppercase tracking-wider mb-2 opacity-80", theme.textColor)}>
              Celebrating the union of
            </p>
            <h2 className={cn("font-display text-2xl", theme.textColor)}>
              {wedding.brideName}
              <span className={cn("mx-2", theme.accentColor)}>&</span>
              {wedding.groomName}
            </h2>
          </div>

          {/* Couple Photos */}
          {hasPhotos && (
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 rounded-full animate-pulse-gold",
                  hasBridePhoto ? "opacity-100" : "opacity-0"
                )} />
                <Avatar className={cn(
                  "w-20 h-20 border-3 shadow-lg",
                  theme.borderColor,
                  "ring-2 ring-offset-2 ring-offset-transparent",
                  theme.accentColor.replace('text-', 'ring-')
                )}>
                  {wedding.bridePhoto ? (
                    <AvatarImage src={wedding.bridePhoto} alt={wedding.brideName} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-muted/30">
                      <User className={cn("w-8 h-8 opacity-50", theme.textColor)} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className={cn("text-xs mt-1 text-center font-medium", theme.textColor)}>
                  {wedding.brideName.split(' ')[0]}
                </p>
              </div>

              <Heart className={cn("w-6 h-6 animate-pulse-soft", theme.accentColor)} fill="currentColor" />

              <div className="relative">
                <div className={cn(
                  "absolute inset-0 rounded-full animate-pulse-gold",
                  hasGroomPhoto ? "opacity-100" : "opacity-0"
                )} />
                <Avatar className={cn(
                  "w-20 h-20 border-3 shadow-lg",
                  theme.borderColor,
                  "ring-2 ring-offset-2 ring-offset-transparent",
                  theme.accentColor.replace('text-', 'ring-')
                )}>
                  {wedding.groomPhoto ? (
                    <AvatarImage src={wedding.groomPhoto} alt={wedding.groomName} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-muted/30">
                      <User className={cn("w-8 h-8 opacity-50", theme.textColor)} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className={cn("text-xs mt-1 text-center font-medium", theme.textColor)}>
                  {wedding.groomName.split(' ')[0]}
                </p>
              </div>
            </div>
          )}

          {isPast ? (
            /* Post Wedding Message */
            <div className="text-center flex-1 flex flex-col items-center justify-center">
              <div className={cn("inline-flex items-center justify-center w-20 h-20 rounded-full mb-4", theme.textColor, "bg-current/10")}>
                <Heart className={cn("w-10 h-10", theme.accentColor)} fill="currentColor" />
              </div>
              <h3 className={cn("font-display text-2xl mb-2", theme.textColor)}>
                Happily Married! 💕
              </h3>
              <p className={cn("font-hindi opacity-80", theme.textColor)}>
                शुभ विवाह संपन्न
              </p>
            </div>
          ) : (
            /* Countdown Timer */
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Days Highlight */}
              <div className={cn(
                "inline-block backdrop-blur-sm rounded-2xl px-8 py-4 border mb-4",
                theme.borderColor,
                "bg-current/5"
              )} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className={cn("w-4 h-4", theme.accentColor)} />
                  <span className={cn("text-sm uppercase tracking-wider opacity-80", theme.textColor)}>
                    {daysRemaining === 1 ? 'Tomorrow!' : 'Days to go'}
                  </span>
                  <Sparkles className={cn("w-4 h-4", theme.accentColor)} />
                </div>
                <div className={cn("font-display text-6xl", theme.textColor)}>
                  {daysRemaining}
                </div>
                <div className={cn("font-hindi text-lg opacity-60", theme.textColor)}>
                  {daysRemaining === 1 ? 'कल है शुभ दिन!' : `${daysRemaining} दिन बाकी`}
                </div>
              </div>

              {/* Detailed Countdown */}
              <div className="grid grid-cols-4 gap-2 w-full">
                {countdown.map((unit) => (
                  <div
                    key={unit.label}
                    className={cn(
                      "text-center p-2 rounded-xl border",
                      theme.borderColor,
                      "transition-all duration-300"
                    )}
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <div className={cn("font-display text-xl", theme.textColor)}>
                      {String(unit.value).padStart(2, '0')}
                    </div>
                    <div className={cn("text-[10px] uppercase tracking-wide opacity-70", theme.textColor)}>
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Theme Label */}
          <div className="text-center pt-4">
            <p className={cn("text-[10px] uppercase tracking-wider opacity-50", theme.textColor)}>
              Today's Theme: {theme.name}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Outside the card */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            variant="secondary" 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? 'Generating...' : 'Download Status'}
          </Button>
          
          <ShareCountdown shareToken={wedding.shareToken} />
        </div>
        <p className="text-xs text-muted-foreground">
          WhatsApp Status ready • New theme daily • Share live countdown
        </p>
      </div>
    </div>
  );
}
