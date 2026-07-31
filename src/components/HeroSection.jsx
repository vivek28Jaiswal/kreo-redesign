import React from 'react';
import AnnouncementBar from './AnnouncementBar';
import HeaderControls from './HeaderControls';
import PixelDecorations from './PixelDecorations';
import HeroContent from './HeroContent';
import KeyboardShowcase from './KeyboardShowcase';
import BottomNavDock from './BottomNavDock';
import HeroGradient from './HeroGradient';

const HeroSection = ({ onModelLoaded, isRevealed }) => {
  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-hidden select-none">

      {/* ── WebGL Aurora Mesh Gradient Background ── */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none">
        <HeroGradient className="w-full h-full" />
      </div> */}

      {/* 1. Top Announcement Marquee Bar */}
      <AnnouncementBar />

      {/* 2. Header Action Controls (Esc badge, Sound & Menu buttons) */}
      <HeaderControls />

      {/* 3. Main Hero Canvas Area */}
      <div className="relative flex-1 w-full flex items-center justify-center py-6 md:py-12">
        {/* Decorative Pixel Grid Art */}
        <PixelDecorations />

        {/* Hero Text & Price Content */}
        {/* <HeroContent /> */}

        {/* Centered Keyboard Hero Asset */}
        <KeyboardShowcase onModelLoaded={onModelLoaded} isRevealed={isRevealed} />
      </div>

      {/* 4. Bottom Floating Action Dock */}
      <BottomNavDock isRevealed={isRevealed} />
    </section>
  );
};

export default HeroSection;
