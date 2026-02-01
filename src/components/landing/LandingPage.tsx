import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, CalendarDays, Download, Globe } from 'lucide-react';
import heroImage from '@/assets/hero-wedding-bg.jpg';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
        </div>

        {/* Decorative Floating Elements */}
        <div className="absolute top-20 left-10 animate-float opacity-60">
          <Sparkles className="w-8 h-8 text-secondary" />
        </div>
        <div className="absolute top-40 right-12 animate-float opacity-50" style={{ animationDelay: '-2s' }}>
          <Heart className="w-6 h-6 text-accent" fill="currentColor" />
        </div>
        <div className="absolute bottom-32 left-16 animate-float opacity-40" style={{ animationDelay: '-4s' }}>
          <Sparkles className="w-5 h-5 text-secondary" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary-foreground/20 animate-fade-in">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-primary-foreground">Create Your Wedding Celebration</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary-foreground mb-4 animate-fade-in-up leading-tight">
            Your Perfect Wedding
            <span className="block text-secondary mt-2">Starts Here</span>
          </h1>

          {/* Hindi Subtext */}
          <p className="font-hindi text-xl text-primary-foreground/80 mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            शुभ विवाह • Shubh Vivah
          </p>

          {/* Description */}
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Create stunning countdown images, manage your events, and generate beautiful wedding invitations in Hindi, English, or both.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/create">
              <Button className="btn-gold text-lg h-14 px-10 text-foreground font-semibold">
                <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                Create Your Wedding
              </Button>
            </Link>
            <p className="text-primary-foreground/50 text-sm mt-4">
              Free • No login required • Takes 3 minutes
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-blush pattern-floral">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
              Everything for Your Special Day
            </h2>
            <p className="text-muted-foreground">
              Plan, share, and celebrate with our complete wedding toolkit
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card-royal group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Daily Countdown</h3>
              <p className="text-muted-foreground text-sm">
                Beautiful WhatsApp-ready countdown images that update automatically every day.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-royal group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CalendarDays className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Event Scheduler</h3>
              <p className="text-muted-foreground text-sm">
                Organize all ceremonies - Haldi, Sangeet, Wedding, Reception with timeline view.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-royal group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Bilingual Invites</h3>
              <p className="text-muted-foreground text-sm">
                Generate elegant invitation cards in Hindi, English, or both languages combined.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-royal group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Easy Sharing</h3>
              <p className="text-muted-foreground text-sm">
                Download images optimized for WhatsApp Status (1080×1920) and print-ready PDFs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-royal group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-primary" fill="currentColor" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Beautiful Templates</h3>
              <p className="text-muted-foreground text-sm">
                Traditional, Elegant, and Royal designs with authentic Indian wedding aesthetics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-royal group hover:-translate-y-1 transition-transform duration-300 bg-gradient-royal text-primary-foreground">
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-display text-xl mb-2">Start Free</h3>
              <p className="text-primary-foreground/80 text-sm">
                No login required. Create your wedding celebration in under 3 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-royal text-center pattern-mandala">
        <div className="max-w-lg mx-auto relative z-10">
          <Sparkles className="w-8 h-8 text-secondary mx-auto mb-4" />
          <h2 className="font-display text-3xl text-primary-foreground mb-4">
            Ready to Begin?
          </h2>
          <p className="text-primary-foreground/80 mb-8 font-hindi text-lg">
            आपके शुभ विवाह की शुभकामनाएं ✨
          </p>
          <Link to="/create">
            <Button className="btn-gold text-foreground h-14 px-10 font-semibold">
              Create Your Wedding Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-foreground/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-primary" fill="currentColor" />
          <span className="text-sm text-muted-foreground">Wedding Celebration</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Made with love for your special day
        </p>
      </footer>
    </div>
  );
}
