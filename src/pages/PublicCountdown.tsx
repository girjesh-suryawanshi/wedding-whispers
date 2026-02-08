import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { WeddingDetails, WeddingEvent, EventType } from '@/types/wedding';
import { PublicCountdownDisplay } from '@/components/wedding/countdown/PublicCountdownDisplay';
import { Loader2, Heart } from 'lucide-react';

export default function PublicCountdown() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { wedding, setWedding, fetchPublicWedding, loading: contextLoading } = useWedding();
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    if (shareToken) {
      fetchPublicWedding(shareToken).catch(() => {
        setError('Failed to load countdown');
      });
    } else {
      setError('Invalid countdown link');
    }
  }, [shareToken, fetchPublicWedding]);

  if (contextLoading && !wedding) {
    return (
      <div className="min-h-screen bg-gradient-blush flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading countdown...</p>
        </div>
      </div>
    );
  }

  if (error || !wedding) {
    return (
      <div className="min-h-screen bg-gradient-blush flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl text-foreground mb-2">
            Countdown Not Found
          </h1>
          <p className="text-muted-foreground">
            {error || 'This countdown link may have expired or is invalid.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-blush py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto w-full">
        {/* Live Countdown */}
        <PublicCountdownDisplay wedding={wedding} />

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Live countdown • Theme changes daily 🎨
        </p>
      </div>
    </div>
  );
}
