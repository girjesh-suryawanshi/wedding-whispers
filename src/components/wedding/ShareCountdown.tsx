import React, { useState } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Share2, Copy, Check, Timer } from 'lucide-react';
import { toast } from 'sonner';

interface ShareCountdownProps {
  shareToken?: string;
}

export function ShareCountdown({ shareToken }: ShareCountdownProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const countdownUrl = shareToken 
    ? `${window.location.origin}/countdown/${shareToken}`
    : null;

  const handleCopy = async () => {
    if (!countdownUrl) return;
    
    try {
      await navigator.clipboard.writeText(countdownUrl);
      setCopied(true);
      toast.success('Countdown link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (!countdownUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wedding Countdown',
          text: 'Check out our live wedding countdown! 💕',
          url: countdownUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  if (!shareToken) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <Timer className="w-4 h-4" />
          Share Countdown
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary" />
            Share Live Countdown
          </DialogTitle>
          <DialogDescription>
            Share this link with guests to view a live countdown to your wedding with daily changing themes!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* URL Display */}
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-muted rounded-lg text-sm break-all">
              {countdownUrl}
            </div>
            <Button 
              size="icon" 
              variant="outline"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleShare}
              className="flex-1 gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </Button>
          </div>

          {/* Features Note */}
          <div className="bg-accent/30 rounded-lg p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">✨ Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Live countdown updates every second</li>
              <li>Theme changes daily for fresh look</li>
              <li>No login required for guests</li>
              <li>Shows bride & groom photos</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
