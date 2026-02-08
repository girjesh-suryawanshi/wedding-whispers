export type EventType =
  | 'ring-ceremony'
  | 'haldi'
  | 'mehndi'
  | 'sangeet'
  | 'wedding'
  | 'reception'
  | 'custom';

export interface WeddingEvent {
  id: string;
  type: EventType;
  customName?: string;
  date: Date;
  time: string;
  venue?: string;
  description?: string;
}

export interface WeddingDetails {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: Date;
  venue: string;
  bridePhoto?: string;
  groomPhoto?: string;
  brideParents?: string;
  groomParents?: string;
  rsvpPhone?: string;
  rsvpEmail?: string;
  customMessage?: string;
  template?: string;
  language?: 'english' | 'hindi' | 'bilingual';
  shareToken?: string;
  events: WeddingEvent[];
  createdAt: Date;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  language: 'hindi' | 'english' | 'bilingual';
  style: 'traditional' | 'elegant' | 'royal' | 'modern';
  preview: string;
}

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  eventName: string;
  eventDate: Date;
}

export const EVENT_LABELS: Record<EventType, { english: string; hindi: string; emoji: string }> = {
  'ring-ceremony': { english: 'Ring Ceremony', hindi: 'सगाई', emoji: '💍' },
  'haldi': { english: 'Haldi', hindi: 'हल्दी', emoji: '🌼' },
  'mehndi': { english: 'Mehndi', hindi: 'मेहंदी', emoji: '🌿' },
  'sangeet': { english: 'Sangeet', hindi: 'संगीत', emoji: '🎵' },
  'wedding': { english: 'Wedding', hindi: 'विवाह', emoji: '💒' },
  'reception': { english: 'Reception', hindi: 'स्वागत समारोह', emoji: '🎉' },
  'custom': { english: 'Custom Event', hindi: 'अन्य कार्यक्रम', emoji: '✨' },
};
