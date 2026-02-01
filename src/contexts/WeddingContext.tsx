import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeddingDetails, WeddingEvent } from '@/types/wedding';

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
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

const STORAGE_KEY = 'wedding-celebration-data';

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [wedding, setWeddingState] = useState<WeddingDetails | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.weddingDate = new Date(parsed.weddingDate);
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.events = parsed.events.map((e: any) => ({
          ...e,
          date: new Date(e.date),
        }));
        setWeddingState(parsed);
      }
    } catch (error) {
      console.error('Error loading wedding data:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isLoaded && wedding) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wedding));
    }
  }, [wedding, isLoaded]);

  const setWedding = (newWedding: WeddingDetails | null) => {
    setWeddingState(newWedding);
  };

  const updateWedding = (updates: Partial<WeddingDetails>) => {
    setWeddingState((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const addEvent = (event: WeddingEvent) => {
    setWeddingState((prev) => {
      if (!prev) return null;
      const events = [...prev.events, event].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      return { ...prev, events };
    });
  };

  const updateEvent = (eventId: string, updates: Partial<WeddingEvent>) => {
    setWeddingState((prev) => {
      if (!prev) return null;
      const events = prev.events
        .map((e) => (e.id === eventId ? { ...e, ...updates } : e))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return { ...prev, events };
    });
  };

  const removeEvent = (eventId: string) => {
    setWeddingState((prev) => {
      if (!prev) return null;
      return { ...prev, events: prev.events.filter((e) => e.id !== eventId) };
    });
  };

  const reorderEvents = (events: WeddingEvent[]) => {
    setWeddingState((prev) => (prev ? { ...prev, events } : null));
  };

  const resetWedding = () => {
    localStorage.removeItem(STORAGE_KEY);
    setWeddingState(null);
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
