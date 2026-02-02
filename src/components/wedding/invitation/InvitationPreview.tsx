import React from 'react';
import { WeddingDetails } from '@/types/wedding';
import { TemplateStyle, TEMPLATE_CONFIGS } from './templateConfig';
import { TemplateDecorations } from './TemplateDecorations';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Heart, User, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'english' | 'hindi' | 'bilingual';

interface InvitationPreviewProps {
  wedding: WeddingDetails;
  template: TemplateStyle;
  language: Language;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export function InvitationPreview({ wedding, template, language, cardRef }: InvitationPreviewProps) {
  const config = TEMPLATE_CONFIGS[template];
  const isLightTemplate = template === 'mughal' || template === 'garden' || template === 'rajasthani';
  
  return (
    <div
      ref={cardRef}
      className={cn(
        "relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl",
        config.bgGradient,
        "border-2",
        config.borderColor
      )}
    >
      {/* Template-specific decorations */}
      <TemplateDecorations template={template} />
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center z-10">
        {/* Religious/Cultural Header */}
        {(language === 'hindi' || language === 'bilingual') && (
          <div className={cn("mb-2", template === 'rajasthani' ? 'mt-16' : 'mt-8')}>
            <span className={cn(
              "text-lg font-hindi",
              config.decorativeColor,
              template === 'royalBlue' && "text-blue-300"
            )}>
              ॥ श्री गणेशाय नमः ॥
            </span>
          </div>
        )}

        {/* Invitation Text */}
        <div className="space-y-2 mb-4">
          {(language === 'english' || language === 'bilingual') && (
            <p className={cn(
              "text-xs uppercase tracking-[0.2em]",
              config.secondaryTextColor
            )}>
              Together with their families
            </p>
          )}
          
          {(language === 'hindi' || language === 'bilingual') && (
            <p className={cn(
              "text-xs font-hindi",
              config.secondaryTextColor
            )}>
              आप सपरिवार सादर आमंत्रित हैं
            </p>
          )}
        </div>

        {/* Parents Names */}
        {wedding.brideParents && (
          <div className={cn("text-xs mb-3", config.secondaryTextColor)}>
            <p>{wedding.brideParents}</p>
            <span className="text-[10px]">&</span>
            <p>{wedding.groomParents}</p>
          </div>
        )}

        {/* Couple Names */}
        <div className="my-4">
          <h2 className={cn(
            config.fontStyle === 'script' ? "font-serif italic" : "font-display",
            "text-3xl leading-tight",
            config.textColor
          )}>
            {wedding.brideName}
          </h2>
          
          <div className="flex items-center justify-center my-2">
            <div className={cn("w-6 h-px", isLightTemplate ? "bg-amber-500" : "bg-blue-400")} />
            <span className={cn(
              "mx-3 text-2xl",
              config.fontStyle === 'script' ? "font-serif italic" : "font-display",
              config.accentColor
            )}>
              &
            </span>
            <div className={cn("w-6 h-px", isLightTemplate ? "bg-amber-500" : "bg-blue-400")} />
          </div>
          
          <h2 className={cn(
            config.fontStyle === 'script' ? "font-serif italic" : "font-display",
            "text-3xl leading-tight",
            config.textColor
          )}>
            {wedding.groomName}
          </h2>
        </div>

        {/* Invitation phrase */}
        <p className={cn("text-xs italic mb-4", config.secondaryTextColor)}>
          {language === 'hindi' 
            ? 'के शुभ विवाह पर'
            : 'cordially invite you to join the occasion of their joyous commitment on'
          }
        </p>

        {/* Couple Photos */}
        {(wedding.bridePhoto || wedding.groomPhoto) && (
          <div className="flex items-center justify-center gap-3 my-4">
            <Avatar className={cn(
              "w-16 h-16 border-2 shadow-lg",
              isLightTemplate ? "border-amber-400" : "border-blue-400"
            )}>
              {wedding.bridePhoto ? (
                <AvatarImage src={wedding.bridePhoto} alt={wedding.brideName} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-accent">
                  <User className="w-6 h-6 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
            <Heart className={cn(
              "w-5 h-5",
              isLightTemplate ? "text-rose-500" : "text-rose-400"
            )} fill="currentColor" />
            <Avatar className={cn(
              "w-16 h-16 border-2 shadow-lg",
              isLightTemplate ? "border-amber-400" : "border-blue-400"
            )}>
              {wedding.groomPhoto ? (
                <AvatarImage src={wedding.groomPhoto} alt={wedding.groomName} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-accent">
                  <User className="w-6 h-6 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        )}

        {/* Date Display */}
        <div className={cn("my-4 space-y-1", config.textColor)}>
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="uppercase tracking-wider">
              {format(new Date(wedding.weddingDate), "EEEE")}
            </span>
            <span className={cn(
              "text-3xl font-bold px-3 py-1 rounded",
              isLightTemplate ? "bg-amber-100" : "bg-blue-800/50"
            )}>
              {format(new Date(wedding.weddingDate), "dd")}
            </span>
            <span className="uppercase tracking-wider">
              {format(new Date(wedding.weddingDate), "h:mm a")}
            </span>
          </div>
          <p className={cn("text-sm font-medium", config.accentColor)}>
            {format(new Date(wedding.weddingDate), "MMMM yyyy")}
          </p>
        </div>

        {/* Venue */}
        <div className={cn("mt-2 text-center", config.secondaryTextColor)}>
          <p className="text-xs uppercase tracking-wider mb-1">at</p>
          <p className={cn("text-sm font-medium", config.textColor)}>
            {wedding.venue}
          </p>
        </div>

        {/* Hindi Date (if bilingual) */}
        {language !== 'english' && (
          <p className={cn("text-xs font-hindi mt-2", config.secondaryTextColor)}>
            {format(new Date(wedding.weddingDate), "d MMMM, yyyy")}
          </p>
        )}

        {/* Custom Message */}
        {wedding.customMessage && (
          <p className={cn(
            "text-[10px] italic mt-3 px-4 leading-relaxed",
            config.secondaryTextColor
          )}>
            "{wedding.customMessage}"
          </p>
        )}

        {/* RSVP Section */}
        {(wedding.rsvpPhone || wedding.rsvpEmail) && (
          <div className={cn(
            "mt-3 pt-2 border-t w-full",
            isLightTemplate ? "border-amber-300/50" : "border-blue-400/30"
          )}>
            <p className={cn("text-[10px] uppercase tracking-wider mb-1", config.secondaryTextColor)}>
              {language === 'hindi' ? 'संपर्क करें' : 'RSVP'}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {wedding.rsvpPhone && (
                <span className={cn("flex items-center gap-1 text-[10px]", config.textColor)}>
                  <Phone className="w-2.5 h-2.5" />
                  {wedding.rsvpPhone}
                </span>
              )}
              {wedding.rsvpEmail && (
                <span className={cn("flex items-center gap-1 text-[10px]", config.textColor)}>
                  <Mail className="w-2.5 h-2.5" />
                  {wedding.rsvpEmail}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
