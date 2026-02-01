import React, { useState, useRef } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Download, Share2, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'english' | 'hindi' | 'bilingual';
type CardStyle = 'traditional' | 'elegant' | 'royal';

const CARD_STYLES = {
  traditional: {
    bg: 'bg-gradient-to-b from-amber-50 to-orange-50',
    border: 'border-amber-300',
    accent: 'text-amber-700',
    pattern: 'pattern-mandala',
  },
  elegant: {
    bg: 'bg-gradient-to-b from-rose-50 to-pink-50',
    border: 'border-rose-200',
    accent: 'text-rose-700',
    pattern: 'pattern-floral',
  },
  royal: {
    bg: 'bg-gradient-to-b from-primary/5 to-accent',
    border: 'border-secondary/40',
    accent: 'text-primary',
    pattern: 'pattern-mandala',
  },
};

export function InvitationCard() {
  const { wedding } = useWedding();
  const [language, setLanguage] = useState<Language>('bilingual');
  const [style, setStyle] = useState<CardStyle>('royal');
  const cardRef = useRef<HTMLDivElement>(null);

  if (!wedding) return null;

  const styleConfig = CARD_STYLES[style];

  const handleDownload = async () => {
    // For now, we'll show a message about the download feature
    // In production, this would use html-to-canvas or similar
    alert('Download feature will generate a high-quality PNG image of your invitation card.');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${wedding.brideName} & ${wedding.groomName} Wedding Invitation`,
          text: `You are cordially invited to the wedding of ${wedding.brideName} & ${wedding.groomName}`,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl text-foreground">Wedding Invitation</h2>
        <p className="text-sm text-muted-foreground">Create beautiful invitation cards</p>
      </div>

      {/* Style Selector */}
      <div className="flex flex-wrap gap-2">
        {(['traditional', 'elegant', 'royal'] as CardStyle[]).map((s) => (
          <Button
            key={s}
            variant={style === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStyle(s)}
            className={cn(style === s && 'btn-royal')}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      {/* Language Tabs */}
      <Tabs value={language} onValueChange={(v) => setLanguage(v as Language)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="hindi">हिंदी</TabsTrigger>
          <TabsTrigger value="bilingual">Bilingual</TabsTrigger>
        </TabsList>

        <TabsContent value={language} className="mt-4">
          {/* Invitation Card Preview */}
          <div
            ref={cardRef}
            className={cn(
              "relative aspect-[3/4] max-w-sm mx-auto rounded-2xl border-4 overflow-hidden",
              styleConfig.bg,
              styleConfig.border,
              styleConfig.pattern
            )}
          >
            {/* Decorative Border */}
            <div className="absolute inset-4 border-2 border-secondary/30 rounded-xl pointer-events-none" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
              {/* Top Ornament */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2">
                <Sparkles className="w-8 h-8 text-secondary" />
              </div>

              {/* Om / Shubh */}
              {(language === 'hindi' || language === 'bilingual') && (
                <div className="mb-4">
                  <span className="text-3xl font-hindi text-secondary">॥ श्री गणेशाय नमः ॥</span>
                </div>
              )}

              {/* Invitation Text */}
              <div className="space-y-4">
                {(language === 'english' || language === 'bilingual') && (
                  <p className={cn("text-sm uppercase tracking-widest", styleConfig.accent)}>
                    Together with their families
                  </p>
                )}
                
                {(language === 'hindi' || language === 'bilingual') && (
                  <p className="text-sm font-hindi text-muted-foreground">
                    आप सपरिवार सादर आमंत्रित हैं
                  </p>
                )}

                {/* Parents Names */}
                {wedding.brideParents && (
                  <p className="text-sm text-muted-foreground">
                    {wedding.brideParents}
                    <br />
                    <span className="text-xs">&</span>
                    <br />
                    {wedding.groomParents}
                  </p>
                )}

                {/* Request Text */}
                <p className={cn("text-xs uppercase tracking-wider", styleConfig.accent)}>
                  {language === 'hindi' ? 'के शुभ विवाह में' : 'Request the pleasure of your company'}
                </p>

                {/* Couple Names */}
                <div className="my-6">
                  <h3 className={cn("font-display text-3xl", styleConfig.accent)}>
                    {wedding.brideName}
                  </h3>
                  <div className="flex items-center justify-center my-2">
                    <div className="w-8 h-px bg-secondary" />
                    <Heart className="w-5 h-5 mx-3 text-secondary" fill="currentColor" />
                    <div className="w-8 h-px bg-secondary" />
                  </div>
                  <h3 className={cn("font-display text-3xl", styleConfig.accent)}>
                    {wedding.groomName}
                  </h3>
                </div>

                {/* Date & Venue */}
                <div className="space-y-2 mt-6">
                  <p className={cn("font-medium", styleConfig.accent)}>
                    {format(new Date(wedding.weddingDate), "EEEE, MMMM d, yyyy")}
                  </p>
                  {language !== 'english' && (
                    <p className="text-sm font-hindi text-muted-foreground">
                      {format(new Date(wedding.weddingDate), "d MMMM, yyyy")}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {wedding.venue}
                  </p>
                </div>
              </div>

              {/* Bottom Ornament */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-px bg-secondary" />
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <div className="w-6 h-px bg-secondary" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleDownload} className="flex-1 btn-royal">
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Download as PNG for WhatsApp • PDF print support coming soon
      </p>
    </div>
  );
}
