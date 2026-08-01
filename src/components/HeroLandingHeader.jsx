import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroLandingHeader — Initial Landing Title & Model Description.
 * Visible on screen load alongside the 3D model, softly dissolves out as user begins scrolling.
 */
const HeroLandingHeader = ({ isRevealed }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!isRevealed) {
      gsap.set(el, { opacity: 0, filter: 'blur(12px)' });
      return;
    }

    // Reveal entrance when page loader finishes
    gsap.to(el, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      delay: 0.6,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    });

    // Dissolve out when scrolling past hero view into chapter 01
    const journeyContainer = document.getElementById('product-journey-container');
    if (!journeyContainer) return;

    const st = ScrollTrigger.create({
      trigger: journeyContainer,
      start: 'top top',
      end: 'top -150px',
      onLeave: () => {
        gsap.to(el, {
          opacity: 0,
          filter: 'blur(10px)',
          duration: 0.45,
          ease: 'cubic-bezier(0.4, 0, 1, 1)',
        });
      },
      onEnterBack: () => {
        gsap.to(el, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      },
    });

    return () => st.kill();
  }, [isRevealed]);

  return (
    <div
      ref={containerRef}
      className="fixed top-1/2 left-8 md:left-20 lg:left-32 -translate-y-1/2 z-30 max-w-sm md:max-w-md pointer-events-none select-none opacity-0"
    >
      {/* Model Name / Hero Title */}
      <h1 className="text-4xl md:text-5xl xl:text-6xl leading-[1.06] tracking-tight mb-4 text-neutral-900">
        <span className="block font-medium text-neutral-900">Kreo</span>
        <span className="block font-medium text-neutral-900">Hive 75.</span>
      </h1>

      {/* Sub-paragraph Description */}
      <p className="text-sm md:text-base text-neutral-500 font-normal leading-[1.7] max-w-xs md:max-w-sm">
        A custom mechanical keyboard engineered for uncompromised tactile precision. Featuring factory-lubed Graywood switches, gasket-mount acoustics, and CNC aluminum construction.
      </p>
    </div>
  );
};

export default HeroLandingHeader;
