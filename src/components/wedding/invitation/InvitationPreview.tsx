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
        "relative aspect-[9/16] w-full max-w-[400px] mx-auto rounded-xl overflow-hidden shadow-2xl bg-white",
        config.bgGradient,
        "border-[8px] border-double", // Premium border
        config.borderColor
      )}
    >
      {/* Template-specific decorations */}
      <TemplateDecorations template={template} />

      {/* Main Content Container - Flex Col with balanced spacing */}
      <div className="relative h-full flex flex-col items-center pt-8 pb-6 px-4 z-10 text-center font-sans">

        {/* --- TOP SECTION: Intro & Blessing --- */}
        <div className="flex-none mb-6 space-y-2">
          {(language === 'hindi' || language === 'bilingual') && (
            <div className="mb-2">
              <span className={cn(
                "text-xl font-hindi font-medium tracking-wide",
                config.decorativeColor,
                template === 'royalBlue' && "text-blue-300"
              )}>
                ॥ श्री गणेशाय नमः ॥
              </span>
            </div>
          )}

          <div className="space-y-1 opacity-80">
            {(language === 'english' || language === 'bilingual') && (
              <p className={cn("text-[10px] uppercase tracking-[0.25em] font-medium", config.secondaryTextColor)}>
                Together with their families
              </p>
            )}
            {(language === 'hindi' || language === 'bilingual') && (
              <p className={cn("text-[10px] font-hindi tracking-wide", config.secondaryTextColor)}>
                आप सपरिवार सादर आमंत्रित हैं
              </p>
            )}
          </div>
        </div>

        {/* --- MIDDLE SECTION: Couple & Names (The Focus) --- */}
        {/* Layout: Groom Photo (Left of Center) aligned with Name. Bride Photo (Right of Center) aligned with Name. */}
        {/* Using a grid/flex layout to balance them. */}
        <div className="flex-1 w-full flex flex-col justify-center items-center py-2 space-y-6">

          {/* Bride Row */}
          <div className="flex items-center w-full px-6 relative">
            {/* Photo Left */}
            <div className="relative z-10 -mr-4 transform hover:scale-105 transition-transform duration-500">
              <Avatar className={cn(
                "w-24 h-24 border-[3px] shadow-xl",
                "ring-2 ring-offset-2 ring-offset-transparent", // Double ring effect
                isLightTemplate ? "border-amber-400 ring-amber-200" : "border-blue-400 ring-blue-300"
              )}>
                {wedding.bridePhoto ? (
                  <AvatarImage src={wedding.bridePhoto} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-muted/30"><User className="w-8 h-8 opacity-40" /></AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Name Right */}
            <div className="flex-1 text-left pl-8">
              <h2 className={cn(
                "font-serif text-4xl leading-tight tracking-tight drop-shadow-sm", // Premium serif font
                config.textColor
              )}>
                {wedding.brideName.split(' ')[0]} {/* First Name Only for elegance */}
              </h2>
            </div>
          </div>

          {/* Ampersand Separator */}
          <div className="flex items-center justify-center -my-2 opacity-60">
            <div className={cn("h-px w-16 bg-current", config.accentColor)}></div>
            <span className={cn("font-serif italic text-2xl mx-4", config.accentColor)}>&</span>
            <div className={cn("h-px w-16 bg-current", config.accentColor)}></div>
          </div>

          {/* Groom Row */}
          <div className="flex items-center justify-end w-full px-6 relative">
            {/* Name Left */}
            <div className="flex-1 text-right pr-8">
              <h2 className={cn(
                "font-serif text-4xl leading-tight tracking-tight drop-shadow-sm",
                config.textColor
              )}>
                {wedding.groomName.split(' ')[0]}
              </h2>
            </div>

            {/* Photo Right */}
            <div className="relative z-10 -ml-4 transform hover:scale-105 transition-transform duration-500">
              <Avatar className={cn(
                "w-24 h-24 border-[3px] shadow-xl",
                "ring-2 ring-offset-2 ring-offset-transparent",
                isLightTemplate ? "border-amber-400 ring-amber-200" : "border-blue-400 ring-blue-300"
              )}>
                {wedding.groomPhoto ? (
                  <AvatarImage src={wedding.groomPhoto} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-muted/30"><User className="w-8 h-8 opacity-40" /></AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
        </div>

        {/* --- LOWER MIDDLE: Invitation Line & Date --- */}
        <div className="flex-none pt-4 pb-2 w-full space-y-5">
          {/* Invitation Line */}
          <div className="px-8">
            <p className={cn(
              "font-serif italic text-sm leading-relaxed text-center opacity-90",
              config.secondaryTextColor
            )}>
              {language === 'hindi'
                ? 'अपने स्नेह और आशीर्वाद से वर-वधू के नए जीवन का शुभारंभ करें'
                : 'cordially invite you to join the occasion of their joyous commitment on'
              }
            </p>
          </div>

          {/* Date Box Design */}
          <div className="flex flex-col items-center justify-center">
            <div className={cn(
              "flex items-center gap-4 px-6 py-3 rounded-lg border shadow-sm backdrop-blur-sm",
              isLightTemplate ? "bg-white/60 border-amber-200" : "bg-black/20 border-blue-400/30"
            )}>
              {/* Day */}
              <span className={cn("text-xs uppercase tracking-widest font-semibold opacity-80", config.textColor)}>
                {format(new Date(wedding.weddingDate), "EEEE")}
              </span>

              {/* Date Divider */}
              <div className={cn("w-px h-8 opacity-40", config.textColor, "bg-current")} />

              {/* Big Date */}
              <div className="flex flex-col items-center leading-none">
                <span className={cn("text-3xl font-bold font-serif", config.textColor)}>
                  {format(new Date(wedding.weddingDate), "dd")}
                </span>
                <span className={cn("text-[10px] uppercase tracking-wide font-medium", config.accentColor)}>
                  {format(new Date(wedding.weddingDate), "MMMM yyyy")}
                </span>
              </div>

              {/* Time Divider */}
              <div className={cn("w-px h-8 opacity-40", config.textColor, "bg-current")} />

              {/* Time */}
              <span className={cn("text-xs uppercase tracking-widest font-semibold opacity-80", config.textColor)}>
                {format(new Date(wedding.weddingDate), "h:mm a")}
              </span>
            </div>
          </div>

          {/* Venue */}
          <div className="space-y-1">
            <p className={cn("text-[10px] uppercase tracking-[0.2em] opacity-60", config.secondaryTextColor)}>AT</p>
            <h3 className={cn("text-sm font-bold tracking-wide uppercase px-6 leading-normal", config.textColor)}>
              {wedding.venue}
            </h3>
          </div>
        </div>


        {/* --- BOTTOM SECTION: Events & Footer --- */}
        <div className="flex-none w-full mt-4 space-y-3">
          {/* Events List (Clean Boxed Rows) */}
          {wedding.events && wedding.events.length > 0 && (
            <div className="w-full max-w-[320px] mx-auto space-y-1.5">
              {wedding.events.slice(0, 3).map((event, index) => ( // Show max 3 main events
                <div key={index} className={cn(
                  "flex items-center justify-between px-3 py-1.5 rounded-md border text-[10px]",
                  isLightTemplate ? "bg-white/40 border-amber-100" : "bg-white/10 border-white/10"
                )}>
                  <span className={cn("font-semibold tracking-wide uppercase", config.textColor)}>
                    {event.customName || event.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={cn("opacity-80", config.secondaryTextColor)}>
                      {format(new Date(event.date), "MMMM d")}
                    </span>
                    <span className={cn("w-1 h-1 rounded-full opacity-50 bg-current", config.secondaryTextColor)} />
                    <span className={cn("opacity-80", config.secondaryTextColor)}>
                      {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RSVP - Minimal */}
          {(wedding.rsvpPhone || wedding.rsvpEmail) && (
            <div className={cn("pt-2 border-t w-1/2 mx-auto", isLightTemplate ? "border-amber-900/10" : "border-white/10")}>
              <div className="flex items-center justify-center gap-4 text-[9px] opacity-70">
                {wedding.rsvpPhone && (
                  <span className={cn("flex items-center gap-1", config.textColor)}>
                    <Phone className="w-2.5 h-2.5" /> RSVP {wedding.rsvpPhone}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
