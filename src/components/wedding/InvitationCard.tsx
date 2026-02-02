import React, { useState, useRef } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplateStyle, TEMPLATE_LIST } from './invitation/templateConfig';
import { InvitationPreview } from './invitation/InvitationPreview';

type Language = 'english' | 'hindi' | 'bilingual';

export function InvitationCard() {
  const { wedding } = useWedding();
  const [language, setLanguage] = useState<Language>('bilingual');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('rajasthani');
  const cardRef = useRef<HTMLDivElement>(null);

  if (!wedding) return null;

  const handleDownload = async () => {
    alert('Download feature will generate a high-quality PNG image of your invitation card.');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${wedding.brideName} & ${wedding.groomName} Wedding Invitation`,
          text: `You are cordially invited to the wedding of ${wedding.brideName} & ${wedding.groomName}`,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl text-foreground">Wedding Invitation</h2>
        <p className="text-sm text-muted-foreground">Choose a template and customize your invitation</p>
      </div>

      {/* Template Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Select Template</label>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATE_LIST.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-all",
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50"
              )}
            >
              <p className="font-medium text-sm text-foreground">{template.name}</p>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Language Tabs */}
      <Tabs value={language} onValueChange={(v) => setLanguage(v as Language)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="hindi">हिंदी</TabsTrigger>
          <TabsTrigger value="bilingual">Bilingual</TabsTrigger>
        </TabsList>

        <TabsContent value={language} className="mt-4">
          <InvitationPreview
            wedding={wedding}
            template={selectedTemplate}
            language={language}
            cardRef={cardRef}
          />
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleDownload} className="flex-1 btn-royal">
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Download as PNG for WhatsApp • PDF print support coming soon
      </p>
    </div>
  );
}
