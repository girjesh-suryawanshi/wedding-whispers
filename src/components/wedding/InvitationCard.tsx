import React, { useState, useRef } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Phone, Mail, MessageSquare, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplateStyle, TEMPLATE_LIST } from './invitation/templateConfig';
import { InvitationPreview } from './invitation/InvitationPreview';
import { ShareInvitation } from './ShareInvitation';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

type Language = 'english' | 'hindi' | 'bilingual';

export function InvitationCard() {
  const { wedding, updateWedding } = useWedding();
  const [language, setLanguage] = useState<Language>('bilingual');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('rajasthani');
  const [showCustomization, setShowCustomization] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!wedding) return null;

  const handleDownload = async () => {
    if (!cardRef.current) {
      toast.error('Unable to capture invitation card');
      return;
    }

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${wedding.brideName}-${wedding.groomName}-invitation.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast.success('Invitation downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
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

      {/* Customization Panel */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setShowCustomization(!showCustomization)}
          className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm text-foreground">RSVP & Custom Message</span>
          </div>
          {showCustomization ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        
        {showCustomization && (
          <div className="p-4 space-y-4 border-t border-border">
            {/* RSVP Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rsvpPhone" className="flex items-center gap-2 text-sm">
                  <Phone className="w-3 h-3" />
                  RSVP Phone
                </Label>
                <Input
                  id="rsvpPhone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={wedding.rsvpPhone || ''}
                  onChange={(e) => updateWedding({ rsvpPhone: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rsvpEmail" className="flex items-center gap-2 text-sm">
                  <Mail className="w-3 h-3" />
                  RSVP Email
                </Label>
                <Input
                  id="rsvpEmail"
                  type="email"
                  placeholder="rsvp@wedding.com"
                  value={wedding.rsvpEmail || ''}
                  onChange={(e) => updateWedding({ rsvpEmail: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="customMessage" className="text-sm">
                Custom Message (optional)
              </Label>
              <Textarea
                id="customMessage"
                placeholder="Add a personal touch... e.g., 'Your presence is the greatest gift we could receive'"
                value={wedding.customMessage || ''}
                onChange={(e) => updateWedding({ customMessage: e.target.value })}
                className="text-sm min-h-[80px] resize-none"
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground text-right">
                {(wedding.customMessage?.length || 0)}/150
              </p>
            </div>
          </div>
        )}
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
        <Button onClick={handleDownload} disabled={isDownloading} className="flex-1 btn-royal">
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isDownloading ? 'Generating...' : 'Download PNG'}
        </Button>
        <ShareInvitation />
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Download as PNG for WhatsApp • Share via link
      </p>
    </div>
  );
}
