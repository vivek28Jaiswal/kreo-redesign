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
    // 1. Reset scroll position to top 0 on reload / initial page load
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Initialize Lenis smooth scroll for buttery smooth inertia scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Ensure immediate reset to top 0 on Lenis mount
    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Smooth Scroll to Top helper for ESC trigger
    const scrollToTop = () => {
      lenis.scrollTo(0, { duration: 1.2 });
    };

    window.__scrollToTop = scrollToTop;

    // 2. Global keyboard listener for ESC key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        scrollToTop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete window.__scrollToTop;
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
