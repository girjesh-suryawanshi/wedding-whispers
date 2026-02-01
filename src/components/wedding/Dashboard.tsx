import React, { useState } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { CountdownDisplay } from './CountdownDisplay';
import { EventTimeline } from './EventTimeline';
import { InvitationCard } from './InvitationCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarDays, 
  Sparkles, 
  FileText, 
  Settings,
  Heart,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function Dashboard() {
  const { wedding, resetWedding } = useWedding();
  const [activeTab, setActiveTab] = useState('countdown');

  if (!wedding) return null;

  return (
    <div className="min-h-screen bg-gradient-blush pattern-floral">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" fill="currentColor" />
              </div>
              <div>
                <h1 className="font-display text-lg text-foreground leading-tight">
                  {wedding.brideName} & {wedding.groomName}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(wedding.weddingDate), "MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Over?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all your wedding data including events and settings. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetWedding} className="bg-destructive text-destructive-foreground">
                    Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
            <TabsTrigger 
              value="countdown" 
              className="flex flex-col sm:flex-row items-center gap-1.5 py-3 data-[state=active]:bg-background"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Countdown</span>
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className="flex flex-col sm:flex-row items-center gap-1.5 py-3 data-[state=active]:bg-background"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Events</span>
            </TabsTrigger>
            <TabsTrigger 
              value="invitation"
              className="flex flex-col sm:flex-row items-center gap-1.5 py-3 data-[state=active]:bg-background"
            >
              <FileText className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Invitation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="countdown" className="animate-fade-in">
            <CountdownDisplay />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="card-royal text-center">
                <p className="text-3xl font-display text-primary">{wedding.events.length}</p>
                <p className="text-sm text-muted-foreground">Events Planned</p>
              </div>
              <div className="card-royal text-center">
                <p className="text-3xl font-display text-primary">
                  {wedding.venue.split(',')[0]}
                </p>
                <p className="text-sm text-muted-foreground">Venue</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="animate-fade-in">
            <EventTimeline />
          </TabsContent>

          <TabsContent value="invitation" className="animate-fade-in">
            <InvitationCard />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Made with <Heart className="w-3 h-3 inline text-primary" fill="currentColor" /> for your special day
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-hindi">
          शुभ विवाह 💍
        </p>
      </footer>
    </div>
  );
}
