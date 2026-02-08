import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWedding } from '@/contexts/WeddingContext';
import { InvitationPreview } from '@/components/wedding/invitation/InvitationPreview';
import { Loader2, Heart } from 'lucide-react';
import { TemplateStyle, TEMPLATE_LIST } from '@/components/wedding/invitation/templateConfig';
import { WeddingEnvelope } from '@/components/wedding/invitation/WeddingEnvelope';

type Language = 'english' | 'hindi' | 'bilingual';

export default function PublicInvitation() {
  const { shareToken } = useParams<{ shareToken: string }>();
  // Use the context instead of local state/supabase
  const { wedding, setWedding, fetchPublicWedding, loading: contextLoading } = useWedding();
  const [error, setError] = useState<string | null>(null);


  const [hasOpened, setHasOpened] = useState(false);

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
    <>
      {!hasOpened && (
        <WeddingEnvelope
          wedding={wedding}
          onOpenComplete={() => setHasOpened(true)}
        />
      )}

      <div className={`min-h-screen bg-gradient-blush py-8 px-4 transition-opacity duration-1000 ${hasOpened ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl text-foreground">
              {wedding.brideName} & {wedding.groomName}
            </h1>
            <p className="text-sm text-muted-foreground">Wedding Invitation</p>
          </div>

          {/* Invitation Preview - Enforced Theme/Language */}
          <div className="mt-8">
            <InvitationPreview
              wedding={wedding}
              template={(wedding.template as any) || 'garden'}
              language={(wedding.language as any) || 'english'}
            />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Created with ❤️ using Wedding Invitation Maker
          </p>
        </div>
      </div>
    </>
  );
}