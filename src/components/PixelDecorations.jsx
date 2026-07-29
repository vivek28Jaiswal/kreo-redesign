import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PixelDecorations = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // Game-style: full purple → instantly gone → instantly back (no light purple fade)
      // opacity goes 1 → 0 only, no light purple middle state
      // slow timing like old retro game blink

      gsap.to('.top-pixel-block', {
        opacity: 0,
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.7,
        stagger: {
          each: 0.2,
          from: 'random',
        },
        ease: 'steps(1)',
      });

      gsap.to('.left-pixel-block', {
        opacity: 0,
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.75,
        stagger: {
          each: 0.22,
          from: 'random',
        },
        ease: 'steps(1)',
      });

      gsap.to('.right-pixel-block', {
        opacity: 0,
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.65,
        stagger: {
          each: 0.2,
          from: 'random',
        },
        ease: 'steps(1)',
      });

    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* --- 1. Top Center-Left Purple Pixel Block (No Gap) --- */}
      <div className="absolute top-[16%] left-[37%] md:left-[40%] flex flex-col items-end">
        <div className="flex">
          <div className="top-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="top-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
        <div className="flex">
          <div className="top-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="top-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="top-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
      </div>

      {/* --- 2. Bottom Left Pixel Stairs (No Gap) --- */}
      <div className="absolute bottom-0 left-0 flex items-end">
        {/* Column 1 (Tallest - 4 blocks) */}
        <div className="flex flex-col">
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
        {/* Column 2 (Medium - 2 blocks) */}
        <div className="flex flex-col">
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
        {/* Column 3 (Shortest - 1 block) */}
        <div className="flex flex-col">
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
      </div>

      {/* --- 3. Bottom Right Pixel Stairs (No Gap) --- */}
      <div className="absolute bottom-0 right-0 flex items-end">
        {/* Column 1 (Shortest - 1 block) */}
        <div className="flex flex-col">
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
        {/* Column 2 (Tallest - 4 blocks) */}
        <div className="flex flex-col">
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
        {/* Column 3 (Medium - 2 blocks) */}
        <div className="flex flex-col">
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
      </div>

    </div>
  );
};

export default PixelDecorations;
