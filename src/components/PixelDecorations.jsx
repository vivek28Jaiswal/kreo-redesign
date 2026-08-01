import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const PixelDecorations = () => {
  const containerRef = useRef(null);
  const gridCoverRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // 1. Ambient retro game corner block blinking
      gsap.to('.top-pixel-block', {
        opacity: 0,
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.7,
        stagger: { each: 0.2, from: 'random' },
        ease: 'steps(1)',
      });

      gsap.to('.left-pixel-block', {
        opacity: 0,
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.75,
        stagger: { each: 0.22, from: 'random' },
        ease: 'steps(1)',
      });

      gsap.to('.right-pixel-block', {
        opacity: 0,
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.65,
        stagger: { each: 0.2, from: 'random' },
        ease: 'steps(1)',
      });

      // 2. Full-Screen Pixel Grid Fill Animation for Section 07
      const s07Stage = document.getElementById('s07');
      if (s07Stage && gridCoverRef.current) {
        const coverBlocks = gridCoverRef.current.querySelectorAll('.full-grid-block');

        gsap.fromTo(
          coverBlocks,
          {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1.05,
            opacity: 1,
            stagger: {
              amount: 0.7,
              grid: [10, 14],
              from: 'random',
            },
            ease: 'steps(1)',
            scrollTrigger: {
              trigger: s07Stage,
              start: 'top 75%',
              end: 'top 20%',
              scrub: 0.5,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  // 14 columns x 10 rows = 140 grid blocks
  const gridBlocks = Array.from({ length: 140 });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
      
      {/* --- Full-Screen Pixel Grid Overlay (Fills on Section 07) --- */}
      <div
        ref={gridCoverRef}
        className="absolute inset-0 w-full h-full z-20 grid grid-cols-7 sm:grid-cols-14 grid-rows-10 pointer-events-none"
      >
        {gridBlocks.map((_, idx) => (
          <div key={idx} className="full-grid-block bg-kreo-purple w-full h-full origin-center" />
        ))}
      </div>

      {/* --- Ambient Corner Pixel Decorations --- */}
      {/* Top Center-Left Purple Pixel Block */}
      <div className="absolute top-[16%] left-[37%] md:left-[40%] flex flex-col items-end z-0">
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

      {/* Bottom Left Pixel Stairs */}
      <div className="absolute bottom-0 left-0 flex items-end z-0">
        <div className="flex flex-col">
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
        <div className="flex flex-col">
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
        <div className="flex flex-col">
          <div className="left-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
      </div>

      {/* Bottom Right Pixel Stairs */}
      <div className="absolute bottom-0 right-0 flex items-end z-0">
        <div className="flex flex-col">
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
        <div className="flex flex-col">
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
        <div className="flex flex-col">
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
          <div className="right-pixel-block w-10 h-10 md:w-16 md:h-16 bg-kreo-purple" />
        </div>
      </div>

    </div>
  );
};

export default PixelDecorations;
