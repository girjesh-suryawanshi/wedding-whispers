export type TemplateStyle = 'rajasthani' | 'royalBlue' | 'mughal' | 'garden';

export interface TemplateConfig {
  id: TemplateStyle;
  name: string;
  description: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  textColor: string;
  secondaryTextColor: string;
  decorativeColor: string;
  fontStyle: 'traditional' | 'script' | 'elegant';
}

export const TEMPLATE_CONFIGS: Record<TemplateStyle, TemplateConfig> = {
  rajasthani: {
    id: 'rajasthani',
    name: 'Rajasthani',
    description: 'Traditional maroon & gold with royal arch',
    bgGradient: 'bg-gradient-to-b from-amber-100 via-yellow-50 to-amber-100',
    borderColor: 'border-amber-600',
    accentColor: 'text-amber-800',
    textColor: 'text-amber-900',
    secondaryTextColor: 'text-amber-700',
    decorativeColor: 'text-red-800',
    fontStyle: 'traditional',
  },
  royalBlue: {
    id: 'royalBlue',
    name: 'Royal Blue',
    description: 'Elegant navy blue with floral accents',
    bgGradient: 'bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950',
    borderColor: 'border-blue-400/30',
    accentColor: 'text-blue-200',
    textColor: 'text-white',
    secondaryTextColor: 'text-blue-300',
    decorativeColor: 'text-blue-400',
    fontStyle: 'script',
  },
  mughal: {
    id: 'mughal',
    name: 'Mughal',
    description: 'Soft cream with Mughal arch design',
    bgGradient: 'bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100',
    borderColor: 'border-amber-400',
    accentColor: 'text-amber-800',
    textColor: 'text-amber-900',
    secondaryTextColor: 'text-amber-700',
    decorativeColor: 'text-rose-600',
    fontStyle: 'elegant',
  },
  garden: {
    id: 'garden',
    name: 'Garden',
    description: 'Light floral with hanging blooms',
    bgGradient: 'bg-gradient-to-b from-rose-50 via-white to-green-50',
    borderColor: 'border-green-300',
    accentColor: 'text-green-800',
    textColor: 'text-gray-800',
    secondaryTextColor: 'text-gray-600',
    decorativeColor: 'text-rose-500',
    fontStyle: 'script',
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATE_CONFIGS);
