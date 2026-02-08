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

export function InvitationPreviewBase({ wedding, template, language, cardRef }: InvitationPreviewProps) {
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

      {/* MAIN CONTENT - Scrollable if content overflows */}
      <div className="relative h-full flex flex-col items-center pt-6 pb-4 px-4 z-10 text-center font-sans overflow-y-auto scrollbar-hide">

        {/* HEADER */}
        <div className="flex-none mb-4 space-y-1">
          {(language === 'hindi' || language === 'bilingual') && (
            <div className="mb-1">
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

          <div className="space-y-0.5 opacity-80">
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
        {/* Compacted spacing for mobile safety */}
        <div className="flex-none w-full flex flex-col justify-center items-center py-1 space-y-3">


          {/* Groom Row */}
          <div className="flex items-center w-full px-6">
            <Avatar
              className={cn(
                "w-20 h-20 border-[3px] shadow-xl shrink-0",
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

            <div className="flex-1 text-left pl-4">
              <h2 className={cn(
                "font-serif italic bold text-2xl leading-tight tracking-tight",
                config.textColor
              )}>
                {wedding.groomName.split(' ')[0]}
              </h2>
            </div>
          </div>

          {/* AMPERSAND */}
          <div className="flex items-center justify-center opacity-60">
            <div className={cn("h-px w-16 bg-current", config.accentColor)}></div>
            <span className={cn("font-serif italic text-xl mx-3", config.accentColor)}>
              &
            </span>
            <div className={cn("h-px w-16 bg-current", config.accentColor)}></div>
          </div>

          {/* Bride Row */}
          <div className="flex items-center w-full px-6 justify-end">
            <div className="flex-1 text-right pr-4">
              <h2 className={cn(
                "font-serif italic bold text-2xl leading-tight tracking-tight",
                config.textColor
              )}>
                {wedding.brideName.split(' ')[0]}
              </h2>
            </div>

            <Avatar
              className={cn(
                "w-20 h-20 border-[3px] shadow-xl shrink-0",
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

        {/* --- Invitation Message (Stylish & Professional) --- */}
        <div className="flex-none w-full text-center my-3">
          {(language === 'english' || language === 'bilingual') && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-[1px] bg-gray-300 mb-1.5"></div>

              <p className="text-[10px] italic text-gray-600 leading-relaxed tracking-wide px-6">
                Cordially invite you to join the occasion of their joyous
                <br />
                <span className="font-medium">commitment on</span>
              </p>

              <div className="w-12 h-[1px] bg-gray-300 mt-1.5"></div>
            </div>
          )}
        </div>




        {/* DATE BOX */}
        <div className="flex-none pt-1 pb-3 w-full space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center gap-8 px-6 py-2.5 rounded-2xl border-2 border-amber-300 bg-white min-w-[260px] shadow-sm">

              <span className="text-xs font-bold text-gray-600 tracking-wider">
                {format(new Date(wedding.weddingDate), "EEEE").toUpperCase()}
              </span>

              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-800 leading-none">
                  {format(new Date(wedding.weddingDate), "dd")}
                </span>
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">
                  {format(new Date(wedding.weddingDate), "MMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* VENUE */}
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-medium">
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
        <div className="pb-4 w-full mt-auto">
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

export const InvitationPreview = React.memo(InvitationPreviewBase);
