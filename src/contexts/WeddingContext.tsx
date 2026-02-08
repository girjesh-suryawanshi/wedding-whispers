import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { WeddingDetails, WeddingEvent } from '@/types/wedding';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface WeddingContextType {
  wedding: WeddingDetails | null;
  setWedding: (wedding: WeddingDetails | null) => void;
  updateWedding: (updates: Partial<WeddingDetails>) => void;
  addEvent: (event: WeddingEvent) => void;
  updateEvent: (eventId: string, updates: Partial<WeddingEvent>) => void;
  removeEvent: (eventId: string) => void;
  reorderEvents: (events: WeddingEvent[]) => void;
  isSetupComplete: boolean;
  resetWedding: () => void;
  loading: boolean;
  saveWedding: (wedding: WeddingDetails) => Promise<void>;
  fetchPublicWedding: (token: string) => Promise<void>;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wedding, setWeddingState] = useState<WeddingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch wedding from database
  const fetchWedding = useCallback(async () => {
    // For local dev without auth, we might need a way to identify "current user"
    // For now, let's assume we are fetching by share token or a hardcoded ID for dev?
    // wait, the previous code used user.id. 
    // Since we are moving away from Supabase Auth, we need a new way to handle "owner" access.
    // For the "Invitation" view (public), we use the token.
    // For the "Dashboard" view (private), we need a simplified auth.

    // TEMPORARY: For local migration, let's prioritize the Public Invitation view first
    // as that's what seems to be the main focus of recent tasks.
    // We will leave the "Dashboard" fetching for a moment or mock it.

    setLoading(false);
  }, [user]);

  // We need to expose a way to fetch by token for the Public view
  const fetchPublicWedding = async (token: string) => {
    setLoading(true);
    try {
      // Use the new API service
      const { api } = await import('@/services/api');
      const weddingDataArray = await api.getWeddingByToken(token);

      if (!weddingDataArray || weddingDataArray.length === 0) {
        setWeddingState(null);
        return;
      }

      const weddingData = weddingDataArray[0];

      // Fetch events
      const eventsData = await api.getWeddingEvents(weddingData.id);

      // Transform to WeddingDetails format
      const events: WeddingEvent[] = (eventsData || []).map((e: any) => ({
        id: e.id,
        type: e.event_type as WeddingEvent['type'],
        customName: e.custom_name || undefined,
        date: new Date(e.event_date),
        time: e.event_time,
        venue: e.venue || undefined,
        description: e.description || undefined,
      }));

      const weddingDetails: WeddingDetails = {
        id: weddingData.id,
        brideName: weddingData.bride_name,
        groomName: weddingData.groom_name,
        weddingDate: new Date(weddingData.wedding_date),
        venue: weddingData.venue,
        bridePhoto: weddingData.bride_photo || undefined,
        groomPhoto: weddingData.groom_photo || undefined,
        brideParents: weddingData.bride_parents || undefined,
        groomParents: weddingData.groom_parents || undefined,
        rsvpPhone: weddingData.rsvp_phone || undefined,
        rsvpEmail: weddingData.rsvp_email || undefined,
        customMessage: weddingData.custom_message || undefined,
        shareToken: token, // Ensure token is preserved
        events,
        createdAt: new Date(), // API might not return this, use current or update API
      };

      setWeddingState(weddingDetails);
    } catch (error) {
      console.error("Failed to fetch public wedding", error);
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchPublicWedding to context (we'll need to update the interface)


  useEffect(() => {
    fetchWedding();
  }, [fetchWedding]);

  const saveWedding = async (weddingData: WeddingDetails) => {
    if (!user) return;

    try {
      // Ensure shareToken exists
      const shareToken = weddingData.shareToken || crypto.randomUUID();

      // Upsert wedding
      const { data: savedWedding, error: weddingError } = await supabase
        .from('weddings')
        .upsert({
          id: weddingData.id,
          user_id: user.id,
          bride_name: weddingData.brideName,
          groom_name: weddingData.groomName,
          wedding_date: weddingData.weddingDate.toISOString(),
          venue: weddingData.venue,
          bride_photo: weddingData.bridePhoto || null,
          groom_photo: weddingData.groomPhoto || null,
          bride_parents: weddingData.brideParents || null,
          groom_parents: weddingData.groomParents || null,
          rsvp_phone: weddingData.rsvpPhone || null,
          rsvp_email: weddingData.rsvpEmail || null,
          custom_message: weddingData.customMessage || null,
          share_token: shareToken,
        })
        .select()
        .single();

      if (weddingError) throw weddingError;

      // Delete existing events and insert new ones
      await supabase
        .from('wedding_events')
        .delete()
        .eq('wedding_id', savedWedding.id);

      if (weddingData.events.length > 0) {
        const { error: eventsError } = await supabase
          .from('wedding_events')
          .insert(
            weddingData.events.map((e) => ({
              id: e.id,
              wedding_id: savedWedding.id,
              event_type: e.type,
              custom_name: e.customName || null,
              event_date: e.date instanceof Date ? e.date.toISOString() : e.date,
              event_time: e.time,
              venue: e.venue || null,
              description: e.description || null,
            }))
          );

        if (eventsError) throw eventsError;
      }

      setWeddingState({ ...weddingData, shareToken });
    } catch (error) {
      console.error('Error saving wedding:', error);
      throw error;
    }
  };

  const setWedding = (newWedding: WeddingDetails | null) => {
    setWeddingState(newWedding);
    if (newWedding && user) {
      saveWedding(newWedding);
    }
  };

  const updateWedding = async (updates: Partial<WeddingDetails>) => {
    if (!wedding || !user) return;

    const updatedWedding = { ...wedding, ...updates };
    setWeddingState(updatedWedding);

    try {
      const { error } = await supabase
        .from('weddings')
        .update({
          bride_name: updatedWedding.brideName,
          groom_name: updatedWedding.groomName,
          wedding_date: updatedWedding.weddingDate.toISOString(),
          venue: updatedWedding.venue,
          bride_photo: updatedWedding.bridePhoto || null,
          groom_photo: updatedWedding.groomPhoto || null,
          bride_parents: updatedWedding.brideParents || null,
          groom_parents: updatedWedding.groomParents || null,
          rsvp_phone: updatedWedding.rsvpPhone || null,
          rsvp_email: updatedWedding.rsvpEmail || null,
          custom_message: updatedWedding.customMessage || null,
          share_token: updatedWedding.shareToken || null,
        })
        .eq('id', wedding.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating wedding:', error);
    }
  };

  const addEvent = async (event: WeddingEvent) => {
    if (!wedding || !user) return;

    const events = [...wedding.events, event].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setWeddingState({ ...wedding, events });

    try {
      const { error } = await supabase.from('wedding_events').insert({
        id: event.id,
        wedding_id: wedding.id,
        event_type: event.type,
        custom_name: event.customName || null,
        event_date: event.date instanceof Date ? event.date.toISOString() : event.date,
        event_time: event.time,
        venue: event.venue || null,
        description: event.description || null,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<WeddingEvent>) => {
    if (!wedding || !user) return;

    const events = wedding.events
      .map((e) => (e.id === eventId ? { ...e, ...updates } : e))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setWeddingState({ ...wedding, events });

    try {
      const updatedEvent = events.find((e) => e.id === eventId);
      if (!updatedEvent) return;

      const { error } = await supabase
        .from('wedding_events')
        .update({
          event_type: updatedEvent.type,
          custom_name: updatedEvent.customName || null,
          event_date: updatedEvent.date instanceof Date ? updatedEvent.date.toISOString() : updatedEvent.date,
          event_time: updatedEvent.time,
          venue: updatedEvent.venue || null,
          description: updatedEvent.description || null,
        })
        .eq('id', eventId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const removeEvent = async (eventId: string) => {
    if (!wedding || !user) return;

    setWeddingState({
      ...wedding,
      events: wedding.events.filter((e) => e.id !== eventId),
    });

    try {
      const { error } = await supabase
        .from('wedding_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  const reorderEvents = (events: WeddingEvent[]) => {
    if (!wedding) return;
    setWeddingState({ ...wedding, events });
  };

  const resetWedding = async () => {
    if (!wedding || !user) return;

    try {
      const { error } = await supabase
        .from('weddings')
        .delete()
        .eq('id', wedding.id);

      if (error) throw error;
      setWeddingState(null);
    } catch (error) {
      console.error('Error resetting wedding:', error);
    }
  };

  const isSetupComplete = Boolean(
    wedding?.brideName &&
    wedding?.groomName &&
    wedding?.weddingDate &&
    wedding?.venue
  );

  return (
    <WeddingContext.Provider
      value={{
        wedding,
        setWedding,
        updateWedding,
        addEvent,
        updateEvent,
        removeEvent,
        reorderEvents,
        isSetupComplete,
        resetWedding,
        loading,
        saveWedding,
        fetchPublicWedding,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (context === undefined) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}
