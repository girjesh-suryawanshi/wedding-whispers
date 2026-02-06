import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { WeddingDetails, WeddingEvent, EventType } from '@/types/wedding';
import { PublicCountdownDisplay } from '@/components/wedding/countdown/PublicCountdownDisplay';
import { Loader2, Heart } from 'lucide-react';

export default function PublicCountdown() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [wedding, setWedding] = useState<WeddingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWedding() {
      if (!shareToken) {
        setError('Invalid countdown link');
        setLoading(false);
        return;
      }

      try {
        // Fetch wedding using the security definer function
        const { data: weddingData, error: weddingError } = await supabase
          .rpc('get_wedding_by_share_token', { token: shareToken });

        if (weddingError) throw weddingError;

        if (!weddingData || weddingData.length === 0) {
          setError('Countdown not found');
          setLoading(false);
          return;
        }

        const w = weddingData[0];

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .rpc('get_wedding_events_by_wedding_id', { wedding_uuid: w.id });

        if (eventsError) throw eventsError;

        const events: WeddingEvent[] = (eventsData || []).map((e: any) => ({
          id: e.id,
          type: e.event_type as EventType,
          customName: e.custom_name || undefined,
          date: new Date(e.event_date),
          time: e.event_time,
          venue: e.venue || undefined,
          description: e.description || undefined,
        }));

        const weddingDetails: WeddingDetails = {
          id: w.id,
          brideName: w.bride_name,
          groomName: w.groom_name,
          weddingDate: new Date(w.wedding_date),
          venue: w.venue,
          bridePhoto: w.bride_photo || undefined,
          groomPhoto: w.groom_photo || undefined,
          brideParents: w.bride_parents || undefined,
          groomParents: w.groom_parents || undefined,
          rsvpPhone: w.rsvp_phone || undefined,
          rsvpEmail: w.rsvp_email || undefined,
          customMessage: w.custom_message || undefined,
          events,
          createdAt: new Date(),
        };

        setWedding(weddingDetails);
      } catch (err) {
        console.error('Error fetching countdown:', err);
        setError('Failed to load countdown');
      } finally {
        setLoading(false);
      }
    }

    fetchWedding();
  }, [shareToken]);

  if (loading) {
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
