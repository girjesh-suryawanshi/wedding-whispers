import React from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { WeddingSetup } from '@/components/wedding/WeddingSetup';
import { Dashboard } from '@/components/wedding/Dashboard';
import { Loader2 } from 'lucide-react';

export default function CreateWedding() {
  const { isSetupComplete, loading } = useWedding();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-blush flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSetupComplete) {
    return <WeddingSetup />;
  }

  return <Dashboard />;
}
