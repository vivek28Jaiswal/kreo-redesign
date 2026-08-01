import React, { useState, useCallback, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './components/HeroSection';
import FullscreenLoader from './components/FullscreenLoader';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isAssetReady, setIsAssetReady] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll for buttery smooth inertia scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

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
