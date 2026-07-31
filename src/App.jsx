import React, { useState, useCallback } from 'react';
import HeroSection from './components/HeroSection';
import FullscreenLoader from './components/FullscreenLoader';

function App() {
  const [isAssetReady, setIsAssetReady] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleModelLoaded = useCallback(() => {
    setIsAssetReady(true);
  }, []);

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  return (
    <main className="w-full min-h-screen font-montreal bg-white relative">
      {/* Premium Fullscreen Brand Loader */}
      <FullscreenLoader isAssetReady={isAssetReady} onReveal={handleReveal} />

      {/* Pre-rendered Homepage (mounted underneath immediately) */}
      <HeroSection onModelLoaded={handleModelLoaded} isRevealed={isRevealed} />
    </main>
  );
}

export default App;
