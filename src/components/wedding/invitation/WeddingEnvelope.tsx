import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { WeddingDetails } from '@/types/wedding';
import { Heart } from 'lucide-react';

interface WeddingEnvelopeProps {
    wedding: WeddingDetails;
    onOpenComplete: () => void;
}

export function WeddingEnvelope({ wedding, onOpenComplete }: WeddingEnvelopeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);

        // Sequence:
        // 1. Envelope opens (0s)
        // 2. Content appears/Names animate (0.5s)
        // 3. Fade out envelope (3.5s) -> Call onOpenComplete

        setTimeout(() => {
            setShowContent(true);
        }, 500);

        setTimeout(() => {
            setIsFadingOut(true);
        }, 3000);

        setTimeout(() => {
            onOpenComplete();
        }, 4000);
    };

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 transition-opacity duration-1000",
                isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
        >
            {/* Background Particles/Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Simple floating circles */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-700" />

                {/* Flying Hearts & Roses */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute -bottom-10 text-rose-300/60 animate-float-up"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${8 + Math.random() * 7}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            fontSize: `${20 + Math.random() * 24}px`
                        }}
                    >
                        {i % 2 === 0 ? '❤️' : '🌹'}
                    </div>
                ))}
            </div>

            <div
                onClick={handleOpen}
                className={cn(
                    "relative w-[340px] h-[240px] cursor-pointer perspective-[1000px] group transition-all duration-700 z-10",
                    isOpen ? "scale-100 translate-y-16" : "hover:scale-105"
                )}
            >

                {/* Envelope Body (Back) */}
                <div className="absolute inset-0 bg-[#f8f5e6] rounded-lg shadow-2xl border border-[#e6dcc0] z-0"></div>

                {/* The Card Inside (Animating Up) */}
                <div
                    className={cn(
                        "absolute left-4 right-4 top-2 bottom-2 bg-white flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out p-4 shadow-sm border border-gray-100",
                        "z-10",
                        isOpen ? "-translate-y-32" : "translate-y-0"
                    )}
                >
                    <div className={cn("transition-all duration-1000 delay-500 flex flex-col items-center gap-2", showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                        {/* Hindi Blessing */}
                        <span className="text-amber-600 font-medium text-lg animate-pulse">
                            ॥ श्री गणेशाय नमः ॥
                        </span>

                        {/* Names */}
                        <div className="font-serif text-2xl text-gray-800 flex items-center gap-3 mt-2">
                            <span className="font-bold">{wedding.groomName.split(' ')[0]}</span>
                            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                            <span className="font-bold">{wedding.brideName.split(' ')[0]}</span>
                        </div>
                    </div>
                </div>

                {/* Envelope Flap (Top Triangle) */}
                <div
                    className={cn(
                        "absolute top-0 left-0 w-full h-0 border-l-[170px] border-r-[170px] border-t-[120px] border-l-transparent border-r-transparent border-t-[#ebe5ce] z-20 origin-top transition-transform duration-700 ease-in-out",
                        isOpen ? "rotate-x-180 opacity-0" : "rotate-x-0 drop-shadow-md"
                    )}
                ></div>

                {/* Envelope Body (Bottom Triangle) */}
                <div className="absolute bottom-0 left-0 w-full h-0 border-l-[170px] border-r-[170px] border-b-[120px] border-l-transparent border-r-transparent border-b-[#fcf9ee] z-20 pointer-events-none drop-shadow-sm"></div>

                {/* Envelope Body (Left Triangle) */}
                <div className="absolute top-0 left-0 w-0 h-full border-t-[120px] border-b-[120px] border-l-[170px] border-t-transparent border-b-transparent border-l-[#f4efdd] z-20 pointer-events-none"></div>

                {/* Envelope Body (Right Triangle) */}
                <div className="absolute top-0 right-0 w-0 h-full border-t-[120px] border-b-[120px] border-r-[170px] border-t-transparent border-b-transparent border-r-[#f4efdd] z-20 pointer-events-none"></div>


                {/* Wax Seal */}
                <div
                    className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500",
                        isOpen ? "opacity-0 scale-150" : "opacity-100 scale-100"
                    )}
                >
                    <div className="w-16 h-16 rounded-full bg-red-800 shadow-xl border-4 border-red-700/50 flex items-center justify-center text-amber-200 font-serif text-2xl font-bold">
                        W
                    </div>
                </div>

                {/* Tap Hint */}
                <div
                    className={cn(
                        "absolute -bottom-16 left-0 right-0 text-center transition-opacity duration-300",
                        isOpen ? "opacity-0" : "opacity-100"
                    )}
                >
                    <p className="text-white/80 text-sm animate-bounce font-medium tracking-widest uppercase">Tap to Open</p>
                </div>

            </div>
        </div>
    );
}
