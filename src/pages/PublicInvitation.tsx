import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { InvitationPreview } from '@/components/wedding/invitation/InvitationPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Heart } from 'lucide-react';
import { TemplateStyle, TEMPLATE_LIST } from '@/components/wedding/invitation/templateConfig';

type Language = 'english' | 'hindi' | 'bilingual';

export default function PublicInvitation() {
  const { shareToken } = useParams<{ shareToken: string }>();
  // Use the context instead of local state/supabase
  const { wedding, setWedding, fetchPublicWedding, loading: contextLoading } = useWedding();
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateStyle>('rajasthani'); // Default
  const [language, setLanguage] = useState<Language>('bilingual');

  useEffect(() => {
    if (shareToken) {
      fetchPublicWedding(shareToken).catch(() => {
        setError('Failed to load invitation');
      });
    } else {
      setError('Invalid invitation link');
    }
  }, [shareToken, fetchPublicWedding]);

  // Loading state handling
  if (contextLoading && !wedding) {
    return (
      <div className="min-h-screen bg-gradient-blush flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading invitation...</p>
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
            Invitation Not Found
          </h1>
          <p className="text-muted-foreground">
            {error || 'This invitation link may have expired or is invalid.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-blush py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl text-foreground">
            {wedding.brideName} & {wedding.groomName}
          </h1>
          <p className="text-sm text-muted-foreground">Wedding Invitation</p>
        </div>

        {/* Template Selector */}
        <div className="mb-4">
          <div className="flex justify-center gap-2 flex-wrap">
            {TEMPLATE_LIST.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${template === t.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Language Tabs */}
        <Tabs value={language} onValueChange={(v) => setLanguage(v as Language)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="english">English</TabsTrigger>
            <TabsTrigger value="hindi">हिंदी</TabsTrigger>
            <TabsTrigger value="bilingual">Bilingual</TabsTrigger>
          </TabsList>

          <TabsContent value={language}>
            <InvitationPreview
              wedding={wedding}
              template={template}
              language={language}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Created with ❤️ using Wedding Invitation Maker
        </p>
      </div>
    </div>
  );
}