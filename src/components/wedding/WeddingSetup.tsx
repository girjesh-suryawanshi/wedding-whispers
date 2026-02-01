import React, { useState } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { WeddingDetails } from '@/types/wedding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Heart, Sparkles, ArrowRight, ArrowLeft, User, MapPin, Camera } from 'lucide-react';
import { PhotoUpload } from './PhotoUpload';

type SetupStep = 'couple' | 'photos' | 'date' | 'venue' | 'complete';

export function WeddingSetup() {
  const { setWedding } = useWedding();
  const [step, setStep] = useState<SetupStep>('couple');
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    bridePhoto: undefined as string | undefined,
    groomPhoto: undefined as string | undefined,
    weddingDate: undefined as Date | undefined,
    venue: '',
    brideParents: '',
    groomParents: '',
  });

  const handleComplete = () => {
    if (!formData.weddingDate) return;
    
    const wedding: WeddingDetails = {
      id: crypto.randomUUID(),
      brideName: formData.brideName,
      groomName: formData.groomName,
      bridePhoto: formData.bridePhoto,
      groomPhoto: formData.groomPhoto,
      weddingDate: formData.weddingDate,
      venue: formData.venue,
      brideParents: formData.brideParents,
      groomParents: formData.groomParents,
      events: [
        {
          id: crypto.randomUUID(),
          type: 'wedding',
          date: formData.weddingDate,
          time: '10:00',
          venue: formData.venue,
        }
      ],
      createdAt: new Date(),
    };
    
    setWedding(wedding);
  };

  const canProceed = () => {
    switch (step) {
      case 'couple':
        return formData.brideName.trim() && formData.groomName.trim();
      case 'photos':
        return true; // Photos are optional
      case 'date':
        return formData.weddingDate;
      case 'venue':
        return formData.venue.trim();
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (step === 'couple') setStep('photos');
    else if (step === 'photos') setStep('date');
    else if (step === 'date') setStep('venue');
    else if (step === 'venue') handleComplete();
  };

  const prevStep = () => {
    if (step === 'photos') setStep('couple');
    else if (step === 'date') setStep('photos');
    else if (step === 'venue') setStep('date');
  };

  const stepNumber = step === 'couple' ? 1 : step === 'photos' ? 2 : step === 'date' ? 3 : 4;

  return (
    <div className="min-h-screen bg-gradient-blush pattern-floral flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            Create Your Wedding
          </h1>
          <p className="text-muted-foreground">
            शुभ विवाह • Shubh Vivah
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                num === stepNumber
                  ? "bg-primary text-primary-foreground shadow-soft scale-110"
                  : num < stepNumber
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {num < stepNumber ? '✓' : num}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card-royal animate-scale-in">
          {/* Step: Couple Names */}
          {step === 'couple' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Sparkles className="w-6 h-6 text-secondary mx-auto mb-2" />
                <h2 className="font-display text-xl text-foreground">The Beautiful Couple</h2>
                <p className="text-sm text-muted-foreground mt-1">Enter the names of the bride and groom</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brideName" className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4 text-primary" />
                    Bride's Name / वधू का नाम
                  </Label>
                  <Input
                    id="brideName"
                    placeholder="Enter bride's name"
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    className="h-12 text-lg border-2 border-border focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex items-center justify-center py-2">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groomName" className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4 text-primary" />
                    Groom's Name / वर का नाम
                  </Label>
                  <Input
                    id="groomName"
                    placeholder="Enter groom's name"
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                    className="h-12 text-lg border-2 border-border focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Photos */}
          {step === 'photos' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Camera className="w-6 h-6 text-secondary mx-auto mb-2" />
                <h2 className="font-display text-xl text-foreground">Beautiful Memories</h2>
                <p className="text-sm text-muted-foreground mt-1">Add photos for your invitation cards (optional)</p>
              </div>

              <div className="flex justify-center gap-8">
                <PhotoUpload
                  label="Bride"
                  sublabel="वधू"
                  value={formData.bridePhoto}
                  onChange={(photo) => setFormData({ ...formData, bridePhoto: photo })}
                />
                <PhotoUpload
                  label="Groom"
                  sublabel="वर"
                  value={formData.groomPhoto}
                  onChange={(photo) => setFormData({ ...formData, groomPhoto: photo })}
                />
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Photos will appear on your invitation cards • Max 5MB each
              </p>
            </div>
          )}

          {/* Step: Wedding Date */}
          {step === 'date' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CalendarIcon className="w-6 h-6 text-secondary mx-auto mb-2" />
                <h2 className="font-display text-xl text-foreground">The Auspicious Date</h2>
                <p className="text-sm text-muted-foreground mt-1">When is the wedding?</p>
              </div>

              <div className="flex justify-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-14 justify-start text-left font-normal border-2",
                        !formData.weddingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                      {formData.weddingDate ? (
                        <span className="text-lg">{format(formData.weddingDate, "PPP")}</span>
                      ) : (
                        <span>Select wedding date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={formData.weddingDate}
                      onSelect={(date) => setFormData({ ...formData, weddingDate: date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {formData.weddingDate && (
                <div className="text-center p-4 bg-accent/30 rounded-lg animate-fade-in">
                  <p className="font-hindi text-primary text-lg">
                    शुभ दिवस
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(formData.weddingDate, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step: Venue */}
          {step === 'venue' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <MapPin className="w-6 h-6 text-secondary mx-auto mb-2" />
                <h2 className="font-display text-xl text-foreground">The Venue</h2>
                <p className="text-sm text-muted-foreground mt-1">Where will the celebration be held?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  Wedding Venue / विवाह स्थल
                </Label>
                <Input
                  id="venue"
                  placeholder="Enter venue name and address"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="h-12 text-lg border-2 border-border focus:border-primary transition-colors"
                />
              </div>

              {/* Optional: Parents Names */}
              <div className="pt-4 border-t border-border space-y-4">
                <p className="text-sm text-muted-foreground text-center">Optional: Parents' Names</p>
                
                <div className="space-y-2">
                  <Label htmlFor="brideParents" className="text-sm font-medium">
                    Bride's Parents / वधू के माता-पिता
                  </Label>
                  <Input
                    id="brideParents"
                    placeholder="Mr. & Mrs. Sharma"
                    value={formData.brideParents}
                    onChange={(e) => setFormData({ ...formData, brideParents: e.target.value })}
                    className="border-2 border-border focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groomParents" className="text-sm font-medium">
                    Groom's Parents / वर के माता-पिता
                  </Label>
                  <Input
                    id="groomParents"
                    placeholder="Mr. & Mrs. Verma"
                    value={formData.groomParents}
                    onChange={(e) => setFormData({ ...formData, groomParents: e.target.value })}
                    className="border-2 border-border focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step !== 'couple' ? (
              <Button
                variant="ghost"
                onClick={prevStep}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}
            
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn-royal min-w-32"
            >
              {step === 'venue' ? (
                <>
                  Create Wedding
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your wedding details are saved locally on this device
        </p>
      </div>
    </div>
  );
}
