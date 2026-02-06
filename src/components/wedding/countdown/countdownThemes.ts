// Daily rotating themes with traditional textures and floral borders
export interface CountdownTheme {
  id: string;
  name: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  pattern: string;
  texture: string;
  floralBorder: string;
}

export const COUNTDOWN_THEMES: CountdownTheme[] = [
  {
    id: 'royal-maroon',
    name: 'Royal Maroon',
    gradient: 'bg-gradient-to-br from-maroon via-maroon-light to-gold',
    textColor: 'text-primary-foreground',
    accentColor: 'text-secondary',
    borderColor: 'border-gold/30',
    pattern: 'pattern-mandala',
    texture: 'texture-silk',
    floralBorder: 'floral-border-gold',
  },
  {
    id: 'golden-sunset',
    name: 'Golden Sunset',
    gradient: 'bg-gradient-to-br from-gold via-coral to-maroon',
    textColor: 'text-primary-foreground',
    accentColor: 'text-cream',
    borderColor: 'border-cream/30',
    pattern: 'pattern-floral',
    texture: 'texture-brocade',
    floralBorder: 'floral-border-cream',
  },
  {
    id: 'blush-elegance',
    name: 'Blush Elegance',
    gradient: 'bg-gradient-to-br from-blush via-accent to-maroon-light',
    textColor: 'text-maroon-dark',
    accentColor: 'text-maroon',
    borderColor: 'border-maroon/20',
    pattern: 'pattern-floral',
    texture: 'texture-chiffon',
    floralBorder: 'floral-border-maroon',
  },
  {
    id: 'emerald-gold',
    name: 'Emerald & Gold',
    gradient: 'bg-gradient-to-br from-emerald via-emerald to-gold',
    textColor: 'text-primary-foreground',
    accentColor: 'text-gold-light',
    borderColor: 'border-gold/30',
    pattern: 'pattern-mandala',
    texture: 'texture-velvet',
    floralBorder: 'floral-border-gold',
  },
  {
    id: 'midnight-gold',
    name: 'Midnight Gold',
    gradient: 'bg-gradient-to-br from-maroon-dark via-maroon to-gold-dark',
    textColor: 'text-gold-light',
    accentColor: 'text-gold',
    borderColor: 'border-gold/40',
    pattern: 'pattern-mandala',
    texture: 'texture-silk',
    floralBorder: 'floral-border-gold',
  },
  {
    id: 'coral-dream',
    name: 'Coral Dream',
    gradient: 'bg-gradient-to-br from-coral via-blush-dark to-gold',
    textColor: 'text-maroon-dark',
    accentColor: 'text-maroon',
    borderColor: 'border-maroon/20',
    pattern: 'pattern-floral',
    texture: 'texture-brocade',
    floralBorder: 'floral-border-maroon',
  },
  {
    id: 'cream-luxury',
    name: 'Cream Luxury',
    gradient: 'bg-gradient-to-br from-cream via-blush to-gold-light',
    textColor: 'text-maroon',
    accentColor: 'text-gold-dark',
    borderColor: 'border-gold/30',
    pattern: 'pattern-floral',
    texture: 'texture-chiffon',
    floralBorder: 'floral-border-gold',
  },
];

export function getTodayTheme(): CountdownTheme {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return COUNTDOWN_THEMES[dayOfYear % COUNTDOWN_THEMES.length];
}
