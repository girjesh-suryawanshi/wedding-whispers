import React, { useState } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Copy, Check, Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function generateShareToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function ShareInvitation() {
  const { wedding, updateWedding } = useWedding();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!wedding) return null;

  const shareToken = (wedding as any).shareToken;
  const shareUrl = shareToken
    ? `${window.location.origin}/invitation/${shareToken}`
    : null;

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const newToken = generateShareToken();

      // For local dev, we might not have a backend endpoint for this yet
      // but we should eventually add one.
      // For now, let's update the context local state and maybe log it.
      // TODO: Implement /api/weddings/:id/token endpoint

      console.log('Generated new token:', newToken);

      // Update local state (Optimistic update)
      (wedding as any).shareToken = newToken;
      updateWedding({ ...wedding, shareToken: newToken });

      toast.success('Share link generated! (Local Only)');
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate share link');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (!shareUrl || !navigator.share) return;

    try {
      await navigator.share({
        title: `${wedding.groomName} & ${wedding.brideName} Wedding Invitation`,
        text: `You are cordially invited to the wedding of ${wedding.groomName} & ${wedding.brideName}`,
        url: shareUrl,
      });
    } catch (error) {
      // User cancelled or share failed
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Link2 className="w-4 h-4" />
          Share Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Wedding Invitation</DialogTitle>
          <DialogDescription>
            Generate a public link that guests can view without logging in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {shareUrl ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="share-link">Your shareable link</Label>
                <div className="flex gap-2">
                  <Input
                    id="share-link"
                    value={shareUrl}
                    readOnly
                    className="text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCopy} className="flex-1 gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
                {navigator.share && (
                  <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                )}
              </div>

              <Button
                onClick={handleGenerateLink}
                variant="ghost"
                className="w-full text-sm"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Generate New Link
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Create a shareable link for your wedding invitation that anyone can view.
              </p>
              <Button
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                Generate Share Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}