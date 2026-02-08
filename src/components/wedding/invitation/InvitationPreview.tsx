import React from 'react';
import { WeddingDetails } from '@/types/wedding';
import { TemplateStyle, TEMPLATE_CONFIGS } from './templateConfig';
import { TemplateDecorations } from './TemplateDecorations';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { User, Phone } from 'lucide-react';
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
  const isLightTemplate =
    template === 'mughal' || template === 'garden' || template === 'rajasthani';

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative aspect-[9/16] w-full max-w-[400px] mx-auto rounded-xl overflow-hidden shadow-2xl bg-white",
        config.bgGradient,
        "border-[8px] border-double",
        config.borderColor
      )}
    >
      <TemplateDecorations template={template} />

      {/* MAIN CONTENT */}
      <div className="relative h-full flex flex-col items-center pt-8 pb-6 px-4 z-10 text-center font-sans">

        {/* HEADER */}
        <div className="flex-none mb-6 space-y-2">
          {(language === 'hindi' || language === 'bilingual') && (
            <div className="mb-2">
              <span
                className={cn(
                  "text-xl font-hindi font-medium tracking-wide",
                  config.decorativeColor
                )}
              >
                ॥ श्री गणेशाय नमः ॥
              </span>
            </div>
          )}

          <div className="space-y-1 opacity-80">
            {(language === 'english' || language === 'bilingual') && (
              <p className={cn(
                "text-[10px] uppercase tracking-[0.25em] font-medium",
                config.secondaryTextColor
              )}>
                Together with their families
              </p>
            )}

            {(language === 'hindi' || language === 'bilingual') && (
              <p className={cn(
                "text-[10px] font-hindi tracking-wide",
                config.secondaryTextColor
              )}>
                आप सपरिवार सादर आमंत्रित हैं
              </p>
            )}
          </div>
        </div>

        {/* COUPLE SECTION (SAFE + BALANCED) */}
        {/* <div className="flex-1 w-full flex flex-col justify-center items-center py-1 space-y-6"> */}
        <div className="flex-1 w-full flex flex-col justify-center items-center py-1 space-y-5">


          {/* Groom Row */}
          <div className="flex items-center w-full px-6">
            <Avatar
              className={cn(
                "w-24 h-24 border-[3px] shadow-xl shrink-0",
                isLightTemplate
                  ? "border-amber-400 ring-amber-200"
                  : "border-blue-400 ring-blue-300"
              )}
            >
              {wedding.groomPhoto ? (
                <AvatarImage
                  src={wedding.groomPhoto}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-muted/30">
                  <User className="w-8 h-8 opacity-40" />
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 text-left pl-6">
              <h2 className={cn(
                "font-serif text-4xl leading-tight tracking-tight",
                config.textColor
              )}>
                {wedding.groomName.split(' ')[0]}
              </h2>
            </div>
          </div>

          {/* AMPERSAND */}
          <div className="flex items-center justify-center opacity-60">
            <div className={cn("h-px w-20 bg-current", config.accentColor)}></div>
            <span className={cn("font-serif italic text-2xl mx-4", config.accentColor)}>
              &
            </span>
            <div className={cn("h-px w-20 bg-current", config.accentColor)}></div>
          </div>

          {/* Bride Row */}
          <div className="flex items-center w-full px-6 justify-end">
            <div className="flex-1 text-right pr-6">
              <h2 className={cn(
                "font-serif text-4xl leading-tight tracking-tight",
                config.textColor
              )}>
                {wedding.brideName.split(' ')[0]}
              </h2>
            </div>

            <Avatar
              className={cn(
                "w-24 h-24 border-[3px] shadow-xl shrink-0",
                isLightTemplate
                  ? "border-amber-400 ring-amber-200"
                  : "border-blue-400 ring-blue-300"
              )}
            >
              {wedding.bridePhoto ? (
                <AvatarImage
                  src={wedding.bridePhoto}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-muted/30">
                  <User className="w-8 h-8 opacity-40" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>

        {/* DATE BOX */}
        <div className="flex-none pt-2 pb-4 w-full space-y-6">
          <div className="flex justify-center">
            <div className="flex items-center justify-between px-6 py-3 rounded-2xl border-2 border-amber-300 bg-white min-w-[300px] shadow-sm">

              <span className="text-[11px] font-bold text-gray-600">
                {format(new Date(wedding.weddingDate), "EEEE").toUpperCase()}
              </span>

              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-800 leading-none">
                  {format(new Date(wedding.weddingDate), "dd")}
                </span>
                <span className="text-[9px] font-bold text-green-700">
                  {format(new Date(wedding.weddingDate), "MMM yyyy")}
                </span>
              </div>

              <span className="text-[11px] font-bold text-gray-600">
                {format(new Date(wedding.weddingDate), "h:mm a")}
              </span>
            </div>
          </div>

          {/* VENUE */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
              AT
            </p>
            <h3 className="text-sm font-bold tracking-wide uppercase px-4 leading-relaxed font-serif text-gray-900">
              {wedding.venue}
            </h3>
          </div>
        </div>

        {/* EVENTS GRID — FULLY DYNAMIC */}
        {wedding.events && wedding.events.length > 0 && (
          <div className="w-full px-6 pb-4">
            <div
              className={cn(
                "grid gap-2",
                wedding.events.length === 1 && "grid-cols-1 place-items-center",
                wedding.events.length === 2 && "grid-cols-2",
                wedding.events.length >= 3 && "grid-cols-3"
              )}
            >
              {wedding.events.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center py-2 px-1 rounded-lg border border-amber-200 bg-amber-50 shadow-sm"
                >
                  <span className="text-[9px] uppercase font-bold tracking-wider mb-0.5 text-gray-800">
                    {event.customName || event.type}
                  </span>
                  <span className="text-[9px] text-gray-600 font-medium">
                    {format(new Date(event.date), "MMM d")} • {event.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* FOOTER */}
        <div className="pb-4 w-full">
          <div className="flex items-center justify-center gap-3">
            <span className="w-2 h-2 rounded-full bg-pink-300"></span>
            <span className="w-2 h-2 rounded-full bg-pink-200"></span>
            <span className="w-3 h-3 rounded-full bg-pink-400"></span>
            <span className="w-2 h-2 rounded-full bg-pink-200"></span>
            <span className="w-2 h-2 rounded-full bg-pink-300"></span>
          </div>

          {wedding.rsvpPhone && (
            <div className="mt-2 text-[9px] text-gray-500 font-medium tracking-wide flex items-center justify-center gap-1">
              <Phone className="w-2.5 h-2.5" /> {wedding.rsvpPhone}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
