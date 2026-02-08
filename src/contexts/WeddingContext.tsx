import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { WeddingDetails, WeddingEvent } from '@/types/wedding';

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
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { api } = await import('@/services/api');
      const weddingData = await api.getWeddingByUser(user.id);

      if (weddingData) {
        // Fetch events
        const eventsData = await api.getWeddingEvents(weddingData.id);

        // Transform events
        const events: WeddingEvent[] = (eventsData || []).map((e: any) => ({
          id: e.id,
          type: e.event_type as WeddingEvent['type'],
          customName: e.custom_name || undefined,
          date: new Date(e.event_date),
          time: e.event_time,
          venue: e.venue || undefined,
          description: e.description || undefined,
        }));

        setWeddingState({
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
          shareToken: weddingData.share_token,
          events,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error fetching wedding:', error);
    } finally {
      setLoading(false);
    }
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

      // Prepare data for API
      const apiData = {
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
        events: weddingData.events
      };

      // Use API Service
      const { api } = await import('@/services/api');
      await api.saveWedding(apiData);

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
      // Use the centralized saveWedding function to ensure consistency
      // This handles all fields including the new 'template' and 'language'
      // and communicates with the backend API instead of Supabase directly
      await saveWedding(updatedWedding);
    } catch (error) {
      console.error('Error updating wedding:', error);
      // Revert local state on error if needed, but for now just log
    }
  };

  const addEvent = async (event: WeddingEvent) => {
    if (!wedding || !user) return;

    const events = [...wedding.events, event].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Update local state and save to backend
    const updatedWedding = { ...wedding, events };
    setWeddingState(updatedWedding);
    await saveWedding(updatedWedding);
  };

  const updateEvent = async (eventId: string, updates: Partial<WeddingEvent>) => {
    if (!wedding || !user) return;

    const events = wedding.events
      .map((e) => (e.id === eventId ? { ...e, ...updates } : e))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const updatedWedding = { ...wedding, events };
    setWeddingState(updatedWedding);
    await saveWedding(updatedWedding);
  };

  const removeEvent = async (eventId: string) => {
    if (!wedding || !user) return;

    const events = wedding.events.filter((e) => e.id !== eventId);

    const updatedWedding = { ...wedding, events };
    setWeddingState(updatedWedding);
    await saveWedding(updatedWedding);
  };

  const reorderEvents = async (events: WeddingEvent[]) => {
    if (!wedding || !user) return;

    const updatedWedding = { ...wedding, events };
    setWeddingState(updatedWedding);
    await saveWedding(updatedWedding);
  };

  const resetWedding = async () => {
    if (!wedding || !user) return;

    try {
      const { api } = await import('@/services/api');
      await api.deleteWedding(wedding.id);
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
