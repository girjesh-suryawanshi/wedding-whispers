import React from 'react';
import { WeddingProvider, useWedding } from '@/contexts/WeddingContext';
import { WeddingSetup } from '@/components/wedding/WeddingSetup';
import { Dashboard } from '@/components/wedding/Dashboard';

function CreateWeddingContent() {
  const { isSetupComplete } = useWedding();

  if (!isSetupComplete) {
    return <WeddingSetup />;
  }

  return <Dashboard />;
}

export default function CreateWedding() {
  return (
    <WeddingProvider>
      <CreateWeddingContent />
    </WeddingProvider>
  );
}
